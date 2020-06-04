import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import { GET_SEARCH } from "../../graphql/queries"
import { useLazyQuery } from '@apollo/react-hooks'
import { VotingRoomText, textStyles } from '../../assets/typography'

interface SearchResultsProps {
  searchQuery: string
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchQuery }) => {
  const [getSearch, { data: getSearchData, loading: getSearchLoading, error: getSearchError }] = useLazyQuery(GET_SEARCH, {
    fetchPolicy: 'no-cache'
  })

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
    <React.Fragment>
      <View style={styles.header}>
        <Text style={[textStyles.h1, VotingRoomText.header]}>
          Search Results
          </Text>
        <Text style={[textStyles.p, VotingRoomText.description]}>
          {searchQuery}
        </Text>
      </View>
      <View>
      </View>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    paddingHorizontal: 22.5,
    paddingVertical: 27.5
  }
})

export default SearchResults