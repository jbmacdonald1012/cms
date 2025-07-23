import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.contact = this.contactService.getContact(params['id']);
      }
    );
    this.route.params.subscribe(
      (params) => {
        this.contact = this.contactService.getContact(params['id']);
      }
    );
  }
  onDelete(): void {
    if (!this.contact) return;
    this.contactService.deleteContact(this.contact)
      .subscribe({
        next: () => this.router.navigate(['/contacts']),
        error: err => console.error('Delete failed:', err)
      });
  }
}
