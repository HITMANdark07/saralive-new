import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Ico from 'react-native-vector-icons/Ionicons';

const dark= '#10152F';
const windowWidth = Dimensions.get('window').width;
const PerformerCard = ({h,performer}) => {
    console.log(performer);
    return (
        <View style={{height:h? 150 :250, width:(windowWidth/2)-15, borderRadius:50, margin:5}}>
            <ImageBackground source={{uri: performer && performer?.images?.length>0 ? performer?.images[performer.images.length-1].image : "https://pbs.twimg.com/profile_images/1280095122923720704/K8IvmzSY_400x400.jpg"}} resizeMode='cover' style={{flex:1, borderRadius:10, overflow: 'hidden'}}>
                <View style={styles.container}>
                    <View style={{flexDirection:'row-reverse', padding:2}}>
                        <View style={styles.status}>
                            <Icon name="primitive-dot" size={15} style={{marginRight:5}} color="#00ff00" />
                            <Text style={{color:'#00ff00', fontSize:10}}>Online</Text>
                        </View>
                    </View>
                    
                    <View style={styles.contents}>
                    <Text style={{color:'#fff', fontWeight:'600'}}>{performer?.f_name} {performer?.l_name}</Text>
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.age}>
                            <Ico name="female" color={'#fff'} size={10} style={{marginRight:5}} />
                            <Text style={{color:'#fff', fontSize:10}}>{new Date().getFullYear() - new Date(performer?.dob).getFullYear()}</Text>
                        </View>
                        <View style={styles.country}>
                            <Text style={{color:'#fff', fontSize:10, paddingLeft:5, paddingRight:5}}>{performer?.address.split(' ')[0]}</Text>
                        </View>
                    </View>
                    {/* <View>
                        <Text style={{color:'#fff', fontSize:10}}>lorem ipsum 💓 💓</Text>
                    </View> */}
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'space-between'
    },
    status:{
        flexDirection:'row',
        backgroundColor:dark,
        borderRadius:20,
        padding:8,
        paddingTop:5,
        paddingBottom:5,
        justifyContent:'center',
        alignItems:'center'
    },
    age:{
        backgroundColor:'#FF00FF',
        flexDirection:'row',
        alignItems:'center',
        padding:5,
        justifyContent:'center',
        marginRight:10,
        borderRadius:15
    },
    country:{
        backgroundColor:'#A020F0',
        padding:5,
        borderRadius:15
    },
    contents:{
        flexDirection:'column',
        padding:10,
        justifyContent:'space-evenly'
    }
})

export default PerformerCard;
