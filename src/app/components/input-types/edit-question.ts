import {Input, OnInit} from '@angular/core';

export class EditQuestion implements OnInit{
  @Input ('group') questionGroup;
  @Input() index;
  constructor() {}

  ngOnInit() {}

}

