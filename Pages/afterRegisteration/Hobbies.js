import React from "react";
import {
	Text,
	View,
	Dimensions,
	Pressable,
	ScrollView,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
import { url } from "../../connection";

const { height, width } = Dimensions.get("window");

export default function Hobbies({ navigation, route }) {
	const [hobbies, setHobbies] = React.useState(
		route.params?.hobbyList?.map((item) => item.InterestName) || []
	);
	const [isLoading, setIsLoading] = React.useState(false);
	const { userID, isNewUser } = route.params;

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			const dataStr = await SecureStore.getItemAsync("userData");
			const data = JSON.parse(dataStr);

			axios
				.post(
					url + "/interests",
					{
						UserId: userID,
						hobbies: hobbies,
					},
					{ headers: { "access-token": data.sesToken } }
				)
				.then(async (res) => {
					const newHobbyList = hobbies.map((item) => {
						return { InterestName: item };
					});

					const newData = { ...data, interest: newHobbyList };

					await SecureStore.setItemAsync("userData", JSON.stringify(newData));
					setIsLoading(false);
					if (isNewUser) {
						navigation.replace("MainScreen", { screen: "AnaSayfa" });
					} else {
						navigation.replace("MainScreen", { screen: "Profil" });
					}
				})
				.catch((err) => {
					setIsLoading(false);
					console.log(err);
				});
		} catch (err) {
			console.log(err);
		}
	};

	const sport = [
		{ key: "🏀 Basketbol" },
		{ key: "🏋️ Fitness" },
		{ key: "🏐 Voleybol" },
		{ key: "🧘 Yoga" },
		{ key: "🎾 Tenis" },
		{ key: "🚶 Doğa Yürüyüşü" },
		{ key: "🤿 Dalış" },
		{ key: "🏄 Sörf" },
		{ key: "⛵ Yelken" },
		{ key: "⛷️ Kayak" },
		{ key: "🏂 Snowboard" },
		{ key: "🏃🏻 Koşu" },
		{ key: "🏊🏻 Yüzme" },
		{ key: "🤼 Dövüş Sanatları" },
	];

	// Müzik, Dans, Fotoğrafçılık,  Plastik sanatlar, Makyaj, Vlogging, Yazı
	const creativity = [
		{ key: "🎸 Müzik" },
		{ key: "💃 Dans" },
		{ key: "📹 Vlog" },
		{ key: "📝 Yazı" },
		{ key: "🎨 Resim" },
	];

	// Şarap, Bira, Viski, Vegan, Vejetaryen, Tatlı, Gastronomi, Kahve, Meyhane Kültürü
	const consumables = [
		{ key: "🍷 Şarap" },
		{ key: "🍺 Bira" },
		{ key: "🍸 Kokteyl" },
		{ key: "🥦 Vegan" },
	];

	// Aksiyon, Animasyon, Anime, Komedi, Belgesel, Dram, Fantastik, Bilim Kurgu, Korku, Gerilim, Avrupa Sineması, Süper kahraman, Yarışma programları
	const movies = [{ key: "🦸 Süper Kahraman" }, { key: "🙀 Korku" }, { key: "🧑‍🚀 Bilim Kurgu" }];

	// Klasikler, Aksiyon ve Macera, Biyografi, Çizgi roman, Fantastik, Korku, Şiir, Felsefe, Tarih, Siyaset, Suç, Psikoloji
	const reading = [
		{ key: "🖊️ Klasik" },
		{ key: "🏺 Tarih" },
		{ key: "🔪 Suç" },
		{ key: "🧝‍♀️ Fantastik" },
	];

	// Blues, Klasik, Cpuntry, Elektronik, Folk & Akustik, Funk, Hip hop, House, Indie, Jazz, K-pop, Latin, Metal, Pop, Punk, R&B, Rap, Reggae, Rock, Alternatif Rock, Soul
	const music = [
		{ key: "🎹 Klasik" },
		{ key: "🎷 Jazz" },
		{ key: "🎸 Rock" },
		{ key: "🪕 Country" },
	];

	// Feminist, LGBTQ+ destekçisi, Çevrecilik, Trans destekçisi, İnsan hakları
	const activism = [
		{ key: "💁🏻‍♀️ Feminist" },
		{ key: "🏳️‍🌈 LGBTQ+ destekçisi" },
		{ key: "🌲 Çevrecilik" },
	];

	// Aile sevgisi, Açık fikirlilik, Alçak gönüllülük, Romantiklik, Özgüven, Yaratıcılık, Empati, Zeka, Pozitiflik, Kendini tanımak, Espiri anlayışı, Sosyal farkındalık, Hayvanseverlik
	const traits = [{ key: "Aile Sevgisi" }, { key: "Açık Fikirlilik" }, { key: "Alçak Gönüllülük" }];

	return (
		<View style={commonStyles.Container}>
			<StatusBar style="dark" translucent={false} backgroundColor="#F4F3F3" />
			<View
				style={{
					justifyContent: "space-between",
					alignItems: "center",
					paddingVertical: height * 0.02,
					flexDirection: "row",
					width: "100%",
					paddingHorizontal: width * 0.05,
					backgroundColor: "#F4F3F3",
					elevation: 10,
					shadowColor: "rgb(0, 0, 0)",
					shadowOffset: { width: 0, height: 10 },
					shadowRadius: 20,
				}}
			>
				<GradientText text={"İlgi Alanlarım"} style={{ fontSize: 30, fontFamily: "NowBold" }} />
				<TouchableOpacity onPress={handleSubmit}>
					<Text style={{ color: colors.medium_gray, fontSize: 18 }}>İleri</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					width: "100%",
				}}
			>
				<ScrollView
					contentContainerStyle={{ paddingBottom: 150 }}
					showsVerticalScrollIndicator={false}
				>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Spor"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={sport}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Yaratıcılık"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={creativity}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Yeme & İçme"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={consumables}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Film & Dizi"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={movies}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Okumak"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={reading}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Müzik"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={music}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Değerler ve Aktivizm"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={activism}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<GradientText
							text={"Değerler ve Özellikler"}
							style={{
								fontSize: 20,
								fontFamily: "PoppinsSemiBold",
								letterSpacing: 1.2,
								marginLeft: 20,
							}}
						/>
						<FlatList
							style={{ marginTop: 10 }}
							showsHorizontalScrollIndicator={false}
							data={traits}
							renderItem={({ item }) => <Item value={hobbies} setValue={setHobbies} item={item} />}
							horizontal={true}
						/>
					</View>
				</ScrollView>
			</View>
			{isLoading && (
				<View
					style={[
						commonStyles.Container,
						{
							position: "absolute",
							justifyContent: "center",
							backgroundColor: "rgba(128,128,128,0.5)",
						},
					]}
				>
					<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
				</View>
			)}
		</View>
	);
}

const Item = ({ item, value, setValue }) => {
	const [activity, setActivity] = React.useState(value.includes(item.key));

	const toggleActivity = () => {
		if (!activity && value.length < 5) {
			setActivity(true);
			setValue([...value, item.key]);
		} else if (activity) {
			setActivity(false);
			const tempArr = value;
			tempArr.splice(tempArr.indexOf(item.key), 1);
			setValue(tempArr);
		} else {
			Alert.alert("5'ten fazla ilgi alanı seçemezsin :/");
		}
	};

	return (
		<Pressable
			onPress={() => {
				toggleActivity();
			}}
			style={{
				backgroundColor: colors.white,
				alignSelf: "flex-start",
				marginLeft: 20,
				minWidth: width / 4,
				height: width / 8,
				borderRadius: width / 16,
				overflow: "hidden",
			}}
		>
			{activity ? (
				<Gradient
					style={{
						paddingHorizontal: 10,
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
						height: "100%",
					}}
				>
					<Text style={{ color: colors.white }}>{item.key}</Text>
				</Gradient>
			) : (
				<View
					style={{
						paddingHorizontal: 10,
						width: "100%",
						height: "100%",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text style={{ color: colors.black }}>{item.key}</Text>
				</View>
			)}
		</Pressable>
	);
};