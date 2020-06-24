import React from 'react'
import { 
  Svg,
  Path
} from 'react-native-svg'
import colors from '../../assets/colors'

export default ({ style, fill }: {
  style?: any,
  fill?: string
}) => (
  <Svg style={style} fill={fill ? fill : colors.white} height="24" viewBox="0 0 24 24" width="24">
    <Path d="M0 0h24v24H0z" fill="none"/>
    <Path d="M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"/>
  </Svg>
)