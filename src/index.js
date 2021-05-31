import "@axa-ch/patterns-library-polyfill";
import "@axa-ch/button";
import "./index.scss";

import * as AdaptiveCards from "adaptivecards";

export default class PodAdaptiveCardsTestings {
  // elem is the DOM node where the pod will be atatched on
  // options contains the store and the rest is the data attributes of the pod
  constructor(elem, { ...rest }) {
    this.elem = elem;
    this.options = rest;

    this.init();
  }

  init() {
    this.elem.innerHTML = "<h1>Adaptive Cards Playground</h1>";

    // Author a card
    // In practice you'll probably get this from a service
    // see http://adaptivecards.io/samples/ for inspiration
    var card = {
      type: "AdaptiveCard",
      version: "1.0",
      body: [
        {
          type: "Image",
          url: "http://adaptivecards.io/content/adaptive-card-50.png",
        },
        {
          type: "TextBlock",
          text: "Hello **Adaptive Cards!**",
        },
      ],
      actions: [
        {
          type: "Action.OpenUrl",
          title: "Learn more",
          url: "http://adaptivecards.io",
        },
        {
          type: "Action.OpenUrl",
          title: "GitHub",
          url: "http://github.com/Microsoft/AdaptiveCards",
        },
      ],
    };

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
    adaptiveCard.parse(card);

    // Render the card to an HTML element:
    var renderedCard = adaptiveCard.render();

    // And finally insert it somewhere in your page:
    document.body.appendChild(renderedCard);

    fetch("https://adaptivecardsworkflow.azurewebsites.net/api/ClaimsWorkflow")
      .then((res) => res.json())
      .then((json) => {
        const responseElement = document.createElement("div");
        responseElement.innerHTML = `<p>Response we got:</p>${json}`;
        document.body.appendChild(responseElement);
      })
      .catch((e) => console.log("Fetch failed! CORS issue?"));
  }
}