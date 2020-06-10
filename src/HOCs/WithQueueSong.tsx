import React, { useEffect } from "react"
import { SpotifySong } from "../types";
import { useQuery, useMutation } from "@apollo/react-hooks"
import { ADD_SONG } from "../graphql/mutations"
import { useApolloClient } from "@apollo/react-hooks";
import firestore from '@react-native-firebase/firestore'

const WithQueueSong = (Component: any) => (props: any) => {
    // adding song directly thru firebase
    const [addSong, { data: addSongData, error: addSongDataError }] = useMutation(ADD_SONG)
    const client = useApolloClient();

    const queueSong = (data: SpotifySong, roomId: string, clicked: boolean) => {
        if (clicked) {
            client.writeData({
                data: {
                    toast: {
                        id: props.data.id + "_already_added",
                        message: "Song already in queue"
                    }
                }
            })
        }
        else {
            const songRef = firestore().collection(`rooms/${roomId}/songs`).doc(data.id)
            songRef.set({
                trackId: data.id,
                score: 1,
                voters: [],
                song: data
            })
            client.writeData({
                data: {
                    toast: {
                        id: props.data.id,
                        message: "Song added"
                    }
                }
            })
        }
    }

    return <Component queueSong={queueSong} {...props} />
}

export default WithQueueSong