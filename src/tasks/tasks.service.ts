import { Injectable } from '@nestjs/common';
import { ITask } from 'types/tasks';
import { PrismaService } from '../prisma/prisma.service';
import { TaskCreateDto } from './dto/task.create.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [
    { id: 1, title: 'Task 01', text: 'Task 01 text' },
    { id: 2, title: 'Task 02', text: 'Task 02 text' },
  ];

  constructor(private prisma: PrismaService) {}

  getAll(): ITask[] {
    return this.tasks;
  }

  createTask(task: TaskCreateDto) {
    void this.prisma.task.create({
      data: {
        title: task.title,
        user: { connect: { id: task.userId } },
      },
    });
    return this.tasks;
  }

  deleteById(taskId: number) {
    return this.tasks.filter((task) => task.id !== taskId);
  }
}
