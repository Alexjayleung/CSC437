import { prepareTemplate } from "./template.js";
import { loadJSON } from "./json-loader.js";


export class ProfileViewElement extends HTMLElement {
  static styles = `
    * {
      margin: 0;
      box-sizing: border-box;
    }
    input{ 
        width: 100%;
        max-width: 200px; 
      }
      input[type="color"] {
        width: 100%;
        max-width: 50px; 
      }
    input-array {
        width: 100%;
        max-width: 200px;
        display: flex;
        flex-direction: column;
      }
      
    /* etc... */
  `;
  get src() {
    return this.getAttribute("src");
  }
    

  static template = prepareTemplate(`
  <template>
  <section>
      <restful-form>
        <label>
          <span>Username</span>
          <input name="userid"/>
        </label>
        <label>
          <span>Name</span>
          <input name="name" />
        </label>
        <label>
          <span>Gamertag</span>
          <input name="gamertag" />
        </label>
        <label>
          <span>FavoriteGames</span>
          <input-array name="favoriteGames">
            <span slot="label-add">Add a game</span>
          </input-array>
        </label>
        <label>
          <span>Color</span>
          <input type="color" name="color" />
        </label>
        <label>
          <span>Avatar</span>
          <input name="avatar" />
        </label>
      </restful-form>
      <dl>
        <dt>Username</dt>
        <dd><slot name="userid"></slot></dd>
        <dt>Name</dt>
        <dd><slot name="name"></slot></dd>
        <dt>Gamertag</dt>
        <dd><slot name="gamertag"></slot></dd>
        <dt>FavoriteGames</dt>
        <dd><slot name="favoriteGames"></slot></dd>
      </dl>
    </section>
    <style>${ProfileViewElement.styles}</style>
    </template>
    `);

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      ProfileViewElement.template.cloneNode(true)
    );
  }

  connectedCallback() {
    if ( this.src )
      loadJSON(this.src, this, renderSlots);
  }
}

customElements.define("profile-view", ProfileViewElement);

function renderSlots(json) {
    const entries = Object.entries(json);
    const slot = ([key, value]) => {
      // default case for now:
      return `<span slot="${key}">${value}</span>`;
    };
  
    return entries.map(slot).join("\n");
  }
  