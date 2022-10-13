const normalizeDate = (date) => {
	const newDate = new Date(date);
	newDate.setHours(newDate.getHours() - newDate.getTimezoneOffset() / 60);
	return newDate;
};

export const formatDate = (dateStr) => {
	const date = new Date(dateStr);

	if (typeof date !== "string" || date.indexOf("-") === -1) return "";

	const arr = date.split("-");
	const newDate = `${arr[2]}/${arr[1]}/${arr[0]}`;
	return newDate;
};

export const parseDate = (date) => {
	const newDate = new Date(date);

	return `${newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()} / ${
		newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1
	} / ${newDate.getFullYear()}`;
};

export const getWhen = (date) => {
	const now = normalizeDate(new Date());
	const newDate = new Date(date);

	var Difference_In_Time = now.getTime() - newDate.getTime();

	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

	var dayDifference;
	// switch (parseInt(Difference_In_Days)) {
	// 	case 0:
	// 	    dayDifference = "Bugün";
	// 		break;
	// 	case 1:
	// 		dayDifference = "Dün";
	// 		break;
	// 	default:
	// 		dayDifference = "Daha Önce";
	// 		break;
	// }

	if (parseInt(Difference_In_Days) == 0 && newDate.getDay() == now.getDay()) {
		dayDifference = "Bugün";
	} else if (parseInt(Difference_In_Days) == 0) {
		// if the message is from yesterday but no later than 24h
		dayDifference = "Dün";
	} else if (parseInt(Difference_In_Days) == 1 && now.getDay() - newDate.getDay() == 1) {
		dayDifference = "Dün";
	} else {
		dayDifference = "Daha Önce";
	}

	return dayDifference;
};

export const getHourMinute = (date) => {
	var msgdate = new Date(date);
	var hour =
		msgdate.getHours().toString().length == 1
			? "0" + msgdate.getHours().toString()
			: msgdate.getHours().toString();
	var minute =
		msgdate.getMinutes().toString().length == 1
			? "0" + msgdate.getMinutes().toString()
			: msgdate.getMinutes().toString();
	var time = hour + "." + minute;
	return time;
};

export const getAge = (date) => {
	var birthday = new Date(date);
	// console.log(birthday);
	return ~~((Date.now() - birthday) / 31557600000);
};
