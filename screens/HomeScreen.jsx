import React, { useRef, useState } from 'react'
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { fetchResponse } from '../api/gemini'
import Chat from '../components/Chat'
import InputSender from "../components/inputSender"
import * as DocumentPicker from 'expo-document-picker';
import Icon from "react-native-vector-icons/Ionicons"


const HomeScreen = () => {
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(false)
    const [timeStamp, setTimeStamp] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [sendingImage, setSendingImage] = useState(false)
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
            timeStamp: newTimeStamp,
            type: 'text'
        }
        setChat(prevChat => [...prevChat, newMsg])
        setInputText('')
        setTimeStamp(newTimeStamp)
        flatListRef?.current?.scrollToEnd({ animated: true });
        // fetchData(newMsg.message, setLoading)
    }
    const handleSendImage = () => {
        const newTimeStamp = Date.now()
        let newMsg = {
            role: 'user',
            message: inputText,
            type: 'image',
            timeStamp: newTimeStamp,
            image: selectedImage
        }
        setChat(prevChat => [...prevChat, newMsg])
        setInputText('')
        setTimeStamp(newTimeStamp)
        flatListRef?.current?.scrollToEnd({ animated: true });
        setSelectedImage(null)
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
                type: 'text'
            }
            setChat(prevChat => [...prevChat, modelMsg])
        }
    }
    const openDocument = async () => {
        try {
            const image = await DocumentPicker.getDocumentAsync({
                type: 'image/*'
            })
            if (image.assets[0].uri) {
                setSelectedImage(image.assets[0].uri)
                setSendingImage(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onPress = sendingImage ? handleSendImage : handleMessage
    return (
        <View style={{ paddingHorizontal: 5, flex: 1 }}>
            {
                chat.length > 0 && <View style={{
                    alignItems: 'center', justifyContent: 'center', paddingVertical: 4
                }}>
                    <Image source={require('../assets/gemini.png')} resizeMode='contain' style={{ height: 40, width: 40 }} />
                </View>
            }
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
            {
                selectedImage && <View style={{ margin: 8 }}>
                    <Image source={{ uri: selectedImage }} style={{ height: 60, width: 60, position: 'relative' }} />

                    <TouchableOpacity onPress={() => setSelectedImage(null)} style={{ position: 'absolute', top: 0, right: 0, padding: 5 }}>
                        <Icon name='close' size={18} />
                    </TouchableOpacity>
                </View>
            }
            <View style={{ justifyContent: "flex-end" }}>
                <InputSender onChange={handleInput} text={inputText} onPress={onPress} openDocument={openDocument} />
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