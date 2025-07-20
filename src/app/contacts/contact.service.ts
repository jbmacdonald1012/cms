import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  private maxContactId = 0;
  private apiUrl = 'http://localhost:3000/api/contacts';

  constructor(private http: HttpClient) {
    this.fetchContacts();
  }

  fetchContacts(): void {
    this.http
      .get<{ contacts: Contact[] }>(this.apiUrl)
      .pipe(map(res => res.contacts))
      .subscribe({
        next: contacts => {
          this.contacts = contacts || [];
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: err => console.error('Failed to load contacts:', err)
      });
  }

  getContacts() {
    this.http.get<{message: string, contacts: Contact[]}>(this.contactsUrl)
      .subscribe({
        next: (response) => {
          this.contacts = response.contacts;
          this.contactListChangedEvent.next([...this.contacts]);
        },
        error: (error) => {
          console.error('Error fetching contacts:', error);
        }
      });
    return [...this.contacts];
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(c => c.id === id) || null;
  }

  private getMaxId(): number {
    return this.contacts
      .map(c => parseInt(c.id, 10) || 0)
      .reduce((max, id) => Math.max(max, id), 0);
  }

  addContact(contact: Contact) {
    return this.http.post<{message: string, contacts: Contact[]}>(this.contactsUrl, contact)
      .pipe(
        tap(response => {
          this.contacts.push(...response.contacts);
          this.contactListChangedEvent.next([...this.contacts]);
        })
      );
  }

  updateContact(orig: Contact, updated: Contact): void {
    if (!orig || !updated) return;

    const url = `${this.apiUrl}/${orig.id}`;
    this.http
      .put(url, updated)
      .subscribe({
        next: () => {
          const idx = this.contacts.findIndex(c => c.id === orig.id);
          if (idx >= 0) {
            updated.id = orig.id;
            this.contacts[idx] = updated;
            this.contactListChangedEvent.next(this.contacts.slice());
          }
        },
        error: err => console.error(`Failed to update contact ${orig.id}:`, err)
      });
  }

  deleteContact(contact: Contact): void {
    if (!contact) return;

    const url = `${this.apiUrl}/${contact.id}`;
    this.http
      .delete(url)
      .subscribe({
        next: () => {
          this.contacts = this.contacts.filter(c => c.id !== contact.id);
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: err => console.error(`Failed to delete contact ${contact.id}:`, err)
      });
  }
}
