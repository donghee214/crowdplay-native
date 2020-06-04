import React from 'react'
import { 
  View,
  Text
} from 'react-native'

import { useRoute } from '@react-navigation/native';
import { ExpandedModalRouteProps } from '../screens'

const ExpandedModal = () => {
  const route = useRoute<ExpandedModalRouteProps>()
  return(
    <View>
      View for more info about artist, playlist, or album
    </View>
  )
}

export default ExpandedModal