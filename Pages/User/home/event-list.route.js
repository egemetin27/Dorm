import { useContext, useEffect, useRef, useState } from "react";
import {
	Text,
	View,
	Dimensions,
	FlatList,
	ActivityIndicator,
	StyleSheet,
	Alert,
	BackHandler,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	Extrapolation,
	interpolate,
	withTiming,
} from "react-native-reanimated";

import Event from "../../../components/event-card-small.component";

import commonStyles from "../../../visualComponents/styles";
import { colors } from "../../../visualComponents/colors";

import HomeHeader from "../../../components/headers/header-home.component";
import { AuthContext } from "../../../contexts/auth.context";
import { CATEGORIES, EventContext } from "../../../contexts/events.context";
import CategoryButton from "./event-category-button.component";
import useBackHandler from "../../../hooks/useBackHandler";
import crypto from "../../../functions/crypto";
import axios from "axios";
import url from "../../../connection";

const { height, width } = Dimensions.get("window");

const ListEmptyComponent = () => {
	return (
		<View>
			<Text
				style={{
					textAlign: "center",
					fontFamily: "PoppinsSemiBold",
					fontSize: Math.min(width * 0.042, 20),
					color: colors.gray,
				}}
			>
				Maalesef burada gösterebileceğimiz bir etkinlik kalmamış...
			</Text>
		</View>
	);
};

const CATEGORIES_HEIGHT = height * 0.12;
const CARD_HEIGHT = width * 0.66 + 16;
// const EVENT_HEADER_HEIGHT = height * 0.15;

export default function EventList({ navigation }) {
	const {
		user: { userId, sesToken },
		mainPageTutorialDone,
		updateProfile,
	} = useContext(AuthContext);
	const { shownEvents, fetchEvents } = useContext(EventContext);

	const eventsFlatListRef = useRef();

	const categoryRow = useSharedValue(1);
	const [shouldScrollTopOnBackButton, setShouldScrollTopOnBackButton] = useState(false);

	const [isAppReady, setIsAppReady] = useState(false);

	useBackHandler(() => {
		if (shouldScrollTopOnBackButton) {
			eventsFlatListRef.current.scrollToIndex({ index: 0 });
			return;
		}
		Alert.alert("Emin Misin?", "Uygulamayı Kapatmak İstiyor Musun?", [
			{
				text: "Vazgeç",
				onPress: () => null,
				style: "cancel",
			},
			{ text: "EVET", onPress: () => BackHandler.exitApp() },
		]);
	}, [shouldScrollTopOnBackButton]);

	useEffect(() => {
		const dataToBeSent = crypto.encrypt({
			userId: userId,
			matchMode: 2,
		});

		axios
			.post(url + "/profile/matchMode", dataToBeSent, {
				headers: { "access-token": sesToken },
			}) // There is a typo (not Change but Chage) TODO: make userId variable
			.then(async (res) => {
				updateProfile({ matchMode: 2 });
			})
			.catch((error) => {
				console.log("Match Mode Error: ", error);
			});
	}, []);

	useEffect(() => {
		if (!mainPageTutorialDone) {
			setTimeout(() => {
				navigation.navigate("BeginningTutorialModal", { index: 0 });
			}, 100);
		}
		// setPeopleIndex(-1);
	}, []);

	useEffect(() => {
		fetchEvents().then(setIsAppReady(true));
	}, []);

	useEffect(() => {
		if (eventsFlatListRef.current && shownEvents.length > 0) {
			eventsFlatListRef.current.scrollToIndex({
				animated: false,
				index: 0,
			});
		}
	}, [shownEvents]);

	const animatedCategoryWrapper = useAnimatedStyle(() => {
		// console.log(scrollY.value);
		return {
			transform: [
				{
					translateY: withTiming(
						interpolate(categoryRow.value, [-1, 1], [-CATEGORIES_HEIGHT, 0], {
							ExtrapolationRight: Extrapolation.CLAMP,
							ExtrapolationLeft: Extrapolation.CLAMP,
						})
					),
				},
			],
			opacity: withTiming(
				interpolate(categoryRow.value, [-1, 1], [0, 1], {
					ExtrapolationRight: Extrapolation.CLAMP,
					ExtrapolationLeft: Extrapolation.CLAMP,
				})
			),
		};
	}, []);

	const animatedHeader = useAnimatedStyle(() => {
		// console.log(scrollY.value);
		return {
			elevation: withTiming(interpolate(categoryRow.value, [-1, 1], [16, 0])),
			shadowOpacity: withTiming(interpolate(categoryRow.value, [-1, 1], [1, 0])),
		};
	}, []);

	const handleScroll = ({ nativeEvent }) => {
		console.log({ nativeEvent });
		// const {
		// 	velocity: { y: velocityY },
		// 	contentOffset: { y: offsetY },
		// } = nativeEvent;

		// if (!shouldScrollTopOnBackButton && offsetY > CARD_HEIGHT) setShouldScrollTopOnBackButton(true);
		// if (shouldScrollTopOnBackButton && offsetY < CARD_HEIGHT) setShouldScrollTopOnBackButton(false);

		// if (offsetY < height / 5) {
		// 	categoryRow.value = 1;
		// 	return;
		// }

		// // velocityY = -1 -> down, +1 -> up
		// if (-1 < velocityY && velocityY < 0.5) return;

		// if (velocityY < 0) categoryRow.value = 1;
		// else if (velocityY > 0) categoryRow.value = -1;
	};

	if (!isAppReady) {
		return (
			<View style={[commonStyles.Container, { justifyContent: "center" }]}>
				<ActivityIndicator animating={true} color={"rgba(100, 60, 248, 1)"} size={"large"} />
			</View>
		);
	}

	return (
		<View style={[commonStyles.Container, { justifyContent: "space-between" }]}>
			<Animated.View
				style={[{ width: width, backgroundColor: colors.backgroundNew, zIndex: 2 }, animatedHeader]}
			>
				<HomeHeader page="event" />
			</Animated.View>
			<Animated.View style={[styles.categories, animatedCategoryWrapper]}>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					data={CATEGORIES}
					// style={{ height: height * 0.16, paddingBottom: height * 0.01 }}
					renderItem={({ item: { label, url }, index }) => (
						<CategoryButton index={index} label={label} url={url} />
					)}
				/>
			</Animated.View>
			<FlatList
				scrollEventThrottle={16}
				onScroll={handleScroll}
				ref={eventsFlatListRef}
				numColumns={2}
				initialNumToRender={8}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					// marginTop: CATEGORIES_HEIGHT,
					paddingTop: CATEGORIES_HEIGHT,
				}}
				keyExtractor={(item, idx) => item?.EventId?.toString()}
				data={shownEvents}
				getItemLayout={(data, index) => {
					return {
						length: CARD_HEIGHT, // height of card + marginBottom
						offset: CARD_HEIGHT * index,
						index,
					};
				}}
				renderItem={({ item, index }) => (
					<Event
						index={index}
						event={item}
						// length={shownEvents.length}
						openEvents={(idx) => {
							navigation.navigate("EventCards", {
								idx: idx,
								list: shownEvents,
							});
						}}
					/>
				)}
				ListFooterComponent={() => (shownEvents.length === 0 ? <ListEmptyComponent /> : null)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	categories: {
		top: height * 0.08,
		height: CATEGORIES_HEIGHT,
		position: "absolute",
		zIndex: 1,
		backgroundColor: colors.backgroundNew,
		paddingBottom: height * 0.01,
	},
});
