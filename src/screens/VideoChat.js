import React from 'react';
import { View, Text } from 'react-native';
import RtcEngine from 'react-native-agora';


const VideoChat = () => {

    React.useEffect(() => {
        RtcEngine.create('db7d00a09c9f4fcba0634a73106db405');
    },[]);
    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default VideoChat
