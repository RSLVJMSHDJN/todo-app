import { Component } from '@angular/core';
import { ModalService } from './modal.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './modal-component.html',
  styleUrl: './modal-component.scss',
})
export class ModalComponent {

  inputValue = '';
ModalComponent: any;

  constructor(public modal: ModalService) {}

  accept() {
    const v = this.inputValue.trim();
    if (!v) return;

    this.modal.accept(v); // отправляем текст
    this.inputValue = '';
  }

  cancel() {
    this.modal.close();
    this.inputValue = '';
  }
}
