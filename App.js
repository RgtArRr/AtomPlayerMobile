import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TrackPlayer from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SignIn from './components/SignIn';
import Player from './components/Player';
import PlayLists from './components/PlayLists';
import Songs from './components/Songs';

import { GoogleSignin } from 'react-native-google-signin';

const Sync = require('./components/Sync');

TrackPlayer.setupPlayer().then(() => {
    console.log('ready to use player');
    TrackPlayer.registerPlaybackService(() => require('./service.js'));
    TrackPlayer.updateOptions({
        ratingType: TrackPlayer.RATING_5_STARS,

        stopWithApp: false,

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

const SongStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const instanceSync = new Sync();
instanceSync.init();

function MusicStackScreen () {
    return (
        <SongStack.Navigator screenOptions={{
            headerTintColor: '#fff',
            headerStyle: styles.tabBarHeader,
            headerTitleStyle: styles.tabBarHeaderTitle,
        }}>
            <SongStack.Screen name="PlayLists" component={PlayLists}/>
            <SongStack.Screen name="Songs" options={{title: ''}} component={Songs}/>
        </SongStack.Navigator>
    );
}

export default function App () {
    const [isSignedIn, setSignIn] = useState(false);

    async function checkSignIn () {
        let isSignedIn = await GoogleSignin.isSignedIn();
        setSignIn(isSignedIn);
        GoogleSignin.signInSilently().then((res) => {
            GoogleSignin.getTokens().then((tokens) => {
                // instanceSync.setup(tokens.accessToken);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    function icons ({route}) {
        return {
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                if (route.name === 'Music') {
                    iconName = 'ios-musical-notes';
                } else if (route.name === 'Player') {
                    iconName = 'ios-play';
                }
                return <Ionicons name={iconName} size={size} color={color}/>;
            },
        };
    }

    useEffect(() => {
        console.log('App startup');
        checkSignIn();
    }, []);

    return (
        isSignedIn ? (
            <NavigationContainer>
                <Tab.Navigator screenOptions={icons} tabBarOptions={{style: styles.tabBarFooter}}>
                    <Tab.Screen name="Music" component={MusicStackScreen}/>
                    <Tab.Screen name="Player" component={Player}/>
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
