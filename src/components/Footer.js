import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

const Footer = ({navigation,name,notification }) => {
    return (
        <View style={styles.footmain}>
            <View style={styles.footer}>

                <TouchableOpacity style={styles.tab} onPress={() => {
                    navigation.navigate('Home');
                }}>
                <Icon name="video-camera" size={25} color={name==='discover' ? "#4BD5CF":'#ddd'}/>
                <Text style={{color:name==='discover' ? "#4BD5CF":'#fff', fontSize:12}}>Discover</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.tab} onPress={() => {
                    navigation.navigate('OnCam');
                }}>
                <Icon name="picasa" size={25} color={name==='oncam' ? "#4BD5CF":'#ddd'}/>
                <Text style={{color:name==='oncam' ? "#4BD5CF":'#fff', fontSize:12}}>OnCam</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={styles.tab} onPress={() => {
                    navigation.navigate('Messages');
                }}>
                <Icon name="message" size={25} color={name==='messages' ? "#4BD5CF":'#ddd'}/>
                {notification && <Icon name="dot-single" size={45}
                style={{position:'absolute', right:-8, top:-15}}
                color="#ff0000" />}
                <Text style={{color:name==='messages' ? "#4BD5CF":'#fff', fontSize:12}}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tab} onPress={() => {
                    navigation.navigate('Me');
                }}>
                <Icon name="user" size={25} color={name==='me' ? "#4BD5CF":'#ddd'}/>
                <Text style={{color:name==='me' ? "#4BD5CF":'#fff', fontSize:12}}>Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footer:{
        flexDirection:'row',
        justifyContent:'space-between',
        padding:10,
        paddingTop:10,
        paddingLeft:30,
        paddingRight:30
    },
    footmain:{
        position:'absolute',
        bottom:0,
        width:'100%',
        backgroundColor:'#1A224B',
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    tab:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    }
})

const mapStateToProps = (state) => ({
    notification: state.user.notification
})
export default connect(mapStateToProps)(Footer);
