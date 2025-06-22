import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Subject A', 'Text A', 'Alice'),
    new Message('2', 'Subject B', 'Text B', 'Bob'),
    new Message('3', 'Subject C', 'Text C', 'Carol')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
