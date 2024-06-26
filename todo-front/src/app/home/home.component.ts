import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoComponent } from '../todo/todo.component';
import { ApiService } from '../services/api.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  todos: any = [];
  filteredTodos: any[] = [];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.apiService.getAllTodos().subscribe((todos) => {
      this.todos = todos;
      this.filteredTodos = this.todos;
    });
  }

  filterChanged(ev: MatSelectChange) {
    const value = ev.value;
    this.filteredTodos = this.todos;
    if (value) {
      this.filteredTodos = this.filteredTodos.filter((t) => t.status === value);
      console.log(this.filteredTodos);
    } else {
      this.filteredTodos = this.todos;
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(TodoComponent, {
      width: '500px',
      hasBackdrop: true,
      role: 'dialog',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      this.apiService
        .createTodo(data.title, data.description)
        .subscribe((result: any) => {
          console.log(result);
          this.todos.push(result);
          this.filteredTodos = this.todos;
        });
    });
  }

  statusChanged(ev: MatSelectChange, todoId: number, index: number) {
    const value = ev.value;
    this.apiService.updateStatus(value, todoId).subscribe((todo) => {
      this.todos[index] = todo;
      this.filteredTodos = this.todos;
    });
  }

  delete(id: number) {
    if (confirm('Czy na pewno chcesz usunąć notatkę?')) {
      this.apiService.deleteTodo(id).subscribe((res) => {
        if (res) {
          this.todos = this.todos.filter((t: any) => t.id !== id);
          this.filteredTodos = this.todos;
        }
      });
    }
  }
}
