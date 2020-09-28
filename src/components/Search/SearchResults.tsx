import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { GET_SEARCH, GET_ROOM_LOCAL, GET_ADDED_SONG_IDS } from "../../graphql/queries"
import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { VotingRoomText, textStyles } from '../../assets/typography'
import MusicTile, { TILE_TYPES } from '../VotingRoom/MusicTile'
import { SpotifySong, Artist, Album, Playlist } from '../../types'

interface dataProps {
  search: {
    artists: Artist[],
    albums: Album[],
    playlists: Playlist[],
    tracks: SpotifySong[]
  }
}

interface SearchResultsProps {
  searchQuery: string
  scrollY: any
  HEADER_HEIGHT: number
  TAB_BAR_HEIGHT: number
  type: TILE_TYPES.ARTIST | TILE_TYPES.ALBUM | TILE_TYPES.TRACK | TILE_TYPES.PLAYLIST
  onMomentumScrollEnd: () => void
  onScrollEndDrag: () => void
  onGetRef: (ref: any) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  scrollY,
  HEADER_HEIGHT,
  TAB_BAR_HEIGHT,
  onMomentumScrollEnd,
  onScrollEndDrag,
  type,
  onGetRef
}) => {
  const [getSearch, { data: getSearchData, loading: getSearchLoading, error: getSearchError }] = useLazyQuery<dataProps>(GET_SEARCH, {
    fetchPolicy: 'no-cache'
  })
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  const getData = () => {
    switch (type) {
      case TILE_TYPES.TRACK:
        return getSearchData?.search?.tracks || []
      case TILE_TYPES.ALBUM:
        return getSearchData?.search?.albums || []
      case TILE_TYPES.ARTIST:
        return getSearchData?.search?.artists || []
      case TILE_TYPES.PLAYLIST:
        return getSearchData?.search?.playlists || []

      default:
        return []
    }
  }

  useEffect(() => {
    const typeMatching = {
      [TILE_TYPES.TRACK]: ['track'],
      [TILE_TYPES.ARTIST]: ['artist'],
      [TILE_TYPES.PLAYLIST]: ['playlist'],
      [TILE_TYPES.ALBUM]: ['album']
    }
    if (searchQuery) {
      getSearch({
        variables: {
          query: searchQuery,
          limit: 40,
          type: typeMatching[type]
        }
      })
    }
  }, [searchQuery])

  return (
    <React.Fragment>
      {getSearchLoading && <ActivityIndicator style={styles.loading} />}
      <Animated.FlatList
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT,
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        data={getData()}
        numColumns={type === TILE_TYPES.TRACK ? 3 : 2}
        onScrollBeginDrag={Keyboard.dismiss}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        ref={onGetRef}
        keyExtractor={(item: SpotifySong, index: number) => item.id}
        renderItem={({ item }: { item: SpotifySong }) => (
          <MusicTile
            data={item}
            roomId={dataRoomId.roomId}
            tileType={type}
          />
        )}
      />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 350,
    width: '100%'
  }
})

export default React.memo(SearchResults)