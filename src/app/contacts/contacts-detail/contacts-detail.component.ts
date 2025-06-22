import { Component, Input } from '@angular/core';
import {Contact} from '../contact.model';

@Component({
  selector: 'cms-contacts-detail',
  standalone: false,
  templateUrl: './contacts-detail.component.html',
  styleUrl: './contacts-detail.component.css'
})
export class ContactsDetailComponent {
  @Input() contact: Contact;
}
