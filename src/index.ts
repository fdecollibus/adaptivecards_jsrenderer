export default class PodAdaptiveCardsTestings {
  private elem: HTMLElement;

  constructor(elem: HTMLElement) {
    this.elem = elem;

    this.init();
  }

  init() {
    this.elem.innerHTML = `
    <style>
      body {
        background-color: #e5e5e5;
        box-sizing: border-box;
      }
    </style>
    <h1>hello</h1>`;
  }
}
