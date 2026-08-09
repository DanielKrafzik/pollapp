import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-published-overlay',
  imports: [],
  templateUrl: './published-overlay.html',
  styleUrl: './published-overlay.scss',
})
export class PublishedOverlay {
  @Output() closeOverlay = new EventEmitter<void>();

  /**
 * Emits the close event to notify the parent component
 * that the published overlay should be closed.
 */
  close() {
    this.closeOverlay.emit();
  }
}
