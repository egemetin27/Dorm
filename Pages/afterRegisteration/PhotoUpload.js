import React from "react";
import { Text, View, Image, Dimensions, Pressable, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";

import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
import axios from "axios";
import { url } from "../../connection";

const { width, height } = Dimensions.get("screen");

export default function PhotoUpload({ navigation, route }) {
	const { userID, email, password } = route.params;

	const [photoList, setPhotoList] = React.useState([]);

	const pickImage = async () => {
		// const [status, reqPermission] = ImagePicker.getMediaLibraryPermissions();

		// console.log({ status });
		// console.log({ reqPermission });

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [2, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			handleAdd(result);
		}
	};

	const handleAdd = (result) => {
		axios
			.get(url + "/SecurePhotoLink")
			.then((res) => {
				const uploadUrl = res.data.url;

				fetch(uploadUrl, {
					method: "PUT",
					body: result,
					headers: {
						Accept: "application/json",
						"Content-Type": "multipart/form-data",
					},
				}).then((res) => {
					if (res.ok) {
						const photoLink = uploadUrl.split("?")[0];
						setPhotoList([...photoList, photoLink]);
					} else {
						console.log("ERROR UPLOADING IMAGE");
					}
				});
			})
			.catch((error) => {
				console.log({ error });
			});
	};

	const handleSubmit = () => {
		navigation.replace("Hobbies", { userID: userID, email: email, password: password });
	};

	return (
		<View style={commonStyles.Container}>
			<View style={[commonStyles.Header, { paddingHorizontal: 30, justifyContent: "flex-end" }]}>
				<TouchableOpacity onPress={handleSubmit}>
					<Text style={{ color: colors.medium_gray, fontSize: 18 }}>İleri</Text>
				</TouchableOpacity>
			</View>
			<View style={{ paddingHorizontal: 30, marginTop: 20 }}>
				<GradientText
					text={"En güzel fotoğraflarım"}
					style={{ fontSize: 30, fontWeight: "bold" }}
				/>
				<Text
					style={{
						fontSize: 18,
						color: colors.medium_gray,
						marginTop: 20,
						lineHeight: 27,
						letterSpacing: 0.5,
					}}
				>
					Kendi fotoğraflarını ekle, görmek{"\n"}istediğimiz kişi sensin. :{")"}
				</Text>
			</View>
			<View style={{ height: "100%", width: "100%", alignItems: "center" }}>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					style={{ height: "100%", marginTop: 20 }}
					// snapToInterval={width * 0.8 + 30}
				>
					{photoList.map((item, index) => {
						return (
							<View key={index} style={{ height: "100%" }}>
								<View
									style={[
										commonStyles.photo,
										{
											width: width * 0.8,
											maxHeight: "90%",
										},
									]}
								>
									<Image
										source={{ uri: item }}
										style={{ height: "100%", width: "100%" }}
										resizeMode="contain"
									/>
								</View>
							</View>
						);
					})}
					{photoList.length < 4 && (
						<Pressable onPress={pickImage} style={{ height: "100%" }}>
							<View
								style={[
									commonStyles.photo,
									{
										width: width * 0.8,
										maxHeight: "90%",
									},
								]}
							>
								<Feather name="plus" size={width / 8} color={colors.gray} />
							</View>
						</Pressable>
					)}
				</ScrollView>
			</View>
		</View>
	);
}
