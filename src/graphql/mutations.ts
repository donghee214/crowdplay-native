import gql from 'graphql-tag';

export const ADD_SONG = gql`
    mutation AddSongToRoom($roomId: ID!, $song: SongInput){
        addSongToRoom(roomId: $roomId, song: $song)
    }
`

export const UPVOTE_SONG = gql`
    mutation UpvoteSong($roomId: ID!, $trackId: ID!){
        upvoteSong(roomId: $roomId, trackId: $trackId)
    }
`

export const CREATE_ROOM = gql`
    mutation AddRoom($roomId: ID!, $admin: UserInput){
      addRoom(id: $roomId, admin: $admin){
        id
      }
    }
`

export const NEXT_SONG = gql`
    mutation NextSong($roomId: ID!){
        nextSong(roomId: $roomId)
    }
`