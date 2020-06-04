import { StyleSheet } from 'react-native';
import colors from './colors'

export const fonts = {
  montserratLight: "Monsterrat-Light",
  montserratRegular: "Montserrat-Regular",
  monsterratSemiBold: "Montserrat-SemiBold",
  monsterratBold: "Monterrat-Bold",
  sourceSansProLight: "SourceSansPro-Light",
  sourceSansProRegular: "SourceSansPro-Regular",
  sourceSansProSemiBold: "SourceSansPro-SemiBold",
  sourceSansProBold: "SourceSansPro-Bold"
};

export const sizes = {
  lg: 24,
  md: 18,
  sm: 16,
  xs: 14,
}

export const textStyles = StyleSheet.create({
  h1: {
    fontFamily: fonts.monsterratSemiBold,
    fontSize: sizes.lg,
  },
  h2: {
    fontFamily: fonts.monsterratSemiBold,
    fontSize: sizes.md
  },
  h3: {
    fontFamily: fonts.monsterratSemiBold,
    fontSize: sizes.sm
  },
  p: {
    fontFamily: fonts.sourceSansProRegular,
    fontSize: sizes.xs
  },
});

export const VotingRoomText = StyleSheet.create({
  header: {
    color: colors.lightBlack,
    fontSize: 30
  },
  description: {
    color: colors.lightGrey,
    fontSize: 14,
    paddingLeft: 2
  }
})