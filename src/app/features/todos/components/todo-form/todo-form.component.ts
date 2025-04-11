import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../../../core/services/todo.service';


@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {


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
  /**
   * Loads all todos from the API
   */
  todoForm!: FormGroup;
  
  @Output() todoCreated = new EventEmitter<Todo>();
  @Output() todoUpdated = new EventEmitter<{ todo: Todo, index: number }>();
    @Output() formCancelled = new EventEmitter<void>();
  
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // First try getting state from navigation
    const navigation = this.router.getCurrentNavigation();
    let state = navigation?.extras?.state as { todo?: Todo, editMode?: boolean };

    // If no state from navigation, check history state
    if (!state?.todo) {
      state = history.state as { todo?: Todo, editMode?: boolean };
    }

    if (state?.todo) {
      console.log('Received todo for editing:', state.todo);
      this.editMode = !!state.editMode;
      this.newTodo = { ...state.todo };
      
      // Ensure form is ready before patching values
      setTimeout(() => {
        this.todoForm.patchValue({
          title: this.newTodo.title,
          description: this.newTodo.description,
          completed: this.newTodo.completed
        });
        console.log('Form patched with values:', this.todoForm.value);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      completed: [false]
    });
  }

  /*editTodo(todo: Todo, index: number): void {
    this.todoForm.patchValue({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed
    });
    this.editMode = true;
    this.editIndex = index;
  }*/
  editTodo(todo: Todo, index: number): void {
    this.newTodo = { ...todo };
    this.editMode = true;
    this.editIndex = index;
  }

  cancelEdit(): void {
    this.resetForm();
    this.router.navigate(['/todo']);
  }

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
          this.router.navigate(['/todo']);
        }
      });
  }

  returnhome(){
    this.router.navigate(['/']);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.todoForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
