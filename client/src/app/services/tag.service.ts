import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`);
  }

  searchTags(query: string): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags?search=${query}`);
  }

  getPopularTags(limit: number = 10): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}/tags/popular?limit=${limit}`);
  }
}