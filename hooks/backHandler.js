import React from "react";
import { BackHandler } from "react-native";

const backHandler = (action) => {
	React.useEffect(() => {
		const backAction = () => {
			action();
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, []);
};

export default backHandler;
