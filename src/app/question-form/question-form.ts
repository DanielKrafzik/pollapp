import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-question-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './question-form.html',
  styleUrl: './question-form.scss',
})
export class QuestionForm {
  @Input() question!: any;
  @Input() index = 0;

  @Output() deleteQuestion = new EventEmitter<number>();

  onDelete() {
    this.deleteQuestion.emit(this.index);
  }

  readonly letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  addAnswer() {
    if (this.question.answers.length >= 6) {
      return;
    }

    this.question.answers.push({
      letter: this.letters[this.question.answers.length],
      text: ''
    });
  }

  removeAnswer(index: number) {
    if (this.question.answers.length <= 2) {
      if(index === 0)
        this.question.answers[0] = {letter: 'A', text: ''}
      else this.question.answers[1] = {letter: 'B', text: ''}
      return;
    }

    this.question.answers.splice(index, 1);

    this.question.answers.forEach((answer: any, i: number) => {
      answer.letter = this.letters[i];
    });
  }
}
