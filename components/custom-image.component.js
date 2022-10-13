import { Fragment } from "react";
import { Image } from "react-native";
import FastImage from "react-native-fast-image";

const CustomImage = ({ style, url, ...props }) => {
	return (
		<Fragment>
			{__DEV__ ? (
				<Image
					{...props}
					style={style}
					blurRadius={props.blur == 1 ? 36 : 0}
					source={{
						uri: url,
					}}
				/>
			) : (
				<FastImage
					{...props}
					key={url}
					style={style}
					source={{
						uri: url,
						priority: FastImage.priority.high,
					}}
				/>
			)}
		</Fragment>
	);
};

export default CustomImage;
