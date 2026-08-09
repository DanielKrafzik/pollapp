import { Component, signal } from '@angular/core';
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
  dropdownArrow = '/assets/imgs/arrow_drop_down_down.png';
  selectedCategory = '';

  binPath1 = '/assets/imgs/Bin.png';
  binPath2 = '/assets/imgs/Bin.png';
  binPath3 = '/assets/imgs/Bin.png';
  questionForms = [
    {
      id: 1,
      question: '',
      multiple_answers: false,
      answers: [
        {letter: 'A', text: ""},
        {letter: 'B', text: ""}
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
  description = '';
  enddate = '';
  minDate = new Date().toISOString().split('T')[0];
  createdSurveyId: number | null = null;
  showPublishedOverlay = signal(false);

  constructor(public supabase: Supabase, private route: ActivatedRoute, private router: Router) {}

  addQuestionForm() {
    this.questionForms.push({
      id: this.questionForms.length + 1,
      question: '',
      multiple_answers: false,
      answers: [
        { letter: 'A', text: '' },
        { letter: 'B', text: '' }
      ]
    });
  }

  toggleCategories() {
    this.showCategories = !this.showCategories;
    this.dropdownArrow === '/assets/imgs/arrow_drop_down_down_or.png' ? this.dropdownArrow = '/assets/imgs/arrow_drop_down_up_or.png' : this.dropdownArrow = '/assets/imgs/arrow_drop_down_down_or.png';
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

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.showCategories = false;
    this.dropdownArrow = '/assets/imgs/arrow_drop_down_down.png';
  }

  removeQuestion(index: number) {
    if (index === 0) {
      this.questionForms[0].question = '';
      this.questionForms[0].multiple_answers = false;
      this.questionForms[0].answers = [
        { letter: 'A', text: '' },
        { letter: 'B', text: '' }
      ];
    } else {
      this.questionForms.splice(index, 1);

      this.questionForms.forEach((question, i) => {
        question.id = i + 1;
      });
    }
  }

  async publishSurvey() {

    if (!this.canPublish()) {
      alert('Please fill in all required fields');
      return;
    }

    const createdSurvey = await this.supabase.createSurvey({
      name: this.name,
      description: this.description,
      category: this.selectedCategory,
      enddate: this.enddate || null
    });

    if (!createdSurvey) return;

    await this.supabase.createQuestions(
      createdSurvey.id,
      this.questionForms
    );

    this.createdSurveyId = createdSurvey.id;
    this.showPublishedOverlay.set(true);
    document.body.style.overflow = 'hidden';
  }

  clearField(field: 'name' | 'description' | 'enddate') {
    this[field] = '';
  }

  canPublish(): boolean {
    if (!this.name.trim() || this.name.length < 3) return false;
    if (!this.selectedCategory.trim()) return false;

    for (const question of this.questionForms) {
      if (!question.question.trim() || question.question.length < 3) {
        return false;
      }

      if (question.answers.length < 2) {
        return false;
      }

      for (const answer of question.answers) {
        if (!answer.text.trim()) {
          return false;
        }
      }
    }

    return true;
  }

  goToSurvey() {
    document.body.style.overflow = '';
    if (this.createdSurveyId === null) return;

    this.router.navigate(['/survey', this.createdSurveyId]);
  }
}
