import * as AC from "adaptivecards";

export class PLDropdown extends AC.ChoiceSetInput {
  static readonly JsonTypeName = "Input.ChoiceSet";

  protected internalRender(): HTMLElement {
    let element = document.createElement("div");

    const items = this.choices.map((c) => {
      return { name: c.title, value: c.value };
    });

    const dropdown = document.createElement("axa-dropdown");
    dropdown.setAttribute("defaulttitle", this.placeholder || "");
    dropdown.setAttribute("items", JSON.stringify(items || []));
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
