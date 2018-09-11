import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

/**
 * `pens-win`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PensWin extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: "pens-win"
      }
    };
  }
}

window.customElements.define("pens-win", PensWin);
