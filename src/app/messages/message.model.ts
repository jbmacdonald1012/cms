export interface Contact {
  _id: string,
  id: string,
  name: string,
  email: string,
}

export class Message {
  constructor(
    public id: string,
    public subject: string,
    public msgText: string,
    public sender: string | Contact,
    public _id?: string,
  ) {}
}
