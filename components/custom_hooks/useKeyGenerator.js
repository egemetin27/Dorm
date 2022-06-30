import React from "react";
import { Alert } from "react-native";

import axios from "axios";
import { url } from "../../connection";
import crypto from "../../functions/crypto";
import Constants from "expo-constants";

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
				})
				.catch((err) => {
					console.log("error on /appversion");
					// initializationError.current = true;
				});
		})();
		return () => controller?.abort();
	}, []);
	return initializationError;
};

export default useKeyGenerator;
