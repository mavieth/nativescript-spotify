export interface ISpotifyUser {
    displayName: string;
    emailAddress: string;
    uri: string;
    product: number;
}

export interface ISpotifyTrackMetadata {
    albumName?: string;
    albumUri?: string;
    artistName?: string;
    artistUri?: string;
    trackDuration?: string;
    trackName?: string;
    trackUri?: string;
}

export interface ISpotifyTrack {
    id: string;
    name: string;
    artist: any;
    duration: number;
    album: any;
    playing: boolean;
}

export interface ISpotifyPlaylist {
    uri: string;
    name: string;
    tracks: any;
    playing: boolean;
}

export class TNSSpotifyConstants {
    public static CLIENT_ID: string;
    public static NOTIFY_AUTH_LOGIN_CHANGE: string = `SpotifyLoginChange`;
    public static NOTIFY_LOGIN_CHECK: string = `SpotifyLoginCheck`;
    public static NOTIFY_LOGIN_SUCCESS: string = `SpotifyLoginSuccess`;
    public static NOTIFY_LOGIN_ERROR: string = `SpotifyLoginError`;
    public static NOTIFY_PLAYER_READY: string = `SpotifyPlayerReady`;
    public static KEY_STORE_SESSION: string = `SpotifySession`;
}
