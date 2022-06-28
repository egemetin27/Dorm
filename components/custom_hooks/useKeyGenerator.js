import React from "react";

import axios from "axios";
import { url } from "../../connection";
import crypto from "../../functions/crypto";

const useKeyGenerator = () => {
	React.useEffect(() => {
		let controller = new AbortController();
		(async () => {
			const [dormId, myJson] = crypto.generateKey();
			const strJson = JSON.stringify(myJson);
			const encrypted = crypto.appVersionChecker(strJson);

			await axios
				.post(url + "/appversion", { dormId: dormId, message: encrypted })
				.then((res) => {
					console.log(res.data);
					new crypto({
						deviceId: myJson.deviceId,
						key: myJson.newSecuritykey,
						iv: myJson.newInitVector,
					});
				})
				.catch((err) => console.log("error on /appversion"));
		})();
		return () => controller?.abort();
	}, []);
};

export default useKeyGenerator;
