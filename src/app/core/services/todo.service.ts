import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
 * Updated to match Java controller endpoints
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8080/todo/api/todos'; // Updated to match Java controller base path

  constructor(private http: HttpClient) {}

  /**
   * Fetches all todos from the API
   */
  getTodos(): Observable<Todo[]> {
    return this.http.get(this.apiUrl, {responseType: 'text', observe: 'response'}).pipe(
      map(response => {
        // Log full response for debugging
        console.log('API Response:', {
          status: response.status,
          headers: response.headers,
          body: response.body
        });
        
        if (response.headers.get('Content-Type')?.includes('text/html')) {
          throw new Error(`Backend returned HTML instead of JSON. Possible misconfigured endpoint: ${this.apiUrl}`);
        }
        
        try {
          const data = JSON.parse(response.body || '');
          return data.data || data;
        } catch (e: unknown) {
          const error = e as Error;
          throw new Error(`Failed to parse API response: ${error.message}`);
        }
      }),
      catchError(error => {
        console.error('Error loading todos:', error);
        return throwError(() => new Error('Failed to load todos. Check console for details.'));
      })
    );
  }

  /**
   * Get single todo by ID
   */
  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error loading todo:', error);
        return throwError(() => new Error('Failed to load todo. Check console for details.'));
      })
    );
  }

  /**
   * Create or update todo
   */
  saveTodo(todo: Todo): Observable<Todo> {
    if (!todo.title) {
      return throwError(() => new Error('Title is required!'));
    }

    if (todo.id) {
      return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).pipe(
        catchError(error => {
          console.error('Error updating todo:', error);
          return throwError(() => new Error('Failed to update todo. Check console for details.'));
        })
      );
    } else {
      return this.http.post<Todo>(this.apiUrl, todo).pipe(
        catchError(error => {
          console.error('Error creating todo:', error);
          return throwError(() => new Error('Failed to create todo. Check console for details.'));
        })
      );
    }
  }

  /**
   * Delete todo by ID
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
   * Toggle todo completion status
   */
  toggleTodoStatus(id: number): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      catchError(error => {
        console.error('Error toggling todo status:', error);
        return throwError(() => new Error('Failed to toggle todo status. Check console for details.'));
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
