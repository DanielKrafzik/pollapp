import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgClass, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  selectedFilter: 'active' | 'past' = 'active';
  selectedCategory: string = '';

  constructor(public supabase: Supabase) {}

    async ngOnInit() {
    const surveys = await this.supabase.getSurveys();
  }

  setFilter(filter: 'active' | 'past') {
    this.selectedFilter = filter;
  }

  getEndsInText(enddate: string): string {
    const today = new Date();
    const end = new Date(enddate);

    const diffDays = Math.ceil(
      (end.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return 'Ends in 1 day';

    return `Ends in ${diffDays} days`;
  }
}
