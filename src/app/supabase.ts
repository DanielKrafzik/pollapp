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

survey: any;
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
  this.survey = await this.getSurvey(surveyId);

  this.questions =
    await this.getSurveyQuestions(surveyId) ?? [];
}
}
