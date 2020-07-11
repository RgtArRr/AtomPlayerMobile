import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, Text, TextInput, TouchableOpacity, View, TouchableHighlight } from 'react-native';
import { ListItem } from 'react-native-elements';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'Rock&roll',
        songs: [],

    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Pop',
        songs: [],
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Para cuando acabe el peronismo',
        songs: [],
    },
];

export default function PlayLists ({navigation}) {

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
            <FlatList ItemSeparatorComponent={renderSeparator} ListHeaderComponent={FlatListHeader}
                      data={DATA}
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
                              subtitle={'1hr duration'}
                              badge={{
                                  value: 20,
                                  textStyle: {
                                      color: 'black',
                                      backgroundColor: 'white',
                                      fontSize: 16,
                                      borderRadius: 15,
                                      paddingTop: 5,
                                      paddingBottom: 5,
                                      paddingLeft: 8,
                                      paddingRight: 8,
                                  },
                                  containerStyle: {},
                              }}
                              bottomDivider
                              chevron={{color: 'white', type: 'ionicon', name: 'ios-arrow-forward'}}
                          />
                      )}
                      keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}
