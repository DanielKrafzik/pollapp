import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
 supabase = createClient('https://kbxmuqupovbproxzpdxz.supabase.co', 'sb_publishable_O-oDpOY5VP1ox1WDp9-qTQ_IOSpHwsg')

 surveys = signal<{ id: number, created_at: string, name: string, enddate: string, description: string, category: string }[]>([]);

 surveyQuestions = signal<{ id: number, created_at: string, question: string, multiple_answers: boolean, A: string, B: string, C: string, D: string, E: string, F: string, A_count: number, B_count: number, C_count: number, D_count: number, E_count: number, F_count: number, survey_id: number }[]>([]);

 async getSurvey(id: number) {
    const { data } = await this.supabase
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();

    return data;
  }

  async getSurveys() {
    const { data, error } = await this.supabase
      .from('surveys')
      .select('*');

    if (!data) return;

    this.surveys.set(data);
  }

  survey: any[] = [];
  questions: any[] = [];

  async getSurveyQuestions(surveyId: number) {
    const { data: surveyQuestions, error } = await this.supabase
      .from('survey_questions')
      .select('*')
      .eq('survey_id', surveyId);

    if (!surveyQuestions) return;
    this.surveyQuestions.set(surveyQuestions);

    return surveyQuestions;
  }

  async loadSurvey(surveyId: number) {
    this.survey = await this.getSurvey(surveyId) ?? [];

    this.questions =
      await this.getSurveyQuestions(surveyId) ?? [];
  }

  async vote(
    questionId: number,
    answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  ) {  
  const { data } = await this.supabase
    .from('survey_questions')
    .select('*')
    .eq('id', questionId)
    .single();

  if (!data) return;

  const column = `${answer}_count`;
  const newValue = (data[column] ?? 0) + 1;
  await this.supabase
    .from('survey_questions')
    .update({
        [column]: newValue
    })
    .eq('id', questionId);
  }

  async createSurvey(survey: {
    name: string;
    description: string;
    category: string;
    enddate: string;
  }) {
    const { data, error } = await this.supabase
      .from('surveys')
      .insert(survey)
      .select()
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  }

  async createQuestions(surveyId: number, questions: any[]) {
    const rows = questions.map(question => ({
      survey_id: surveyId,
      question: question.question,
      multiple_answers: question.multiple_answers,

      A: question.answers[0]?.text ?? '',
      B: question.answers[1]?.text ?? '',
      C: question.answers[2]?.text ?? '',
      D: question.answers[3]?.text ?? '',
      E: question.answers[4]?.text ?? '',
      F: question.answers[5]?.text ?? '',

      A_count: 0,
      B_count: 0,
      C_count: 0,
      D_count: 0,
      E_count: 0,
      F_count: 0
    }));

    const { error } = await this.supabase
      .from('survey_questions')
      .insert(rows);

    if (error) {
      console.error(error);
    }
  }
}
