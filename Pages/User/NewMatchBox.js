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

const { height, width } = Dimensions.get("window");

const NewMatchBox = (props) => {
    return (
      <View>
        <TouchableOpacity
        onPress={props.openChat} 
        style = {{
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "space-evenly",
                backgroundColor: colors.white,
                height: height * 0.11,
                width: width * 0.15,
            }}>
          <Image
            style = {{resizeMode: "contain", width: "100%", height: "100%", borderRadius: 30}}
            source = {{
              uri: "https://m.media-amazon.com/images/M/MV5BMTg0MzkzMTQtNWRlZS00MGU2LTgwYTktMjkyNTZkZTAzNTQ3XkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_FMjpg_UY720_.jpg"
            }}
          />
        </TouchableOpacity>
  
      </View>
    );
  };
  
  export default NewMatchBox;