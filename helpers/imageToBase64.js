import * as FileSystem from 'expo-file-system';

export const imageToBase64 = async (image) => {

    //here we are using the file system module from expo it uses the local spp filesystem and it is different from app to app
    try {
        //reading the string and convert to base64 encoding type
        const base64 = await FileSystem.readAsStringAsync(image, {
            encoding: FileSystem.EncodingType.Base64
        })
        return base64;
    } catch (error) {
        console.log('Error while converting to base 64', error)
    }
}