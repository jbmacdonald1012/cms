import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  contact: Contact;
  originalContact: Contact;
  editMode: boolean = false;
  groupContacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', null);
        this.groupContacts = [];
        return;
      }

      const contact = this.contactService.getContact(id);
      if (!contact) return;

      this.originalContact = contact;
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(contact));

      if (contact.group && contact.group.length > 0) {
        this.groupContacts = [...contact.group];
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      '',  // ID will be assigned in the service
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.onCancel();
  }

  onCancel() {
    this.editMode = false;
    this.contact = null;
    this.originalContact = null;
    this.router.navigate(['/contacts']).catch(err => console.error(err));
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) return true;
    if (this.contact && newContact.id === this.contact.id) return true;
    return this.groupContacts.some((contact) => newContact.id === contact.id);
  }

  addToGroup(event: CdkDragDrop<Contact[]>) {
    const draggedContact: Contact = event.item.data;

    if (this.isInvalidContact(draggedContact)) {
      this.snackBar.open('Contact not added to group. Contact is already a part of the group.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snack-error']
      });
      return;
    }

    this.groupContacts.push(draggedContact);
  }

  trackById(index: number, contact: Contact): string {
    return contact.id;
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    this.addToGroup(event);
    moveItemInArray(this.groupContacts, event.previousIndex, event.currentIndex);
  }

  onRemoveItem(index: number) {
    if (index > -1) {
      this.groupContacts.splice(index, 1);
    }
  }
}
