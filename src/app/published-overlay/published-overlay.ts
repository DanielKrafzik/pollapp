import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-published-overlay',
  imports: [],
  templateUrl: './published-overlay.html',
  styleUrl: './published-overlay.scss',
})
export class PublishedOverlay {
  @Output() closeOverlay = new EventEmitter<void>();

  close() {
    this.closeOverlay.emit();
  }
}
