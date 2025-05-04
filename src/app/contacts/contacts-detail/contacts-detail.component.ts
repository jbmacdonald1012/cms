import { Component } from '@angular/core';
import {Contact} from '../contact.model';

@Component({
  selector: 'app-contacts-detail',
  standalone: false,
  templateUrl: './contacts-detail.component.html',
  styleUrl: './contacts-detail.component.css'
})
export class ContactsDetailComponent {
  contact: Contact;
}
