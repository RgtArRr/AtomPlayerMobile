import React, { useState, useEffect } from 'react';

import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import { Alert, Text, View } from 'react-native';

GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export default function SignIn (props) {
    async function _signIn () {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();
            GDrive.setAccessToken(tokens.accessToken);
            props.setSignIn(true);
        }
        catch (error) {
            switch (error.code) {
                case statusCodes.SIGN_IN_CANCELLED:
                    // sign in was cancelled
                    Alert.alert('cancelled');
                    break;
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    Alert.alert('in progress');
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // android only
                    Alert.alert('play services not available or outdated');
                    break;
                default:
                    Alert.alert('Something went wrong', error.toString());
                    this.setState({
                        error,
                    });
            }
        }
    };

    return (
        <View>
            <Text>Primero autentificate</Text>
            <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={_signIn}
                disabled={false}/>
        </View>
    );
}
