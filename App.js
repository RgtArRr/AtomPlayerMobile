import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Button, Text, TextInput, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GDrive from 'react-native-google-drive-api-wrapper';
import TrackPlayer from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SignIn from './components/SignIn';
import Player from './components/Player';
import PlayLists from './components/PlayLists';
import Songs from './components/Songs';

import { GoogleSignin } from 'react-native-google-signin';

TrackPlayer.setupPlayer().then(() => {
    TrackPlayer.registerPlaybackService(() => require('./service.js'));
    console.log('ready to use player');
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

        // An array of capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
        ],
    });
});

const SettingsStack = createStackNavigator();

function MusicStackScreen () {
    return (
        <SettingsStack.Navigator screenOptions={{
            headerTintColor: '#fff',
            headerStyle: {backgroundColor: '#000'},
            headerTitleStyle: {
                fontSize: 40,
                fontWeight: 'bold',
            },
        }}>
            <SettingsStack.Screen name="PlayLists" component={PlayLists}/>
            <SettingsStack.Screen name="Songs" options={{title: ''}} component={Songs}/>
        </SettingsStack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export default function App () {
    const [isSignedIn, setSignIn] = useState(false);

    async function checkSignIn () {
        try {
            await GoogleSignin.signInSilently();
            const tokens = await GoogleSignin.getTokens();
            GDrive.setAccessToken(tokens.accessToken);
            setSignIn(true);
        }
        catch (error) {
            //nothing to do
        }
    }

    useEffect(() => {
        checkSignIn();
    }, []);

    return (
        isSignedIn ? (
            <NavigationContainer>
                <Tab.Navigator screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        if (route.name === 'Music') {
                            iconName = 'ios-musical-notes';
                        } else if (route.name === 'Download') {
                            iconName = 'ios-download';
                        } else if (route.name === 'Player') {
                            iconName = 'ios-play';
                        }
                        return <Ionicons name={iconName} size={size} color={color}/>;
                    },
                })}
                               tabBarOptions={{
                                   activeTintColor: 'tomato',
                                   inactiveTintColor: '#ECEAEB',
                                   style: {
                                       height: 55,
                                       backgroundColor: '#333333',
                                   },
                               }}>
                    <Tab.Screen name="Music" component={MusicStackScreen}/>
                    <Tab.Screen name="Player" component={Player}/>
                    {/*<Tab.Screen name="Download" component={DownloadYt}/>*/}
                </Tab.Navigator>
            </NavigationContainer>
        ) : (
            <SignIn setSignIn={setSignIn}/>
        )
    );
}
