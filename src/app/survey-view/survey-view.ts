import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-survey-view',
  imports: [NgFor, NgClass, CommonModule, FormsModule, RouterLink],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  survey = signal<any>(null);
  questions = signal<any[]>([]);
  selectedAnswers: { [questionId: number]: string[] } = {};
  formattedEndDate: string = '';

  constructor(
    private route: ActivatedRoute,
    public supabase: Supabase,
    private router: Router
  ) {}

  async ngOnInit() {
    const surveyId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const surveyData =
    await this.supabase.getSurvey(surveyId);
    this.survey.set(surveyData);
    const questionData =
      await this.supabase.getSurveyQuestions(surveyId) ?? [];
      if (surveyData?.enddate) {
        this.formattedEndDate =
          surveyData.enddate.split('-')[2] + '.' +
          surveyData.enddate.split('-')[1] + '.' +
          surveyData.enddate.split('-')[0];
      }

      const mappedQuestions = questionData.map(question => {
        const total =
          (question.A_count ?? 0) +
          (question.B_count ?? 0) +
          (question.C_count ?? 0) +
          (question.D_count ?? 0) +
          (question.E_count ?? 0) +
          (question.F_count ?? 0);

        return {
          ...question,
          totalVotes: total,

          A_percentage: total
            ? Math.round(((question.A_count ?? 0) / total) * 100)
            : 0,

          B_percentage: total
            ? Math.round(((question.B_count ?? 0) / total) * 100)
            : 0,

          C_percentage: total
            ? Math.round(((question.C_count ?? 0) / total) * 100)
            : 0,

          D_percentage: total
            ? Math.round(((question.D_count ?? 0) / total) * 100)
            : 0,

          E_percentage: total
            ? Math.round(((question.E_count ?? 0) / total) * 100)
            : 0,

          F_percentage: total
            ? Math.round(((question.F_count ?? 0) / total) * 100)
            : 0
        };
      });
      this.questions.set(mappedQuestions);
  }

  hasAnyVotes(): boolean {
    return this.questions().some(question => question.totalVotes > 0);
  }

  selectAnswer(
    questionId: number,
    answer: string,
    multipleAnswers: boolean,
    event: Event
  ) {
    const checked = (event.target as HTMLInputElement).checked;

    if (!this.selectedAnswers[questionId]) {
      this.selectedAnswers[questionId] = [];
    }

    if (multipleAnswers) {
      if (checked) {
        this.selectedAnswers[questionId].push(answer);
      } else {
        this.selectedAnswers[questionId] =
          this.selectedAnswers[questionId].filter(a => a !== answer);
      }
    } else {
      this.selectedAnswers[questionId] = [answer];
    }
  }

  isSurveyEnded(): boolean {
    const survey = this.survey();

    if (!survey?.enddate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(survey.enddate);

    return endDate < today;
  }

  async completeSurvey() {

    for (const questionId in this.selectedAnswers) {

      const answers = this.selectedAnswers[questionId];

      for (const answer of answers) {

        await this.supabase.vote(
          Number(questionId),
          answer as 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
        );

      }

    }

    this.router.navigate(['/']);
  }
}
