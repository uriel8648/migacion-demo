import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';

/**
 * Routes for the Todos feature module
 * 
 * The routing structure follows these patterns:
 * - '/todos' - Main list view of all todos
 * - '/todos/new' - Form to create a new todo
 * - '/todos/:id' - Detail view for a specific todo
 * - '/todos/:id/edit' - Form to edit an existing todo
 */
const routes: Routes = [
  {
    path: '',
    component: TodoListComponent,
    // This component will load all todos on initialization
    // replacing the loadTodos() function from the original controller
  },
  {
    path: 'new',
    component: TodoFormComponent,
    // This route is for creating new todos
    data: { mode: 'create' }
  },
  {
    path: ':id',
    component: TodoDetailComponent,
    // This route shows details for a specific todo
    // The id parameter will be used to fetch the todo data
  },
  {
    path: ':id/edit',
    component: TodoFormComponent,
    // This route is for editing an existing todo
    // The id parameter will be used to fetch the todo data for editing
    data: { mode: 'edit' }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
    // Redirect any undefined routes back to the todo list
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule { }