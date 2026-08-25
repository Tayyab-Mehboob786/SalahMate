import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { Goal } from '@prisma/client';

export type GoalLifecycleStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  private resolveGoalLifecycle(goal: Goal, isCompleted: boolean, now: Date = new Date()): GoalLifecycleStatus {
    if (isCompleted || goal.isCompleted) {
      return 'COMPLETED';
    }

    const endOfTargetDay = new Date(goal.targetDate);
    endOfTargetDay.setHours(23, 59, 59, 999);

    if (now > endOfTargetDay) {
      return 'EXPIRED';
    }

    return 'ACTIVE';
  }

  private async calculateGoalProgress(goal: Goal, userId: string) {
    let completedUnits = 0;

    if (goal.category === 'PRAYER' && goal.prayerTarget) {
      // Dynamically calculate progress by querying PrayerLog
      completedUnits = await this.prisma.prayerLog.count({
        where: {
          userId: userId,
          prayer: goal.prayerTarget,
          status: 'COMPLETED',
          date: {
            gte: goal.startDate.toISOString().split('T')[0],
            lte: goal.targetDate.toISOString().split('T')[0],
          }
        }
      });
    } else {
      // Non-prayer goals rely on the explicitly tracked integer
      completedUnits = goal.completedUnits;
    }

    const remainingUnits = Math.max(goal.totalUnits - completedUnits, 0);
    // Ensure we don't return infinity or NaN, and cap at 100%
    const progressPercentage = goal.totalUnits > 0 
      ? Math.min(Math.round((completedUnits / goal.totalUnits) * 100), 100)
      : 0;
    const isCompleted = completedUnits >= goal.totalUnits;
    const lifecycleStatus = this.resolveGoalLifecycle(goal, isCompleted);

    return {
      ...goal,
      lifecycleStatus,
      progress: {
        completedUnits,
        totalUnits: goal.totalUnits,
        remainingUnits,
        progressPercentage,
        isCompleted,
      }
    };
  }

  async createGoal(userId: string, dto: CreateGoalDto) {
    const start = new Date(dto.startDate);
    const target = new Date(dto.targetDate);
    
    if (target < start) {
      throw new BadRequestException('targetDate must be later than or equal to startDate');
    }

    const goal = await this.prisma.goal.create({
      data: {
        userId,
        title: dto.title,
        category: dto.category,
        prayerTarget: dto.prayerTarget || null,
        startDate: start,
        targetDate: target,
        totalUnits: dto.totalUnits,
        unitLabel: dto.unitLabel,
        reminderConfig: dto.reminderConfig || null,
        completedUnits: 0,
        isCompleted: false,
      },
    });

    return this.calculateGoalProgress(goal, userId);
  }

  async getGoals(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return Promise.all(goals.map(goal => this.calculateGoalProgress(goal, userId)));
  }

  async getActiveGoal(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    for (const goal of goals) {
      const goalWithProgress = await this.calculateGoalProgress(goal, userId);
      if (goalWithProgress.lifecycleStatus === 'ACTIVE') {
        return goalWithProgress;
      }
    }
    
    return null;
  }

  async getGoalById(userId: string, goalId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return this.calculateGoalProgress(goal, userId);
  }

  async updateGoal(userId: string, goalId: string, dto: UpdateGoalDto) {
    const existing = await this.prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Goal not found');
    }

    if (dto.targetDate) {
      const target = new Date(dto.targetDate);
      const start = new Date(existing.startDate);
      if (target < start) {
        throw new BadRequestException('targetDate must be later than or equal to startDate');
      }
    }

    const updatedGoal = await this.prisma.goal.update({
      where: { id: goalId },
      data: {
        title: dto.title,
        category: dto.category,
        prayerTarget: dto.prayerTarget,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
        totalUnits: dto.totalUnits,
        unitLabel: dto.unitLabel,
        reminderConfig: dto.reminderConfig,
      },
    });

    return this.calculateGoalProgress(updatedGoal, userId);
  }

  async deleteGoal(userId: string, goalId: string) {
    const existing = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Goal not found');
    }

    await this.prisma.goal.delete({
      where: { id: goalId },
    });

    return { message: 'Goal deleted successfully' };
  }

  async logProgress(userId: string, goalId: string, dto: UpdateGoalProgressDto) {
    const goal = await this.prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.category === 'PRAYER') {
      throw new BadRequestException(
        'Prayer goal progress is derived automatically from PrayerLog and cannot be manually updated.',
      );
    }

    const currentProgress = await this.calculateGoalProgress(goal, userId);

    if (currentProgress.lifecycleStatus === 'COMPLETED') {
      throw new BadRequestException('Cannot update progress on an already completed goal');
    }

    if (currentProgress.lifecycleStatus === 'EXPIRED') {
      throw new BadRequestException('Cannot update progress for an expired goal.');
    }

    const newCompletedUnits = Math.min(
      goal.totalUnits,
      goal.completedUnits + dto.increment,
    );
    const isCompleted = newCompletedUnits >= goal.totalUnits;

    const updatedGoal = await this.prisma.goal.update({
      where: { id: goalId },
      data: {
        completedUnits: newCompletedUnits,
        isCompleted,
      },
    });

    return this.calculateGoalProgress(updatedGoal, userId);
  }
}
