import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native'
import usePrevious from '../hooks/usePrevious'
import { useQuery } from '@apollo/react-hooks'
import { GET_ROOM_LOCAL } from "../graphql/queries"
import { textStyles, VotingRoomText, fonts } from '../assets/typography'
import withLifecycleAnimation from '../HOCs/WithLifecycleAnimation'
import SearchResults from '../components/Search/SearchResults'
import SongRecs from '../components/Search/SongRecs'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import colors from '../assets/colors'

const SongRecsWithAnimation = withLifecycleAnimation(SongRecs)
const SearchResultsWithAnimation = withLifecycleAnimation(SearchResults)

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 150;

const initialLayout = { width: Dimensions.get('window').width };

const SearchScreen = () => {
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const scrollY: any = useRef(new Animated.Value(0)).current

  // const [isSongRecsAnimating, setIsSongRecsAnimating] = useState<boolean>(false)
  // const [isSearchResultsAnimating, setIsSearchResultsAnimating] = useState<boolean>(false)
  // const [showRecs, setShowRecs] = useState<boolean>(true)

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  let listRefArr: any = useRef([]);
  let listOffset: any = useRef({});

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'first':
        return <SearchResults
          searchQuery={searchQuery}
          scrollY={scrollY}
          HEADER_HEIGHT={HEADER_HEIGHT}
          TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          onGetRef={(ref) => {
            if (ref) {
              const found = listRefArr.current.find((e: any) => e.key === route.key);
              if (!found) {
                listRefArr.current.push({
                  key: route.key,
                  value: ref,
                });
              }
            }
          }}
        />;
      case 'second':
        return <SearchResults
          searchQuery={searchQuery}
          scrollY={scrollY}
          HEADER_HEIGHT={HEADER_HEIGHT}
          TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          onGetRef={(ref) => {
            if (ref) {
              const found = listRefArr.current.find((e: any) => e.key === route.key);
              if (!found) {
                listRefArr.current.push({
                  key: route.key,
                  value: ref,
                });
              }
            }
          }}
        />;
      default:
        return null;
    }
  };

  const syncScrollOffset = () => {
    const curRouteKey = routes[index].key;
    listRefArr.current.forEach((item: any) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HEADER_HEIGHT && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HEADER_HEIGHT) {
          if (
            listOffset.current[item.key] < HEADER_HEIGHT ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HEADER_HEIGHT,
                animated: false,
              });
              listOffset.current[item.key] = HEADER_HEIGHT;
            }
          }
        }
      }
    });
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };

  const onMomentumScrollEnd = () => {
    syncScrollOffset();
  }

  useEffect(() => {
    scrollY.addListener(({ value }: { value: any}) => {
      const curRoute = routes[index].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [routes, index]);

  // const renderHeader = () => {
  //   const y = scrollY.interpolate({
  //     inputRange: [0, HeaderHeight],
  //     outputRange: [0, -HeaderHeight],
  //     extrapolateRight: 'clamp',
  //   });
  //   return (
  //     <Animated.View style={[styles.header,
  //     { transform: [{ translateY: y }] }]}>
  //       // just a simple header
  //       <Text>{'Header'}</Text>
  //     </Animated.View>
  //   );
  // };

  // const focusHandler = (focus: boolean) => {
  //   if (!focus && !searchQuery) {
  //     setShowRecs(true)
  //   }
  //   else {
  //     setShowRecs(false)
  //   }
  // }

  // useEffect(() => {
  //   if (showRecs) {
  //     setIsSongRecsAnimating(true)
  //   }
  //   else {
  //     setIsSearchResultsAnimating(true)
  //   }
  // }, [showRecs])

  const renderTabBar = (props: any) => {
    const y = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [HEADER_HEIGHT, 0],
      extrapolateRight: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{ translateY: y }],
          width: '100%',
        }}>
        <TabBar {...props} />
      </Animated.View>
    );
  };

  const renderTabView = () => (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  )

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolateRight: 'clamp',
    });

    return (
      <Animated.View style={[styles.header,
      { transform: [{ translateY: y }] }]}>
        <View style={styles.topHeader}>
          <View>
            <Text style={[textStyles.h1, VotingRoomText.header]}>
              Add Songs
            </Text>
            <Text style={[textStyles.p, VotingRoomText.description]}>
              Search or browse for Artists or Songs
            </Text>
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
            placeholder={"Search for songs, artists, or albums!"}
          // onFocus={() => focusHandler(true)}
          // onBlur={() => focusHandler(false)}
          />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {renderTabView()}
        {renderHeader()}
        {/* <ScrollView>
        <View>
          <View style={styles.topHeader}>
            <Text style={[textStyles.h1, VotingRoomText.header]}>
              Search
                </Text>
            <Text style={[textStyles.p, VotingRoomText.description]}>
              Search for songs, artists, albums, or playlists
                </Text>
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => focusHandler(true)}
            onBlur={() => focusHandler(false)}
          />
        </View>
        <SongRecsWithAnimation
          animationDuration={150}
          isMounted={(showRecs && !isSearchResultsAnimating)}
          animationFinishedCallback={() => setIsSongRecsAnimating(false)}
        />
        <SearchResultsWithAnimation
          animationDuration={150}
          isMounted={(!showRecs && !isSongRecsAnimating)}
          animationFinishedCallback={() => setIsSearchResultsAnimating(false)}
          searchQuery={searchQuery}
        />
      </ScrollView> */}
      </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  topHeader: {
    display: 'flex',
    width: '100%'
  },
  searchBar: {
    fontFamily: fonts.sourceSansProRegular,
    marginVertical: 15,
    paddingVertical: 12.5,
    paddingHorizontal: 12.5,
    backgroundColor: colors.white,
    fontSize: 14,
    borderRadius: 6,
    color: colors.lightBlack
  },
  header: {
    top: 0,
    height: HEADER_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'red',
    alignItems: 'flex-start',
    position: 'absolute',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
})

export default SearchScreen