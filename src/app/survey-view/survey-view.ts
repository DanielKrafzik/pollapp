import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-view',
  imports: [NgFor, NgClass, FormsModule, RouterLink],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  survey: any;
  questions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public supabase: Supabase
  ) {}

  async ngOnInit() {
    const surveyId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.survey =
      await this.supabase.getSurvey(surveyId);

    this.questions =
      await this.supabase.getSurveyQuestions(
        surveyId
      ) ?? [];
  }
}
