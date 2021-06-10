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
    datepicker.setAttribute('label', this.label || '');
    datepicker.setAttribute('inputfield', "true");
    datepicker.setAttribute('errorMessage', this.errorMessage || '');
    datepicker.setAttribute('name', this.id || '');
    element.appendChild(datepicker);
    return element;
  }
}

/*"type": "Input.Date",
"label": "Wann ist der Schaden entstanden?",
"value": "[today]",
"isRequired": true,
"errorMessage": "Wenn Sie das genaue Schadendatum nicht wissen, geben Sie eine Schätzung an oder das heutige Datum.",
"id": "schadendatum"*/
