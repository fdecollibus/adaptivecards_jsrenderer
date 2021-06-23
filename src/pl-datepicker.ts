import * as AC from 'adaptivecards';

export class PLDateInput extends AC.DateInput {
  static readonly JsonTypeName = 'Input.Date';
  getJsonTypeName(): string {
    return PLDateInput.JsonTypeName;
  }

  protected overrideInternalRender(): HTMLElement {
    const element = document.createElement('div');
    //const text = document.createElement('axa-text');
    //const axatext = document.createTextNode(this.label || '');
    const datepicker = document.createElement("axa-datepicker");
    const today = new Date();
    this.setValue(PLDateInput.valueProperty, today.toLocaleDateString());
    datepicker.setAttribute('label', this.label || '');
    datepicker.setAttribute('inputfield', "true");
    datepicker.setAttribute('errorMessage', this.errorMessage || '');
    datepicker.setAttribute('name', this.id || '');
    datepicker.addEventListener("change", (e) => {
      this.setValue(PLDateInput.valueProperty, (e.target as any).value);
      console.log("Ora vi faccio vedere Date Input CHANGE");
      console.log(this.getValue(PLDateInput.valueProperty));

    });
    element.appendChild(datepicker);
    return element;
  }

  // getJsonTypeName(): string {
  //   return PLDateInput.JsonTypeName;
  // }

  // protected showValidationErrorMessage() {
  //   debugger; 
  // }
  // public internalValidateProperties(context: ValidationResults) {
  //  debugger;
  // super.internalValidateProperties(context);
  // };

  //static readonly valueProperty = new AC.StringProperty(
  static readonly valueProperty = new AC.StringProperty(
    AC.Versions.v1_3,
    "value"
  );
  @AC.property(PLDateInput.valueProperty)
  public get value(): string | undefined {
    return this.getValue(PLDateInput.valueProperty);
  }
  public set value(value: string | undefined) {
    if (this.value !== value) {
      this.setValue(PLDateInput.valueProperty, value);
      this.updateLayout();
    }
  }
  public isSet() {
    return true;
  }

  public isValid() {
    return true;
  }

}

// defaultValue?: string;
// min?: string;
// max?: string;
// placeholder?: string;
// private _dateInputElement;
// protected internalRender(): HTMLElement | undefined;
// getJsonTypeName(): string;
// isSet(): boolean;
// isValid(): boolean;

/*"type": "Input.Date",
"label": "Wann ist der Schaden entstanden?",
"value": "[today]",
"isRequired": true,
"errorMessage": "Wenn Sie das genaue Schadendatum nicht wissen, geben Sie eine Schätzung an oder das heutige Datum.",
"id": "schadendatum"*/
