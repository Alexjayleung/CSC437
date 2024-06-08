"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var profiles_exports = {};
__export(profiles_exports, {
  default: () => profiles_default,
  get: () => get
});
module.exports = __toCommonJS(profiles_exports);
let profiles = [
  {
    id: "Jay",
    name: "Alex Leung",
    gamertag: "Jayslayin",
    favoriteGames: ["Valorant", "League of Legends", "Elden Ring"],
    color: "#8A81BE",
    avatar: void 0
  },
  {
    id: "Wendon",
    name: "Wendon Luu",
    gamertag: "Wellluu",
    favoriteGames: ["Valorant", "League of Legends"],
    color: void 0,
    avatar: void 0
  }

];

function get(id) {
  const found = profiles.find((t) => t.id === id);
  if (found)
    return found;
  throw `Profile not found: ${id}`;
}
var profiles_default = { get };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  get
});