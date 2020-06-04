import React, { useState, useEffect, useRef } from "react"
import { useQuery } from "@apollo/react-hooks";
import { GET_SONG_RECS } from "../../graphql/queries"
import { VotingRoomText, textStyles } from '../../assets/typography'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

interface RecSongsProps {
  isMounted: boolean
  animationDuration: number
  unmountDone: () => void
}


const RecSongs: React.FC<RecSongsProps> = ({ isMounted, animationDuration, unmountDone }) => {
  const { loading, data, error, refetch } = useQuery(GET_SONG_RECS, { variables: { seed: ["dance"] }, notifyOnNetworkStatusChange: true })

  return (
    <React.Fragment>
      <View style={styles.header}>
        <Text style={[textStyles.h1, VotingRoomText.header]}>
          Recommended
          </Text>
        <Text style={[textStyles.p, VotingRoomText.description]}>
          Based off the current songs in queue
          </Text>
      </View>
      <View>
        {/* {data.songRecs.map(())} */}
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

export default RecSongs