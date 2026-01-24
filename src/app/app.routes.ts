import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OperationsComponent } from './operations/operations.component';
import { SentencesComponent } from './sentences/sentences.component';

export const routes: Routes = [
  //{path: '', component: AppComponent},
  {path: 'operations', component: OperationsComponent},
  {path: 'sentences', component: SentencesComponent},



  //{path: '**', component: ErrorComponent},

];
