import { useContext, useMemo, useRef } from "react";
import {
	Dimensions,
	// StyleSheet,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";

import RegisterInputField from "../components/register-input.component";
import { ListsContext } from "../contexts/lists.context";

const { width, height } = Dimensions.get("window");

const Temp = () => {
	const {
		lists: { univList, cityList },
	} = useContext(ListsContext);

	const INPUT_FIELDS = useMemo(
		() => [
			{
				label: "Merhaba!\nBenim adım",
				placeholder: "Adın & Soyadın",
				subInfo:
					"Biz de kullanıcı adının ayca_22 olmasını isterdik ama burada gerçek ismine ihtiyacımız var.",
				inputType: "text",
			},
			{ label: "Doğum Tarihim", placeholder: "gg / aa / yyyy", subInfo: "", inputType: "date" },
			{
				label: "Bulunduğum Şehir",
				placeholder: "Okuduğum Şehir",
				subInfo: "",
				inputType: "select",
				list: cityList,
			},
			{
				label: "Üniversitem",
				placeholder: "Üniversitemin Adı",
				subInfo: "",
				inputType: "select",
				list: univList,
			},
			{
				label: "E-Mail\nAdresim",
				placeholder: "Üniversite E-Mail Adresim",
				subInfo:
					"dorm, üniversiteliler tarafından sadece üniversiteliler için tasarlandı. Bu yüzden, sadece üniversite e-posta adresinle kayıt olabilirsin.",
				inputType: "text",
			},
		],
		[univList, cityList]
	);

	// const index = 2;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View style={{ justifyContent: "center", flex: 1, width: width }}>
				<View style={{ width: width, justifyContent: "center", alignItems: "center" }}>
					<Carousel
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
							/>
						)}
					/>
				</View>
			</View>
		</GestureHandlerRootView>
	);
};

export default Temp;

// const styles = StyleSheet.create({});
