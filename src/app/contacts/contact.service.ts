import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }
  getContacts(): Contact[] {
    return this.contacts.slice();
  }
  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;

    for (let contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) maxId = currentId;
    }

    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  updateContact(original: Contact, updated: Contact) {
    if (!original || !updated) return;

    const pos = this.contacts.indexOf(original);
    if (pos < 0) return;

    updated.id = original.id;
    this.contacts[pos] = updated;
    this.contactListChangedEvent.next(this.contacts.slice());
  }


  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
