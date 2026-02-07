import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { QueryTaskDto } from 'src/tasks/dto/query-task.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Task } from 'src/prisma/prisma-client';
import { title } from 'process';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Роут для получения всех задач' })
  @ApiQuery({ name: 'completed', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get()
  @ApiResponse({
    status: 200,
    description: ' Список задач',
    schema: {
      example: [
        {
          id: 1,
          title: 'Task 01',
          completed: true,
          userId: 1,
          createdAt: '2026-01-31T05:53:14.253Z',
        },
      ],
    },
  })
  getAll(@Query() query: QueryTaskDto): Promise<Task[]> {
    return this.tasksService.getAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tasksService.findOne(id);
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.tasksService.createTask(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':taskId')
  deleteTask(@Param('taskId') taskId: number) {
    return this.tasksService.deleteById(taskId);
  }
}
