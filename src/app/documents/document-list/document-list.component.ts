import { Component } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {

  documents: Document[] = [
    new Document('1', 'Doc A', 'Description A', 'http://example.com/a', []),
    new Document('2', 'Doc B', 'Description B', 'http://example.com/b', []),
    new Document('3', 'Doc C', 'Description C', 'http://example.com/c', [])
  ];
}
