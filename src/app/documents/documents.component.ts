import { Component, OnInit } from '@angular/core';
  import { Document } from './document.model';
  import { DocumentService } from './document.service';

  @Component({
    selector: 'app-documents',
    standalone: false,
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.css'
  })
  export class DocumentsComponent implements OnInit {
    selectedDocument: Document;

    constructor(private documentService: DocumentService) { }

    ngOnInit() {
      this.documentService.documentListChangedEvent.subscribe(
        (documents: Document[]) => {
          if (documents.length > 0) {
            this.selectedDocument = documents[0];
          }
        }
      );
    }
  }
