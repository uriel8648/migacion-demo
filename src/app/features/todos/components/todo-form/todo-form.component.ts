import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../../../core/services/todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {
  // Form group for reactive form handling
  todoForm!: FormGroup;
  
  newTodo: Todo = {
    title: '',
    completed: false,
    description: ''
  };
  // Editing state
  editMode = false;
  editIndex = -1;
  
  // Events to communicate with parent component
  @Output() todoCreated = new EventEmitter<Todo>();
  @Output() todoUpdated = new EventEmitter<{ todo: Todo, index: number }>();
  @Output() formCancelled = new EventEmitter<void>();
  
  // Subject for unsubscribing from observables when component is destroyed
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize the reactive form
   */
  private initForm(): void {
    this.todoForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      completed: [false]
    });
  }


  /**
   * Sets up the form for editing an existing todo
   * @param todo The todo to edit
   * @param index The index of the todo in the list
   */
  editTodo(todo: Todo, index: number): void {
    this.todoForm.patchValue({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed
    });
    this.editMode = true;
    this.editIndex = index;
  }

  /**
   * Cancels the current edit operation
   */
  cancelEdit(): void {
    this.resetForm();
    this.formCancelled.emit();
  }

  /**
   * Resets the form to its initial state
   */
  resetForm(): void {
    this.todoForm.reset({
      id: null,
      title: '',
      description: '',
      completed: false
    });
    this.editMode = false;
    this.editIndex = -1;
  }

  /**
   * Saves a todo (creates or updates based on edit mode)
   */
  saveTodo(): void {
    if (this.todoForm.invalid) {
      // Mark form controls as touched to trigger validation messages
      Object.keys(this.todoForm.controls).forEach(key => {
        const control = this.todoForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const todoData: Todo = this.todoForm.value;
    
    this.todoService.saveTodo(todoData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (savedTodo: Todo) => {
          if (this.editMode) {
            this.todoUpdated.emit({ todo: savedTodo, index: this.editIndex });
          } else {
            this.todoCreated.emit(savedTodo);
          }
          this.resetForm();
        },
        error: (error) => {
          console.error('Error saving todo:', error);
          alert('Failed to save todo. Check console for details.');
        }
      });
  }
  
  /**
   * Helper method to check if a form control is invalid and touched
   * @param controlName The name of the control to check
   * @returns Boolean indicating if the control is invalid and touched
   */
  isControlInvalid(controlName: string): boolean {
    const control = this.todoForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}