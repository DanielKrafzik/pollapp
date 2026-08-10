import { Component } from '@angular/core';
import { Supabase } from '../supabase';
import { NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { SurveyForm } from '../survey-form/survey-form';

@Component({
  selector: 'app-survey-view',
  imports: [NgFor, NgClass, CommonModule, FormsModule, RouterLink, SurveyForm],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  survey = signal<any>(null);
  questions = signal<any[]>([]);
  selectedAnswers: { [questionId: number]: string[] } = {};
  formattedEndDate: string = '';
  showResults = true;
  showSurveyForm = false;
  hasCompletedSurvey = false;

  constructor(
    private route: ActivatedRoute,
    public supabase: Supabase,
    private router: Router
  ) {}

  /**
 * Initializes the survey view by loading the selected survey and its questions
 * from Supabase. Formats the survey end date and calculates the total number
 * of votes and percentage distribution for each answer option.
 */
  async ngOnInit() {
    const surveyId = Number(this.route.snapshot.paramMap.get('id'));
    this.hasCompletedSurvey = localStorage.getItem(`survey-${surveyId}-completed`) === 'true';
    const surveyData =
    await this.supabase.getSurvey(surveyId);
    this.survey.set(surveyData);
    const questionData = await this.supabase.getSurveyQuestions(surveyId) ?? [];
    if (surveyData?.enddate) this.formattedEndDate = surveyData.enddate.split('-')[2] + '.' + surveyData.enddate.split('-')[1] + '.' + surveyData.enddate.split('-')[0];
    const mappedQuestions = questionData.map(question => {
      const total = (question.A_count ?? 0) + (question.B_count ?? 0) + (question.C_count ?? 0) + (question.D_count ?? 0) + (question.E_count ?? 0) + (question.F_count ?? 0);
      return {...question, totalVotes: total, A_percentage: total ? Math.round(((question.A_count ?? 0) / total) * 100) : 0, B_percentage: total ? Math.round(((question.B_count ?? 0) / total) * 100) : 0, C_percentage: total ? Math.round(((question.C_count ?? 0) / total) * 100) : 0, D_percentage: total ? Math.round(((question.D_count ?? 0) / total) * 100) : 0, E_percentage: total ? Math.round(((question.E_count ?? 0) / total) * 100) : 0, F_percentage: total ? Math.round(((question.F_count ?? 0) / total) * 100) : 0};
    });
    this.questions.set(mappedQuestions);
  }

  /**
 * Checks whether at least one question in the survey has received a vote.
 *
 * @returns `true` if at least one question has votes, otherwise `false`.
 */
  hasAnyVotes(): boolean {
    const hasStoredVotes = this.questions().some(question => question.totalVotes > 0);
    const hasSelectedAnswers = Object.values(this.selectedAnswers).some(answers => answers.length > 0);
    return hasStoredVotes || hasSelectedAnswers;
  }

  /**
 * Stores the selected answer for a question.
 * For multiple-choice questions, answers are added or removed based on
 * the checkbox state. For single-choice questions, the previous selection
 * is replaced by the newly selected answer.
 *
 * @param questionId - The ID of the question being answered.
 * @param answer - The selected answer option.
 * @param multipleAnswers - Indicates whether multiple answers are allowed.
 * @param event - The change event triggered by the answer input.
 */
  selectAnswer(questionId: number, answer: string, multipleAnswers: boolean, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (!this.selectedAnswers[questionId]) this.selectedAnswers[questionId] = [];
    if (multipleAnswers) {
      if (checked) this.selectedAnswers[questionId].push(answer);
      else this.selectedAnswers[questionId] = this.selectedAnswers[questionId].filter(a => a !== answer);      
    } else this.selectedAnswers[questionId] = [answer];    
  }

  /**
 * Checks whether the current survey has already ended.
 * Surveys without an end date are considered active.
 *
 * @returns `true` if the survey end date is in the past, otherwise `false`.
 */
  isSurveyEnded(): boolean {
    const survey = this.survey();
    if (!survey?.enddate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(survey.enddate);
    return endDate < today;
  }

  /**
 * Submits all selected answers for the survey to Supabase.
 * Each selected answer is recorded as a vote for its corresponding question.
 * After all votes have been submitted, the user is redirected to the home page.
 */
  async completeSurvey() {
    const surveyId = Number(this.route.snapshot.paramMap.get('id'));
    for (const questionId in this.selectedAnswers) {
      const answers = this.selectedAnswers[questionId];
      for (const answer of answers) {await this.supabase.vote(Number(questionId), answer as 'A' | 'B' | 'C' | 'D' | 'E' | 'F');}
    }
    localStorage.setItem(`survey-${surveyId}-completed`,'true');
    this.router.navigate(['/']);
  }

  /**
 * Toggles the visibility of the survey results section.
 */
  toggleResults() {
    this.showResults = !this.showResults;
  }

  openSurveyForm() {
    this.showSurveyForm = true;
    document.body.style.overflow = 'hidden';
  }

  closeSurveyForm() {
    this.showSurveyForm = false;
    document.body.style.overflow = '';
  }

  getPreviewCount(
    question: any,
    answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  ): number {
    const baseCount = question[`${answer}_count`] ?? 0;

    const isSelected =
      this.selectedAnswers[question.id]?.includes(answer);

    return baseCount + (isSelected ? 1 : 0);
  }

  getPreviewTotal(question: any): number {
    const selectedCount =
      this.selectedAnswers[question.id]?.length ?? 0;

    return question.totalVotes + selectedCount;
  }

  getPreviewPercentage(
    question: any,
    answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  ): number {
    const total = this.getPreviewTotal(question);

    if (total === 0) return 0;

    const count = this.getPreviewCount(question, answer);

    return Math.round((count / total) * 100);
}
}
