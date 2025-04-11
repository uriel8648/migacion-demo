

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../../../core/services/todo.service';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  // Collection of todos
  todos: Todo[] = [];

  
  // Loading state
  loading = false;

  constructor(
    private todoService: TodoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  /**
   * Loads all todos from the API
   */
  loadTodos(): void {
    this.loading = true;
    this.todoService.getTodos()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error loading todos:', error);
          alert('Failed to load todos. Check console for details.');
          return of([]);
        })
      )
      .subscribe({
        next: (todos) => {
          this.todos = todos;
        }
      });
  }

  /**
   * Navigates to the todo form for creating a new todo
   */
  addTodo(): void {
    this.router.navigate(['/todo-form']);
  }

  /**
   * Navigates to the todo form for editing an existing todo
   * @param todo The todo to edit
   */
  editTodo(todo: Todo, index: number): void {
    console.log('Editing todo:', todo);
    this.router.navigate(['/todo-form'], { 
      state: { todo: {...todo}, editMode: true },
      replaceUrl: true
    }).then(() => {
      // Force state to be kept even if page is refreshed
      history.replaceState({ todo: {...todo}, editMode: true }, '');
    });
  }

  /**
   * Deletes a todo
   * @param id The ID of the todo to delete
   * @param index The index of the todo in the array
   */
  deleteTodo(id: number, index: number): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.loading = true;
      this.todoService.deleteTodo(id)
        .pipe(
          finalize(() => this.loading = false),
          catchError(error => {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo. Check console for details.');
            return EMPTY;
          })
        )
        .subscribe({
          next: () => {
            this.todos.splice(index, 1);
          }
        });
    }
  }

  /**
   * Toggles the completed status of a todo
   * @param todo The todo to toggle
   */
  toggleStatus(todo: Todo): void {
    if (!todo.id) {
      console.error('Cannot toggle todo without ID');
      return;
    }

    const originalStatus = todo.completed;
    todo.completed = !todo.completed;

    this.loading = true;
    this.todoService.toggleTodoStatus(todo.id)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error toggling todo status:', error);
          alert('Failed to update todo status. Check console for details.');
          todo.completed = originalStatus;
          return EMPTY;
        })
      )
      .subscribe({
        next: (response) => {
          // Update the todo with the response data
          Object.assign(todo, response);
        }
      });
  }
 
  
}

