import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, BehaviorSubject, Observable} from 'rxjs';
import { Document } from './document.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  private maxDocumentId = 0;
  private apiUrl = '/api/documents';

  constructor(private http: HttpClient) {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.http
      .get<{ documents: Document[] }>(this.apiUrl)
      .pipe(map(res => res.documents))
      .subscribe({
        next: docs => {
          this.documents = docs || [];
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: err => console.error('Failed to load documents:', err)
      });
  }

  getDocuments(): void {
    this.http
      .get<{ documents: Document[] }>(this.apiUrl)
      .pipe(map(res => res.documents))
      .subscribe({
        next: (documents) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next([...this.documents]);
        },
        error: err => console.error('Failed to load documents:', err)
      });
  }

  getDocument(id: string): Document | null {
    return this.documents.find(d => d.id === id) || null;
  }

  private getMaxId(): number {
    return this.documents
      .map(d => parseInt(d.id, 10) || 0)
      .reduce((max, id) => Math.max(max, id), 0);
  }

  addDocument(newDoc: Document): Observable<Document> {
    if (!newDoc) throw new Error('No document to add.');

    // temporary client-side ID
    newDoc.id = (this.maxDocumentId + 1).toString();

    return this.http
      .post<{  message: string; documents: Document[] }>(this.apiUrl, newDoc)
      .pipe(
        map(res => res.documents[0]),    // pull out the first (and only) element
        tap(doc => {
          this.documents.push(doc);
          this.maxDocumentId = Math.max(this.maxDocumentId, +doc.id);
          this.documentListChangedEvent.next(this.documents.slice());
        })
      );
  }

  updateDocument(orig: Document, updated: Document): void {
    if (!orig || !updated) return;
    const url = `${this.apiUrl}/${orig.id}`;
    this.http
      .put(url, updated)
      .subscribe({
        next: () => {
          const idx = this.documents.findIndex(d => d.id === orig.id);
          if (idx >= 0) {
            updated.id = orig.id;
            this.documents[idx] = updated;
            this.documentListChangedEvent.next(this.documents.slice());
          }
        },
        error: err => console.error(`Failed to update document ${orig.id}:`, err)
      });
  }

  deleteDocument(doc: Document): void {
    if (!doc) return;
    const url = `${this.apiUrl}/${doc.id}`;
    this.http
      .delete(url)
      .subscribe({
        next: () => {
          this.documents = this.documents.filter(d => d.id !== doc.id);
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: err => console.error(`Failed to delete document ${doc.id}:`, err)
      });
  }
}
