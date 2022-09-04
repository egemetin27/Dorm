import React, { useContext } from "react";
import axios from "axios";
import Constants from "expo-constants";

import crypto from "../functions/crypto";
import url from "../connection";
import { Session } from "../nonVisualComponents/SessionVariables";
import { ListsContext } from "../contexts/lists.context";

const useKeyGenerator = () => {
	const { updateLists } = useContext(ListsContext);
	const [initializationError, setInitializationError] = React.useState(false);
	// const initializationError = React.useRef(false);
	React.useEffect(() => {
		let controller = new AbortController();

		(async () => {
			const [dormId, myJson] = crypto.generateKey();
			const strJson = JSON.stringify(myJson);
			const encryptedMessage = crypto.appVersionChecker(strJson);

			await axios
				// .post("/https://devmessage.meetdorm.com/appversion", {
				.post(url + "/appversion", {
					dormId: dormId,
					message: encryptedMessage,
				})
				.then((res) => {
					const { appVersion, genderList, univList, sexualOrientationList, expectationList } = res.data;
					updateLists({ genderList, univList, sexualOrientationList, expectationList });

					const localVersion = Constants.manifest.version.slice(
						0,
						Constants.manifest.version.lastIndexOf(".")
					);
					const realVersion = appVersion;
					if (realVersion > localVersion) {
						setInitializationError(true);
					}
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
