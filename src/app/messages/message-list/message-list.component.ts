import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  private subscription: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.fetchMessages();

    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        console.log('Message list updated:', messages);
        this.messages = messages;
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  trackById(index: number, message: Message) {
    return message.id;
  }
}
