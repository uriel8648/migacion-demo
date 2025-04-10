import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Components
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

// Services

import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '@app/core/services/todo.service';

/**
 * Routes for the Todos feature module
 * - Main route displays the todo list with form
 */
const routes: Routes = [
  {
    path: '',
    component: TodoListComponent
  }
];

/**
 * TodosModule - Feature module for Todo management functionality
 * 
 * This module encapsulates all todo-related components, services, and functionality
 * that was previously contained in the AngularJS todoApp module. It follows the
 * Angular feature module pattern for better organization and maintainability.
 * 
 * Components:
 * - TodoListComponent: Main container component that displays the list and form
 * - TodoFormComponent: Handles creation and editing of todos
 * - TodoItemComponent: Displays individual todo items with actions
 * 
 * Services:
 * - TodoService: Handles API communication for CRUD operations
 */
@NgModule({
  declarations: [
    TodoListComponent,
    TodoFormComponent,
    TodoItemComponent,
    TodoDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Using ReactiveFormsModule instead of FormsModule for better form handling
    RouterModule.forChild(routes),
    MatIconModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  providers: [
    TodoService
  ],
  exports: [
    TodoListComponent
  ]
})
export class TodosModule { }