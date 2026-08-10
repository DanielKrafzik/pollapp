import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SurveyForm } from '../survey-form/survey-form';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [NgFor, NgClass, FormsModule, RouterLink, SurveyForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  selectedFilter: 'active' | 'past' = 'active';
  selectedCategory = 'All Surveys';
  showCategories = false;
  dropdownArrow = 'assets/imgs/arrow_drop_down_down.png';
  exampleImg = 'assets/imgs/example2.png';
  showSurveyForm = false;

  categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation'
  ];

  constructor(public supabase: Supabase) {}

    /**
   * Initializes the component and loads the required survey data from Supabase.
   * Fetches a specific survey by its ID and retrieves all available surveys.
   *
   * @returns A Promise that resolves when all survey data has been loaded.
   */
    async ngOnInit() {
    const survey = await this.supabase.getSurvey(1);
    const surveys = await this.supabase.getSurveys();
  }

    /**
   * Sets the currently selected survey filter.
   *
   * @param filter - The filter to apply. Can be either 'active' or 'past'.
   */
  setFilter(filter: 'active' | 'past') {
    this.selectedFilter = filter;
  }

  /**
 * Toggles the visibility of the category dropdown
 * and updates the dropdown arrow based on its current state.
 */
  toggleCategories() {
    this.showCategories = !this.showCategories;
    this.dropdownArrow === 'assets/imgs/arrow_drop_down_down_or.png' ? this.dropdownArrow = 'assets/imgs/arrow_drop_down_up_or.png' : this.dropdownArrow = 'assets/imgs/arrow_drop_down_down_or.png';
  }

  /**
 * Selects a survey category, closes the category dropdown,
 * and resets the dropdown arrow to its default state.
 *
 * @param category - The category to select.
 */
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.showCategories = false;
    this.dropdownArrow = 'assets/imgs/arrow_drop_down_down.png';
  }

  /**
 * Returns a human-readable text describing when a survey ends
 * based on the provided end date.
 *
 * @param enddate - The end date of the survey.
 * @returns A formatted string indicating whether the survey has ended,
 * ends today, or how many days remain.
 */
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

  /**
 * Updates the dropdown arrow image to its hover state
 * based on whether the category dropdown is open or closed.
 */
  hoverSrc() {
    if(this.dropdownArrow === 'assets/imgs/arrow_drop_down_down.png') this.dropdownArrow = 'assets/imgs/arrow_drop_down_down_or.png';
    else if(this.dropdownArrow === 'assets/imgs/arrow_drop_down_up.png') this.dropdownArrow = 'assets/imgs/arrow_drop_down_up_or.png';
  }

  /**
 * Resets the dropdown arrow image from its hover state
 * to its default state based on whether the dropdown is open or closed.
 */
  leaveHoverSrc() {
    if (this.dropdownArrow === 'assets/imgs/arrow_drop_down_down_or.png') this.dropdownArrow = 'assets/imgs/arrow_drop_down_down.png';
     else if (this.dropdownArrow === 'assets/imgs/arrow_drop_down_up_or.png') this.dropdownArrow = 'assets/imgs/arrow_drop_down_up.png';
  }

  /**
 * Filters all surveys based on the selected status and category.
 * Surveys without an end date are considered active.
 *
 * @returns An array of surveys matching the selected status and category.
 */

  getFilteredSurveys() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.supabase.surveys().filter(survey => {
      let matchesStatus = false;
      if (!survey.enddate) matchesStatus = this.selectedFilter === 'active';
      else {
        const endDate = new Date(survey.enddate);
        if (this.selectedFilter === 'active') matchesStatus = endDate >= today;
        else matchesStatus = endDate < today;          
      }
      const matchesCategory = this.selectedCategory === 'All Surveys' || survey.category === this.selectedCategory;
      return matchesStatus && matchesCategory;
    });
  }

  /**
 * Returns up to three active surveys that are ending soon.
 * Surveys without an end date and surveys that have already ended
 * are excluded. The remaining surveys are sorted by their end date
 * in ascending order.
 *
 * @returns An array containing up to three surveys with the nearest end dates.
 */
  getEndingSoonSurveys() {
    const today = new Date();
    return [...this.supabase.surveys()].filter(survey => survey.enddate && new Date(survey.enddate) >= today).sort((a, b) => new Date(a.enddate).getTime() - new Date(b.enddate).getTime()).slice(0, 3);
  }

  /**
 * Opens the survey form overlay and disables page scrolling.
 */
  openSurveyForm() {
    this.showSurveyForm = true;
    document.body.style.overflow = 'hidden';
  }

  /**
 * Closes the survey form overlay and restores page scrolling.
 */
  closeSurveyForm() {
    this.showSurveyForm = false;
    document.body.style.overflow = '';
  }

  /**
 * Closes the category dropdown when the user clicks outside of it.
 *
 * @param event The click event triggered on the document.
 */
  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.category-dropdown')) {
      this.showCategories = false;
      this.dropdownArrow = 'assets/imgs/arrow_drop_down_down.png';
    }
  }
}
