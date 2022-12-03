import axios from "axios";
import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
} from "react";
import url from "../connection";
import crypto from "../functions/crypto";
import { AuthContext } from "./auth.context";

export const CATEGORIES = [
    {
        label: "Tümü",
        databaseKey: "",
        url: require("../assets/HomeScreenCategoryIcons/AllEvents.png"),
    },
    {
        label: "Favoriler",
        databaseKey: "isLiked",
        url: require("../assets/HomeScreenCategoryIcons/Favs.png"),
    },
    {
        label: "Kaçmaz",
        databaseKey: "Kacmaz",
        url: require("../assets/HomeScreenCategoryIcons/Hot.png"),
    },
    {
        label: "Gece",
        databaseKey: "Gece",
        url: require("../assets/HomeScreenCategoryIcons/Gece.png"),
    },
    {
        label: "Konser",
        databaseKey: "Konser",
        url: require("../assets/HomeScreenCategoryIcons/Concert.png"),
    },
    {
        label: "Deneyim",
        databaseKey: "experience",
        url: require("../assets/HomeScreenCategoryIcons/Experience.png"),
    },
    {
        label: "Kampüs",
        databaseKey: "Kampus",
        url: require("../assets/HomeScreenCategoryIcons/Campus.png"),
    },
    {
        label: "Kültür",
        databaseKey: "Culture",
        url: require("../assets/HomeScreenCategoryIcons/Culture.png"),
    },
    {
        label: "Film/Dizi",
        databaseKey: "Film",
        url: require("../assets/HomeScreenCategoryIcons/Movies.png"),
    },
];

export const EventContext = createContext({
    shownEvents: [],
    selectedCategory: null,
    changeCategory: () => {},
    fetchEvents: () => {},
});

export default function EventProvider({ children }) {
    const {
        user: { userId = 0, School = "", City = "" },
    } = useContext(AuthContext);
    // const { userId = 0, School = "", City = "" } = user ?? { userId: 0, School: "", City: "" };

    const [selectedCategory, setSelectedCategory] = useState(0);
    const [eventList, setEventList] = useState([]);

    const shownEvents = useMemo(() => {
        if (selectedCategory == 0) return eventList;
        const filtered = eventList.filter((item) => {
            if (!item[CATEGORIES[selectedCategory]?.databaseKey]) return false;
            return item[CATEGORIES[selectedCategory]?.databaseKey] == 1;
        });

        return filtered;
    }, [eventList, selectedCategory]);

    const fetchEvents = useCallback(async () => {
        const eventListData = crypto.encrypt({
            userId,
            kampus: School,
            city: City,
        });

        await axios
            .post(url + "/lists/EventList", eventListData)
            .then((res) => {
                const data = crypto.decrypt(res.data);
                setEventList(data);
            })
            .catch((err) => {
                console.log("error on /eventList");
                console.log(err);
                // console.log(err.response.data);
            });
    }, [userId, School, City]);

    const changeCategory = useCallback((index) => {
        setSelectedCategory(index);
    }, []);

    const value = useMemo(
        () => ({
            shownEvents,
            selectedCategory,
            changeCategory,
            fetchEvents,
        }),
        [shownEvents, selectedCategory, changeCategory, fetchEvents]
    );

    return (
        <EventContext.Provider value={value}>{children}</EventContext.Provider>
    );
}
