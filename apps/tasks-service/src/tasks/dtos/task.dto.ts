import {
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../database/entities/task.entity.js';

/**
 * DTO para criação de tarefas
 * Contém todos os campos necessários para criar uma nova tarefa no sistema
 */
export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar autenticação JWT',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Implementar sistema de autenticação usando JWT com refresh tokens',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Prioridade da tarefa',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    default: TaskPriority.MEDIUM,
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Status atual da tarefa',
    enum: TaskStatus,
    example: TaskStatus.TODO,
    default: TaskStatus.TODO,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'UUID do usuário que executará a tarefa',
    example: 'c2079e18-1e6f-4544-b9e9-08d8017aff00',
  })
  @IsUUID()
  @IsOptional()
  executorId?: string;

  @ApiPropertyOptional({
    description: 'Data limite para conclusão da tarefa (ISO 8601)',
    example: '2025-12-25',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

/**
 * DTO para atualização de tarefas
 * Todos os campos são opcionais, apenas os fornecidos serão atualizados
 */
export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Novo título da tarefa',
    example: 'Implementar autenticação JWT - Concluído',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nova descrição da tarefa',
    example: 'Sistema de autenticação implementado com sucesso',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Novo status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.DONE,
  })
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
