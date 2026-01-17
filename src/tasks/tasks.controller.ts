import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from 'types/tasks';
import { type TaskCreateDto } from './dto/task.create.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(): ITask[] {
    return this.tasksService.getAll();
  }

  @Post()
  createTask(@Body() body: TaskCreateDto): ITask[] {
    return this.tasksService.createTask(body);
  }

  // @Delete(':taskId')
  // deleteTask(@Query() taskId: number) {

  // }
}
