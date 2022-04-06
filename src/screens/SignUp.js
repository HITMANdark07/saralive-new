import React from 'react'
import { View,ImageBackground, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import InputText from '../components/InputText';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.action'
import { API } from '../../api.config';


const theme1 = "#E5E5E5";
const SignUp = ({navigation, setUser}) => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email , setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
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
            case 'password':
                setPassword(e);
                break;
            default:
                console.log("none",e);
        }
    }
    const register = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("name",firstName);
        formData.append('email', email);
        formData.append('telephone', phone);
        console.log(formData);

        axios({
            method:'post',
            url:`${API}/customer_register`,
            data:formData,
        }).then((res) => {
            setLoading(false);
            // console.log(res.data);
            if(res.data.responseCode){
                console.log(res.data.responseText);
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                console.log(res.data.responseData);
                navigation.navigate('Otp',{phone:phone})
            }else{
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.LONG, ToastAndroid.CENTER);
                console.log(res.data.responseText)
            }
        }).catch((err) =>{
            console.log("ERROR",err);
            setLoading(false);
        })
        
    }
    return (
        <View style={{flex:1, backgroundColor:theme1}}>
        <LinearGradient colors={['#BC7BE4', '#10152F']}  style={{flex:1, justifyContent:'center'}} >
        <TouchableOpacity style={{position:'absolute', top:10, padding:10}} onPress={() => {
            navigation.goBack();
        }}>
            <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
        </TouchableOpacity>
            <Text style={{color:'#fff', fontSize:40, textAlign:'center', fontWeight:'700', fontFamily:'Helvetica'}}>REGISTER</Text>
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
                        <TouchableOpacity onPress={register} >
                            <LinearGradient colors={['#FEDB37', '#FDB931', '#9f7928', '#8A6E2F']} style={styles.button}>
                                <>
                                <Ico name="person-add-alt-1" size={30} color='#fff' style={{marginRight:20}} />
                                <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>SIGNUP</Text>
                                </>
                            </LinearGradient>
                        </TouchableOpacity>
                    )
                }
                
            </View>
            </LinearGradient>
        </View>
    )
}

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
        width:'90%',
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
const mapDispatchToProps = (dispatch) => ({
    setUser : user =>  dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(SignUp);
