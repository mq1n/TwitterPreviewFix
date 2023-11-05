/**
 * @name TwitterPreviewFix
 * @author mq1n
 * @authorId 267708018693636097
 * @version 1.0.0
 * @description Bring back Twitter link previews in Discord messages with this BetterDiscord addon
 * @source https://github.com/mq1n/TwitterPreviewFix/
 * @updateUrl https://raw.githubusercontent.com/mq1n/TwitterPreviewFix/main/TwitterPreviewFix.plugin.js
 */

const config = {
	info: {
		name: "TwitterPreviewFix",
		authors: [
			{
				name: "mq1n"
			}
		],
		version: "1.0.0",
		description: "Bring back Twitter link previews in Discord messages with this BetterDiscord addon"
	},
	changelog: [
	],
	defaultConfig: []
};

class Dummy {
	constructor() {this._config = config;}
	start() {}
	stop() {}
}
 
if (!global.ZeresPluginLibrary) {
	BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
		confirmText: "Download Now",
		cancelText: "Cancel",
		onConfirm: () => {
			require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
				if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
				await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
			});
		}
	});
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
	const plugin = (Plugin, Library) => {
		const { Patcher, WebpackModules } = Library;

		return class TwitterPreviewFix extends Plugin {
			constructor() {
				super();
			}

			onStart() {
				const DeviceStore = WebpackModules.getByProps('jumpToMessage');   
				if (DeviceStore?._sendMessage) {
					Patcher.before(
						DeviceStore,
						'sendMessage',
						(_, args, ret) => {
							args[1].content = this.substitute(args[1].content);
							return ret;
						}
					);
				}
			}

			onStop() {
				Patcher.unpatchAll()
			}

			substitute (message) {
				return message.replace(/(https?:\/\/)(www\.)?twitter\.com/g, '$1vxtwitter.com');
			}
		};
	};
	 return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
