import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ModalService {

  isOpen = false;                   // открыта ли модалка
  onAccept = new Subject<string>(); // событие передачи текста

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  accept(value: string) {
    this.onAccept.next(value); // отправляем текст во внешний мир
    this.close();              // закрываем модалку
  }
}
