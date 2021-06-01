import * as AC from "adaptivecards";

export class PLDropdown extends AC.CardElement {
  static readonly JsonTypeName = "PLDropdown";

  //#region Schema

  static readonly titleProperty = new AC.StringProperty(
    AC.Versions.v1_0,
    "title",
    true
  );
  static readonly valueProperty = new AC.NumProperty(AC.Versions.v1_0, "value");

  @AC.property(PLDropdown.titleProperty)
  get title(): string | undefined {
    return this.getValue(PLDropdown.titleProperty);
  }

  set title(value: string | undefined) {
    if (this.title !== value) {
      this.setValue(PLDropdown.titleProperty, value);

      this.updateLayout();
    }
  }

  @AC.property(PLDropdown.valueProperty)
  get value(): number {
    return this.getValue(PLDropdown.valueProperty);
  }

  set value(value: number) {
    let adjustedValue = value;

    if (adjustedValue < 0) {
      adjustedValue = 0;
    } else if (adjustedValue > 100) {
      adjustedValue = 100;
    }

    if (this.value !== adjustedValue) {
      this.setValue(PLDropdown.valueProperty, adjustedValue);

      this.updateLayout();
    }
  }

  //#endregion

  private _titleElement: any;
  private _leftBarElement: HTMLElement;
  private _rightBarElement: HTMLElement;

  protected internalRender(): HTMLElement {
    let element = document.createElement("div");

    let textBlock = new AC.TextBlock();
    textBlock.setParent(this);
    textBlock.text = this.title;
    textBlock.wrap = true;

    this._titleElement = textBlock.render();
    if (this._titleElement) this._titleElement.style.marginBottom = "6px";

    let progressBarElement = document.createElement("div");
    progressBarElement.style.display = "flex";

    this._leftBarElement = document.createElement("div");
    this._leftBarElement.style.height = "6px";
    this._leftBarElement.style.backgroundColor = AC.stringToCssColor(
      this.hostConfig.containerStyles.emphasis.foregroundColors.accent.default
    ) as string;

    this._rightBarElement = document.createElement("div");
    this._rightBarElement.style.height = "6px";
    this._rightBarElement.style.backgroundColor = AC.stringToCssColor(
      this.hostConfig.containerStyles.emphasis.backgroundColor
    ) as string;

    // progressBarElement.append(this._leftBarElement, this._rightBarElement);

    // element.append(this._titleElement, progressBarElement);

    const dropdown = document.createElement("axa-dropdown");
    element.appendChild(dropdown);

    return element;
  }

  getJsonTypeName(): string {
    return PLDropdown.JsonTypeName;
  }

  updateLayout(processChildren: boolean = true) {
    super.updateLayout(processChildren);

    if (this.renderedElement) {
      if (this.title) {
        if (this._titleElement) this._titleElement.style.display = "none";
      }
      // else {
      //   if (this._titleElement)
      //     this._titleElement.style.removeProperty("display");
      // }

      this._leftBarElement.style.flex = "1 1 " + this.value + "%";
      this._rightBarElement.style.flex = "1 1 " + (100 - this.value) + "%";
    }
  }
}
