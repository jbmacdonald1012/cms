import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  term = '';
  private sub!: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.sub = this.contactService.contactListChangedEvent
      .subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
      });
    // ensure the initial load if needed
    this.contactService.fetchContacts();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  search(value: string) {
    this.term = value;
  }

  trackById(index: number, contact: Contact) {
    return contact.id;
  }
}
