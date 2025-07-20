// src/app/messages/message.service.ts
          import { Injectable } from '@angular/core';
          import { HttpClient } from '@angular/common/http';
          import { Subject } from 'rxjs';
          import { map } from 'rxjs/operators';
          import { Message } from './message.model';

          @Injectable({
            providedIn: 'root'
          })
          export class MessageService {
            private messages: Message[] = [];
            messageChangedEvent = new Subject<Message[]>();
            private apiUrl = 'http://localhost:3000/api/messages';

            constructor(private http: HttpClient) {
              this.fetchMessages();
            }

            fetchMessages(): void {
              this.http
                .get<{ messages: Message[] }>(this.apiUrl)
                .pipe(
                  map(res => {
                    return res.messages.map(message => new Message(
                      message.id || '',
                      message.subject,
                      message.msgText,
                      message.sender,
                      message._id
                    ));
                  })
                )
                .subscribe({
                  next: msgs => {
                    this.messages = msgs;
                    this.messageChangedEvent.next([...this.messages]);
                    console.log('Fetched messages:', this.messages);
                  },
                  error: err => console.error('Failed to load messages:', err)
                });
            }

            addMessage(message: Message): void {
              this.http.post<{ msg: string, message: Message }>(this.apiUrl, message)
                .subscribe({
                  next: (response) => {
                    const newMessage = new Message(
                      response.message.id,
                      response.message.subject,
                      response.message.msgText,
                      response.message.sender,
                      response.message._id
                    );
                    this.messages.push(newMessage);
                    this.messageChangedEvent.next([...this.messages]);
                  },
                  error: error => console.error('Failed to add message:', error)
                });
            }
          }
