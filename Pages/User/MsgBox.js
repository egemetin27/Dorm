import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { colors } from '../../visualComponents/colors';
import moment from "moment";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { url } from "../../connection";

const { height, width } = Dimensions.get("window");

const MsgBox = (props) => {
  const [imageUri, setImageUri] = React.useState();
  const [myID, setMyID] = React.useState();

  const fetchImageUri = async () => {
		try {
			let abortController = new AbortController();
			const userDataStr = await SecureStore.getItemAsync("userData");
			const userData = JSON.parse(userDataStr);
      setMyID(userData.UserId.toString());
			const myToken = userData.sesToken;
			await axios
				.post(
					url + "/getProfilePic",
					{ UserId: props.data.id },
					{ headers: { "access-token": myToken } }
				)
				.then((res) => {
					//setPeopleList(res.data);
					console.log(res.data);
					setImageUri(res.data[0].PhotoLink);
					
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (e) {
			console.log(e);
		}
	};

  React.useEffect(async () => {
		/*
		console.log("+++++++++++++++++++++++++++");
		console.log(otherUser);
		console.log("+++++++++++++++++++++++++++");
		*/
		await fetchImageUri();
	}, []);

  const rightSwipe = (progress, dragX) => {

    const scale = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    
    return (
        <View style = {{flexDirection: "row", borderRadius: 10, backgroundColor: "#F4F3F3"}}>
            <TouchableOpacity onPress={props.handleDelete} activeOpacity = {0.6}>
                <View style={styles.deleteBox}>
                    <Animated.Image style={{transform: [{scale: scale}]}} source = {require("../../assets/Union.png")}>
                    </Animated.Image>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.handleDelete} activeOpacity = {0.6}>
                <View style={styles.deleteBox}>
                <Animated.Image style={{transform: [{scale: scale}]}} source = {require("../../assets/trashCan.png")}>
                    </Animated.Image>
                </View>
            </TouchableOpacity>
            

        </View>
    );
  };
  return (
    <Swipeable renderRightActions={rightSwipe}>
        <View style={styles.container}>
            <TouchableOpacity 
              
              onPress={props.openChat}
              style = {{
                  flexDirection: "row",
                  alignItems: "stretch",
                  justifyContent: "space-evenly",
                  backgroundColor: colors.white,
                  height: 60,
                  width: width * 0.96,
                  borderRadius: 10,
                  marginLeft: width * 0.02,
                 marginRight: width * 0.02,
                 marginTop:5,    
            }}>
                <View style = {{width: "20%"}}>
                    <Image
                        style = {{resizeMode: "contain", width: "100%", height: "100%", borderRadius: 40}}
                        source = {{
                            uri: imageUri,
                        }}
                    />
                </View>
                
                <View style = {{flexDirection: "column", width: "55%", marginLeft: 10,justifyContent: "space-between"}}>
                    <Text style = {{fontSize: 18, marginTop: 10}}>
                      {props.data.name}
                    </Text>
                    <Text numberOfLines={1} style = {{fontSize: 14, marginBottom: 10}}>
                      {props.lastMsg}
                    </Text>
                </View>
                <View style = {{width: "25%", alignItems: "flex-end", marginRight: 5}}>
                    <Text style = {{marginBottom: height*0.02, marginRight: 5, fontSize: 14}}>
                      {
                        moment(props.lastTime).format("DD/MM/YYYY")
                      }
                    </Text>
                </View>
               
                
            </TouchableOpacity>
        </View>
    </Swipeable>
  );
};

export default MsgBox;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: width,
    
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 10,
  },
  deleteBox: {
    backgroundColor: colors.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
});