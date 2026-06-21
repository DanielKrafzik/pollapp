import { Routes } from '@angular/router';
import { Home } from './home/home';
import { SurveyView } from './survey-view/survey-view';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'survey/:id', component: SurveyView }
];
