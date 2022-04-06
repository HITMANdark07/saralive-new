import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import {connect} from 'react-redux';
import InputText from '../components/InputText';
import Ico from 'react-native-vector-icons/Ionicons';
import { setCurrentUser } from '../redux/user/user.action';
import {API} from '../../api.config';
import Ic from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const dark = '#10152F';
const theme1 = "#E5E5E5";
const ChatScreen = ({navigation, currentUser, setUser}) => {

const [firstName, setFirstName] = React.useState(currentUser.name);
const [lastName, setLastName] = React.useState("");
const [email , setEmail] = React.useState(currentUser.email);
const [phone, setPhone] = React.useState(currentUser.phone);
const [show, setShow] = React.useState(false);
const [loading, setLoading] = React.useState(false);
  const scrollRef = useRef();

  const init = () => {
    
  };


  React.useEffect(() => {
    init();
  }, []);
  const handleChange = (name, e) => {
    switch(name){
        case 'firstName':
            setFirstName(e);
            break;
        case 'lastName':
            setLastName(e);
            break;
        case 'email':
            setEmail(e);
            break;
        case 'phone':
            setPhone(e);
            break;
        default:
            console.log("none",e);
    }
    setShow(true);
}
    const update = () => {
        setShow(false);
        console.log(firstName, email, phone);
        axios({
            method:'POST',
            url:`${API}/customer_profile_update`,
            data:{
                customer_id:currentUser.user_id,
                name:firstName,
                email:email,
                telephone:phone
            }
        }).then((res) => {
            if(res.data.responseCode){
              ToastAndroid.showWithGravity(res.data.responseText,ToastAndroid.CENTER,ToastAndroid.SHORT);
              setUser(res.data.responseData);
            }else{
              ToastAndroid.showWithGravity(res.data.responseText,ToastAndroid.CENTER,ToastAndroid.SHORT);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

 
  return (
    <View style={{flex: 1, backgroundColor: dark}}>
      <View
        style={{
          backgroundColor: '#1A224B',
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginBottom: 20,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{margin: 20, marginRight: 0}}>
          <Ico name="chevron-back-outline" color={'#fff'} size={30} />
        </TouchableOpacity>
        
        <Text
          style={{
            color: '#fff',
            fontWeight: '400',
            alignSelf: 'center',
            fontSize: 18,
            margin: 20,
            marginLeft: 5,
          }}>
          {currentUser.name.toUpperCase()}
        </Text>
      </View>
      <View>
          <Text style={{color:'#fff',textAlign:'center', fontSize:22,fontWeight:'300'}}>Update Profile</Text>
      </View>
      <ScrollView style={{flex: 1}} ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}>
        <View style={styles.container}>
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <InputText name="firstName" icon="person" placeholder="Your Name" value={firstName} handleChange={handleChange}  />
                    {/* <InputText name="lastName" icon="person" placeholder="Last Name" value={lastName} handleChange={handleChange}  /> */}
                    <InputText name="email" icon="email" placeholder="Email" value={email} handleChange={handleChange}  />
                    <InputText name="phone" icon="phone" placeholder="Phone" value={phone} handleChange={handleChange} type="numeric"  />
                    {/* <InputText name="password" icon="lock" placeholder="Password" value={password} handleChange={handleChange} password={true}  /> */}
                </View>
                {
                    loading ?
                    (
                        <View style={{alignSelf:'center'}}>
                            <ActivityIndicator size="large" color={theme1} />
                        </View>
                    )
                    :
                    (
                        <>
                        {
                        show && 
                        <TouchableOpacity style={styles.button} onPress={update} >
                        <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>UPDATE</Text>
                        </TouchableOpacity>
                        }
                        </>
                    )
                }
                
            </View>
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        width:'85%',
        marginTop:20,
        justifyContent:'center',
        alignSelf:'center',
        padding:10,
        // fontFamily:iconFont
    },
    button:{
        backgroundColor:'#4BD5CF',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:45,
        marginBottom:20,
        width:'60%',
        alignSelf:'center',
        borderRadius:50,
        alignItems:'center',
        padding:8,
        margin:5,
        shadowColor: "#000",
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
  currentUser: state.user.currentUser,
});
const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);
