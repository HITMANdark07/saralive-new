import React from 'react';
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {View, Text, Image, StyleSheet} from 'react-native';
import Icon from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.action';

const themeColor1= "#fff";
const themeColor2="#4BD5CF";
function CustomDrawer({navigation,currentUser,setUser}) {


  const signOut = () => {
      setUser(null);
  }
  return (
    <DrawerContentScrollView style={{backgroundColor:'#10152F', borderTopRightRadius:35, borderBottomRightRadius:35, flex:1}}>
      {/* <View style={styles.logo}> */}
        {/* <Image source={require('../../assets/logo.png')} /> */}
        <View style={{flexDirection:'column', flex:2, justifyContent:'space-between'}}>
        <View style={{
          flexDirection:'row',
          margin:10,
          marginLeft:30,
          marginBottom:20
        }} activeOpacity={0.5} >
           {
             currentUser && currentUser.image ?
             
             (
              <Image source={{uri:currentUser.image}} style={{width:60, height:60, borderRadius:50, alignSelf:'center', borderColor:themeColor2, borderWidth:1}} />
             )
             :
             (
              <View style={{backgroundColor:'#4BD5CF', padding:12 ,borderRadius:50}}>
                <Icon name="user" size={40} color="#fff"  />
              </View>
             )
           }
           
           <View style={{alignItems:'center',alignSelf:'center', marginLeft:10}}>
           <Text style={{fontSize:20, color:'#5DBCB0', fontWeight:'500', alignSelf:'center'}}>Hi,</Text>
           <Text style={{fontSize:20, color:'#5DBCB0', fontWeight:'500', alignSelf:'center'}}>{currentUser && currentUser.first_name}</Text>
           </View>

        </View>

        <View style={{borderWidth:0.5, borderColor:'#5DBCB0'}} />


      <ScrollView showsVerticalScrollIndicator={false}>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <View style={styles.drawerMenu}>
          <Icon name="video-camera" style={styles.icon} color={themeColor2} size={30} />
          <Text style={styles.menuText}>Discover</Text>
      </View>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={() => navigation.navigate('OnCam')} >
          <View style={styles.drawerMenu} >
          <Icon name="picasa" style={styles.icon} color={themeColor2} size={30} />
          <Text style={styles.menuText}>On Cams</Text>
      </View>
      </TouchableOpacity> */}
      
      <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
      <View style={styles.drawerMenu}>
          <Icon name="message" style={styles.icon} color={themeColor2} size={30} />
          <Text style={styles.menuText}>Messages</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Me')}>
      <View style={styles.drawerMenu}>
          <Icon name="user" style={styles.icon} color={themeColor2} size={30} />
          <Text style={styles.menuText}>My Profile</Text>
      </View>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Report')} >
      <View style={styles.drawerMenu} >
          <Ico name="analytics" style={styles.icon} color={themeColor2} size={30} />
          <Text style={styles.menuText}>Reports</Text>
      </View>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => signOut()}>
        <View style={styles.drawerMenu} >
            <Icon name="log-out" style={styles.icon} color={themeColor2} size={30} />
            <Text style={styles.menuText}>Sign Out</Text>
        </View>
      </TouchableOpacity>
      </ScrollView>
      </View>
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  logo: {
    margin: 0,
    marginTop: -30,
    top: 0,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  icon:{
    margin:5,
    marginRight:20
  },
  photo:{
    margin:5,
    marginRight:20,
    height:40,
    width:40,
    borderRadius:50
  },
  drawerMenu:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'flex-start',
      margin:10,
      padding:2,
      // borderLeftColor:themeColor1,
      // borderLeftWidth:1,
      borderRadius:5
  },
  menuText:{
      textAlignVertical:"center",
      color:themeColor1,
      fontSize:18,
      fontWeight:'300'
  }
});

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
  setUser : user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps,mapDispatchToProps)(CustomDrawer);