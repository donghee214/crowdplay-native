import React, { useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions
} from 'react-native'
import { useLazyQuery } from '@apollo/react-hooks'
import { TILE_TYPES } from '../components/VotingRoom/MusicTile'
import { useRoute } from '@react-navigation/native';
import { SpotifySong } from '../types'
import { ExpandedModalRouteProps } from './index'
import {
  GET_ALBUM_TRACKS,
  GET_PLAYLIST_TRACKS,
  GET_ARTIST_TRACKS
} from "../graphql/queries"
import ExpandedModalItem from '../components/ExpandedModal/ExpandedModalItem'
import LinearGradient from 'react-native-linear-gradient';

const ExpandedModal = () => {
  const route = useRoute<ExpandedModalRouteProps>()

  const [getAlbumTracks, { loading: albumTracksLoading, data: albumTracks }] = useLazyQuery<{ album: { tracks: SpotifySong[] } }>(GET_ALBUM_TRACKS)
  const [getPlaylistTracks, { loading: playlistTracksLoading, data: playlistTracks }] = useLazyQuery<{ playlist: { tracks: SpotifySong[] } }>(GET_PLAYLIST_TRACKS)
  const [getArtistTracks, { loading: artistTracksLoading, data: artistTracks }] = useLazyQuery<{ artist: { tracks: SpotifySong[] } }>(GET_ARTIST_TRACKS)

  const renderTracks = (tracks: SpotifySong[], type: TILE_TYPES) => (
    <FlatList
      data={tracks}
      style={styles.songListContainer}
      renderItem={({ item }: { item: SpotifySong }) => <ExpandedModalItem
        key={item.id}
        data={{ ...item, album: item.album ? item.album : route.params.image }}
        type={type}
        roomId={route.params.roomId}
        image={route.params.image}
      />}
    />
  )

  useEffect(() => {
    switch (route.params.type) {
      case (TILE_TYPES.ALBUM):
        getAlbumTracks({
          variables: {
            albumId: route.params.id
          }
        })
        break
      case (TILE_TYPES.PLAYLIST):
        getPlaylistTracks({
          variables: {
            playlistId: route.params.id
          }
        })
        break
      case (TILE_TYPES.ARTIST):
        getArtistTracks({
          variables: {
            artistId: route.params.id
          }
        })
        break
      default:
        console.error("TILE_TYPE DID NOT MATCH ANY SUPPORTED TYPES")
    }
  }, [route])

  return (
    <SafeAreaView style={styles.songListContainer}>
      <View style={styles.shadow} />
      <ImageBackground
        blurRadius={5}
        style={styles.backgroundImage}
        source={{
          uri: route.params?.image
        }}>
      </ImageBackground>
      {albumTracks && renderTracks(albumTracks.album.tracks, TILE_TYPES.ALBUM)}
      {playlistTracks && renderTracks(playlistTracks.playlist.tracks, TILE_TYPES.PLAYLIST)}
      {artistTracks && renderTracks(artistTracks.artist.tracks, TILE_TYPES.ARTIST)}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  shadow: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: -1
  },
  songListContainer: {
    paddingHorizontal: 20,
    width: '100%',
    flex: 1,
    position: 'relative'
  }
})

export default ExpandedModal