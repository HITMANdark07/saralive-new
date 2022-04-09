// import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import CustomDrawer from './src/components/Drawer';
// import Home from './src/screens/Home';
// import Profile from './src/screens/Profile';
import Home from './src/screens/Home';
import Main from './src/screens/Main';
import Login from "./src/screens/Login";
import SignUp from './src/screens/SignUp';
import Cam from './src/screens/Cam';
import InboxScreen from './src/screens/InboxScreen';
import ChatScreen from './src/screens/ChatScreen';
import Profile from './src/screens/Profile';
import Performer from './src/screens/Performer';
import OtpScreen from './src/screens/OtpScreen';
import {LogBox } from 'react-native';
LogBox.ignoreLogs(['Reanimated 2']);
import { connect } from 'react-redux';
import firebase from './src/firebase/config';
import VideoCall from './src/screens/VideoCall';
import UpdateProfile from './src/screens/UpdateProfile';
import BuyCoins from './src/screens/BuyCoins';
import FollowingList from './src/screens/FollowingList';
import { setNotification } from './src/redux/user/user.action';
import PushNotification from 'react-native-push-notification';
// import {database } from 'firebase/'
// import AddDoctor from './src/screens/AddDoctor';
// import ManageDoctor from './src/screens/ManageDoctor';
// import Template from './src/screens/Template';
// import Report from './src/screens/Report';
// import ChooseDoctor from './src/screens/ChooseDoctor';
// import FinalPoster from './src/screens/FinalPoster';

const theme1="#5DBCB0";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function HomeDrawer() {

  return (
    <Drawer.Navigator screenOptions={{drawerStyle:{backgroundColor:'transparent'}}} drawerContent={(props) => <CustomDrawer {...props}  /> }>
        <Drawer.Screen name="Home" component={Home} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="OnCam" component={Cam} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="Messages" component={InboxScreen} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="VideoCall" component={VideoCall} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="Me" component={Profile} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="Chat" component={ChatScreen} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="Performer" component={Performer} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="UpdateProfile" component={UpdateProfile} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="BuyCoins" component={BuyCoins} options={{headerShown:false, unmountOnBlur:true}} />
        <Drawer.Screen name="Followings" component={FollowingList} options={{headerShown:false, unmountOnBlur:true}} />
    </Drawer.Navigator>
  );
}

// function Login(){
//     return(
//         <View style={{flex:1}}>
//             <Text>LOGIN NOW</Text>
//         </View>
//     )
// }

const Router = ({currentUser,setNoti}) => {

  PushNotification.createChannel(
    {
      channelId: "channelpoply", // (required)
      channelName: "My channel", // (required)
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  React.useEffect(() => {
    if(currentUser){
    const db = getDatabase();
    const mRef = query(ref(db, 'messages'),orderByChild("receiver"), equalTo(currentUser?.user_id));
    return onValue(mRef,(snapshot) => {
        setNoti(true);
        // console.log(Object.keys(snapshot.val()));
        if(snapshot.val()){
          let last = Object.keys(snapshot.val())[(Object.keys(snapshot.val())).length-1];
          let msg = (snapshot.val())[last].message;
          PushNotification.localNotification({
            channelId:'channelpoply',
            message:msg,
            title:'New Message'
          })
        }
    })
    }
},[]);
  
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {
                    currentUser ?
                    <>
                    <Stack.Screen name="HomeDrawer" component={HomeDrawer} options={{headerShown:false}} />
                    </>
                    :
                    <>
                    <Stack.Screen name='Main' component={Main} options={{headerShown:false}} />
                    <Stack.Screen name='Login' component={Login} options={{headerShown:false}}  />
                    <Stack.Screen name='Otp' component={OtpScreen} options={{headerShown:false}}  />
                    <Stack.Screen name='SignUp' component={SignUp} options={{headerShown:false}} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}
const mapStateToProps = (state) => ({
  currentUser : state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
  setNoti : data => dispatch(setNotification(data))
})
export default connect(mapStateToProps,mapDispatchToProps)(Router);
