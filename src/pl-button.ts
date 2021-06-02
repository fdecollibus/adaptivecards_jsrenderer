import * as AC from "adaptivecards";
// import { SerializableObjectType } from "adaptivecards";
// import { SerializableObjectCollectionProperty } from "adaptivecards";

export class PLButton extends AC.CardElement {
  static readonly JsonTypeName = "PLButton";

  //#region Schema

  static readonly choicesProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "choices"
  );
  @AC.property(PLButton.choicesProperty)
  get choices(): string | undefined {
    return this.getValue(PLButton.choicesProperty);
  }
  set choices(value: string | undefined) {
    if (this.choices !== value) {
      this.setValue(PLButton.choicesProperty, value);

      this.updateLayout();
    }
  }

  static readonly placeholderProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "placeholder",
    true
  );
  @AC.property(PLButton.placeholderProperty)
  get placeholder(): string | undefined {
    return this.getValue(PLButton.placeholderProperty);
  }
  set placeholder(value: string | undefined) {
    if (this.placeholder !== value) {
      this.setValue(PLButton.placeholderProperty, value);

      this.updateLayout();
    }
  }

  static readonly labelProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "label"
  );
  @AC.property(PLButton.labelProperty)
  get label(): string {
    return this.getValue(PLButton.labelProperty);
  }
  set label(label: string) {
    if (this.label !== label) {
      this.setValue(PLButton.labelProperty, label);

      this.updateLayout();
    }
    // this.label = label;
    // let adjustedValue = label;

    // if (adjustedValue < 0) {
    //   adjustedValue = 0;
    // } else if (adjustedValue > 100) {
    //   adjustedValue = 100;
    // }

    // if (this.label !== adjustedValue) {
    //   this.setValue(PLButton.labelProperty, adjustedValue);

    //   this.updateLayout();
    // }
  }

  //#endregion

  // private _titleElement: any;
  // private _leftBarElement: HTMLElement;
  // private _rightBarElement: HTMLElement;

  protected internalRender(): HTMLElement {
    let element = document.createElement("div");

    // let textBlock = new AC.TextBlock();
    // textBlock.setParent(this);
    // textBlock.text = this.title;
    // textBlock.wrap = true;

    // this._titleElement = textBlock.render();
    // if (this._titleElement) this._titleElement.style.marginBottom = "6px";

    // let progressBarElement = document.createElement("div");
    // progressBarElement.style.display = "flex";

    // this._leftBarElement = document.createElement("div");
    // this._leftBarElement.style.height = "6px";
    // this._leftBarElement.style.backgroundColor = AC.stringToCssColor(
    //   this.hostConfig.containerStyles.emphasis.foregroundColors.accent.default
    // ) as string;

    // this._rightBarElement = document.createElement("div");
    // this._rightBarElement.style.height = "6px";
    // this._rightBarElement.style.backgroundColor = AC.stringToCssColor(
    //   this.hostConfig.containerStyles.emphasis.backgroundColor
    // ) as string;

    // progressBarElement.append(this._leftBarElement, this._rightBarElement);

    // element.append(this._titleElement, progressBarElement);
    const button = document.createElement("axa-button");
    const text = document.createTextNode(this.label);
    button.appendChild(text);
    element.appendChild(button);
    return element;
  }

  getJsonTypeName(): string {
    return PLButton.JsonTypeName;
  }

  updateLayout(processChildren: boolean = true) {
    super.updateLayout(processChildren);

    if (this.renderedElement) {
      if (this.placeholder) {
        // if (this._titleElement) this._titleElement.style.display = "none";
      }
      // else {
      //   if (this._titleElement)
      //     this._titleElement.style.removeProperty("display");
      // }

      // this._leftBarElement.style.flex = "1 1 " + this.value + "%";
      // this._rightBarElement.style.flex = "1 1 " + (100 - this.value) + "%";
    }
  }
}
