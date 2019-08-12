import { Component, Input, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DOCUMENT, Location } from '@angular/common';
var pouchCollate = require('pouchdb-collate');

import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { CLIENT_RENEG_WINDOW } from 'tls';
@Component({
  selector: 'app-view-section',
  templateUrl: './view-section.component.html',
  styleUrls: ['./view-section.component.scss'],
})
export class ViewSectionComponent implements OnInit {
  @Input('group') sectionGroup;
  @Input() disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() index;
  @Input() previewMode;
  @Input() formGroupCtx;
  sectionID;
  @Input() client;
  @Input() clientID;
  constructor(@Inject(DOCUMENT) document, private _db: DatabaseService, private _fg: FormGroupService) {}

  ngOnInit() {
    this.sectionID = this.generatePrintID();
  }

  getIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'row', index: i });
    return temp;
  }

  generatePrintID() {
    return Math.random()
      .toString(36)
      .replace('0.', '');
  }

  saveAsPdf() {
    const data = document.getElementById(this.sectionID);
    data.insertAdjacentHTML('afterbegin', this.getHeader());
    const header = document.getElementsByClassName('print-header');
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`section_${this.sectionID}.pdf`); // Generated PDF
      header[0].remove();
    });
  }

  private getHeader() {
    const id = pouchCollate.parseIndexableString(decodeURI(this.clientID));

    const index = this._fg.indexQuestionGroup(this._fg.formGroupBS.getValue().getRawValue(), 'Visit Date');
    const visitDate = this._fg.findFormPartByIndex(this._fg.formGroupBS.getValue().getRawValue(), index);
    return `
      <div class="print-header">
        <section class="item left">
          <h1>${this.client.clientFName} ${this.client.clientLName}</h1>
        </section>
        <section class="item right">
          <h1>${id[0]}-${id[1]}-${id[2]}</h1>
        </section>
        <section class="item center">
          <h1>${moment().format('M/D/YYYY')}</h1>
        </section>
      </div>
    `;
  }
}
