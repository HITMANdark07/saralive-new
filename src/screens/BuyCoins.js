import React, {useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {API} from '../../api.config';
import Icon from 'react-native-vector-icons/Ionicons';
import Ico from 'react-native-vector-icons/AntDesign';
import Ic from 'react-native-vector-icons/FontAwesome5';
import RazorpayCheckout from 'react-native-razorpay';
import logo from '../../assets/logo.png';
import axios from 'axios';

const dark = '#10152F';

const BuyCoins = ({navigation, currentUser, route}) => {

//   const [messages, setMessages] = React.useState([]);
//   const [message, setMessage] = React.useState('');
  const scrollRef = useRef();
  const coinsData = [
      100,300,500,1000,2000
  ]

  const ShowCoinBuy = ({coin}) => {
      return (
        <LinearGradient
        colors={['#A020F0', '#FF00FF']}
        style={styles.coins}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 1}}>
        <View
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{padding: 20}}>
            <Ic name="coins" color="#FFFF00" size={50} />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              flex: 1,
              marginTop: 10,
              marginBottom: 10,
            }}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '800'}}>
              {coin} COINS
            </Text>
          </View>
          <View style={{padding: 20, justifyContent: 'center'}}>
            <Ic name="chevron-right" size={30} color="#fff" />
          </View>
        </View>
      </LinearGradient>
      )
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
            navigation.navigate('Me');
          }}
          style={{margin: 20, marginRight: 0}}>
          <Icon name="chevron-back-outline" color={'#fff'} size={30} />
        </TouchableOpacity>
        <Text
          style={{
            color: '#fff',
            fontWeight: '400',
            alignSelf: 'center',
            fontSize: 18,
            margin: 20,
            marginLeft: 35,
          }}>
              BUY COINS
        </Text>
      </View>
      <ScrollView style={{flex: 1}} ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}>
        <View style={{display: 'flex', flexDirection: 'column'}}>
            
        {
            coinsData.map((c,i)=>(
                <TouchableOpacity key={i} onPress={() => {
                    var options = {
                        description: 'Poply Payments',
                        image: 'https://cdn3.iconfinder.com/data/icons/basic-user-interface-application/32/INSTAGRAM_ICON_SETS-35-512.png',
                        currency: 'INR',
                        key: 'rzp_test_wZWQUchj1aBsfY',
                        amount: parseInt((c*100*100)/70),
                        name: 'Poply',
                        //order_id: 'order_DslnoIgkIDL8Zt',//Replace this with an order_id created using Orders API.
                        prefill: {
                          email: currentUser.email,
                          contact: currentUser.telephone,
                          name: currentUser.name
                        },
                        theme: {color: '#10152F'}
                      }

                      RazorpayCheckout.open(options).then((data) => {
                        // handle success

                        axios({
                            method:'POST',
                            url:`${API}/customer_wallet_recharge`,
                            data:{
                                customer_id:currentUser.user_id,
                                paymode:1,
                                transaction_details:data.razorpay_payment_id,
                                amount:c
                            }
                        }).then((res) => {
                            ToastAndroid.showWithGravity(res.data.responseText,ToastAndroid.CENTER,ToastAndroid.LONG);
                        }).catch((err) => {
                            console.log(err);
                        })
                        console.log(`Success: ${data.razorpay_payment_id}`);
                      }).catch((error) => {
                        // handle failure
                        console.warn(`Error: ${error.code} | ${error.description}`);
                      });
                }}>
                <ShowCoinBuy coin={c} />
                </TouchableOpacity>
            ))
        }

            
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
    coins: {
        justifyContent: 'center',
        width: '90%',
        marginBottom:20,
        borderRadius: 50,
        alignSelf: 'center',
        shadowColor: '#fff',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
      },
});

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(BuyCoins);
