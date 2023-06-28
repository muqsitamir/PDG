import React, {useState} from 'react';
import {View, Text, Button, Image, TextInput, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';


export const App = () => {
  const [url, setUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('FaceNet');
  const [selectedWeights, setSelectedWeights] = useState('best3');
  const [imageUri, setImageUri] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);


  const showImagePicker = async () => {
      setErrorMsg("")
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        setImageUri(result.uri);
        }
  }


  const uploadImage = () => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    // formData.append("file", imageUri);

   const headers = {
    'ngrok-skip-browser-warning': 102,
     "Content-Type": "multipart/form-data",
    };


    setImageUri("")
    setErrorMsg("Give me a sec :)")
    let str = ""
    if (selectedModel == 'YOLOv8'){
      str = `&weights=${selectedWeights}`
    }

    axios.post(`https://${url}/?model=${selectedModel}${str}`, formData, {headers}).then(response => {
      // handle response
      setImageUri(`https://${url}/image/${response.data}?model=${selectedModel}`);
      setErrorMsg("")
    }).catch(error => {
      if(url == ''){
        setErrorMsg("Please enter the URL first")
      }
      else if(url.includes("http")){
        setErrorMsg("Remove http:// from the URL")
      }
      else{
        setErrorMsg(error.message)
      }
    });
  };

  // @ts-ignore
    return (
    <View style={styles.container}>
      {imageUri !== "" ? <Image style={styles.image} source={{ uri: imageUri }} /> : null}
      <Text style={styles.title}>Prettiest Girl Detector</Text>
      {errorMsg ? <Text style={styles.title}>{errorMsg}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button title="Choose Image" onPress={showImagePicker}/>
        <View style={styles.spacer} />
        <Button title="Upload Image" onPress={uploadImage} disabled={imageUri==""} />
      </View>
      <View style={{padding: 10}}>
      <TextInput
        style={{height: 40, marginTop: 120, marginBottom: 40}}
        placeholder="Type URL here"
        onChangeText={newText => setUrl(newText)}
      />
      <View>
        <Text style={{marginLeft: -35}}>Select a model below: </Text>
        <Picker
          style={{width: 150}}
          selectedValue={selectedModel}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedModel(itemValue)
          }>
          <Picker.Item label="YOLOv8" value="YOLOv8" />
          <Picker.Item label="FaceNet" value="FaceNet" />
        </Picker>
      </View>
        {selectedModel == 'YOLOv8' ?
      <View>
        <Text style={{marginLeft: -35}}>Select the weights</Text>
        <Picker
          style={{width: 150}}
          selectedValue={selectedWeights}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedWeights(itemValue)
          }>
          <Picker.Item label="1st iter: 0.94 mAP" value="best2" />
          <Picker.Item label="2nd iter: 0.91 mAP" value="best3" />
          <Picker.Item label="3rd iter with Augmented Data: 0.74 mAP (only 100 epochs)" value="best_last" />
        </Picker>
      </View>: null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0FFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginVertical: 20,
  },
  spacer: {
    width: 20,
  },
});

export default App;
