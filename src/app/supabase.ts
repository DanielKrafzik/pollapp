import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
 supabase = createClient('https://kbxmuqupovbproxzpdxz.supabase.co', 'sb_publishable_O-oDpOY5VP1ox1WDp9-qTQ_IOSpHwsg');
 surveys = signal<{ id: number, created_at: string, name: string, enddate: string, description: string, category: string }[]>([]);
 surveyQuestions = signal<{ id: number, created_at: string, question: string, multiple_answers: boolean, A: string, B: string, C: string, D: string, E: string, F: string, A_count: number, B_count: number, C_count: number, D_count: number, E_count: number, F_count: number, survey_id: number }[]>([]);

 survey: any[] = [];
 questions: any[] = [];

 /**
 * Retrieves a single survey from Supabase by its unique ID.
 *
 * @param id - The unique ID of the survey to retrieve.
 * @returns A Promise containing the survey data, or null if no survey is found.
 */
  async getSurvey(id: number) {
    const { data } = await this.supabase.from('surveys').select('*').eq('id', id).single();
    return data;
  }

  /**
 * Retrieves all surveys from Supabase and updates the surveys signal
 * with the returned data.
 *
 * @returns A Promise that resolves when the surveys have been loaded.
 */
  async getSurveys() {
    const { data, error } = await this.supabase.from('surveys').select('*');
    if (!data) return;
    this.surveys.set(data);
  }

  /**
 * Retrieves all questions associated with a specific survey from Supabase
 * and updates the survey questions signal with the returned data.
 *
 * @param surveyId - The unique ID of the survey whose questions should be retrieved.
 * @returns A Promise containing the survey questions, or undefined if no data is returned.
 */
  async getSurveyQuestions(surveyId: number) {
    const { data: surveyQuestions, error } = await this.supabase.from('survey_questions').select('*').eq('survey_id', surveyId);
    if (!surveyQuestions) return;
    this.surveyQuestions.set(surveyQuestions);
    return surveyQuestions;
  }

  /**
 * Loads a specific survey and its associated questions.
 * If no survey or questions are returned, empty arrays are used as fallback values.
 *
 * @param surveyId - The unique ID of the survey to load.
 * @returns A Promise that resolves when the survey and its questions have been loaded.
 */
  async loadSurvey(surveyId: number) {
    this.survey = await this.getSurvey(surveyId) ?? [];
    this.questions = await this.getSurveyQuestions(surveyId) ?? [];
  }

  /**
 * Records a vote for a specific answer option of a survey question.
 * Retrieves the current vote count, increments it by one,
 * and updates the corresponding answer count in Supabase.
 *
 * @param questionId - The unique ID of the question being voted on.
 * @param answer - The selected answer option from A to F.
 * @returns A Promise that resolves when the vote has been updated.
 */
  async vote(questionId: number, answer: 'A' | 'B' | 'C' | 'D' | 'E' | 'F') {  
    const { data } = await this.supabase.from('survey_questions').select('*').eq('id', questionId).single();
    if (!data) return;
    const column = `${answer}_count`;
    const newValue = (data[column] ?? 0) + 1;
    await this.supabase.from('survey_questions').update({[column]: newValue}).eq('id', questionId);
  }

  /**
 * Creates a new survey in Supabase using the provided survey data.
 * The newly created survey is returned after a successful insertion.
 *
 * @param survey - The survey data including name, description, category, and optional end date.
 * @returns A Promise containing the created survey data, or null if an error occurs.
 */
  async createSurvey(survey: {name: string; description: string; category: string; enddate: string | null;}) {
    const { data, error } = await this.supabase.from('surveys').insert(survey).select().single();
    if (error) return null;
    return data;
  }

  /**
 * Creates and stores all questions for a specific survey in Supabase.
 * Maps each question and its answer options to the database structure,
 * initializes all vote counters to zero, and assigns the corresponding survey ID.
 *
 * @param surveyId - The unique ID of the survey the questions belong to.
 * @param questions - An array containing the questions and their answer options.
 * @returns A Promise that resolves when all questions have been inserted.
 */
  async createQuestions(surveyId: number, questions: any[]) {
    const rows = questions.map(question => ({ survey_id: surveyId, question: question.question, multiple_answers: question.multiple_answers, A: question.answers[0]?.text ?? '', B: question.answers[1]?.text ?? '', C: question.answers[2]?.text ?? '', D: question.answers[3]?.text ?? '', E: question.answers[4]?.text ?? '', F: question.answers[5]?.text ?? '', A_count: 0, B_count: 0, C_count: 0, D_count: 0, E_count: 0, F_count: 0}));
    const { error } = await this.supabase.from('survey_questions').insert(rows);
  }
}
