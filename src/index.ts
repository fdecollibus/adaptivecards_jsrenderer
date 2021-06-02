import * as AdaptiveCards from "adaptivecards";

import { ProgressBar } from "./CustomCard";
import { PLDropdown } from "./pl-dropdown";
import { PLButton } from "./pl-button";

export default class PodAdaptiveCardsTestings {
  private elem: HTMLElement;
  private serializationContext: AdaptiveCards.SerializationContext;

  constructor(elem: HTMLElement) {
    this.elem = elem;

    this.init();
  }

  renderCard = (cardBody: object) => {
    var adaptiveCard = new AdaptiveCards.AdaptiveCard();
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif",
    });
    adaptiveCard.parse(cardBody, this.serializationContext);
    var renderedCard = adaptiveCard.render();
    this.elem.appendChild(renderedCard as Node);

    const _self = this;

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
        debugger;
        _self.renderCard(fetchedCardJSON);
        console.log(fetchedCardJSON);
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
      this.renderCard(fetchedCardJSON);
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

    elementRegistry.register(ProgressBar.JsonTypeName, ProgressBar);
    elementRegistry.register(PLDropdown.JsonTypeName, PLDropdown);
    elementRegistry.register(PLButton.JsonTypeName, PLButton);

    this.serializationContext = new AdaptiveCards.SerializationContext();
    this.serializationContext.setElementRegistry(elementRegistry);
  }
}
