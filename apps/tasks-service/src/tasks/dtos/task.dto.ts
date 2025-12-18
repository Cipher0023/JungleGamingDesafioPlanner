import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../database/entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content: string;
}

export class AssignTaskDto {
  @IsUUID()
  userId: string;
}
