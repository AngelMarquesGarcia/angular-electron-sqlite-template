import { operation, operator, sentence } from "./types";
const { app } = require('electron');
const path = require('path');

//import Database from 'better-sqlite3';

import Database from 'better-sqlite3';

export class DatabaseService {

  //needs npm install better-sqlite3
  private db: InstanceType<typeof Database>;
  private dbPath = path.join(app.getPath('userData'), 'foobar.db');

  constructor() {
    this.db = new Database(this.dbPath);
  }

  private tables = {
    ops:'operations',
    sent:'sentences'
  }

  createTables(): void {
    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS ${this.tables.ops} (
      number1 INTEGER NOT NULL,
      number2 INTEGER NOT NULL,
      operator TEXT NOT NULL,
      result INTEGER NOT NULL,

      PRIMARY KEY (number1, number2, operator)
      )
    `).run();

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS ${this.tables.sent} (
      sentence TEXT PRIMARY KEY,
      words INTEGER NOT NULL CHECK (words>=0),
      chars INTEGER NOT NULL CHECK (chars>=0)
      )
    `).run();
  }

  insertOperation(op:operation): number | bigint {
    const stmt = this.db.prepare(`INSERT INTO ${this.tables.ops} VALUES ($number1, $number2, $operator, $result)`);
    const stmtInfo = stmt.run(op);
    return stmtInfo.lastInsertRowid;
  }

  insertSentence(sent:sentence): number | bigint {
    const stmt = this.db.prepare(`INSERT INTO ${this.tables.sent} VALUES ($sentence, $words, $chars)`);
    const stmtInfo = stmt.run(sent);
    return stmtInfo.lastInsertRowid;
  }

  getOperationByOperator(operator:operator): operation[] {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tables.ops} WHERE operator = ?`)
    return stmt.all(operator) as operation[]
  }

  getSentenceByWords(words:number) {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tables.sent} WHERE words = ?`)
    return stmt.all(words)
  }

  getAllOperations() {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tables.ops}`)
    return stmt.all()
  }

  getAllSentences(words:number) {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tables.sent}`)
    return stmt.all(words)
  }

  patchOperation(op:operation): boolean {
    const stmt = this.db.prepare(`
      UPDATE ${this.tables.ops}
      SET
        number1 = :number1,
        number2 = :number2,
        operator = :operator,
        result = :result
      WHERE number1 = :number1 AND number2 = :number2 AND operator = :operator
    `)
    const stmtInfo = stmt.run(op)
    return stmtInfo.changes > 0;
  }

  patchSentence(sent:sentence): boolean {
    const stmt = this.db.prepare(`
      UPDATE ${this.tables.sent}
      SET
        sentence = :sentence,
        words = :words,
        chars = :chars
      WHERE sentence = :sentence
    `)
    const stmtInfo = stmt.run(sent)
    return stmtInfo.changes > 0;
  }

  deleteOperation(op:operation): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM ${this.tables.ops}
      WHERE number1 = :number1 AND number2 = :number2 AND operator = :operator
    `)
    const stmtInfo = stmt.run(op);
    return stmtInfo.changes == 1
  }

  deleteSentence(sent:sentence): boolean {
    const stmt = this.db.prepare(`
      DELETE FROM ${this.tables.sent}
      WHERE sentence = :sentence
    `)
    const stmtInfo = stmt.run(sent.sentence);
    return stmtInfo.changes == 1
  }

}
