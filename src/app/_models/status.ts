import * as moment from 'moment';

export class Status {

  //status can only be "Open","Submitted For Review","Under Review","Reviewer Pool","Action Required", "Queued For Submission","Permanent Submission"
  value: string;

  //roles allowed to modify
  rolesAllowed: string[];

  //Users allowed to modify
  usersAllowed: string[];

  //ISO 8601 date that the form was put in this status
  date: string;

  //message accompanying the status change, can be blank
  message: string;

  username: string;

  constructor(options: {
    value?: string,
    rolesAllowed?: string[],
    usersAllowed?: string[],
    date?: string,
    message?: string,
    username?: string
  } = {}){
    this.value = options.value || "";
    this.rolesAllowed = options.rolesAllowed || [];
    this.usersAllowed = options.usersAllowed || [];
    this.date = options.date || moment().format();
    this.message = options.message || "";
    this.username = options.username || "";
  }

}
