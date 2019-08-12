import { Row } from './row';

export class Section {
  name: string;
  description: string;
  rows: Row[];

  constructor(options: {
    name?: string,
    description?: string,
    rows?: Row[]
  } = {}){
    this.name = options.name || 'New Section';
    this.description = options.description || '';
    this.rows = options.rows || [new Row()];
  }

  swapRows(a: number,b: number){
    var temp: Row = this.rows[a];
    this.rows[a] = this.rows[b];
    this.rows[b] = temp;
  }
}
