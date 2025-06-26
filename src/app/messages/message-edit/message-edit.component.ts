import {Component, ViewChild, ElementRef} from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})

export class MessageEditComponent {

    @ViewChild('subject') subjectInputRef: ElementRef;
    @ViewChild('msgText') msgTextInputRef: ElementRef;
    currentSender: string = 'Jason Macdonald';

    constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const message = new Message(
      '',
      subject,
      msgText,
      this.currentSender
    );

    this.messageService.addMessage(message);

    setTimeout(() => this.onClear(), 0);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
