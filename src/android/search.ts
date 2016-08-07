import {TNSSpotifyAuth} from './auth';
import {TNSTrack} from '../common';

declare var kaaes: any;
let SpotifyApi: any = kaaes.spotify.webapi.android.SpotifyApi;
let SpotifyCallback: any = kaaes.spotify.webapi.android.SpotifyCallback;

export class TNSSpotifySearch {
  public static CURRENT_LIST: any;
  public static CURRENT_SEARCH_QUERY: string;
  public static apiInstance: any;

  public static QUERY(query: string, queryType: string, offset: number = 0): Promise<any> {

    if (!TNSSpotifySearch.apiInstance) {
      console.log(`TNSSpotifySearch.apiInstance`);
      console.log(`SpotifyApi`);
      console.log(SpotifyApi);
      TNSSpotifySearch.apiInstance = new SpotifyApi();
      console.log(TNSSpotifySearch.apiInstance);
    }
    for (let key in TNSSpotifySearch.apiInstance) {
      console.log(key);
    }
    console.log('access token:');
    console.log(TNSSpotifyAuth.SESSION);
    TNSSpotifySearch.apiInstance.setAccessToken(TNSSpotifyAuth.SESSION);
    console.log(`just set token.`);
    console.log(TNSSpotifySearch.apiInstance.getService);
    console.log(TNSSpotifySearch.apiInstance.getService());
    let serviceApi = TNSSpotifySearch.apiInstance.getService();
    console.log(`serviceApi:`);
    console.log(serviceApi);

    // query: search term
    // queryType: album, artist, playlist, and track
    query = query && query.length ? query.replace(/ /ig, '+') : '';

    return new Promise((resolve, reject) => {  
      if (query.length === 0) {
        return;
      }

      let reset = false;
      if (TNSSpotifySearch.CURRENT_SEARCH_QUERY !== query) {
        TNSSpotifySearch.CURRENT_SEARCH_QUERY = query;
        // always reset with new queries
        reset = true;
        TNSSpotifySearch.CURRENT_LIST = undefined;
      }

      let processResults = (results: any) => {
        
        TNSSpotifySearch.CURRENT_LIST = results;
        console.log(results);
        for (let key in results) {
          console.log(key);
          console.log(results[key]);
        }

        // if (results && results.items) {
        //   let result: any = {
        //     page: offset,
        //     hasNextPage: results.hasNextPage,
        //     totalListLength: results.totalListLength
        //   };
        //   switch (queryType) {
        //     case 'track':
        //       result.tracks = TNSSpotifySearch.TRACKS_FROM_RESULTS(results)
        //       break;
        //   }
        //   resolve(result);
        // } else {
        //   // no results
        //   reject();
        // }
      };

      console.log(`TNSSpotifySearch.QUERY offset: ${offset}`);
      TNSSpotifyAuth.VERIFY_SESSION(TNSSpotifyAuth.SESSION).then(() => {
        if (!reset && offset > 0 && TNSSpotifySearch.CURRENT_LIST) {

          if (TNSSpotifySearch.CURRENT_LIST.hasNextPage) {
            // get next page
            TNSSpotifySearch.CURRENT_LIST.requestNextPageWithAccessTokenCallback(TNSSpotifyAuth.SESSION.accessToken, processResults);
          }          
          
        } else {

          serviceApi.searchTracks(query, new SpotifyCallback({
            success: (trackPager, res) => {
              console.log('success! trackPager...');
              console.log(trackPager);
              for (let key in trackPager) {
                console.log(key);
              }
              processResults(trackPager.tracks);
            },
            failure: (err) => {
              console.log('search error...');
              console.log(err);
              reject();
            }
          }));
              
        }

      }, () => {
        reject();
      });
    });
  }
  
  public static TRACKS_FROM_RESULTS(results: any): Array<TNSTrack> {
    // console.log(`TRACKS_FROM_RESULTS`);
    // console.log(results);
    let itemNSArray = results.items;
    
    // console.log(itemNSArray);
    let cnt = itemNSArray.count;
    // console.log(`track cnt: ${cnt}`);
    let items = [];
    for (let i = 0; i < cnt; i++) {
      let trackObj = itemNSArray.objectAtIndex(i);
      // console.log(trackObj.name);
      let spotifyArtist = trackObj.artists.objectAtIndex(0);
      let artist = {};
      // if uri is null, skip as it cannot be played
      // console.log(spotifyArtist.uri);
      if (spotifyArtist && spotifyArtist.uri && spotifyArtist.uri != 'null') {
        artist = {
          id: spotifyArtist.identifier,
          name: spotifyArtist.name
        };
        let spotifyAlbum = trackObj.album;
        let album = {};
        if (spotifyAlbum) {
          album = {
            id: spotifyAlbum.identifier,
            name: spotifyAlbum.name
          };
        }
        
        let track: TNSTrack = {
          id: trackObj.identifier,
          name: trackObj.name,
          artist: artist,
          duration: trackObj.duration,
          album: album,
          playing: false
        };
        items.push(track);
        // console.log(`adding: ${i}`);
      }
    }
    return items;
  }
}