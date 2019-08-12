export class Note {
  text: string;
  commenterID: string; //os ID
  date: string; //ISO date string
  resolved: boolean;

  constructor (options: {
    text?:string,
    commenterID?: string,
    date?: string,
    resolved?: boolean;
  } = {}){
    this.text = options.text || '';
    this.commenterID = options.commenterID || '';
    this.date = options.date || '';
    this.resolved = options.resolved || false;
  }
}
