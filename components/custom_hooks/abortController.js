import React from "react";

const abortController = () => {
	React.useEffect(() => {
		console.log("connected");
		let abortController = new AbortController();
		return () => {
			console.log("aborted");
			abortController.abort();
		};
	}, []);
};

export default abortController;
