import React from 'react'
import { StyleSheet, View } from 'react-native'

const Loading = () => {
    //simple loading with three dots
    return (
        <View style={styles.loadContainer}>
            <View style={[styles.loader]} />
            <View style={[styles.loader]} />
            <View style={[styles.loader]} />

        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    loadContainer: {
        width: 50,
        height: 30,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 3,
        margin: 10
    },
    loader: {
        width: 8,
        height: 8,
        backgroundColor: 'grey',
        borderRadius: 100
    },
})