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

  /**
 * Emits the index of the current question to notify the parent component
 * that the question should be deleted.
 */
  onDelete() {
    this.deleteQuestion.emit(this.index);
  }

  readonly letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  /**
 * Adds a new empty answer option to the current question.
 * A maximum of six answer options (A–F) can be added.
 */
  addAnswer() {
    if (this.question.answers.length >= 6) {
      return;
    }
    this.question.answers.push({
      letter: this.letters[this.question.answers.length],
      text: ''
    });
  }

  /**
 * Removes an answer option from the current question.
 * If only two answers remain, the selected answer is cleared instead of removed.
 * After removing an answer, the remaining options are relabeled in order from A to F.
 *
 * @param index - The index of the answer to remove or clear.
 */
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
