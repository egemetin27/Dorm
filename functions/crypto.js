import CryptoES from "crypto-es";

function randomString(length) {
	var result = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

class crypto {
	// static #deviceId = "avXB0JH12ZzsoihRdZREMz6J3UyDSVZm";
	// static #key = "mrpK2IVh4HgvLWl8AdtunLUHR7OWMbzP";
	// static #iv = "btf0jfdRoyol3QiF";
	static #deviceId;
	static #key;
	static #iv;

	static appVersionChecker(message) {
		let encrypted = CryptoES.AES.encrypt(message, "O7SzQkunl5HUBl3dgbWPBRJpxAyGA2Y9", {
			iv: "O7SzQkunl5HUBl3d",
		});
		return encrypted.toString();
	}

	static generateKey() {
		const newSecuritykey = randomString(32);
		const newInitVector = randomString(16);
		const deviceId = randomString(32);

		this.#key = newSecuritykey;
		this.#iv = newInitVector;
		this.#deviceId = deviceId;

		return [randomString(16), { deviceId, newSecuritykey, newInitVector }];
	}

	static encrypt(toBeEncrypted) {
		// take json object
		let encrypted = CryptoES.AES.encrypt(JSON.stringify(toBeEncrypted), this.#key, {
			iv: this.#iv,
		});

		const dataToBeSent = { dormId: this.#deviceId, message: encrypted.toString() };
		// return {dormId: _device id_, message: _encrypted message_}
		return dataToBeSent;
	}

	static decrypt(toBeDecrypted) {
		const decrypted = CryptoES.AES.decrypt(toBeDecrypted, this.#key, {
			iv: this.#iv,
		});

		const data = JSON.parse(decrypted.toString(CryptoES.enc.Utf8));
		return data;
	}

	static decryptString(toBeDecrypted) {
		const decrypted = CryptoES.AES.decrypt(toBeDecrypted, this.#key, {
			iv: this.#iv,
		});
		return decrypted.toString(CryptoES.enc.Utf8);
	}
}

export default crypto;
