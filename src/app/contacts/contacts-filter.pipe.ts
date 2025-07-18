import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
  standalone: false
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    if (!term || term.trim().length === 0) {
      return contacts;
    }
    const lower = term.toLowerCase();
    const filtered = contacts.filter(c =>
      c.name.toLowerCase().includes(lower)
    );
    return filtered.length ? filtered : contacts;
  }
}
