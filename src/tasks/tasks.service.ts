import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskCreateDto } from './dto/task.create.dto';
import { Task } from '../generated/prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async createTask(task: TaskCreateDto) {
    const result = await this.prisma.task.create({
      data: {
        title: task.title,
        user: { connect: { id: task.userId } },
      },
    });
    return result;
  }

  deleteById(taskId: number) {
    return this.prisma.task.delete({ where: { id: taskId } });
  }
}
