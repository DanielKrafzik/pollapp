import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgClass, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  selectedFilter: 'active' | 'past' = 'active';
  selectedCategory = '';
  showCategories = false;
  dropdownArrow = '/assets/imgs/arrow_drop_down_down.png';

  categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation'
  ];

  constructor(public supabase: Supabase) {}

    async ngOnInit() {
    const survey = await this.supabase.getSurvey(1);
    const surveys = await this.supabase.getSurveys();
  }

  setFilter(filter: 'active' | 'past') {
    this.selectedFilter = filter;
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
    this.dropdownArrow === '/assets/imgs/arrow_drop_down_down_or.png' ? this.dropdownArrow = '/assets/imgs/arrow_drop_down_up_or.png' : this.dropdownArrow = '/assets/imgs/arrow_drop_down_down_or.png';
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.showCategories = false;
    this.dropdownArrow = '/assets/imgs/arrow_drop_down_down.png';
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

  hoverSrc() {
    if(this.dropdownArrow === '/assets/imgs/arrow_drop_down_down.png')      this.dropdownArrow = '/assets/imgs/arrow_drop_down_down_or.png';
    else if(this.dropdownArrow === '/assets/imgs/arrow_drop_down_up.png') this.dropdownArrow = '/assets/imgs/arrow_drop_down_up_or.png';
  }

  leaveHoverSrc() {
    if (this.dropdownArrow === '/assets/imgs/arrow_drop_down_down_or.png') {
      this.dropdownArrow = '/assets/imgs/arrow_drop_down_down.png';
    } else if (this.dropdownArrow === '/assets/imgs/arrow_drop_down_up_or.png') {
      this.dropdownArrow = '/assets/imgs/arrow_drop_down_up.png';
    }
  }

  getEndingSoonSurveys() {
    const today = new Date();

    return [...this.supabase.surveys()]
      .filter(survey =>
        survey.enddate &&
        new Date(survey.enddate) >= today
      )
      .sort((a, b) =>
        new Date(a.enddate).getTime() - new Date(b.enddate).getTime()
      )
      .slice(0, 3);
  }
}
