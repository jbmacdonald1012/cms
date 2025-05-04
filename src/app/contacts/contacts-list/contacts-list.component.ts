import { Component } from '@angular/core';
import {Contact} from '../contact.model';

@Component({
  selector: 'app-contacts-list',
  standalone: false,
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.css'
})
export class ContactsListComponent {
  contacts: Contact[] = [
    new Contact(1, 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771','assets/images/jacksonk.jpg', null),
    new Contact(2, 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', 'assets/images/barzeer.jpg', null)
  ];

  constructor() {
  }
}
