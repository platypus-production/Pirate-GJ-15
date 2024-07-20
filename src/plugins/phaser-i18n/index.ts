import type { InitOptions } from "i18next";
import { Phaseri18n } from "./plugins";

export const phaserI18n = (
	options: InitOptions,
): Phaser.Types.Core.PluginObjectItem => ({
	key: "i18n",
	mapping: "i18n",
	plugin: Phaseri18n,
	start: true,
	data: options,
});

export default phaserI18n;
