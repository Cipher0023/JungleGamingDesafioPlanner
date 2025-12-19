import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from '../database/entities/task.entity';
import { Comment } from '../database/entities/comment.entity';
import { TaskAssignment } from '../database/entities/task-assignment.entity';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  const mockCommentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAssignmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: getRepositoryToken(TaskAssignment),
          useValue: mockAssignmentRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar uma tarefa com executor', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        executorId: 'executor-uuid',
        dueDate: '2025-12-25',
      };

      const userId = 'creator-uuid';
      const mockTask = {
        id: 'task-uuid',
        ...createTaskDto,
        createdBy: userId,
        dueDate: new Date(createTaskDto.dueDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, userId);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        status: createTaskDto.status,
        createdBy: userId,
        executorId: createTaskDto.executorId,
        dueDate: new Date(createTaskDto.dueDate),
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });

    it('deve criar uma tarefa sem executor (opcional)', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: '2025-12-25',
      };

      const userId = 'creator-uuid';
      const mockTask = {
        id: 'task-uuid',
        ...createTaskDto,
        createdBy: userId,
        executorId: undefined,
        dueDate: new Date(createTaskDto.dueDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, userId);

      expect(result.executorId).toBeUndefined();
      expect(result.createdBy).toBe(userId);
    });
  });

  describe('findAll', () => {
    it('deve retornar tarefas paginadas', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          createdBy: 'user-1',
          executorId: 'executor-1',
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          assignments: [],
          comments: [],
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          createdBy: 'user-1',
          executorId: undefined,
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM,
          assignments: [],
          comments: [],
        },
      ];

      mockTaskRepository.findAndCount.mockResolvedValue([mockTasks, 2]);

      const result = await service.findAll(1, 10);

      expect(mockTaskRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['assignments', 'comments'],
        order: { createdAt: 'DESC' },
      });
      expect(result.data).toEqual(mockTasks);
      expect(result.pagination).toEqual({
        page: 1,
        size: 10,
        total: 2,
        pages: 1,
      });
    });
  });

  describe('findById', () => {
    it('deve retornar uma tarefa por ID', async () => {
      const mockTask = {
        id: 'task-uuid',
        title: 'Test Task',
        description: 'Test Description',
        createdBy: 'creator-uuid',
        executorId: 'executor-uuid',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        assignments: [],
        comments: [],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findById('task-uuid');

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'task-uuid' },
        relations: ['assignments', 'comments'],
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('deve atualizar uma tarefa', async () => {
      const existingTask = {
        id: 'task-uuid',
        title: 'Old Title',
        description: 'Old Description',
        createdBy: 'creator-uuid',
        executorId: undefined,
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
      };

      const updateDto = {
        title: 'New Title',
        executorId: 'new-executor-uuid',
        status: TaskStatus.IN_PROGRESS,
      };

      const updatedTask = {
        ...existingTask,
        ...updateDto,
      };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.merge.mockReturnValue(updatedTask);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update('task-uuid', updateDto);

      expect(result.title).toBe('New Title');
      expect(result.executorId).toBe('new-executor-uuid');
      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it('deve lançar erro se tarefa não existir', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-uuid', {})).rejects.toThrow(
        'Task not found',
      );
    });
  });
});
