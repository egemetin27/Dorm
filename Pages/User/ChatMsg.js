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

// Yeni schemalara göre tekrardan yazilacak.
const ChatMsg = (props) => {
  return (
        <View style={styles.container}>
          
        </View>
  );
};

export default ChatMsg;

const styles = StyleSheet.create({
  container: {
    height: 80,
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
    width: 80,
    height: 80,
  },
});