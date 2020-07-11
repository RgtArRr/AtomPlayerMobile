import React, { useState, useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import MyPlayerBar from './Progress';

const RNFS = require('react-native-fs');

export default function Player ({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Home screen</Text>
            <Button
                title="Reproducir"
                onPress={() => {
                    TrackPlayer.add({
                        id: 'test',
                        url: RNFS.DocumentDirectoryPath + '/musica.mp3',
                        title: 'Mi musica',
                        artist: 'kenneth',
                        album: 'mi album',
                        genre: 'genero',
                        artwork: 'https://pbs.twimg.com/profile_images/738399143551438848/pxWK4OqW_bigger.jpg',
                    });
                    TrackPlayer.play();
                }}
            />
            <MyPlayerBar/>
        </View>
    );
}
