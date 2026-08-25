import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { GoalsService } from './src/goals/goals.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const goalsService = app.get(GoalsService);
  const prisma = app.get(PrismaService);
  
  // Create a fake user
  const user = await prisma.user.create({
    data: {
      email: `test_${Date.now()}@test.com`,
      password: 'hash',
      fullName: 'Test User',
      isEmailVerified: true
    }
  });

  const userB = await prisma.user.create({
    data: {
      email: `testB_${Date.now()}@test.com`,
      password: 'hash',
      fullName: 'Test User B',
      isEmailVerified: true
    }
  });

  console.log('User created:', user.id);
  
  // Test 1: Create Goal
  const goal = await goalsService.createGoal(user.id, {
    title: 'Test Quran Goal',
    category: 'QURAN',
    startDate: new Date().toISOString(),
    targetDate: new Date(Date.now() + 86400000).toISOString(),
    totalUnits: 604,
    unitLabel: 'pages'
  });
  console.log('Create Result:', goal.progress);
  
  // Test 2: Invalid Create
  try {
     await goalsService.createGoal(user.id, {
      title: 'Bad Goal',
      category: 'QURAN',
      startDate: new Date(Date.now() + 86400000).toISOString(),
      targetDate: new Date().toISOString(), // target before start
      totalUnits: 10,
      unitLabel: 'pages'
    });
  } catch (e) {
    console.log('Invalid Create Error:', e.message);
  }

  // Test 3: Get Active Goal
  const active = await goalsService.getActiveGoal(user.id);
  console.log('Active Goal Title:', active?.title);

  // Test 4: Ownership Protection
  try {
     await goalsService.getGoalById(userB.id, goal.id);
  } catch (e) {
     console.log('Ownership Error:', e.message);
  }

  // Test 5: Prayer Goal
  const prayerGoal = await goalsService.createGoal(user.id, {
    title: 'Fajr Goal',
    category: 'PRAYER',
    prayerTarget: 'FAJR',
    startDate: new Date(Date.now() - 86400000).toISOString(),
    targetDate: new Date(Date.now() + 86400000).toISOString(),
    totalUnits: 40,
    unitLabel: 'days'
  });

  await prisma.prayerLog.create({
    data: {
      userId: user.id,
      prayer: 'FAJR',
      status: 'COMPLETED',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const retrievedPrayerGoal = await goalsService.getGoalById(user.id, prayerGoal.id);
  console.log('Prayer Goal Progress:', retrievedPrayerGoal.progress);

  await app.close();
}

bootstrap();
