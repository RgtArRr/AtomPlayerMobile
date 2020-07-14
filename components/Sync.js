import GDrive from 'react-native-google-drive-api-wrapper';

const RNFS = require('react-native-fs');

module.exports = function () {
    const self = this;
    this.db;

    this.init = function () {
        self.db = RNFS.DocumentDirectoryPath + '/atomplayer.db';
        Array.prototype.contains = function (needle) {
            for (let i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    return true;
                }
            }
            return false;
        };

        Array.prototype.diff = function (compare) {
            return this.filter(function (elem) {return !compare.contains(elem);});
        };
    };

    this.getDB = function (callbackResponse) {
        RNFS.readFile(self.db).then((res) => {
            callbackResponse(JSON.parse(res));
        }).catch((err) => {
            console.log('get', err);
            callbackResponse([]);
        });
    };

    this.saveDB = function (content, callbackSuccess) {
        RNFS.writeFile(self.db, JSON.stringify(content)).then(() => {
            callbackSuccess();
        }).catch((err) => {
            console.log('savedb', err);
        });
    };

    //dev purpose
    this.___delete = function () {
        RNFS.unlink(self.db).then(() => {
            console.log('delete succesfull');
        });
    };

    this.setup = function (accessToken) {
        GDrive.setAccessToken(accessToken);
        GDrive.init();
        self.getDB((localdb) => {
            GDrive.files.list({q: '\'root\' in parents and trashed = false'}).then((res) => {
                return res.json();
            }).then((data) => {
                if (data.files.length > 0) {
                    let fileId = data.files[0].id;
                    let parameters = GDrive._stringifyQueryParams({alt: 'media'});
                    fetch(`${GDrive._urlFiles}/${fileId}${parameters}`, {
                        method: 'GET',
                        headers: {'Authorization': `Bearer ${GDrive.accessToken}`},
                    }).then((res) => {
                        return res.json();
                    }).then((remotedb) => {
                        processSync(remotedb, localdb);
                    }).catch((err) => {
                        console.log('download remote db', err);
                    });
                }
            }).catch((err) => {
                console.log('gdrive list', err);
            });
        });
    };

    this.processSync = function (remotedb, localdb) {
        let playlistToAdd = remotedb.map((r) => {return r.id;}).diff(localdb.map((r) => {return r.id;}));
        let playlistToRemove = localdb.map((r) => {return r.id;}).diff(remotedb.map((r) => {return r.id;}));

        playlistToAdd.forEach((ele) => {
            let temp = remotedb.find((e) => {return e.id === ele;});
            localdb.push({id: temp.id, name: temp.name, songs: []});
            console.log('add playlist ' + ele);
        });

        playlistToRemove.forEach((ele) => {
            let i = localdb.findIndex((r) => {return r.id === ele;});
            if (i !== -1) {
                localdb = localdb.slice(i, 1);
                console.log('remove playlist ' + ele);
            }
        });

        let queue = [];
        remotedb.forEach((remotPlayList) => {
            let localPlayList = localdb.find((e) => {return e.id === remotPlayList.id;});
            let songstoAdd = remotPlayList.songs.diff(localPlayList.songs.map((r) => {return r.ytid;}));
            let songstoRemove = localPlayList.songs.map((r) => {return r.ytid;}).diff(remotPlayList.songs);

            songstoRemove.forEach((ytid) => {
                let i = localPlayList.songs.findIndex((r) => {return r.ytid === ytid;});
                if (i !== -1) {
                    localPlayList.songs = localPlayList.songs.slice(i, 1);
                    console.log('remove song ' + ytid);
                }
            });

            songstoAdd.slice(0, 1).forEach((ytid) => {
                queue.push({ytid: ytid, playlistid: remotPlayList.id});
                console.log('add song to queue ' + ytid);
            });
        });
        processQueue(queue, localdb, () => {
            console.log('write on file');
            db.saveDB(localdb, () => {
                console.log('success sync');
                self.checkFiles(localdb);
            });
        });
    };

    this.processQueue = function (queue, localdb, callbackQueueEmpty) {
        let song = queue.pop();
        if (!song) {
            callbackQueueEmpty();
        } else {
            let filename = getId(15) + '.mp3';
            download(song.ytid, filename, localdb, (metadata) => {
                let i = localdb.findIndex((r) => {return r.id === song.playlistid;});
                if (i !== -1) {
                    localdb[i].songs.push({
                        ytid: metadata.ytid,
                        title: metadata.title,
                        artist: metadata.artist,
                        filename: metadata.filename,
                        thumbnail: metadata.thumbnail,
                    });
                    console.log('save song ' + song.ytid);
                }
                processQueue(queue, localdb, callbackQueueEmpty);
            });
        }
    };

    this.download = function (ytid, filename, localdb, callbackFinish) {
        //check if song exist
        let songs = localdb.map((r) => {return r.songs;}).flat(1);
        let i = songs.findIndex((res) => {return res.ytid === ytid;});
        if (i !== -1) {
            callbackFinish(songs[i]);
            return;
        }
        //attemp to download
        let currentTime = Math.round(new Date().getTime() / 1000);
        const raw_signature = CryptoJS.HmacSHA1('WUKaudOpx|' + currentTime, 'iGV7PetSJdgREnuXUSvhR59RHSzFv0C1');
        const signature = raw_signature.toString(CryptoJS.enc.Hex);
        let query = 'apikey=WUKaudOpx&t=' + currentTime + '&h=' + signature + '&v=' + ytid;
        fetch('https://api.recordmp3.co/fetch?' + query).then((response) => {
            return response.json();
        }).then((json) => {
            if (json && json.timeout) {
                setTimeout(() => {download(ytid, filename, localdb, callbackFinish);}, json.timeout * 1000);
            } else {
                let task = RNFS.downloadFile({
                    fromUrl: 'https://' + json.url, toFile: RNFS.DocumentDirectoryPath + '/' + filename,
                    begin: () => {
                        console.log('init download ' + ytid + ' ' + filename);
                    },
                });
                task.promise.then(() => {
                    json.filename = filename;
                    json.ytid = ytid;
                    callbackFinish(json);
                });
            }
        });
    };

    this.checkFiles = function (localdb) {
        RNFS.readDir(RNFS.DocumentDirectoryPath).then((files) => {
            let songs = localdb.map((r) => {return r.songs;}).flat(1);
            files.forEach((file) => {
                if (file.isFile) {
                    if (file.name.split('.')[1] === 'mp3') {
                        let i = songs.findIndex((res) => {return res.filename === file.name;});
                        if (i === -1) {
                            RNFS.unlink(file.path).then(() => {console.log('delete file ' + file.name);});
                        }
                    }
                }
            });
        });
    };

    this.getId = function (length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };
};
