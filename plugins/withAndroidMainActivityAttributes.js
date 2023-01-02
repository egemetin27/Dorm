// // const { withAndroidManifest } = require("@expo/config-plugins");

// module.exports = function androiManifestPlugin(config) {
// 	return withAndroidManifest(config, async (config) => {
// 		let androidManifest = config.modResults.manifest;

// 		// androidManifest.$ = {
// 		// 	...androidManifest.$,
// 		// 	"xmlns:tools": "http://schemas.android.com/tools",
// 		// };

// 		androidManifest.application[0].activity[0]["intent-filter"] = [
// 			...androidManifest.application[0].activity[0]["intent-filter"],
// 			{
// 				action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
// 				category: [
// 					{ $: { "android:name": "android.intent.category.BROWSABLE" } },
// 					{ $: { "android:name": "android.intent.category.DEFAULT" } },
// 				],
// 				data: [
// 					{
// 						$: {
// 							"android:scheme": "https",
// 							"android:host": "dorm.onelink.me",
// 							"android:pathPrefix": "/Djzp",
// 						},
// 					},
// 				],
// 			},
// 		];

// 		return config;
// 	});
// };

// //   <intent-filter android:autoVerify="true">
// // 			<action android:name="android.intent.action.VIEW" />
// // 			<category android:name="android.intent.category.DEFAULT" />
// // 			<category android:name="android.intent.category.BROWSABLE" />
// // 			<data android:scheme="https" android:host="dorm.onelink.me" android:pathPrefix="/Djzp" />
// // 		</intent-filter>;
