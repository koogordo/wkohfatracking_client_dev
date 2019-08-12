import { Input } from './input-types/input';
import { Textbox } from './input-types/textbox';
export class Column {
  //percentage of row (columnGap*(numColumns-1) + (sum of all column widths) must not be greater than 100
  //any negative number means that fxFlex will distribute the remaining row width evenly between all other cols with negative widths
  width: string;
  offset: number;
  align: string;
  questions: Input<any>[];

  constructor(
    options: {
      width?: string;
      questions?: Input<any>[];
      offset?: number;
      align?: string;
    } = {}
  ) {
    this.width = options.width || 'nogrow';
    this.offset = options.offset || 0;
    this.questions = options.questions || [new Textbox()];
    this.align = options.align || 'auto';
  }
}
