import React, { useState, useEffect } from 'react';
import { Button, FlatList, SafeAreaView, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { ListItem } from 'react-native-elements';

const musicDATA = [
    {
        id: 'bd7acbe2-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Song lorem ipsum dolor sit 1',
    },
    {
        id: '3ac68af3-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Song lorem ipsum 2',
        songs: [],
    },
    {
        id: '58694a04-3da1-471f-bd96-145571e29d72',
        title: 'Song lorem ipsum dolor 3',
    },
];
export default function Songs ({route, navigation}) {
    const {playlistId} = route.params;
    const {name} = route.params;

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
                <Text style={{color: '#fff', fontSize: 30, marginLeft: 20}}>{name}</Text>
            </View>
            <FlatList ItemSeparatorComponent={renderSeparator} ListHeaderComponent={FlatListHeader}
                      data={musicDATA}
                      renderItem={({item}) => (
                          <ListItem
                              onPress={(e) => {
                                  console.log('press');
                                  navigation.navigate('Songs', {
                                      playlistId: item.id,
                                      name: item.title,
                                  });
                              }}
                              component={TouchableHighlight}
                              containerStyle={{backgroundColor: '#000'}}
                              titleStyle={{color: 'rgba(255,255,255,0.87)', fontSize: 18, fontWeight: 'bold'}}
                              subtitleStyle={{color: 'rgba(255,255,255,0.6)', fontSize: 12}}
                              id={item.id}
                              title={item.title}
                              subtitle={'Artista'}
                              badge={{
                                  value: '03:22',
                                  textStyle: {
                                      color: '#121212',
                                      backgroundColor: '#fff',
                                      fontSize: 16,
                                      paddingLeft: 3,
                                      paddingRight: 3,
                                      borderRadius: 5
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
