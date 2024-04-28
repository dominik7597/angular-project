import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from 'src/DTO/create-todo.dto';
import { TodoStatus, TodoEntity } from 'src/Entity/todo.entity';
import { UserEntity } from 'src/Entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity) private repo: Repository<TodoEntity>,
  ) {}

  async getAllTodos(user: UserEntity) {
    const query = this.repo.createQueryBuilder('todo');
    query.where(`todo.userId = :userId`, { userId: user.id });

    try {
      return await query.getMany();
    } catch (err) {
      throw new NotFoundException('Nie znaleziono zadań.');
    }
  }

  async createTodo(createTodoDto: CreateTodoDto, user: UserEntity) {
    const todo = new TodoEntity();
    const { title, description } = createTodoDto;
    todo.title = title;
    todo.description = description;
    todo.status = TodoStatus.OPEN;
    todo.userId = user.id;

    this.repo.create(todo);
    return await this.repo.save(todo);
  }

  async update(id: number, status: TodoStatus, user: UserEntity) {
    const result = await this.repo.update({ id, userId: user.id }, { status });

    if (result.affected === 0) {
      throw new NotFoundException('Nie znaleziono zadań.');
    } else {
      return { success: true };
    }
  }

  async delete(id: number, user: UserEntity) {
    const result = await this.repo.delete({ id, userId: user.id });

    if (result.affected === 0) {
      throw new NotFoundException('Nie znaleziono zadań.');
    } else {
      return { success: true };
    }
  }
}
