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
	Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import commonStyles from "../../visualComponents/styles";
import { Gradient, colors } from "../../visualComponents/colors";
import { url } from "../../connection";
import { getAge } from "../../nonVisualComponents/generalFunctions";
import { CustomPicker } from "../../visualComponents/customComponents";
import { univList } from "../../nonVisualComponents/Lists";

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
	const [parsedDate, setParsedDate] = React.useState("gg/aa/yyyy");
	const [city, setCity] = React.useState("İstanbul");
	const [university, setUniversity] = React.useState("");
	const [email, setEmail] = React.useState("");

	const [univListVisible, setUnivListVisible] = React.useState(false);
	const [show, setShow] = React.useState(false);

	const [counter, setCounter] = React.useState(0);

	// const pickerRef = React.useRef().current;

	const emailRegex = /^[\w-\.]+@([\w-]+\.)edu(\.[\w-]{2,4})?/;

	const handleRegister = async () => {
		const fullName = name.trim();

		if (fullName.lastIndexOf(" ") == -1) {
			Alert.alert("Hata!", "Adını ve soyadını yanlış girmiş olabilirsin", [
				{ text: "Kontrol Edeyim" },
			]);
			return;
		}

		const lName = fullName.slice(fullName.lastIndexOf(" ") + 1);
		const fName = fullName.slice(0, fullName.lastIndexOf(" "));

		const trimmedMail = email.trim();

		if (
			emailRegex.test(trimmedMail) &&
			fName != "" &&
			lName != "" &&
			parsedDate != "" &&
			university != "" &&
			getAge(parsedDate) >= 18
		) {
			const profile = {
				mail: trimmedMail,
				name: fName,
				surName: lName,
				city: city,
				bDay: parsedDate,
				school: university.choice,
			};

			navigation.replace("FirstPassword", { profile: profile });
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
		setShow(false);
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
		setCounter(counter + 1);
	};

	const handleBackward = (ref) => {
		setShow(false);
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
		setCounter(counter - 1);
	};

	const showDatePicker = () => {
		setShow(true);
	};

	const datePick = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === "ios");
		setDate(currentDate);

		let formattedDate =
			currentDate.getFullYear() +
			"-" +
			(currentDate.getMonth() + 1 < 10
				? "0" + (currentDate.getMonth() + 1)
				: currentDate.getMonth() + 1) +
			"-" +
			(currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate());
		setParsedDate(formattedDate);
	};

	return (
		<View>
			<StatusBar style={"dark"} />
			<View
				style={[
					{
						marginTop: height * 0.08,
						position: "relative",
						width: "100%",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						minHeight: 40,
					},
				]}
			>
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
									fontSize: Math.min(16, width * 0.035),
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
							size={35}
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
						<Gradient
							style={{ borderRadius: 7, alignItems: "center", width: "100%", height: "100%" }}
						></Gradient>
					</Animated.View>
				</View>

				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={() => {
						if (counter == 0) {
							const fullName = name.trim();
							const fName = fullName.slice(0, fullName.lastIndexOf(" "));
							const lName = fullName.slice(fullName.lastIndexOf(" ") + 1);
							console.log(fName);
							console.log(lName);
							if(fName == "" || lName == "")
							{
								Alert.alert("Hata!", "Adını ve soyadını yanlış girmiş olabilirsin", [
									{ text: "Kontrol Edeyim" },
								]);
							}
							else
							{
								handleForward(refList[counter]);
							}

						} else if (counter == 1) {
							if (getAge(parsedDate) >= 18) {
								handleForward(refList[counter]);
							} else {
								Alert.alert("Hata!", "Legal olmadıkça giremezsin!", [
									{ text: "Kontrol Edeyim" },
								]);
							}

						} else if (counter == 2) {
							handleForward(refList[counter]);
						} else if (counter == 3) {
							if (university == "") {
								Alert.alert("Hata!", "Lütfen okuduğunuz üniversiteyi seçin!", [
									{ text: "Kontrol Edeyim" },
								]);

							} else {
								handleForward(refList[counter]);
							}
						} else if (counter == 4) {
							const trimmedMail = email.trim();
							if (emailRegex.test(trimmedMail)) {
								handleRegister();
							} else {
								Alert.alert("Hata!", "Lütfen girmiş olduğunuz üniversiteyi kontrol ediniz!", [
									{ text: "Kontrol Edeyim" },
								]);
							}

						}

						//counter < 4 ? handleForward(refList[counter]) : handleRegister();
					}}
				>
					<Text
						style={{
							fontSize: Math.min(16, width * 0.035),
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
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					/>
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
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					/>
				</View>

				<Animated.View name={"EmailCard"} style={[styles.QuestionCard]}>
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					>
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
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>Üniversitem</Text>
						</View>
						<Pressable
							style={{ width: "100%" }}
							onPress={() => {
								setUnivListVisible(true);
							}}
						>
							<View
								style={[styles.QuestionInput, { justifyContent: "center", alignItems: "center" }]}
							>
								<Text
									style={[
										{
											color: university != "" ? colors.black : colors.medium_gray,
											fontSize: 20,
										},
									]}
								>
									{university.choice ?? "Üniversiteni Seç"}
								</Text>
							</View>
						</Pressable>

						{/* <TextInput
							onChangeText={setUniversity}
							value={university}
							placeholder="Üniversitenin Adı"
							style={styles.QuestionInput}
							onSubmitEditing={() => {
								handleForward(refList[counter]);
							}}
						/> */}
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
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					>
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
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					>
						<View
							style={{
								height: 90,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={styles.QuestionCardText}>Doğum{"\n"}Tarihim</Text>
						</View>
						<TouchableOpacity onPress={showDatePicker} style={styles.QuestionInput}>
							<Text style={[styles.QuestionInput, { alignContent: "center", paddingTop: 15 }]}>
								{parsedDate}
							</Text>
						</TouchableOpacity>
					</Gradient>
				</Animated.View>

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
					<Gradient
						style={{ borderRadius: 16, alignItems: "center", width: "100%", height: "100%" }}
					>
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
			{show && (
				<DateTimePicker testID="dateTimePicker" value={date} mode="date" onChange={datePick} />
			)}
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
					Biz de kullanıcı adının ayca_22 olmasını isterdik ama burada gerçek ismine ihtiyacımız
					var.
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

			<CustomPicker
				style={{ width: width * 0.7, height: height * 0.6, maxWidth: 300, maxHeight: 500 }}
				data={univList}
				visible={univListVisible}
				setVisible={setUnivListVisible}
				setChoice={setUniversity}
			/>
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
		fontFamily: "PoppinsSemiBold",
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
<Gradient style={{ borderRadius: 16, alignItems: "center", 
						width: "100%",
						height: "100%" }}>
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
<Gradient style={{ borderRadius: 16, alignItems: "center", 
						width: "100%",
						height: "100%" }}>
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
<Gradient style={{ borderRadius: 16, alignItems: "center", 
						width: "100%",
						height: "100%" }}>
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
<Gradient style={{ borderRadius: 16, alignItems: "center", 
						width: "100%",
						height: "100%" }}>
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
<Gradient style={{ borderRadius: 16, alignItems: "center", 
						width: "100%",
						height: "100%" }}>
   <View style={{ height: 90, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.QuestionCardText}>Merhaba!{"\n"}Benim adım</Text>
   </View>
   <TextInput placeholder="Adın ve Soyadın" style={styles.QuestionInput} />
</Gradient>
</Animated.View> */
}
