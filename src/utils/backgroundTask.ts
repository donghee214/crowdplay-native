import Sound from 'react-native-sound'

const FILE_NAME = 'silence.mp3'
let sound: Sound;
Sound.setCategory('Playback', true)

export const playSilentTrack = async () => {
  
  sound = new Sound(FILE_NAME, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    sound.play();
    sound.setNumberOfLoops(-1);
  });
}

export const stopSilentTrack = async () => {
  sound.stop(() => {
    sound.release()
  })
}