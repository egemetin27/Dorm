import { StatusBar } from "expo-status-bar";
import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Animated,
	Pressable,
	Dimensions,
	Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { Gradient, colors } from "../../visualComponents/colors";
import { url } from "../../connection";
import { getAge } from "../../nonVisualComponents/generalFunctions";

const { width, height } = Dimensions.get("window");

export default function Register({ navigation }) {
	const animRef1 = React.useRef(new Animated.Value(0)).current;
	const animRef2 = React.useRef(new Animated.Value(0)).current;
	const animRef3 = React.useRef(new Animated.Value(0)).current;
	const animRef4 = React.useRef(new Animated.Value(0)).current;
	const animRefProgress = React.useRef(new Animated.Value(0)).current;
	const refList = [animRef1, animRef2, animRef3, animRef4];

	const [name, setName] = React.useState("");
	const [date, setDate] = React.useState(new Date());
	const [parsedDate, setParsedDate] = React.useState("");
	const [city, setCity] = React.useState("İstanbul");
	const [university, setUniversity] = React.useState("");
	const [email, setEmail] = React.useState("");

	const [show, setShow] = React.useState(false);

	const [counter, counterChanger] = React.useState(0);

	// const pickerRef = React.useRef().current;

	const emailRegex = /^[\w-\.]+@([\w-]+\.)edu(\.[\w-]{2,4})?/;

	const handleRegister = async () => {
		const lName = name.slice(name.lastIndexOf(" ") + 1);
		const fName = name.slice(0, name.lastIndexOf(" "));

		if (
			emailRegex.test(email) &&
			fName != "" &&
			lName != "" &&
			parsedDate != "" &&
			university != "" &&
			getAge(parsedDate) >= 18
		) {
			const profile = {
				mail: email,
				name: fName,
				surName: lName,
				city: city,
				// bDay: date,
				bDay: parsedDate,
				school: university,
			};

			axios
				.post(url + "/register", profile)
				.then(async (res) => {
					await axios
						.post(url + "/SendVerification", { Mail: email })
						.then(() => {
							navigation.replace("Verification", { ...res.data, email: email });
						})
						.catch((error) => {
							console.log("verification error: ", error);
						});
				})
				.catch((error) => {
					console.log("register error: ", error);
				});
		} else {
			if (getAge(parsedDate) < 18) {
				Alert.alert("Hata!", "Yaşın 18'den küçük olamaz.", [{ text: "Kontrol Edeyim" }]);
			} else {
				Alert.alert("Hata!", "Boş bıraktığın bir soru var, istersen bir kontrol et.", [
					{ text: "Kontrol Edeyim" },
				]);
			}
		}
	};

	const handleForward = (ref) => {
		Animated.timing(ref, {
			useNativeDriver: false,
			toValue: 1,
			duration: 300,
		}).start();
		Animated.timing(animRefProgress, {
			useNativeDriver: false,
			toValue: counter + 1,
			duration: 300,
		}).start();
		counterChanger(counter + 1);
	};

	const handleBackward = (ref) => {
		Animated.timing(ref, {
			useNativeDriver: false,
			toValue: 0,
			duration: 300,
		}).start();
		Animated.timing(animRefProgress, {
			useNativeDriver: false,
			toValue: counter - 1,
			duration: 300,
		}).start();
		counterChanger(counter - 1);
	};

	const showDatePicker = () => {
		setShow(true);
	};

	const datePick = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(false);
		setDate(currentDate);

		let formattedDate =
			(currentDate.getMonth() + 1 < 10
				? "0" + (currentDate.getMonth() + 1)
				: currentDate.getMonth() + 1) +
			"/" +
			(currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate()) +
			"/" +
			currentDate.getFullYear();
		setParsedDate(formattedDate);
	};

	return (
		<View style={commonStyles.Container}>
			<StatusBar style={"dark"} />
			<View style={[commonStyles.Header, { marginTop: 80, justifyContent: "space-around" }]}>
				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={() => {
						counter > 0 ? handleBackward(refList[counter - 1]) : navigation.replace("WelcomePage");
					}}
				>
					{counter > 0 ? (
						<Text
							style={[
								{
									fontSize: 15,
									color: "#B6B6B6",
									textAlign: "left",
									paddingLeft: width / 15,
								},
							]}
						>
							Önceki Soru
						</Text>
					) : (
						<Ionicons
							name="arrow-back-outline"
							size={32}
							color="#B6B6B6"
							style={{ paddingLeft: width / 15 }}
						/>
					)}
				</TouchableOpacity>

				<View style={[styles.ProgressBarContainer, {}]}>
					<Animated.View
						style={[
							styles.ProgressBar,
							{
								width: animRefProgress.interpolate({
									inputRange: [0, 4],
									outputRange: [28, 140],
								}),
							},
						]}
					>
						<Gradient style={{ borderRadius: 7, alignItems: "center" }}></Gradient>
					</Animated.View>
				</View>

				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={() => {
						counter < 4 ? handleForward(refList[counter]) : handleRegister();
					}}
				>
					<Text
						style={{
							fontSize: 15,
							color: "#B6B6B6",
							textAlign: "right",
							paddingRight: width / 15,
						}}
					>
						{counter < 4 ? "Sonraki Soru" : "İleri"}
					</Text>
				</TouchableOpacity>
			</View>

			<View name={"CardsContainer"} style={styles.CardsContainer}>
				<View
					style={[
						styles.QuestionCard,
						{
							opacity: 0.6,
							transform: [{ scale: 0.8 }, { translateY: -40 }],
						},
					]}
				>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }} />
				</View>
				<View
					style={[
						styles.QuestionCard,
						{
							opacity: 0.6,
							transform: [{ scale: 0.9 }, { translateY: -20 }],
						},
					]}
				>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }} />
				</View>

				<Animated.View name={"EmailCard"} style={[styles.QuestionCard]}>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>E-Posta{"\n"}Adresim</Text>
						</View>
						<TextInput
							onSubmitEditing={() => {
								handleRegister();
							}}
							onChangeText={setEmail}
							value={email}
							placeholder="Üniversite Mail Adresin"
							style={styles.QuestionInput}
						/>
					</Gradient>
				</Animated.View>
				<Animated.View
					name={"UnivCard"}
					style={[
						styles.QuestionCard,
						{
							transform: [
								{
									translateX: animRef4.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 50],
									}),
								},
							],
							opacity: animRef4.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
							zIndex: animRef4.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
						},
					]}
				>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>Üniversitem</Text>
						</View>
						<TextInput
							onSubmitEditing={() => {
								handleRegister();
							}}
							onChangeText={setUniversity}
							value={university}
							placeholder="Üniversitenin Adı"
							style={styles.QuestionInput}
							onSubmitEditing={() => {
								handleForward(refList[counter]);
							}}
						/>
					</Gradient>
				</Animated.View>

				<Animated.View //TODO: implement a custom picker for this part
					name={"CityCard"}
					style={[
						styles.QuestionCard,
						{
							transform: [
								{
									translateX: animRef3.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 50],
									}),
								},
							],
							opacity: animRef3.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
							zIndex: animRef3.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
						},
					]}
				>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>Bulunduğum{"\n"}Şehir</Text>
						</View>

						<View style={styles.QuestionInput}>
							{/* <Picker
								ref={pickerRef}
								selectedValue={city}
								style={{ width: "50%", alignSelf: "center" }}
								onValueChange={(itemValue, itemIndex) => setCity(itemValue)}
							>
								<Picker.Item
									label="Okuduğun Şehir"
									value={null}
									enabled={false}
									color={colors.medium_gray}
								/>
								<Picker.Item label="Istanbul" value="Istanbul" />
								<Picker.Item label="Ankara" value="Ankara" />
							</Picker> */}
							<TextInput
								editable={false}
								value={city}
								style={styles.QuestionInput}
								color={"black"}
							/>
						</View>
					</Gradient>
				</Animated.View>

				<Animated.View
					name={"BirthdayCard"}
					style={[
						styles.QuestionCard,
						{
							transform: [
								{
									translateX: animRef2.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 50],
									}),
								},
							],
							opacity: animRef2.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
							zIndex: animRef2.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
						},
					]}
				>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>Doğum{"\n"}Tarihim</Text>
						</View>
						<Pressable onPress={showDatePicker} style={styles.QuestionInput}>
							<TextInput
								placeholder="gg/aa/yyyy"
								color={colors.black}
								style={styles.QuestionInput}
								editable={false}
								value={parsedDate}
								onSubmitEditing={() => {
									handleForward(refList[counter]);
								}}
							/>
						</Pressable>
					</Gradient>
				</Animated.View>
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode={"date"}
						display="default"
						onChange={datePick}
					/>
				)}

				<Animated.View
					name={"NameCard"}
					style={[
						styles.QuestionCard,
						{
							transform: [
								{
									translateX: animRef1.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 50],
									}),
								},
							],
							opacity: animRef1.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
							zIndex: animRef1.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
						},
					]}
				>
					<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>Merhaba!{"\n"}Benim adım</Text>
						</View>
						<TextInput
							onSubmitEditing={() => {
								handleRegister();
							}}
							onChangeText={setName}
							value={name}
							placeholder="Adın ve Soyadın"
							style={styles.QuestionInput}
							onSubmitEditing={() => {
								handleForward(refList[counter]);
							}}
						/>
					</Gradient>
				</Animated.View>
			</View>
			<View style={styles.TextContainer}>
				<Animated.Text
					style={[
						styles.SubText,
						{
							opacity: animRef1.interpolate({
								inputRange: [0, 1],
								outputRange: [1, 0],
							}),
						},
					]}
				>
					Biz de kullanıcı adının ayca_22 olmasını isterdik{"\n"}ama burada gerçek ismine
					ihtiyacımız var.
				</Animated.Text>
				<Animated.Text
					style={[
						styles.SubText,
						{
							opacity: animRef4.interpolate({
								inputRange: [0, 1],
								outputRange: [0, 1],
							}),
						},
					]}
				>
					dorm, üniversiteliler tarafından sadece üniversiteliler için tasarlandı. Bu yüzden, sadece
					üniversite e-posta adresinle kayıt olabilirsin.
				</Animated.Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	ProgressBarContainer: {
		marginTop: 0,
		paddingHorizontal: 5,
		height: 22,
		width: 150,
		borderRadius: 12,
		backgroundColor: colors.white,
		justifyContent: "center",
	},
	ProgressBar: { height: 14, borderRadius: 7 },
	CardsContainer: {
		height: 170,
		width: "100%",
		alignItems: "center",
		marginTop: 100,
	},
	QuestionCard: {
		zIndex: 1,
		position: "absolute",
		height: 166.33,
		width: 329.99,
		borderRadius: 16,
	},
	QuestionCardText: {
		fontSize: 22,
		color: colors.light_gray,
		fontWeight: "bold",
		textAlign: "center",
	},
	QuestionInput: {
		width: "100%",
		backgroundColor: "#F2F2F2",
		height: 54,
		textAlign: "center",
		fontSize: 20,
	},
	TextContainer: {
		marginTop: 20,
		width: 320,
		position: "relative",
		alignSelf: "center",
	},
	SubText: {
		textAlign: "center",
		alignSelf: "center",
		zIndex: 2,
		position: "absolute",
		color: colors.medium_gray,
		fontSize: 16,
	},
});

{
	/* <Animated.View
name={"EmailCard"}
style={[
   styles.QuestionCard,
   {
      transform: [
         { translateX: animRef5.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
         {
            translateY:
               counter <= 3
                  ? animRef3.interpolate({ inputRange: [0, 1], outputRange: [-40, -20] })
                  : animRef4.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
         },
         {
            scale:
               counter <= 3
                  ? animRef3.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0.9] })
                  : animRef4.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
         },
      ],
      opacity:
         counter <= 3
            ? animRef4.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] })
            : animRef5.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      zIndex: animRef5.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
   },
]}
>
<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
   <View style={{ height: 90, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.QuestionCardText}>E-Posta{"\n"}Adresim</Text>
   </View>
   <TextInput placeholder="Üniversite Mail Adresin" style={styles.QuestionInput} />
</Gradient>
</Animated.View>

<Animated.View
name={"UnivCard"}
style={[
   styles.QuestionCard,
   {
      transform: [
         { translateX: animRef4.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
         {
            translateY:
               counter <= 2
                  ? animRef2.interpolate({ inputRange: [0, 1], outputRange: [-40, -20] })
                  : animRef3.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
         },
         {
            scale:
               counter <= 2
                  ? animRef2.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0.9] })
                  : animRef3.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
         },
      ],
      opacity:
         counter <= 2
            ? animRef3.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] })
            : animRef4.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      zIndex: animRef4.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
   },
]}
>
<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
   <View style={{ height: 90, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.QuestionCardText}>Üniversitem</Text>
   </View>
   <TextInput placeholder="Üniversitenin Adı" style={styles.QuestionInput} />
</Gradient>
</Animated.View>

<Animated.View
name={"CityCard"}
style={[
   styles.QuestionCard,
   {
      transform: [
         { translateX: animRef3.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
         {
            translateY:
               counter <= 1
                  ? animRef1.interpolate({ inputRange: [0, 1], outputRange: [-40, -20] })
                  : animRef2.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }),
         },
         {
            scale:
               counter <= 1
                  ? animRef1.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0.9] })
                  : animRef2.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
         },
      ],
      opacity:
         counter <= 1
            ? animRef2.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] })
            : animRef3.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      zIndex: animRef3.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
   },
]}
>
<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
   <View style={{ height: 90, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.QuestionCardText}>Bulunduğum{"\n"}Şehir</Text>
   </View>
   <TextInput placeholder="Okuduğun Şehir" style={styles.QuestionInput} />
</Gradient>
</Animated.View>

<Animated.View
name={"BirthdayCard"}
style={[
   styles.QuestionCard,
   {
      transform: [
         { translateX: animRef2.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
         { translateY: animRef1.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
         { scale: animRef1.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
      ],
      opacity:
         counter == 0
            ? animRef1.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] })
            : animRef2.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      zIndex: animRef2.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
   },
]}
>
<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
   <View style={{ height: 90, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.QuestionCardText}>Doğum{"\n"}Tarihim</Text>
   </View>
   <TextInput placeholder="gg/aa/yy" style={styles.QuestionInput} />
</Gradient>
</Animated.View>

<Animated.View
name={"NameCard"}
style={[
   styles.QuestionCard,
   {
      transform: [
         { translateX: animRef1.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
      ],
      opacity: animRef1.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      zIndex: animRef1.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
   },
]}
>
<Gradient style={{ borderRadius: 16, alignItems: "center" }}>
   <View style={{ height: 90, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.QuestionCardText}>Merhaba!{"\n"}Benim adım</Text>
   </View>
   <TextInput placeholder="Adın ve Soyadın" style={styles.QuestionInput} />
</Gradient>
</Animated.View> */
}