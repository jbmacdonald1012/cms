import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, Subject, Observable } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  private maxContactId = 0;
  private apiUrl = '/api/contacts';

  constructor(private http: HttpClient) {
    this.fetchContacts();
  }

  fetchContacts(): void {
    this.http
      .get<{ contacts: Contact[] }>(this.apiUrl)
      .pipe(map(res => res.contacts))
      .subscribe({
        next: list => {
          this.contacts = list || [];
          this.maxContactId = this.getMaxId();
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: err => console.error('Failed to load contacts:', err)
      });
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(c => c.id === id) || null;
  }

  private getMaxId(): number {
    return this.contacts
      .map(c => parseInt(c.id, 10) || 0)
      .reduce((max, id) => Math.max(max, id), 0);
  }

  /** Return an Observable so callers can wait for the new contact */
  addContact(newContact: Contact): Observable<Contact> {
    if (!newContact) throw new Error('No contact to add');
    newContact.id = (this.maxContactId + 1).toString();

    return this.http
      .post<{ message: string; contacts: Contact[] }>(this.apiUrl, newContact)
      .pipe(
        map(res => res.contacts[0]),  // grab the only element
        tap(contact => {
          this.contacts.push(contact);
          this.contactListChangedEvent.next(this.contacts.slice());
        })
      );
  }

  deleteContact(contact: Contact): Observable<void> {
    const url = `${this.apiUrl}/${contact.id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.contactListChangedEvent.next(this.contacts.slice());
      })
    );
  }
}
