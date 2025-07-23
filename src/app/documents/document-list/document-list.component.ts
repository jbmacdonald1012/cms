import { Component, OnInit, OnDestroy } from '@angular/core';
        import { Document } from '../document.model';
        import { DocumentService } from '../document.service';
        import { Subscription } from 'rxjs';

        @Component({
          selector: 'cms-document-list',
          templateUrl: './document-list.component.html',
          styleUrls: ['./document-list.component.css'],
          standalone: false
        })
        export class DocumentListComponent implements OnInit, OnDestroy {
          documents: Document[] = [];
          subscription: Subscription;

          constructor(private documentService: DocumentService) { }

          ngOnInit() {
            this.subscription = this.documentService.documentListChangedEvent
              .subscribe((documents: Document[]) => {
                this.documents = documents;
              });

            this.documentService.fetchDocuments();
          }

          trackById(index: number, doc: Document): string {
            return doc.id;
          }

          ngOnDestroy() {
            if (this.subscription) {
              this.subscription.unsubscribe();
            }
          }
        }
