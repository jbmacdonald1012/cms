import { Component } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
contact: Contact;
originalContact: Contact;
editMode: boolean = false;
  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', null);
        return;
      }

      const contact = this.contactService.getContact(id);
      if (!contact) return;

      this.originalContact = contact;
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(contact)); // deep copy
    });
  }


  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      '',  // ID will be assigned in the service
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      null
    );

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.onCancel();
  }

  onCancel() {
    this.editMode = false;
    this.contact = null;
    this.originalContact = null;
    this.router.navigate(['/contacts']);
  }

}
