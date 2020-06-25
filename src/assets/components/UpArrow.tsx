import React from 'react'
import {
  Svg,
  Path
} from 'react-native-svg'
import colors from '../colors'

export default ({ style, fill }: { style: any, fill: string }) => (
  <Svg style={style} fill={fill ? fill : colors.lightGrey} height="36" viewBox="0 0 24 24" width="36">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </Svg>
)