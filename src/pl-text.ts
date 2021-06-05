import * as AC from 'adaptivecards';

export class PLText extends AC.TextBlock {
  static readonly JsonTypeName = 'TextBlock';
  getJsonTypeName(): string {
    return PLText.JsonTypeName;
  }

  protected overrideInternalRender(): HTMLElement {
    let element = document.createElement('div');
    const text = document.createElement('axa-text');
    switch (this.size) {
      case 0:
        text.setAttribute('variant', 'size-4');
        break;
      case 2:
        text.setAttribute('variant', 'size-2');
        break;
      case 3:
        text.setAttribute('variant', 'size-3');
        break;
      default:
        break;
    }
    const axatext = document.createTextNode(this.text || '');
    text.appendChild(axatext);
    element.appendChild(text);
    return element;
  }
}
