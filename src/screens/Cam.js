import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity,ScrollView, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { API } from '../../api.config';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Footer from '../components/Footer';
import Ico from 'react-native-vector-icons/Entypo';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import requestCameraAndAudioPermission from '../permissions/permission';
import { get } from 'react-native/Libraries/Utilities/PixelRatio';
// import  RtmEngine  from 'agora-react-native-rtm';
// const RtmEngine  = require('agora-react-native-rtm')

const dark= '#10152F';
const Cam = ({navigation, currentUser}) => {
    const appId = "bbd961c37a6945318efd2ed41ae214c1";
    // const [token, setToken] = React.useState(null) 
    const [engine, setEngine] = React.useState(undefined);
    const [rtmEngine, setRtmEngine] = React.useState(undefined);
    const [show, setShow] = React.useState(false);
    const [peerIds, setPeerIds] = React.useState([]);
    const [joinSucceed, setJoinSucceed] = React.useState(false);
    const [channel, setChannel] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [waiting, setWaiting] = React.useState(false);
    
    // const [inCall , setInCall] = React.useState(false);
    // const [inLobby, setInLobby] = React.useState(false);
    // const [seniors, setSeniors] = React.useState([]);
    // const [rooms, setRooms] = React.useState({});
    
    const createChannelWaiting = () => {
        const db = getDatabase();
        const onCamRef = ref(db, 'oncam');
        const cams = push(onCamRef);
        set(cams,{
            channelId:Date.now(),
            person1:currentUser.user_id,
            person2:"",
        }).then((res) => {
            setChannel(cams.key);
            startCall(cams.key,1);
            setWaiting(true);
        }).catch((err) => {
            console.log("ERROR ", err);
        })
    };

    const joinRandomChannel = () => {
        const db = getDatabase();
        const onCamRef = query(ref(db, 'oncam'),orderByChild("person2"), equalTo(""));
        onValue(onCamRef,(snapshot) =>{
            
            if(snapshot.exists()){
                const channels = [];
                snapshot.forEach((childSnapshot) => {
                    // console.log(childSnapshot.val());
                    channels.push({
                        ...childSnapshot.val(),
                        id:childSnapshot.key
                    })
                    setChannel(childSnapshot.key);
                })
                // console.log("channels[0]",channels[0].id);
                const cRef = ref(db,'oncam/'+channels[0].id);
                update(cRef,{
                    person2:currentUser.user_id
                }).then(() =>{
                    startCall(channels[0].id);
                }).catch((err) =>{
                    console.log(err);
                })
                // setChannel(channels[0].id)
                console.log(channels[0].id);
            }else{
                createChannelWaiting();
            }
        },{
            onlyOnce:true
        })
    }

    const leaveChannel = (channel) => {
        const db = getDatabase();
        const rRef = ref(db, 'oncam/'+channel);
        remove(rRef);
        console.log("camref",rRef.key);
    }

    const [tm , setTm] = React.useState(undefined);
    // console.log("CHANNEL",channel);
    const startCall = React.useCallback(async (channelName, flag) => {
        setLoading(true);
        // Join Channel using null token and channel name
        await engine?.joinChannel(null, channelName, null, +(currentUser.user_id))
        console.log('startCall', channelName);
        if(!flag){
            tim=setTimeout(() => {
                endCall(channelName);
                joinRandomChannel();
            },10000);
            setTm(tim);
        }
    });


    const endCall = React.useCallback(async (channel, flag) => {
        // console.log(peerIds);
        setPeerIds([]);
        if(flag) setLoading(false);
        clearTimeout(tm);
        setJoinSucceed(false);
        leaveChannel(channel);
        await engine?.leaveChannel()
    });
    

    React.useEffect(() => {
        // variable used by cleanup function
        let isSubscribed = true;

        // create the function
        const createEngine = async () => {
            console.log("inside engine");
            try {
                if (Platform.OS === 'android') {
                    // Request required permissions from Android
                    await requestCameraAndAudioPermission();
                    setShow(true);
                }
                console.log("inside try");
                const rtcEngine = await RtcEngine.create(appId);
                await rtcEngine.enableVideo();
                // console.log(RtmEngine);
                

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
            setWaiting(false);
            let tim = setTimeout(() => {
                endCall(channel);
                joinRandomChannel();
            },10000)
            setTm(tim);
            if (peerIds.indexOf(uid) === -1) {
                // Add peer ID to state array
                setPeerIds([...peerIds, uid])
            }
        })

        engine?.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            // Remove peer ID from state array
            endCall(channel);
            joinRandomChannel();
            setPeerIds(peerIds.filter(id => id !== uid))
        })

        // If Local user joins RTC channel
        engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess', channel, uid, elapsed)
            if (isSubscribed) {
                // Set state variable to true
                setJoinSucceed(true)
            }
        })

        return () => {
            // console.log('unmount')
            isSubscribed = false;
            // timeOut.cancel();
            // leaveChannel(channel);
            console.log("*********************************************");
            engine?.removeAllListeners();
            engine?.destroy();
        }

    },
        // will run once on component mount or if engine changes
        [engine]
    );
    return (
        <View style={{flex:1, backgroundColor:dark, justifyContent:'space-between'}}>
            {/* <Text style={{color:'grey'}}>{JSON.stringify(currentUser)}</Text> */}
            <LottieView
                // style={{position:'absolute', top:0}}
                source={require('../../assets/love.json')}
                autoPlay
                loop
              />
              <View style={{backgroundColor:'#1A224B', borderBottomLeftRadius:50, borderBottomRightRadius:50, marginBottom:20}}>
              <Text style={{color:'#fff', fontWeight:'700', alignSelf:'center', fontSize:20,margin:20}}>FACE TO FACE</Text>
              </View>
              <View style={{flexDirection:'column', justifyContent:'space-between',flex:1, marginBottom:100}}>
              <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                  <Text style={{color:'white', fontSize:16}}>You'll have a 10 seconds to decide </Text>
                  <Text style={{color:'white', fontSize:16}}> wheather you like each other or not. </Text>
                  <Text style={{color:'white', fontSize:16}}>Light up the heart if you find love at first sight!</Text>
              </View>
              {waiting && joinSucceed && (<View>
                  <Text style={{color:'#fff', fontSize:18, fontWeight:'300', alignSelf:'center'}}>Waiting No one is Online</Text>
              </View>)}
              {
                  engine && joinSucceed && (
                    <View style={{flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', margin:5}}>
                        
                        {
                            peerIds.length>0 &&
                            (<View style={{borderRadius:20,overflow:'hidden' ,borderColor:'#fff', borderWidth:2}}>
                            <RtcRemoteView.SurfaceView
                            style={{ height:200, width:150 }}
                            uid={peerIds[0]}
                            channelId={channel}
                            renderMode={VideoRenderMode.Hidden}
                            zOrderMediaOverlay={true} />
                            </View>)
                        }

                        <View style={{borderRadius:20,overflow:'hidden' ,borderColor:'#fff', borderWidth:2}}>
                        <RtcLocalView.SurfaceView
                        style={{ height:200, width:150 }}
                        channelId={channel}
                        renderMode={VideoRenderMode.Hidden} />
                        </View>
                    </View>
                  )
              }
                {
                    show && !joinSucceed && !loading && !joinSucceed ? (
                        <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={joinRandomChannel}>
                            <Ico name="picasa" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:22, fontWeight:'700', color:'#fff'}}>START</Text>
                        </TouchableOpacity>)
                        :
                        (
                            !joinSucceed && (
                                <ActivityIndicator />
                            )
                        )
                    
                }
                {
                    joinSucceed && (
                        <TouchableOpacity style={[styles.button,{backgroundColor:'red'}]} activeOpacity={0.6} onPress={() => endCall(channel,1)}>
                            <Icon name="call-end" size={30} color='#fff' style={{marginRight:20}} />
                        </TouchableOpacity>
                    )
                }
              </View>
            <Footer navigation={navigation} name="oncam" />
        </View>
    )
}
const styles = StyleSheet.create({
    button:{
        backgroundColor:'#4BD5CF',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:45,
        marginBottom:20,
        width:'50%',
        alignSelf:'center',
        borderRadius:50,
        alignItems:'center',
        padding:8,
        elevation:5,
        margin:5,
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(Cam)
