import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES} from './MOCKMESSAGES';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new Subject<Message[]>();

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
    const maxId = this.getMaxId();
    message.id = (maxId + 1).toString();
    this.messages.push(message);
    this.messageChangedEvent.next(this.messages.slice());
  }

  private getMaxId(): number {
    return this.messages.reduce((max, msg) => {
      const id = parseInt(msg.id);
      return id > max ? id : max;
    }, 0);
  }
}
