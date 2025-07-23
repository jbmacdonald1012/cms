import {Component, ElementRef, ViewChild} from '@angular/core';
import {Message} from '../message.model';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInputRef!: ElementRef;
  @ViewChild('msgText') msgTextInputRef!: ElementRef;
  currentSender = 'Jason Macdonald';

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const message = new Message(
      '',
      this.subjectInputRef.nativeElement.value,
      this.msgTextInputRef.nativeElement.value,
      this.currentSender
    );

    // Subscribe and only clear *after* service has added and emitted
    this.messageService.addMessage(message)
      .subscribe({
        next: () => this.onClear(),
        error: err => console.error('Add message failed:', err)
      });
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
