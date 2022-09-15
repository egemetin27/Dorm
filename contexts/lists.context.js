import { createContext, useMemo, useState } from "react";

export const ListsContext = createContext({
	lists: {},
	updateLists: () => {},
	getGender: () => {},
	getSign: () => {},
	getSmokeAndDrinkList: () => {},
	getDiet: () => {}
 });

const ListsProvider = ({ children }) => {
	const [lists, setLists] = useState({});

	const updateLists = (newListItems) => {
		setLists((oldLists) => ({
			...oldLists,
			...newListItems,
		}));
	};

	const getGender = (idx) => {
		return lists.genderList[idx].choice;
	};

	const getSign = (idx) => {
		return lists.signList[idx].choice;
	};

	const getSmokeAndDrinkList = (idx) => {
		return lists.smokeAndDrinkList[idx].choice;
	};

	const getDiet = (idx) => {
		return lists.dietList[idx].choice;
	};

	const memoedValue = useMemo(
		() => ({
			lists,
			updateLists,
			getGender,
			getDiet,
			getSign,
			getSmokeAndDrinkList,
		}),
		[lists]
	);

	return <ListsContext.Provider value={memoedValue}>{children}</ListsContext.Provider>;
};

export default ListsProvider;
