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
import { API, graphqlOperation, Auth } from "aws-amplify";
import {  Gradient, GradientText } from "../../visualComponents/colors";

import { updateUserChat } from '../../src/graphql/mutations';
import { CustomModal } from '../../visualComponents/customComponents';

const { height, width } = Dimensions.get("window");

const MsgBox = (props) => {
  const [deleteChatModal, setDeleteChatModal] = React.useState(false);
  const [imageUri, setImageUri] = React.useState("http://graph.facebook.com/{user-id}/picture?type=large");
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


  const deleteChat =() => {
    console.log(props.chatID);
    try {
      API.graphql(
        graphqlOperation(updateUserChat, {
          input: { id: props.chatID, status: "Deactive"},
        })
      );
    } catch (error) {
      console.log(error);
    }

  };

  const rightSwipe = (progress, dragX) => {

    const scale = dragX.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    
    return (
        <View style = {{flexDirection: "row", borderRadius: 10, backgroundColor: "#F4F3F3"}}>
            <TouchableOpacity 
              onPress={ () =>{
                setDeleteChatModal(true);
                console.log(deleteChatModal);
                console.log(props.data.id);
              }} 
              activeOpacity = {0.6}
            >
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
                  height: height * 0.11,
                  width: width * 0.96,
                  borderRadius: 10,
                  marginLeft: width * 0.02,
                 marginRight: width * 0.02,
                 marginTop:5,    
            }}>
              
                <View style = {{width: "20%"}}>
                    <Image
                        style = {{resizeMode: "cover", width: width*0.15, height: "100%", borderRadius: 15}}
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


            <CustomModal
				      visible={deleteChatModal}
				      dismiss={() => {
					      setDeleteChatModal(false);
				      }}
			      >
				      <View
					      style={{
                  maxWidth: width* 0.84,
						      backgroundColor: colors.white,
						      borderRadius: 10,
						      alignItems: "center",
						      paddingHorizontal: 36,
					      }}
				      >
					      <TouchableOpacity
						      onPress={() => {
							      setDeleteChatModal(false);
						      }}
						      style={{
							      position: "absolute",
							      alignSelf: "flex-end",
							      padding: 16,
						      }}
					      >
						      <Text style = {{fontSize: 22, color: colors.medium_gray}}>İptal</Text>
					      </TouchableOpacity>
					      <View
						      style={{
							      width: "100%",
							      marginTop: 20,
						      }}
					      >
						      <View
							      style={{
								      flexDirection: "row",
								      width: "100%",
								      alignContent: "center",
                      justifyContent: "center",
								      marginVertical: 10,
							      }}
						      >
                    <Image source={require("../../assets/biggerTrashCan.png")} />	
						      </View>
                  <View
                    style = {{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 10,
                    }}
                  >
                    <Text style = {{ color: colors.black, fontSize: 26, lineHeight: 36,fontFamily: "PoppinsSemiBold", fontWeight: "800"}}>
                      Emin misin ?

                    </Text>

                  </View>
						      <View
                    style = {{
                      flexDirection: "row",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 10,
                    }}
                  >
                    <Text style = {{ color: colors.dark_gray, fontSize: 13, fontFamily: "Poppins", fontWeight: "400", textAlign: "center"}}>
                      Eşleşmeyi kaldırırsan bu kişiyi artık görüntüleyemezsin ve başka bir mesaj atamazsın.

                    </Text>

                </View>
					    </View>
              <TouchableOpacity
					      onPress={deleteChat}
					      style={{
						      maxWidth: "90%",
					      	height: "15%",
						      maxHeight: 60,
						      aspectRatio: 9 / 2,
						      borderRadius: 12,
						      overflow: "hidden",
						      marginTop: 20,
					      }}
			      	>
					      <Gradient
						      style={{
							      justifyContent: "center",
							      alignItems: "center",
							      width: "100%",
							      height: "100%",
						      }}
					      >
						      <Text style={{ color: colors.white, fontSize: 20, fontFamily: "PoppinsSemiBold" }}>
							      Eşleşmeyi Kaldır
						      </Text>
					      </Gradient>
				      </TouchableOpacity>
    		    </View>
			    </CustomModal>
        </View>
    </Swipeable>
  );
};

export default MsgBox;

const styles = StyleSheet.create({
  container: {
    height: height * 0.11,
    width: width,
    
    justifyContent: 'center',
    marginBottom: 3,
    marginTop: 3,
    borderRadius: 10,
  },
  deleteBox: {
    marginTop:5,
    marginBottom:10,
    borderRadius: 10,
    backgroundColor: colors.light_gray,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
});