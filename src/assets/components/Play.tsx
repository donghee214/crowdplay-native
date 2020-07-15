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
      <Path d="M8 5v14l11-7z" />
    </Svg>
  )