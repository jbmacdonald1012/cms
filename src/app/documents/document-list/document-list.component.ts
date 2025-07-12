import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  standalone: false
})

export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  subsrciption: Subscription;

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    this.documentService.documentSelectedEvent
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
        }
      );
    this.documentService.documentChangedEvent
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
        }
      );
    this.subsrciption = this.documentService.documentListChangedEvent
      .subscribe((documents: Document[]) => {
        this.documents = documents;
      })
  }

  ngOnDestroy() {
    this.subsrciption.unsubscribe();
  }
}
