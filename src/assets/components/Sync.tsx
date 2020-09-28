import React from 'react'
import {
  Path,
  Svg
} from 'react-native-svg'

export default ({ style, fill }: {
  style?: any,
  fill?: string
})=> (
  <Svg style={style} fill={fill} height="24" viewBox="0 0 24 24" width="24">
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  </Svg>
)