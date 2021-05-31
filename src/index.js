import "@axa-ch/patterns-library-polyfill";
import "@axa-ch/button";
import "./index.scss";

import "./markdown.js";

import * as AdaptiveCards from "adaptivecards";

export default class PodAdaptiveCardsTestings {
  // elem is the DOM node where the pod will be atatched on
  // options contains the store and the rest is the data attributes of the pod
  constructor(elem, { ...rest }) {
    this.elem = elem;
    this.options = rest;

    this.init();
  }

  async init() {
    this.elem.innerHTML = "<h1>Adaptive Cards Playground</h1>";

    let fetchedCardJSON;
    try {
      fetchedCardJSON = await (
        await fetch(
          "https://adaptivecardsworkflow.azurewebsites.net/api/ClaimsWorkflow"
        )
      ).json();
    } catch (e) {
      console.error(
        "Fetch card failed! CORS issue? Parsing issue? Connectivity issue?",
        e
      );
    }

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
      alert("Ow!");
    };

    // For markdown support you need a third-party library
    // E.g., to use markdown-it, include in your HTML page:
    //     <script type="text/javascript" src="https://unpkg.com/markdown-it/dist/markdown-it.js"></script>
    // And add this code to replace the default markdown handler:
    //     AdaptiveCards.AdaptiveCard.onProcessMarkdown = function (text, result) {
    //         result.outputHtml = markdownit().render(text);
    //         result.didProcess = true;
    //     };

    // Parse the card payload
    adaptiveCard.parse(fetchedCardJSON);

    // Render the card to an HTML element:
    var renderedCard = adaptiveCard.render();

    // And finally insert it somewhere in your page:
    document.body.appendChild(renderedCard);
  }
}
