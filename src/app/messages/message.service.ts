import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES} from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  private messages: Message[] = [];

  constructor() {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    return this.messages.find(message => message.id === id) || null;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
