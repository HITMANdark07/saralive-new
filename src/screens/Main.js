import React from 'react';
import { View, Text, ImageBackground , StyleSheet, TouchableOpacity, Image, Linking, ToastAndroid} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ico from 'react-native-vector-icons/AntDesign';
import {
    GoogleSignin,
  } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import {LoginManager, AccessToken,GraphRequest, GraphRequestManager} from 'react-native-fbsdk-next';
import { setCurrentUser } from '../redux/user/user.action';
import { API } from '../../api.config';
import { connect } from 'react-redux';
const Main = ({navigation,setUser}) => {

    const signInApp = (email) => {
        axios({
            method:'POST',
            url:`${API}/customer_social_login`,
            data:{email:email}
        }).then((response) => {
            if(response.data.responseCode){
                setUser(response.data.responseData);
            }else{
                ToastAndroid.showWithGravity("Authentication Failed",ToastAndroid.CENTER, ToastAndroid.LONG);
            }
        })
    }
    const GetInfoUSer = () => {
        return new Promise((resolve, reject) => {
            const infoRequest = new GraphRequest('/me', null, ((error, result) => {
                if (error) {
                    reject(error)
                } else {
                   resolve(result)
                }
            }))
        
            new GraphRequestManager().addRequest(infoRequest).start();
        
          })
    }
    const signIn = () => {
        GoogleSignin.configure({
            androidClientId: '291449817191-8h1gnefrl5jtm219h6ul2bn40hh486vs.apps.googleusercontent.com',
            webClientId:'291449817191-io9obsmhs6suv8eadlrjj6jujefqjcqh.apps.googleusercontent.com'
            });
        GoogleSignin.hasPlayServices().then((hasPlayService) => {
                if (hasPlayService) {
                    GoogleSignin.signIn().then((userInfo) => {
                            const {email , name, photo} = userInfo.user;
                            signInApp(email);  
                            console.log(email);
                            ToastAndroid.showWithGravity("Hi "+name,ToastAndroid.CENTER,ToastAndroid.LONG); 
                    })
                }
        }).catch((e) => {
            console.log("ERROR IS : " + JSON.stringify(e));
        })
    }

    const facebookLogin = (userID,accessToken) => {
        const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

        axios({
            method:'GET',
            url:url,
        }).then(({data}) => {
            signInApp(data.email);
        }).catch((err) =>{
            console.log(err);
        })
    }
    
    const login = () => {
        LoginManager.logInWithPermissions(['email','public_profile']).then(result => {
            if (result.isCancelled) {
                console.log(':(')
            } else {
                AccessToken.getCurrentAccessToken().then((data) => {
                    let myAccessToken = data.accessToken.toString();
                    GetInfoUSer().then((response) => {
                        console.log(response, myAccessToken);
                        if(response.id){
                            facebookLogin(response.id,myAccessToken);
                        }else{
                            ToastAndroid.showWithGravity("Email is not Associated with your Account",ToastAndroid.CENTER, ToastAndroid.LONG);
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                }
                ).catch(error => {
                    console.log(':(')
                })
            }
        })
    }

    return (
        <View style={{flex:1}}>
            <ImageBackground source={require("../../assets/images/back.jpg")} resizeMode="cover" style={{flex:1, justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('SignUp')
                }}>
                    <LinearGradient  colors={['#FEDB37', '#FDB931', '#9f7928', '#8A6E2F']} style={styles.button} >
                                <>
                                <Icon name="person-add-alt-1" size={30} color='#fff' style={{marginRight:20}} />
                                <Text style={{fontSize:22, fontWeight:'800', color:'#fff'}}>SIGNUP</Text>
                                </>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => {
                    navigation.navigate('Login')
                }} >
                    <LinearGradient  colors={['#FEDB37', '#FDB931', '#9f7928', '#8A6E2F']} style={styles.button} >
                        <>
                                <Ico name="login" size={30} color='#fff' style={{marginRight:20}} />
                                <Text style={{fontSize:22, fontWeight:'800', color:'#fff'}}>LOGIN</Text>
                        </>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.social} activeOpacity={0.4} onPress={login}>
                    <Image source={require("../../assets/images/fb.png")} style={{width:50, height:50}} />
                    <Text style={{fontSize:16, fontWeight:'600', color:'#000'}}>Signin with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.social} activeOpacity={0.4} onPress={signIn}>
                    <Image source={require("../../assets/images/google.png")} style={{width:40, height:40, padding:5}} />
                    <Text style={{fontSize:16, fontWeight:'600', color:'#000'}}>Signin with Google</Text>
                </TouchableOpacity>
                <View style={{ margin:15}}>
                    <Text style={{color:'white', fontSize:12, textAlign:'center'}}>By using Saralive, you agree to our 
                    <Text style={{textDecorationLine:'underline'}} onPress={ ()=> Linking.openURL('https://sites.google.com/view/termsand/home') }> terms of usage</Text> and 
                    <Text style={{textDecorationLine:'underline'}} onPress={() => {
                        Linking.openURL('https://sites.google.com/view/poplyprivacypolicy/home');
                    }}> Privacy Policy.</Text></Text>
                </View>
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    button:{
        backgroundColor:'#FFD700',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:20,
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
    },
    social:{
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:20,
        marginBottom:20,
        width:'60%',
        alignSelf:'center',
        borderRadius:50,
        alignItems:'center',
        padding:3,
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
export default connect(null, mapDispatchToProps)(Main)
