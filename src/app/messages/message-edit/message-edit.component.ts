import {Component, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})

export class MessageEditComponent {

    @ViewChild('subject') subjectInputRef: ElementRef;
    @ViewChild('msgText') msgTextInputRef: ElementRef;

    @Output() addMessageEvent = new EventEmitter<Message>();
    currentSender = 'Jason Macdonald';

  onSendMessage() {
    const subject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;
    const message = new Message('1',subject, msgText, this.currentSender);
    this.addMessageEvent.emit(message);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
