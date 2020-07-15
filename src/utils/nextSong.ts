import firestore, { FirebaseFirestoreTypes }  from '@react-native-firebase/firestore';
import { Song, Room } from '../types'
import { isCompositeType } from 'graphql';
interface nextSong {
  room: Room
}

const nextSong = async ({ room }: nextSong) => {
  const batch = firestore().batch()
  const querySnapshot = await firestore().collection(`rooms/${room.id}/songs`).get()
  if(querySnapshot.docs.length === 0){
    return
  }

  let nextSongDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot
  querySnapshot.forEach((doc) => {
    const song = doc.data() as Song
    if(!nextSongDoc){
      nextSongDoc = doc
    }
    else{
      nextSongDoc = nextSongDoc.data().score < song.score ? doc : nextSongDoc
    }
  });

  console.log('function', room)

  batch.update(firestore().doc(`rooms/${room.id}`), {
    currentlyPlaying: nextSongDoc!.data()
  })
  console.log(nextSongDoc!)
  batch.delete(firestore().doc(`rooms/${room.id}/songs/${nextSongDoc!.id}`))
  return await batch.commit()
}

export default nextSong