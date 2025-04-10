import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../models/todo.model';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent implements OnInit, OnChanges {
  @Input() todo: Todo | null = null;
  @Input() editMode = false;
  @Input() editIndex = -1;
  
  @Output() todoSaved = new EventEmitter<Todo>();
  @Output() editCancelled = new EventEmitter<void>();
  
  // Model for the form
  newTodo: Todo = {
    id: 0,
    title: '',
    description: '',
    completed: false
  };

  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If todo input changes, update the form
    if (changes['todo'] && changes['todo'].currentValue) {
      this.newTodo = { ...this.todo! };
    }
  }

  editTodo(){
    this.editMode = true;

  }
  toggleStatus(){
    this.newTodo.completed = !this.newTodo.completed;

  }
  deleteTodo(){
    this.http.delete<Todo>(`/todo/todos/${this.newTodo.id}`)
    .pipe(
      tap(() => console.log('Todo deleted')),
      catchError(this.handleError('deleteTodo', []))
      )
  }
  handleError(arg0: string, arg1: never[]): (err: any, caught: import("rxjs").Observable<Todo>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }
  goBack(){
    this.editMode = false;

  }
  /**
   * Create a new todo
   * Sends a POST request to the API and emits the created todo
   */
  createTodo(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.loading = true;
    this.http.post<Todo>('api/todos', this.newTodo)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error creating todo:', error);
          return throwError(() => new Error('Failed to create todo. Please try again.'));
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response: Todo) => {
          this.todoSaved.emit(response);
          this.resetForm();
        },
        error: (error) => {
          alert('Failed to create todo. Check console for details.');
        }
      });
  }

  /**
   * Update an existing todo
   * Sends a PUT request to the API and emits the updated todo
   */
  updateTodo(): void {
    if (!this.validateForm()) {
      return;
    }
    
    const todoId = this.newTodo.id;
    this.loading = true;
    
    this.http.put<Todo>(`api/todos/${todoId}`, this.newTodo)
      .pipe(
        take(1),
        catchError(error => {
          console.error('Error updating todo:', error);
          return throwError(() => new Error('Failed to update todo. Please try again.'));
        }),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response: Todo) => {
          this.todoSaved.emit(response);
          this.resetForm();
        },
        error: (error) => {
          alert('Failed to update todo. Check console for details.');
        }
      });
  }

  /**
   * Cancel editing and reset the form
   * Emits an event to notify the parent component
   */
  cancelEdit(): void {
    this.resetForm();
    this.editCancelled.emit();
  }

  /**
   * Reset the form to its initial state
   */
  resetForm(): void {
    this.newTodo = {
      id: 0,
      title: '',
      description: '',
      completed: false
    };
    
    // If a todo was passed in, we need to restore it for editing
    if (this.todo) {
      this.newTodo = { ...this.todo };
    }
  }

  /**
   * Save a todo (create or update)
   * Determines whether to create or update based on edit mode
   */
  saveTodo(): void {
    if (this.editMode) {
      this.updateTodo();
    } else {
      this.createTodo();
    }
  }

  /**
   * Validates the form before submission
   * @returns boolean indicating if the form is valid
   */
  private validateForm(): boolean {
    if (!this.newTodo.title?.trim()) {
      alert('Title is required!');
      return false;
    }
    return true;
  }
}