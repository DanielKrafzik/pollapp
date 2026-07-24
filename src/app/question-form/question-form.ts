import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Input} from '@angular/core';



@Component({
  selector: 'app-question-form',
  imports: [CommonModule],
  templateUrl: './question-form.html',
  styleUrl: './question-form.scss',
})
export class QuestionForm {
  @Input() question: any;
  @Input() index = 0;

  answers = [
    { letter: 'A', text: '' },
    { letter: 'B', text: '' }
  ];

  readonly letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  addAnswer() {
    if (this.answers.length >= 6) {
      return;
    }

    this.answers.push({
      letter: this.letters[this.answers.length],
      text: ''
    });
  }

  removeAnswer(index: number) {
    if (this.answers.length <= 2) {
      return;
    }

    this.answers.splice(index, 1);

    this.answers.forEach((answer, i) => {
      answer.letter = this.letters[i];
    });
  }
}
