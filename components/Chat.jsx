import React from 'react'
import { View } from 'react-native'
import ChatMessage from './chatMessage'
import Loading from './loading'

const Chat = ({ data, loading, timeStamp }) => {
    return (
        <View>
            <ChatMessage messageData={data.message} role={data.role} />
            {loading && data.timeStamp === timeStamp && <Loading />}
        </View>
    )
}

export default Chat