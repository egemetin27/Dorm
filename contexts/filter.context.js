import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TYPES = {
	range: "range",
	radio: "radio",
};

export const FILTERS = {
	age: { name: "Yaş", type: TYPES.range, databaseKey: "age" },
	sex: { name: "Cinsiyet", type: TYPES.radio, databaseKey: "cinsiyet" },
	university: { name: "Üniversite", type: TYPES.radio, disabled: true },
	sign: { name: "Burç", type: TYPES.radio, disabled: true },
	diet: { name: "Beslenme Biçimi", type: TYPES.radio, disabled: true },
	// drink: { name: "İçki", type: TYPES.radio, disabled: true },
	// smoke: { name: "Sigara", type: TYPES.radio, disabled: true },
	// religion: { name: "Din", type: TYPES.radio, disabled: true },
	// orientation: { name: "Cinsel Yönelim", type: TYPES.radio, disabled: true },
};

export const OPTIONS = {
	age: {},
	sex: [
		{ name: "Kadın", databaseKey: "" },
		{ name: "Erkek", databaseKey: "" },
		{ name: "Non-Binary", databaseKey: "" },
	],
	university: [{}],
	sign: [{}],
	diet: [{}],
	// drink: [{}],
	// smoke: [{}],
	// religion: [{}],
	// orientation: [{}],
};

export const FilterContext = createContext({
	savedFilters: {},
	filters: {},
	saveFilters: () => {},
	changeFilters: () => {},
	discardUnsaved: () => {},
});

const FilterProvider = ({ children }) => {
	const [savedFilters, setSavedFilters] = useState({
		age: [18, 35],
		cinsiyet: [0, 0, 0],
		egsersiz: [0, 0, 0],
		alkol: [0, 0, 0],
		sigara: [0, 0, 0],
		yemek: [0, 0, 0, 0, 0],
	});

	const [filters, setFilters] = useState(savedFilters);

	useEffect(() => {
		const prepare = () => {
			AsyncStorage.getItem("filters").then((filtersStr) => {
				if (filtersStr === null) return;
				const filters = JSON.parse(filtersStr);
				setSavedFilters(filters);
			});
		};

		prepare();
	}, []);

	useEffect(() => {
		setFilters(savedFilters);
	}, [savedFilters]);

	const changeFilters = (key, { idx, value }) => {
		if (value) {
			setFilters((prevValue) => ({
				...prevValue,
				[FILTERS[key].databaseKey]: value,
			}));
			return;
		}

		var newValue = [...filters[FILTERS[key].databaseKey]];
		newValue[idx] = newValue[idx] == 0 ? 1 : 0;
		setFilters((prevValue) => ({
			...prevValue,
			[FILTERS[key].databaseKey]: newValue,
		}));
	};

	const saveFilters = () => {
		const newFilters = { ...filters };
		Object.keys(filters).forEach((key) => {
			if (key === "age") return;
			if (typeof filters[key] === "number") return; // return if value is not an array
			if (filters[key].some((item) => item == 0)) return; // return if array has 0 as a value
			newFilters[key] = filters[key].map(() => 0); // change all 1s to 0 in the array
			return;
		});

		AsyncStorage.setItem("filters", JSON.stringify(newFilters));

		setSavedFilters(newFilters);
	};

	const discardUnsaved = () => {
		setFilters(savedFilters);
	};

	const value = { savedFilters, filters, changeFilters, saveFilters, discardUnsaved };
	return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export default FilterProvider;
