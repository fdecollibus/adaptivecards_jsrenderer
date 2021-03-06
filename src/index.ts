import * as AdaptiveCards from "adaptivecards";

import { PLDropdown } from "./pl-dropdown";
import { PLInput } from "pl-input";
//import { PLButton } from "pl-button";
import { PLText } from "pl-text";
import { PLDateInput } from "pl-datepicker";


export default class PodAdaptiveCardsTestings {
  private elem: HTMLElement;
  private serializationContext: AdaptiveCards.SerializationContext;

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.init();
  }

  createSeparator = (): HTMLElement => {
    const sep = document.createElement("hr");
    sep.classList.add("rounded");
    return sep;
  };

  renderCard = (cardBody: object, _self: any) => {
    var adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif",
      
      


      
    });
    adaptiveCard.parse(cardBody, this.serializationContext);
    var renderedCard = adaptiveCard.render();
    this.elem.appendChild(renderedCard as Node);

    adaptiveCard.onExecuteAction = async function (action) {
      if (action instanceof AdaptiveCards.SubmitAction) {
        console.log(action.id,action.data)
        let values = {
          id: action.id,
          data: action.data,
        };
        let otherParams = {
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(values),
          method: "POST",
        };
        let fetchedCardJSON = await (
          await fetch(
            "https://adaptivecardsworkflow.azurewebsites.net/api/ClaimsWorkflow",
            otherParams
          )
        ).json();
        _self.elem.appendChild(_self.createSeparator());
        _self.renderCard(fetchedCardJSON, _self);
      }
    };
  };

  async init() {
    this.registerCustomComponents();

    this.elem.innerHTML = "<h1>Adaptive Cards Playground</h1>";

    let fetchedCardJSON;
    try {
      fetchedCardJSON = await (
        await fetch(
          "https://adaptivecardsworkflow.azurewebsites.net/api/ClaimsWorkflow"
        )
      ).json();
      this.renderCard(fetchedCardJSON, this);
    } catch (e) {
      console.error(
        "Fetch card failed! CORS issue? Parsing issue? Connectivity issue?",
        e
      );
    }
  }

  registerCustomComponents(): void {
    let elementRegistry =
      new AdaptiveCards.CardObjectRegistry<AdaptiveCards.CardElement>();
    AdaptiveCards.GlobalRegistry.populateWithDefaultElements(elementRegistry);
    
    let actionRegistry =
      new AdaptiveCards.CardObjectRegistry<AdaptiveCards.Action>();
    AdaptiveCards.GlobalRegistry.populateWithDefaultActions(actionRegistry);

    elementRegistry.register(PLDropdown.JsonTypeName, PLDropdown);
    elementRegistry.register(PLInput.JsonTypeName, PLInput);
    elementRegistry.register(PLText.JsonTypeName, PLText);
    elementRegistry.register(PLDateInput.JsonTypeName, PLDateInput);
    //elementRegistry.register(PLButton.JsonTypeName, PLButton);
    //actionRegistry.register(PLButton.JsonTypeName, PLButton);

    this.serializationContext = new AdaptiveCards.SerializationContext();
    this.serializationContext.setElementRegistry(elementRegistry);
    this.serializationContext.setActionRegistry(actionRegistry);
  }
}
