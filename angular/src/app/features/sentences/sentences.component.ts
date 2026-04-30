import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-sentences',
  imports: [FormsModule],
  templateUrl: './sentences.component.html',
  styleUrl: './sentences.component.scss'
})
export class SentencesComponent {
  sentence: string = '';
  wordCount: number | null = null;
  charCount: number | null = null;

  constructor(private electronService:ElectronService){}


  calculate() {
    this.electronService.calcSentence(this.sentence).subscribe( charwords => {
        console.log("AAAAAAAAAAAAA")
        const {chars, words} = charwords;
        this.charCount = chars;
        this.wordCount = words;
    } );

  }
}
