import * as AC from "adaptivecards";

export class PLDropdown extends AC.Input {
  static readonly JsonTypeName = "PLDropdown";

  static readonly choicesProperty = new AC.StringProperty(
    AC.Versions.v1_3,
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
    AC.Versions.v1_3,
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

  protected internalRender(): HTMLElement {
    let element = document.createElement("div");

    const dropdown = document.createElement("axa-dropdown");
    dropdown.setAttribute("defaulttitle", this.placeholder || "");
    dropdown.setAttribute("items", this.choices || "");
    dropdown.addEventListener("change", (e) => {
      this.setValue(PLDropdown.valueProperty, (e.target as any).value);
    });

    element.appendChild(dropdown);
    return element;
  }

  getJsonTypeName(): string {
    return PLDropdown.JsonTypeName;
  }

  updateLayout(processChildren: boolean = true) {
    super.updateLayout(processChildren);
  }

  public isSet(): boolean {
    return true;
  }

  static readonly valueProperty = new AC.StringProperty(
    AC.Versions.v1_3,
    "value"
  );
  @AC.property(PLDropdown.valueProperty)
  public get value(): string | undefined {
    return this.getValue(PLDropdown.valueProperty);
  }
  public set value(value: string | undefined) {
    if (this.value !== value) {
      this.setValue(PLDropdown.valueProperty, value);
      this.updateLayout();
    }
  }
}
