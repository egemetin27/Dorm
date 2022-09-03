import { createContext, useMemo, useState } from "react";

export const ListsContext = createContext({
	lists: {},
	updateLists: () => {},
});

const ListsProvider = ({ children }) => {
	const [lists, setLists] = useState({});

	const updateLists = (newListItems) => {
		setLists((oldLists) => ({
			...oldLists,
			...newListItems,
		}));
	};

	const memoedValue = useMemo(
		() => ({
			lists,
			updateLists,
		}),
		[lists]
	);

	return <ListsContext.Provider value={memoedValue}>{children}</ListsContext.Provider>;
};

export default ListsProvider;
