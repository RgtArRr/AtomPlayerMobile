import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, Text, TouchableHighlight, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import TrackPlayer from 'react-native-track-player';

const RNFS = require('react-native-fs');

export default function Songs ({route, navigation}) {
    const {name} = route.params;
    const {songs} = route.params;

    function renderSeparator () {
        return (
            <View style={{
                height: 0.3,
                width: '100%',
                backgroundColor: '#CED0CE',
            }}/>
        );
    }

    function FlatListHeader () {
        return (
            <View elevation={1}
                  style={{
                      marginTop: 20,
                      height: 1,
                      backgroundColor: '#CED0CE',
                  }}>
            </View>
        );
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
            <View style={{alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 32, marginLeft: 20}}>{name}</Text>
            </View>
            <FlatList ItemSeparatorComponent={renderSeparator} ListHeaderComponent={FlatListHeader}
                      data={songs}
                      renderItem={({item}) => (
                          <ListItem onPress={() => {
                              let queue = songs.slice(songs.findIndex((s) => {return s.ytid === item.ytid;}),
                                  songs.length).map((s) => {
                                  return {
                                      id: s.ytid,
                                      url: RNFS.DocumentDirectoryPath + '/' + s.filename,
                                      title: s.title,
                                      artist: s.artist,
                                      artwork: 'https://i.ytimg.com/vi/' + s.ytid + '/hqdefault.jpg',
                                  };
                              });
                              TrackPlayer.reset().then(() => {
                                  TrackPlayer.add(queue).then(() => {
                                      console.log('add song');
                                      TrackPlayer.play().then(() => {
                                          console.log('play song');
                                      }).catch((err) => {
                                          console.log('play song', err);
                                      });
                                  }).catch((err) => {
                                      console.log('add song err', err);
                                  });
                              });
                          }}
                                    component={TouchableHighlight}
                                    containerStyle={{backgroundColor: '#000'}}
                                    titleStyle={{color: 'rgba(255,255,255,0.87)', fontSize: 18, fontWeight: 'bold'}}
                                    subtitleStyle={{color: 'rgba(255,255,255,0.6)', fontSize: 12}}
                                    id={item.id}
                                    title={item.title.substr(0, 38)}
                                    subtitle={item.artist}
                                    badge={{
                                        value: 'Play',
                                        textStyle: {
                                            color: '#121212',
                                            backgroundColor: '#fff',
                                            fontSize: 16,
                                            paddingLeft: 3,
                                            paddingRight: 3,
                                            borderRadius: 5,
                                        },
                                        containerStyle: {},
                                    }}
                                    bottomDivider
                          />
                      )}
                      keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}
