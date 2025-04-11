import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

/**
 * Interface representing a Todo item
 * Strongly typed model for Todo data
 */
export interface Todo {
  id?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdDate?: Date;
}

/**
 * AppComponent - Main component for the Todo application
 * Migrated from AngularJS TodoController to Angular component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Properties with proper typing
  todos: Todo[] = [];
  newTodo: Todo = this.createEmptyTodo();
  editMode = false;
  currentIndex = -1;
  loading = false;
  
  // API endpoint URL - would typically come from environment config
  private readonly apiUrl = '/todo/api/todos';
  
  /**
   * Constructor with Angular dependency injection
   */
  constructor(private http: HttpClient) {}
  
  /**
   * Lifecycle hook that initializes the component
   */
  ngOnInit(): void {
  }
  
  /**
   * Loads all todos from the API using modern RxJS patterns
   */
  loadTodos(): void {
    this.loading = true;
    
    this.http.get<Todo[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (data: Todo[]) => {
          this.todos = data;
        }
      });
  }
  
  /**
   * Saves a new todo or updates an existing one
   * Handles both create and update operations
   */
  saveTodo(): void {
    if (!this.newTodo.title) {
      return; // Basic validation
    }
    
    this.loading = true;
    
    if (this.editMode) {
      // Update existing todo
      this.http.put<Todo>(`${this.apiUrl}/${this.newTodo.id}`, this.newTodo)
        .pipe(
          catchError(this.handleError),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (updatedTodo: Todo) => {
            this.todos[this.currentIndex] = updatedTodo;
            this.resetForm();
          }
        });
    } else {
      // Create new todo
      this.http.post<Todo>(this.apiUrl, this.newTodo)
        .pipe(
          catchError(this.handleError),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (createdTodo: Todo) => {
            this.todos.push(createdTodo);
            this.resetForm();
          }
        });
    }
  }
  
  /**
   * Prepares the form for editing an existing todo
   * @param todo The todo to edit
   * @param index The index of the todo in the array
   */
  editTodo(todo: Todo, index: number): void {
    // Create a copy to avoid direct binding
    this.newTodo = { ...todo };
    this.editMode = true;
    this.currentIndex = index;
  }
  
  /**
   * Cancels the edit operation and resets the form
   */
  cancelEdit(): void {
    this.resetForm();
  }
  
  /**
   * Toggles the completed status of a todo
   * @param todo The todo to toggle
   */
  toggleStatus(todo: Todo): void {
    const updatedTodo: Todo = { ...todo, completed: !todo.completed };
    
    this.loading = true;
    
    this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, updatedTodo)
      .pipe(
        catchError(this.handleError),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (result: Todo) => {
          // Find and update the todo in the array
          const index = this.todos.findIndex(t => t.id === result.id);
          if (index !== -1) {
            this.todos[index] = result;
          }
        }
      });
  }
  
  /**
   * Deletes a todo
   * @param id The ID of the todo to delete
   * @param index The index of the todo in the array
   */
  deleteTodo(id: number | undefined, index: number): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this todo?')) {
      this.loading = true;
      
      this.http.delete(`${this.apiUrl}/${id}`)
        .pipe(
          catchError(this.handleError),
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.todos.splice(index, 1);
            
            // If we're editing the todo that was just deleted, reset the form
            if (this.editMode && this.currentIndex === index) {
              this.resetForm();
            }
          }
        });
    }
  }
  
  /**
   * Resets the form to its initial state
   */
  private resetForm(): void {
    this.newTodo = this.createEmptyTodo();
    this.editMode = false;
    this.currentIndex = -1;
  }
  
  /**
   * Creates an empty todo object
   * @returns An empty todo object
   */
  private createEmptyTodo(): Todo {
    return {
      title: '',
      description: '',
      completed: false
    };
  }
  
  /**
   * Handles HTTP errors with improved error handling
   * @param error The HTTP error response
   * @returns An observable error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    alert(errorMessage);
    
    return throwError(() => new Error(errorMessage));
  }
}