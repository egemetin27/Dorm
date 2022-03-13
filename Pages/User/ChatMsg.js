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

const { height, width } = Dimensions.get("window");

const ChatMsg = (props) => {
  const isMyMessage = () => {
    return props.data.sentMsgSenderId == props.myUserID;
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.messageBox, {
          backgroundColor: isMyMessage() ? '#DCF8C5' : 'white',
          marginLeft: isMyMessage() ? 50 : 0,
          marginRight: isMyMessage() ? 0 : 50,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: isMyMessage() ? 20 : 0,
          borderBottomRightRadius: isMyMessage() ? 0 : 20,
        }
      ]}>
        {!isMyMessage() && <Text style={styles.name}>{props.data.sender.name}</Text>}
        <Text style={styles.message}>{props.data.text}</Text>
        <Text style={styles.time}>{moment(props.data.updatedAt).fromNow()}</Text>
      </View>
    </View>
  )
}

export default ChatMsg;


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
  },
  name: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {

  },
  time: {
    alignSelf: "flex-end",
    color: 'grey'
  }
});