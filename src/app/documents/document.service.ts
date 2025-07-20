import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  documentListChangedEvent = new Subject<Document[]>();
  private maxDocumentId = 0;
  private apiUrl = 'http://localhost:3000/api/documents';

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

  addDocument(newDoc: Document): void {
    if (!newDoc) return;

    const tempId = (this.maxDocumentId + 1).toString();
    newDoc.id = tempId;

    this.http
      .post<{ document: Document }>(this.apiUrl, newDoc)
      .subscribe({
        next: res => {
          this.documents.push(res.document);
          this.maxDocumentId = Math.max(this.maxDocumentId, parseInt(res.document.id, 10));
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: err => console.error('Failed to add document:', err)
      });
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
