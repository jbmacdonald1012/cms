import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Document} from '../document.model';
import {DocumentService} from '../document.service';


@Component({
  selector: 'app-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  document: Document;
  originalDocument: Document;
  editMode = false;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];

      if (!id) {
        this.editMode = false;
        this.document = new Document('', '', '', '', null);
        return;
      }

      const doc = this.documentService.getDocument(id);
      if (!doc) return;

      this.originalDocument = doc;
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(doc));
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document('', value.name, value.description, value.url, null);

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
      this.router.navigate(['/documents']);
    } else {
      this.documentService.addDocument(newDocument)
        .subscribe({
          next: () => {
            // navigate *after* the server‐confirmed creation
            this.router.navigate(['/documents']);
          },
          error: err => console.error('Save failed:', err)
        });
    }
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

}
