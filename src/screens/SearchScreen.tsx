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
import { textStyles, VotingRoomText, fonts, sizes } from '../assets/typography'

import SearchResults from '../components/Search/SearchResults'
import { TabView, TabBar } from 'react-native-tab-view';
import { TILE_TYPES } from '../components/VotingRoom/MusicTile'
import colors from '../assets/colors'

const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 150;
const HEADER_VISIBLE = 60;

const initialLayout = { width: Dimensions.get('window').width };

const SearchScreen = () => {
  const { data: dataRoomId } = useQuery(GET_ROOM_LOCAL)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const scrollY: any = useRef(new Animated.Value(0)).current

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Songs', title: 'Songs' },
    { key: 'Artists', title: 'Artists' },
    { key: 'Playlists', title: 'Playlists' },
    { key: 'Albums', title: 'Albums' },
  ]);

  let listRefArr: any = useRef([]);
  let listOffset: any = useRef({});

  const renderScene = ({ route }: { route: any }) => {
    const refHandler = (ref: any) => {
      if (ref) {
        const found = listRefArr.current.find((e: any) => e.key === route.key);
        if (!found) {
          listRefArr.current.push({
            key: route.key,
            value: ref,
          });
        }
      }
    }

    switch (route.key) {
      case 'Songs':
        return <SearchResults
          searchQuery={searchQuery}
          scrollY={scrollY}
          HEADER_HEIGHT={HEADER_HEIGHT}
          TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          type={TILE_TYPES.TRACK}
          onGetRef={refHandler}
        />;
      case 'Artists':
        return <SearchResults
          searchQuery={searchQuery}
          scrollY={scrollY}
          HEADER_HEIGHT={HEADER_HEIGHT}
          TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          type={TILE_TYPES.ARTIST}
          onGetRef={refHandler}
        />;
      case 'Playlists':
        return <SearchResults
          searchQuery={searchQuery}
          scrollY={scrollY}
          HEADER_HEIGHT={HEADER_HEIGHT}
          TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          type={TILE_TYPES.PLAYLIST}
          onGetRef={refHandler}
        />;
      case 'Albums':
        return <SearchResults
          searchQuery={searchQuery}
          scrollY={scrollY}
          HEADER_HEIGHT={HEADER_HEIGHT}
          TAB_BAR_HEIGHT={TAB_BAR_HEIGHT}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          type={TILE_TYPES.ALBUM}
          onGetRef={refHandler}
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
    scrollY.addListener(({ value }: { value: any }) => {
      const curRoute = routes[index].key;
      listOffset.current[curRoute] = value;
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [routes, index]);

  const renderTabBar = (props: any) => {
    const y = scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT - HEADER_VISIBLE],
      outputRange: [HEADER_HEIGHT, HEADER_VISIBLE],
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
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: colors.green }}
          style={{ backgroundColor: colors.whiteSmoke }}
          renderLabel={({ route, focused, color }) => (
            <Text style={[
              textStyles.h3,
              {
                color: focused ? colors.green : colors.lightBlack,
                fontSize: sizes.xs
              }]}>
              {route.title}
            </Text>
          )}
        />
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
      inputRange: [0, HEADER_HEIGHT - HEADER_VISIBLE],
      outputRange: [0, -HEADER_HEIGHT + HEADER_VISIBLE],
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
    alignItems: 'flex-start',
    backgroundColor: colors.whiteSmoke,
    position: 'absolute',
    paddingHorizontal: 20,
  },
})

export default SearchScreen