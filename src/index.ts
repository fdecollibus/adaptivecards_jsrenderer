import * as AdaptiveCards from "adaptivecards";

import { PLDropdown } from "./pl-dropdown";

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

    elementRegistry.register(PLDropdown.JsonTypeName, PLDropdown);

    this.serializationContext = new AdaptiveCards.SerializationContext();
    this.serializationContext.setElementRegistry(elementRegistry);
  }
}
