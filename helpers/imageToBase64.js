import * as FileSystem from 'expo-file-system';

export const imageToBase64 = async (image) => {
    try {
        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: FileSystem.EncodingType.Base64
        })
        return base64;
    } catch (error) {
        console.log('Error while converting to base 64', error)
    }
}