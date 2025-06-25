import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Doc A', 'This is Document A', 'http://example.com/a', []),
    new Document('2', 'Doc B', 'This is Document B', 'http://example.com/b', []),
    new Document('3', 'Doc C', 'This is Document C', 'http://example.com/c', []),
    new Document('4', 'Doc D', 'This is Document D', 'http://example.com/d', []),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
