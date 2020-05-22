import gql from 'graphql-tag';

export const GET_SEARCH = gql`
  query Search($query: String!, $limit: Int, $offset: Int){
    search(q: $query, limit: $limit, offset: $offset){
      artists{
        id
        name
        href
        images{
          height
          width
          url
        }
        genres
      }
      tracks{
        id
        name
        artists{
          name
        }
        duration_ms
        album{
          images{
            height
            width
            url
          }
        }
      }
      albums{
        id
        name
        href
        images{
          height
          width
          url
        }
        artists{
          id
          name
        }
      }
      playlists{
        id
        name
        description
        href
        images{
          height
          width
          url
        }
        owner{
          display_name
        }
        primary_color
      }
    }
  }
`

export const GET_ROOM = gql`
  query Room($id: ID!){
    room(id: $id){
      id
      name
      adminUser{
        id
      }
    }
  }
`

export const GET_SONGS = gql`
  query Songs($roomId: ID!){
    songs(roomId: $roomId){
      id
      name
      album{
        id
        images{
          height
          width
          url
        }
      }
      artists{
        id
        name
      }
      duration_ms
      score
    }
  }
`

export const GET_SONG = gql`
  query Song($trackId: ID!){
    song(trackId: $trackId){
      id
      name
      popularity
      preview_url
      href
      uri
      album{
        id
        album_type
        href
        images{
          height
          width
          url
        }
      }
      artists{
        id
        name
        uri
        href
      }
      duration_ms
    }
  }
`

export const GET_ALBUM_TRACKS = gql`
  query Album($albumId: ID!){
    album(albumId: $albumId){
      tracks{
        id
        name
        album{
          images{
            height
            width
            url
          }
        }
        artists{
          id
          name
          uri
          href
        }
        duration_ms
      }
    }
  }
`

export const GET_PLAYLIST_TRACKS = gql`
  query Playlist($playlistId: ID!){
    playlist(playlistId: $playlistId){
      tracks{
        id
        name
        artists{
          id
          name
          uri
          href
        }
        album{
          images{
            height
            width
            url
          }
        }
        duration_ms
      }
    }
  }
`


export const GET_ARTIST_TRACKS = gql`
  query Artist($artistId: ID!){
    artist(artistId: $artistId){
      tracks{
        id
        name
        artists{
          id
          name
          uri
          href
        }
        album{
          images{
            height
            width
            url
          }
        }
        duration_ms
      }
    }
  }
`

export const GET_SONG_RECS = gql`
  query getSongRec($seed: [String]!){
    songRecs(seed: $seed){
      id
      name
      popularity
      preview_url
      href
      uri
      album{
        id
        album_type
        href
        images{
          height
          width
          url
        }
      }
      artists{
        id
        name
        uri
        href
      }
      duration_ms
    }
  }
`

export const GET_ME = gql`
  query Me($accessToken: String!){
    me(accessToken: $accessToken){
      id
      display_name
      images{
        height
        width
        url
      }
    }
  }
`

export const GET_AUTHORIZE_URL = gql`
  query GetAuthorizeUrl($scopes: [String], $redirectUri: String){
    getAuthorizeUrl(scopes: $scopes, redirectUri: $redirectUri){
      url
    }
  }
`

export const GET_ADDED_SONG_IDS = gql`
  {
    songs @client 
  }
`

export const GET_TOAST = gql`
  {
    toast @client {
      id
      message
    }
  }
`;

export const GET_BROWSE_INFO = gql`
  {
    browse @client{
      id
      href
      primaryLabel
      secondaryLabel
      image
      active
      type
      album{
        images{
          height
          width
          url
        }
      }
    }
  }
`

