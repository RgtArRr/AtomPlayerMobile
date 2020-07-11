import React, { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Text, View } from 'react-native';

export default class MyPlayerBar extends TrackPlayer.ProgressComponent {

    render () {
        return (
            <View>
                <Text>{(this.state.position)} segundos de {(this.state.duration)}</Text>
            </View>
        );
    }

}
