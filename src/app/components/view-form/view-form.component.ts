import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form } from '../../_models/form';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatabaseService } from '../../_services/database.service';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { FormGroupService } from '../../_services/form-group-service.service';
import { PreviewFormComponent } from '../preview-form/preview-form.component';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ViewNotesComponent } from '../view-notes/view-notes.component';
import { SubmittedDialogComponent } from '../submitted-dialog/submitted-dialog.component';
import { CLIENT_RENEG_WINDOW } from 'tls';
declare var require: any;
var pouchCollate = require('pouchdb-collate');
@Component({
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
  styleUrls: ['./view-form.component.scss'],
})
export class ViewFormComponent implements OnInit {
  @Input() formGroup;
  @Input() disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() showNotes;
  @Input() selectedIndex;
  @Input() previewMode;
  @Input() formGroupCtx;
  setHeight;
  @Input() clientID;
  //@Input() preview;
  @Input() cardView: ElementRef;
  @Input() client;
  unresolvedNotesInTab = [];

  constructor(private formGroupService: FormGroupService, public dialog: MatDialog, private _db: DatabaseService, private _fg: FormGroupService) {}

  ngOnInit() {
    this.checkUnresolvedNotes();
    this.setHeight = typeof this.selectedIndex === 'undefined' ? false : true;
    this.selectedIndex = 0;
    this.formGroupService.formGroup.subscribe((formGroup) => {
      this.formGroup = formGroup;
      this.checkUnresolvedNotes();
    });
    this.formGroup.valueChanges.subscribe(() => {
      this.checkUnresolvedNotes();
    });
    // if (this.clientID && this.clientID != '') {
    //   this._db.getClient(pouchCollate.parseIndexableString(decodeURI(this.clientID))).then((client) => {
    //     this.client = client;
    //   });
    // }
  }

  checkUnresolvedNotes() {
    for (let tab in this.formGroup.controls.tabs.controls) {
      this.unresolvedNotesInTab[tab] = [];
      for (let section of this.formGroup.controls.tabs.controls[tab].controls.sections.controls) {
        this.getUnresNotesInRow(section.controls.rows.controls, tab);
      }
    }
  }

  getUnresNotesInRow(rows, tab) {
    for (let row of rows) {
      for (let col of row.controls.columns.controls) {
        for (let quest in col.controls.questions.controls) {
          var question = col.value.questions[quest];
          for (let note of col.controls.questions.controls[quest].controls.notes.controls) {
            if (!note.value.resolved) {
              if (this.unresolvedNotesInTab[tab].find((x) => x.key === question.key)) {
                this.unresolvedNotesInTab[tab].find((x) => x.key === question.key).count += 1;
              } else {
                this.unresolvedNotesInTab[tab].push({ key: question.key, count: 1, questionGroup: col.controls.questions.controls[quest] });
              }
            }
          }
          if (!!col.controls.questions.controls[quest].controls['rows']) {
            this.getUnresNotesInRow(col.controls.questions.controls[quest].controls['rows'].controls, tab);
          }
        }
      }
    }
  }

  setMaxHeight() {
    if (!!this.cardView) {
      var cardHeight = parseFloat(window.getComputedStyle(this.cardView.nativeElement, null).height);

      return cardHeight;
    } else {
      return 600;
    }
  }
  openNotes(questionGroup) {
    let dialogRef = this.dialog.open(ViewNotesComponent, {
      width: '90%',
      maxWidth: '600px',
      data: { questionGroup: questionGroup },
    });
  }

  nextTab() {
    if (this.selectedIndex < this.formGroup.controls.tabs.controls.length - 1) {
      this.selectedIndex++;
    }
  }

  prevTab() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  saveAsPdf() {
    const downloads = [];
    for (let i = 0; i < this.formGroup.getRawValue().tabs.length; i++) {
      const data = document.getElementById(`tabOutlet${i}`);
      data.insertAdjacentHTML('afterbegin', this.getHeader());
      const header = document.getElementsByClassName('print-header');
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
          pdf.save(`${this.formGroup.getRawValue().tabs[i].name}_page_${i}.pdf`); // Generated PDF
          header[0].remove();
        })
      );
    }
    Promise.all(downloads).then(() => {});
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
