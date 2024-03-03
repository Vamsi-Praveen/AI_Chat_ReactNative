import React from 'react'
import { View } from 'react-native'
import ChatMessage from './chatMessage'
import Loading from './loading'

const Chat = ({ data, loading, timeStamp }) => {
    return (
        <View>
            <ChatMessage messageData={data} role={data.role} type={data.type} />
            {loading && data.timeStamp === timeStamp && <Loading />}
        </View>
    )
}

export default Chat