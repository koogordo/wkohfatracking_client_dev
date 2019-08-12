import { Component, OnDestroy, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DatabaseService } from '../../../_services/database.service';
import { months } from 'moment';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-input-map',
  templateUrl: './view-input-map.component.html',
  styleUrls: ['./view-input-map.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ViewInputMapComponent extends ViewQuestion implements OnDestroy {
  formGroup;
  input;
  subs = [];
  _prevFeetQg = null;
  _prevInchesQg = null;
  _prevPoundsQg = null;
  _prevOuncesQg = null;
  _prevBmiQg = null;
  @Input() previewMode;
  @Input() formGroupCtx;
  outputClasses;
  constructor(public formGroupService: FormGroupService, public databaseService: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, databaseService, matDialog);
    this.outputClasses = ['output'];
    this.formGroupService.formGroupBS.subscribe((fg) => {
      this.formGroup = fg;
    });
    //should probably implement something like this for the previous form, so that it does not search and maintain a separate one each prevValue map.  Think the Service Tab is pretty laggy because of it.

    /*this.subs.push(this.formGroupService.prevFormBS.subscribe(prevForm=>{
      this.prevForm = prevForm;
    }));*/
  }
  ngOnDestroy() {
    for (let sub of this.subs) {
      sub.unsubscribe();
    }
  }
  ngOnInit() {
    super.ngOnInit();
    // if (this.questionGroup.getRawValue().key === 'Visit Duration') {
    //   console.log(this.questionGroup.getRawValue(), this.questionGroup);
    // }
    if (this.questionGroup.value.function === 'prevValue') {
      this.getPrevValue();
    } else if (this.questionGroup.value.function === 'prevIncome') {
      this.getPrevIncome();
    } else if (this.questionGroup.value.function === 'add') {
      this.getAdd();
    } else if (this.questionGroup.value.function === 'adequatePrenat') {
      this.getAdequatePrenat();
    } else if (this.questionGroup.value.function === 'age') {
      this.getAge();
    } else if (this.questionGroup.value.function === 'bmi') {
      this.getBMI();
    } else if (this.questionGroup.value.function === 'bmiChange') {
      this.getBMIChange();
    } else if (this.questionGroup.value.function === 'clientScore') {
      this.getClientScore();
    } else if (this.questionGroup.value.function === 'diffValue') {
      this.getDiffValue();
    } else if (this.questionGroup.value.function === 'gestAge') {
      this.getGestAge();
    } else if (this.questionGroup.value.function === 'heightChange') {
      this.getHeightChange();
    } else if (this.questionGroup.value.function === 'income') {
      if (this.disabled) {
        this.questionGroup.controls.indices.disable();
      }
      this.getIncome();
    } else if (this.questionGroup.value.function === 'timeDuration') {
      this.getTimeDuration();
    } else if (this.questionGroup.value.function === 'trimester') {
      this.getTrimester();
    } else if (this.questionGroup.value.function === 'volHours') {
      this.getVolunteerHours();
    } else if (this.questionGroup.value.function === 'weightChange') {
      this.getWeightChange();
    } else if (this.questionGroup.value.function === 'medHome') {
      this.getMedHome();
    }
  }

  getQG(index) {
    let fg;
    let qgIndex;

    if (this.previewMode) {
      fg = this.formGroupCtx;
      qgIndex = this.formGroupService.indexQuestionGroup(fg.getRawValue(), index.key) || index.index;
      return this.formGroupService.getQuestionGroupByIndex(qgIndex, fg);
    } else {
      fg = this.formGroup;
      qgIndex = this.formGroupService.indexQuestionGroup(fg.getRawValue(), index.key) || index.index;

      return this.formGroupService.getQuestionGroupByIndex(qgIndex);
    }
  }

  /** Prev Value Function **/
  // nested questions click previous value all the way through?
  //
  getPrevValue() {
    if (this.formGroupService.prevFormGroupBS.getValue()) {
      // var dateIndex = this.formGroupService.indexQuestionGroup(this.formGroup.value, 'Visit Date');
      // let dateQG = this.formGroupService.findFormPartByIndex(this.formGroup.value, dateIndex);
      // dateQG = this.formGroupService.buildFormGroup(dateQG);
      const form = this.formGroupService.prevFormGroupBS.getValue().getRawValue();
      this.subs.push(
        this.formGroup.controls.client.valueChanges.subscribe((client) => {
          const prevIndex = this.formGroupService.indexQuestionGroup(form, this.questionGroup.value.indices['prevIndex'][0]['key']);
          const prevQg = this.formGroupService.findFormPartByIndex(form, prevIndex);
          const val = prevQg.input;
          this.questionGroup.controls.input.setValue(val, { emitEvent: true });
        })
      );

      // this.subs.push(
      //   dateQG.controls.input.valueChanges.subscribe((visitDate) => {
      //     const prevIndex = this.formGroupService.indexQuestionGroup(form, this.questionGroup.value.indices['prevIndex'][0]['key']);
      //     const prevQg = this.formGroupService.findFormPartByIndex(form, prevIndex);
      //     const val = prevQg.input;
      //     this.questionGroup.controls.input.setValue(val, { emitEvent: true });
      //   })
      // );
      const prevIndex = this.formGroupService.indexQuestionGroup(form, this.questionGroup.value.indices['prevIndex'][0]['key']) || this.index;
      let prevQg;
      if (this.previewMode) {
        prevQg = this.getQG({ index: prevIndex, key: this.questionGroup.getRawValue().indices['prevIndex'][0]['key'] });
      } else {
        prevQg = this.formGroupService.getQuestionGroupByIndex(prevIndex, this.formGroupService.prevFormGroupBS.getValue());
      }

      this.formGroupService.getQuestionGroupByIndex(prevIndex, this.formGroupService.prevFormGroupBS.getValue()).controls.input.setValue(prevQg.getRawValue().input);
      // this.formGroupService.getQuestionGroupByIndex(prevIndex).controls.input.setValue(prevQg.getRawValue().input);
      this.questionGroup.controls.input.setValue(prevQg.getRawValue().input, { emitEvent: true });
      const qgVal = this.questionGroup.getRawValue();
      const curFormIndex = this.formGroupService.indexQuestionGroup(this.formGroup.getRawValue(), qgVal.key);
      const prevFormIndex = this.formGroupService.indexQuestionGroup(this.formGroupService.prevFormGroupBS.getValue().getRawValue(), qgVal.key);
      if (qgVal.key === 'Prev Height (ft)') {
        this.formGroupService.getQuestionGroupByIndex(prevFormIndex, this.formGroupService.prevFormGroupBS.getValue()).controls.input.setValue(prevQg.getRawValue().input);
        this.formGroupService.getQuestionGroupByIndex(curFormIndex).controls.input.setValue(prevQg.getRawValue().input);
      } else if (qgVal.key === 'Prev Height (in)') {
        this.formGroupService.getQuestionGroupByIndex(prevFormIndex, this.formGroupService.prevFormGroupBS.getValue()).controls.input.setValue(prevQg.getRawValue().input);
        this.formGroupService.getQuestionGroupByIndex(curFormIndex).controls.input.setValue(prevQg.getRawValue().input);
      } else if (qgVal.key === 'Prev Weight (lb)') {
        this.formGroupService.getQuestionGroupByIndex(prevFormIndex, this.formGroupService.prevFormGroupBS.getValue()).controls.input.setValue(prevQg.getRawValue().input);
        this.formGroupService.getQuestionGroupByIndex(curFormIndex).controls.input.setValue(prevQg.getRawValue().input);
      } else if (qgVal.key === 'Prev Weight (oz)') {
        this.formGroupService.getQuestionGroupByIndex(prevFormIndex, this.formGroupService.prevFormGroupBS.getValue()).controls.input.setValue(prevQg.getRawValue().input);
        this.formGroupService.getQuestionGroupByIndex(curFormIndex).controls.input.setValue(prevQg.getRawValue().input);
      } else if (qgVal.key === 'Prev BMI') {
        this.formGroupService.getQuestionGroupByIndex(prevFormIndex, this.formGroupService.prevFormGroupBS.getValue()).controls.input.setValue(prevQg.getRawValue().input);
        this.formGroupService.getQuestionGroupByIndex(curFormIndex).controls.input.setValue(prevQg.getRawValue().input);
      }
    }
  }
  /** End of Prev Value Function **/

  /** Add Function **/
  getAdd() {
    var QGs = [];

    for (let index of this.questionGroup.value.indices.add) {
      QGs.push(this.getQG(index));
    }

    var vals = [];
    for (let QG of QGs) {
      //console.log(QG.getRawValue().input);
      vals.push(QG.getRawValue().input);
    }

    this.calcAdd(vals);

    for (let QG in QGs) {
      subQG(QG, QGs, vals, this.questionGroup, this.subs);
    }

    function subQG(index, QGs, vals, questionGroup, subs) {
      subs.push(
        QGs[index].controls.input.valueChanges.subscribe((val) => {
          vals[index] = val;
          var sum = 0;
          var nothing = 0;
          for (let val of vals) {
            if (typeof val === 'number') val = val.toString();
            if (val.split('-').length > 1) val = val.split('-')[val.split('-').length - 1];
            if (val !== '') {
              sum += parseInt(val) || 0;
            } else {
              nothing++;
            }
          }

          if (nothing != 0) {
            questionGroup.controls.input.setValue('');
          } else {
            questionGroup.controls.input.setValue(sum);
          }
        })
      );
    }
  }

  calcAdd(vals) {
    var sum = 0;
    var nothing = 0;
    for (let val of vals) {
      if (typeof val === 'number') val = val.toString();
      if (val.split('-').length > 1) val = val.split('-')[val.split('-').length - 1];
      if (val !== '') {
        sum += parseInt(val) || 0;
      } else {
        nothing++;
      }
    }

    if (nothing != 0) {
      this.questionGroup.controls.input.setValue('');
    } else {
      this.questionGroup.controls.input.setValue(sum);
    }
  }
  /** End of Add Function **/

  /** Adequate Prenatal Function **/
  getAdequatePrenat() {
    var gestWeekQG = this.getQG(this.questionGroup.value.indices.gestWeek[0]);
    var prenatVisitsQG = this.getQG(this.questionGroup.value.indices.prenatVisits[0]);
    var curGestWeekQG = this.getQG(this.questionGroup.value.indices.curGestWeek[0]);

    var gestWeek = gestWeekQG.getRawValue().input;
    var prenatVisits = prenatVisitsQG.getRawValue().input;
    var curGestWeek = parseInt(curGestWeekQG.getRawValue().input);
    this.calcAdequatePrenat(gestWeek, prenatVisits, curGestWeek);

    this.subs.push(
      gestWeekQG.controls.input.valueChanges.subscribe((val) => {
        gestWeek = val;
        this.calcAdequatePrenat(gestWeek, prenatVisits, curGestWeek);
      })
    );
    this.subs.push(
      prenatVisitsQG.controls.input.valueChanges.subscribe((val) => {
        prenatVisits = val;
        this.calcAdequatePrenat(gestWeek, prenatVisits, curGestWeek);
      })
    );
    this.subs.push(
      curGestWeekQG.controls.input.valueChanges.subscribe((val) => {
        curGestWeek = val;
        this.calcAdequatePrenat(gestWeek, prenatVisits, curGestWeek);
      })
    );
  }

  calcAdequatePrenat(gestWeek, prenatVisits, curGestWeek) {
    function calcRecPrenatVisits(start, cur) {
      var visits = 0;
      if (cur >= 36 && cur >= start) {
        if (start >= 36) {
          visits += cur - start - 1;
        } else {
          visits += cur - 35;
          cur -= visits;
        }
      }
      if (cur >= 28 && cur >= start) {
        if (start >= 28) {
          visits += (cur - start - 1) / 2;
        } else {
          visits += (cur - 27) / 2;
          cur -= (cur - 27) / 2;
        }
      }
      if (cur >= 4 && cur >= start) {
        if (start >= 4) {
          visits += (cur - start - 1) / 4;
        } else {
          visits += (cur - 4) / 4;
          cur -= (cur - 4) / 4;
        }
      }
      return visits;
    }
    if (!!gestWeek && !!prenatVisits && !!curGestWeek) {
      if (gestWeek >= 16 || prenatVisits <= calcRecPrenatVisits(gestWeek, curGestWeek) * 0.8) {
        this.questionGroup.controls.input.setValue('No');
      } else {
        this.questionGroup.controls.input.setValue('Yes');
      }
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Adequate Prenatal Function **/

  /** Age Function **/
  getAge() {
    var dobQG = this.getQG(this.questionGroup.value.indices.dob[0]);
    var visitDateQG = this.getQG(this.questionGroup.value.indices.visitDate[0]);
    var dob = dobQG.getRawValue().input;
    var visitDate = visitDateQG.getRawValue().input;
    this.calcAge(dob, visitDate);

    this.subs.push(
      dobQG.controls.input.valueChanges.subscribe((val) => {
        dob = val;

        this.calcAge(dob, visitDate);
      })
    );
    this.subs.push(
      visitDateQG.controls.input.valueChanges.subscribe((val) => {
        visitDate = val;
        this.calcAge(dob, visitDate);
      })
    );
  }

  calcAge(dob, visitDate) {
    if (!!dob && !!visitDate && (dob !== 'Invalid date' && visitDate !== 'Invalid date')) {
      var momDOB = moment(dob);
      var momVisitDate = moment(visitDate);

      var years = momVisitDate.diff(momDOB, 'years');
      momDOB = momDOB.add(years, 'years');

      var months = momVisitDate.diff(momDOB, 'months');
      momDOB = momDOB.add(months, 'months');

      var weeks = momVisitDate.diff(momDOB, 'weeks');
      momDOB = momDOB.add(weeks, 'weeks');

      var days = momVisitDate.diff(momDOB, 'days');

      this.questionGroup.controls.input.setValue(years + ' years ' + months + ' months ' + weeks + ' weeks ' + days + ' days ', { emitEvent: true });
    } else {
      this.questionGroup.controls.input.setValue('', { emitEvent: true });
    }
  }
  /** End Age Function **/

  /** BMI Function **/
  getBMI() {
    var feetQG = this.getQG(this.questionGroup.value.indices.bmiHeightFt[0]);
    var inchesQG = this.getQG(this.questionGroup.value.indices.bmiHeightIn[0]);
    var poundsQG = this.getQG(this.questionGroup.value.indices.bmiWeightLb[0]);
    var ounces = 0;

    if (this.questionGroup.value.indices.bmiWeightOz) {
      var ouncesQG = this.getQG(this.questionGroup.value.indices.bmiWeightOz[0]);
      ounces = ouncesQG.getRawValue().input;
      ouncesQG.controls.input.valueChanges.subscribe((val) => {
        ounces = val;
        this.calcBMI(feet, inches, pounds, ounces);
      });
    }

    var feet = feetQG.getRawValue().input;
    if (!feet) feet = 0;
    var inches = inchesQG.getRawValue().input;
    if (!inches) inches = 0;
    var pounds = poundsQG.getRawValue().input;

    this.calcBMI(feet, inches, pounds, ounces);

    this.subs.push(
      feetQG.controls.input.valueChanges.subscribe((val) => {
        feet = val;

        this.calcBMI(feet, inches, pounds, ounces);
      })
    );
    this.subs.push(
      inchesQG.controls.input.valueChanges.subscribe((val) => {
        inches = val;
        this.calcBMI(feet, inches, pounds, ounces);
      })
    );
    this.subs.push(
      poundsQG.controls.input.valueChanges.subscribe((val) => {
        pounds = val;
        this.calcBMI(feet, inches, pounds, ounces);
      })
    );
  }

  calcBMI(feet, inches, pounds, ounces) {
    if (feet >= 0 && pounds >= 0) {
      var meters = (Number(feet) + Number(inches) / 12) * 0.3048;
      var kilograms = (Number(pounds) + Number(ounces)) * 0.453592;
      this.questionGroup.controls.input.setValue(kilograms / Math.pow(meters, 2));
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End BMI Function **/

  /** BMI Change Function **/
  getBMIChange() {
    var curBMIQG = this.getQG(this.questionGroup.value.indices.curBMI[0]);
    var prevBMIQG = this.getQG(this.questionGroup.value.indices.prevBMI[0]);

    var curBMI = curBMIQG.getRawValue().input;
    if (!curBMI) curBMI = 0;
    var prevBMI = prevBMIQG.getRawValue().input;

    this.calcBMIChange(curBMI, prevBMI);

    this.subs.push(
      curBMIQG.controls.input.valueChanges.subscribe((val) => {
        curBMI = val;

        this.calcBMIChange(curBMI, prevBMI);
      })
    );
    this.subs.push(
      prevBMIQG.controls.input.valueChanges.subscribe((val) => {
        prevBMI = val;

        this.calcBMIChange(curBMI, prevBMI);
      })
    );
  }

  calcBMIChange(curBMI, prevBMI) {
    if (curBMI >= 0 && !!prevBMI) {
      var bmiChange = curBMI - prevBMI;
      this.questionGroup.controls.input.setValue(bmiChange);
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End BMI Change Function **/

  /** Client Score Function **/
  getClientScore() {
    var clientLevelQG = this.getQG(this.questionGroup.value.indices.clientLevel[0]);
    var osDefCOPointsQG = this.getQG(this.questionGroup.value.indices.osDefCOPoints[0]);
    var osDefTRPointsQG = this.getQG(this.questionGroup.value.indices.osDefTRPoints[0]);

    var clientLevel = clientLevelQG.getRawValue().input;
    var osDefCOPoints = osDefCOPointsQG.getRawValue().input;
    var osDefTRPoints = osDefTRPointsQG.getRawValue().input;
    this.caclClientScore(clientLevel, osDefCOPoints, osDefTRPoints);

    this.subs.push(
      clientLevelQG.controls.input.valueChanges.subscribe((val) => {
        clientLevel = val;

        this.caclClientScore(clientLevel, osDefCOPoints, osDefTRPoints);
      })
    );
    this.subs.push(
      osDefCOPointsQG.controls.input.valueChanges.subscribe((val) => {
        osDefCOPoints = val;

        this.caclClientScore(clientLevel, osDefCOPoints, osDefTRPoints);
      })
    );
    this.subs.push(
      osDefTRPointsQG.controls.input.valueChanges.subscribe((val) => {
        osDefTRPoints = val;
        this.caclClientScore(clientLevel, osDefCOPoints, osDefTRPoints);
      })
    );
  }

  caclClientScore(clientLevel, osDefCOPoints, osDefTRPoints) {
    if (!!clientLevel) {
      var points = 0;
      var visits = '0';
      if (clientLevel == 'P2') {
        points = 2;
        visits = '2 visits per month';
      } else if (clientLevel == 'P1') {
        points = 2;
        visits = '4 visits per month';
      } else if (clientLevel == 'L1') {
        points = 2;
        visits = '4 visits per month';
      } else if (clientLevel == 'L2') {
        points = 1;
        visits = '2 visits per month';
      } else if (clientLevel == 'L3') {
        points = 0.5;
        visits = '1 visit per month';
      } else if (clientLevel == 'L4') {
        points = 0.25;
        visits = '1 visit per quarter';
      } else if (clientLevel == 'L1-SS') {
        points = 3;
        visits = '4+ visits per month';
      } else if (clientLevel == 'L2-SS') {
        points = 2;
        visits = '2+ visits per month';
      } else if (clientLevel == 'L3-SS') {
        points = 1.5;
        visits = '1+ visits per month';
      } else if (clientLevel == 'CO') {
        points = osDefCOPoints;
        visits = '0  visits';
      } else if (clientLevel == 'TR') {
        points = osDefTRPoints;
        visits = '0  visits';
      } else if (clientLevel == 'TO') {
        points = 0.5;
        visits = '0  visits';
      }

      this.questionGroup.controls.input.setValue(' ' + points + ' point(s), ' + visits);
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End of ClientScore Function **/

  /** Different Value Function **/
  getDiffValue() {
    var existingValueQG = this.getQG(this.questionGroup.value.indices.existingValue[0]);
    var existingValue = existingValueQG.getRawValue().input;
    this.calcDiffValue(existingValue);

    this.subs.push(
      existingValueQG.controls.input.valueChanges.subscribe((val) => {
        existingValue = val;
        this.calcDiffValue(existingValue);
      })
    );
  }

  calcDiffValue(existingValue) {
    if (!!existingValue) {
      if (moment.isDate(existingValue)) {
        existingValue = moment(existingValue).format('MM DD YYYY');
      }
      this.questionGroup.controls.input.setValue(existingValue);
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Different Value Functon **/

  /** Gestational Age Function **/
  getGestAge() {
    var dueDateQG = this.getQG(this.questionGroup.value.indices.dueDate[0]);
    var visitDateQG = this.getQG(this.questionGroup.value.indices.visitDate[0]);

    var dueDate = dueDateQG.getRawValue().input;
    var visitDate = visitDateQG.getRawValue().input;
    this.calcGestAge(dueDate, visitDate);

    this.subs.push(
      dueDateQG.controls.input.valueChanges.subscribe((val) => {
        dueDate = val;
        this.calcGestAge(dueDate, visitDate);
      })
    );
    this.subs.push(
      visitDateQG.controls.input.valueChanges.subscribe((val) => {
        visitDate = val;
        this.calcGestAge(dueDate, visitDate);
      })
    );
  }

  calcGestAge(dueDate, visitDate) {
    if (!!dueDate && !!visitDate) {
      var momDueDate = moment(dueDate);
      var momVisitDate = moment(visitDate);
      var momConcept = momDueDate.subtract(40, 'weeks');
      var gestAge = momVisitDate.diff(momConcept, 'weeks');
      var gestAgeDays = momVisitDate.diff(momConcept, 'days');
      if (gestAgeDays > 280) {
        this.questionGroup.controls.input.setValue('Overdue');
      } else {
        this.questionGroup.controls.input.setValue(gestAge + ' weeks');
      }
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Gestational Age Function **/

  /** Height Change Function **/
  getHeightChange() {
    var curFeetQG = this.getQG(this.questionGroup.getRawValue().indices.curHeightFt[0]);
    var curInchesQG = this.getQG(this.questionGroup.getRawValue().indices.curHeightIn[0]);
    var prevFeetQG = this.getQG(this.questionGroup.getRawValue().indices.prevHeightFt[0]);

    var prevInchesQG = this.getQG(this.questionGroup.getRawValue().indices.prevHeightIn[0]);
    var curFeet = curFeetQG.getRawValue().input;
    if (!curFeet) curFeet = 0;
    var curInches = curInchesQG.getRawValue().input;
    if (!curInches) curInches = 0;

    var prevFeet = prevFeetQG.getRawValue().input;
    var prevInches = prevInchesQG.getRawValue().input;

    this.calcHeightChange(curFeet, curInches, prevFeet, prevInches);

    this.subs.push(
      curFeetQG.controls.input.valueChanges.subscribe((val) => {
        curFeet = val;
        this.calcHeightChange(curFeet, curInches, prevFeet, prevInches);
      })
    );
    this.subs.push(
      curInchesQG.controls.input.valueChanges.subscribe((val) => {
        curInches = val;

        this.calcHeightChange(curFeet, curInches, prevFeet, prevInches);
      })
    );
    // this.subs.push(
    //   prevFeetQG.controls.input.valueChanges.subscribe((val) => {
    //     prevFeet = val;
    //     console.log(prevFeet);
    //     this.calcHeightChange(curFeet, curInches, prevFeet, prevInches);
    //   })
    // );
    // this.subs.push(
    //   prevInchesQG.controls.input.valueChanges.subscribe((val) => {
    //     prevInches = val;
    //     console.log(prevInches);
    //     this.calcHeightChange(curFeet, curInches, prevFeet, prevInches);
    //   })
    // );
  }

  calcHeightChange(curFeet, curInches, prevFeet, prevInches) {
    if (prevFeet && curFeet >= 0) {
      var curHeight = Number(curFeet) * 12 + Number(curInches);

      var prevHeight = Number(prevFeet) * 12 + Number(prevInches);

      var heightChange = curHeight - prevHeight;

      var sign = heightChange < 0 ? '-' : '+';
      var heightChangeFeet = ~~(heightChange / 12);
      var heightChangeInches = heightChange % 12;

      this.questionGroup.controls.input.setValue(sign + '' + Math.abs(heightChangeFeet) + ' ft ' + Math.abs(heightChangeInches) + ' in');
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Height Change Function **/

  /** Income Function **/
  getIncome() {
    this.subs.push(
      this.questionGroup.controls.indices.controls.weekly.valueChanges.subscribe((val) => {
        this.questionGroup.controls.indices.controls.monthly.setValue(val * 4, { emitEvent: false });
        this.questionGroup.controls.indices.controls.yearly.setValue(val * 52, { emitEvent: false });
      })
    );
    this.subs.push(
      this.questionGroup.controls.indices.controls.monthly.valueChanges.subscribe((val) => {
        this.questionGroup.controls.indices.controls.weekly.setValue(val / 4, { emitEvent: false });
        this.questionGroup.controls.indices.controls.yearly.setValue(val * 12, { emitEvent: false });
      })
    );
    this.subs.push(
      this.questionGroup.controls.indices.controls.yearly.valueChanges.subscribe((val) => {
        this.questionGroup.controls.indices.controls.weekly.setValue(val / 52, { emitEvent: false });
        this.questionGroup.controls.indices.controls.monthly.setValue(val / 12, { emitEvent: false });
      })
    );
  }
  /** End Income Function **/

  /** Time Duration Function **/
  getTimeDuration() {
    var timeStartQG = this.getQG(this.questionGroup.value.indices.timeStart[0]);
    var timeEndQG = this.getQG(this.questionGroup.value.indices.timeEnd[0]);

    var timeStart = timeStartQG.getRawValue().input;
    var timeEnd = timeEndQG.getRawValue().input;
    this.subs.push(
      timeStartQG.controls.input.valueChanges.subscribe((val) => {
        timeStart = val;

        this.calcTimeDuration(timeStart, timeEnd);
      })
    );
    this.subs.push(
      timeEndQG.controls.input.valueChanges.subscribe((val) => {
        timeEnd = val;

        this.calcTimeDuration(timeStart, timeEnd);
      })
    );
    this.calcTimeDuration(timeStart, timeEnd);
  }

  calcTimeDuration(timeStart, timeEnd) {
    if (!!timeStart && !!timeEnd) {
      if (timeEnd < timeStart) {
        this.questionGroup.controls.input.setValue('Time Error');
      } else {
        var momTimeStart = moment(timeStart, 'HH:mm');
        var momTimeEnd = moment(timeEnd, 'HH:mm');
        var duration = momTimeEnd.diff(momTimeStart, 'seconds');
        var totalMins = duration / 60;
        var durationMins = totalMins % 60;
        var durationHours = (totalMins - durationMins) / 60;

        this.questionGroup.controls.input.setValue(durationHours + ' hour(s), ' + durationMins + ' minute(s)', { emitEvent: true });
      }
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Time Duration Function **/

  /** Trimester Function **/
  getTrimester() {
    var dueDateQG = this.getQG(this.questionGroup.value.indices.dueDate[0]);
    var visitDateQG = this.getQG(this.questionGroup.value.indices.visitDate[0]);

    var dueDate = dueDateQG.getRawValue().input;
    var visitDate = visitDateQG.getRawValue().input;
    this.calcTrimester(dueDate, visitDate);

    this.subs.push(
      dueDateQG.controls.input.valueChanges.subscribe((val) => {
        dueDate = val;
        this.calcTrimester(dueDate, visitDate);
      })
    );
    this.subs.push(
      visitDateQG.controls.input.valueChanges.subscribe((val) => {
        visitDate = val;
        this.calcTrimester(dueDate, visitDate);
      })
    );
  }

  calcTrimester(dueDate, visitDate) {
    if (!!dueDate && !!visitDate) {
      var momDueDate = moment(dueDate);
      var momVisitDate = moment(visitDate);
      var momConcept = momDueDate.subtract(40, 'weeks');
      var gestAge = momVisitDate.diff(momConcept, 'weeks');
      if (gestAge <= 0) this.questionGroup.controls.input.setValue('');
      else if (gestAge <= 12) {
        this.questionGroup.controls.input.setValue('First');
      } else if (gestAge <= 28) {
        this.questionGroup.controls.input.setValue('Second');
      } else {
        this.questionGroup.controls.input.setValue('Third');
      }
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Trimester Function **/

  /** Volunteer Hours Function **/
  getVolunteerHours() {
    var currentVolHoursQG = this.getQG(this.questionGroup.value.indices.currentVolHours[0]);
    var prevTotalQG = this.getQG(this.questionGroup.value.indices.prevTotal[0]);

    var currentVolHours = currentVolHoursQG.getRawValue().input;
    var prevTotal = prevTotalQG.getRawValue().input;
    this.calcVolunteerHours(currentVolHours, prevTotal);

    this.subs.push(
      currentVolHoursQG.controls.input.valueChanges.subscribe((val) => {
        currentVolHours = val;
        this.calcVolunteerHours(currentVolHours, prevTotal);
      })
    );
    /* prevTotal is defined using prevValue function, 
       so it cannot be changed by user. Therefore, no push() necessary
    */
  }

  calcVolunteerHours(currentVolHours, prevTotal) {
    if (!!currentVolHours) {
      var totalHours = +currentVolHours + +prevTotal;
      this.questionGroup.controls.input.setValue(totalHours);
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Volunteer Hours Functon **/

  /** Weight Change Function **/
  getWeightChange() {
    var curPoundsQG = this.getQG(this.questionGroup.value.indices.curWeightLb[0]);
    var prevPoundsQG = this.getQG(this.questionGroup.value.indices.prevWeightLb[0]);
    var curPounds = curPoundsQG.getRawValue().input;
    if (!curPounds && this.formGroup.getRawValue()) curPounds = 0;
    var prevPounds = prevPoundsQG.getRawValue().input;
    var curOunces = 0;
    var prevOunces = 0;
    if (this.questionGroup.value.indices.curWeightOz) {
      var curOuncesQG = this.getQG(this.questionGroup.value.indices.curWeightOz[0]);
      curOunces = curOuncesQG.getRawValue().input;
      this.subs.push(
        curOuncesQG.controls.input.valueChanges.subscribe((val) => {
          curOunces = val;
          this.calcWeightChange(curPounds, curOunces, prevPounds, prevOunces);
        })
      );
    }

    if (this.questionGroup.value.indices.curWeightOz) {
      var prevOuncesQG = this.getQG(this.questionGroup.value.indices.prevWeightOz[0]);
      prevOunces = prevOuncesQG.getRawValue().input;
      this.subs.push(
        prevOuncesQG.controls.input.valueChanges.subscribe((val) => {
          prevOunces = val;

          this.calcWeightChange(curPounds, curOunces, prevPounds, prevOunces);
        })
      );
    }

    this.calcWeightChange(curPounds, curOunces, prevPounds, prevOunces);

    this.subs.push(
      curPoundsQG.controls.input.valueChanges.subscribe((val) => {
        curPounds = val;

        this.calcWeightChange(curPounds, curOunces, prevPounds, prevOunces);
      })
    );

    this.subs.push(
      prevPoundsQG.controls.input.valueChanges.subscribe((val) => {
        prevPounds = val;

        this.calcWeightChange(curPounds, curOunces, prevPounds, prevOunces);
      })
    );
  }

  calcWeightChange(curPounds, curOunces, prevPounds, prevOunces) {
    if (curPounds >= 0 && !!prevPounds) {
      var curWeight = Number(curPounds) * 16 + Number(curOunces);

      var prevWeight = Number(prevPounds) * 16 + Number(prevOunces);

      var weightChange = curWeight - prevWeight;

      var sign = weightChange < 0 ? '-' : '+';
      var weightChangePounds = ~~(weightChange / 16);
      var weightChangeOunces = weightChange % 16;

      this.questionGroup.controls.input.setValue(sign + '' + Math.abs(weightChangePounds) + ' lb ' + Math.abs(weightChangeOunces) + ' oz');
    } else {
      this.questionGroup.controls.input.setValue('');
    }
  }
  /** End Weight Change Function **/

  /** Medical Home Function **/
  getMedHome() {
    var q0QG = this.getQG(this.questionGroup.value.indices.medHome[0]);
    var q1QG = this.getQG(this.questionGroup.value.indices.medHome[1]);
    var q2QG = this.getQG(this.questionGroup.value.indices.medHome[2]);
    var q3QG = this.getQG(this.questionGroup.value.indices.medHome[3]);
    var q4QG = this.getQG(this.questionGroup.value.indices.medHome[4]);

    var q0 = q0QG.getRawValue().input;
    var q1 = q1QG.getRawValue().input;
    var q2 = q2QG.getRawValue().input;
    var q3 = q3QG.getRawValue().input;
    var q4 = q4QG.getRawValue().input;

    this.calcMedHome(q0, q1, q2, q3, q4);

    this.subs.push(
      q0QG.controls.input.valueChanges.subscribe((val) => {
        q0 = val;
        this.calcMedHome(q0, q1, q2, q3, q4);
      })
    );
    this.subs.push(
      q1QG.controls.input.valueChanges.subscribe((val) => {
        q1 = val;
        this.calcMedHome(q0, q1, q2, q3, q4);
      })
    );
    this.subs.push(
      q2QG.controls.input.valueChanges.subscribe((val) => {
        q2 = val;
        this.calcMedHome(q0, q1, q2, q3, q4);
      })
    );
    this.subs.push(
      q3QG.controls.input.valueChanges.subscribe((val) => {
        q3 = val;
        this.calcMedHome(q0, q1, q2, q3, q4);
      })
    );
    this.subs.push(
      q4QG.controls.input.valueChanges.subscribe((val) => {
        q4 = val;
        this.calcMedHome(q0, q1, q2, q3, q4);
      })
    );
  }

  calcMedHome(q0, q1, q2, q3, q4) {
    if (q0 === 'Yes' && q1 === 'Yes' && q2 === 'Yes' && q3 === 'Yes' && q4 === 'Yes') {
      this.questionGroup.controls.input.setValue(true);
    } else {
      this.questionGroup.controls.input.setValue(false);
    }
  }
  /** End Medical Home Function **/

  getPrevIncome() {
    let form = this.formGroupService.prevFormGroupBS.getValue();

    let prevIncomeIndex;
    let prevIncomeQg;
    if (form) {
      if (this.previewMode) {
        form = this.formGroupCtx.getRawValue();
      } else {
        form = form.getRawValue();
      }
      prevIncomeIndex = this.formGroupService.indexQuestionGroup(form, this.questionGroup.value.indices['prevIndex'][0]['key']);
      prevIncomeQg = this.formGroupService.findFormPartByIndex(form, prevIncomeIndex);
    }

    const prevInputVal = prevIncomeQg === undefined ? '' : prevIncomeQg.indices.yearly;
    this.questionGroup.controls.input.setValue(prevInputVal);
  }
  inputIsNumber(input) {
    return typeof input === 'number';
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  formatOutput(questionGroup) {
    const type = questionGroup.type;
    let input = questionGroup.input;
    const key = questionGroup.key;

    if ((key.split(' ').indexOf('Date') > -1 || key.split(' ').indexOf('date') > -1) && input !== '') {
      return moment(input).format('M/D/YYYY');
    } else if (key === 'Height Change' || key === 'Weight Change' || key === 'Change BMI') {
      if (input.split('')[0] === '-') {
        this.outputClasses = ['output', 'warning-red'];
        return input;
      } else if (input.split('')[0] === '+') {
        this.outputClasses = ['output'];
        return input;
      }
    } else if (key === 'Previous Income') {
      if (input === '') {
        input = '$0 Yearly';
      } else {
        input = this.formatMoney(input);
      }
      return input;
    } else {
      return input;
    }
  }

  formatMoney(amount: string) {
    const splitAmount = amount.toString().split('');
    for (let i = splitAmount.length - 3; i >= 0; i -= 3) {
      splitAmount.splice(i, 0, ',');
    }
    const joinResult = splitAmount.join('');
    return `$${joinResult} Yearly`;
  }
}
