import {EventEmitter, Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  private dbUrl = 'https://jmacd-cms-default-rtdb.firebaseio.com/contacts.json';
  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
    this.getContacts();
  }
  getContacts(): Contact[]{
    this.http.get<Contact[]>(this.dbUrl)
      .subscribe({next: (contacts) => {
          this.contacts = contacts || [];
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => {
          console.error('Failed to load contacts:', error);
        }
    });
    return this.contacts.slice();
  }

  private storeContacts() {
    const payload = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.dbUrl, payload, { headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
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
    this.storeContacts();
  }

  updateContact(original: Contact, updated: Contact) {
    if (!original || !updated) return;

    const pos = this.contacts.indexOf(original);
    if (pos < 0) return;

    updated.id = original.id;
    this.contacts[pos] = updated;
    this.storeContacts();
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
    this.storeContacts();
  }
}
