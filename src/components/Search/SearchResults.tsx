import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated
} from 'react-native'
import { GET_SEARCH } from "../../graphql/queries"
import { useLazyQuery } from '@apollo/react-hooks'
import { VotingRoomText, textStyles } from '../../assets/typography'
import MusicTile, { TILE_TYPES } from '../VotingRoom/MusicTile'
import { SpotifySong, Artist, Album, Playlist } from '../../types'
import SpotifyAuth from 'react-native-spotify-remote/dist/SpotifyAuth'

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
  onMomentumScrollEnd: () => void
  onScrollEndDrag: () => void
  onGetRef: (ref: any) => void
}

const getSumOfSongs = (data: dataProps) => {
  if (!data) return 0
  return data.search.albums.length + data.search.artists.length + data.search.playlists.length + data.search.tracks.length
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchQuery,
  scrollY,
  HEADER_HEIGHT,
  TAB_BAR_HEIGHT,
  onMomentumScrollEnd,
  onScrollEndDrag,
  onGetRef
}) => {
  const [getSearch, { data: getSearchData, loading: getSearchLoading, error: getSearchError }] = useLazyQuery<dataProps>(GET_SEARCH, {
    fetchPolicy: 'no-cache'
  })

  // const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (searchQuery) {
      getSearch({
        variables: {
          query: searchQuery,
          limit: 25
        }
      })
    }
  }, [searchQuery])

  return (
    <Animated.FlatList
      contentContainerStyle={{
        paddingTop: HEADER_HEIGHT + TAB_BAR_HEIGHT,
      }}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onScrollEndDrag={onScrollEndDrag}
      style={styles.tileContainers}
      data={getSearchData?.search?.tracks || []}
      ref={onGetRef}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      )}
      renderItem={({ item }: { item: SpotifySong }) => (
        <MusicTile data={item} tileType={TILE_TYPES.TRACK} key={item.id} />
      )}
    />
  )
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    paddingHorizontal: 22.5,
    paddingVertical: 27.5
  },
  tileContainers: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})

export default SearchResults