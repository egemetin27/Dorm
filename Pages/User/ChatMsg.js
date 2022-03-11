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
  return (
        <View style={styles.container}>
            <TouchableOpacity 
              
              onPress={props.openChat}
              style = {{
                  flexDirection: "row",
                  alignItems: "stretch",
                  justifyContent: "space-evenly",
                  backgroundColor: colors.white,
                  height: 80,
                  width: width * 0.96,
                  borderRadius: 10,
                  marginLeft: width * 0.02,
                 marginRight: width * 0.02,
                 marginTop:5,    
            }}>
                <View style = {{width: "20%"}}>
                    <Image
                        style = {{resizeMode: "contain", width: "100%", height: "90%", borderRadius: 30}}
                        source = {{
                            uri: props.data.img
                        }}
                    />
                </View>
                
                <View style = {{flexDirection: "column", width: "55%", marginLeft: 10,justifyContent: "space-between"}}>
                    <Text style = {{fontSize: 18, marginTop: 10}}>
                        {props.data.name}
                    </Text>
                    <Text style = {{fontSize: 14, marginBottom: 10}}>
                        {props.data.Message}
                    </Text>
                </View>
                <View style = {{width: "25%", alignItems: "flex-end", marginRight: 5}}>
                    <Text style = {{marginBottom: height*0.08, marginRight: 5, fontSize: 16}}>
                      {props.data && moment(props.data.lasttime).format("LT")
                      
                      }
                    </Text>
                </View>
               
                
            </TouchableOpacity>
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