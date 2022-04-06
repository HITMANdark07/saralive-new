import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { API } from '../../api.config';
import Icon from 'react-native-vector-icons/Entypo';
import ChatListItem from '../components/ChatListItem';
import { getDatabase, push, ref, set, orderByChild, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import Footer from '../components/Footer';
import { setNotification } from '../redux/user/user.action';

const dark= '#10152F';
const InboxScreen = ({navigation, currentUser, setNoti}) => {
    const [channels, setChannels] = React.useState([]);
    React.useEffect(() => {
        setNoti(false);
    },[]);
    const getChannels = () => {
        console.log("running");
        const db = getDatabase();
        const channelsRef = ref(db, 'client/'+currentUser.user_id);
        onValue(channelsRef, (snapShot) => {
            const c =[];
            snapShot.forEach((snap) => {
                c.push(snap.val());
            });
            setChannels([...c]);
        })
    }
    React.useEffect(() => {
        getChannels();
    },[]);
    return (
        <View style={{flex:1, backgroundColor:dark}}>
            <View style={{backgroundColor:'#1A224B', borderBottomLeftRadius:50, borderBottomRightRadius:50, marginBottom:20}}>
            <Text style={{color:'#fff', fontWeight:'700', alignSelf:'center', fontSize:20,margin:20}}>MESSAGES</Text>
            </View>
            <ScrollView 
            >
                <View style={{marginBottom:100}}>

                    {channels.sort((a,b) => b.timeStamp-a.timeStamp).map((cha) => (
                        <TouchableOpacity key={cha.channelId} activeOpacity={0.4} onPress={() => { navigation.navigate('Chat',{channelId:cha.channelId, performer:cha.performer, performer_name:cha.performer_name, performer_image:cha.performer_image})}}>
                            <ChatListItem name={cha.performer_name} performer_image={cha.performer_image} message={`${cha.last_message.substr(0,12)}${cha.last_message.length>12 ? "...":""}`} time={cha.timeStamp} />
                        </TouchableOpacity>
                    ))}
                                                    
                </View>
            </ScrollView>
            <Footer navigation={navigation} name="messages" />
        </View>
    )
}
const styles = StyleSheet.create({
    
})

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})

const mapDispatchToProps = (dispatch) => ({
    setNoti : data => dispatch(setNotification(data))
})
export default connect(mapStateToProps,mapDispatchToProps)(InboxScreen);