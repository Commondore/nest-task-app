import { Injectable } from '@nestjs/common';
import { ITask } from 'types/tasks';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [
    { id: 1, title: 'Task 01', text: 'Task 01 text' },
    { id: 2, title: 'Task 02', text: 'Task 02 text' },
  ];

  getAll(): ITask[] {
    return this.tasks;
  }

  createTask(task: ITask) {
    this.tasks.push(task);
    return this.tasks;
  }
}
