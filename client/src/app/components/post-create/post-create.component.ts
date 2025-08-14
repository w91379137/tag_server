import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/post.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="row">
      <div class="col-md-8">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a routerLink="/">首頁</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              創建文章
            </li>
          </ol>
        </nav>

        <div class="card">
          <div class="card-header">
            <h4>創建新文章</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="title" class="form-label">標題 *</label>
                <input 
                  type="text" 
                  class="form-control"
                  id="title"
                  formControlName="title"
                  [class.is-invalid]="isFieldInvalid('title')"
                  placeholder="請輸入文章標題">
                <div class="invalid-feedback" *ngIf="isFieldInvalid('title')">
                  標題為必填項目
                </div>
              </div>

              <div class="mb-3">
                <label for="excerpt" class="form-label">摘要</label>
                <textarea 
                  class="form-control" 
                  id="excerpt"
                  formControlName="excerpt"
                  rows="2"
                  placeholder="請輸入文章摘要（可選）"></textarea>
              </div>

              <div class="mb-3">
                <label for="content" class="form-label">內容 *</label>
                <textarea 
                  class="form-control" 
                  id="content"
                  formControlName="content"
                  rows="15"
                  [class.is-invalid]="isFieldInvalid('content')"
                  placeholder="請輸入文章內容"></textarea>
                <div class="invalid-feedback" *ngIf="isFieldInvalid('content')">
                  內容為必填項目
                </div>
              </div>

              <div class="mb-3">
                <label for="tags" class="form-label">標籤</label>
                <input 
                  type="text" 
                  class="form-control"
                  id="tags"
                  [value]="tagInput"
                  (keydown)="onTagInputKeydown($event)"
                  (input)="onTagInputChange($event)"
                  placeholder="輸入標籤名稱，按 Enter 或逗號分隔">
                
                <div class="mt-2" *ngIf="tagSuggestions.length > 0">
                  <small class="text-muted">建議標籤：</small>
                  <div class="mt-1">
                    <span *ngFor="let suggestion of tagSuggestions" 
                          class="badge bg-light text-dark me-1 suggestion-tag"
                          (click)="addTagFromSuggestion(suggestion.name)">
                      {{ suggestion.name }}
                    </span>
                  </div>
                </div>

                <div class="mt-2" *ngIf="selectedTags.length > 0">
                  <small class="text-muted">已選擇的標籤：</small>
                  <div class="mt-1">
                    <span *ngFor="let tag of selectedTags" 
                          class="badge bg-primary me-1">
                      {{ tag }}
                      <button type="button" 
                              class="btn-close btn-close-white ms-1" 
                              (click)="removeTag(tag)">
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <div class="mb-3 form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="published"
                  formControlName="published">
                <label class="form-check-label" for="published">
                  立即發布
                </label>
              </div>

              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" (click)="goBack()">
                  取消
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="postForm.invalid || submitting">
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  {{ submitting ? '創建中...' : '創建文章' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h6>寫作提示</h6>
          </div>
          <div class="card-body">
            <ul class="list-unstyled">
              <li class="mb-2">
                <strong>標題：</strong>簡潔明瞭，能夠吸引讀者注意
              </li>
              <li class="mb-2">
                <strong>摘要：</strong>簡短概括文章內容，幫助讀者快速了解
              </li>
              <li class="mb-2">
                <strong>內容：</strong>結構清晰，段落分明，內容豐富
              </li>
              <li class="mb-2">
                <strong>標籤：</strong>選擇相關標籤，便於分類和搜尋
              </li>
            </ul>
          </div>
        </div>

        <div class="card mt-3" *ngIf="popularTags.length > 0">
          <div class="card-header">
            <h6>熱門標籤</h6>
          </div>
          <div class="card-body">
            <span *ngFor="let tag of popularTags" 
                  class="tag me-1 mb-1"
                  [style.background-color]="tag.color"
                  (click)="addTagFromSuggestion(tag.name)">
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suggestion-tag {
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .suggestion-tag:hover {
      background-color: #e9ecef !important;
      transform: scale(1.05);
    }
    
    .tag {
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .tag:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    
    .btn-close {
      font-size: 0.7rem;
    }
    
    .breadcrumb {
      background-color: transparent;
      padding: 0;
    }
    
    textarea {
      resize: vertical;
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class PostCreateComponent {
  postForm: FormGroup;
  tagInput = '';
  selectedTags: string[] = [];
  tagSuggestions: Tag[] = [];
  popularTags: Tag[] = [];
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private tagService: TagService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      excerpt: [''],
      content: ['', Validators.required],
      published: [true]
    });
    
    this.loadPopularTags();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.postForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onTagInputChange(event: any): void {
    this.tagInput = event.target.value;
    const value = this.tagInput.trim();
    if (value.length > 1) {
      this.searchTags(value);
    } else {
      this.tagSuggestions = [];
    }
  }

  onTagInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    } else if (event.key === 'Backspace' && this.tagInput === '' && this.selectedTags.length > 0) {
      this.selectedTags.pop();
    }
  }

  addTag(): void {
    const tag = this.tagInput.trim().replace(',', '');
    if (tag && !this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
      this.tagInput = '';
      this.tagSuggestions = [];
    }
  }

  addTagFromSuggestion(tagName: string): void {
    if (!this.selectedTags.includes(tagName)) {
      this.selectedTags.push(tagName);
      this.tagInput = '';
      this.tagSuggestions = [];
    }
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
    }
  }

  searchTags(query: string): void {
    this.tagService.searchTags(query).subscribe({
      next: (tags) => {
        this.tagSuggestions = tags.filter(tag => 
          !this.selectedTags.includes(tag.name)
        ).slice(0, 5);
      },
      error: (error) => {
        console.error('搜尋標籤失敗:', error);
      }
    });
  }

  loadPopularTags(): void {
    this.tagService.getPopularTags(8).subscribe({
      next: (tags) => {
        this.popularTags = tags;
      },
      error: (error) => {
        console.error('載入熱門標籤失敗:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.submitting = true;
      
      const postData = {
        ...this.postForm.value,
        tagNames: this.selectedTags
      };

      this.postService.createPost(postData).subscribe({
        next: (post) => {
          console.log('文章創建成功:', post);
          this.router.navigate(['/post', post.id]);
        },
        error: (error) => {
          console.error('創建文章失敗:', error);
          this.submitting = false;
          alert('創建文章失敗，請稍後再試');
        }
      });
    } else {
      Object.keys(this.postForm.controls).forEach(key => {
        const control = this.postForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}