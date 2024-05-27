import { prepareTemplate } from "./template.js";

export class ProfileViewElement extends HTMLElement {
  static styles = `
    * {
      margin: 0;
      box-sizing: border-box;
    }
    /* etc... */
  `;

  static template = prepareTemplate(`
  <template>
  <section>
    <slot name="avatar"></slot>
    <h1><slot name="name"></slot></h1>
      <nav>
        <button class="new"
          onclick="relayEvent(event,'profile-view:new-mode')"
        >New…</button>
        <button class="edit"
          onclick="relayEvent(event,'profile-view:edit-mode')"
        >Edit</button>
        <button class="close"
          onclick="relayEvent(event,'profile-view:view-mode')"
        >Close</button>
        <button class="delete"
          onclick="relayEvent(event,'profile-view:delete')"
          >Delete</button
        >
      </nav>
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
          <span>Nickname</span>
          <input name="nickname" />
        </label>
        <label>
          <span>Home City</span>
          <input name="home" />
        </label>
        <label>
          <span>Airports</span>
          <input-array name="airports">
            <span slot="label-add">Add an airport</span>
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
}

customElements.define("profile-view", ProfileViewElement);