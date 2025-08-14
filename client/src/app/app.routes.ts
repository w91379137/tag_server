import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PostCreateComponent } from './components/post-create/post-create.component';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: '**', redirectTo: '' }
];