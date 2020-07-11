import React, { useState, useEffect } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

const CryptoJS = require('crypto-js');
const RNFS = require('react-native-fs');

export default function DownloadYt ({navigation}) {
    const [url, setUrl] = useState('');

    function download () {
        let currentTime = Math.round(new Date().getTime() / 1000);
        const raw_signature = CryptoJS.HmacSHA1('WUKaudOpx|' + currentTime, 'iGV7PetSJdgREnuXUSvhR59RHSzFv0C1');
        const signature = raw_signature.toString(CryptoJS.enc.Hex);
        let query = 'apikey=WUKaudOpx&t=' + currentTime + '&h=' + signature + '&v=' + url;
        fetch('https://api.recordmp3.co/fetch?' + query).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            if (json && json.timeout) {
                setTimeout(download, json.timeout * 1000);
            } else {
                RNFS.downloadFile({
                    fromUrl: 'https://' + json.url, toFile: RNFS.DocumentDirectoryPath + '/musica.mp3',
                    begin: (res) => {
                        console.log(res);
                    },
                    progress: (res) => {
                        console.log(res);
                    },
                });
            }

        });
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Ingrese URL Youtube</Text>
            <TextInput style={{height: 40, width: 120, borderColor: 'gray', borderWidth: 1}}
                       onChangeText={text => setUrl(text)}
                       value={url}/>
            <Button
                title="Descargar"
                onPress={() => download()}
            />
        </View>
    );
}
