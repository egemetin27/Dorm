import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

import { AuthContext } from "./auth.context";

import url from "../connection";
import crypto from "../functions/crypto";

export const MessageContext = createContext({
	matchesList: {},
	chatsList: {},
	handleNewMessage: () => {},
	getLastMessage: () => {},
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

const filterMatchesList = (matchesList, chatsList) => {
	const flirts = matchesList.filter((match) => match.matchMode == 0);
	const friends = matchesList.filter((match) => match.matchMode == 1);

	const chatIDs = Object.keys(chatsList);

	const nonEmptyChatIDs = chatIDs.filter((chatId) => chatsList[chatId].length > 0);

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

const organizeMatchesList = async (rawList, userId, sesToken, chatList, rawMatchesList) => {
	// var listWithUserData = [];
	var encryptedRequest = {};

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
	rawMatchesList.current = listWithUserDatas;

	// return filterMatchesList(listWithUserDatas, chatList);
};

const organizeChatsList = async (rawList, userId, sesToken) => {
	const cList = await axios
		.post(
			"https://devmessage.meetdorm.com/oldMessage",
			{ userId },
			{ headers: { "access-token": sesToken } }
		)
		.then((res) => res.data)
		.catch((err) => {
			console.log("error on /oldMessage");
			console.log(err.response.status);
		});

	return cList;
};

const MessageProvider = ({ children }) => {
	const rawMatchesList = useRef([]);
	const [matchesList, setMatchesList] = useState(defaultMatchesList);
	const [chatsList, setChatsList] = useState([]);

	/* 
   TODO: template: 
      matchesList = {
			0: {
				emptyChats: {
					otherUserId1 or matchId1: [{fromWho, message, date}, ...],
				},
				nonEmptyChats: {
					otherUserId2 or matchId2: [{fromWho, message, date}, ...]
				}
			},
			1: {
				emptyChats: {
					otherUserId1 or matchId1: [{fromWho, message, date}, ...],
				},
				nonEmptyChats: {
					otherUserId2 or matchId2: [{fromWho, message, date}, ...]
				}
			}
      }
   */

	const { user, isLoggedIn } = useContext(AuthContext);
	const { userId, sesToken } = user ?? { userId: -1, sesToken: "" };

	useEffect(() => {
		if (isLoggedIn) {
			(async () => {
				const resp = await axios
					.post(url + "/matchList", { userId }, { headers: { "access-token": sesToken } })
					.then((res) => res.data)
					.catch((err) => {
						console.log("error on /matchList");
						console.log(err.response.status);
						return {};
					});
				const mList = await organizeMatchesList(resp, userId, sesToken, cList, rawMatchesList);
				const cList = await organizeChatsList(resp, userId, sesToken);
				setChatsList(cList);
				// setMatchesList(mList);
			})();
		}
	}, [isLoggedIn]);

	useEffect(() => {
		const newMatchesList = filterMatchesList(rawMatchesList.current, chatsList);
		setMatchesList(newMatchesList);
	}, [chatsList]);

	function handleNewMessage(msg) {
		const matchId = msg.matchId;
		setChatsList((initialList) => {
			const oldMessageList = initialList[matchId] ?? [];
			return { ...initialList, [matchId]: [msg, ...oldMessageList] };
		});
	}

	const getLastMessage = (matchId) => {
		try {
			const { message, date } = chatsList[matchId][0];
			return { message, date };
		} catch (err) {
			console.log(err);
		}
	};

	const value = { matchesList, chatsList, handleNewMessage, getLastMessage };
	return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};
export default MessageProvider;
