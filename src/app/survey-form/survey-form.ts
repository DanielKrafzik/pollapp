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

  binPath1 = '/assets/imgs/Bin.png';
  binPath2 = '/assets/imgs/Bin.png';
  binPath3 = '/assets/imgs/Bin.png';
  questionForms = [
    {
      id: 1,
      question: '',
      multiple_answers: false
    }
  ];

  addQuestionForm() {
    this.questionForms.push({
      id: this.questionForms.length + 1,
      question: '',
      multiple_answers: false
    });
  }
}
