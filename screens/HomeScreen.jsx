import React, { useRef, useState } from 'react'
import { FlatList, Image, StyleSheet, View } from 'react-native'
import ChatMessage from '../components/chatMessage'
import InputSender from "../components/inputSender"
import Loading from '../components/loading'
import Chat from '../components/Chat'
import { fetchResponse } from '../api/gemini'


const HomeScreen = () => {
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(false)
    const [timeStamp, setTimeStamp] = useState('')
    const [chat, setChat] = useState([])
    const flatListRef = useRef(null)
    const handleInput = (text) => {
        setInputText(text)
    }
    const handleMessage = () => {
        const newTimeStamp = Date.now()
        let newMsg = {
            role: 'user',
            message: inputText,
            timeStamp: newTimeStamp
        }
        setChat(prevChat => [...prevChat, newMsg])
        setInputText('')
        setTimeStamp(newTimeStamp)
        flatListRef?.current?.scrollToEnd({ animated: true });
        fetchData(newMsg.message, setLoading)
    }
    const formatText = (text) => {
        return text.replace(/\*\*\g/, '')
    }
    const fetchData = async (prompt, setLoading) => {
        const response = await fetchResponse(prompt, setLoading);
        const formattedText = formatText(response)
        if (response) {
            let modelMsg = {
                role: 'model',
                message: formattedText,
            }
            setChat(prevChat => [...prevChat, modelMsg])
        }
    }
    return (
        <View style={{ paddingHorizontal: 5, flex: 1 }}>
            {
                chat.length > 0 ? (
                    <FlatList
                        ref={flatListRef}
                        showsVerticalScrollIndicator={false}
                        data={chat}
                        renderItem={({ item }) => {
                            return <Chat data={item} loading={loading} timeStamp={timeStamp} />
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.chatScreen}
                        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                    />
                ) : (
                    <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../assets/gemini.png')} resizeMode='contain' style={{ height: 100, width: 100 }} />
                    </View>
                )
            }
            <View style={{ justifyContent: "flex-end" }}>
                <InputSender onChange={handleInput} text={inputText} onPress={handleMessage} />
            </View>
        </View>

    )
}

export default HomeScreen

const styles = StyleSheet.create({
    chatScreen: {
        flexGrow: 1,
        justifyContent: 'flex-end'
    }
})