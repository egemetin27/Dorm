import axios from "axios";
import { createContext, useContext, useMemo, useCallback, useState, useEffect } from "react";
import url from "../connection";
import crypto from "../functions/crypto";
import { AuthContext } from "./auth.context";
import { FilterContext } from "./filter.context";

export const PeopleContext = createContext({
	peopleList: [],
	changeMode: () => {},
});

export default function PeopleProvider({ children }) {
	const {
		user: { userId, matchMode },
		updateProfile,
	} = useContext(AuthContext);
	const { savedFilters } = useContext(FilterContext);

	const [peopleList, setPeopleList] = useState([]);

	// const fetchPeople = useCallback(async () => {
	// 	const pepopleListData = crypto.encrypt({ userId, ...filters });

	// 	await axios
	// 		.post(url + "/lists/Swipelist", pepopleListData)
	// 		.then((res) => {
	// 			const data = crypto.decrypt(res.data);
	// 			setPeopleList(data);
	// 		})
	// 		.catch((err) => {
	// 			console.log("error on /swipeList");
	// 			console.log(err);
	// 		});
	// }, [userId, filters]);

	useEffect(() => {
		(async () => {
			if (matchMode === 2) return;

			const pepopleListData = crypto.encrypt({ userId, ...savedFilters });

			await axios
				.post(url + "/lists/Swipelist", pepopleListData)
				.then((res) => {
					const data = crypto.decrypt(res.data);
					setPeopleList(data);
				})
				.catch((err) => {
					console.log("error on /swipeList");
					console.log(err);
				});
		})();
	}, [userId, savedFilters]);

	const changeMode = useCallback(
		async (newMode) => {
			// 0 = flirt, 1 = friend
			const matchModeData = crypto.encrypt({
				userId,
				matchMode: newMode,
				...savedFilters,
			});

			await axios
				.post(url + "/profile/matchmode2", matchModeData)
				.then((res) => {
					const data = crypto.decrypt(res.data);
					setPeopleList(data);
					updateProfile({ matchMode: newMode });
				})
				.catch((err) => {
					console.log("error on /matchmode2");
					console.log(err);
				});
		},
		[userId, savedFilters]
	);

	const value = useMemo(() => ({ peopleList, changeMode }), [peopleList, changeMode]);
	return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}
