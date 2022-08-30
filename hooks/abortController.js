import { useEffect } from "react";

const abortController = () => {
	useEffect(() => {
		console.log("connected");
		let abortController = new AbortController();
		return () => {
			console.log("aborted");
			abortController.abort();
		};
	}, []);
};

export default abortController;
