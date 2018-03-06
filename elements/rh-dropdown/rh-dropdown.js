import Rhelement from "../rhelement/rhelement.js";
import "../cp-styles/cp-styles.js";
import "../rh-dropdown-button/rh-dropdown-button.js";
import "../rh-dropdown-menu/rh-dropdown-menu.js";

// https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, "findIndex", {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    }
  });
}

/*
 * DO NOT EDIT. This will be autopopulated with the
 * html from rhcc-freshnessgrade.html and css from
 * rhcc-freshnessgrade.css
 */
const template = document.createElement("template");
template.innerHTML = `
<style>:host {
  position: relative; }</style>
<slot></slot>
`;
/* end DO NOT EDIT */

// Set up a unique ID
const baseID = Date.now();

class RhDropdown extends Rhelement {
  constructor() {
    super("rh-dropdown", template);
  }

  connectedCallback() {
    super.connectedCallback();

    this.setAttribute("defined", "");

    const thisButton = this._thisButton();
    const thisMenu = this._thisMenu();

    customElements.whenDefined("rh-dropdown-button").then(() => {
      let button = thisButton.shadowRoot.querySelector("button");
      button.setAttribute("aria-controls", "rh-dropdown-" + baseID);
      button.setAttribute("id", "rh-dropdown-button-" + baseID);
    });
    customElements.whenDefined("rh-dropdown-menu").then(() => {
      let menu = thisMenu.shadowRoot.querySelector("ul");
      menu.setAttribute("id", "rh-dropdown-" + baseID);
      menu.setAttribute("aria-labelledby", "rh-dropdown-button-" + baseID);
    });

    this.addEventListener("rh-dropdown-change", this._changeHandler);
    this.addEventListener("keydown", this._keydownHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("rh-dropdown-change", this._changeHandler);
    this.removeEventListener("keydown", this._keydownHandler);
  }

  _changeHandler(evt) {
    const rhDropdownButton = this._thisButton();
    const rhDropdownMenu = this._thisMenu();

    if (evt.detail.expanded) {
      this._expandMenu(rhDropdownButton, rhDropdownMenu);
    } else {
      this._collapseMenu(rhDropdownButton, rhDropdownMenu);
    }
  }

  _expandMenu(rhDropdownButton, rhDropdownMenu) {
    let list = rhDropdownMenu.shadowRoot.querySelector("ul");
    rhDropdownButton.expanded = true;
    list.removeAttribute("hidden");
    list.querySelector("li:first-child > a").focus();
  }

  _collapseMenu(rhDropdownButton, rhDropdownMenu) {
    let button = rhDropdownButton.shadowRoot.querySelector("button");
    rhDropdownButton.expanded = false;
    button.focus();
    rhDropdownMenu.shadowRoot
      .querySelector("ul")
      .setAttribute("hidden", "hidden");
  }

  _thisButton() {
    return this.querySelector("rh-dropdown-button");
  }

  _thisMenu() {
    return this.querySelector("rh-dropdown-menu");
  }

  _keydownHandler(evt) {
    let newItem;

    switch (evt.key) {
      case "ArrowDown":
      case "Down":
        newItem = this._nextLink();
        break;
      case "ArrowUp":
      case "Up":
        newItem = this._previousLink();
        break;
      case "Home":
        newItem = this._firstLink();
        break;
      case "End":
        newItem = this._lastLink();
        break;
      case "Escape":
      case "Esc":
        this.dispatchEvent(
          new CustomEvent("rh-dropdown-change", {
            detail: { expanded: false }
          })
        );
        return;
      default:
        return;
    }

    if (newItem) {
      newItem.querySelector("a").focus();
    }
  }

  _allLinks() {
    const thisMenu = this._thisMenu();
    return [...thisMenu.shadowRoot.querySelectorAll("li")];
  }

  _previousLink() {
    const links = this._allLinks();
    const thisMenu = this._thisMenu();
    const thisButton = this._thisButton();
    let focused = thisMenu.shadowRoot.activeElement;
    let wasBtn = thisButton.shadowRoot.activeElement;
    let newIndex;

    if (!focused && wasBtn) {
      // Handles tabbing off menu and back into menu.
      newIndex = links.length - 1;
    } else {
      // I'm already inside the menu
      newIndex = links.findIndex(link => link === focused.parentElement) - 1;
    }

    return links[(newIndex + links.length) % links.length];
  }

  _nextLink() {
    const links = this._allLinks();
    const thisMenu = this._thisMenu();
    const thisButton = this._thisButton();
    let focused = thisMenu.shadowRoot.activeElement;
    let wasBtn = thisButton.shadowRoot.activeElement;
    let newIndex;

    if (!focused && wasBtn) {
      // Handles tabbing off menu and back into menu.
      newIndex = 0;
    } else {
      // I'm already inside the menu
      newIndex = links.findIndex(link => link === focused.parentElement) + 1;
    }

    return links[newIndex % links.length];
  }

  _firstLink() {
    const links = this._allLinks();
    return links[0];
  }

  _lastLink() {
    const links = this._allLinks();
    return links[links.length - 1];
  }
}

window.customElements.define("rh-dropdown", RhDropdown);