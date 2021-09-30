import * as AC from "adaptivecards";
import { ValidationResults } from "adaptivecards";

export class PLInput extends AC.TextInput {
  static readonly JsonTypeName = "Input.Text";

  getJsonTypeName(): string {
    return PLInput.JsonTypeName;
  }

  protected overrideInternalRender(): HTMLElement {
    let element = document.createElement("div");

    const input = document.createElement("axa-input-text");
    input.setAttribute("placeholder", this.placeholder || "");
    input.setAttribute("label", this.label || "");
    input.setAttribute("refid", this.id || "");
    if (this.isRequired) input.setAttribute("required", "true");
    input.addEventListener("change", (e) => {
      this.setValue(PLInput.valueProperty, (e.target as any).value);
    });
    input.setAttribute("error", this.errorMessage || "");
    if (!this.isValid()) input.setAttribute("invalid", "true");
    element.appendChild(input);
    return element;
  }

  protected showValidationErrorMessage() {
debugger;
     
 }
 public internalValidateProperties(context: ValidationResults) {
   debugger;
super.internalValidateProperties(context);
 };

  static readonly valueProperty = new AC.StringProperty(
    AC.Versions.v1_3,
    "value"
  );
  @AC.property(PLInput.valueProperty)
  public get value(): string | undefined {
    return this.getValue(PLInput.valueProperty);
  }
  public set value(value: string | undefined) {
    if (this.value !== value) {
      this.setValue(PLInput.valueProperty, value);
      this.updateLayout();
    }
  }
}
