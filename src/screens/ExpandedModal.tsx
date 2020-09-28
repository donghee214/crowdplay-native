import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useLazyQuery } from '@apollo/react-hooks'
import { TILE_TYPES } from '../components/VotingRoom/MusicTile'
import { useRoute, useNavigation } from '@react-navigation/native';
import { SpotifySong } from '../types'
import { ExpandedModalRouteProps } from './index'
import {
  GET_ALBUM_TRACKS,
  GET_PLAYLIST_TRACKS,
  GET_ARTIST_TRACKS
} from "../graphql/queries"
import ExpandedModalItem from '../components/ExpandedModal/ExpandedModalItem'
import BackButton from '../assets/components/BackButton'
import { textStyles } from '../assets/typography'
import colors from '../assets/colors';

const ExpandedModal = () => {
  const route = useRoute<ExpandedModalRouteProps>()
  const navigation = useNavigation()
  const [imageLoading, setImageLoading] = useState<boolean>(true)

  const [getAlbumTracks, { loading: albumTracksLoading, data: albumTracks }] = useLazyQuery<{ album: { tracks: SpotifySong[] } }>(GET_ALBUM_TRACKS)
  const [getPlaylistTracks, { loading: playlistTracksLoading, data: playlistTracks }] = useLazyQuery<{ playlist: { tracks: SpotifySong[] } }>(GET_PLAYLIST_TRACKS)
  const [getArtistTracks, { loading: artistTracksLoading, data: artistTracks }] = useLazyQuery<{ artist: { tracks: SpotifySong[] } }>(GET_ARTIST_TRACKS)

  const navigationBack = () => {
    navigation.goBack()
  }

  const renderTracks = (tracks: SpotifySong[], type: TILE_TYPES) => {
    return (
    <FlatList
      data={tracks}
      style={styles.songListContainer}
      ListHeaderComponent={
        <View style={styles.titleContent}>
          <TouchableOpacity style={styles.topBar} onPress={navigationBack}>
            <BackButton />
          </TouchableOpacity>
          <ImageBackground
            style={styles.tileImage}
            imageStyle={{
              borderRadius: 20
            }}
            source={{
              uri: route.params?.image
            }}
          />
          <View style={styles.titleTextContainer}>
            <Text style={[textStyles.h1, styles.primaryLabelStyle]}>
              {route.params.primaryLabel}
            </Text>
            <Text style={[textStyles.h3, styles.secondaryLabelStyle]}>
              {route.params.secondaryLabel}
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }: { item: SpotifySong }) => <ExpandedModalItem
        key={item.id}
        data={{ ...item, album: type === TILE_TYPES.ALBUM ? route.params.album : item.album}}
        type={type}
        roomId={route.params.roomId}
        image={route.params.image}
      />}
    />
  )
}

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
      {(albumTracksLoading || playlistTracksLoading || artistTracksLoading) &&
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'}/>
        </View>
      }
      {albumTracks && renderTracks(albumTracks.album.tracks, TILE_TYPES.ALBUM)}
      {playlistTracks && renderTracks(playlistTracks.playlist.tracks, TILE_TYPES.PLAYLIST)}
      {artistTracks && renderTracks(artistTracks.artist.tracks, TILE_TYPES.ARTIST)}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  titleContent: {
    width: '100%',
    paddingVertical: 20,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  tileImage: {
    width: 250,
    height: 250,
    borderRadius: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 20,
  },
  shadow: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 0,
  },
  backgroundImage: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1
  },
  songListContainer: {
    paddingHorizontal: 20,
    flex: 1,
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
  loadingContainer:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 300,
    zIndex: 2
  },
  topBar:{
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    width: '100%'
  },
  titleTextContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabelStyle: {
    color: colors.white,
    textAlign: 'center'
  },
  secondaryLabelStyle: {
    color: colors.offWhite,
    marginTop: 2,
    fontSize: 14
  },
})

export default ExpandedModal