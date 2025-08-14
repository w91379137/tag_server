import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
    </div>

    <div *ngIf="!loading && !post" class="alert alert-danger">
      文章不存在
    </div>

    <div *ngIf="post" class="row">
      <div class="col-12">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a routerLink="/">首頁</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ post.title }}
            </li>
          </ol>
        </nav>

        <article class="card">
          <div class="card-body">
            <h1 class="card-title">{{ post.title }}</h1>
            
            <div class="mb-3">
              <span *ngFor="let tag of post.tags" 
                    class="tag me-1"
                    [style.background-color]="tag.color">
                {{ tag.name }}
              </span>
            </div>

            <div class="text-muted mb-4">
              <small>
                發布於 {{ post.createdAt | date:'yyyy年MM月dd日 HH:mm' }}
                <span *ngIf="post.updatedAt !== post.createdAt">
                  • 更新於 {{ post.updatedAt | date:'yyyy年MM月dd日 HH:mm' }}
                </span>
              </small>
            </div>

            <div class="post-content" [innerHTML]="formatContent(post.content)">
            </div>
          </div>
        </article>

        <div class="mt-4 d-flex justify-content-between">
          <button class="btn btn-secondary" (click)="goBack()">
            ← 返回文章列表
          </button>
          <button class="btn btn-outline-primary" [routerLink]="['/post', post.id, 'edit']" *ngIf="post">
            ✏️ 編輯文章
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .post-content {
      line-height: 1.8;
      font-size: 1.1rem;
    }
    
    .post-content p {
      margin-bottom: 1rem;
    }
    
    .breadcrumb {
      background-color: transparent;
      padding: 0;
    }
    
    .tag {
      font-size: 0.875rem;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadPost(id);
      }
    });
  }

  loadPost(id: number) {
    this.loading = true;
    this.postService.getPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error) => {
        console.error('載入文章失敗:', error);
        this.post = null;
        this.loading = false;
      }
    });
  }

  formatContent(content: string): string {
    return content.replace(/\n/g, '<br>');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}