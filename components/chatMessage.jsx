import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import * as Speech from "expo-speech"
import Icon from 'react-native-vector-icons/Ionicons'

const ChatMessage = ({ messageData, role, type }) => {
    //this function is used for handling speech
    const handleSpeech = async () => {
        //if alreading speaking stop and speack the data
        if (await Speech.isSpeakingAsync()) {
            Speech.stop();
        }
        else {
            Speech.speak(messageData.message)
        }
    }
    //here this function is used to remove ** and return as bold
    const renderBoldText = (text) => {
        const parts = text.split('**');
        return parts.map((part, index) => {
            return index % 2 === 0 ? (
                <Text key={index}>{part}</Text>
            ) : (
                <Text key={index} style={styles.boldText}>
                    {part}
                </Text>
            );
        });
    };
    const date = new Date()
    const hours = date.getHours()
    const min = date.getMinutes()
    const formattedTime = `${hours}:${min}`

    //the above functions for time
    return (
        //based on conditions rendering differnt items like if role is user userchat style or modelchat style
        //mic icon is only need to show on model role
        //we render two components one is image and text component based on type
        <>
            {
                type == "text" ? (
                    <View style={[styles.chatbubble, role === 'user' ? styles.userChat : styles.modelChat, { height: 'auto' }]}>
                        <Text style={[styles.chat, { color: 'white' }]}>{renderBoldText(messageData.message)}</Text>
                        {
                            role == 'user' && <Text style={styles.date}>{formattedTime}</Text>
                        }
                        {
                            role == 'model' && <TouchableOpacity style={{ alignItems: 'flex-end', padding: 5 }} onPress={handleSpeech}><Icon name='volume-medium' size={18} color={'white'} /></TouchableOpacity>
                        }
                    </View>
                ) :
                    (
                        <View style={[styles.chatbubble, styles.userChat, { height: 'auto', gap: 4 }]}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={{ uri: messageData.image }}
                                    resizeMode='cover'
                                    style={{ height: 200, width: 200, borderRadius: 4 }}
                                />
                            </View>
                            <View>
                                <Text style={[styles.chat, { color: 'white' }]}>{messageData.message}</Text>
                                {
                                    role == 'user' && <Text style={styles.date}>{formattedTime}</Text>
                                }
                            </View>
                        </View>
                    )
            }
        </>
    )
}

export default ChatMessage

const styles = StyleSheet.create({
    chatbubble: {
        marginBottom: 16,
        marginHorizontal: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#537836',
        maxWidth: '72%',
        justifyContent: 'center',
        minWidth: '23%',
    },
    chat: {
        fontFamily: 'DmSans',
        fontSize: 16
    },
    userChat: {
        alignSelf: 'flex-end'
    },
    modelChat: {
        alignSelf: "flex-start",
        backgroundColor: '#2F2F2F'
    },
    date: {
        fontFamily: 'Poppins',
        fontSize: 10,
        alignSelf: 'flex-end',
        color: 'white'
    },
    boldText: {
        fontWeight: 'bold'
    }
})