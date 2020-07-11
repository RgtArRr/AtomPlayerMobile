import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
    TrackPlayer.addEventListener('remote-play', () => {
        console.log('play');
        TrackPlayer.play();
    });
    TrackPlayer.addEventListener('remote-pause', () => {
        console.log('pause');
        TrackPlayer.pause();
    });
    TrackPlayer.addEventListener('remote-stop', () => {
        console.log('destroy');
        TrackPlayer.destroy();
    });
};
