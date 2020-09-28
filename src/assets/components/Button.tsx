import React from "react"
import {
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import colors from "../colors"
import { fonts } from "../typography";

export enum BUTTON_TYPE {
  PRIMARY = "primary",
  SECONDARY = "secondary"
}

interface ButtonProps {
  type?: BUTTON_TYPE,
  onClick: any,
  children: React.ReactNode,
  disabled?: boolean
}

export default ({ onClick, type = BUTTON_TYPE.PRIMARY, children, disabled }: ButtonProps) => (
  <TouchableOpacity
    style={[
      styles.buttonContainer,
      type === BUTTON_TYPE.PRIMARY ? styles.primary : styles.secondary
    ]}
    onPress={onClick}
    disabled={disabled}>
    {children}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  buttonContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.green,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.green,
    borderWidth: 2
  }
})