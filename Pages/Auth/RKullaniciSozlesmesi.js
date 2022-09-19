import { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";

//import commonStyles from "../../visualComponents/styles";
import { colors, GradientText } from "../../visualComponents/colors";
const { width, height } = Dimensions.get("window");

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
	const paddingToBottom = 20;
	return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export default function RKullaniciSozlesmesi({ navigation }) {
	const [isChecked, setChecked] = useState(false);

	const [state, setState] = useState(false);
	const insets = useSafeAreaInsets();
	return (
		<View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
			<ScrollView
				style={styles.tcContainer}
				onScroll={({ nativeEvent }) => {
					if (isCloseToBottom(nativeEvent)) {
						setState(true);
					}
				}}
			>
				<View style={{ paddingHorizontal: 20 }}>
					<Text style={styles.tcP}>
						Bir mobil cihaz, mobil uygulama veya bilgisayar (topluca “Hizmet”) üzerinden, bir Dorm hesabı oluşturarak, (i) İşbu Sözleşme’deki kullanım şartlarına, (ii) her biri atıf yolu ile bu Sözleşme’ye dahil edilmiş olan Gizlilik Politikamız ve Topluluk Kurallarımıza ve (iii) Hizmet üzerinden sunduğumuz ek özellik, ürün veya hizmetleri satın aldığınız takdirde, tarafınıza bildirilen ve tarafınızca kabul edilen tüm şartlara (toplu olarak, bu "Sözleşmeye") bağlı olmayı kabul edersiniz. Gizlilik Politikası ve Topluluk Kuralları ve Hizmet üzerinden teklif edilen  ek özellik, ürün veya hizmetlerin kullanıcı tarafından satın alınması  durumunda, açıklanan ve kullanıcı tarafından kabul edilen tüm şartları içeren işbu Sözleşme; Hizmet’in kullanımıyla ilgili olarak Dorm ile aranızdaki Sözleşmenin tamamını teşkil etmektedir. Bu Sözleşmenin tüm şartlarına bağlı olmayı kabul etmiyor ve onaylamıyorsanız lütfen Hizmeti kullanmayın.
					</Text>
					<Text style={styles.tcPB}>
						1.		SÖZLEŞME’DE YAPILACAK DEĞİŞİKLİKLER VE DEĞİŞİKLİK USULÜ
					</Text>
					<Text style={styles.tcL}>
						1.1		Dorm, bu Sözleşme’de veya Hizmette değişiklik yapma hakkını saklı tutar.
					</Text>
					<Text style={styles.tcL}>
						1.2		Bu Sözleşme’nin en güncel versiyonu, Ayarlar altında Hizmet bölümünde ve aynı zamanda meetdorm.com adresinde yayınlanacak olup kullanıcının en güncel versiyonunu düzenli olarak kontrol etmesi  gerekmektedir.
					</Text>
					<Text style={styles.tcL}>
						1.3		Sözleşme’de yapılacak esaslı değişiklikler, kullanıcıya  değişikliklerden en az 30 gün önce ve Hizmet üzerinden bildirim veya e-posta yolu ile bildirilir. Kullanıcının, değişiklikler geçerli olduktan sonra Hizmeti kullanmaya devam etmesi halinde kullanıcı,  Sözleşme’nin değişik halini kabul etmiş sayılır.
					</Text>
					<Text style={styles.tcPB}>
						2.		KULLANICININ HAK VE YÜKÜMLÜLÜKLERİ
					</Text>
					<Text style={styles.tcL}>
						2.1		Bir kullanıcının, hizmete veya hizmetin bulunduğu sistemlere erişme veya bunları kullanma yetkisini haiz olması için aşağıdaki şartların tümünü aynı anda sağlaması gerekmektedir:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Kullanıcının en az 18 yaşında olması,
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Kullanıcının, bir üniversitede öğrenci olarak kayıtlı olması
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Kullanıcının, bu Sözleşme'ye ve ilgili tüm yerel, ulusal ve uluslararası yasa, kural ve düzenlemelere uyacağını peşinen kabul etmiş olması,
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Kullanıcı hakkında, ağır bir suçtan veya resen takibi gereken suçtan, cinsel suçtan veya şiddet içeren herhangi bir suçtan kesinleşmiş mahkeme kararı olmaması ve hiçbir cinsel suç kaydında bir cinsel suçlu olarak kayıtlı olmaması
					</Text>
					<Text style={styles.tcL}>
						2.2		Kullanıcı, Dorm'a kaydolurken kullandığı giriş bilgilerinin gizliliğinin korunmasından şahsen sorumludur. Kullanıcının, hesabına üçüncü bir kişi veya tarafın erişim sağladığı kanaatine varması halinde Dorm ile iletişime geçmesi gerekmektedir.
					</Text>
					<Text style={styles.tcL}>
						2.3		Kullanıcı, dilediği zaman hesabını herhangi bir nedenle Hizmet içinde bulunan "Ayarlar"daki talimatları takip ederek sonlandırabilir. Ancak kullanıcının, Apple App Store veya iTunes Store (“App Store”) veya Google Play Store gibi üçüncü taraf bir ödeme hesabı kullanması halinde ek faturalardan kaçınmak için uygulama içi satın alımları bu türden bir hesap üzerinden yönetmesi gerekli olup, söz konusu hesap yönetiminden kullanıcı şahsen sorumludur.
					</Text>
					<Text style={styles.tcL}>
						2.4		Dorm, her ne kadar kullanıcıların birbirlerine ilgi duyduğunu belirttiği takdirde iletişim kurmalarına olanak sağlayan karşılıklı rıza gibi özelliklerle, saygılı bir kullanıcı deneyimini teşvik etmek için çabalasa ve kötü niyetli kullanıcıların rapor edilmeleri halinde bu kullanıcıların uygulama kullanımından men edeceğini belirtse de, herhangi bir kullanıcının Hizmetteki veya Hizmet dışındaki davranışından sorumlu tutulamaz. Kullanıcıların, Hizmetin dışında iletişime geçmeye, yüz yüze tanışmaya veya birlikte bir etkinliğe gitmeye karar verdiği durumlar başta olmak üzere diğer kullanıcılar ile gerçekleştirdikleri tüm iletişimlerinde dikkatli olacaklarını kabul ederler.
					</Text>
					<Text style={styles.tcL}>
						2.5		Dorm, uygulamada yer verdiği etkinliklerin, mekanların veya kampüs-içi etkinliklerin güvenliğinden sorumlu değildir. Kullanıcıların etkinliklere gitmeleri veya başka Dorm kullanıcılarıyla burada etkileşime geçtiklerinde dikkatli olacaklarını kabul ederler.
					</Text>
					<Text style={styles.tcL}>
						2.6		Kullanıcı, diğer kullanıcılara mali bilgilerini, (örneğin kredi kartı veya banka kartı bilgilerinizi) vermeyeceğini, banka havalesi ile veya başka türlü para göndermeyeceğini kabul beyan ve taahhüt eder. Kullanıcının, Dorm aracılığı ile diğer bir kullanıcıya WhatsApp, WeChat, Line vb. uygulamalar üzerinden iletişime geçmesini sağlayacak telefon numarası, kullanıcı adı vb bilgileri vermesi durumunda tüm sorumluluk kullanıcıya aittir.
					</Text>
					<Text style={styles.tcL}>
						2.7		Kullanıcı, Dorm’un, kullanıcıların adli sicil kaydı veya benzeri sorgular yapmadığını veya geçmişlerini araştırmadığını kabul eder. Dorm, kullanıcılarının davranışları veya uyumluluğu bakımından herhangi bir temsilde veya garantide bulunmaz.
					</Text>
					<Text style={styles.tcL}>
						2.8		Kullanıcı, hesabın oluşturulması üzerine gönderdiği tüm bilgilerin doğru ve gerçek olduğunu, içeriği Hizmet üzerinden yayınlama ve Dorm’a gerekli yetkiyi verdiğini kabul ve beyan eder.
					</Text>
					<Text style={styles.tcL}>
						2.9		Kullanıcı, Hizmet'in bir parçası olarak kendisi tarafından yayınlanan herhangi bir içeriğin Dorm tarafından izlenebileceğini veya inceleyebileğini kabul ve beyan eder.
					</Text>
					<Text style={styles.tcL}>
						2.10		Bir hesap oluşturarak Hizmet üzerinde paylaştığınız, yüklediğiniz, gösterdiğiniz veya görülebilir olarak işaretlediğiniz, örneğin profilinizdeki bilgiler veya gideceğiniz etkinlikler gibi, (toplu olarak, "paylaşımlar") veya diğer kullanıcılara gönderdiğiniz (toplu olarak, "İçerik") bilgilere ev sahipliği yapmak, bunları saklamak, kullanmak, kopyalamak, göstermek, çoğaltmak, uyarlamak, düzenlemek, yayınlamak, değiştirmek ve dağıtmak için Dorm'a transfer edilebilir, alt lisanslanabilir, telif hakkı olmayan bir hak ve lisans verirsiniz.
					</Text>
					<Text style={styles.tcL}>
						2.11		Hizmet’in kullanımıyla oluşturulan ikincil çalışmalar hariç olmak üzere Dorm’un kullanıcı içeriklerini konu edinen lisansı inhisaridir.  Örneğin Dorm, içeriklerinizin bulunduğu Hizmet ekran görüntüleri için inhisari bir lisansa sahip olacaktır. Ek olarak Dorm’un içeriğinizin Hizmet dışında kullanılmasını önleyebilmesi için, diğer kullanıcılar veya üçüncü taraflar tarafından Hizmet içinden edinilen içeriğinizin ihlale yol açan kullanımları konusunda sizin adınıza hareket etmesi için Dorm’u yetkilendirirsiniz. Bu, bilhassa İçeriklerinizin üçüncü taraflarca Hizmet dışından alınması ve kullanılması durumunda sizin adınıza uyarı göndermek için yetkiyi içerir, ancak bir zorunluluk değildir.
					</Text>
					<Text style={styles.tcL}>
						2.12		Kullanıcı, Dorm’un iştiraklerinin ve üçüncü taraf ortaklarının Hizmet'e reklam yerleştirebileceğini kabul eder.
					</Text>
					<Text style={styles.tcL}>
						2.13		Kullanıcı, kanunların gerektirdiği hallerde, işbu Sözleşme’den doğan yükümlülüklerin yerine getirilmesi için veya aşağıdaki durumlarda olduğu gibi erişim, saklama veya hesap bilgilerinin Türk adli makamlarıyla paylaşılmasının gerekli olduğu hallerde; kullanıcının hesap bilgilerine erişebileceğini, bunların muhafaza edileceğini ve ifşa edilebileceğini kabul, beyan ve taahhüt eder: (i) yasal yükümlülüklere uymak; (ii) bu Sözleşme hükümlerine uygun davranmak; (iii) herhangi bir içeriğin üçüncü tarafların haklarını ihlal ettiğine dair iddialara yanıt vermek; (iv) Kullanıcının müşteri hizmetleri taleplerine yanıt vermek veya (v) Dorm’un veya herhangi bir başka kişinin haklarını, malını veya kişisel güvenliğini korumak.
					</Text>
					<Text style={styles.tcL}>
						2.14		Kullanıcının bir uygulama içi satın alım gerçekleştirmesi durumunda uygun ödeme sağlayıcı ile satın alımı doğrulaması gerekmektedir. Kullanıcı, seçtiği uygulama içi satın alım hizmetler(ler)in fiyatlarının yanı sıra, ödemesine uygulanabilecek satış verisi ve diğer vergiler için tarafına gösterilen ücretlerin yansıtılacağını ve Dorm’un veya varsa aracı olan üçüncü taraf hesabın bu ücretleri yansıtmasını kabul ve beyan eder.Kullanıcı’nın işbu madde kapsamında Topluluk Kurallarını ihlal etmesi durumunda, Hizmet’i kullanma yetkisinin Dorm tarafından otomatik olarak iptal edilebileceğini peşinen kabul eder.
					</Text>
					<Text style={styles.tcL}>
						2.15		Kullanıcı, Dorm hesabının devredilebilir olmadığını, hesap ve içeriği ile ilgili kullanıcı haklarının tamamının kullanıcının ölümü üzerine sona ereceğini kabul beyan ve taahhüt eder.
					</Text>
					<Text style={styles.tcL}>
						2.16		İşbu Sözleşme’nin kurulmasına dayanarak kullanıcı, herhangi bir şekilde Dorm namına beyanda bulunamayacağını veya Dorm’u bağlı tutamayacağını kabul beyan ve taahhüt eder.
					</Text>
					<Text style={styles.tcL}>
						2.17		Kanuna ve Sözleşme’ye aykırı içerik ve bu içerikten doğacak tüm sorumluluk, aykırı içeriği yayınlayan kullanıcının sorumluluğundadır. Kullanıcının, Hizmet üzerinde işbu Sözleşme’yi ihlal eden bir içerikten haberdar olması durumunda Hizmet içerisinden veya meetdorm.com/iletisim üzerinden hukuka aykırı içeriği şikayet etmesi kullanıcının sorumluluğundadır.
					</Text>
					<Text style={styles.tcL}>
						2.18		Kullanıcının, ödeme yöntemi bilgilerini düzenlememesi, güncel tutmaması, aboneliğini sonlandırmaması veya iptal etmemesi; ödeme işlemi, geçerlilik tarihlerinin dolması, yetersiz bakiye veya başka bir nedenle başarı ile gerçekleşmemesi halinde tahsil edilmeyen tutarlardan kullanıcı sorumlu olduğunu ve ödeme yönteminin güncellendiği şekliyle faturalandırmaya devam etme yetkisinin Dorm’a verildiğini kabul ve beyan eder. Bu işlem, kullanıcın fatura kesim tarihlerinde bir değişikliğe neden olabilir. Ayrıca kullanıcı, Dorm’un kredi kartı veya banka kartı sağlayıcısı tarafından sağlanan güncellenmiş veya yenilenmiş kredi kartı veya banka kartı geçerlilik tarihlerini veya numaralarını edinmeye yetkili olduğunu kabul ve beyan eder.  Ödeme tarihleri, kullanıcının ödeme yöntemine göre belirlenecek olup kullanıcı  ile kendisinin seçtiği ödeme yönteminin sahibi olan finansal kurum, kredi kartı sağlayıcısı veya başka sağlayıcılar arasında yapılan sözleşmelere göre belirlenebilecektir.
					</Text>
					<Text style={styles.tcPB}>
						3.		DORM’UN HAK VE YÜKÜMLÜLÜKLERİ
					</Text>
					<Text style={styles.tcL}>
						3.1		İşbu Sözleşme’nin kullanıcı tarafından ihlal edilmesi veya ihlal edildiği noktasında esaslı bir kanaate varılması halinde Dorm, dilediği zaman kullanıcının hesabını sonlandırabilir. Bu tür bir sonlandırma durumunda, kullanıcının satın alımları için herhangi bir geri ödeme yapılmaz.
					</Text>
					<Text style={styles.tcL}>
						3.2		Dorm, sunduğu Hizmeti iyileştirmek ve kullanıcı için çekici ve kullanışlı olabilecek ek özellikler sunmak amacıyla  yeni ürün özellikleri veya iyileştirmeleri eklemenin yanı sıra bazı özellikleri kaldırabilir. Söz konusu özellik değiştirme, yerleştirme, kaldırma vb. filler, kullanıcının hak veya sorumluluklarını önemli derece etkilemediği sürece, özellik değiştirmeleri gerçekleşmeden önce Dorm, kullanıcılara haber verme yükümlülüğünü askıya alabilir veya hizmeti tamamen durdurabilir. Dorm, güvenlik endişesi gibi kullancıya haber verilmesini engelleyebilecek durumlar dışında, kullanıcıya önceden bildirim yapacaktır.
					</Text>
					<Text style={styles.tcL}>
						3.3		Dorm, kullanıcının hesabınının askıya alınması veya kapatılması dahil olmak üzere, Hizmet’in yasa dışı veya yetkisiz kullanımlarını araştırabilir ve uygun yasal işlemleri başlatabilir.
					</Text>
					<Text style={styles.tcL}>
						3.4		Dorm tarafından kullanıcıya sağlanan herhangi bir yazılım; yükseltme, güncelleme veya diğer yeni özellikler kullanıcı tarafından otomatik olarak indirebilir ve yüklenebilir. Kullanıcı söz konusu otomatik indirme işlemlerini cihazının ayarlarından ayarlayabilecektir.
					</Text>
					<Text style={styles.tcL}>
						3.5		Dorm, kullancının Sözleşme'ye aykırı olan veya Hizmet'in itibarına zarar verebilecek kullanıcı içeriğini kısmen veya tamamen silme hakkına sahiptir.
					</Text>
					<Text style={styles.tcL}>
						3.6		Kullanıcı, müşteri hizmetleri temsilcileriyle iletişim kurarken saygılı ve nazik olacağını kabul eder. Müşteri hizmetleri temsilcilerinden herhangi birisine veya diğer çalışanlara karşı kullanıcı davranışının herhangi bir zamanda veya şekilde tehditkar, rahatsız edici veya saldırgan olduğunun anlaşılması durumunda Dorm, ilgili kullanıcının hesabını derhal sonlandırma hakkını saklı tutar.
					</Text>
					<Text style={styles.tcL}>
						3.7		Kullanıcının, Hizmet hakkında Dorm’a tavsiyeler veya geri bildirim göndermesi durumunda Dorm, bu geri bildirim(ler)i herhangi bir bedel ödemeden herhangi bir amaçla kullanabilme ve paylaşabilme hakkına sahiptir.
					</Text>
					<Text style={styles.tcL}>
						3.8		Dorm zaman zaman App Store, Google Play Store, operatör tarafından faturalandırma veya Dorm tarafından yetkilendirilen diğer ödeme platformları aracılığıyla satın alma yollarıyla satılık ürün ve hizmetler (“uygulama içi satın alımlar”) sunabilme hakkını saklı tutar. Dorm, yeni çıkan bir uygulama olarak fiyatlandırma politikalarını sürekli kullanıcılarına göre test etmektedir ve değiştirme haklarını kendinde saklı tutar. Belirli dönemlerde belirli hizmetler üzerinden fiyatlandırma politikalarında indirime gidebilir.
					</Text>
					<Text style={styles.tcPB}>
						4.		HİZMET'İN İPTALİ
					</Text>
					<Text style={styles.tcL}>
						4.1		Dorm, kullanıcılarına Hizmet'e erişme ve kullanma için özel, telif hakkı olmayan, devredilemez, özel olmayan, geri alınabilir, ve alt lisanslanamayan bir lisans verir. İşbu lisansın tek amacı, Hizmet'in Dorm tarafından amaçlanan ve bu Sözleşme kapsamında sağlanan Hizmet’in kullanılması ve bu Hizmet’ten yararlanılmasını sağlamaktır. Bu lisans ve Hizmet'e erişim yetkisi, kullanıcının aşağıdaki sayılan herhangi bir fiili işlemesi durumunda otomatik olarak kullanıcıya bildirim yapılmaksızın iptal edilir:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmeti veya Hizmetteki herhangi bir içeriği Dorm’un yazılı onayı olmadan herhangi bir ticari amaçla kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmet aracılığıyla erişilebilen herhangi bir telifli materyali, görüntüyü, ticari markayı, ticari ismi, hizmet markasını veya başka fikri ürünleri, içeriği veya özel bilgiyi Dorm’un önceden yazılı onayı olmadan herhangi bir şekilde kopyalamak, değiştirmek, iletmek, ondan türetilmiş eserler oluşturmak, kullanmak veya çoğaltmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Kullancının Herhangi bir beyanına Dorm tarafından onay verildiğini açıklamak veya ima etmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmete veya içeriklerine erişmek, bunları geri almak, endekslemek, “veri madenciliği yapmak” veya gezinme yapısını veya sunumunu herhangi bir şekilde taklit etmek ya da etrafından dolanmak için herhangi bir robot, bot, örümcek, crawler, scraper, site arama/geri alma uygulaması, proxy veya başka manuel ya da otomatik cihaz, yöntem veya süreçleri kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmet'i veya sunucuları veya Hizmet'e bağlı ağları engelleyecek, aksatacak veya olumsuz olarak etkileyecek şekilde kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Virüs veya diğer kötü amaçlı yazılımları yüklemek veya Hizmet'in güvenliğini tehlikeye atmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmet'e veya Hizmet aracılığıyla iletilen herhangi bir bilginin menşeini gizlemek için başlıkları taklit etmek veya tanıtıcıları başka türlü manipüle etmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Dorm’un önceden yazılı izni olmadan, Hizmetin herhangi bir kısmını “çerçeve içinde göstermek” veya “yansıtmak”.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Herhangi bir kişiyi herhangi bir amaçla bir başka web sitesine yönlendirmek için Dorm veya Hizmet'e (veya Dorm’un herhangi bir ticari markası, ticari ismi, hizmet markası, logosu veya sloganına) herhangi bir gönderme içeren meta etiketleri, kodlar veya diğer cihazlar kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmet'in herhangi bir kısmını değiştirmek, uyarlamak, alt lisans vermek, tercüme etmek, satmak, tersine mühendislik yapmak, şifresini çözmek, kaynak koduna dönüştürmek veya başka türlü tersine çevirmek veya başkalarının böyle davranmasını teşvik etmek veya  sebep olmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Dorm’un yazılı izni olmadan, Hizmet veya diğer kullanıcıların içerikleri veya bilgileri ile etkileşime girecek üçüncü taraf uygulamalar kullanmak veya geliştirmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Dorm’un yazılı onayı olmadan Dorm uygulaması programlama ara yüzünü kullanmak, buna erişmek veya yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmetimizin veya herhangi bir sistemin veya ağın zafiyetlerini araştırmak, taramak veya test etmek.
					</Text>
					<Text style={styles.tcPB}>
						5.		TOPLULUK KURALLARI
					</Text>
					<Text style={styles.tcL}>
						5.1		Kullanıcı, Hizmet’i kullanmakla aşağıdaki fiil ve davranışlarda bulunmayacağını kabul beyan ve taahhüt eder:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmet'i, yasa dışı veya bu Sözleşme tarafından yasaklanmış herhangi bir amaç için kullanmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmeti herhangi bir zararlı veya kötü amaçla kullanmak
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Hizmeti Dorm’a zarar verme amacıyla kullanmak
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Zaman zaman güncellenen Topluluk Kurallarımızı ihlal etmek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		İstenmeyen e-postalar göndermek, diğer kullanıcılardan para istemek veya kullanıcıları dolandırmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Herhangi bir kişi veya kuruluşu taklit etmek veya söz konusu kişi veya kuruluşun izni olmadan bir başka kişi veya kuruluşa ait görüntüleri yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Herhangi bir kişiyi hedef alarak zorbalık yapmak, "ısrarlı takip etmek", tehdit etmek, saldırmak, incitmek veya karalamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Herhangi bir kişinin reklam, özel hayatın gizliliği, telif, ticari marka veya diğer fikri mülkiyet veya bir sözleşmeden doğan haklarını ihlal eden veya haklarına halel getiren herhangi bir içerik yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Nefret söylemi, tehdit edici, cinsel açıdan müstehcen veya pornografik herhangi bir İçerik yayınlamak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Irkçılık, bağnazlık, nefret ya da herhangi bir grup veya bireye karşı her türlü fiziksel zarar teşvik eden herhangi bir içerik göndermek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Irkçılık, bağnazlık, nefret ya da herhangi bir grup veya bireye karşı her türlü fiziksel zarar teşvik eden herhangi bir içerik göndermek.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Diğer kullanıcılardan herhangi bir amaçla şifre istemek veya ticari veya yasadışı amaçlarla kimlik bilgileri istemek veya bir başka bir kişinin kişisel bilgilerini onun izni olmadan yaymak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Başka bir kullanıcının hesabını kullanmak, başka bir kullanıcı ile bir hesap paylaşmak veya birden fazla hesaba sahip olmak.
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Kullanıcının hesabı askıya alınmış veya kaldırılmış olmasına rağmen Dorm’un izni olmaksızın başka bir hesap oluşturmak.
					</Text>
					<Text style={styles.tcPB}>
						6.		ÖDEME, İADE VE ABONELİĞE İLİŞKİN HÜKÜMLER
					</Text>
					<Text style={styles.tcL}>
						6.1		Kullanıcının,  premium üyelik gibi uygulama içi satın alma yoluyla otomatik olarak yenilenen periyodik bir abonelik satın alması durumunda ödeme yöntemi, kullanıcı  iptal edene kadar abonelik için devamlı olarak faturalandırılacaktır. İlk abonelik başlangıç döneminden sonra ve yine daha sonraki abonelik döneminden sonra, abonelik, süre olarak öncekiyle eşit bir dönem için abone olurken kabul edilen fiyat üzerinden otomatik olarak uzatılacaktır.
					</Text>
					<Text style={styles.tcL}>
						6.2		Önceden yapılmış bir ödemeye itirazlar, App Store gibi ilgili üçüncü taraf bir hesap tarafından faturalandırılmışsa Dorm’un veya üçüncü parti şirketin müşteri desteğine yönlendirilmelidir. Ayrıca kullanıcı, haklarının yanı sıra, geçerli zaman limitleri hakkında daha fazla bilgi verebilecek olan kullanıcının bankası veya ödeme sağlayıcısı ile iletişime geçerek de itiraz edebilir.
					</Text>
					<Text style={styles.tcL}>
						6.3		Kullanıcının, aboneliğini değiştirmek veya sonlandırmak istemesi halinde; Dorm nezdindeki hesabını veya cihazındaki Dorm uygulamasını silmiş olsa bile, üçüncü taraf hesaba (veya mevcut ise Dorm’dan Ayarlara) giriş yapması ve aboneliğini sonlandırmak veya iptal etmek için talimatları takip etmesi gerekmektedir. Kullanıcının Dorm hesabını veya Dorm uygulamasını cihazından silmiş olması, aboneliği sonlandırmaz veya iptal etmez; kullanıcı aboneliğini Dorm’da veya üçüncü taraf hesabında sonlandırana veya iptal edene kadar kullanıcının ödeme yönteminde ücretlendirilmiş tüm tutarlar Dorm tarafından muhafaza edilecektir. Kullanıcının aboneliğini sonlandırması veya iptal etmesi üzerine, kullanıcı, aboneliğini o tarihte geçerli abonelik döneminin sonuna kadar kullanabilir ve aboneliği geçerli dönemden sonra yenilenmez.
					</Text>
					<Text style={styles.tcL}>
						6.4		Kullanıcı, Dorm uygulamasını ziyaret edip Ayarlara giderek Ödeme Yöntemi bilgilerini düzenleyebilir.
					</Text>
					<Text style={styles.tcL}>
						6.5		6502 sayılı Tüketicinin Korunması Hakkında Kanun’a tüketicinin 14 gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin Sözleşmeden cayma hakkı mevcuttur.
					</Text>
					<Text style={styles.tcL}>
						6.6		Para iadesi talep etmek için:
					</Text>
					<Text style={styles.tcL}>
						6.6.1		Kullanıcının satın alma işlemini Apple Kimliğini kullanarak gerçekleştirmesi durumunda , para iadeleri Dorm tarafından değil Apple tarafından iare edilir. Kullanıcının para iadesi talep etmek için App Store'a giderek, Apple Kimliğine tıklaması, “Satın alma geçmişi”ni seçmesi, işlemi bulması ve “Sorun Bildir”e tıklaması gerekmektedir. Kullanıcı ayrıca https://getsupport.apple.com adresinden de talep gönderebilecektir.
					</Text>
					<Text style={styles.tcL}>
						6.6.2		Kullanıcının Google Play Store hesabını kullanarak satın alım yapmış olması durumunda : onay e-postasından veya Google Wallet'a giriş yaparak öğrenebilecek  Google Play Store sipariş numarası  veya (kullanıcının onay e-postasında bulabileceği) Dorm sipariş numarası ile birlikte müşteri desteği birimiyle iletişime geçmesi gerekmektedir.
					</Text>
					<Text style={styles.tcL}>
						6.7		Kullanıcı ayrıca, işbu Sözleşme’yi iptal ettiğini belirten veya benzer kelimeler içeren imzalı ve tarihli bir bildirimi e-posta yoluyla gönderebilme hakkına sahiptir. . Kullanıcının iptal etme hakkını kullanması durumunda  Apple'ın kontrol ettiği Apple Kimliği üzerinden yapılan satın alımlar hariç olmak üzere, makul sürede ve her halükarda Sözleşme’yi iptal etme kararının Dorm’a ulaşmasını takip eden  14 gün içinde, kullanıcıdan  alınan  tüm ödemelern Google'dan iade etmesi Dorm tarafından  talep olunacaktır. Bu türden iadeyi ilk başta kullanıcı tarafından  kullanılan ödeme yöntemine gerçekleştireceğiz. Her durumda, iade nedeniyle kullanıcıdan  potansiyel transfer ücretleri haricinde hiçbir ücret tahsil edilmeyecektir.
					</Text>
					<Text style={styles.tcL}>
						6.8		Kullanıcı tarafından yukarıda listelenmeyen bir ödeme platformu aracılığıyla satın alma işlemi yapılması halinde , kullanıcı,  doğrudan satın alma işlemini gerçekleştirdiği üçüncü taraf satıcı ile iletişime geçerek para iadesi isteyeceğini kabul eder.
					</Text>
					<Text style={styles.tcPB}>
						7.		TELİF HAKLARININ KORUNMASI
					</Text>
					<Text style={styles.tcL}>
						7.1		Bir taraf veya kullanıcıya ait bir çalışmanın telif hakkı ihlali oluşturacak bir şekilde kopyalandığına ve Hizmet üzerinde yayınlandığı kanaatine varılması halinde  telif hakkının ihlal edildiğini iddia eden tarafın  buradaki formu kullanarak bir kaldırma talebi göndermesi zorunludur.
					</Text>
					<Text style={styles.tcL}>
						7.2		Telif hakkı ihlali iddiasıyla ilgili olarak Dorm ile iletişime geçerken telif hakkının ihlal edildiğini iddia eden tarafın aşağıdaki bilgileri Dorm’a  sağlamış olması gerekmektedir:
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Telif hakkının sahibi adına hareket etmeye yetkili kişinin elektronik veya fiziksel imzası;
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		İhlal edildiği iddia edilen  telifli eserin bir açıklaması;
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		İhlal edici nitelikteki materyalin Hizmet üzerinde bulunduğu yerin bir açıklaması (bu açıklama Dorm’un  ihlal edici olduğu iddia edilen materyali bulmasını sağlamaya makul olarak yeterli olmalıdır);
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Adres, telefon numarası ve e-posta adresi dahil olmak üzere talepte bulunan ilgilinin iletişim bilgileri ve telif hakkı sahibinin kimlik bilgileri;
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Karşı çıkılan kullanıma telif hakkı sahibinin, vekilinin veya yasaların yetki vermediğine iyi niyetle inandığınıza dair sizin tarafınızdan yazılı bir beyan; ve
					</Text>
					<Text style={styles.tcL}>
						{"\u2022"}		Yalan beyanda bulunmanın cezasını göz önüne alarak, bildiride yer alan yukarıdaki bilgilerin doğru olduğuna ve telif hakkı sahibi olduğunuza veya telif hakkı sahibi adına hareket etmeye yetkili olunduğuna dair yeminli beyan.
					</Text>
					<Text style={styles.tcL}>
						7.3		Dorm, mükerrer ihlalcilerin hesaplarını fesh etme hakkına sahiptir.
					</Text>
					<Text style={styles.tcPB}>
						8.		SORUMLULUĞUN REDDİ VE SINIRLANDIRILMASI
					</Text>
					<Text style={styles.tcL}>
						8.1		Dorm Hi̇zmet'i̇ “olduğu gi̇bi̇” ve “müsai̇t olduğu şeki̇lde” sağlamaktadır ve hi̇zmet i̇le i̇lgi̇li̇ olarak (i̇çerdi̇ği̇ tüm i̇çeri̇k dahi̇l) yürürlükteki̇ yasaların i̇zi̇n verdi̇ği̇ ölçüde, sınırlama olmaksızın tatmi̇n edi̇ci̇ kali̇te, ti̇carete uygunluk, beli̇rli̇ bi̇r amaca uygunluk veya i̇hlal etmeme dahi̇l açık, zimni̇, yasal veya başka türlü hi̇çbi̇r çeşi̇t garanti̇ vermemektedi̇r.
					</Text>
					<Text style={styles.tcL}>
						8.2		Dorm (a) Hi̇zmet’i̇n kesi̇nti̇si̇z, güvenli̇ veya hatasız olacağı, (b) Hi̇zmet’teki̇ herhangi̇ bi̇r kusur veya hatanın düzelti̇leceği̇, veya (c) Hi̇zmet üzeri̇nden veya hi̇zmet aracılığıyla  kullanıcı tarafından elde edilen  herhangi̇ bi̇r i̇çeri̇k veya bi̇lgi̇ni̇n doğru olacağını beyan etmemekte veya garanti̇ etmemektedi̇r.
					</Text>
					<Text style={styles.tcL}>
						8.3		Dorm kullanıcının, bi̇r başka kullanıcının ya da üçüncü tarafın hi̇zmet aracılığıyla yayınladığı, gönderdi̇ği̇ veya aldığı herhangi̇ bi̇r i̇çeri̇k hakkında sorumluluk kabul etmemektedi̇r. Hi̇zmet’i̇n kullanımı  aracılığıyla i̇ndi̇ri̇len veya başka şeki̇lde elde edi̇len herhangi̇ bi̇r materyale, kullanıcının kendi̇ takdi̇ri̇ ve ri̇ski̇ kullanıcıya ai̇t olmak üzere eri̇şi̇lmektedi̇r.
					</Text>
					<Text style={styles.tcL}>
						8.4		Yürürlükteki̇ kanunların i̇zi̇n verdi̇ği̇ en geni̇ş ölçüde Dorm, i̇şti̇rakleri̇, çalışanları, li̇sans verenleri̇ veya hi̇zmet sağlayıcıları hi̇çbi̇r durumda, ve hatta Dorm öncesi̇nden bi̇lgi̇lendi̇ri̇lmi̇ş olsa dahi̇ aşağıda beli̇rti̇lecek sebeplerle doğrudan veya dolaylı olarak kaynaklanan kâr kaybı veya herhangi̇ bi̇r veri̇, kullanım, kaybi veya di̇ğer maddi̇ olmayan kayıplar dahi̇l ve bunlarla sınırlı olmamak üzere, sonuç olarak ortaya çıkan, örnek ni̇teli̇ği̇nde, rastlantısal, özel, ceza ni̇teli̇ği̇ndeki̇ veya artan hasarlardan sorumlu olmayacaktır: (i) Kullanıcının hi̇zmete eri̇şi̇mi̇ veya hi̇zmeti̇ kullanımı ya da eri̇şememesi  veya kullanamaması (ii) hi̇zmet üzeri̇nde, hi̇zmet aracılığıyla veya hi̇zmet kullanımı sonucunda di̇ğer kullanıcıların veya üçüncü tarafların sergi̇ledi̇ği̇ davranış veya üretti̇ği̇ i̇çeri̇k veya (iii) kullanıcının i̇çeri̇ği̇ne yetki̇si̇z eri̇şi̇m, i̇çeri̇ği̇n yetki̇si̇z kullanımı veya deği̇şti̇ri̇lmesi̇.
					</Text>
					<Text style={styles.tcL}>
						8.5		Dorm’un Hi̇zmet ile  i̇lgi̇li̇ talepler i̇çi̇n kullanıcıya karşı nihai sorumluluğu  kullanıcının halen bir Dorm hesabına  sahi̇p olması  ve kullanıcı tarafından Dorm’a herhangi bir ödeme yapılmış olması koşuluyla; kullanıcı tarafından işbu ödenen tutarı ve her halükarda ödemenin yapılacağı dönemin Merkez Bankası döviz kuruna göre hesaplanacak olan 100 Amerikan Doları’na karşılık gelen Türk Lirası’ndan fazla olamaz.
					</Text>
					<Text style={styles.tcPB}>
						9.		ÜÇÜNCÜ TARAF HİZMETLERİ
					</Text>
					<Text style={styles.tcL}>
						9.1		Hizmet, üçüncü taraflarca sunulan reklamlar ve promosyonlar ile diğer web sitelerine veya kaynaklara bağlantılar içerebilir. Dorm bu harici web sitelerinin veya kaynakların ulaşılabilir olmasından (veya olmamasından) sorumlu değildir. Kullanıcının Hizmet aracılığıyla ulaşılabilir kılınan üçüncü taraflarla etkileşime geçmeyi seçmesi halinde , kullanıcı ile üçüncü taraf ilişkileri söz konusu üçüncü tarafın şartlarına tabi olacaktır. Dorm bu gibi üçüncü tarafların şartlarından veya eylemlerinden sorumlu değildir. Dorm aynı zamanda yönlendirdiği etkinliklerin güvenliğinden, gerçekleşmesinden, kalitesinden de sorumlu değildir.
					</Text>
					<Text style={styles.tcPB}>
						10.		ÇEŞİTLİ HÜKÜMLER
					</Text>
					<Text style={styles.tcL}>
						10.1		Bu Sözleşme’nin herhangi bir hükmünün geçersiz kılınması halinde, bu Sözleşme’nin geri kalanı tamamen geçerli ve yürürlükte olmaya devam edecektir.
					</Text>
					<Text style={styles.tcL}>
						10.2		Şirketin bu Sözleşme’nin herhangi bir hakkını veya hükmünü uygulamaması, söz konusu hak veya hükümden feragat teşkil etmeyecektir.
					</Text>
					<Text style={styles.tcL}>
						10.3		Kişisel veri içeren kullanıcı içerikleri, Kişisel Verilerin Korunması Kanunu kapsamında korunmaktadır. Bu veriler yalnızca Hizmet’in işletilmesi, geliştirilmesi, sunulması, ve iyileştirilmesi ile yeni hizmetlerin araştırılması ve geliştirilmesi gibi sınırlı amaçlar kapsamında işlenmektedir. Kullanıcı tarafından yerleştirilen veya Hizmet üzerinde yerleştirmek için Dorm’a izin verilen herhangi bir içerik, diğer kullanıcılar tarafından görüntülenebilir ve Hizmeti ziyaret eden veya ona katılan (diğer Dorm kullanıcıları tarafından paylaşılan İçeriği edinen kişiler gibi) herhangi bir kişi tarafından görüntülenebilir.
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
							<Text style={{ color: "blue" }}>KVKK Politikasını</Text>,{" "}
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
