import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  contact!: Contact;
  originalContact!: Contact;
  editMode = false;
  groupContacts: Contact[] = [];  // ← needed by the template

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', []);
        this.groupContacts = [];
        return;
      }
      const c = this.contactService.getContact(id);
      if (!c) return;
      this.originalContact = c;
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(c));
      this.groupContacts = c.group ? [...c.group] : [];
    });
  }

  onSubmit(form: NgForm) {
    const v = form.value;
    const newContact = new Contact(
      '',
      v.name,
      v.email,
      v.phone,
      v.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactService.addContact(newContact);
      this.router.navigate(['/contacts']);
    } else {
      this.contactService.addContact(newContact)
        .subscribe({
          next: () => this.router.navigate(['/contacts']),
          error: err => console.error(err)
        });
    }
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  /** Called when an item is dropped into the group list */
  addToGroup(event: CdkDragDrop<Contact[]>) {
    const dragged: Contact = event.item.data;
    // prevent dupes or self
    if (!dragged || dragged.id === this.contact.id ||
      this.groupContacts.some(c => c.id === dragged.id)) {
      return;
    }
    this.groupContacts.push(dragged);
  }

  /** For reordering within the group */
  onDrop(event: CdkDragDrop<Contact[]>) {
    moveItemInArray(this.groupContacts, event.previousIndex, event.currentIndex);
  }

  /** Remove by index */
  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) return;
    this.groupContacts.splice(index, 1);
  }

  /** trackBy for *ngFor */
  trackById(_i: number, c: Contact) {
    return c.id;
  }
}
