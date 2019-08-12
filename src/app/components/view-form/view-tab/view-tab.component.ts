import { Component, Input, OnInit, Inject } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DOCUMENT, Location } from '@angular/common';
import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
var pouchCollate = require('pouchdb-collate');
import * as moment from 'moment';
@Component({
  selector: 'app-view-tab',
  templateUrl: './view-tab.component.html',
  styleUrls: ['./view-tab.component.scss'],
})
export class ViewTabComponent implements OnInit {
  @Input('group') tabGroup;
  @Input() disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() index;
  @Input() previewMode;
  @Input() formGroupCtx;
  @Input() clientID;
  sectionControlPairs;
  @Input() client;
  constructor(@Inject(DOCUMENT) document, private _db: DatabaseService, private _fg: FormGroupService) {}

  ngOnInit() {
    if (this.clientID && this.clientID != '') {
      // this._db
      //   .getClient(pouchCollate.parseIndexableString(decodeURI(this.clientID)))
      //   .then((client) => {
      //     this.client = client;
      //   })
      //   .catch((err) => {
      //     this._db.getUser(pouchCollate.parseIndexableString(decodeURI(this.clientID))).then((user) => {
      //       this.client = user;
      //     });
      //   });
    }
  }
  getIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'section', index: i });
    return temp;
  }

  saveAsPdf() {
    const data = document.getElementById(this.tabGroup.getRawValue().name);
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
      pdf.save(
        `${this.tabGroup
          .getRawValue()
          .name.split(' ')
          .join('')}.pdf`
      ); // Generated PDF
      header[0].remove();
    });
  }

  private getHeader() {
    let id = pouchCollate.parseIndexableString(decodeURI(this.clientID));
    if (!Array.isArray(id)) {
      const userId = id;
      id = [userId, userId.split(':')[1], this.client.roles[0]];
    }
    const fname = this.client.clientFName || this.client.firstName;
    const lname = this.client.clientLName || this.client.lastName;
    // const index = this._fg.indexQuestionGroup(this._fg.formGroupBS.getValue().getRawValue(), 'Visit Date');
    // const visitDate = this._fg.findFormPartByIndex(this._fg.formGroupBS.getValue().getRawValue(), index);
    return `
      <div class="print-header">
        <section class="item left">
          <h1>${fname} ${lname}</h1>
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
