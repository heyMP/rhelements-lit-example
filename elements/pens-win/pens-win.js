import { LitElement, html } from "@polymer/lit-element";
/**
 * `pens-win`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PensWin extends LitElement {
  _render() {
    return html`<style> .mood { color: green; } </style>
      <h1>Pens beat <slot></slot>!</h1>
    `;
  }
}

window.customElements.define("pens-win", PensWin);
