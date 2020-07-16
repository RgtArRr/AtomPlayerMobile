import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './components/RootNavigation';

import TrackPlayer from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SignIn from './components/SignIn';
import Player from './components/Player';
import PlayLists from './components/PlayLists';
import Songs from './components/Songs';

import { GoogleSignin } from 'react-native-google-signin';

const Sync = require('./components/Sync');

const MusicStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const instanceSync = new Sync();
instanceSync.init();

function MusicStackScreen () {

    return (
        <MusicStack.Navigator screenOptions={{
            headerTintColor: '#fff',
            headerStyle: styles.tabBarHeader,
            headerTitleStyle: styles.tabBarHeaderTitle,
        }}>
            <MusicStack.Screen name="PlayLists" component={PlayLists} initialParams={{data: []}}/>
            <MusicStack.Screen name="Songs" options={{title: ''}} component={Songs}/>
        </MusicStack.Navigator>
    );
}

export default function App () {
    const [isSignedIn, setSignIn] = useState(true);
    const [queue, setQueue] = useState(0);

    function checkSignIn () {
        GoogleSignin.isSignedIn().then((isSignedIn) => {
            if (isSignedIn) {
                GoogleSignin.signInSilently().then((res) => {
                    GoogleSignin.getTokens().then((tokens) => {
                        instanceSync.setup(tokens.accessToken, setQueue);
                    });
                }).catch((err) => {
                    console.log(err);
                });
            }
            setSignIn(isSignedIn);
        });

    }

    function setupPlayer () {
        TrackPlayer.setupPlayer().then(() => {
            console.log('ready to use player');
            TrackPlayer.updateOptions({
                stopWithApp: true,
                capabilities: [
                    TrackPlayer.CAPABILITY_PLAY,
                    TrackPlayer.CAPABILITY_PAUSE,
                    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                    TrackPlayer.CAPABILITY_STOP,
                ],

                compactCapabilities: [
                    TrackPlayer.CAPABILITY_PLAY,
                    TrackPlayer.CAPABILITY_PAUSE,
                ],
            });
        });
    }

    useEffect(() => {
        console.log('App startup');
        setupPlayer();
        checkSignIn();
        return () => {
            console.log('test');
            TrackPlayer.reset();
        };
    }, []);

    return (
        isSignedIn ? (
            <NavigationContainer ref={navigationRef}>
                <Tab.Navigator tabBarOptions={{style: styles.tabBarFooter}}>
                    <Tab.Screen options={{
                        tabBarBadge: 'probandooooo',
                        tabBarIcon: ({color, size}) => (
                            <View style={{width: 24, height: 24, marginTop: 5, marginBottom: 5}}>
                                <Ionicons name={'ios-musical-notes'} size={size} color={color}/>
                                {queue > 0 ?
                                    <View style={{
                                        pistion: 'absolute',
                                        right: -18,
                                        top: -12,
                                        backgroundColor: '#74bbdc',
                                        borderRadius: 8,
                                        width: 18,
                                        height: 18,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{
                                            color: 'black',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                        }}>{queue}</Text>
                                    </View> : null}
                            </View>
                        ),
                    }} name="Music" component={MusicStackScreen}/>
                    <Tab.Screen options={{
                        tabBarIcon: ({color, size}) => (
                            <Ionicons name={'ios-play'} size={size} color={color}/>
                        ),
                    }} name="Player" component={Player}/>
                </Tab.Navigator>
            </NavigationContainer>
        ) : (<SignIn setSignIn={setSignIn}/>)
    );
}

const styles = StyleSheet.create({
    tabBarHeader: {
        backgroundColor: '#000',
    },
    tabBarHeaderTitle: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    tabBarFooter: {
        height: 55,
        backgroundColor: '#333333',
    },
});
