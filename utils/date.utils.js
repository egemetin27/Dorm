const normalizeDate = (date) => {
	const newDate = new Date(date);
	newDate.setHours(newDate.getHours() - newDate.getTimezoneOffset() / 60);
	return newDate;
};

export const formatDate = (date) => {
	const arr = date.split("-");
	const newDate = `${arr[2]}/${arr[1]}/${arr[0]}`;
	return newDate;
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
	}
	else if (parseInt(Difference_In_Days) == 0) {
		// if the message is from yesterday but no later than 24h
	    dayDifference = "Dün";
	}
	else if (parseInt(Difference_In_Days) == 1 && now.getDay() - newDate.getDay() == 1) {
		dayDifference = "Dün";
	}
	else {
		dayDifference = "Daha Önce";
	}
	
	return dayDifference;
};

export const getAge = (date) => {
	var birthday = new Date(date);
	// console.log(birthday);
	return ~~((Date.now() - birthday) / 31557600000);
};
