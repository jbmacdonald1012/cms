// src/app/messages/message-item/message-item.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Message, Contact } from '../message.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'app-message-item',
  standalone: false,
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    // Type guard to check if sender is a Contact object
    if (this.message.sender && typeof this.message.sender === 'object' && 'name' in this.message.sender) {
      this.messageSender = this.message.sender.name;
    } else {
      // If sender is a string (id), fetch the contact
      const contact = this.contactService.getContact(this.message.sender as string);
      this.messageSender = contact?.name || 'Unknown Sender';
    }
    console.log('Message sender:', this.messageSender);
  }
}
