import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import {
  Task,
  TaskStatus,
  TaskPriority,
} from '../database/entities/task.entity';
import { Comment } from '../database/entities/comment.entity';
import { TaskAssignment } from '../database/entities/task-assignment.entity';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  AssignTaskDto,
} from './dtos/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(TaskAssignment)
    private assignmentRepository: Repository<TaskAssignment>,
    // Temporarily disabled
    // @Inject('RABBITMQ_SERVICE')
    // private client: ClientProxy,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      status: createTaskDto.status || TaskStatus.TODO,
      createdBy: userId,
      executorId: createTaskDto.executorId || undefined,
      ...(createTaskDto.dueDate && { dueDate: new Date(createTaskDto.dueDate) }),
    });
    
    const saved = await this.taskRepository.save(task);

    // Emit event (temporarily disabled)
    /*
    this.client.emit('task.created', {
      taskId: saved.id,
      title: saved.title,
      createdBy: saved.createdBy,
      timestamp: new Date(),
    });
    */

    return saved;
  }

  async findAll(page = 1, size = 10) {
    const [data, total] = await this.taskRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      relations: ['assignments', 'comments'],
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: { page, size, total, pages: Math.ceil(total / size) },
    };
  }

  async findById(id: string) {
    return this.taskRepository.findOne({
      where: { id },
      relations: ['assignments', 'comments'],
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findById(id);
    if (!task) throw new Error('Task not found');

    const updated = this.taskRepository.merge(task, {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : task.dueDate,
    });

    const result = await this.taskRepository.save(updated);

    /*
    this.client.emit('task.updated', {
      taskId: result.id,
      status: result.status,
      priority: result.priority,
      timestamp: new Date(),
    });
    */

    return result;
  }

  async delete(id: string) {
    await this.taskRepository.delete(id);
    return { message: 'Task deleted' };
  }

  async addComment(
    taskId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    const comment = this.commentRepository.create({
      content: createCommentDto.content,
      authorId: userId,
      taskId,
    });

    const saved = await this.commentRepository.save(comment);

    /*
    this.client.emit('comment.created', {
      commentId: saved.id,
      taskId: saved.taskId,
      authorId: saved.authorId,
      content: saved.content,
      timestamp: new Date(),
    });
    */

    return saved;
  }

  async getComments(taskId: string, page = 1, size = 10) {
    const [data, total] = await this.commentRepository.findAndCount({
      where: { taskId },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: { page, size, total, pages: Math.ceil(total / size) },
    };
  }

  async assignUser(taskId: string, assignTaskDto: AssignTaskDto) {
    const existing = await this.assignmentRepository.findOne({
      where: { taskId, userId: assignTaskDto.userId },
    });

    if (existing) return { message: 'User already assigned' };

    const assignment = this.assignmentRepository.create({
      taskId,
      userId: assignTaskDto.userId,
    });

    const saved = await this.assignmentRepository.save(assignment);

    /*
    this.client.emit('task.assigned', {
      taskId,
      userId: assignTaskDto.userId,
      timestamp: new Date(),
    });
    */

    return saved;
  }
}
