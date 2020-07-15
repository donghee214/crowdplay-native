import React from 'react'
import {
  Svg,
  Path
} from 'react-native-svg'
import colors from '../colors'

export default ({ style, fill }: {
  style?: any,
  fill?: string
}) => (
  <Svg style={style} fill={fill ? fill : colors.lightBlack} viewBox="0 0 24 24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </Svg>
)