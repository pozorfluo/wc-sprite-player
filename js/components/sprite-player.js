"use strict";
class SpritePlayer extends HTMLElement {
    constructor() {
        var _a, _b;
        super();
        this._running = true;
        this._loop = null;
        this.attachShadow({ mode: 'open' });
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(SpritePlayer._template.cloneNode(true));
        this._sprite = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('sprite');
        const rules = this.shadowRoot.styleSheets[0].cssRules[0];
        this.css = rules.style;
    }
    static get observedAttributes() {
        return ['src', 'width', 'height', 'anim', 'duration', 'frames', 'loop'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            this.css.setProperty('background-image', `url(${newValue})`);
        }
        else {
            this.css.setProperty('--' + name, (newValue !== null && newValue !== void 0 ? newValue : 0) + '');
        }
    }
    play() {
        if (this._loop) {
            this.css.setProperty('animation-iteration-count', this._loop);
            this._loop = null;
        }
        this.css.setProperty('animation-play-state', 'running');
        this._running = true;
    }
    pause() {
        this.css.setProperty('animation-play-state', 'paused');
        this._running = false;
    }
    toggle() {
        if (this._loop) {
            this.css.setProperty('animation-iteration-count', this._loop);
            this._loop = null;
        }
        const toggle = this._running ? 'paused' : 'running';
        this.css.setProperty('animation-play-state', toggle);
        this._running = !this._running;
    }
    toggleReset() {
        if (this._running) {
            this.css.setProperty('animation-name', 'none');
        }
        else {
            if (this._loop) {
                this.css.setProperty('animation-iteration-count', this._loop);
                this._loop = null;
            }
            this.css.setProperty('animation-name', 'play');
        }
        this._running = !this._running;
    }
    pauseAfter() {
        this._loop = this.css.getPropertyValue('--loop');
        this.css.setProperty('animation-iteration-count', '1');
        this._running = false;
    }
}
SpritePlayer._template = (() => {
    const t = document.createElement('template');
    t.innerHTML = `\
      <style>
      #sprite {
        --width : 64px;
        --height : 64px;
        --frames: 12;
        --anim : 0;
        --loop : infinite;
        --y : calc(var(--height) * var(--anim) * -1);
        --x : calc(var(--width) * var(--frames) * -1);
        --duration: 333ms;
        width: var(--width);
        height: var(--height);
        background-origin: border-box;
        background: transparent 0px var(--y);
        animation: play var(--duration) steps(var(--frames)) var(--loop);
      }

      @keyframes play {
        100% { background-position: var(--x) var(--y); }
      }
      </style>
      <div id="sprite"></div>
      `;
    return t.content;
})();
customElements.define('sprite-player', SpritePlayer);
