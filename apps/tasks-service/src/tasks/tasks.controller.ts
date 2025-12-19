import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  AssignTaskDto,
} from './dtos/task.dto';

/**
 * Controller para gerenciamento de tarefas
 * CRUD completo + comentários e atribuições
 */
@ApiTags('Tarefas')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar nova tarefa',
    description: 'Cria uma tarefa com título, descrição, prioridade, status e opcionalmente um executor',
  })
  @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Headers('x-user-id') userId?: string,
  ) {
    const finalUserId = userId || 'anonymous';
    return this.tasksService.create(createTaskDto, finalUserId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar tarefas',
    description: 'Retorna lista paginada de todas as tarefas com seus comentários e atribuições',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página', example: 1 })
  @ApiQuery({ name: 'size', required: false, description: 'Tamanho da página', example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de tarefas retornada com sucesso' })
  findAll(@Query('page') page = '1', @Query('size') size = '10') {
    return this.tasksService.findAll(parseInt(page), parseInt(size));
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar tarefa por ID',
    description: 'Retorna detalhes completos de uma tarefa específica',
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar tarefa',
    description: 'Atualiza campos de uma tarefa existente (parcial)',
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Deletar tarefa',
    description: 'Remove uma tarefa do sistema',
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 200, description: 'Tarefa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @Post(':id/comments')
  @ApiOperation({ 
    summary: 'Adicionar comentário',
    description: 'Adiciona um comentário a uma tarefa existente',
  })
  @ApiParam({ name: 'id', description: 'UUID da tarefa' })
  @ApiResponse({ status: 201, description: 'Comentário adicionado com sucesso' })
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'anonymous';
    return this.tasksService.addComment(id, createCommentDto, userId);
  }

  @Get(':id/comments')
  getComments(
    @Param('id') id: string,
    @Query('page') page = '1',
    @Query('size') size = '10',
  ) {
    return this.tasksService.getComments(id, parseInt(page), parseInt(size));
  }

  @Post(':id/assign')
  assignUser(@Param('id') id: string, @Body() assignTaskDto: AssignTaskDto) {
    return this.tasksService.assignUser(id, assignTaskDto);
  }
}
