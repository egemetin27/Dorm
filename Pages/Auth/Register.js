import { useContext, useRef, useState } from "react";
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
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

import { Gradient, GradientRegistration, colors } from "../../visualComponents/colors";
import { getAge } from "../../utils/date.utils";
import { CustomPicker } from "../../visualComponents/customComponents";
import { ListsContext } from "../../contexts/lists.context";

const { width, height } = Dimensions.get("window");

const INPUT_FIELDS = [];

export default function Register({ navigation }) {
	const { lists } = useContext(ListsContext);

	const animRef1 = useRef(new Animated.Value(0)).current;
	const animRef2 = useRef(new Animated.Value(0)).current;
	const animRef3 = useRef(new Animated.Value(0)).current;
	const animRef4 = useRef(new Animated.Value(0)).current;
	const animRefProgress = useRef(new Animated.Value(0)).current;
	const refList = [animRef1, animRef2, animRef3, animRef4];

	const [name, setName] = useState("");
	const [date, setDate] = useState(new Date());
	const [parsedDate, setParsedDate] = useState("gg/aa/yyyy");
	const [city, setCity] = useState({ key: 0, choice: "" });
	const [university, setUniversity] = useState({ key: 0, choice: "" });
	const [email, setEmail] = useState("");

	const [univListVisible, setUnivListVisible] = useState(false);
	const [cityListVisible, setCityListVisible] = useState(false);
	const [show, setShow] = useState(false);

	const [counter, setCounter] = useState(0);

	const handleRegister = () => {
		const fullName = name.trim().toLocaleLowerCase();
		const trimmedMail = email.trim().toLowerCase();

		const lName = fullName.slice(fullName.lastIndexOf(" ") + 1);
		const fName = fullName.slice(0, fullName.lastIndexOf(" "));

		const profile = {
			mail: trimmedMail,
			name: fName,
			surName: lName,
			city: city.choice,
			bDay: parsedDate,
			school: university.choice,
		};
		navigation.replace("FirstPassword", { profile: profile });
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

	const checkInput = () => {
		if (counter == 0 && name.trim().lastIndexOf(" ") == -1) {
			Alert.alert("Hata!", "Adını ve soyadını yanlış girmiş olabilirsin", [
				{ text: "Kontrol Edeyim" },
			]);
			return;
		}
		if (counter == 1 && getAge(parsedDate) < 18) {
			Alert.alert("Hata!", "18 Yaşından Büyük Olmalısın!", [{ text: "Kontrol Edeyim" }]);
			return;
		}
		if (counter == 3 && university.choice == "") {
			Alert.alert("Hata!", "Lütfen okuduğunuz üniversiteyi seçin!", [{ text: "Kontrol Edeyim" }]);
			return;
		}
		if (counter == 4 && email.toLocaleLowerCase().trim().split("@")[1] != university.mailExt) {
			Alert.alert("Hata!", "Mail adresin ile seçtiğin üniversite eşleşmiyor!", [
				{ text: "Kontrol Edeyim" },
			]);
			return;
		}
		if (counter < 4) {
			handleForward(refList[counter]);
			return;
		}
		handleRegister();
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
						<GradientRegistration
							style={{ borderRadius: 7, alignItems: "center", width: "100%", height: "100%" }}
						></GradientRegistration>
					</Animated.View>
				</View>

				<TouchableOpacity
					style={{ flex: 1 }}
					onPress={() => {
						checkInput();
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
								checkInput();
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
											color: university.choice != "" ? colors.black : colors.medium_gray,
											fontSize: 20,
										},
									]}
								>
									{university.choice != "" ? university.choice : "Üniversiteni Seç"}
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

						<Pressable
							style={{ width: "100%" }}
							onPress={() => {
								setCityListVisible(true);
							}}
						>
							<View
								style={[styles.QuestionInput, { justifyContent: "center", alignItems: "center" }]}
							>
								<Text
									style={[
										{
											color: city.choice != "" ? colors.black : colors.medium_gray,
											fontSize: 20,
										},
									]}
								>
									{city.choice != "" ? city.choice : "Şehrini Seç"}
								</Text>
							</View>
						</Pressable>
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
				<View style={{ marginRight: width * 0.12, marginTop: 6, alignSelf: "flex-end" }}>
					<Text style={{ alignSelf: "center" }}>Lütfen Doğum Tarihinizi Seçin</Text>
					<DateTimePicker
						textColor="black"
						accentColor="red"
						testID="dateTimePicker"
						value={date}
						style={{ backgroundColor: "white", marginVertical: 5, alignSelf: "auto" }}
						mode="date"
						onChange={datePick}
					/>
				</View>
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
				style={{ width: width * 0.7 }}
				data={lists.univList[city.key]}
				visible={univListVisible}
				setVisible={setUnivListVisible}
				setChoice={setUniversity}
			/>
			<CustomPicker
				style={{ width: width * 0.57 }}
				data={lists.cityList}
				visible={cityListVisible}
				setVisible={setCityListVisible}
				setChoice={setCity}
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
