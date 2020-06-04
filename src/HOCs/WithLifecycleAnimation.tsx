import React, { useEffect, useState, useRef } from 'react'
import { Animated } from 'react-native';

// TODO: FIGURE OUT HOW TO ALL HOC TO ACCEPT ANY PROP JUST NEED TO HAVE A COUPLE OF MANDATORY ONES 

interface Props{
  isMounted: boolean
  animationDuration: number
  animationFinishedCallback?: () => void
  searchQuery?: string
}

export default (Component: any) => {
  const ComponentWithAnimation = WithAnimation(Component)
  return class extends React.Component<Props> {
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
      return this.state.shouldRender ? <ComponentWithAnimation {...this.props} isMounted={this.props.isMounted} unmountDone={this.unmountDone} /> : null;
    }
  };
}

interface WithAnimationProps {
  isMounted: boolean
  animationDuration: number
  unmountDone: () => void
  animationFinishedCallback?: () => void
}

const WithAnimation = (Component: any) => {
  return class extends React.Component<WithAnimationProps> {
    fadeAnim = new Animated.Value(0)

    componentDidMount() {
      Animated.timing(this.fadeAnim, {
        useNativeDriver: true,
        toValue: 1,
        duration: this.props.animationDuration,
      }).start();
    }

    componentDidUpdate() {
      if (!this.props.isMounted) {
        Animated.timing(this.fadeAnim, {
          useNativeDriver: true,
          toValue: 0,
          duration: this.props.animationDuration,
        }).start(() => {
          this.props.unmountDone()
          this.props.animationFinishedCallback && this.props.animationFinishedCallback()
        });
      }
    }

    render() {
      return (
        <Animated.View style={{ opacity: this.fadeAnim }}>
          <Component {...this.props} />
        </Animated.View>
      )
    }
  };
}