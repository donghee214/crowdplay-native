import { SpotifySong } from "../types";
import { useMutation } from "@apollo/react-hooks"
import { ADD_SONG } from "../graphql/mutations"
import { useApolloClient } from "@apollo/react-hooks";
import firestore from '@react-native-firebase/firestore'

export default () => {
    const [addSong, { data: addSongData, error: addSongDataError }] = useMutation(ADD_SONG)
    const client = useApolloClient();
    const queueSong = (data: SpotifySong, roomId: string, clicked: boolean) => {
        if (clicked) {
            client.writeData({
                data: {
                    toast: {
                        id: data.id + "_already_added",
                        message: "Song already in queue"
                    }
                }
            })
        }
        else {
            const songRef = firestore().collection(`rooms/${roomId}/songs`).doc(data.id)
            client.writeData({
                data: {
                    toast: {
                        id: data.id,
                        message: `${data.name} added`
                    }
                }
            })
            songRef.set({
                trackId: data.id,
                score: 1,
                voters: [],
                song: data
            })
        }
    }
    return queueSong
}

