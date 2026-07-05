import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SurveyView } from './survey-view/survey-view';
import { SurveyForm } from './survey-form/survey-form';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'survey/:id', component: SurveyView },
    { path: 'survey-form', component: SurveyForm }
];
