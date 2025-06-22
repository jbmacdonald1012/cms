import { Component } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  standalone: false
})
export class ContactsComponent {
  selectedContact: Contact;

  onSelectedContact(contact: Contact) {
    this.selectedContact = contact;
  }
}
