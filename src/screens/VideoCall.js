import React from 'react';
import { View, Text,TouchableOpacity, LogBox } from 'react-native';
import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import requestCameraAndAudioPermission from '../permissions/permission';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import axios from 'axios';
import { API } from '../../api.config';
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);
const dark = '#10152F';
const VideoCall = ({currentUser, route, navigation}) => {
    const p = route.params.id;
    
    const [mic, setMic] = React.useState(false);
    const [peerIds, setPeerIds] = React.useState([]);
    const [engine, setEngine] = React.useState(null);
    const [joinSucceed,setJoinSucceed] = React.useState(false);
    const [counter, setCounter] = React.useState(0);
    // console.log("Engine",route.params.engine);
    const endCall = () => {
        // route.params.engine?.leaveChannel();
        engine?.leaveChannel()
        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+p);
        // const paid = push(paidRef);
        update(paidRef,{
            status:'pending',//pending, waiting, joined
            person2:"",
            image : "",
            maxtime: 0,
            name : "",
        }).then((res) => {
        }).catch((err) => {
            console.log("ERROR ", err);
        })
        
        }
    // if(mic){
    //     engine?.enableLocalAudio();
    // }else{
    //     engine?.disableAudio();
    // }

    

    React.useEffect(() => {
        // variable used by cleanup function
        let isSubscribed = true;
        // create the function
        const createEngine = async () => {
            // console.log("inside engine");
            try {
                if (Platform.OS === 'android') {
                    // Request required permissions from Android
                    await requestCameraAndAudioPermission();
                    // setShow(true);
                }
                console.log("inside try");
                const rtcEngine = await RtcEngine.create("bbd961c37a6945318efd2ed41ae214c1");
                await rtcEngine.enableVideo();
            

                // need to prevent calls to setEngine after the component has unmounted
                if (isSubscribed) {
                    setEngine(rtcEngine);
                }
            } catch (e) {
                console.log(e);
            }
        }

        // call the function
        if (!engine) createEngine();

        engine?.addListener('Warning', (warn) => {
            console.log('Warning', warn)
        })

        engine?.addListener('Error', (err) => {
            console.log('Error', err)
        })

        engine?.addListener('UserJoined', (uid, elapsed) => {
            console.log('UserJoined', uid, elapsed)
            // If new user
            // setWaiting(false);
            // let tim = setTimeout(() => {
            //     endCall(channel);
            //     joinRandomChannel();
            // },10000)
            // setTm(tim);
            if (peerIds.indexOf(uid) === -1) {
                // Add peer ID to state array
                setPeerIds((prevState) => [...prevState, uid])
            }
        })

        engine?.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            // Remove peer ID from state array
            // endCall(channel);
            // joinRandomChannel();
            setPeerIds(peerIds.filter(id => id !== uid))
        })

        // If Local user joins RTC channel
        engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess', channel, uid, elapsed)
            if (isSubscribed) {
                // Set state variable to true
                console.log("JOINES SUCCESS");
                setJoinSucceed(true)
            }
        })
        engine?.joinChannel(null, p, null, +(currentUser.user_id));
        // console.log(currentUser);
        return () => {
            console.log(engine)
            isSubscribed = false;
            // timeOut.cancel();
            engine?.leaveChannel();
            // endCall();
            // leaveChannel(channel);
            console.log("*********************************************");
            engine?.removeAllListeners();
            engine?.destroy();
        }

    },
        // will run once on component mount or if engine changes
        [engine]
    );
    

    React.useEffect(() => {
        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+p);
        return onValue(paidRef, (snapshot) => {
            if(snapshot?.val()?.status!=='incall'){
                // console.log("HERE ********", snapshot?.val()?.status);
                navigation.goBack();
            }
        })
    },[]);

    React.useEffect(() => {
        const db = getDatabase();
        let max = 6000;
        const paidRef = ref(db, 'paidcam/'+p);
        onValue(paidRef, (snapshot) => {
            max = snapshot?.val()?.maxtime || 6000;
        }, {onlyOnce:true});
        let count =0;
        let timer = setInterval(() => {
            count+=100;
            if(count>max){
                endCall();
            }
        },100);
        const c = setInterval(() => {
            setCounter((prev) => prev+1);
        },1000);
        return () => {
            clearInterval(timer);
            clearInterval(c);
            console.log(Math.ceil(count/60000), "min elapsed");
            // axios({
            //     method:'POST',
            //     url:`${API}/`,

            // })
        }
        
    },[])
    return (
        <View style={{flex:1, backgroundColor:dark}}>
            {peerIds.length>0 ? 
            <View style={{flex:0.8}}>
            <RtcRemoteView.SurfaceView
            style={{ flex:0.8, position:'relative' }}
            uid={peerIds[0]}
            channelId={p}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true} />
            </View>
            :
            <Text style={{color:'white', textAlign:'center', fontSize:25, fontWeight:'200'}}>Waiting for Partner...</Text>
            }
            {
                joinSucceed && 
                <View style={{ position:'absolute', bottom:10, flex:0.1, right:5,borderRadius:10,overflow:'hidden' ,borderColor:'#fff', borderWidth:2}}>
                <RtcLocalView.SurfaceView
                style={{ height:150, width:100 }}
                channelId={p}
                renderMode={VideoRenderMode.Hidden} />
                </View>
            }
            <View style={{position:'absolute',bottom:11,flexDirection:'row', justifyContent:'center'}}>
            {/* <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity 
                onPress={() => {
                    if(mic){
                        engine?.enableLocalAudio();
                    }else{
                        engine?.disableAudio();
                    }
                setMic((prev) => !prev);
                }}
                style={{
                backgroundColor: mic ? '#3498DB': 'grey',
                bottom:10,
                height: 60,
                width: 60,
                zIndex:20,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#fff',
                borderWidth: 2,
                }}>
                {
                    mic ?
                    <Icon name="mic" color="#fff" size={35} />
                    :
                    <Icon name="mic-off" color="#fff" size={35} />
                }
                </TouchableOpacity>
            </View> */}
            <View style={{flex:1, alignItems:'center'}}>
            <View >
                <Text style={{color:'white', fontWeight:'600', marginTop:-60}}>{parseInt((counter/(60)))>9 ? parseInt((counter/(60))) : `0`+parseInt((counter/(60)))}: {parseInt((counter%(60)))>9 ? parseInt((counter%(60))) : `0`+parseInt((counter%(60)))}</Text>
            </View>
            <TouchableOpacity 
                onPress={endCall}
                style={{
                backgroundColor: 'red',
                bottom:10,
                height: 60,
                width: 60,
                borderRadius: 100,
                alignItems: 'center',
                zIndex:20,
                justifyContent: 'center',
                borderColor: '#fff',
                borderWidth: 2,
                }}>
                <Icon name="call-end" color="#fff" size={35} />
                </TouchableOpacity>
            </View>
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(VideoCall);
