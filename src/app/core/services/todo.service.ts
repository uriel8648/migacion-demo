import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interface representing a Todo item
 */
export interface Todo {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
}

/**
 * TodoService - Handles all Todo CRUD operations
 * 
 * This service follows Angular 12 best practices:
 * - Uses HttpClient for API requests
 * - Returns typed Observables
 * - Implements proper error handling with RxJS
 * - Provides typed methods with proper interfaces
 */
@Injectable({
  providedIn: 'root' // Makes the service tree-shakable and available as a singleton
})
export class TodoService {
  private apiUrl = 'todo/todos';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all todos from the API
   */
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading todos:', error);
        return throwError(() => new Error('Failed to load todos. Check console for details.'));
      })
    );
  }

  /**
   * Creates a new todo
   */
  createTodo(todo: Todo): Observable<Todo> {
    if (!todo.title) {
      return throwError(() => new Error('Title is required!'));
    }

    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(error => {
        console.error('Error creating todo:', error);
        return throwError(() => new Error('Failed to create todo. Check console for details.'));
      })
    );
  }

  /**
   * Updates an existing todo
   */
  updateTodo(todo: Todo): Observable<Todo> {
    if (!todo.title) {
      return throwError(() => new Error('Title is required!'));
    }

    if (!todo.id) {
      return throwError(() => new Error('Todo ID is required for updates!'));
    }

    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).pipe(
      catchError(error => {
        console.error('Error updating todo:', error);
        return throwError(() => new Error('Failed to update todo. Check console for details.'));
      })
    );
  }

  /**
   * Deletes a todo by ID
   */
  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting todo:', error);
        return throwError(() => new Error('Failed to delete todo. Check console for details.'));
      })
    );
  }

  /**
   * Toggles the completed status of a todo
   */
  toggleTodoStatus(todo: Todo): Observable<Todo> {
    if (!todo.id) {
      return throwError(() => new Error('Todo ID is required!'));
    }

    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}/toggle`, {}).pipe(
      catchError(error => {
        console.error('Error toggling todo status:', error);
        return throwError(() => new Error('Failed to update todo status. Check console for details.'));
      })
    );
  }

  /**
   * Creates a new empty todo object
   */
  createEmptyTodo(): Todo {
    return {
      title: '',
      description: '',
      completed: false
    };
  }
}