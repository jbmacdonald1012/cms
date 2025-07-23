import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, Subject, Observable } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  private maxMessageId = 0;
  private apiUrl = '/api/messages';

  constructor(private http: HttpClient) {
    this.fetchMessages();
  }

  fetchMessages(): void {
    this.http
      .get<{ messages: Message[] }>(this.apiUrl)
      .pipe(map(res => res.messages))
      .subscribe({
        next: msgs => {
          this.messages = msgs || [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
        },
        error: err => console.error('Failed to load messages:', err)
      });
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    return this.messages.find(m => m.id === id) || null;
  }

  private getMaxId(): number {
    return this.messages
      .map(m => parseInt(m.id, 10) || 0)
      .reduce((max, id) => Math.max(max, id), 0);
  }

  /** Return an Observable so callers can wait for the new message */
  addMessage(newMsg: Message): Observable<Message> {
    if (!newMsg) throw new Error('No message to add');
    newMsg.id = (this.maxMessageId + 1).toString();

    return this.http
      .post<{ message: Message }>(this.apiUrl, newMsg)
      .pipe(
        map(res => res.message),
        tap(saved => {
          this.messages.push(saved);
          this.maxMessageId = Math.max(this.maxMessageId, +saved.id);
          this.messageChangedEvent.next(this.messages.slice());
        })
      );
  }
}
