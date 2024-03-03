import React from 'react'
import { View } from 'react-native'
import ChatMessage from './chatMessage'
import Loading from './loading'

const Chat = ({ data, loading, timeStamp }) => {
    return (

        //wrapping the chat message and specify type to identify whether it is text input or image input
        //timestamp is used to specify the current msg only need to show loading
        <View>
            <ChatMessage messageData={data} role={data.role} type={data.type} />
            {loading && data.timeStamp === timeStamp && <Loading />}
        </View>
    )
}

export default Chat