import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, ToastAndroid, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/Octicons';
import Iconss from 'react-native-vector-icons/MaterialIcons';
import SimpleIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ic from 'react-native-vector-icons/FontAwesome5';
import Icons from 'react-native-vector-icons/Entypo';
import { getDatabase, push, ref, set, orderByChild, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import { connect } from 'react-redux';
import axios from 'axios';
import { API } from '../../api.config';
import sha256 from 'crypto-js/sha256'

const dark= '#10152F';
const Performer = ({navigation,currentUser, route}) => {

    const [show, setShow] = React.useState(false);
    const [busy, setBusy] = React.useState(false);
    const [coins, setCoins] = React.useState(0);
    const [follow, setFollow] = React.useState(false);
    const [followers, setFollowers] = React.useState([]);
    const wd = Dimensions.get('window').width;
    const p = route.params.performer;

    const hash = sha256(p.email+currentUser.user_id).words[0];
    console.log(hash);
    const followher = () => {
        axios({
            method:'POST',
            url:`${API}/performer_follow`,
            data:{user_id:currentUser.user_id,performer_id:p?.id}
        }).then((res) => {
            setFollow(true);
            ToastAndroid.showWithGravity(res.data.responseText,ToastAndroid.CENTER, ToastAndroid.SHORT);
        }).catch((err) => {
            console.log(err);
        })
    }

    const getFollowers = () => {
        axios({
            method:'POST',
            url:`${API}/customer_follow_list`,
            data:{performer_id:p.id}
        }).then((res) => {
            if(res.data.responseCode){
                setFollowers(res.data.responseData);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    // function writeUserData(userId, name, email) {
    //     const db = getDatabase();
    //     const messagesRef = ref(db, 'messages');
    //     const newMessage = push(messagesRef);
    //     set(newMessage,{
    //         channelId:"1221",
    //         from:userId,
    //         to:"data",
    //         timeStamp: Date.now()
    //     }).then((res) => {
    //         console.log(res);
    //     }).catch((err) => {
    //         console.log("ERROR ", err);
    //     })
    //   }

    function goToChat(){
        const db = getDatabase();
        const onCamRef = query(ref(db, 'client/'+currentUser.user_id),orderByChild("channelId"), equalTo(hash));
        onValue(onCamRef,(snapshot) => {
            if(snapshot.exists()){
                navigation.navigate('Chat',{channelId:hash, performer:p.id,performer_name:p.f_name+" "+p.l_name,performer_image:p.images.length>0 ? p.images[p.images.length-1].image: ""});
            }else{
                createChatChannel();
            }
        },{
            onlyOnce:true
        })
    }
    // console.log(p);

    function createChatChannel() {
    const db = getDatabase();
    const clientRef = ref(db, 'client/'+currentUser.user_id+"/"+hash);
    set(clientRef,{
        channelId:hash,
        client:currentUser.user_id,
        performer_name:p.f_name+" "+p.l_name,
        client_name:currentUser.name,
        performer_image:p.images.length>0 ? p.images[p.images.length-1].image : '',
        client_image:currentUser.profile_image,
        performer:p.id,
        last_message:'...',
        timeStamp: Date.now()
    }).then((res) => {
        console.log(res);
        navigation.navigate('Chat',{channelId:hash, performer:p.id,performer_name:p.f_name+" "+p.l_name,performer_image:p.images.length>0 ? p.images[p.images.length-1].image: ""});
    }).catch((err) => {
        console.log("ERROR ", err);
    })

    const performerRef = ref(db, 'performer/'+p.id+"/"+hash);
    set(performerRef,{
        channelId:hash,
        client:currentUser.user_id,
        performer_name:p.f_name+" "+p.l_name,
        client_name:currentUser.name,
        performer_image:p.images.length>0 ? p.images[p.images.length-1].image : '',
        client_image:currentUser.profile_image,
        performer:p.id,
        last_message:'...',
        timeStamp: Date.now()
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log("ERROR ", err);
    })
    }

      const endCall = () => {
        // route.params.engine?.leaveChannel();
        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+p?.id);
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

    const init = () => {

        axios({
            method:'POST',
            url:`${API}/customer_wallet_balance`,
            data:{customer_id:currentUser.user_id}
        }).then((res) => {
            if(res.data.responseCode){
                setCoins(+(res.data.responseData));
                const time = ((+(res.data.responseData))/(+(p?.coin_per_min)))*60*1000;
                if(time>10000){
                    try{
                        const db = getDatabase();
                        const paidRef = ref(db, 'paidcam/'+p?.id);
                        update(paidRef, {
                            person2:+(currentUser.user_id),
                            image : currentUser.profile_image,
                            maxtime: time,
                            name : currentUser.name,
                            status:'waiting'
                    });
                    }catch(err){
                        console.log(err);
                    }
                }else{
                    ToastAndroid.showWithGravity("Your Wallet Balance is low , Recharge Now!",ToastAndroid.CENTER, ToastAndroid.LONG);
                }
            }
        }).catch((err) => {
            console.log(err);
        })
        
    }

    React.useEffect(() => {
        // const db = getDatabase();
        // const messageRef = query(ref(db, 'messages'),orderByChild("channelId"), equalTo("1221"));
        // onChildAdded(messageRef,(data) =>{
        //     console.log(data.val());
        // })
        getFollowers();
        const db = getDatabase();
        try{
            const paidRef = ref(db,'paidcam/'+p?.id);
            return onValue(paidRef, (snapshot) => {
            if((snapshot?.val()?.status==="waiting" || snapshot?.val()?.status==="incall") && snapshot?.val()?.person2!=currentUser.user_id ){
                setBusy(true);
            }else{
                setBusy(false)
            }
            if(snapshot?.val()?.status==='incall' && snapshot?.val()?.person2==currentUser.user_id){
                setShow(false);
                navigation.navigate("VideoCall", {id : p?.id});
            }else if(snapshot?.val()?.status==='waiting' && snapshot?.val()?.person2==currentUser.user_id){
                setShow(true);
                console.log("CALLING...");
            }else{
                setShow(false);
                console.log(snapshot?.val());
            }
        })
        }catch(err){
            console.log(err);
        }
    },[]);
    return (
        <View style={{flex:1, backgroundColor:dark, justifyContent:'space-between'}}>
            <View style={styles.container}>
                <View style={{flex:1}}>
                    
                    {p.images.length>0 ?
                    
                    (<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{display:'flex', flexDirection:'row', overflow:'scroll'}}>
                        {
                        p.images.map((perf) => (
                            <Image source={{uri: perf.image}} style={{height:'100%',width:wd,}} />
                        ))
                    }
                        </View>
                    </ScrollView>)
                    :
                    (<Image source={{uri: "https://pbs.twimg.com/profile_images/1280095122923720704/K8IvmzSY_400x400.jpg"}} style={{flex:1}} />)}


                    
                    <TouchableOpacity style={styles.f_button} activeOpacity={0.6} onPress={followher}>
                        <SimpleIcons name="user-follow" color={!follow ? "purple": "#fff"} size={20} />
                        <Text style={{color:!follow ? "purple": "#fff", fontWeight:'400'}}>{follow ? "FOLLOWED":"FOLLOW"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contents}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <View style={{flexDirection:'column',justifyContent:'space-between'}}>
                            <Text style={{color:'#fff', fontSize:18, fontWeight:'700', marginBottom:5}}>{p?.f_name} {p?.l_name}   <Text style={{fontWeight:'300'}}>({followers.length} <Text style={{fontSize:12}}>Followers</Text>)</Text></Text>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row', alignItems:'center', backgroundColor:'#FF00FF', paddingLeft:8,paddingRight:8, borderRadius:10}}>
                                    <Icon name="female" color={'#fff'} size={10} style={{marginRight:5}} />
                                    <Text style={{color:'#fff', fontSize:11}}>{new Date().getFullYear() - new Date(p?.dob).getFullYear()}</Text>
                                </View>
                                <View style={{backgroundColor:'#A020F0', paddingLeft:8,paddingRight:8, borderRadius:10, marginLeft:10}}>
                                    <Text style={{color:'#fff', fontSize:11}}>{p?.address}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                                <View style={{flexDirection:'row', alignItems:'center', paddingLeft:8,paddingRight:8, borderRadius:10}}>
                                    <Ico name="primitive-dot" color={'#00ff00'} size={10} style={{marginRight:5}} />
                                    <Text style={{color:'#00ff00', fontSize:11}}>Online</Text>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center', paddingLeft:8,paddingRight:8, borderRadius:10}}>
                                    <Ic name="coins" color={'#FFFF00'} size={15} style={{marginRight:5}} />
                                    <Text style={{color:'#fff', fontSize:13}}>{p?.coin_per_min}/min</Text>
                                </View>
                        </View>
                    </View>
                    {
                        !show ? 
                        (
                            <View style={{flexDirection:'row', justifyContent:'center'}}>
                                <TouchableOpacity style={styles.button} activeOpacity={0.6} 
                                onPress={() => {goToChat()}}
                                >
                                    <Icons name="message" size={30} color='#fff' style={{marginRight:20}} />
                                    <Text style={{fontSize:20, fontWeight:'700', color:'#fff'}}>CHAT</Text>
                                </TouchableOpacity>
                                {
                                    busy ?
                                    (
                                        <View style={styles.button} activeOpacity={0.6} >
                                            <Icons name="video-camera" size={30} color='#fff' style={{marginRight:20}} />
                                            <Text style={{fontSize:20, fontWeight:'700', color:'#fff'}}>BUSY</Text>
                                        </View>
                                    )
                                    :
                                    (
                                        <TouchableOpacity style={styles.button} activeOpacity={0.6} onPress={init}>
                                            <Icons name="video-camera" size={30} color='#fff' style={{marginRight:20}} />
                                            <Text style={{fontSize:20, fontWeight:'700', color:'#fff'}}>Video Call</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        )
                        :
                        (
                            <View style={{flexDirection:'column', flex:1, justifyContent:'center'}}>
                                <Text style={{color:'#fff', fontSize:20, fontWeight:'300', textAlign:'center'}}>Calling...</Text>
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
                                    alignSelf:'center',
                                    marginTop:20,
                                    justifyContent: 'center',
                                    borderColor: '#fff',
                                    borderWidth: 2,
                                    }}>
                                    <Iconss name="call-end" color="#fff" size={35} />
                                    </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </View>
            <View style={{position:'absolute'}}>
            <TouchableOpacity onPress={() => {navigation.navigate('Home');}} style={{margin:20, marginRight:0}}>
                <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
            </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
    contents:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between',
        padding:15
    },
    f_button:{
        // right:0,
        position:'absolute',
        right:0,
        bottom:0,
        padding:10,
        backgroundColor:'#4BD5CF',
        width:110,
        borderRadius:20,
        margin:10,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
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
const mapStateToProps = state => ({
    currentUser : state.user.currentUser
})

export default connect(mapStateToProps)(Performer);
