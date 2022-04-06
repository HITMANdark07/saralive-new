import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const InputText = ({icon, placeholder,type, name, handleChange,value, password }) => {

    return (
        <View style={styles.input}>
            <Icon name={icon} style={styles.icon} size={30} color="#fff" />
            {type ? 
            (<TextInput placeholderTextColor='#fff' style={{flex:1, color:'#fff'}} value={value} autoCapitalize='none'  onChangeText={(e) => handleChange(name, e)} placeholder={placeholder} keyboardType={type} />)
            :
            (<TextInput placeholderTextColor='#fff' style={{flex:1, color:'#fff'}} value={value} autoCapitalize='none' onChangeText={(e) => handleChange(name, e)} placeholder={placeholder} secureTextEntry={password} />)
            }
        </View>
    )
};

const styles = StyleSheet.create({
    input:{
        flexDirection:'row', 
        justifyContent:'center', 
        color:'#fff',
        alignItems:'center',
        borderColor:'#fff',
        borderWidth:0.5,
        borderRadius:50,
        marginTop:10, 
        marginBottom:10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    icon:{
        padding:6,
        borderRadius:50
    }
})

export default InputText;
