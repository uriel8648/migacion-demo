import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Routes } from '@angular/router';
import { TodoDetailComponent } from './features/todos/components/todo-detail/todo-detail.component';
import { AppComponent } from './app.component';
import { TodoListComponent } from './features/todos/components/todo-list/todo-list.component';
import { TodoItemComponent } from './features/todos/components/todo-item/todo-item.component';
import { TodoFormComponent } from './features/todos/components/todo-form/todo-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  { path: 'todo', component: TodoListComponent },
 { path: 'todo/:id', component: TodoDetailComponent },
  { path: 'todo-form', component: TodoFormComponent },
  { path: '**', redirectTo: '/todo' }
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
