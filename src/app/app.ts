import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { ModalComponent } from './ModalComponent/modal-component/modal-component';
import { ModalService } from './ModalComponent/modal-component/modal.service';
import { Note } from './models/note.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Header } from "./header/header";
import { RouterOutlet } from "@angular/router";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ModalComponent, Header, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {

  notes = signal<Note[]>([]);
  sub!: Subscription;

  search = ''; // то, что пишеем в input
  searchQuery = ''; // выполняется поиск после нажатия на кнопки

  constructor(private ModalComponent: ModalService) {}

  get filteredNotes() {
    // const query = this.search.toLowerCase().trim();

    if (!this.searchQuery) return this.notes(); // если строка поиска пустая - возвращаем все записи

    return this.notes().filter(n =>
      n.content.toLowerCase().includes(this.searchQuery)
    );
  }

  ngOnInit() {
    // if(localStorage){
    //    const saved = localStorage?.getItem('notes')
    // if(saved) {
    //   try {
    //     this.notes.set(JSON.parse(saved));
    //   } catch {
    //     console.error(' error чтения localSorage');
    //   }
    // }
    // }
   
    
    this.sub = this.ModalComponent.onAccept.subscribe(value => {
      this.notes.update(prev => [
        ...prev,
        {
          id: Date.now(),
          content: value,
          createdAt: new Date(),
          completed: false,
        }
      ]);
      this.saveNotes(); // сохраняем
    });
  }

  saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes())); // сохраняем
  }

  doSearch() {
    this.searchQuery = this.search.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openModal() {
    this.ModalComponent.open();
  }


  toggleCompleted(id: number) {
    this.notes.update(prev =>
      prev.map(note =>
        note.id === id? { ...note, completed: !note.completed }
        : note
      )
    );
    this.saveNotes(); // сохраняем
  }

  deleteNote(id: number) {
    this.notes.update(prev => prev.filter(n => n.id !== id));
    this.saveNotes(); // сохраняем
  }


  get totalFiltered() {
    return this.filteredNotes.length;
  }

  get completedFiltered() {
    return this.filteredNotes.filter(n => n.completed).length;
  }

  get totalTasks() {
    return this.notes().length;
  }


  get completedTasks() {
    return this.notes().filter(n => n.completed).length;
  }
}
