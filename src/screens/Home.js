import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import { connect } from 'react-redux';
import { API } from '../../api.config';
import Icon from 'react-native-vector-icons/Entypo';
import PerformerCard from '../components/PerformerCard';
import Footer from '../components/Footer';
import axios from 'axios';

const dark= '#10152F';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
const Home = ({navigation, currentUser}) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [performers, setPerformers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    // console.log(currentUser);
    const getPerformersDetails = (listIds) => {
        const list = [];
        listIds.forEach((id) => {
            axios({
                method:'POST',
                url:`https://bengalmarine.in/chat_app/api/v1/performer_details`,
                data:{ user_id : +id}
            }).then((res) => {
                if(res.data.responseCode){
                    list.push(res.data.responseData);
                    setPerformers((prevState) => [...prevState, res.data.responseData]);
                }
            }).catch((err) => {
                console.log(err);
            })
        });
        // setPerformers(list);
    }

    const init = () => {
        const db = getDatabase();
        const paidRef = query(ref(db, 'paidcam'),orderByChild("person2"), equalTo(""));
         return onValue(paidRef, (snapshot) => {
            setLoading(false);
            const perform = [];
            snapshot.forEach((snap) => {
                perform.push(snap.key);
                // console.log(snap.key);
            })
            // console.log(perform);
            if(perform.length!=0){
                getPerformersDetails(perform);
            }
        },{
            onlyOnce:true
        })
    }
    const onRefresh = React.useCallback(() => {
        setPerformers([]);
        init();
      }, []);

    
    
    React.useEffect(() => {
        init();
    },[]);
    // console.log(performers);
    return (
        <View style={{flex:1, backgroundColor:dark}}>
            <View style={{backgroundColor:'#1A224B', borderBottomLeftRadius:50, borderBottomRightRadius:50, marginBottom:20}}>
            <Text style={{color:'#fff', fontWeight:'400', alignSelf:'center', fontSize:20,margin:20}}>ONLINE PERFORMERS</Text>
            </View>
            <ScrollView  refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
            }
            >
            <View style={{flexDirection:'row', justifyContent:'center', marginBottom:100}}>
                <View style={{flexDirection:'row', justifyContent:'flex-start', flexWrap:'wrap' }}>
                {
                    performers.map((p,idx) => (
                        <TouchableOpacity activeOpacity={0.5} key={idx} onPress={() => { navigation.navigate('Performer', { performer:p })}}>
                            <PerformerCard  performer={p} />
                            {/* <PerformerCard h={idx===0 ? true:false} performer={p} /> */}
                        </TouchableOpacity>
                    ))
                }

                 </View>
                 {
                     performers.length===0 && !loading && (
                        <View>
                            <Text style={{textAlign:'center', color:'#fff', fontSize:22, fontWeight:'300'}}>No one is Online...</Text>
                        </View>
                     )
                 }
                {/*<View style={{flexDirection:'column'}}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={() => { navigation.navigate('Performer')}}>
                    <PerformerCard />
                </TouchableOpacity>
                </View> */}
            </View>
            </ScrollView>
            <Footer navigation={navigation} name="discover" />
        </View>
    )
}
const styles = StyleSheet.create({
    
})

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(Home)
