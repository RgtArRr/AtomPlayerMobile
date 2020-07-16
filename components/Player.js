import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, TouchableOpacity, Text, Image, View, StyleSheet, Dimensions } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import Progress from './Progress';

const size = 50;
const heightImage = 320;
const {width} = Dimensions.get('window');
export default function Player ({navigation}) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [artwork, setArtwork] = useState('');

    const [disableSkipPrev, setdisableSkipPrev] = useState(false);
    const [disableSkipNext, setdisableSkipNext] = useState(false);
    const [disablePlayPause, setdisablePlayPause] = useState(false);
    const [PlayPause, setPlayPlause] = useState(false);

    useEffect(() => {
        let setTrack = (track) => {
            if (track !== null) {
                setTitle(track.title);
                setArtist(track.artist);
                setArtwork('https://i.ytimg.com/vi/' + track.id + '/hqdefault.jpg');
            } else {
                setTitle('');
                setArtist('');
                setArtwork('');
            }
        };

        let setState = (state) => {
            if(typeof state === "object"){
                state = state.state;
            }
            if (state === TrackPlayer.STATE_PAUSED ||
                state === TrackPlayer.STATE_STOPPED) {
                setPlayPlause(false);
            }
            if (state === TrackPlayer.STATE_PLAYING) {
                setPlayPlause(true);
            }
        };

        TrackPlayer.getState().then(setState);
        TrackPlayer.getCurrentTrack().then((id) => {return TrackPlayer.getTrack(id);}).then(setTrack);
        let onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
            TrackPlayer.getTrack(data.nextTrack).then(setTrack);
        });

        let onStateChange = TrackPlayer.addEventListener('playback-state', async (state) => {
            setState(state);
        });

        return () => {
            console.log('remove listener');
            setdisableSkipNext(false);
            onTrackChange.remove();
            onStateChange.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.artWorkcontainer}>
                {artwork !== '' ?
                    <Image resizeMode="contain" style={[styles.image]}
                           source={{uri: artwork}}
                           onError={(err) => {console.log('image error', err);}}/> : <View style={styles.image}/>}

            </View>
            <View style={styles.Detailscontainer}>
                <View style={styles.detailsWrapper}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.artist}>{artist}</Text>
                </View>
            </View>
            <Progress/>
            <View style={styles.Controlscontainer}>
                <TouchableOpacity activeOpacity={0.0} onPress={() => {
                    console.log('shuffle');
                }}>
                    <Ionicons name="ios-shuffle" size={size} color={'#c7c7c7'}/>
                </TouchableOpacity>
                <View style={{width: 40}}/>
                <TouchableOpacity disabled={disableSkipPrev} onPress={() => {
                    TrackPlayer.skipToPrevious().then(() => {
                        setdisableSkipPrev(false);
                    }).catch((err) => {
                        setdisableSkipPrev(false);
                        console.log('skip prev', err);
                    });
                }}>
                    <Ionicons name="ios-skip-backward" size={size} color={'#c7c7c7'}/>
                </TouchableOpacity>
                <View style={{width: 20}}/>
                {!PlayPause ?
                    <TouchableOpacity disabled={disablePlayPause} onPress={() => {
                        setdisablePlayPause(true);
                        TrackPlayer.play().then(() => {
                            setdisablePlayPause(false);
                        }).catch((err) => {
                            console.log('play plase', err);
                            setdisablePlayPause(false);
                        });
                    }}>
                        <View style={styles.playButton}>
                            <Ionicons name="ios-play" size={size} color={'#c7c7c7'}/>
                        </View>
                    </TouchableOpacity> :
                    <TouchableOpacity disabled={disablePlayPause} onPress={() => {
                        setdisablePlayPause(true);
                        TrackPlayer.pause().then(() => {
                            setdisablePlayPause(false);
                        }).catch((err) => {
                            console.log('play plase', err);
                            setdisablePlayPause(false);
                        });
                    }}>
                        <View style={styles.playButton}>
                            <Ionicons name="ios-pause" size={size} color={'#c7c7c7'}/>
                        </View>
                    </TouchableOpacity>
                }
                <View style={{width: 20}}/>
                <TouchableOpacity disabled={disableSkipNext} onPress={() => {
                    setdisableSkipNext(true);
                    TrackPlayer.skipToNext().then(() => {
                        setdisableSkipNext(false);
                    }).catch((err) => {
                        setdisableSkipNext(false);
                        console.log('errr', err);
                    });
                }}>
                    <Ionicons name="ios-skip-forward" size={size} color={'#c7c7c7'}/>
                </TouchableOpacity>
                <View style={{width: 40}}/>
                <TouchableOpacity activeOpacity={0.0} onPress={() => {console.log('repeat');}}>
                    <Ionicons name="ios-repeat" size={size} color={'#c7c7c7'}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    artWorkcontainer: {
        alignItems: 'center',
        marginTop: 30,
        paddingLeft: 24,
        paddingRight: 24,
    },
    image: {
        width: width - 10,
        height: heightImage,
    },

    Detailscontainer: {
        paddingTop: 24,
        flexDirection: 'row',
        paddingLeft: 20,
        alignItems: 'center',
        paddingRight: 20,
    },
    detailsWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    artist: {
        color: '#fff',
        fontSize: 14,
        marginTop: 4,
    },

    Controlscontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    playButton: {
        height: 72,
        width: 72,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 72 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryControl: {
        height: 18,
        width: 18,
    },
    off: {
        opacity: 0.30,
    },
});
