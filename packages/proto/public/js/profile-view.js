import { prepareTemplate } from "./template.js";
import { loadJSON } from "./json-loader.js";
import { Auth, Observer } from "@calpoly/mustang";
import "./restful-form.js";
import "./input-array.js";


export class ProfileViewElement extends HTMLElement {
    static observedAttributes = ["src", "mode"];

    get src() {
        return this.getAttribute("src");
      }
      get srcCollection() {
        const path = this.src.split("/");
        const collection = path.slice(0, -1);
        return collection.join("/");
      }
    
      get mode() {
        return this.getAttribute("mode");
      }
    
      set mode(m) {
        return this.setAttribute("mode", m);
      }
    

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

    get form() {
        return this.shadowRoot.querySelector("restful-form");
      }
    
      constructor() {
        super();
    
        this.attachShadow({ mode: "open" }).appendChild(
          ProfileViewElement.template.cloneNode(true)
        );
    
        this.addEventListener(
          "profile-view:edit-mode",
          (event) => (this.mode = "edit")
        );
    
        this.addEventListener(
          "profile-view:view-mode",
          (event) => (this.mode = "view")
        );
    
        this.addEventListener(
          "profile-view:new-mode",
          (event) => (this.mode = "new")
        );
    
        this.addEventListener("profile-view:delete", (event) => {
          event.stopPropagation();
          deleteResource(this.src).then(() => (this.mode = "new"));
        });
    
        this.addEventListener("restful-form:created", (event) => {
          console.log("Created a profile", event.detail);
          const userid = event.detail.created.userid;
          this.mode = "view";
          this.setAttribute(
            "src",
            `${this.srcCollection}/${userid}`
          );
        });
    
        this.addEventListener("restful-form:updated", (event) => {
          console.log("Updated a profile", event.detail);
          this.mode = "view";
          console.log("LOading JSON", this.authorization);
          loadJSON(this.src, this, renderSlots, this.authorization);
        });
      }
    
      _authObserver = new Observer(this, "gamin:auth");
    
      get authorization() {
        console.log("Authorization for user, ", this._user);
        return (
          this._user?.authenticated && {
            Authorization: `Bearer ${this._user.token}`
          }
        );
      }
    
      connectedCallback() {
        this._authObserver.observe(({ user }) => {
          console.log("Setting user as effect of change", user);
          this._user = user;
          if (this.src) {
            console.log("LOading JSON", this.authorization);
            loadJSON(
              this.src,
              this,
              renderSlots,
              this.authorization
            ).catch((error) => {
              const { status } = error;
              if (status === 401) {
                const message = new CustomEvent("auth:message", {
                  bubbles: true,
                  composed: true,
                  detail: ["auth/redirect"]
                });
                console.log("Dispatching", message);
                this.dispatchEvent(message);
              } else {
                console.log("Error:", error);
              }
            });
          }
        });
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        console.log(
          `Atribute ${name} changed from ${oldValue} to`,
          newValue
        );
        switch (name) {
          case "src":
            if (
              newValue &&
              this.mode !== "new" &&
              this.authorization
            ) {
              console.log("Loading JSON", this.authorization);
              loadJSON(
                this.src,
                this,
                renderSlots,
                this.authorization
              );
            }
            break;
          case "mode":
            if (newValue === "edit" && this.src) {
              this.form.removeAttribute("new");
              this.form.setAttribute("src", this.src);
            }
            if (newValue === "view") {
              this.form.removeAttribute("new");
              this.form.removeAttribute("src");
            }
            if (newValue === "new") {
              const newSrc = `${this.srcCollection}/$new`;
              this.replaceChildren();
              this.form.setAttribute("new", "new");
              this.form.setAttribute("src", newSrc);
            }
            break;
        }
      }
    }
    
    customElements.define("profile-view", ProfileViewElement);
    
    function renderSlots(json) {
      console.log("RenderingSlots:", json);
      const entries = Object.entries(json);
      const slot = ([key, value]) => {
        let type = typeof value;
    
        if (type === "object") {
          if (Array.isArray(value)) type = "array";
        }
    
        if (key === "avatar") {
          type = "avatar";
        }
    
        switch (type) {
          case "array":
            return `<ul slot="${key}">
              ${value.map((s) => `<li>${s}</li>`).join("")}
              </ul>`;
          case "avatar":
            return `<profile-avatar slot="${key}"
              color="${json.color}"
              src="${value}">
            </profile-avatar>`;
          default:
            return `<span slot="${key}">${value}</span>`;
        }
      };
    
      return entries.map(slot).join("\n");
    }
    
    function deleteResource(src) {
      return fetch(src, { method: "DELETE" })
        .then((res) => {
          if (res.status != 204)
            throw `Deletion failed: Status ${res.status}`;
        })
        .catch((err) =>
          console.log("Error deleting resource:", err)
        );
    }
    
    export class ProfileAvatarElement extends HTMLElement {
      get src() {
        return this.getAttribute("src");
      }
    
      get color() {
        return this.getAttribute("color");
      }
    
      get avatar() {
        return this.shadowRoot.querySelector(".avatar");
      }
    
      static template = prepareTemplate(`
        <template>
          <div class="avatar">
          </div>
          <style>
          :host {
            display: contents;
            --avatar-backgroundColor: var(--color-accent);
            --avatar-size: 100px;
          }
          .avatar {
            grid-column: key;
            justify-self: end;
            position: relative;
            width: var(--avatar-size);
            aspect-ratio: 1;
            background-color: var(--avatar-backgroundColor);
            background-size: cover;
            border-radius: 50%;
            text-align: center;
            line-height: var(--avatar-size);
            font-size: calc(0.66 * var(--avatar-size));
            font-family: var(--font-family-display);
            color: var(--color-link-inverted);
            overflow: hidden;
          }
          </style>
        </template>
        `);
    
      constructor() {
        super();
    
        this.attachShadow({ mode: "open" }).appendChild(
          ProfileAvatarElement.template.cloneNode(true)
        );
      }
    
      connectedCallback() {
        // console.log("Avatar connected", this);
        this.style.setProperty(
          "--avatar-backgroundColor",
          this.color
        );
        this.avatar.style.setProperty(
          "background-image",
          `url('${this.src}')`
        );
      }
    
      attributeChangedCallback(name, from, to) {
        switch (name) {
          case "color":
            this.style.setProperty("--avatar-backgroundColor", to);
            break;
          case "src":
            this.avatar.style.setProperty(
              "background-image",
              `url(${to})`
            );
            break;
        }
      }
    }
    
    customElements.define("profile-avatar", ProfileAvatarElement);