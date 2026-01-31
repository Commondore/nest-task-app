import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { type TaskCreateDto } from './dto/task.create.dto';
import { Task } from '../generated/prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(): Promise<Task[]> {
    return this.tasksService.getAll();
  }

  @Post()
  createTask(@Body() body: TaskCreateDto): Promise<Task> {
    return this.tasksService.createTask(body);
  }

  @Delete(':taskId')
  deleteTask(@Param('taskId') taskId: number) {
    return this.tasksService.deleteById(taskId);
  }
}
