import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-facture-modal',
  templateUrl: './facture-modal.component.html',
  styleUrls: ['./facture-modal.component.scss'],
})
export class FactureModalComponent {
  factureOptions = [
    {
      label: 'Option 1',
      image: 'https://via.placeholder.com/150',
    },
    {
      label: 'Option 2',
      image: 'https://via.placeholder.com/150',
    },
    {
      label: 'Option 3',
      image: 'https://via.placeholder.com/150',
    },
  ];

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  selectOption(option: any) {
    console.log('Selected Option:', option);
    this.modalController.dismiss(option);
  }
}