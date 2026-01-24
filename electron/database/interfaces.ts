
export interface api {
  addOne():Promise<number>;
}

export interface ops {
  runOperation(n1:number, n2:number, op:string): Promise<number>;
}

export interface sents {
  count(sentence: string): Promise<{chars:number, words:number}>;
}
