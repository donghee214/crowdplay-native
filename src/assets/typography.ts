import { StyleSheet } from 'react-native';

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
  md: 16,
  sm: 14,
  xs: 12,
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

