import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import { AuthContext } from "./auth.context";

import url from "../connection";
import crypto from "../functions/crypto";
import { sort } from "../utils/array.utils";

export const MessageContext = createContext({
	matchesList: {},
	chatsList: {},
	handleNewMessage: () => {},
	getLastMessage: () => {},
	readMessagesLocally: () => {},
	getMessagesList: () => {},
	getPreviousMessages: () => {},
	resetMessages: () => {},
});

const defaultMatchesList = {
	0: {
		emptyChats: [],
		nonEmptyChats: [],
	},
	1: {
		emptyChats: [],
		nonEmptyChats: [],
	},
};
// filter matchesList with respect to match modes and if chatted before
const filterMatchesList = (matchesList, chatsList = {}) => {
	const flirts = matchesList.filter((match) => match.matchMode == 0);
	const friends = matchesList.filter((match) => match.matchMode == 1);

	const chatIDs = Object.keys(chatsList);

	const nonEmptyChatIDs = chatIDs.filter((chatId) => {
		if (chatId in chatsList) {
			return chatsList[chatId]?.length > 0;
		}
		return false;
	});

	const categorizedList = {
		0: {
			emptyChats: flirts.filter(
				(item) => nonEmptyChatIDs.includes(item.MatchId.toString()) == false
			),
			nonEmptyChats: flirts.filter((item) => nonEmptyChatIDs.includes(item.MatchId.toString())),
		},
		1: {
			emptyChats: friends.filter(
				(item) => nonEmptyChatIDs.includes(item.MatchId.toString()) == false
			),
			nonEmptyChats: friends.filter((item) => nonEmptyChatIDs.includes(item.MatchId.toString())),
		},
	};

	return categorizedList;
};

//add user infos to the matchesList items
const organizeMatchesList = async (rawList, userId, sesToken, setRawMatchesList) => {
	var encryptedRequest = {};
	if (typeof rawList != "object" || !(rawList.length > 0)) return;

	const listWithUserDatas = await Promise.all(
		rawList.map(async (element) => {
			let otherId = element.MId1;
			if (element.MId1 == userId) {
				otherId = element.MId2;
			}
			encryptedRequest = crypto.encrypt({ userId, otherId });
			const res = await axios
				.post(url + "/profileInfo", encryptedRequest, {
					headers: { "access-token": sesToken },
				})
				.catch((err) => {
					console.log("error on /profileInfo");
					console.log(err.response.status);
					return {};
				});
			const userData = crypto.decrypt(res.data);

			const { MId1, MId2, ...newMatchInstance } = { ...element, userId, otherId, userData };
			return newMatchInstance;
		})
	);
	setRawMatchesList(listWithUserDatas);

	// return filterMatchesList(listWithUserDatas, chatList);
};

const getChatsList = async (userId, sesToken) => {
	const encryptedId = crypto.encrypt({ userId });
	const cList = await axios
		// .post("http://192.168.1.29:3002/oldMessage", encryptedId, {
		.post("https://devmessage.meetdorm.com/oldMessage", encryptedId, {
			headers: { "access-token": sesToken },
		})
		.then((res) => crypto.decrypt(res.data))
		.catch((err) => {
			console.log("error on /oldMessage", err.response.status);
		});

	return cList;
};

const MessageProvider = ({ children }) => {
	const { user, isLoggedIn } = useContext(AuthContext);
	const { userId, sesToken } = user ?? { userId: -1, sesToken: "" };

	const [rawMatchesList, setRawMatchesList] = useState([]);
	const [matchesList, setMatchesList] = useState(defaultMatchesList);
	const [chatsList, setChatsList] = useState({});

	useEffect(() => {
		if (isLoggedIn) {
			getMessagesList();
		} else {
			resetMessages();
		}
	}, [isLoggedIn]);

	useEffect(() => {
		const newMatchesList = filterMatchesList(rawMatchesList, chatsList);
		setMatchesList(newMatchesList);
	}, [chatsList, rawMatchesList]);

	const handleNewMessage = (msg) => {
		const matchId = msg.matchId;
		setChatsList((initialList) => {
			const oldMessageList = initialList[matchId] ?? [];
			return { ...initialList, [matchId]: [msg, ...oldMessageList] };
		});
	};

	const getMessagesList = async () => {
		if (isLoggedIn) {
			const resp = await axios
				.post(url + "/matchList", { userId }, { headers: { "access-token": sesToken } })
				.then((res) => {
					return res.data;
				})
				.catch((err) => {
					console.log(err.response.status);
					return {};
				});
			const cList = await getChatsList(userId, sesToken);
			setChatsList(cList);

			await organizeMatchesList(resp, userId, sesToken, setRawMatchesList);
		}
	};

	const getLastMessage = (matchId) => {
		try {
			const lastMessage = sort(chatsList[matchId], "date", false)[0];
			return lastMessage;
		} catch (err) {
			console.log(err);
			return "";
		}
	};

	const readMessagesLocally = (matchId) => {
		setChatsList((oldList) => ({ ...oldList, [matchId]: chatsList[matchId] }));
	};

	const getPreviousMessages = async (matchId, lastMessDate) => {
		const encryptedData = crypto.encrypt({ matchId, lastMessDate, userId });
		console.log(encryptedData);
		const prevMessages = await axios
			// .post("http://192.168.1.29:3002/prevmess", encryptedData, {
			.post("https://devmessage.meetdorm.com/prevmess", encryptedData, {
				headers: { "access-token": sesToken },
			})
			.then((res) => {
				const response =
					typeof res.data == "object" && res.data.length == 0 ? [] : crypto.decrypt(res.data);
				return response;
			})
			.catch((err) => {
				console.log("error on /prevmess:", err.request);
				// console.log("error on /prevmess:", err.response);
				return [];
			});
		setChatsList((oldList) => ({ ...oldList, [matchId]: [...prevMessages, ...oldList[matchId]] }));
	};

	const resetMessages = () => {
		setRawMatchesList([]);
		setMatchesList(defaultMatchesList);
		setChatsList({});
	};

	const value = {
		matchesList,
		chatsList,
		handleNewMessage,
		getLastMessage,
		readMessagesLocally,
		getMessagesList,
		getPreviousMessages,
	};
	return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};
export default MessageProvider;
