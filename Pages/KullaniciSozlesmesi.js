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

import commonStyles from "../visualComponents/styles";
import { colors, Gradient, GradientText } from "../visualComponents/colors";
const { width, height } = Dimensions.get("window");

export default function KullaniciSozlesmesi({ navigation, route }) {
	return (
		<View style={styles.container}>
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
					text={"Kullanıcı Sözleşmesi"}
					style={{ fontSize: 26, fontWeight: "bold", paddingLeft: 0 }}
				/>
			</View>
			<ScrollView style={styles.tcContainer}>
				<View style={{ paddingHorizontal: 20 }}>
					<Text style={styles.tcP}>
						Bir mobil cihaz, mobil uygulama veya bilgisayar (topluca “Hizmet”) üzerinden, bir dorm
						hesabı oluşturarak
					</Text>
					<Text style={styles.tcL}>{"\u2022"} Bu kullanım şartlarına</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Her biri atıf yolu ile bu Sözleşmeye dahil edilmiş olan Gizlilik Politikamız
						ve Topluluk Kurallarımıza
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmet üzerinden sunduğumuz ek özellik, ürün veya hizmetleri satın aldığınız
						takdirde, tarafınıza bildirilen ve tarafınızca kabul edilen tüm şartlara (toplu olarak,
						bu "Sözleşmeye") bağlı olmayı kabul edersiniz
					</Text>
					<Text style={styles.tcP}>
						Bu sözleşmenin tüm şartlarına bağlı olmayı kabul etmiyor ve onaylamıyorsanız lütfen
						Hizmeti kullanmayın.
					</Text>
					<Text style={styles.tcP}>
						Zaman zaman bu Sözleşmede ve Hizmette değişiklikler gerçekleştirebiliriz. Bunu
						kanunlardaki değişiklikleri veya gereksinimleri yansıtmak, yeni özellikler veya işletme
						pratiklerinde değişiklikler yapmak gibi çeşitli nedenlerden dolayı yapabiliriz. Bu
						Sözleşmenin en güncel versiyonu, Ayarlar altında Hizmet bölümünde ve aynı zamanda
						meetdorm.com adresinde yayınlanacak olup en güncel versiyonunu düzenli olarak kontrol
						etmeniz gerekmektedir. En güncel versiyon geçerli olan versiyondur. Değişiklikler hak
						veya yükümlülüklerinizi etkileyen önemli değişiklikler ise, (ilgili kanun uyarınca bir
						engel olmadığı takdirde) değişikliklerden en az 30 gün önce sizi Hizmet üzerinden
						bildirim veya e-posta yolu dahil olmak üzere uygun yollardan haberdar edeceğiz.
						Değişiklikler geçerli olduktan sonra Hizmeti kullanmaya devam ederseniz, tadil edilmiş
						Sözleşmeyi kabul etmiş sayılırsınız.
					</Text>
					<Text style={styles.tcP}>
						Aşağıdakilerin tümü doğru olmadıkça, bir hesap oluşturma veya Hizmete veya hizmetin
						bulunduğu sistemlere erişme veya bunları kullanma yetkiniz yoktur:
					</Text>
					<Text style={styles.tcL}>{"\u2022"} En az 18 yaşında olmalısınız.</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Bir üniversitede öğrenci olarak kaydınız olmalı.
					</Text>
					<Text style={styles.tcL}>{"\u2022"} dorm ile bağlayıcı bir şözleşme yapabilirsiniz,</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Bu Sözleşme'ye ve ilgili tüm yerel, ulusal ve uluslararası yasa, kural ve
						düzenlemelere uyacaksınız
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Bir ağır suçtan veya resen takibi gereken suçtan (veya benzer derecedeki bir
						suçtan), cinsel suçtan veya şiddet içeren herhangi bir suçtan hüküm giymemeniz ve hiçbir
						cinsel suç kaydında bir cinsel suçlu olarak kayıtlı olmamanız gerekmektedir.
					</Text>
					<Text style={styles.tcP}>
						dorm'a kaydolurken kullandığınız giriş bilgilerinizn gizliliğini korumaktan siz
						sorumlusunuz. Ayrıca, bu kimlik bilgileri altında oluşan tüm faaliyetlerden de sadece
						siz sorumlusunuz. Birinin hesabınıza erişim sağladığını düşünüyorsanız, lütfen derhal
						bizimle iletişime geçin.
					</Text>
					<Text style={styles.tcP}>
						dorm’da her zaman Hizmeti iyileştirmek ve size çekici ve kullanışlı bulacağınız ek
						özellikler sunmak için çabalıyoruz. Bu demek oluyor ki zaman zaman yeni ürün özellikleri
						veya iyileştirmeleri eklemenin yanı sıra bazı özellikleri kaldırabiliriz ve bu eylemler
						haklarınızı veya zorunluluklarınızı önemli derece etkilemez ise, onları
						gerçekleştirmeden önce size haber vermeyebiliriz. Hatta Hizmeti tamamen durdurabiliriz
						ve bu durumda, güvenlik endişesi gibi size haber vermemizi engelleyebilecek durumlar
						dışında, size öncesinde haber vereceğiz.
					</Text>
					<Text style={styles.tcP}>
						<Text>
							Hesabınızı dilediğiniz zaman, herhangi bir nedenle Hizmet içinde bulunan "Ayarlar"daki
							talimatları takip ederek sonlandırabilirsiniz.
						</Text>
						<Text style={{ fontWeight: "bold" }}>
							{" "}
							Ancak, Apple App Store veya iTunes Store (“App Store”) veya Google Play Store gibi
							üçüncü taraf bir ödeme hesabı kullanıyorsanız ek faturalardan kaçınmak için uygulama
							içi satın alımları bu türden bir hesap üzerinden yönetmeniz gerekecektir.
						</Text>
						<Text>
							{" "}
							dorm, bu Sözleşme'yi ihlal ettiğiniz kanısında olur ise dilediği zaman hesabınızı
							sonlandırabilir. Bu tür bir sonlandırma durumunda, satın alımlarınız için herhangi bir
							geri ödeme yapılmaz.
						</Text>
					</Text>
					<Text style={styles.tcP}>
						dorm her ne kadar üyelerin her ikisinin de birbirleri ile ilgi duyduğunu belirttiği
						takdirde iletişim kurmalarına olanak sağlayan karışılıklı rıza gibi özelliklerle saygılı
						bir kullanıcı deneyimini teşvik etmek için çabalasa ve kötü niyetli kişileri rapor
						edildikleri takdirde uygulama kullanımından men edeceğini belirtse de, herhangi bir
						kullanıcının Hizmetteki veya Hizmet dışındaki davranışından sorumlu değildir. Hizmetin
						dışında iletişime geçmeye, yüz yüze tanışmaya veya birlikte bir etkinliğe gitmeye karar
						verdiğiniz durumlar başta olmak üzere diğer üyelerle gerçekleştirdiğiniz tüm
						iletişimlerinizde dikkatli olacağınızı kabul edersiniz.
					</Text>
					<Text style={styles.tcP}>
						dorm, uygulamada yer verdiği etkinliklerin, mekanların veya kampüs-içi etkinliklerin
						güvenliğinden sorumlu değildir. Etkinliklere gittiğinizde ve başka dorm kullanıcılarıyla
						burada etkileşime geçtiğinizde dikkatli olacağınızı kabul edersiniz.
					</Text>
					<Text style={styles.tcP}>
						Diğer kullanıcılara mali bilgilerinizi (örneğin kredi kartı veya banka kartı
						bilgilerinizi) vermeyeceğinizi, banka havalesi ile veya başka türlü para
						göndermeyeceğinizi kabul edersiniz.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold" }]}>
						Diğer üyelerle olan etkileşimlerinizden yalnızca siz sorumlusunuz. dorm’un, üyelerine
						sabıka kaydı sorgusu yapmadığını veya geçmişlerini araştırmadığını kabul edersiniz.
						dorm, üyelerinin davranışları veya uyumluluğu bakımından herhangi bir temsilde veya
						garantide bulunmaz.
					</Text>
					<Text style={styles.tcP}>
						dorm size Hizmet'e erişmeniz ve kullanmanız için özel, telif hakkı olmayan,
						devredilemez, özel olmayan, geri alınabilir, ve alt lisanslanamayan bir lisans verir.
						İşbu lisansın tek amacı, Hizmet'in dorm tarafından amaçlanan ve bu Sözleşme tarafından
						sağlanan faydalarını kullanmanız ve onlardan yararlanmanızdır. Bu lisans ve Hizmet'e
						erişim yetkisi, aşağıdakilerden herhangi birini yapmanız durumunda otomatik olarak iptal
						edilir:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmeti veya Hizmetteki herhangi bir içeriği bizim yazılı onayımız olmadan
						herhangi bir ticari amaçla kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmet aracılığıyla erişilebilen herhangi bir telifli materyali, görüntüyü,
						ticari markayı, ticari ismi, hizmet markasını veya başka fikri ürünleri, içeriği veya
						özel bilgiyi dorm’un önceden yazılı onayı olmadan herhangi bir şekilde kopyalamak,
						değiştirmek, iletmek, ondan türetilmiş eserler oluşturmak, kullanmak veya çoğaltmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Herhangi bir beyanınıza dorm tarafından onay verildiğini açıklamak veya ima
						etmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmete veya içeriklerine erişmek, bunları geri almak, endekslemek, “veri
						madenciliği yapmak” veya gezinme yapısını veya sunumunu herhangi bir şekilde taklit
						etmek ya da etrafından dolanmak için herhangi bir robot, bot, örümcek, crawler, scraper,
						site arama/geri alma uygulaması, proxy veya başka manuel ya da otomatik cihaz, yöntem
						veya süreçleri kullanmak
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmet'i veya sunucuları veya Hizmet'e bağlı ağları engelleyecek, aksatacak
						veya olumsuz olarak etkileyecek şekilde kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Virüs veya diğer kötü amaçlı yazılımları yüklemek veya Hizmet'in güvenliğini
						tehlikeye atmak
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmet'e veya Hizmet aracılığıyla iletilen herhangi bir bilginin menşeini
						gizlemek için başlıkları taklit etmek veya tanıtıcıları başka türlü manipüle etmek
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} dorm’un önceden yazılı izni olmadan, Hizmetin herhangi bir kısmını “çerçeve
						içinde göstermek” veya “yansıtmak”
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Herhangi bir kişiyi herhangi bir amaçla bir başka web sitesine yönlendirmek
						için dorm veya Hizmet'e (veya dorm’un herhangi bir ticari markası, ticari ismi, hizmet
						markası, logosu veya sloganına) herhangi bir gönderme içeren meta etiketleri, kodlar
						veya diğer cihazlar kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmet'in herhangi bir kısmını değiştirmek, uyarlamak, alt lisans vermek,
						tercüme etmek, satmak, tersine mühendisliğini yapmak, şifresini çözmek, kaynak koduna
						dönüştürmek veya başka türlü tersine çevirmek veya başkalarının böyle davranmasına sebep
						olmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} yazılı iznimiz olmadan, Hizmet veya diğer üyelerin İçerikleri veya bilgileri
						ile etkileşime girecek üçüncü taraf uygulamalar kullanmak veya geliştirmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Yazılı onayımız olmadan dorm uygulaması programlama ara yüzünü kullanmak,
						buna erişmek veya yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmetimizin veya herhangi bir sistemin veya ağın zafiyetlerini araştırmak,
						taramak veya test etmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Bu Sözleşme'ye aykırı herhangi bir faaliyeti teşvik etmek veya desteklemek.
					</Text>
					<Text style={styles.tcP}>
						dorm, hesabınızın feshedilmesi dahil olmak üzere, Hizmetin yasa dışı veya yetkisiz
						kullanımlarını araştırabilir ve uygun yasal işlemi başlatabilir.
					</Text>
					<Text style={styles.tcP}>
						Size sağladığımız herhangi bir yazılım; yükseltme, güncelleme veya diğer yeni
						özellikleri otomatik olarak indirebilir ve yükleyebilir. Bu otomatik indirme işlemlerini
						cihazınızın ayarlarından ayarlayabilirsiniz.
					</Text>
					<Text style={styles.tcP}>
						Bir hesap oluşturarak Hizmet üzerinde paylaştığınız, yüklediğiniz, gösterdiğiniz veya
						görülebilir olarak işaretlediğiniz, örneğin profilinizdeki bilgiler veya gideceğiniz
						etkinlikler gibi, (toplu olarak, "paylaşımlar") veya diğer üyelere gönderdiğiniz (toplu
						olarak, "İçerik") bilgilere ev sahipliği yapmak, bunları saklamak, kullanmak,
						kopyalamak, göstermek, çoğaltmak, uyarlamak, düzenlemek, yayınlamak, değiştirmek ve
						dağıtmak için dorm'a transfer edilebilir, alt lisanslanabilir, telif hakkı olmayan bir
						hak ve lisans verirsiniz. dorm’un İçerikleriniz için lisansı inhisari olmayan bir lisans
						olacaktır ancak Hizmetin kullanımıyla oluşturulan ikincil çalışmalar hususunda dorm’un
						lisansı inhisari olacaktır. Örneğin dorm, İçeriklerinizin bulunduğu Hizmet ekran
						görüntüleri için inhisari bir lisansa sahip olacaktır. Ek olarak dorm’un İçeriğinizin
						Hizmet dışında kullanılmasını önleyebilmesi için, diğer üyeler veya üçüncü taraflar
						tarafından Hizmet içinden edinilen İçeriğinizin ihlale yol açan kullanımları konusunda
						sizin adınıza hareket etmesi için dorm’u yetkilendirirsiniz. Bu, bilhassa
						İçeriklerinizin üçüncü taraflarca Hizmet dışından alınması ve kullanılması durumunda
						sizin adınıza uyarı göndermek için yetkiyi içerir, ancak bir zorunluluk değildir.
						İçeriklerinize olan lisansımız, geçerli yasalar (örneğin bu yasalar tarafından tanımlı
						bir şekilde kişisel bilgilerinizi içeren herhangi bir İçerik için kişisel veri koruması
						ile ilgili olan Kişisel Verilerin Korunması Kanunu) kapsamındaki haklarınıza tabidir ve
						Hizmetin işletilmesi, geliştirilmesi, sunulması, ve iyileştirilmesi ile yeni hizmetlerin
						araştırılması ve geliştirilmesi gibi sınırlı amaçlar içindir. Yerleştirdiğiniz veya bize
						Hizmet üzerinde yerleştirmek için izin verdiğiniz herhangi bir içerik, diğer üyeler
						tarafından görüntülenebilir ve Hizmeti ziyaret eden veya ona katılan (diğer dorm üyeleri
						tarafından paylaşılan İçeriği edinen kişiler gibi) herhangi bir kişi tarafından
						görüntülenebilir.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold" }]}>
						Hesabınızın oluşturulması üzerine gönderdiğiniz tüm bilgilerin doğru ve gerçek olduğunu,
						İçeriği Hizmet üzerinden yayınlama ve dorm’a yukarıdaki lisansı verme hakkına sahip
						olduğunuzu kabul etmektesiniz.
					</Text>
					<Text style={styles.tcP}>
						Hizmet'in bir parçası olarak yayınladığınız herhangi bir İçeriği izleyebileceğimizi veya
						inceleyebileceğimizi anlamakta ve kabul etmektesiniz. Bizim tek başımıza vereceğimiz
						karara göre bu Sözleşme'ye aykırı olan veya Hizmet'in itibarına zarar verebilecek olan
						herhangi bir İçeriği kısmen veya tamamen silebiliriz.
					</Text>
					<Text style={styles.tcP}>
						Müşteri hizmetleri temsilcilerimizle iletişim kurarken saygılı ve nazik olacağınızı
						kabul edersiniz. Müşteri hizmetleri temsilcilerimizden herhangi birisine veya diğer
						çalışanlara karşı davranışınızın herhangi bir zamanda tehditkar, rahatsız edici veya
						saldırgan olduğunu hissedersek, hesabınızı derhal sonlandırma hakkımızı saklı tutarız.
					</Text>
					
					<Text style={styles.tcP}>
						dorm’un kanunların gerektirdiği hallerde, tarafınızla yapılan anlaşmanın yerine
						getirilmesi için veya aşağıdaki durumlarda olduğu gibi erişim, saklama veya ifşanın
						gerekli olduğuna iyi niyetli bir şekilde inanılan hallerde; hesap bilgilerinize
						erişebileceğini, bunları muhafaza edebileceğini ve ifşa edebileceğini kabul edersiniz:
					</Text>
					<Text style={styles.tcL}>(i) yasal sürece uymak;</Text>
					<Text style={styles.tcL}>(ii) bu Sözleşmeye riayet etmek;</Text>
					<Text style={styles.tcL}>
						(iii) herhangi bir İçeriğin üçüncü tarafların haklarını ihlal ettiğine dair iddialara
						yanıt vermek;
					</Text>
					<Text style={styles.tcL}>(iv) sizin müşteri hizmetleri taleplerinize yanıt vermek</Text>
					<Text style={styles.tcL}>
						(v) Şirketin veya herhangi bir başka kişinin haklarını, malını veya kişisel güvenliğini
						korumak.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 20 }]}>Topluluk Kuralları</Text>
					<Text style={styles.tcP}>
						Hizmeti kullanmakla aşağıdakileri yapmayacağınızı kabul edersiniz:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmet'i, yasa dışı veya bu Sözleşme tarafından yasaklanmış herhangi bir amaç
						için kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hizmeti herhangi bir zararlı veya kötü amaçla kullanmak
					</Text>
					<Text style={styles.tcL}>{"\u2022"} Hizmeti dorm’a zarar verme amacıyla kullanmak</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Zaman zaman güncellenen{" "}
						<Text style={{ fontWeight: "bold" }}>Topluluk Kurallarımızı</Text> ihlal etmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} İstenmeyen e-postalar göndermek, üyelerden para istemek veya üyeleri
						dolandırmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Herhangi bir kişi veya kuruluşu taklit etmek veya izni olmadan bir başka
						kişinin görüntülerini yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Herhangi bir kişiyi hedef alarak zorbalık yapmak, "ısrarlı takip etmek",
						tehdit etmek, saldırmak, incitmek veya karalamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Herhangi bir kişinin reklam, özel hayatın gizliliği, telif, ticari marka veya
						diğer fikri mülkiyet veya sözleşme hakkı dahil haklarını ihlal eden veya haklarına halel
						getiren herhangi bir İçerik yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Nefret söylemi, tehdit edici, cinsel açıdan müstehcen veya pornografik
						herhangi bir İçerik yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Şiddeti kışkırtan veya çıplaklık, vahşet içeren veya uygunsuz şiddet içeren
						herhangi bir İçerik yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Irkçılık, bağnazlık, nefret ya da herhangi bir grup veya bireye karşı her
						türlü fiziksel zarar teşvik eden herhangi bir içerik göndermek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Diğer üyelerden herhangi bir amaçla şifre istemek veya ticari veya yasadışı
						amaçlarla kimlik bilgileri istemek veya bir başka bir kişinin kişisel bilgilerini onun
						izni olmadan yaymak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Başka bir üyenin hesabını kullanmak, başka bir kullanıcı ile bir hesap
						paylaşmak veya birden fazla hesaba sahip olmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Hesabınızı feshetmişsek, bizim iznimiz olmadıkça bir başka hesap oluşturmak.
					</Text>
					<Text style={styles.tcP}>
						Bu Sözleşme'yi ihlal etmişseniz, Hizmet üzerinde veya dışında gerçekleştirdiğiniz
						eylemleriniz ve iletişimleriniz dahil olmak üzere herhangi bir şekilde Hizmeti kötüye
						kullanmışsanız veya dorm’un herhangi bir şekilde uygunsuz veya yasa dışı olarak gördüğü
						bir şekilde davranmışsanız, dorm hakkınızda soruşturma yapma ve/veya hesabınızı yapmış
						olduğunuz satın alım işlemleri için para iadesi yapmadan feshetme hakkını saklı tutar.{" "}
						<Text style={{ fontWeight: "bold" }}>Topluluk Kurallarımızı</Text> ihlal etmeniz
						durumunda, Hizmeti kullanma yetkiniz otomatik olarak iptal edilir.
					</Text>
					<Text style={styles.tcP}>
						dorm bu Sözleşmeye aykırı içeriği inceleme ve kaldırma hakkını saklı tutsa da, bu türden
						bir İçerik yalnız onu yayınlayan üyenin sorumluluğundadır ve dorm tüm İçeriğin bu
						Sözleşmeye uygun olacağını garanti edemez. Hizmet üzerinde bu Sözleşmeyi ihlal eden
						İçerik görürseniz, lütfen Hizmet içerisinden veya meetdorm.com/iletisim üzerinden
						şikayet edin.
					</Text>
					<Text style={styles.tcP}>
						dorm zaman zaman App Store, Google Play Store, operatör tarafından faturalandırma veya
						dorm tarafından yetkilendirilen diğer ödeme platformları aracılığıyla satın alma
						yollarıyla satılık ürün ve hizmetler (“uygulama içi satın alımlar”) sunabilir. Bir
						uygulama içi satın alım gerçekleştirmeyi seçerseniz uygun ödeme sağlayıcı ile satın
						alımınızı doğrulamanız istenecektir ve ödeme yönteminize (kartınız ya da Google Play
						Store veya App Store gibi üçüncü taraf bir hesap olabilir) ("Ödeme Yöntemi"niz)
						seçtiğiniz uygulama içi satın alım hizmetler(ler)in fiyatlarının yanı sıra, ödemenize
						uygulanabilecek satış verisi ve diğer vergiler için tarafınıza gösterilen ücretler
						yansıtılır ve dorm’un veya varsa aracı olan üçüncü taraf hesabın bu ücretleri
						yansıtmasına izin verirsiniz.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 16 }]}>
						Otomatik Yenileme; Otomatik Kart ile Ödeme
					</Text>
					<Text style={styles.tcP}>
						Bir uygulama içi satın alma yoluyla otomatik olarak yenilenen periyodik bir abonelik
						satın alırsanız, örneğin Premium üyelik gibi, Ödeme Yönteminiz siz iptal edene kadar
						abonelik için devamlı olarak faturalandırılacaktır. İlk abonelik başlangıç döneminizden
						sonra ve yine daha sonraki abonelik döneminden sonra, aboneliğiniz süre olarak öncekiyle
						eşit bir dönem için abone olurken kabul ettiğiniz fiyat üzerinden otomatik olarak
						uzatılacaktır.
					</Text>
					<Text style={styles.tcP}>
						Önceden yapılmış bir ödemeye itirazlar, App Store gibi ilgili üçüncü taraf bir hesap
						tarafından faturalandırılmışsanız bizim veya üçüncü parti şirketin Müşteri desteğine
						yönlendirilmelidir. Ayrıca size haklarınızın yanı sıra, geçerli zaman limitleri hakkında
						daha fazla bilgi verebilecek olan bankanız veya ödeme sağlayıcınız ile iletişime geçerek
						de itiraz edebilirsiniz.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold" }]}>
						Aboneliğinizi değiştirmek veya sonlandırmak isterseniz; bizdeki hesabınızı veya
						cihazınızdaki dorm uygulamasını silmiş olsanız bile, üçüncü taraf hesaba (veya mevcut
						ise dorm’dan Ayarlara) giriş yapmanız ve aboneliğinizi sonlandırmak veya iptal etmek
						için talimatları takip etmeniz gerekmektedir.
					</Text>
					<Text style={styles.tcP}>
						dorm hesabınızı veya dorm uygulamasını cihazınızdan silmek, aboneliğinizi sonlandırmaz
						veya iptal etmez; siz aboneliğinizi dorm’da veya üçüncü taraf hesabınızda sonlandırana
						veya iptal edene kadar dorm, Ödeme Yönteminizde ücretlendirilmiş tüm tutarları muhafaza
						edecektir. Aboneliğinizi sonlandırır veya iptal ederseniz, aboneliğinizi o tarihte
						geçerli abonelik döneminin sonuna kadar kullanabilirsiniz ve aboneliğiniz geçerli
						dönemden sonra yenilenmez.
					</Text>
					<Text style={styles.tcP}>
						dorm uygulamasını ziyaret edip Ayarlara giderek Ödeme Yöntemi bilgilerinizi
						düzenleyebilirsiniz. Ödeme işlemi, geçerlilik tarihlerinin dolması, yetersiz bakiye veya
						başka bir nedenle başarı ile gerçekleşmezse ve Ödeme Yöntemi bilgilerinizi düzenlemez,
						aboneliğinizi sonlandırmaz veya iptal etmezseniz, tahsil edilmeyen tutarlardan sorumlu
						olursunuz ve Ödeme Yönteminizi güncellendiği şekliyle faturalandırmaya devam etme
						yetkisini bize verirsiniz. Bu işlem, fatura kesim tarihlerinizde bir değişikliğe neden
						olabilir. Ayrıca bizi kredi kartı veya banka kartı sağlayıcınız tarafından sağlanan
						güncellenmiş veya yenilenmiş kredi kartı veya banka kartı geçerlilik tarihlerini veya
						numaralarını edinmemiz için yetkilendirirsiniz. Ödeme tarihleri, Ödeme Yönteminize göre
						belirlenecek olup siz ile seçtiğiniz Ödeme Yönteminin sahibi olan finansal kurum, kredi
						kartı sağlayıcısı veya başka sağlayıcılar arasında yapılan sözleşmelere göre
						belirlenebilecektir.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>Para İadeleri</Text>
					<Text style={styles.tcP}>
						Kısmen kullanılmış dönemler için hiçbir para veya kredi iadesi söz konusu olamaz.
					</Text>
					<Text style={styles.tcP}>
						Türkiye Tüketici kanununa göre, tüketicinin{" "}
						<Text style={{ fontWeight: "bold" }}>
							14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
							sözleşmeden cayma hakkı mevcuttur.
						</Text>{" "}
						Tüketici haklarınızı kullanarak hizmetleri kullanmamış olmanız şartıyla bu iadeyi talep
						edebilirsiniz.
					</Text>
					<Text style={styles.tcP}>Para iadesi talep etmek için:</Text>
					<Text style={styles.tcP}>
						Satın alma işlemini Apple Kimliğinizi kullanarak gerçekleştirdiyseniz, para iadeleri
						dorm tarafından değil Apple tarafından idare edilir. Para iadesi talep etmek için App
						Store'a gidin, Apple Kimliğinize tıklayın, “Satın alma geçmişi”ni seçin, işlemi bulun ve
						“Sorun Bildir”e tıklayın. Ayrıca{" "}
						<Text style={{ color: "blue", textDecorationLine: "underline" }}>
							https://getsupport.apple.com
						</Text>{" "}
						adresinden de talep gönderebilirsiniz.
					</Text>
					<Text style={styles.tcP}>
						Google Play Store hesabınızı kullanarak satın alım yaptıysanız: Lütfen (onay
						e-postasından veya Google Wallet'a giriş yaparak öğrenebileceğiniz) Google Play Store
						sipariş numaranız veya (onay e-postanızda bulabileceğiniz) dorm sipariş numaranız ile
						birlikte müşteri desteği birimiyle iletişime geçin. Ayrıca, satın alan olarak sizin bu
						Sözleşmeyi iptal ettiğinizi belirten veya benzer kelimeler içeren imzalı ve tarihli bir
						bildirimi e-posta yoluyla gönderebilirsiniz. Eğer iptal etme hakkınızı kullanırsanız
						(Apple'ın kontrol ettiği Apple Kimliği üzerinden yapılan satın alımlar hariç), aşırı
						gecikme olmadan ve her durumda Sözleşmeyi iptal etme kararınızın bildirimini aldıktan
						sonraki 14 gün içinde, sizden aldığımız tüm ödemeleri Google'dan iade etmesini talep
						edeceğiz. Bu türden iadeyi ilk başta tarafınızca kullanılan ödeme yöntemine
						gerçekleştireceğiz. Her durumda, iade nedeniyle sizden potansiyel transfer ücretleri
						haricinde hiçbir ücret tahsil edilmeyecektir.
					</Text>
					<Text style={styles.tcP}>
						Yukarıda listelenmeyen bir ödeme platformu aracılığıyla satın alma işlemi yaptıysanız,
						lütfen doğrudan satın alma işleminizi gerçekleştirdiğiniz üçüncü taraf satıcı ile
						iletişime geçerek para iadesi isteyin.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 16 }]}>Fiyatlandırma</Text>
					<Text style={styles.tcP}>
						dorm, yeni çıkan bir uygulama olarak fiyatlandırma politikalarını sürekli
						kullanıcılarına göre test etmektedir ve değiştirme haklarını kendinde saklı tutar.
						Belirli dönemlerde belirli hizmetler üzerinden fiyatlandırma politikalarında indirime
						gidebilir.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>
						Telif Hakkı İhlalleri ile İlgili Şikayetlere İlişkin Bildiri ve İlgili Prosedür
					</Text>
					<Text style={styles.tcP}>
						Çalışmanızın telif hakkı ihlali oluşturacak bir şekilde kopyalandığına ve Hizmet
						üzerinde yayınlandığına inanıyorsanız lütfen{" "}
						<Text style={{ color: "blue", textDecorationLine: "underline" }}>
							business@meetdorm.com
						</Text>{" "}
						bir kaldırma talebi gönderin.
					</Text>
					<Text style={styles.tcP}>
						Telif hakkı ihlali iddiasıyla ilgili olarak bizimle iletişime geçerken lütfen aşağıdaki
						bilgileri tarafımıza sağladığınızdan emin olun:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Telif hakkının sahibi adına hareket etmeye yetkili kişinin elektronik veya
						fiziksel imzası
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} İhlal edildiğini iddia ettiğiniz telifli eserin bir açıklaması
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} İhlal edici nitelikteki materyalin Hizmet üzerinde bulunduğu yerin bir
						açıklaması (bu açıklama bizim ihlal edici olduğu iddia edilen materyali bulmamızı
						sağlamaya makul olarak yeterli olmalıdır)
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Adres, telefon numarası ve e-posta adresi dahil olmak üzere iletişim
						bilgileriniz ve telif hakkı sahibinin kimlik bilgileri
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Karşı çıkılan kullanıma telif hakkı sahibinin, vekilinin veya yasaların yetki
						vermediğine iyi niyetle inandığınıza dair sizin tarafınızdan yazılı bir beyan
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"} Yalan beyanda bulunmanın cezasını göz önüne alarak, bildiride yer alan
						yukarıdaki bilgilerin doğru olduğuna ve telif hakkı sahibi olduğunuza veya telif hakkı
						sahibi adına hareket etmeye yetkili bulunduğunuza dair yeminli beyanınız
					</Text>
					<Text style={styles.tcP}>dorm, mükerrer ihlalcilerin hesaplarını feshedecektir.</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 18 }]}>Sorumluluğun Reddi</Text>
					<Text style={styles.tcP}>
						dorm Hi̇zmet'i̇ “olduğu gi̇bi̇” ve “müsai̇t olduğu şeki̇lde” sağlamaktadir ve hi̇zmet i̇le
						i̇lgi̇li̇ olarak (i̇çerdi̇ği̇ tüm i̇çeri̇k dahi̇l) yürürlükteki̇ yasalarin i̇zi̇n verdi̇ği̇ ölçüde,
						sınırlama olmaksızın tatmi̇n edi̇ci̇ kali̇te, ti̇carete uygunluk, beli̇rli̇ bi̇r amaca uygunluk
						veya i̇hlal etmeme dahi̇l açik, zimni̇, yasal veya başka türlü hi̇çbi̇r çeşi̇t garanti̇
						vermemektedi̇r. dorm (a) Hi̇zmeti̇n kesi̇nti̇si̇z, güvenli̇ veya hatasiz olacaği, (b)
						Hi̇zmetteki̇ herhangi̇ bi̇r kusur veya hatanin düzelti̇leceği̇, veya (c) Hi̇zmet üzeri̇nden veya
						hi̇zmet araciliğiyla elde etti̇ği̇ni̇z herhangi̇ bi̇r i̇çeri̇k veya bi̇lgi̇ni̇n doğru olacağını
						beyan etmemekte veya garanti̇ etmemektedi̇r.
					</Text>
					<Text style={styles.tcP}>
						dorm si̇zi̇n, bi̇r başka üyeni̇n ya da üçüncü tarafin hi̇zmet araciliğiyla yayinladiği,
						gönderdi̇ği̇ veya aldiği herhangi̇ bi̇r i̇çeri̇k hakkinda sorumluluk kabul etmemektedi̇r.
						hi̇zmeti̇n kullanimi araciliğiyla i̇ndi̇ri̇len veya başka şeki̇lde elde edi̇len herhangi̇ bi̇r
						materyale, kendi̇ takdi̇ri̇ni̇zle ve ri̇ski̇ si̇ze ai̇t olmak üzere eri̇şi̇lmektedi̇r.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 16 }]}>
						Üçüncü Taraf Hizmetleri
					</Text>
					<Text style={styles.tcP}>
						hizmet, üçüncü taraflarca sunulan reklamlar ve promosyonlar ile diğer web sitelerine
						veya kaynaklara bağlantılar içerebilir. dorm bu harici web sitelerinin veya kaynakların
						ulaşılabilir olmasından (veya olmamasından) sorumlu değildir. hizmetimiz aracılığıyla
						ulaşılabilir kılınan üçüncü taraflarla etkileşime geçmeyi seçerseniz, sizinle ilişkileri
						söz konusu tarafın şartlarına tabi olacaktır. dorm bu gibi üçüncü tarafların
						şartlarından veya eylemlerinden sorumlu değildir. dorm aynı zamanda yönlendirdiği
						etkinliklerin güvenliğinden, gerçekleşmesinden, kalitesinden de sorumlu değildir.
					</Text>
					<Text style={[styles.tcP, { fontWeight: "bold", fontSize: 16 }]}>
						Sormluluğun Sınırlandırılması
					</Text>
					<Text style={styles.tcP}>
						Yürürlükteki̇ kanunlarin i̇zi̇n verdi̇ği̇ en geni̇ş ölçüde dorm, i̇şti̇rakleri̇, çalışanları,
						li̇sans verenleri̇ veya hi̇zmet sağlayıcıları hi̇çbi̇r durumda, ve hatta dorm öncesi̇nden
						bi̇lgi̇lendi̇ri̇lmi̇ş olsa dahi̇ aşağıda beli̇rti̇lecek sebeplerle doğrudan veya dolaylı olarak
						kaynaklanan kâr kaybi veya herhangi̇ bi̇r veri̇, kullanım, şerefi̇ye kaybi veya di̇ğer maddi̇
						olmayan kayıplar dahi̇l ve bunlarla sinirli olmamak üzere, sonuç olarak ortaya çıkan,
						örnek ni̇teli̇ği̇nde, rastlantısal, özel, ceza ni̇teli̇ği̇ndeki̇ veya artan hasarlardan sorumlu
						olmayacaktır:
					</Text>
					<Text style={styles.tcL}>
						(i) hi̇zmete eri̇şi̇mi̇ni̇z veya hi̇zmeti̇ kullaniminiz ya da eri̇şememeni̇z veya kullanamamaniz
					</Text>
					<Text style={styles.tcL}>
						(ii) hi̇zmet üzeri̇nde, hi̇zmet aracılığıyla veya hi̇zmet kullanımı sonucunda di̇ğer üyeleri̇n
						veya üçüncü tarafların sergi̇ledi̇ği̇ davranış veya üretti̇ği̇ i̇çeri̇k
					</Text>
					<Text style={styles.tcL}>
						(iii) i̇çeri̇ği̇ni̇ze yetki̇si̇z eri̇şi̇m, i̇çeri̇ği̇ni̇zi̇n yetki̇si̇z kullanimi veya deği̇şti̇ri̇lmesi̇.
					</Text>
					<Text style={styles.tcP}>
						Gizlilik Politikası ve Topluluk Kuralları ve Hizmet üzerinden teklif ettiğimiz ek
						özellik, ürün veya hizmetleri satın almanız durumunda, açıklanan ve sizin tarafınızdan
						kabul edilen tüm şartları içeren bu Sözleşme; Hizmetin kullanımıyla ilgili olarak dorm
						ile aranızdaki sözleşmenin tamamını teşkil etmektedir. Bu Sözleşmenin herhangi bir
						hükmünün geçersiz kılınması halinde, bu Sözleşmenin geri kalanı tamamen geçerli ve
						yürürlükte olmaya devam edecektir. Şirketin bu Sözleşmenin herhangi bir hakkını veya
						hükmünü uygulamaması, söz konusu hak veya hükümden feragat teşkil etmeyecektir. dorm
						hesabınızın devredilebilir olmadığını, hesabınız ve İçeriği ile ilgili haklarınızın
						tamamının ölümünüz üzerine sona ereceğini kabul etmektesiniz. Bu Sözleşmenin bir sonucu
						olarak hiçbir temsilcilik, ortaklık, ortak teşebbüs, mütevelli veya diğer özel ilişki
						veya istihdam yaratılmamaktadır ve herhangi bir şekilde dorm namına beyanda bulunamaz
						veya dorm’u bağlı tutamazsınız.
					</Text>
				</View>
			</ScrollView>
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
		height: height * 0.84,
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
