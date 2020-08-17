class SpritePlayer extends HTMLElement {
  static _template: DocumentFragment = (() => {
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

  _sprite: HTMLElement;
  _running = true;
  _loop: string | null = null;

  css: CSSStyleDeclaration;

  static get observedAttributes() {
    return ['src', 'width', 'height', 'anim', 'duration', 'frames', 'loop'];
  }

  constructor() {
    super();
    // sets and returns 'this.shadowRoot'
    this.attachShadow({ mode: 'open' });
    this.shadowRoot?.appendChild(SpritePlayer._template.cloneNode(true));
    this._sprite = <HTMLElement>this.shadowRoot?.getElementById('sprite');

    const rules = (<ShadowRoot>this.shadowRoot).styleSheets[0].cssRules[0];
    /** @todo Fix the ugly linter quieting */
    this.css = (<any>rules).style;
  }
  // _listener(event : Event){
  //   console.log(event.type);
  // }
  // connectedCallback(){
  //   console.log(this._sprite);
  //   this._sprite.addEventListener("animationstart", this._listener, false);
  //   this._sprite.addEventListener("animationend", this._listener, false);
  //   this._sprite.addEventListener("animationiteration", this._listener, false);
  // }
  attributeChangedCallback(
    name: string,
    oldValue: number | string | null,
    newValue: number | string | null
  ): void {
    if (name === 'src') {
        this.css.setProperty('background-image', `url(${newValue})`);
    }else{
        this.css.setProperty('--' + name, (newValue ?? 0) + '');
    }
  }

//   setLoopDuration(duration: number): this {
//     // this.css.setProperty('--duration', duration + 'ms');
//     this.setAttribute('duration', duration + 'ms');
//     return this;
//   }

//   setLoop(iterations: string): this {
//     // this.css.setProperty('animation-iteration-count', iterations);
//     this.setAttribute('loop', iterations + '');
//     return this;
//   }

//   setAnim(anim: number): this {
//     // this.css.setProperty('--anim', anim + '');
//     this.setAttribute('anim', anim + '');
//     return this;
//   }
  play(): void {
    /** Restore loop settings if any. */
    if (this._loop) {
      this.css.setProperty('animation-iteration-count', this._loop);
      this._loop = null;
    }
    this.css.setProperty('animation-play-state', 'running');
    this._running = true;
  }

  pause(): void {
    this.css.setProperty('animation-play-state', 'paused');
    this._running = false;
  }

  toggle(): void {
    /** Restore loop settings if any. */
    if (this._loop) {
      this.css.setProperty('animation-iteration-count', this._loop);
      this._loop = null;
    }
    const toggle = this._running ? 'paused' : 'running';
    this.css.setProperty('animation-play-state', toggle);
    this._running = !this._running;
  }

  toggleReset(): void {
    if (this._running) {
      this.css.setProperty('animation-name', 'none');
    } else {
      /** Restore loop settings if any. */
      if (this._loop) {
        this.css.setProperty('animation-iteration-count', this._loop);
        this._loop = null;
      }
      this.css.setProperty('animation-name', 'play');
    }
    this._running = !this._running;
  }

  pauseAfter(): void {
    this._loop = this.css.getPropertyValue('--loop');
    this.css.setProperty('animation-iteration-count', '1');
    this._running = false;
    // this._sprite.addEventListener('animationend', () => {
    //   this.css.setProperty('animation-iteration-count', this._loop);
    //   console.log('animation ended.');
    // })
  }
}

customElements.define('sprite-player', SpritePlayer);
