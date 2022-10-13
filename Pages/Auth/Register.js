import { useContext, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View, Pressable, Dimensions, Alert } from "react-native";
import { setStatusBarBackgroundColor, setStatusBarStyle } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../../visualComponents/colors";
import { getAge } from "../../utils/date.utils";
import { ListsContext } from "../../contexts/lists.context";
import RegisterInputField from "../../components/register-input.component";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Register({ navigation }) {
	const {
		lists: { univList, cityList },
	} = useContext(ListsContext);

	const insets = useSafeAreaInsets();

	const [index, setIndex] = useState(0);
	const [userInfo, setUserInfo] = useState({});

	const carouselRef = useRef();

	useFocusEffect(() => {
		setStatusBarBackgroundColor("#F4F3F3", true);
		setStatusBarStyle("dark");
	});

	const INPUT_FIELDS = useMemo(
		() => [
			{
				label: "Merhaba!\nBenim adım",
				placeholder: "Adın & Soyadın",
				subInfo:
					"Biz de kullanıcı adının ayca_22 olmasını isterdik ama burada gerçek ismine ihtiyacımız var.",
				inputType: "text",
				databaseKey: "name",
				checkInput: (name) => {
					if (name.trim().lastIndexOf(" ") === -1) {
						return false;
					}
					return true;
				},
				alert: () => {
					Alert.alert("Hata!", "Adını ve soyadını yanlış girmiş olabilirsin", [
						{ text: "Kontrol Edeyim" },
					]);
				},
			},
			{
				label: "Doğum Tarihim",
				placeholder: "gg / aa / yyyy",
				subInfo: "",
				inputType: "date",
				databaseKey: "Birth_date",
				checkInput: (birthday) => {
					if (getAge(birthday) < 18) {
						return false;
					}
					return true;
				},
				alert: () => {
					Alert.alert("Hata!", "18 Yaşından Büyük Olmalısın!", [{ text: "Kontrol Edeyim" }]);
				},
			},
			{
				label: "Bulunduğum Şehir",
				placeholder: "Okuduğum Şehir",
				subInfo: "",
				inputType: "select",
				list: cityList,
				databaseKey: "City",
				checkInput: (city) => {
					if (city) return true;
					return false;
				},
			},
			{
				label: "Üniversitem",
				placeholder: "Üniversitemin Adı",
				subInfo: "",
				inputType: "select",
				list: univList[userInfo?.City?.key] ?? [],
				databaseKey: "School",
				checkInput: (univ) => {
					if (univ) return true;
					return false;
				},
			},
			{
				label: "E-Mail\nAdresim",
				placeholder: "Üniversite E-Mail Adresim",
				subInfo:
					"dorm, üniversiteliler tarafından sadece üniversiteliler için tasarlandı. Bu yüzden, sadece üniversite e-posta adresinle kayıt olabilirsin.",
				inputType: "text",
				databaseKey: "Mail",
				checkInput: (email) => {
					if (email.toLocaleLowerCase().trim().split("@")[1] != userInfo.School.mailExt)
						return false;
					return true;
				},
				alert: () => {
					Alert.alert("Hata!", "Mail adresin ile seçtiğin üniversite eşleşmiyor!", [
						{ text: "Kontrol Edeyim" },
					]);
				},
			},
		],
		[univList, cityList, userInfo]
	);

	const canGoForward = useMemo(() => {
		return INPUT_FIELDS[index].checkInput(userInfo[INPUT_FIELDS[index].databaseKey] ?? "");
	}, [INPUT_FIELDS, userInfo, index]);

	const handleBackward = () => {
		if (index === 0) {
			navigation.replace("WelcomePage");
			return;
		}
		carouselRef.current.prev();
		setIndex((oldValue) => oldValue - 1);
	};

	const handleForward = () => {
		if (!canGoForward) return;
		if (index + 1 === INPUT_FIELDS.length) {
			handleRegister();
			return;
		}

		carouselRef.current.next();
		setIndex((oldValue) => oldValue + 1);
	};

	const handleChange = (newValue, key) => {
		setUserInfo((oldValue) => {
			if (key === "City") {
				return { ...oldValue, [key]: newValue, School: "" };
			}

			return { ...oldValue, [key]: newValue };
		});
	};

	const handleRegister = () => {
		const { name, Birth_date, City, School, Mail } = userInfo;

		const fullName = name.trim().toLocaleLowerCase();
		const lName = fullName.slice(fullName.lastIndexOf(" ") + 1);
		const fName = fullName.slice(0, fullName.lastIndexOf(" "));

		const trimmedMail = Mail.trim().toLowerCase();

		const parsedDate =
			Birth_date.getFullYear() +
			"-" +
			(Birth_date.getMonth() + 1 < 10
				? "0" + (Birth_date.getMonth() + 1)
				: Birth_date.getMonth() + 1) +
			"-" +
			(Birth_date.getDate() < 10 ? "0" + Birth_date.getDate() : Birth_date.getDate());

		const profile = {
			mail: trimmedMail,
			mailKey: School.key,
			name: fName,
			surName: lName,
			city: City.choice,
			bDay: parsedDate,
			school: School.choice,
		};
		navigation.replace("FirstPassword", { profile: profile });
	};

	const handleSubmit = (value) => {
		// const index = carouselRef.current.getCurrentIndex();
		if (INPUT_FIELDS[index].checkInput(value)) handleForward();
		else INPUT_FIELDS[index].alert();
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={[styles.header, { marginTop: insets.top }]}>
				<View style={{ flex: 1, alignItems: "flex-start" }}>
					<Pressable style={styles.button}>
						<MaterialIcons
							onPress={handleBackward}
							name="keyboard-backspace"
							size={27}
							color="black"
						/>
					</Pressable>
				</View>
				<View style={{ flex: 1, alignItems: "center" }}>
					<Text style={{ fontFamily: "PoppinsSemiBold" }}>{`${index + 1} / ${
						INPUT_FIELDS.length
					}`}</Text>
				</View>
				<View style={{ flex: 1, alignItems: "flex-end" }}>
					<Pressable onPress={handleForward} disabled={!canGoForward} style={styles.button}>
						<MaterialIcons
							style={{
								transform: [
									{
										rotateY: "180deg",
									},
								],
							}}
							name="keyboard-backspace"
							size={27}
							color={canGoForward ? colors.black : colors.cool_gray}
						/>
					</Pressable>
				</View>
			</View>

			<View style={styles.body}>
				<Carousel
					ref={carouselRef}
					enabled={false}
					mode={"parallax"}
					modeConfig={{
						parallaxScrollingOfset: 100,
						parallaxScrollingScale: 1,
						parallaxAdjacentItemScale: 0.8,
					}}
					width={width}
					style={{
						justifyContent: "center",
					}}
					height={180}
					loop={false}
					data={INPUT_FIELDS}
					renderItem={({ item }) => (
						<RegisterInputField
							label={item.label}
							placeholder={item.placeholder}
							inputType={item.inputType}
							list={item?.list ?? []}
							onChange={(newValue) => {
								handleChange(newValue, item.databaseKey);
							}}
							onSubmit={handleSubmit}
						/>
					)}
				/>
				<Text style={styles.subText}>{INPUT_FIELDS[index].subInfo}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: width * 0.06,
		paddingVertical: Math.min(height * 0.03, 20),
	},
	button: {
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	body: {
		width: width,
		alignItems: "center",
		marginTop: height * 0.08,
	},
	subText: {
		width: width * 0.8,
		textAlign: "center",
		zIndex: 2,
		marginTop: height * 0.03,
		color: colors.medium_gray,
		fontSize: 15,
	},
});
