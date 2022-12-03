import { useEffect } from "react";
import { BackHandler } from "react-native";

const useBackHandler = (action = () => {}, dependencies = []) => {
	useEffect(() => {
		const backAction = () => {
			action();
			return true;
		};

		const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

		return () => backHandler.remove();
	}, dependencies);
};

export default useBackHandler;
