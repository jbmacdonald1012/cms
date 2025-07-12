import { Component } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  currentSender: string = 'Jason Macdonald';

  constructor(private messageService: MessageService) {}

  onSendMessage(form: NgForm) {
    if (form.invalid) return;

    const { subject, msgText } = form.value;
    const newMessage = new Message('', subject, msgText, this.currentSender);
    this.messageService.addMessage(newMessage);
    form.resetForm();
  }

  onClear(form: NgForm) {
    form.resetForm();
  }
}
