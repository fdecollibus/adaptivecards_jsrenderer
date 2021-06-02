import * as AdaptiveCards from "adaptivecards";

import { ProgressBar } from "./CustomCard";
import { PLDropdown } from "./pl-dropdown";

export default class PodAdaptiveCardsTestings {
  private elem: HTMLElement;
  private serializationContext: AdaptiveCards.SerializationContext;

  constructor(elem: HTMLElement) {
    this.elem = elem;

    this.init();
  }

  async init() {
    this.registerCustomComponents();

    this.elem.innerHTML = "<h1>Adaptive Cards Playground</h1>";

    // let fetchedCardJSON;
    // try {
    //   fetchedCardJSON = await (
    //     await fetch(
    //       "https://adaptivecardsworkflow.azurewebsites.net/api/ClaimsWorkflow"
    //     )
    //   ).json();
    // } catch (e) {
    //   console.error(
    //     "Fetch card failed! CORS issue? Parsing issue? Connectivity issue?",
    //     e
    //   );
    // }

    // Create an AdaptiveCard instance
    var adaptiveCard = new AdaptiveCards.AdaptiveCard();

    // Set its hostConfig property unless you want to use the default Host Config
    // Host Config defines the style and behavior of a card
    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
      fontFamily: "Segoe UI, Helvetica Neue, sans-serif",
      // More host config options
    });

    // Set the adaptive card's event handlers. onExecuteAction is invoked
    // whenever an action is clicked in the card
    adaptiveCard.onExecuteAction = function (action) {
      if (action instanceof AdaptiveCards.SubmitAction) {
        console.log(action.data);
        debugger;
      }
    };

    // console.log(fetchedCardJSON);

    // For markdown support you need a third-party library
    // E.g., to use markdown-it, include in your HTML page:
    //     <script type="text/javascript" src="https://unpkg.com/markdown-it/dist/markdown-it.js"></script>
    // And add this code to replace the default markdown handler:
    //     AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
    //         result.outputHtml = markdownit().render(text);
    //         result.didProcess = true;
    //     };

    // Parse the card payload
    adaptiveCard.parse(
      {
        type: "AdaptiveCard",
        version: "1.0",
        body: [
          {
            id: "schaden_entstehung",
            type: "PLDropdown",
            placeholder: "Bitte wählen ...",
            label: "This is a progress bar",
            choices: JSON.stringify([
              {
                name: "Diebstahl, Einbruch und Verlust",
                value: "Choice 1 - was muss ich da eingeben?",
              },
              { name: "Beschädigung und Zerstörung", value: "Choice 2" },
              { name: "Sonstiges", value: "Choice 3" },
            ]),
          },
          {
            type: "ActionSet",
            actions: [
              {
                type: "Action.Submit",
                id: "claimsStart",
                title: "Absenden",
                style: "positive",
                url: "https://adaptivecardsworkflow.azurewebsites.net/api/claimsworkflow",
              },
            ],
          },
        ],
      },
      this.serializationContext
    );
    // adaptiveCard.parse(fetchedCardJSON);
    adaptiveCard.parse(
      {
        type: "AdaptiveCard",
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.3",
        body: [
          {
            type: "Container",
            items: [
              {
                type: "TextBlock",
                text: "Schadenmeldung",
                wrap: true,
                size: "Large",
                weight: "Bolder",
              },
              {
                type: "Container",
                items: [
                  {
                    id: "schaden_entstehung",
                    type: "PLDropdown",
                    placeholder: "Bitte wählen ...",
                    label: "This is a progress bar",
                    choices: JSON.stringify([
                      {
                        name: "Diebstahl, Einbruch und Verlust",
                        value: "Choice 1 - was muss ich da eingeben?",
                      },
                      {
                        name: "Beschädigung und Zerstörung",
                        value: "Choice 2",
                      },
                      { name: "Sonstiges", value: "Choice 3" },
                    ]),
                  },
                  {
                    type: "Input.Date",
                    label: "Wann ist der Schaden entstanden?",
                    value: "[today]",
                    isRequired: true,
                    errorMessage:
                      "Wenn Sie das genaue Schadendatum nicht wissen, geben Sie eine Schätzung an oder das heutige Datum.",
                    id: "schadendatum",
                  },
                  {
                    type: "TextBlock",
                    text: "Wenn Sie das genaue Schadendatum nicht wissen, geben Sie eine Schätzung an oder das heutige Datum.",
                    wrap: true,
                    size: "Small",
                    id: "infotext_schadendatum",
                  },
                ],
              },
            ],
          },
          {
            type: "ActionSet",
            actions: [
              {
                type: "Action.Submit",
                id: "claimsStart",
                title: "Absenden",
                style: "positive",
                url: "https://adaptivecardsworkflow.azurewebsites.net/api/claimsworkflow",
              },
            ],
          },
        ],
      },
      this.serializationContext
    );

    // Render the card to an HTML element:
    var renderedCard = adaptiveCard.render();

    // And finally insert it somewhere in your page:
    this.elem.appendChild(renderedCard as Node);
  }

  registerCustomComponents(): void {
    let elementRegistry =
      new AdaptiveCards.CardObjectRegistry<AdaptiveCards.CardElement>();
    AdaptiveCards.GlobalRegistry.populateWithDefaultElements(elementRegistry);

    elementRegistry.register(ProgressBar.JsonTypeName, ProgressBar);
    elementRegistry.register(PLDropdown.JsonTypeName, PLDropdown);

    this.serializationContext = new AdaptiveCards.SerializationContext();
    this.serializationContext.setElementRegistry(elementRegistry);
  }
}
