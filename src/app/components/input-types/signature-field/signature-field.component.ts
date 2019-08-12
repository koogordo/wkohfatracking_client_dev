import { Component, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';

/*
  Generated class for the SignatureField component.
  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/

@Component({
  selector: 'signature-field',
  templateUrl: 'signature-field.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true,
    },
  ],
})
export class SignatureFieldComponent extends ViewQuestion implements ControlValueAccessor {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public options: Object = {
    minWidth: 0.5,
    canvasWidth: 900,
    canvasHeight: 150,
    backgroundColor: 'rgb(255,255,255)',
  };

  private _signature: any = null;
  private _sigData: any;
  public propagateChange: (val: string) => void;
  public signatureDataUrl: string;
  public clearable: Boolean;
  public editable: Boolean;
  get signature(): any {
    return this._signature;
  }
  set signature(value: any) {
    this._signature = value;
    //this.propagateChange(this.signature);
  }

  constructor(public _fg: FormGroupService, public _db: DatabaseService, public _matDialog: MatDialog) {
    super(_fg, _db, _matDialog);
  }
  ngOnInit() {
    super.ngOnInit();
    this.signatureDataUrl = this.questionGroup.value.input;
  }

  public writeValue(value: any): void {
    if (!value) {
      return;
    }
    this.signature = value;
    //this.signaturePad.resizeCanvas();

    this.signaturePad.fromDataURL(this.signature);
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // no-op
  }

  public ngAfterViewInit(): void {
    if (this.signatureDataUrl) {
      this.writeValue(this.signatureDataUrl);
      this.signaturePad.off();
      this.clearable = false;
      this.editable = false;
    } else {
      this.edit();
    }
  }

  public drawBegin(): void {
    //console.log('Begin Drawing');
  }

  public drawComplete(): void {
    this.signature = this.signaturePad.toDataURL('image/jpeg');
    this.questionGroup.controls.input.setValue(this.signature, { emitEvent: false });
  }

  public clear(): void {
    this.signaturePad.clear();
    this.signature = '';
    this.questionGroup.controls.input.setValue('', { emitEvent: false });
  }
  public edit(): void {
    this.editable = true;
    this.clearable = true;
    this.signaturePad.on();
  }
}
