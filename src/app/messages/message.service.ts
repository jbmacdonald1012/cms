import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  private maxMessageId: number = 0;
  private dbUrl = 'https://jmacd-cms-default-rtdb.firebaseio.com/messages.json';

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages(): Message[] {
    this.http.get<Message[]>(this.dbUrl)
      .subscribe({
        next: (msgs) => {
          this.messages = msgs || [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (error) => console.error('Failed to load messages:', error)
      });
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    return this.messages.find(m => m.id === id) || null;
  }

  private getMaxId(): number {
    return this.messages
      .map(m => parseInt(m.id, 10) || 0)
      .reduce((max, id) => id > max ? id : max, 0);
  }


  private storeMessages(): void {
    const payload = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.dbUrl, payload, { headers })
      .subscribe({
        next: () => this.messageChangedEvent.next(this.messages.slice()),
        error: (error) => console.error('Failed to save messages:', error)
      });
  }

  addMessage(message: Message): void {
    if (!message) {
      return;
    }
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }
}
