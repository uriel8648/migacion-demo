import { Component, OnInit } from '@angular/core';
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
  
  // Model for new/edited todo
  newTodo: Todo = {
    title: '',
    description: '',
    completed: false
  };
  
  // Flags for edit mode
  editMode = false;
  editIndex = -1;
  
  // Loading state
  loading = false;

  constructor(private todoService: TodoService) {}

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
   * Saves a todo (creates or updates)
   */
  saveTodo(): void {
    if (!this.newTodo.title) {
      alert('Title is required!');
      return;
    }

    this.loading = true;
    this.todoService.saveTodo(this.newTodo)
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          console.error('Error saving todo:', error);
          alert('Failed to save todo. Check console for details.');
          return EMPTY;
        })
      )
      .subscribe({
        next: (response) => {
          if (this.editMode) {
            // Update existing todo
            if (this.editIndex !== -1) {
              this.todos[this.editIndex] = response;
            }
          } else {
            // Add new todo
            this.todos.push(response);
          }
          this.resetForm();
        }
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

  /**
   * Sets up the form for editing a todo
   * @param todo The todo to edit
   * @param index The index of the todo in the array
   */
  editTodo(todo: Todo, index: number): void {
    this.newTodo = { ...todo };
    this.editMode = true;
    this.editIndex = index;
  }

  /**
   * Cancels the current edit operation
   */
  cancelEdit(): void {
    this.resetForm();
  }

  /**
   * Resets the form to its initial state
   */
  resetForm(): void {
    this.newTodo = {
      title: '',
      description: '',
      completed: false
    };
    this.editMode = false;
    this.editIndex = -1;
  }

}