import { Column } from './column';

export class Row {
  columnGap: number; //percentage of row (columnGap*(numColumns-1) + (sum of all column widths) must not be greater than 100
  columns: Column[];

  constructor(
    options: {
      columnGap?: number;
      columns?: Column[];
    } = {}
  ) {
    this.columnGap = options.columnGap || 0;
    this.columns = options.columns || [new Column()];
  }
}
