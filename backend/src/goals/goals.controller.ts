import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  createGoal(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateGoalDto,
  ) {
    return this.goalsService.createGoal(user.userId, dto);
  }

  @Post(':id/progress')
  logProgress(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalProgressDto,
  ) {
    return this.goalsService.logProgress(user.userId, id, dto);
  }

  @Get()
  getGoals(@CurrentUser() user: { userId: string }) {
    return this.goalsService.getGoals(user.userId);
  }

  @Get('active')
  getActiveGoal(@CurrentUser() user: { userId: string }) {
    return this.goalsService.getActiveGoal(user.userId);
  }

  @Get(':id')
  getGoalById(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.goalsService.getGoalById(user.userId, id);
  }

  @Patch(':id')
  updateGoal(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.goalsService.updateGoal(user.userId, id, dto);
  }

  @Delete(':id')
  deleteGoal(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.goalsService.deleteGoal(user.userId, id);
  }
}
