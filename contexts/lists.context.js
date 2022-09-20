import { createContext, useCallback, useMemo, useState } from "react";

export const ListsContext = createContext({
	lists: {},
	updateLists: () => {},
	getGender: () => {},
	getSign: () => {},
	getSmokeAndDrinkList: () => {},
	getDiet: () => {},
});

const ListsProvider = ({ children }) => {
	const [lists, setLists] = useState({});

	console.log(lists.genderList);

	const updateLists = useCallback((newListItems) => {
		setLists((oldLists) => ({
			...oldLists,
			...newListItems,
		}));
	}, []);

	const getGender = useCallback(
		(idx) => {
			return lists.genderList[idx].choice;
		},
		[lists]
	);

	const getSign = useCallback(
		(idx) => {
			return lists.signList[idx].choice;
		},
		[lists]
	);

	const getSmokeAndDrinkList = useCallback(
		(idx) => {
			return lists.smokeAndDrinkList[idx].choice;
		},
		[lists]
	);

	const getDiet = useCallback(
		(idx) => {
			return lists.dietList[idx].choice;
		},
		[lists]
	);

	const memoedValue = useMemo(
		() => ({
			lists,
			updateLists,
			getGender,
			getDiet,
			getSign,
			getSmokeAndDrinkList,
		}),
		[lists, updateLists, getGender, getDiet, getSign, getSmokeAndDrinkList]
	);

	return <ListsContext.Provider value={memoedValue}>{children}</ListsContext.Provider>;
};

export default ListsProvider;
