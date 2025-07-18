import { Injectable,EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId: number;

  private dbUrl = 'https://jmacd-cms-default-rtdb.firebaseio.com/documents.json'

  constructor(private http: HttpClient) {
    this.maxDocumentId = 0;
    this.getDocuments();
  }
  getDocuments(){
    this.http.get<Document[]>(this.dbUrl)
      .subscribe({
        next: (documents) => {
          this.documents = documents || [];
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(this.documents.slice());
        },
      error: (error) => console.error('Failed to load doucuments:', error)
      });
  }

  private storeDocuments() {
    const payload = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.dbUrl,payload, { headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  getDocument(id: string): Document | null {
    return this.documents.find(document => document.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) return;

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(original: Document, updated: Document){
    if (!original || !updated) return;

    const pos = this.documents.indexOf(original);
    if (pos < 0) return;

    updated.id = original.id;
    this.documents[pos] = updated;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.indexOf(document);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
