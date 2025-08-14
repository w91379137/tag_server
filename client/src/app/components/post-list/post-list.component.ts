import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { TagService } from '../../services/tag.service';
import { Post, Tag } from '../../models/post.model';
import { TagSearchComponent } from '../tag-search/tag-search.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TagSearchComponent],
  template: `
    <div class="row">
      <div class="col-md-8">
        <h1>最新文章</h1>
        
        <div *ngIf="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">載入中...</span>
          </div>
        </div>

        <div *ngIf="!loading && posts.length === 0" class="alert alert-info">
          目前沒有文章。
        </div>

        <div class="row">
          <div class="col-12" *ngFor="let post of posts">
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="card-title">
                  <a [routerLink]="['/post', post.id]" class="text-decoration-none">
                    {{ post.title }}
                  </a>
                </h5>
                <p class="card-text text-muted">
                  {{ post.excerpt || (post.content | slice:0:150) + (post.content.length > 150 ? '...' : '') }}
                </p>
                <div class="mb-2">
                  <span *ngFor="let tag of post.tags" 
                        class="tag me-1"
                        [style.background-color]="tag.color"
                        (click)="filterByTag(tag.name)">
                    {{ tag.name }}
                  </span>
                </div>
                <small class="text-muted">
                  發布於 {{ post.createdAt | date:'yyyy/MM/dd HH:mm' }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <app-tag-search (tagsSelected)="onTagsSelected($event)"></app-tag-search>
        
        <div class="card">
          <div class="card-header">
            <h6>熱門標籤</h6>
          </div>
          <div class="card-body">
            <span *ngFor="let tag of popularTags" 
                  class="tag me-1 mb-1"
                  [style.background-color]="tag.color"
                  (click)="filterByTag(tag.name)">
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tag {
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .tag:hover {
      opacity: 0.8;
    }
    .card-title a {
      color: inherit;
    }
    .card-title a:hover {
      color: #007bff;
    }
  `]
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  popularTags: Tag[] = [];
  loading = true;

  constructor(
    private postService: PostService,
    private tagService: TagService
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.loadPopularTags();
  }

  loadPosts() {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('載入文章失敗:', error);
        this.loading = false;
      }
    });
  }

  loadPopularTags() {
    this.tagService.getPopularTags(10).subscribe({
      next: (tags) => {
        this.popularTags = tags;
      },
      error: (error) => {
        console.error('載入熱門標籤失敗:', error);
      }
    });
  }

  filterByTag(tagName: string) {
    this.loading = true;
    this.postService.getPostsByTags([tagName]).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('依標籤篩選失敗:', error);
        this.loading = false;
      }
    });
  }

  onTagsSelected(tagNames: string[]) {
    if (tagNames.length === 0) {
      this.loadPosts();
    } else {
      this.loading = true;
      this.postService.getPostsByTags(tagNames).subscribe({
        next: (posts) => {
          this.posts = posts;
          this.loading = false;
        },
        error: (error) => {
          console.error('依標籤篩選失敗:', error);
          this.loading = false;
        }
      });
    }
  }
}