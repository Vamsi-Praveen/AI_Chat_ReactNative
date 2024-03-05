import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { fetchImageResponse, fetchResponse } from '../api/gemini'
import Chat from '../components/Chat'
import InputSender from "../components/inputSender"
import * as DocumentPicker from 'expo-document-picker';
import Icon from "react-native-vector-icons/Ionicons"
import { imageToBase64 } from '../helpers/imageToBase64'


const HomeScreen = () => {

    //states for all required things
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(false)
    const [timeStamp, setTimeStamp] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [sendingImage, setSendingImage] = useState(false)
    const [chat, setChat] = useState([])
    const [base64, setBase64] = useState(null)
    const [mimeType, setMimeType] = useState(null)
    const flatListRef = useRef(null)

    //checking for errors
    const [error, setError] = useState(false)



    //if error there need to show toast

    useEffect(() => {
        if (error) {
            ToastAndroid.show('An Error Occured', ToastAndroid.BOTTOM, ToastAndroid.SHORT);
            setError(false)
        }
    }, [error])
    //whenever user is typing it is sending to setInputText function
    const handleInput = (text) => {
        setInputText(text)
    }
    //sending text message 
    const handleMessage = () => {
        //creating a time stamp for comapring the new message time
        const newTimeStamp = Date.now()
        //creating a newmsg with type text and role user
        let newMsg = {
            role: 'user',
            message: inputText,
            timeStamp: newTimeStamp,
            type: 'text'
        }
        //appending the new message to chat array
        setChat(prevChat => [...prevChat, newMsg])
        setInputText('')
        setTimeStamp(newTimeStamp)
        //auto scroll to down of the flatlist using reference
        flatListRef?.current?.scrollToEnd({ animated: true });
        //function responsible  for sendimg an text if any
        fetchData(newMsg.message, setLoading, setError)
    }
    const handleSendImage = () => {
        //this is the function for sending the images
        const newTimeStamp = Date.now()
        //creating an object with role user and type image and specify the image
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
        //after sending the image need to set the image to null as it takes for next message also
        setSelectedImage(null)
        //this is typeof image data for gemini ai generative part
        const image = {
            inlineData: {
                data: base64,
                mimeType: mimeType
            }
        }
        //the function responsible for sending the request with image
        fetchImageData(image, newMsg.message, setLoading, setError)
        //after the execution completd need to set image sending to false as it interputs the next message
        setSendingImage(false)
        flatListRef?.current?.scrollToEnd({ animated: true });
    }
    // const formatText = (text) => {
    //     //this function is respoinsble for removal of **'s from response
    //     return text.replace(/\*\*\g/, '')
    // }
    const fetchData = async (prompt, setLoading, setError) => {
        const response = await fetchResponse(prompt, setLoading, setError);
        // const formattedText = formatText(response)
        if (response) {
            //creating a ouput as chat object inserting to chat []
            let modelMsg = {
                role: 'model',
                message: response,
                type: 'text'
            }
            setChat(prevChat => [...prevChat, modelMsg])
        }
    }
    //the function call for sending requues to backend function for images
    const fetchImageData = async (image, prompt, setLoading, setError) => {
        const response = await fetchImageResponse(image, prompt, setLoading, setError)
        // const formattedText = formatText(response)
        if (response) {
            let modelMsg = {
                role: 'model',
                message: response,
                type: 'text'
            }
            setChat(prevChat => [...prevChat, modelMsg])
        }
    }
    //when click on the image icon need to open library to select the images by expo-document-picker library
    const openDocument = async () => {
        try {
            const image = await DocumentPicker.getDocumentAsync({
                type: 'image/*'
            })
            //selecting the documents of type images
            if (image) {
                setMimeType(image?.assets?.[0]?.mimeType)
            }
            //if image is fetched succesfully we need to take uri and store for displaying on chatui
            if (image?.assets[0]?.uri) {
                setSelectedImage(image?.assets?.[0]?.uri)
                setSendingImage(true)
                //converting the image to base64 for processing
                setBase64(await imageToBase64(image?.assets?.[0]?.uri))
            }
        } catch (err) {
            console.log(err)
        }
    }
    //checking on condition if sending textmessage send handlemessage otherwise handleimage handler
    const onPress = sendingImage ? handleSendImage : handleMessage
    return (
        //onContentSizeChange and onlayout is used here for autoscroll to bottom
        <View style={{ paddingHorizontal: 5, flex: 1, backgroundColor: 'white' }}>
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

                    <TouchableOpacity onPress={() => { setSelectedImage(null), setBase64(null) }} style={{ position: 'absolute', top: 0, right: 0, padding: 5 }}>
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