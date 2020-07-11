import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    FlatList,
    View,
    TouchableHighlight,
} from 'react-native';
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
            <View style={styles.separator}/>
        );
    }

    function FlatListHeader () {
        return (
            <View style={styles.headerList}/>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList ItemSeparatorComponent={renderSeparator} ListHeaderComponent={FlatListHeader}
                      data={DATA}
                      renderItem={({item}) => (
                          <ListItem
                              component={TouchableHighlight}
                              onPress={(e) => {
                                  navigation.navigate('Songs', {
                                      playlistId: item.id,
                                      name: item.title,
                                  });
                              }}

                              id={item.id}
                              subtitle={'1hr duration'}
                              title={item.title}
                              chevron={{color: 'white', type: 'ionicon', name: 'ios-arrow-forward'}}

                              badge={{value: 20, textStyle: styles.badge}}
                              containerStyle={styles.list}
                              titleStyle={styles.listTitle}
                              subtitleStyle={styles.listSubtitle}
                              bottomDivider
                          />
                      )}
                      keyExtractor={item => item.id}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        flex: 1,
    },
    list: {
        backgroundColor: '#000',
    },
    listTitle: {
        color: 'rgba(255,255,255,0.87)', fontSize: 18, fontWeight: 'bold',
    },
    listSubtitle: {
        color: 'rgba(255,255,255,0.6)', fontSize: 12,
    },
    badge: {
        color: 'black',
        backgroundColor: 'white',
        fontSize: 16,
        borderRadius: 15,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
    },
    separatorList: {
        height: 0.3,
        width: '100%',
        backgroundColor: '#CED0CE',
    },
    headerList: {
        marginTop: 20,
        height: 1,
        backgroundColor: '#CED0CE',
    },
});
