import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NamePipe } from 'src/app/_pipes/name.pipe';
const pouchCollate = require('pouchdb-collate');
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-form-pdf',
  templateUrl: './form-pdf.component.html',
  styleUrls: ['./form-pdf.component.scss'],
})
export class FormPdfComponent implements OnInit {
  formPayload;
  downLoadInProgress;
  totalPages;
  completedPages;
  @ViewChild('pdfOutlet') pdfOutlet: ElementRef;
  constructor(
    private _db: DatabaseService,
    private _fg: FormGroupService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _formatName: NamePipe,
    @Inject(DOCUMENT) document,
    private _location: Location
  ) {}

  ngOnInit() {
    // subscription block loads in the correct form and matches it with the correct family, the client data from the family is then added
    // to the form so it is available in the template.
    this._route.params.subscribe((params) => {
      this._db.getArchivedForm(params['id']).then((form) => {
        this.formPayload = form;
        const parsedClientID = pouchCollate.parseIndexableString(decodeURI(this.formPayload.form.client));
        this._db.getFamily(parsedClientID[0]).then((family) => {
          const client = family[parsedClientID[1]][parsedClientID[2]];
          this.formPayload.form.clientName = `${this._formatName.transform(client.clientFName)} ${this._formatName.transform(client.clientLName)}`;
          this.formPayload.form.primaryAdultName = `${this._formatName.transform(family.adult[0].clientFName)} ${this._formatName.transform(family.adult[0].clientLName)}`;
          this.formPayload.form.clientData = client;
          this.formPayload.form.primaryAdultData = family.adult[0];
          const visitDateIndex = this._fg.indexQuestionGroup(this.formPayload.form, 'Visit Date');
          const visitDateQuestion = this._fg.findFormPartByIndex(this.formPayload.form, visitDateIndex);
          this.formPayload.form.dateSubmitted = moment(this.formPayload.form.status[this.formPayload.form.status.length - 1].date).format('MMMM D YYYY');
          this.formPayload.form.visitDate = moment(visitDateQuestion.input).format('MMMM D YYYY');
          // console.log(this.formPayload);
        });
      });
    });
    // console.log(this.pdfOutlet);
  }

  getLabel(question) {
    if (question.label === '') {
      return question.key;
    } else {
      return question.label;
    }
  }

  saveAsPdf() {
    this.totalPages = this.formPayload.form.tabs.length;
    this.completedPages = 0;
    this.downLoadInProgress = true;
    const downloads = [];
    for (let i = 0; i < this.formPayload.form.tabs.length; i++) {
      const data = document.getElementById(`tabOutlet${i}`);
      downloads.push(
        html2canvas(data).then((canvas) => {
          var imgWidth = 208;
          var pageHeight = 295;
          var imgHeight = (canvas.height * imgWidth) / canvas.width;
          var heightLeft = imgHeight;

          const contentDataURL = canvas.toDataURL('image/png');
          let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save(`${this.formPayload.form.clientName.split(' ').join('')}_page_${i}.pdf`); // Generated PDF
          this.completedPages++;
        })
      );
    }
    Promise.all(downloads).then(() => {
      this.downLoadInProgress = false;
    });
  }
  goBack() {
    this._location.back();
  }
}
