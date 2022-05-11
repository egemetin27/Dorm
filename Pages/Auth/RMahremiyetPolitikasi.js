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
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
const { width, height } = Dimensions.get("window");

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
	const paddingToBottom = 20;
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export default function RMahremiyetPolitikasi({ navigation }) {
	const insets = useSafeAreaInsets();
	const [state, setState] = React.useState(false);
	return (
		<View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
			<StatusBar style={"dark"} translucent={false} backgroundColor={colors.white} />
			<View name={"Header"} style={styles.header}>
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
					text={"KVKK Politikası"}
					style={{ fontSize: 26, fontWeight: "bold", paddingLeft: 0 }}
				/>
			</View>
			<ScrollView
				style={styles.tcContainer}
				onScroll={({ nativeEvent }) => {
					if (isCloseToBottom(nativeEvent)) {
						setState(true);
					}
				}}
			>
				<View style={{ paddingHorizontal: 20 }}>
					<Text style={styles.tcPB}>
						KİŞİSEL VERİLERİN KORUNMASI HUKUKU BAĞLAMINDA AYDINLATMA METNİ
					</Text>
					<Text style={styles.tcP}>
						Dorm sosyal ağ uygulaması aracılığıyla uygulama yapım ve geliştiricisi Tanımlar başlığında belirtilen Veri Sorumlusu, veri koruma düzenlemelerine uymayı ve kişisel verilerin işlenmesiyle ilgili olarak bireylerin hak ve özgürlüklerini korumayı taahhüt eder. Sizden kişisel veri toplamamızdaki ana amacımız size yardımcı olabilmektir. Veri koruma yasaları, bireylere kendileri hakkında hangi bilgilerin tutulduğunu bilme hakkı verir ve kişisel bilgilerin uygun şekilde işlenmesini sağlamak için bir çerçeve sağlar.
					</Text>
					<Text style={styles.tcP}>
						Tanımlar
					</Text>
					<Text style={styles.tcP}>
						Kanun: 24.03.2016 tarih ve 6698 sayılı Kişisel Verilerin Korunması Kanunu
					</Text>
					<Text style={styles.tcP}>
						Kurum: Kişisel Verileri Koruma Kurumu
					</Text>
					<Text style={styles.tcP}>
						Kurul: Kişisel Verileri Koruma Kurulu
					</Text>
					<Text style={styles.tcP}>
						Veri Sorumlusu: Batuhan Yıldırım
					</Text>
					<Text style={styles.tcP}>
						Kişisel Veri: Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi ifade etmektedir.
					</Text>
					<Text style={styles.tcP}>
						Özel Nitelikli Kişisel Veri: Kişilerin ırkı, etnik kökeni, siyasi düşüncesi, felsefi inancı, dini, mezhebi veya diğer inançları, kılık ve kıyafeti, dernek, vakıf ya da sendika üyeliği, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik tedbirleriyle ilgili verileri ile biyometrik ve genetik verileri özel nitelikli kişisel veridir.
					</Text>
					<Text style={styles.tcP}>
						Açık Rıza: Belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rızayı ifade etmektedir.
					</Text>
					<Text style={styles.tcP}>
						Kişisel Verilerin İşlenmesi: Kişisel verilerin tamamen veya kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla elde edilmesi, kaydedilmesi, depolanması, muhafaza edilmesi, değiştirilmesi, yeniden düzenlenmesi, açıklanması, aktarılması, devralınması, elde edilebilir hale getirilmesi, sınıflandırılması ya da kullanılmasının engellenmesi gibi sağlık verileri üzerinde gerçekleştirilen her türlü işlemi ifade etmektedir.
					</Text>
					<Text style={styles.tcP}>
						Kişisel Verilerin İmha Edilmesi: Kişisel verilerin silinmesi, yok edilmesi veya anonim hale getirilmesini ifade etmektedir
					</Text>
					<Text style={styles.tcP}>
						Anonim hâle getirme: Kişisel verilerin, başka verilerle eşleştirilerek dahi hiçbir surette kimliği belirli veya belirlenebilir bir gerçek kişiyle ilişkilendirilemeyecek hâle getirilmesini ifade etmektedir.					
					</Text>
					<Text style={styles.tcP}>
						Kişisel Verilerin Silinmesi: Kişisel verilerin ilgili kullanıcılar için hiçbir şekilde erişilemez ve tekrar kullanılamaz hâle getirilmesi işlemini ifade etmektedir.
					</Text>
					<Text style={styles.tcP}>
						Kişisel Verilerin Yok Edilmesi: Kişisel verilerin hiç kimse tarafından hiçbir şekilde erişilemez, geri getirilemez ve tekrar kullanılamaz hâle getirilmesi işlemini ifade etmektedir.					
					</Text>
					<Text style={styles.tcP}>
						Maskeleme: Kişisel verilerin belirli alanlarının, kimliği belirli veya belirlenebilir bir gerçek kişiyle ilişkilendirilemeyecek şekilde silinmesi, üstlerinin çizilmesi, boyanması ve yıldızlanması gibi işlemleri ifade etmektedir					
					</Text>
					<Text style={styles.tcP}>
						Kimlik Bilgileri: Ad-soyad, cinsiyet, doğum tarihi, medeni durum bilgileri					
					</Text>
					<Text style={styles.tcP}>
						İletişim Bilgileri: Telefon numarası, elektronik posta adresi bilgileri
					</Text>
					<Text style={styles.tcP}>
						Felsefi İnanç Bilgisi: Felsefi inançlara ilişkin bilgiler
					</Text>
					<Text style={styles.tcP}>
						Cinsel Yönelim Bilgisi: Cinsel kimliğe ilişkin bilgiler
					</Text>
					<Text style={styles.tcP}>
						İletişim Bilgileri: Telefon numarası, elektronik posta adresi bilgileri
					</Text>
					<Text style={styles.tcP}>
						Din, Mezhep ve Diğer İnanışlar Bilgisi: Din, mezhep ve diğer inanışlar bilgileri
					</Text>
					<Text style={styles.tcP}>
						Siyasi Düşünce Bilgisi: Siyasi düşünce bilgileri
					</Text>
					<Text style={styles.tcP}>
						Irk Bilgisi: Irk bilgileri
					</Text>
					<Text style={styles.tcPB}>
						Kişisel Verileri Hangi Amaçlar Doğrultusunda Toplamaktayız
					</Text>
					<Text style={styles.tcP}>
						Gerçek kişi veri sorumlusu olarak, Dorm sosyal ağ uygulaması kullanıcı sözleşme faaliyeti kapsamında; ad-soyad, doğum tarihi, uyruk, elektronik posta adresi bilgileri bilgi güvenliği süreçlerinin yürütülebilmesi; telefon numarası, elektronik posta adresi bilgileri uygulama kullanıcıları ile iletişim faaliyetlerinin yürütülebilmesi; ad-soyad, cinsiyet, doğum tarihi, uyruk, elektronik posta adresi, telefon numarası, cinsel yönelim, ırk, felsefi inanç, din, mezhep ve diğer inanışlar, siyasi düşünce bilgileri uygulama kullanıcıları arasındaki iletişim ve sosyal faaliyet süreçlerinin yürütülebilmesi amaçları doğrultusunda işlenmektedir. 
					</Text>
					<Text style={styles.tcPB}>
						Kişisel Verilerinizi Kimlerle Paylaşıyoruz
					</Text>
					<Text style={styles.tcP}>
						Tanımlar başlığı altında yer verilen kişisel verileriniz amaca özgü bir şekilde gerek görülmesi ve talep edilmesi halinde kanunen yetkili kurum ve kuruluşlar, uygulamanın geliştirebilmesi için üçüncü kişi iş ortakları, hukuki yükümlülüklerimizi yerine getirebilmemiz için arşiv ve saklama hizmet sağlayıcıları ve gerçek kişi uygulamanın geliştirici ortakları ile paylaşılmakta olup; yurt dışı veri tabanlı bulut ortamında muhafazası sağlanmaktadır. Ayrıca iletişim faaliyetleri doğrultusunda yurt dışı veri tabanlı elektronik posta adresleri üzerinden iletişim kurulması halinde söz konusu hizmet sağlayıcı şirketlere dolaylı olarak aktarım sağlanmaktadır. Ancak söz konusu veri işleme faaliyetleri 6698 s. Kanunun 8. ve 9. maddelerini dikkate alınarak gerçekleştirilmektedir. 
					</Text>
					<Text style={styles.tcPB}>
						Kişisel Veri Toplama Yöntemlerimiz ve Sebeplerimiz
					</Text>
					<Text style={styles.tcP}>
						Veri Sorumlusu tarafından yukarıda yer verilen kişisel verileriniz sizler ile Dorm sosyal ağ uygulaması üye başvuru platformu üzerinden toplanmakla birlikte 6698 s. Kanunun 8. ve 9. maddeleri de dikkate alınarak; kimlik, iletişim, ırk, felsefi inanç, din, mezhep ve diğer inanışlar, siyasi düşünce bilgileriniz 6698 s. Kanunun 5’inci maddesinin 1’inci fıkrasının c) Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması, ç) hukuki yükümlülüğünün yerine getirilmesi ve herhangi bir hukuki ihtilaf halinde ise e) Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması bentlerinde sayılan sebepler ile; cinsel yönelim bilgileriniz ise yalnızca açık rıza vermeniz halinde işlenebilecektir. 
					</Text>
					<Text style={styles.tcPB}>
						Kişisel verileriniz ne kadar süre saklanıyor
					</Text>
					<Text style={styles.tcP}>
						Muhafaza süresinin kanuni yükümlülükler ve öngörülen amaç ile orantılı olma durumu dikkate alınarak; kişisel verileriniz, Dorm sosyal ağ uygulaması üyeliğinizin sona ermesiyle birlikte on yıl süre boyunca muhafaza edilmekle birlikte bu sürenin sona ermesiyle altı ay içerisinde tarafımızca imha edilmektedir.					</Text>
					<Text style={styles.tcPB}>
						Veri güvenliği
					</Text>
					<Text style={styles.tcP}>
						Kişisel verilerinizin kazara kaybolmasını, kullanılmasını veya yetkisiz bir şekilde erişilmesini, değiştirilmesini veya ifşa edilmesini önlemek için hem insan kaynaklı hem de doğa kaynaklı felaketlere uygun güvenlik önlemleri almaktayız.
					</Text>
					<Text style={styles.tcP}>
						Kişisel verilerinize erişimi yalnızca uygulamanın erişime yetkilendirilmiş kişileri sınırlandırıyoruz. Ayrıca sır saklama yükümlülüğü dışında bulunan ve paylaşım yapılan söz konusu kişiler (üçüncü kişiler de dahil olmak üzere) gizlilik sözleşmesi yükümlülüğüne tabidirler.
					</Text>
					<Text style={styles.tcPB}>
						Veri Sahibi İlgili Kişinin Hakları
					</Text>
					<Text style={styles.tcP}>
						İlgili Kişi;
					</Text>
					<Text style={styles.tcP}>
						Kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında  aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, KVKK ve ilgili mevzuat hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması halinde kişisel verilerin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme, kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme, haklarına sahiptir.        
					</Text>
					<Text style={styles.tcP}>
						İlgili kişinin haklarını ve bu haklarını kullanabileceği yöntemlerin anlaşılması gerçek kişi Veri Sorumlusu tarafından üzerinde durulan önemli konulardan birisidir. Bu haklar Veri Sorumlusu  tarafından yapılan veri işleme, saklama, aktarım, silme, anonimleştirme ve yok etme faaliyetlerinin her aşamasına ilişkindir. 
					</Text>
					<Text style={styles.tcPB}>
						Kişisel veri sahipleri Kanunun 11. maddesinde belirtilen hakları ile ilgili taleplerini öncelikle tarafıma iletmeleri zorunludur. 
					</Text>
					<Text style={styles.tcP}>
						Veri Sorumlusu, alınan talebi ücretsiz olarak veya işlemin ayrıca bir maliyeti gerektirmesi halinde, Kişisel Verileri Koruma Kurul’u tarafından belirlenen tarifeye göre alacağı ücret mukabilinde en kısa sürede ve en geç otuz gün içerisinde sonuçlandıracak ve ilgili veri sahibini bilgilendirecektir. Konu edilen hususta hatalı ise alınan ücret ilgiliye iade edilecektir.
					</Text>
					<Text style={styles.tcP}>
						İlgili kişi açık rıza beyanını her zaman geri alma hakkına sahiptir. Ancak belirtmek gerekir ki; açık rızanın geri alınmasının ileriye etkili olarak sonuç doğuracağı unutulmamalıdır. Açık rıza beyanınızı geri çektiğiniz hallerde Veri Sorumlusu, diğer veri işleme şartlarından herhangi birine dayanarak veri işleme faaliyeti gerçekleştirmeyecektir. 
					</Text>
					<Text style={styles.tcP}>
						Kanunun 11. maddesinde belirtilen haklardan ilgili veri sahibi kullanmayı talep ettiği hakkına yönelik açıklamalarını içeren talebini www..com adresinde bulunan başvuru formunu doldurarak imzalı bir nüshasını kimliğini tespit edici belgeler ile elektronik posta adresi-adresine iletebilir.
					</Text>
					<Text style={styles.tcPB}>
						KİŞİSEL VERİLERİN KORUNMASI HUKUKU BAĞLAMINDA CİNSEL YÖNELİM AÇIK RIZA BEYAN FORMU
					</Text>	
					<Text style={styles.tcP}>
						Dorm sosyal ağ uygulaması aracılığıyla uygulama yapım ve geliştiricisi Veri Sorumlusu tarafından 6698 Sayılı Kişisel Verilerin Korunması Kanunu’nun (“KVK Kanunu”) ilgili hükümlerine uygun olarak bilginize sunulan Kişisel Verilerin Korunması Kanunu ve Kullanıcı Aydınlatma Metni -01 kapsamında; {"\n"}İşbu bilgi ve beyanım doğrultusunda; gerçek kişi Veri Sorumlusu tarafından bilgime sunulmuş olan Dorm sosyal ağ uygulamasına ilişkin  Kullanıcı Aydınlatma Metni -01 kapsamında tarafımca cinsel yönelim bilgimin uygulama kullanıcıları arasındaki iletişim ve sosyal faaliyetlerin gerçekleştirilmesi amacıyla uygulamanın yapım ve geliştiricisine bilgime sunulmuş olan aydınlatma metninde belirtilen ve işlendikleri amaç için gerekli olan süre kadar muhafaza edilme ilkesi de dikkate alınarak verilerimin aktarılıp, kaydedilmesine, depolanmasına, muhafaza edilmesine, yeniden düzenlenmesine, değiştirilmesine açık rızamın olduğunu beyan ve taahhüt ederim.
					</Text>			
					<Text style={styles.tcPB}>
						KİŞİSEL VERİLERİN KORUNMASI HUKUKU BAĞLAMINDA BULUT BİLİŞİM HİZMET SAĞLAYICILARI AÇIK RIZA BEYAN FORMU
					</Text>
					<Text style={styles.tcP}>
					Dorm sosyal ağ uygulaması aracılığıyla uygulama yapım ve geliştiricisi veri sorumlusu tarafından 6698 Sayılı Kişisel Verilerin Korunması Kanunu’nun (“KVK Kanunu”) ilgili hükümlerine uygun olarak bilginize sunulan Kişisel Verilerin Korunması Kanunu ve Kullanıcı Aydınlatma Metni -01 kapsamında; {"\n"}İşbu bilgi ve beyanım doğrultusunda; gerçek kişi Veri Sorumlusu tarafından bilgime sunulmuş olan Dorm sosyal ağ uygulamasına ilişkin  Kullanıcı Aydınlatma Metni -01 kapsamında tarafımca ad-soyad, cinsiyet, doğum tarihi, uyruk, elektronik posta adresi, telefon numarası, cinsel yönelim, ırk, felsefi inanç, din, mezhep ve diğer inanışlar, siyasi düşünce bilgileri bilgilerimin uygulama yapım ve geliştiricisinin arşiv ve saklama faaliyetlerini gerçekleştirebilmesi için yurt dışı veri tabanlı bulut bilişim hizmet sağlayıcılara bilgime sunulmuş olan aydınlatma metninde belirtilen ve işlendikleri amaç için gerekli olan süre kadar muhafaza edilme ilkesi de dikkate alınarak verilerimin aktarılıp, kaydedilmesine, depolanmasına, muhafaza edilmesine, yeniden düzenlenmesine, değiştirilmesine açık rızamın olduğunu beyan ve taahhüt ederim.
					</Text>
					<Text style={styles.tcPB}>
						KİŞİSEL VERİLERİN KORUNMASI HUKUKU BAĞLAMINDA İLETİŞİM HİZMET SAĞLAYICILARI AÇIK RIZA BEYAN FORMU
					</Text>
					<Text style={styles.tcP}>
						Dorm sosyal ağ uygulaması aracılığıyla uygulama yapım ve geliştiricisi Veri Sorumlusu tarafından 6698 Sayılı Kişisel Verilerin Korunması Kanunu’nun (“KVK Kanunu”) ilgili hükümlerine uygun olarak bilginize sunulan Kişisel Verilerin Korunması Kanunu ve Kullanıcı Aydınlatma Metni -01 kapsamında;{"\n"}İşbu bilgi ve beyanım doğrultusunda; gerçek kişi Veri Sorumlusu tarafından bilgime sunulmuş olan Dorm sosyal ağ uygulamasına ilişkin  Kullanıcı Aydınlatma Metni -01 kapsamında tarafımca ad-soyad, cinsiyet, doğum tarihi, uyruk, elektronik posta adresi, telefon numarası, cinsel yönelim, ırk, felsefi inanç, din, mezhep ve diğer inanışlar, siyasi düşünce bilgileri bilgilerimin uygulama yapım ve geliştiricisinin iletişim faaliyetlerini gerçekleştirebilmesi için yurt dışı veri tabanlı iletişim hizmet sağlayıcılara bilgime sunulmuş olan aydınlatma metninde belirtilen ve işlendikleri amaç için gerekli olan süre kadar muhafaza edilme ilkesi de dikkate alınarak verilerimin aktarılıp, kaydedilmesine, depolanmasına, muhafaza edilmesine, yeniden düzenlenmesine, değiştirilmesine açık rızamın olduğunu beyan ve taahhüt ederim.	
					</Text>
					
				</View>
			</ScrollView>

			<TouchableOpacity
				disabled={!state}
				onPress={() => {
					navigation.replace("RKullaniciSozlesmesi");
				}}
				style={state ? styles.button : styles.buttonDisabled}
			>
				<Text style={styles.buttonLabel}>Devam</Text>
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
	tcPB: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: "bold",
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
