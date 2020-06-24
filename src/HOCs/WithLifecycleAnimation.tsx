import React, { useEffect, useState, useRef } from 'react'
import { Animated } from 'react-native';

// TODO: FIGURE OUT HOW TO ALL HOC TO ACCEPT ANY PROP JUST NEED TO HAVE A COUPLE OF MANDATORY ONES 

interface Props {
  isMounted: boolean
  animationDuration: number
  animationFinishedCallback?: () => void
}

export default (Component: any) => {
  const ComponentWithAnimation = WithAnimation(Component)
  return class extends React.Component<Props | any> {
    state = {
      shouldRender: this.props.isMounted
    };

    unmountDone = () => {
      this.setState({ shouldRender: false })
    }

    componentDidUpdate(prevProps: any) {
      if (!prevProps.isMounted && this.props.isMounted) {
        this.setState({ shouldRender: true })
      }
    }

    render() {
      return this.state.shouldRender ? <ComponentWithAnimation
        {...this.props}
        animationDuration={this.props.animationDuration}
        isMounted={this.props.isMounted} unmountDone={this.unmountDone} /> : null;
    }
  };
}

// const fadeInOpacity = (value, duration) => (
//   Animated.timing(value, {
//     useNativeDriver: true,
//     toValue: 1,
//     duration: duration,
//   }).start();
// )

interface WithAnimationProps {
  isMounted: boolean
  animationDuration: number
  unmountDone: () => void
  animationFinishedCallback?: () => void,
  fade?: boolean,
  translate?: boolean
}

const WithAnimation = (Component: any) => {
  return class extends React.Component<WithAnimationProps> {
    fadeAnim = new Animated.Value(0)
    translateAnim = new Animated.Value(0)

    componentDidMount() {
      const animations = []
      if (this.props.fade) {
        animations.push(Animated.timing(this.fadeAnim, {
          useNativeDriver: true,
          toValue: 1,
          duration: this.props.animationDuration,
        }))
      }
      if (this.props.translate) {
        animations.push(Animated.timing(this.translateAnim, {
          useNativeDriver: true,
          toValue: -100,
          duration: this.props.animationDuration,
        }))
      }
      Animated.parallel(animations).start()
    }

    componentDidUpdate() {
      if (!this.props.isMounted) {
        const animations = []
        if (this.props.fade) {
          animations.push(Animated.timing(this.fadeAnim, {
            useNativeDriver: true,
            toValue: 0,
            duration: this.props.animationDuration,
          }))
        }
        if (this.props.translate) {
          animations.push(Animated.timing(this.translateAnim, {
            useNativeDriver: true,
            toValue: 50,
            duration: this.props.animationDuration,
          }))
        }
        Animated.parallel(animations).start(() => {
          this.props.unmountDone()
          this.props.animationFinishedCallback && this.props.animationFinishedCallback()
        })
      }
    }

    render() {
      return (
        <Animated.View style={{
          opacity: this.fadeAnim,
          transform: [
            { translateY: this.translateAnim }
          ]
        }}>
          <Component {...this.props} />
        </Animated.View>
      )
    }
  };
}