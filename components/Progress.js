import React, { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Text, View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

function pad (n, width, z = 0) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => {
    position = Math.round(position);
    return pad(Math.floor(position / 60), 2) + ':' + pad(position % 60, 2);
};

export default class Progress extends TrackPlayer.ProgressComponent {
    onSeek (time) {
        TrackPlayer.seekTo(time).then(() => {
            console.log('seek to ' + time);
        }).catch((err) => {
            console.log('failed sed', err);
        });
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.text, {color: '#fff'}]}>
                        {minutesAndSeconds(this.state.position)}
                    </Text>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.text, {width: 40, color: '#fff'}]}>
                        {minutesAndSeconds(this.state.duration)}
                    </Text>
                </View>
                <Slider
                    maximumValue={this.state.duration}
                    onSlidingComplete={this.onSeek}
                    value={this.state.position}
                    minimumTrackTintColor={'#fff'}
                    maximumTrackTintColor={'#b6b6b6'}
                    thumbTintColor={'#4573aa'}
                    thumbStyle={styles.thumb}
                    trackStyle={styles.track}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    slider: {
        marginTop: -12,
    },
    container: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
    },
    track: {
        height: 2,
        borderRadius: 1,
    },
    thumb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    text: {
        color: 'rgba(255, 255, 255, 0.72)',
        fontSize: 12,
        textAlign: 'center',
    },
});
