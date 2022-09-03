import { Dimensions, Text } from "react-native";

const { width, height } = Dimensions.get("window");

export const getInterests = (interestList) => {
	console.log({ interestList });
	if (!interestList || interestList.length === 0 || typeof interestList === "string") return "";
	return interestList.map((item, index) => {
		return (
			<Text
				key={index}
				style={{
					fontFamily: "PoppinsSemiBold",
					fontSize: Math.min(height * 0.03, width * 0.048),
				}}
			>
				{item.InterestName}
				{interestList.length > index + 1 ? (
					<Text
						style={{
							fontFamily: "PoppinsSemiBold",
							fontSize: Math.min(height * 0.03, width * 0.048),
						}}
					>
						{" "}
						|{" "}
					</Text>
				) : null}
			</Text>
		);
	});
};
