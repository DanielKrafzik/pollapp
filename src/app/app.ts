import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Supabase } from './supabase';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pollapp');
  dbService = inject(Supabase);

  /**
 * Initializes the component by loading a specific survey
 * and its associated questions from the database.
 */
  async ngOnInit() {
    await this.dbService.getSurvey(2);
    await this.dbService.getSurveyQuestions(1);
  }
}
