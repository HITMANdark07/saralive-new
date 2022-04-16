import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import {
  getDatabase,
  push,
  ref,
  set,
  orderByChild,
  equalTo,
  onChildAdded,
  query,
  orderByValue,
  onValue,
  update,
  get,
} from 'firebase/database';
import {API} from '../../api.config';
import Icoo from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/AntDesign';
import Icons from 'react-native-vector-icons/Feather';
import Ic from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const dark = '#10152F';

const ChatScreen = ({navigation, currentUser, route}) => {
  const channelId = route.params.channelId;
  const performer = route.params.performer;
  const performer_name = route.params.performer_name;
  const performer_image = route.params.performer_image;

  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [calling, setCalling] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const scrollRef = useRef();

  const init = () => {
    const db = getDatabase();
    const messagesRef = query(
      ref(db, 'messages'),
      orderByChild('channelId'),
      equalTo(channelId),
    );
    onValue(messagesRef, snapShot => {
        const  m =[];
      snapShot.forEach(snap => {
          m.push(snap);
      });
      setMessages(m);
    });
    return messagesRef;
  };

  const deductCoin = () => {
    axios({
      method:'POST',
      url:`${API}/customer_coin_deduct`,
      data:{
        customer_id:currentUser.user_id,
        performer_id:performer,
        coin:1
      }
    }).then(({data}) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    })
  }

  const sendMessage = msg => {
    const db = getDatabase();
    const messageRef = ref(db, 'messages');
    const newMessage = push(messageRef);
    set(newMessage, {
      channelId: channelId,
      sender: currentUser.user_id,
      receiver: performer,
      message: msg,
      timeStamp: Date.now(),
    })
      .then(res => {
        console.log(res);
        deductCoin();
      })
      .catch(err => {
        console.log('ERROR ', err);
      });
    const clientRef = ref(
      db,
      'client/' + currentUser.user_id + '/' + channelId,
    );
    update(clientRef, {
      last_message: msg,
      client_image:currentUser.profile_image,
      timeStamp: Date.now(),
    });
    const performerRef = ref(db, 'performer/' + performer + '/' + channelId);
    update(performerRef, {
      client_image:currentUser.profile_image,
      last_message: msg,
      timeStamp: Date.now(),
    });
  };
  const call = () => {

    axios({
        method:'POST',
        url:`${API}/customer_wallet_balance`,
        data:{customer_id:currentUser.user_id}
    }).then((res) => {
        if(res.data.responseCode){
            axios({
              method:'POST',
              url:`${API}/performer_details`,
              data:{user_id:performer}
            }).then(({data}) => {
              if(data.responseCode){
                let p = data?.responseData;
                const time = ((+(res.data.responseData))/(+(p.coin_per_min)))*60*1000;
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
    }).catch((err) => {
        console.log(err);
    })
    
}

  const checkOnline = () => {
    const db = getDatabase();
    const paidRef = ref(db, 'paidcam/'+performer);
    onValue(paidRef,snapShot => {
      console.log(snapShot.val());
      if(snapShot.exists() && snapShot.val().status==="pending"){
        setShow(true);
      }else if(snapShot.exists() && snapShot.val().status==="waiting" && snapShot.val().person2==currentUser.user_id ){
        setCalling(true);
      }else if(snapShot.exists() && snapShot.val().status==="incall" && snapShot.val().person2==currentUser.user_id){
        console.log(performer);
        navigation.navigate("VideoCall", {id : performer});
      }else if(!snapShot.exists()){
        setShow(false);
        console.log('running......*');
      }else{
        //do nothing
      }
    })
  }
  console.log(currentUser)
  React.useEffect(() => {
    init();
    checkOnline();
  }, []);

  const endCall = () => {
    // route.params.engine?.leaveChannel();
    setCalling(false);
    const db = getDatabase();
    const paidRef = ref(db, 'paidcam/'+performer);
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

  const Message = ({msg}) => {
    if (msg.sender == currentUser.user_id) {
      return (
        <View style={{display: 'flex', flexDirection: 'row-reverse'}}>
          <View
            style={{
              backgroundColor: '#1A224B',
              padding: 10,
              margin: 2,
              marginRight: 10,
              borderRadius: 20,
              borderBottomRightRadius: 0,
            }}>
            <Text style={{color: '#ffffff'}}>{msg.message}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View
            style={{
              backgroundColor: '#1A224B',
              padding: 10,
              margin: 2,
              marginLeft: 10,
              borderRadius: 20,
              borderBottomLeftRadius: 0,
            }}>
            <Text style={{color: '#ffffff'}}>{msg.message} </Text>
          </View>
        </View>
      );
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: dark}}>
      <View
        style={{
          backgroundColor: '#1A224B',
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginBottom: 20,
          flexDirection: 'row',
          width: '100%',
          alignItems:'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Messages');
          }}
          style={{margin: 20, marginRight: 0}}>
          <Icon name="chevron-back-outline" color={'#fff'} size={30} />
        </TouchableOpacity>
        <Image
          source={{
            uri: performer_image!=='' ? performer_image : 'https://pbs.twimg.com/profile_images/1280095122923720704/K8IvmzSY_400x400.jpg',
          }}
          style={{height: 40, width: 40, borderRadius: 50, alignSelf: 'center'}}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: '400',
            alignSelf: 'center',
            fontSize: 18,
            margin: 20,
            marginLeft: 5,
          }}>
          {performer_name}
        </Text>
        {show ? (calling ?
        <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
          <Text style={{color:'white'}}>Calling...</Text>
          <TouchableOpacity onPress={endCall} activeOpacity={0.4} 
          style={{alignItems:'flex-end', backgroundColor:'#ff0000', alignItems:'center', padding:5, borderWidth:1, borderColor:'white', borderStyle:'solid', borderRadius:50, marginLeft:5}}
          >
          <Icoo name='call-end' color="#fff" size={25} />
          </TouchableOpacity>
        </View>
        :
        <TouchableOpacity onPress={call} activeOpacity={0.4} 
        style={{alignItems:'flex-end'}}
        >
        <Ic name='video-camera' color={'#fff'} size={30} />
        </TouchableOpacity>)
        :
        <Icons name='video-off' color={'#fff'} size={30} />
      }
      </View>
      <ScrollView style={{flex: 1}} ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}>
        <View style={{display: 'flex', flexDirection: 'column'}}>
                    {messages.map((msg,idx) => {
                        const l = JSON.stringify(msg);
                        const m = JSON.parse(l);
                        return(
                            <Message msg={m} key={idx} />
                        )
                    })}
            
        </View>
      </ScrollView>
      <View style={styles.chatFoot}>
        <Ico
          name="message1"
          size={28}
          color="#fff"
          style={{alignSelf: 'center'}}
        />
        <TextInput
          placeholderTextColor="#ddd"
          style={{flex: 1, color: '#fff', alignSelf: 'center', marginLeft: 10}}
          value={message}
          autoCapitalize="none"
          onChangeText={e => setMessage(e)}
          placeholder="Type Message Here..."
        />
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => {
            sendMessage(message);
            setMessage('');
          }}>
          <Ic name="send" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  chatFoot: {
    backgroundColor: '#1A224B',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ChatScreen);
