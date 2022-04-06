import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/MaterialIcons';
import InputText from '../components/InputText';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.action'
import { API } from '../../api.config';

const theme1 = "#E5E5E5";
const OtpScreen = ({navigation, setUser, route}) => {
    const phone = route.params.phone;
    const [loading, setLoading] = React.useState(false);
    const [otp, setOtp] = React.useState("");
    const handleChange = (name, e) => {
        if(name==="otp"){
            setOtp(e);
        }else{
            console.log(e);
        }
        
    }

    const init = () => {
        axios({
            method:'POST',
            url:`${API}/send_otp`,
            data:{phone_no:phone}
        }).then((res) => {
            if(res.data.responseCode){
                // ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                setOtp(res.data.responseData);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    const getUser = (id) => {
        axios({
            method:'POST',
            url:`${API}/customer_profile`,
            data:{
                customer_id:id,
            }
        }).then((res) => {
            if(res.data.responseCode){
                setUser(res.data.responseData);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    const verify = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('phone_no',phone);
        formData.append("otp",otp);
        // console.log(formData);

        axios({
            method:'post',
            url:`${API}/verify_otp`,
            data:formData,
        }).then((res) => {
            setLoading(false);
            console.log(res.data);
            if(res.data.responseCode){
                // console.log(res.data.isSuccess);
                console.log(res.data.responseData);
                if(res.data.isRegister=="0"){
                    ToastAndroid.showWithGravity("Phone number is not Registered", ToastAndroid.CENTER, ToastAndroid.SHORT);
                    navigation.goBack();
                    return ;
                }
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                getUser(res.data.responseData.user_id);
            }else{
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.CENTER, ToastAndroid.SHORT);
                console.log(res.data.responseText)
            }
        }).catch((err) =>{
            console.log("ERROR",err);
            setLoading(false);
        })
        
    }

    React.useState(() => {
        init();
    },[]);
    return (
        <View style={{flex:1, backgroundColor:theme1}}>
        <LinearGradient colors={['#BC7BE4', '#10152F']}  style={{flex:1, justifyContent:'center'}} >
        <TouchableOpacity style={{position:'absolute', top:10, padding:10}} onPress={() => {
            navigation.goBack();
        }}>
            <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
        </TouchableOpacity>
            <Text style={{color:'#fff', fontSize:30, textAlign:'center', fontWeight:'700', fontFamily:'Helvetica'}}>Verify OTP</Text>
            <View style={styles.container}>
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                
                    {/* <InputText name="lastName" icon="person" placeholder="Last Name" value={lastName} handleChange={handleChange}  /> */}
                    {/* <InputText name="email" icon="email" placeholder="Email" value={email} handleChange={handleChange}  /> */}
                    {/* <InputText name="phone" icon="phone" placeholder="Phone" value={phone} handleChange={handleChange} type="numeric"  /> */}
                    <InputText name="otp" icon="lock" placeholder="OTP" value={otp} handleChange={handleChange} type="numeric"  />
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
                        <TouchableOpacity onPress={verify} >
                            <LinearGradient  colors={['#FEDB37', '#FDB931', '#9f7928', '#8A6E2F']} style={styles.button} >
                            <>
                            <Ico name="verified" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>Verify</Text>
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

export default connect(null, mapDispatchToProps)(OtpScreen);
