//src/models/profile.ts
export interface Profile {
    userid: string;
    name: string;
    gamertag: string | undefined;
    favoriteGames: Array<String>;
    avatar: string | undefined;
    color: string | undefined;


}
