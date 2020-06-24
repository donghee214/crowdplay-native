import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { useQuery } from "@apollo/react-hooks"
import { GET_TOAST } from "../graphql/queries"
import WithAnimation from '../HOCs/WithLifecycleAnimation'
import colors from '../assets/colors'
import { textStyles } from '../assets/typography'

const Toast = ({
  message
}: {
  message: string
}) => (
    <View style={styles.toastContainer}>
      <View style={styles.toast}>
        <Text style={[textStyles.p, styles.toastFont]}>
          {message}
        </Text>
      </View>
    </View>
  )



export default (ComposedComponent: any) => {
  const AnimatedToast = WithAnimation(Toast)

  return (props: any) => {
    const { data } = useQuery(GET_TOAST)
    const [mount, setMount] = useState(false)
    let timeout: any

    useEffect(() => {
      if (!data.toast.message) return
      if (mount === false) {
        setMount(true)
        timeout = setTimeout(() => { setMount(false) }, 2000)
      }
      else {
        setMount(false)
        setTimeout(() => {
          timeout = setTimeout(() => { setMount(false) }, 2000)
          setMount(true)
        }, 50)

      }
      // clear any existing timeouts whenever the value changes
      return () => clearTimeout(timeout)
    }, [data.toast.id])

    return (
      <React.Fragment>
        <ComposedComponent {...props} />
        <AnimatedToast
          isMounted={mount}
          animationDuration={300}
          message={data.toast.message}
          fade={true}
          translate={true}
        />
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  toastContainer: {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    zIndex: 1
  },
  toast: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.lightGrey
  },
  toastFont: {
    color: colors.white
  }
})