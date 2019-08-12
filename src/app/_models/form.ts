import { Tab } from './tab';
import { Status } from './status';

export class Form {
  formID: string;
  formRev: string;
  name: string;
  description: string;
  tabs: Tab[];
  allowedClientTypes: string[];
  client: string; //client key
  os: string; //os key
  status: Status[];

  constructor(options: {
    formID?: string,
    formRev?: string,
    name?: string,
    description?: string,
    tabs?: Tab[],
    client?: string,
    os?: string,
    status?: Status[],
    allowedClientTypes?: string[]
  } = {}) {
    this.formID = options.formID || '';
    this.formRev = options.formRev || '';
    this.name = options.name || 'New Form';
    this.description = options.description || '';
    this.client = options.client || '';
    this.os = options.os || '';
    this.tabs = options.tabs || [new Tab()];
    this.status = options.status || [];
    this.allowedClientTypes = options.allowedClientTypes || [];
  }

}


