// src/models/profile.ts
// export interface Profile {
//     id: string;
//     name: string;
//     gamertag: string | undefined;
//     favoriteGames: Array<String>;
//     avatar: string | undefined;
//     color: string | undefined;


//   }
export interface Profile {
  userid: string;
  name: string;
  nickname: string | undefined;
  home: string;
  airports: Array<String>;
  avatar: string | undefined;
  color: string | undefined;
}