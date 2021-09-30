import * as AC from "adaptivecards";
import { Dictionary, Input } from "adaptivecards";

export class PLButton extends AC.SubmitAction {

  // public render(): HTMLElement {
  //   let element = document.createElement("div");

  //   const dropdown = document.createElement("axa-button");
  //   dropdown.setAttribute("text", this.title || "");
  //   dropdown.setAttribute("refid", this.id || "");

  //   element.appendChild(dropdown);
  //   return element;
  // }

  protected internalPrepareForExecution(inputs: Dictionary<Input> | undefined): void{
    super.internalPrepareForExecution(inputs);
  } 
}
