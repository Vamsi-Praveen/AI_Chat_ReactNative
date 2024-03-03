import React, { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from "react-native-vector-icons/Feather"

const InputSender = ({ onChange, text, onPress, openDocument }) => {
    const [inputHeight, setInputHeight] = useState(30)
    const handleInputHeight = (contentWidth, contentHeight) => {
        const minHeight = 30; // Set a minimum height
        const maxHeight = 90; // Set a maximum height
        const newHeight = Math.max(minHeight, Math.min(maxHeight, contentHeight));
        if (newHeight !== inputHeight) {
            setInputHeight(newHeight);
        }
    }
    return (
        <View style={styles.inputContainer}>
            <TextInput placeholder='Type Your Query Here...' style={[styles.input, { height: inputHeight }]} onChangeText={onChange}
                value={text} multiline onContentSizeChange={(e) => handleInputHeight(e.nativeEvent.contentSize.width, e.nativeEvent.contentSize.height)}
            />
            <TouchableOpacity style={styles.button} onPress={openDocument}>
                <Icon name='image' size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} disabled={text === ''} onPress={onPress}>
                <Icon name='send' size={22} color={text == '' ? 'lightgrey' : 'black'} style={{ transform: [{ rotate: '40deg' }] }} />
            </TouchableOpacity>
        </View>
    )
}

export default InputSender

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        justifyContent: 'space-between',
        borderTopColor: 'lightgrey',
        borderTopWidth: 0.3
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        fontSize: 16,
        fontFamily: 'DmSans',
        letterSpacing: 0.5
    },
    button: {
        padding: 10
    }
})