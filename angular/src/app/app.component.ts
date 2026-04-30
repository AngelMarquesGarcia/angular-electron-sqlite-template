import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ElectronService } from './core/services/electron.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'from-scratch-angular-electron';

  constructor(private electron: ElectronService) {}

  addOne() {
    console.log("AppComponent - addOne called");
    //this.electron.chrome();
    //this.electron.electron();
    //this.electron.node();

    this.electron.addOne();
  }
}
