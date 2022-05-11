import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	Dimensions,
	Image,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
	FlatList,
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
const { width, height } = Dimensions.get("window");

export default function RToplulukKurallari({ navigation }) {
	const [isChecked, setChecked] = useState(false);
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
			<StatusBar style={"dark"} translucent={false} backgroundColor={colors.white} />
			<View name={"Header"} style={[styles.header]}>
				<TouchableOpacity
					style={{ width: "12%", paddingTop: 5 }}
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
				<GradientText
					text={"Topluluk Kuralları"}
					style={{ fontSize: 26, fontWeight: "bold", paddingLeft: 0 }}
				/>
			</View>
			<ScrollView style={styles.tcContainer}>
				<View style={{ paddingHorizontal: 20 }}>
					<Text style={styles.tcP}>
						dorm’a hoşgeldiniz! dorm’un herkesin özgürce kendisi olabileceği, güvenli ve keyifli bir
						ortam olması için çalışıyoruz. Bu yüzden tüm kullanıcılarımızın saygılı, nazik ve
						anlayışlı olmasını bekliyoruz. Kendi üniversite kampüsünüzde birisiyle konuşurken
						yapmayacağınız hiçbir şeyi dorm’u kullanırken de yapmayın!
					</Text>
					<Text style={styles.tcP}>
						Topluluğumuzun güvenli ve eğlenceli ortamını koruyabilmek için oluşturduğumuz topluluk
						kurallarını aşağıda bulabilirsiniz. Bu kurallar çiğnendiği takdirde sizi uygulamadan bir
						süre veya sonsuza kadar men etmek durumunda kalabiliriz. dorm’u kullanırken bu kurallara
						uymanızı rica ediyoruz, kampüs hep birlikte olunca güzel!
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>
						Çıplaklık/Cinsel İçerik
					</Text>
					<Text style={styles.tcP}>
						Kullanıcıların profilinde ne yazarsa yazsın mesajlarınızı seviyeli tutun. Profilinize
						cinsel tercihleriniz, fetişleriniz ya da tecrübelerinizle ilgili açık ifadeler yazmayın
						ya da eşleşmelerinize açık cinsel ifadeler yazmayın. Fotoğraflarda çıplaklık ve cinsel
						içerik koymayın, bu fotoğraflar şikayet durumunda kaldırılacak ve çok tekrar ettiğinde
						hesabınız kapatılacaktır
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>
						Şiddet ve Fiziksel Zarar
					</Text>
					<Text style={styles.tcP}>
						dorm’da şiddetin her türlüsüne, cinsel, psikolojik ve fiziksel şiddete ve baskıya
						tamamen karşı bir topluluğuz. Şiddet, vahşet ya da kan içeren görüntülere veya
						söylemlere sahip olan, şiddeti güzelleyen, savunan tüm profiller kapatılacaktır.
					</Text>
					<Text style={styles.tcP}>
						Aynı şekilde kendine zarar vermeyi ya da intihar etmeyi savunan veya güzelleyen
						içeriklere izin verilmemektedir, bu içerikler silinecek ya da hesabınız banlanacaktır.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>Nefret Söylemi</Text>
					<Text style={styles.tcP}>
						dorm topluluğunda farklı kimliklere ve özelliklere saygı duyarız ve herkesin olduğu gibi
						barınabilmesini sağlamak bizim için önemlidir. Irk, etnik köken, milli köken, din,
						engellilik, toplumsal cinsiyet, cinsel yönelim, cinsiyet kimliği veya herhangi başka bir
						özellikten dolayı bireylere veya topluluklara karşı yapılan nefret söylemlerine hiçbir
						şekilde izin vermiyoruz. Herhangi bir nefret grubunun sembolü veya gruba ait olduğunuza
						dair göndermeler, ırkçı/cinsiyetçi ofansif şakalar veya küfürler profilinizde ya da
						mesajlarınızda bulunmamalıdır.{" "}
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>Yasalara Uymak</Text>
					<Text style={styles.tcP}>
						Gerçek hayatta yasal olmayan her şey dorm’da da yasal değildir (tabii ki!). dorm’u yasa
						dışı aktiviteler yapmak ya da organize etmek için kullandığınız tespit edilirse
						hesabınız kapatılacak, gerek görülürse kolluk kuvvetlerine haber verilecektir.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>
						Yaş ve Reşit Olmayanlar
					</Text>
					<Text style={styles.tcP}>
						dorm’u kullanan herkesin 18 yaş altında olması gerekiyor. 18 yaş altı olarak yaşıyla
						ilgili yalan söyleyen bir kullanıcı tespit ederseniz, lütfen bunu bize bildirin.
						Konuştuğu kişinin 18 yaş altı olduğunun farkında olarak konuşan, ilişki kuran kişilerin
						hesapları tespit edildiğinde kapatılacaktır.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>
						Sahte Hesaplar ve Üniversiteli Olmak
					</Text>
					<Text style={styles.tcP}>
						dorm üniversiteli öğrencileri birbiriyle buluşturan bir uygulama, bu yüzden tüm
						kullanıcılarımız bir üniversitede aktif olarak ön lisans, lisans ya da yüksek lisans
						öğrencisi olmalı. dorm’da üniversite öğrencisi olmadığı anlaşılan veya gerçek bir
						kişinin olmayan hesaplar kapatılacaktır. dorm hesapları bireyseldir, lütfen
						arkadaşlarınızla ya da partnerinizle hesap açmayın.
					</Text>
					<Text style={styles.tcP}>
						Uygulama için hesap açarken, üniversite e-posta adresiyle kayıt alarak sahte hesap veya
						topluluk dışı hesap açılmamasını sağlıyoruz. Üniversite öğreniminizin sonuna
						geldiğinizde, üniversite e-postanızın da kapanmasıyla hesabınız da kapatılacaktır.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>
						Fuhuş, İnsan Tacirliği ve Dolandırıcıllık
					</Text>
					<Text style={styles.tcP}>
						İnsan tacirliği, ticari cinsel ilişkiler ve rıza karşıtı her türlü cinsellik sıkı bir
						şekilde yasaktır ve bunu pazarlayan, teşvik eden ya da öven tüm hesaplar kapatılacaktır.
					</Text>
					<Text style={styles.tcP}>
						Aynı zamanda dorm’da diğer kullanıcılardan para alabilmek için hesabını paylaşan, diğer
						kullanıcıların bilgilerini alarak dolandırdığı tespit edilen hesaplar kapatılacaktır.{" "}
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>Şikayet</Text>
					<Text style={styles.tcP}>
						dorm’u güvenli ve keyifli tutmayı birlikte başarabiliriz! Topluluk kurallarımıza aykırı
						gördüğünüz her şeyi profilin üzerindeki ayarlar bölmesinden bayrak işaretine tıklayarak
						şikayet edebilirsiniz. İstediğiniz kadar şikayette bulunma hakkına sahipsiniz, ekibimiz
						topluluk kurallarına göre inceleyerek gerekli önlemi alacaktır, ayrıca sizi rahatsız
						eden hesapları her zaman engelleme şansınız var!
					</Text>
					<Text style={styles.tcP}>
						Önemli not: Fikriniz bizim için değerli, dilediğiniz gibi şikayet ve öneride
						bulunabilirsiniz! Ama unutmayın: dorm’da herkes olduğu kişi olarak değerli, cinsel
						eğilim, cinsiyet ya da etnik kökenden dolayı hedef alarak kötü niyetli şikayet
						yapıldığını tespit ettiğimiz durumda şikayet etme hakkınız veya hesabınız elinizden
						alınma şansı var.
					</Text>

					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Checkbox
							style={{ margin: 8 }}
							value={isChecked}
							onValueChange={setChecked}
							color={isChecked ? "#4630EB" : undefined}
						/>
						<Text>
							{" "}
							<Text style={{ color: "blue" }}>Mahremiyet Politikasını</Text>,{" "}
							<Text style={{ color: "blue" }}>Kullanıcı Sözleşmesini</Text> &{" "}
							<Text style={{ color: "blue" }}>Topluluk Kurallarını</Text> okudum ve kabul ediyorum.
						</Text>
					</View>
				</View>
			</ScrollView>

			<TouchableOpacity
				disabled={!isChecked}
				onPress={() => {
					navigation.replace("Register");
				}}
				style={isChecked ? styles.button : styles.buttonDisabled}
			>
				<Text style={styles.buttonLabel}>Kabul ediyorum</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = {
	header: {
		backgroundColor: colors.white,
		width: "100%",
		height: 60,
		elevation: 20,
		flexDirection: "row",
		alignItems: "flex-end",
		paddingLeft: 10,
		paddingBottom: 10,
	},
	container: {
		backgroundColor: "#F4F3F3",
	},
	title: {
		fontSize: 24,
		alignSelf: "center",
	},
	tcP: {
		marginTop: 10,
		marginBottom: 10,
		fontSize: 14,
	},
	tcP: {
		marginTop: 10,
		fontSize: 14,
	},
	tcL: {
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 10,
		fontSize: 14,
	},
	tcContainer: {
		marginTop: 15,
		marginBottom: 15,
		height: height * 0.75,
	},

	button: {
		backgroundColor: "#136AC7",
		borderRadius: 5,
		padding: 10,
	},

	buttonDisabled: {
		backgroundColor: "#999",
		borderRadius: 5,
		padding: 10,
	},

	buttonLabel: {
		fontSize: 14,
		color: "#FFF",
		alignSelf: "center",
	},
};
