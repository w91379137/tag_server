import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../models/post.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-tag-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mb-4">
      <div class="card-header">
        <h6>標籤搜尋</h6>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="搜尋標籤..."
            [(ngModel)]="searchQuery"
            (input)="onSearchInput($event)"
          >
        </div>
        
        <div *ngIf="searchResults.length > 0" class="mb-3">
          <h6>搜尋結果：</h6>
          <div>
            <span *ngFor="let tag of searchResults" 
                  class="tag me-1 mb-1"
                  [class.selected]="isTagSelected(tag.name)"
                  [style.background-color]="tag.color"
                  (click)="toggleTag(tag.name)">
              {{ tag.name }}
            </span>
          </div>
        </div>
        
        <div *ngIf="selectedTags.length > 0">
          <h6>已選擇的標籤：</h6>
          <div class="mb-2">
            <span *ngFor="let tagName of selectedTags" 
                  class="badge bg-primary me-1">
              {{ tagName }}
              <button type="button" 
                      class="btn-close btn-close-white ms-1" 
                      (click)="removeTag(tagName)">
              </button>
            </span>
          </div>
          <button class="btn btn-sm btn-outline-secondary" (click)="clearTags()">
            清除全部
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tag {
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }
    
    .tag:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
    
    .tag.selected {
      border-color: #fff;
      box-shadow: 0 0 0 2px #007bff;
    }
    
    .btn-close {
      font-size: 0.7rem;
      margin-left: 0.25rem;
    }
    
    .badge {
      font-size: 0.8rem;
    }
  `]
})
export class TagSearchComponent {
  @Output() tagsSelected = new EventEmitter<string[]>();
  
  searchQuery = '';
  searchResults: Tag[] = [];
  selectedTags: string[] = [];
  private searchSubject = new Subject<string>();

  constructor(private tagService: TagService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.searchTags(query);
      } else {
        this.searchResults = [];
      }
    });
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchSubject.next(query);
  }

  searchTags(query: string) {
    this.tagService.searchTags(query).subscribe({
      next: (tags) => {
        this.searchResults = tags;
      },
      error: (error) => {
        console.error('搜尋標籤失敗:', error);
      }
    });
  }

  toggleTag(tagName: string) {
    const index = this.selectedTags.indexOf(tagName);
    if (index === -1) {
      this.selectedTags.push(tagName);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.tagsSelected.emit([...this.selectedTags]);
  }

  removeTag(tagName: string) {
    const index = this.selectedTags.indexOf(tagName);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
      this.tagsSelected.emit([...this.selectedTags]);
    }
  }

  clearTags() {
    this.selectedTags = [];
    this.tagsSelected.emit([]);
  }

  isTagSelected(tagName: string): boolean {
    return this.selectedTags.includes(tagName);
  }
}