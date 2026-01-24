import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { api, ops, sents } from '../../../electron/database/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {


  private api: api = (window as any).api;
  private ops: ops = (window as any).ops;
  private sents: sents = (window as any).sents;

  constructor() { }

  addOne():void {
    let value = from(this.api.addOne());
    value.subscribe(val=>
      console.log("ElectronService - addOne called, new value: " + val)
    )
  }

  calcOperation(num1: number, num2: number, operator: string) {
    return from(this.ops.runOperation(num1, num2, operator));
  }

  calcSentence(sentence:string) {
    return from(this.sents.count(sentence));
  }


}
