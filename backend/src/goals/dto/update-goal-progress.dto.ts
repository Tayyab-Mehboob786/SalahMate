import { IsInt, IsPositive } from 'class-validator';

export class UpdateGoalProgressDto {
  @IsInt()
  @IsPositive()
  increment: number;
}
