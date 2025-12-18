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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  AssignTaskDto,
} from './dtos/task.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    const userId = req.user?.id || 'anonymous';
    return this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'size', required: false, type: 'number' })
  findAll(@Query('page') page = '1', @Query('size') size = '10') {
    return this.tasksService.findAll(parseInt(page), parseInt(size));
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'anonymous';
    return this.tasksService.addComment(id, createCommentDto, userId);
  }

  @Get(':id/comments')
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'size', required: false, type: 'number' })
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
