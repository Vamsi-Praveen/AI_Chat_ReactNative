import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Speech from "expo-speech"
import Icon from 'react-native-vector-icons/Ionicons'

const ChatMessage = ({ messageData, role }) => {
    const handleSpeech = async () => {
        if (await Speech.isSpeakingAsync()) {
            Speech.stop();
        }
        else {
            Speech.speak(messageData)
        }
    }
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
    return (
        <>
            <View style={[styles.chatbubble, role === 'user' ? styles.userChat : styles.modelChat, { height: 'auto' }]}>
                <Text style={[styles.chat, role === 'model' && { color: 'white' }]}>{renderBoldText(messageData)}</Text>
                {
                    role == 'user' && <Text style={styles.date}>{formattedTime}</Text>
                }
                {
                    role == 'model' && <TouchableOpacity style={{ alignItems: 'flex-end', padding: 5 }} onPress={handleSpeech}><Icon name='volume-medium' size={18} color={'white'} /></TouchableOpacity>
                }
            </View>
        </>
    )
}

export default ChatMessage

const styles = StyleSheet.create({
    chatbubble: {
        marginBottom: 10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: 'lightblue',
        maxWidth: '70%',
        justifyContent: 'center',
        minWidth: '10%',
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
        alignSelf: 'flex-end'
    },
    boldText: {
        fontWeight: 'bold'
    }
})