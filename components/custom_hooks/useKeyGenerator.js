import React from "react";
import { Alert } from "react-native";
import axios from "axios";
import Constants from "expo-constants";

import crypto from "../../functions/crypto";
import url from "../../connection";

const useKeyGenerator = () => {
	const [initializationError, setInitializationError] = React.useState(false);
	// const initializationError = React.useRef(false);
	React.useEffect(() => {
		let controller = new AbortController();

		(async () => {
			const [dormId, myJson] = crypto.generateKey();
			const strJson = JSON.stringify(myJson);
			const encryptedMessage = crypto.appVersionChecker(strJson);

			await axios
				.post(url + "/appversion", { dormId: dormId, message: encryptedMessage })
				.then((res) => {
					const localVersion = Constants.manifest.version.slice(
						0,
						Constants.manifest.version.lastIndexOf(".")
					);
					const realVersion = res.data.slice(0, res.data.lastIndexOf("."));
					if (realVersion > localVersion) {
						setInitializationError(true);
					}
					console.log("no problem on app version");
				})
				.catch((err) => {
					console.log("error on /appversion");
					console.log(err);
					// initializationError.current = true;
				});
		})();
		return () => controller?.abort();
	}, []);
	return initializationError;
};

export default useKeyGenerator;
