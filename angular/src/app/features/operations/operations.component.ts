import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElectronService } from '../../core/services/electron.service';

@Component({
  selector: 'app-operations',
  imports: [FormsModule],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.scss'
})
export class OperationsComponent {
  num1: number = 0;
  num2: number = 0;
  operator: string = '+';
  result: number | null = null;

  constructor(private electronService:ElectronService){}

  calculate() {
    this.electronService.calcOperation(this.num1, this.num2, this.operator).subscribe((result)=>
      this.result = result
    );
  }
}
