import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '../generated/prisma/client';
import { QueryTaskDto } from 'src/tasks/dto/query-task.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAll(query: QueryTaskDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    return this.prisma.task.findMany({
      where: {
        completed: query.completed,
      },
      orderBy: {
        [query.sortBy ?? 'createdAt']: query.order ?? 'desc',
      },
      take: limit,
      skip,
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Задача с таким id не найдена');
    return task;
  }

  async createTask(dto: CreateTaskDto) {
    const data = {
      title: dto.title,
      completed: dto.completed ?? false,
      userId: dto.userId,
    };

    return this.prisma.task.create({ data });
  }

  async update(id: number, dto: UpdateTaskDto) {
    const exists = await this.prisma.task.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Задача не найдена');

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        completed: dto.completed,
      },
    });
  }

  async deleteById(id: number) {
    const exists = await this.prisma.task.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Задача не найдена');

    await this.prisma.task.delete({ where: { id: id } });
    return { success: true };
  }
}
