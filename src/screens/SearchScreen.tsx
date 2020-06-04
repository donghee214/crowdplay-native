import React, { useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData
} from 'react-native'
import usePrevious from '../hooks/usePrevious'
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../graphql/queries"
import { textStyles, VotingRoomText } from '../assets/typography'
import colors from '../assets/colors'
import withLifecycleAnimation from '../HOCs/WithLifecycleAnimation'
import SearchResults from '../components/Search/SearchResults'
import SongRecs from '../components/Search/SongRecs'

const SongRecsWithAnimation = withLifecycleAnimation(SongRecs)
const SearchResultsWithAnimation = withLifecycleAnimation(SearchResults)


const SearchScreen = () => {
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSongRecsAnimating, setIsSongRecsAnimating] = useState<boolean>(false)
  const [isSearchResultsAnimating, setIsSearchResultsAnimating] = useState<boolean>(false)
  const [showRecs, setShowRecs] = useState<boolean>(true)
  const prevShowRecs = usePrevious(showRecs)

  const focusHandler = (focus: boolean) => {
    if (!focus && !searchQuery) {
      setShowRecs(true)
    }
    else {
      setShowRecs(false)
    }
  }

  useEffect(() => {
    if (showRecs) {
      setIsSongRecsAnimating(true)
    }
    else {
      setIsSearchResultsAnimating(true)
    }
  }, [showRecs])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.topHeader}>
          <Text style={[textStyles.h1, VotingRoomText.header]}>
            Search
          </Text>
          <Text style={[textStyles.p, VotingRoomText.description]}>
            Search for songs, artists, albums, or playlists
          </Text>
        </View>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => focusHandler(true)}
          onBlur={() => focusHandler(false)}
        />
        <SongRecsWithAnimation
          animationDuration={150}
          isMounted={(showRecs && !isSearchResultsAnimating)}
          animationFinishedCallback={() => setIsSongRecsAnimating(false)}
        />
        <SearchResultsWithAnimation
          animationDuration={150}
          isMounted={(!showRecs && !isSongRecsAnimating)}
          animationFinishedCallback={() => setIsSearchResultsAnimating(false)}
          searchQuery={searchQuery}
        />
      </ScrollView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  topHeader: {
    display: 'flex',
    paddingHorizontal: 22.5,
    paddingVertical: 27.5
  }
})

export default SearchScreen