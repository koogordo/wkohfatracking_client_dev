import { Section } from './section';

export class Tab {
  name: string;
  description: string;
  sections: Section[];

  constructor(options: {
    name?: string,
    description?: string,
    sections?: Section[]
  } = {}){
    this.name = options.name || 'New Tab';
    this.description = options.description || '';
    this.sections = options.sections || [new Section()];
  }


}
