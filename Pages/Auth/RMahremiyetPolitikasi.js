import React, {useState} from "react";
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
    FlatList
} from "react-native";
import { Feather, Octicons } from "@expo/vector-icons";


import commonStyles from "../../visualComponents/styles";
import { colors, Gradient, GradientText } from "../../visualComponents/colors";
const { width, height } = Dimensions.get("window");


const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};

export default function RMahremiyetPolitikasi ({ navigation }){
	const [state, setState] = React.useState(false)
    return (
     <View style={styles.container}>

            <View name={"Header"} style={[styles.header]}>
				<TouchableOpacity
					style = {{width: "12%", paddingTop: 5}}
					name={"backButton"}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Feather name="chevron-left" size={36} color="#4A4A4A" />
				</TouchableOpacity>
                <GradientText
					text={"Mahremiyet Politikası"}
					style={{ fontSize: 26, fontWeight: "bold", paddingLeft: 0 }}
				/>
			</View>
            <ScrollView 
            style={styles.tcContainer}
            onScroll={({nativeEvent}) => {
                if (isCloseToBottom(nativeEvent)) {
                  setState(true);
                }
              }}
            >
                <Text style={styles.tcP}>Bizim için her konuda içinizin rahat olması çok önemli, bu konulara bize güvenerek verdiğiniz kişisel verileriniz de dahil! Bu yüzden hangi verilerinizi topladığımız, nasıl kullandığımız ve ne kadarını tuttuğumuzla ilgili olan aydınlatma metnimizi açık ve anlaşılır bir şekilde hazırladık. Her türlü sorunuz için bize ulaşabilirsiniz.</Text>
                <Text style={styles.tcP}>Bu mahremiyet politikasının ilk versiyonudur. 22.03.2022 tarihinden itibaren geçerlidir. </Text>
				<Text style={styles.tcP}>Mahremiyet Politikası, dorm tarafından yürütülen web siteleri, uygulamalar, etkinlikler ve diğer hizmetler için geçerlidir. Basitlik adına, Mahremiyet Politikasında tüm bunlara “hizmetler” adını veriyoruz.</Text>
                <Text style={styles.tcP}>Biz Kimiz ?</Text>
				<Text style={styles.tcP}>dorm, Reşitpaşa, Katar Cd No:4 D:1101, 34467 Sarıyer/İstanbul</Text>
				<Text style={styles.tcP}>Hangi Verileri Topluyoruz ?</Text>
				<Text style={styles.tcP}>Bize verdiğiniz veriler:</Text>
			  		<Text style={styles.tcL}>{'\u2022'} Bir hesap oluştururken, bize en azından oturum bilgilerinizi ve hizmetin işlemesi için gerekli olan isminiz, doğum tarihiniz, okuduğunuz üniversite, üniversite e-postanız gibi bazı temel bilgilerinizi verirsiniz.</Text>
                    <Text style={styles.tcL}>{'\u2022'} Profilinizi tamamladığınızda, bizimle kişiliğiniz, yaşam tarzınız, ilgi alanlarınız ve sizinle ilgili diğer bilgiler gibi hakkınızdaki ek bilgiler ile fotoğraf ve video gibi içerikleri paylaşabilirsiniz. Resim ve video gibi belli içerikleri eklemek için, kameranıza veya fotoğraf albümünüze erişmemize izin verebilirsiniz. Aynı zamanda bize vereceğiniz cinsiyet, cinsel yönelim, dini inanç, politik görüş gibi bazı veriler hassas ya da nitelikli veri olarak görülebilir. Bu bilgileri vermeyi seçerek, bu bilgileri işlememize izin verirsiniz.</Text>
					<Text style={styles.tcL}>{'\u2022'} Ücretli bir hizmete abone olduğunuzda ya da (iOS veya Android gibi bir platform aracılığıyla yapmak yerine) doğrudan bizden bir alım gerçekleştirdiğinizde, bize veya ödeme hizmeti sağlayıcımıza banka veya kredi kartı numaranız ve diğer finansal bilgileriniz gibi bilgiler verirsiniz.</Text>
					<Text style={styles.tcL}>{'\u2022'} Müşteri hizmetleri ekibimizle irtibata geçerseniz, etkileşim sırasında bize verdiğiniz bilgileri toplarız. Bazen eğitim amacıyla ve yüksek kalitede bir hizmet sunmak için bu etkileşimleri takip ederek kaydederiz.</Text>
					<Text style={styles.tcL}>{'\u2022'} Bizden başka insanlarla iletişim kurmamızı ya da bu kişilerin bilgilerini işlememizi isterseniz (örneğin sizin adınıza arkadaşlarınızdan birine bir e-posta göndermemizi isterseniz), isteğinizi tamamlama amacıyla başkaları hakkındaki bize vermiş olduğunuz bilgileri toplarız.</Text>
					<Text style={styles.tcL}>{'\u2022'} Uygulama içerisindeki etkinliklere gideceğinizi işaretlediğinizde gitmek isteyebileceğiniz veya gideceğiniz yerleri ve etkinlik verilerini, diğer kullanıcılarla olan eşleşme bilgilerinizi ve sohbetlerinizi hizmet faaliyetlerinin parçası olarak işleriz.</Text>
                <Text style={styles.tcP}>Başkalarından Aldığımız Veriler</Text>
				<Text style={styles.tcP}>Diğer kullanıcılardan bizimle iletişime geçtikleri takdirde sizinle ilgili bilgiler toplayabiliriz. Diğer ortaklarımızdan, örneğin etkinlik düzenleyicilerden veya bilet şirketlerinden katılımınızla alakalı kişisel veya anonim olarak detaylı bilgi alabiliriz.</Text>
				<Text style={styles.tcP}>Kullanım Bilgileri</Text>
				<Text style={styles.tcP}>Hizmetlerimizi nasıl kullandığınız (örn. oturum açtığınız tarih ve saat, kullandığınız özellikler, aramalar, tıklamalar ve size gösterilen sayfalar, yönlendiren web sayfasının adresi, tıkladığınız reklamlar) ve diğer kullanıcılarla nasıl etkileşim kurduğunuz (örn. bağlantı ve etkileşim kurduğunuz kullanıcılar, iletişiminizin saat ve tarihi, gönderip aldığınız mesaj sayısı) gibi konularda hizmetlerimizdeki etkinliklerinize ilişkin bilgiler toplarız.</Text>
				<Text style={styles.tcP}>Cihaz bilgileri Hizmetlerimize erişmek için kullandığınız cihaz(lar) hakkında şu bilgileri toplarız:</Text>
				<Text style={styles.tcP}>IP adresi, cihaz kimliği ve türü, cihaza özgü ve uygulama ayarları ve özellikleri, uygulama çökmeleri, reklam kimlikleri (Google'ın AAID ve Apple'ın IDFA kimlikleri gibi cihaz ayarlarınıza giderek sıfırlayabileceğiniz rastgele üretilmiş numaralar), tarayıcı türü, sürümü ve dili, işletim sistemi, zaman dilimleri, tanımlama bilgileriyle ilişkilendirilen tanıcılar, cihazınız veya tarayıcınızı benzersiz şekilde tanımlayabilecek diğer teknolojiler (örn: IMEI/UDID ve MAC adresi) gibi yazılım ve donanım bilgileri;</Text>
				<Text style={styles.tcP}>Sinyal kuvvetiniz gibi kablosuz ve mobil ağ bağlantınıza ilişkin bilgiler:{'\n'}Hızölçer, jiroskop ve pusula gibi cihaz sensörü bilgileri{'\n'}Cihaz performansı gibi metrikleri ölçen cihaz donanımı istatistikleri (CPU)</Text>
				<Text style={styles.tcP}>Verileri Neden İşliyoruz ?</Text>
				<Text style={styles.tcP}>Sizinle ilgili topladığımız her bilginin bir amacı var: Hepsi hizmetlerimizi sorunsuz bir şekilde sunmak, hizmet kalitemizi artırmak ve güvenliğinizi sağlamak için toplanıyor ve işleniyor.</Text>
					<Text style={styles.tcL}>{'\u2022'} Hesabınızı oluşturmak ve yönetmek</Text>
					<Text style={styles.tcL}>{'\u2022' }Size müşteri desteği sağlamak ve isteklerinize yanıt vermek</Text>
					<Text style={styles.tcL}>{'\u2022'} İşlemlerinizi tamamlamak</Text>
					<Text style={styles.tcL}>{'\u2022'} Sipariş yönetimi ve faturalandırma da dâhil olmak üzere, sizinle hizmetlerimiz hakkında iletişim kurmak</Text>
					<Text style={styles.tcL}>{'\u2022'} Başka kullanıcılarla bağlantı kurmanıza yardımcı olmak</Text>
					<Text style={styles.tcL}>{'\u2022'} Size geçerli teklifler ve raklamlar sunmak</Text>
					<Text style={styles.tcL}>{'\u2022'} Hizmetlerimizi iyileştirmek ve yenilerini geliştirmek için anketler uygulamak ve kullanmlarınızı analiz etmek</Text>
					<Text style={styles.tcL}>{'\u2022'} Dolandırıcılık ya da diğer yasa dışı veya izinsiz etkinlikleri önlemek, saptamak ve savaşmak</Text>
					<Text style={styles.tcL}>{'\u2022'} Platform üzerinde ve dışında gerçekleşen devam eden veya iddia edilen uygunsuz davranışları ele almak</Text>
					<Text style={styles.tcL}>{'\u2022'} Yasal gerekliliklere uymak, kolluk kuvvetlerine destek olmak ve şartlamızın uygulandığından, topluluk kurallarına uyulduğundan emin olmak</Text>
				<Text style= {styles.tcP}>Nasıl Topluyoruz ?</Text>
				<Text style= {styles.tcP}>Kime ve nasıl aktarabiliriz ?</Text>
				<Text style= {styles.tcP}>Gönüllü olarak uygulama üzerinde bilgilerinizi açıkladığınızda (profiliniz dâhil), başka kullanıcılarla bilgi paylaşırsınız. Profiliniz ve profilinizdeki içeriklerin görünürlüğüne belirli filtrelemeler getirme hakkına sahipsiniz. Görünmek istemediğiniz kişi ve gruplara profilinizdeki bilgiler açık edilmeyecektir.</Text>
				<Text style= {styles.tcP}>Hizmetlerimizi yürütmemizi ve iyileştirmemizi sağlamak için üçüncü taraflardan yararlanırız. Bu üçüncü taraflar, veri barındırma ve bakım, analitik, müşteri hizmetleri, pazarlama, reklam, ödeme işleme ve güvenlik faaliyetleri gibi çeşitli görevlerde bize destek olur.</Text>
				<Text style= {styles.tcP}>Herhangi bir hizmet sağlayıcı ile ilişki kurmadan ya da herhangi bir ortakla çalışmadan önce, ortaklarımızın da verilerinizi en az bizim kadar önemsiyor olmasını sıkı bir şekilde kontrol ediyoruz.</Text>
				<Text style= {styles.tcP}>Tamamen veya kısmen bir birleşme, alım, edinim, elden çıkarma, yeniden yapılandırma, yeniden düzenleme, tasfiye, iflas veya diğer yönetim veya kontrol değişikliğinde yer almamız durumunda bilgilerinizi aktarabiliriz.</Text>
				<Text style= {styles.tcP}>Yasanın gerektirdiği durumlar:</Text>
				<Text style= {styles.tcP}>Özellikle kişisel ve toplum güvenliği konularında, bilgilerinizi kolluk kuvvetlerine veya ilgili birimlere açıklayabiliriz:</Text>
					<Text style= {styles.tcL}> (i) Mahkeme kararı, celp veya arama emri, kamu / kolluk kuvveti soruşturması gibi yasal bir sürece veya diğer yasal gerekliliklere uymak,</Text>
					<Text style= {styles.tcL}> (ii) suçun önlemesi veya saptanmasına (her iki durumda da geçerli yasaya tabi olacak şekilde) destek vermek</Text>
					<Text style= {styles.tcL}> (iii) herhangi bir kişinin güvenliğini korumak.</Text>
				<Text style= {styles.tcP}>Ayrıca aşağıdaki durumlarda da bilgi paylaşabiliriz: (i) Açıklamanın fiili veya tehdit aşamasındaki bir davada mesuliyetimizi azaltacak olması, (ii) bizim yasal haklarımızı ya da kullanıcılarımız, iş ortaklarımız veya diğer ilgili tarafların yasal haklarını korumak için gerekmesi, (iii) sizinle olan sözleşmelerimizi uygulatmak için ve (iv) yasa dışı etkinlik, şüphelenilen dolandırıcılık veya diğer uygunsuz hareketi soruşturmak, önlemek veya başka bir adım atmak için</Text>
				<Text style= {styles.tcP}>Ne kadar süreyle tutuyoruz ?</Text>
				<Text style= {styles.tcP}>Topladığımız verileri her 6 ayda bir silerek veya anonimleştirerek (kişisel olarak değil, istatistik olarak tutarak) verilerinizi koruyoruz. Fakat bazı verilerin kanunen veritabanımızda bulunması gerektiği için (örneğin ödeme durumunda faturalarınız veya hesabınızın açıldığına dair veriler) bazı verileriniz silinememektedir. Bizimle veya başka kullanıcılarla olabilecek uyuşmazlık durumlarında ve devam eden yasal süreçlerde tutmamız gereken veriler olduğunda bu periyodik temizlemeyi askıya alma hakkını elimizde tutuyoruz.</Text>
				<Text style= {styles.tcP}>Haklarınız Neler ?</Text>
				<Text style= {styles.tcP}>Kişisel Verilerin Korunmasına İlişkin kanununun 11.maddesine göre, verilerinizin saklanması ve işlenmesiyle alakalı değişmez haklarınız var:</Text>
					<Text style={styles.tcL}>{'\u2022'} Kişisel verilerinizin işlenip işlenmediğini öğrenme ve alakalı bilgileri talep etme</Text>
					<Text style={styles.tcL}>{'\u2022'} Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</Text>
					<Text style={styles.tcL}>{'\u2022'} Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</Text>
					<Text style={styles.tcL}>{'\u2022'} Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</Text>
					<Text style={styles.tcL}>{'\u2022'} Kişisel verilerinizin silinmesini veya yok edilmesini isteme</Text>
					<Text style={styles.tcL}>{'\u2022'} Yapılan değişikliklerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</Text>
					<Text style={styles.tcL}>{'\u2022'} İşlenen verilerin analiz edilmesiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</Text>
					<Text style={styles.tcL}>{'\u2022'} Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep edebilirsiniz</Text>
				<Text style={styles.tcP}>Bazı verileriniz bizim için olmazsa olmaz veriler (doğum tarihiniz gibi), bu verilerin silinmesini talep ettiğinizde hesabınız silinmek durumunda kalabilir.</Text>
				<Text style={styles.tcP}>Verilerinizle ilgili tüm sorularınız ve talepleriniz için bize business@meetdorm.com adresine e-posta gönderebilirsiniz.</Text>
				<Text style={styles.tcP}>{'\n'}Mahremiyet Politikamız,  6698 sayılı Kişisel Verilerin Korunması Kanunu çerçevesinde titizlikle hazırlanmıştır. Haklarınız ve verilerinizin korunmasıyla ilgili daha detaylı bilgi almak için: kvkk.gov.tr</Text>
				<Text style={styles.tcP}>{'\n'}6698 sayılı Kişisel Verilerin Korunması Kanunu çerçevesinde kişisel/özel nitelikli kişisel verilerimin; dorm hizmetleri kullanılarak tamamen veya kısmen elde edilmesi, kaydedilmesi, depolanması, değiştirilmesi, güncellenmesi, sınıflandırılması, işlendikleri amaç için gerekli olan ya da ilgili kanunda öngörülen süre kadar muhafaza edilmesi, kanuni nedenlerle veya yapılan işin niteliği gereği üçüncü kişiler ile paylaşılması, yurtdışına aktarılması da dahil olmak üzere yukarıda açıklandığı üzere işlenmesine, konu hakkında tereddüde yer vermeyecek şekilde bilgi sahibi ve aydınlatılmış olarak açık rızam ile onay veriyorum.</Text>
            </ScrollView>

            <TouchableOpacity 
				disabled={ !state }
				onPress={()=> {
					navigation.replace("RKullaniciSözlesmesi");
				}} 
				style={ state ? styles.button : styles.buttonDisabled }>
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
  	container:{
    	marginTop: 20,
    	marginLeft: 10,
    	marginRight: 10
  	},
  	title: {
      	fontSize: 24,
      	alignSelf: 'center'
  	},
	tcP: {
    	marginTop: 10,
      	marginBottom: 10,
      	fontSize: 14
  	},
  	tcP:{
      	marginTop: 10,
      	fontSize: 14
  	},
  	tcL:{
     	marginLeft: 10,
      	marginTop: 10,
      	marginBottom: 10,
      	fontSize: 14
  	},
  	tcContainer: {
    	marginTop: 15,
      	marginBottom: 15,
      	height: height * .75
  	},

  	button:{
      	backgroundColor: '#136AC7',
      	borderRadius: 5,
      	padding: 10
  	},

  	buttonDisabled:{
    	backgroundColor: '#999',
    	borderRadius: 5,
    	padding: 10
 	},

  	buttonLabel:{
      	fontSize: 14,
      	color: '#FFF',
      	alignSelf: 'center'
  	}

}

