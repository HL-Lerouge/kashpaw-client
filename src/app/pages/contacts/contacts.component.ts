import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Contacts, GetContactsResult} from "@capacitor-community/contacts";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {

  @Input("contacts") contacts: any

  ctc: any
  results : any

  constructor(private mdc: ModalController) {
  }

  ngOnInit() {
    const projection = {
      name: true,
      phones: true,
    };

    Contacts.getContacts({projection}).then((r: GetContactsResult) => {
      this.ctc = r.contacts
      this.results=this.ctc
      this.ctc.forEach((value: any) => {
        if (value.phones) {
          console.log(JSON.stringify(value));
          console.log(value.name?.display);
          console.log(value.phones[0].number)
        }
      })
    })

  }

  handleInput(event:any) {
    const query = event.target.value.toString().toLowerCase();
    this.results = this.ctc.filter((d:any) => d.name?.display.toString().toLowerCase().indexOf(query) > -1);
  }

  cancel() {
    return this.mdc.dismiss(null, 'cancel');
  }

  numero: any

  confirm() {
    return this.mdc.dismiss(this.numero, 'confirm');
  }

  phoneClick(number: any) {
    return this.mdc.dismiss(number, 'confirm');
  }

}
