import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { QuestionForm } from '../question-form/question-form';

@Component({
  selector: 'app-survey-form',
  imports: [CommonModule, FormsModule, RouterLink, QuestionForm],
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

  constructor(public supabase: Supabase, private route: ActivatedRoute) {}

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

    const createdSurvey = await this.supabase.createSurvey({
      name: this.name,
      description: this.description,
      category: this.selectedCategory,
      enddate: this.enddate
    });

    if (!createdSurvey) return;

    await this.supabase.createQuestions(
      createdSurvey.id,
      this.questionForms
    );

    console.log('Survey erfolgreich gespeichert!');
  }
}
