import * as AC from "adaptivecards";
// import { SerializableObjectType } from "adaptivecards";
// import { SerializableObjectCollectionProperty } from "adaptivecards";

export class PLDropdown extends AC.CardElement {
  static readonly JsonTypeName = "PLDropdown";

  //#region Schema

  static readonly choicesProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "choices"
  );
  @AC.property(PLDropdown.choicesProperty)
  get choices(): string | undefined {
    return this.getValue(PLDropdown.choicesProperty);
  }
  set choices(value: string | undefined) {
    if (this.choices !== value) {
      this.setValue(PLDropdown.choicesProperty, value);

      this.updateLayout();
    }
  }

  static readonly placeholderProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "placeholder",
    true
  );
  @AC.property(PLDropdown.placeholderProperty)
  get placeholder(): string | undefined {
    return this.getValue(PLDropdown.placeholderProperty);
  }
  set placeholder(value: string | undefined) {
    if (this.placeholder !== value) {
      this.setValue(PLDropdown.placeholderProperty, value);

      this.updateLayout();
    }
  }

  static readonly labelProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "label"
  );
  @AC.property(PLDropdown.labelProperty)
  get label(): string {
    return this.getValue(PLDropdown.labelProperty);
  }
  set label(label: string) {
    if (this.label !== label) {
      this.setValue(PLDropdown.labelProperty, label);

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
    //   this.setValue(PLDropdown.labelProperty, adjustedValue);

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
    console.log(this);
    const dropdown = document.createElement("axa-dropdown");
    dropdown.setAttribute("defaulttitle", this.placeholder || "");
    dropdown.setAttribute("label", this.label || "");
    dropdown.setAttribute("items", this.choices || "");
    console.log(this.choices);
    element.appendChild(dropdown);

    return element;
  }

  getJsonTypeName(): string {
    return PLDropdown.JsonTypeName;
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
