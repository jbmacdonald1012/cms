import { Component, OnInit } from '@angular/core';
  import { Contact } from './contact.model';
  import { ContactService } from './contact.service';

  @Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css'],
    standalone: false
  })
  export class ContactsComponent implements OnInit {
    selectedContact: Contact;

    constructor(private contactService: ContactService) { }

    ngOnInit() {
      this.contactService.contactListChangedEvent
        .subscribe((contacts: Contact[]) => {
          // Handle the array of contacts appropriately
          // For example, select the first contact or maintain current selection
          if (contacts.length > 0) {
            this.selectedContact = contacts[0];
          }
        });
    }
  }
