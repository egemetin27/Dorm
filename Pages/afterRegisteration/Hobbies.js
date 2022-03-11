import React from "react";
import {
	Text,
	View,
	Dimensions,
	Pressable,
	ScrollView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../nonVisualComponents/Context";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";

const { height, width } = Dimensions.get("window");

export default function Hobbies({ navigation, route }) {
	const [hobbies, setHobbies] = React.useState([]);
	const { userID, email, password } = route.params;

	const { signIn } = React.useContext(AuthContext);
	const handleSubmit = () => {
		console.log("Submitting...");
		signIn({ email: email, password: password });
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
			<View style={[commonStyles.Header, { paddingHorizontal: 30, justifyContent: "flex-end" }]}>
				<TouchableOpacity onPress={handleSubmit}>
					<Text style={{ color: colors.medium_gray, fontSize: 18 }}>İleri</Text>
				</TouchableOpacity>
			</View>
			<View
				style={{
					width: "100%",
					alignItems: "flex-start",
					paddingHorizontal: 30,
					marginTop: 20,
				}}
			>
				<GradientText text={"İlgi Alanlarım"} style={{ fontSize: 30, fontWeight: "bold" }} />
			</View>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 150 }}
				showsVerticalScrollIndicator={false}
			>
				<View style={{ marginTop: 30 }}>
					<GradientText
						text={"Spor"}
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
						style={{ fontSize: 20, fontWeight: "bold", letterSpacing: 1.2, marginLeft: 20 }}
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
	);
}

const Item = ({ item, value, setValue }) => {
	const [activity, setActivity] = React.useState(false);

	const toggleActivity = () => {
		if (!activity && value.length < 5) {
			setActivity(true);
			setValue([...value, item.key]);
		} else if (activity) {
			setActivity(false);
			const tempArr = value;
			tempArr.splice(tempArr.indexOf(item.key), 1);
			setValue(tempArr);
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
