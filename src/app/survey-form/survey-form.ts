import { Component, signal, EventEmitter, Output } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { QuestionForm } from '../question-form/question-form';
import { PublishedOverlay } from '../published-overlay/published-overlay';

@Component({
  selector: 'app-survey-form',
  imports: [CommonModule, FormsModule, RouterLink, QuestionForm, PublishedOverlay],
  templateUrl: './survey-form.html',
  styleUrl: './survey-form.scss',
})
export class SurveyForm {
  showCategories = false;
  dropdownArrow = 'assets/imgs/arrow_drop_down_down.png';
  selectedCategory = '';

  binPath1 = 'assets/imgs/Bin.png';
  binPath2 = 'assets/imgs/Bin.png';
  binPath3 = 'assets/imgs/Bin.png';
  questionForms = [
    {
      id: 1,
      question: '',
      multiple_answers: false,
      error: false,
      answers: [
        {letter: 'A', text: "", error: false},
        {letter: 'B', text: "", error: false}
      ]
    }
  ];
  categories = [
    'Team Activities',
    'Health & Wellness',
    'Gaming & Entertainment',
    'Education & Learning',
    'Lifestyle & Preferences',
    'Technology & Innovation'
  ];

  name = '';
  nameError = false;
  categoryError = false;
  description = '';
  enddate = '';
  minDate = new Date().toISOString().split('T')[0];
  createdSurveyId: number | null = null;
  showPublishedOverlay = signal(false);

  @Output() closeForm = new EventEmitter<void>();

  constructor(public supabase: Supabase, private route: ActivatedRoute, private router: Router) {}

  /**
 * Adds a new empty question form to the survey.
 * Each new question starts with two empty answer options (A and B)
 * and allows only a single answer by default.
 */
  addQuestionForm() {
    this.questionForms.push({
      id: this.questionForms.length + 1,
      question: '',
      multiple_answers: false,
      error: false,
      answers: [
        { letter: 'A', text: '', error: false },
        { letter: 'B', text: '', error: false }
      ]
    });
  }

  /**
 * Toggles the visibility of the category dropdown
 * and updates the dropdown arrow to match its current state.
 */
  toggleCategories() {
    this.showCategories = !this.showCategories;
    this.dropdownArrow === 'assets/imgs/arrow_drop_down_down_or.png' ? this.dropdownArrow = 'assets/imgs/arrow_drop_down_up_or.png' : this.dropdownArrow = 'assets/imgs/arrow_drop_down_down_or.png';
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
 * to its default state based on whether the category dropdown is open or closed.
 */
  leaveHoverSrc() {
    if (this.dropdownArrow === 'assets/imgs/arrow_drop_down_down_or.png') this.dropdownArrow = 'assets/imgs/arrow_drop_down_down.png';
    else if (this.dropdownArrow === 'assets/imgs/arrow_drop_down_up_or.png') this.dropdownArrow = 'assets/imgs/arrow_drop_down_up.png';    
  }

  /**
 * Selects the specified survey category, closes the category dropdown,
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
 * Removes a question from the survey.
 * If the first question is selected, it is reset to its initial state
 * instead of being removed. All other questions are removed completely,
 * and the remaining question IDs are reassigned in sequential order.
 *
 * @param index - The index of the question to reset or remove.
 */
  removeQuestion(index: number) {
    if (index === 0) {
      this.questionForms[0].question = '';
    } else {
      this.questionForms.splice(index, 1);
      this.questionForms.forEach((question, i) => {question.id = i + 1;});
    }
  }

  /**
 * Generates a default end date three days from the current date.
 *
 * @returns The default end date in YYYY-MM-DD format.
 */
  getDefaultEndDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toISOString().split('T')[0];
  }

  /**
 * Validates and publishes the survey to Supabase.
 * After the survey is created, its questions are stored using the generated
 * survey ID. Finally, the published overlay is displayed and page scrolling
 * is disabled while the overlay is open.
 */
  async publishSurvey() {
    this.validateAllFields();
    if (!this.canPublish()) return;
    const createdSurvey = await this.supabase.createSurvey({ name: this.name, description: this.description, category: this.selectedCategory, enddate: this.enddate || this.getDefaultEndDate()});
    if (!createdSurvey) return;
    await this.supabase.createQuestions(createdSurvey.id, this.questionForms);
    this.createdSurveyId = createdSurvey.id;
    this.showPublishedOverlay.set(true);
    setTimeout(() => {
      this.showPublishedOverlay.set(false);
      document.body.style.overflow = '';
      this.goToSurvey();
    }, 3000);
    document.body.style.overflow = 'hidden';
  }

  /**
 * Clears the value of the specified survey form field.
 *
 * @param field - The form field to clear. Can be 'name', 'description', or 'enddate'.
 */
  clearField(field: 'name' | 'description' | 'enddate') {
    this[field] = '';
  }

  /**
 * Checks whether all required survey fields are valid and complete.
 * The survey must have a valid name, a selected category, and valid questions.
 * Each question must contain at least two non-empty answer options.
 *
 * @returns `true` if the survey can be published, otherwise `false`.
 */
  canPublish(): boolean {
    if (!this.name.trim() || this.name.length < 3) return false;
    if (!this.selectedCategory.trim()) return false;
    for (const question of this.questionForms) {
      if (!question.question.trim() || question.question.length < 3) return false;
      if (question.answers.length < 2) return false;
      for (const answer of question.answers) {
        if (!answer.text.trim()) return false;        
      }
    }
    return true;
  }

  /**
 * Navigates to the newly created survey and restores page scrolling.
 * Navigation is only performed if a valid survey ID is available.
 */
  goToSurvey() {
    document.body.style.overflow = '';
    if (this.createdSurveyId === null) return;
    this.router.navigate(['/survey', this.createdSurveyId]);
  }

  /**
 * Validates the selected survey end date.
 * Clears the value if the selected date is earlier than the current date.
 */
  validateEndDate() {
    if (this.enddate && this.enddate < this.minDate) {
      this.enddate = this.getDefaultEndDate();;
    }
  }

  /**
 * Closes the survey form overlay and restores page scrolling.
 */
  closeSurveyForm() {
    this.closeForm.emit();
  }

  /**
 * Validates the survey name and sets the error state
 * if it contains fewer than three characters.
 */
  validateName() {
    this.nameError = this.name.trim().length < 3;
  }

  /**
 * Validates all required fields of the survey form.
 * Checks the survey name, category, questions, and answers
 * and sets their corresponding error states.
 */
  validateAllFields() {
    this.nameError = !this.name.trim() || this.name.trim().length < 3;
    this.categoryError = !this.selectedCategory.trim();
    for (const question of this.questionForms) {
      question.error = !question.question.trim() || question.question.trim().length < 3;
      for (const answer of question.answers) {
        answer.error = !answer.text.trim();
      }
    }
  }
}