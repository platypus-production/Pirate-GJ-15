import type { InitOptions, TFunction, i18n } from "i18next";
import i18next from "i18next";
import browserLngDetector from "i18next-browser-languagedetector";

const DEFAULT_I18N_CONFIG: InitOptions = {
	lng: "en",
	fallbackLng: "en",
	debug: process.env.NODE_ENV === "development",
};

const PhaserI18nEventEmitter = new Phaser.Events.EventEmitter();

export class Phaseri18n extends Phaser.Plugins.BasePlugin {
	private i18n: i18n;
	public t: TFunction;
	public supportedLngs: string | string[];

	constructor(pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);

		this.i18n = i18next;
		this.i18n.use(browserLngDetector);

		pluginManager.registerGameObject(
			"i18Text",
			function ({
				x,
				y,
				text,
				interpolation,
				style,
			}: {
				x: number;
				y: number;
				text: string | string[];
				interpolation?: Record<string, string | number | boolean>;
				style?: Phaser.Types.GameObjects.Text.TextStyle;
			}) {
				// @ts-ignore
				// `this` refers to the context of `Phaser.GameObject.GameObjectFactory`.
				return new TranslatedText(this.scene, x, y, text, interpolation, style);
			},
		);
	}

	public async init(data?: InitOptions) {
		const instance = await this.i18n.init({
			...DEFAULT_I18N_CONFIG,
			...data,
		});

		this.t = instance;
		this.supportedLngs = Object.keys(data?.resources || {});
	}

	changeLanguage(lang: string) {
		this.i18n.changeLanguage(lang, (err) => {
			if (err) {
				console.error("[PhaserI18n] changeLanguage failed:", err);
			}
			PhaserI18nEventEmitter.emit("LANGAGE_CHANGE");
		});
	}
}

export class TranslatedText extends Phaser.GameObjects.Text {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string | string[],
		interpolation?: Record<string, string | boolean | number>,
		style?: Phaser.Types.GameObjects.Text.TextStyle,
	) {
		super(scene, x, y, scene.i18n.t(text, interpolation), style || {});

		scene.add.existing(this);

		PhaserI18nEventEmitter.on("LANGAGE_CHANGE", () => {
			this.setText(this.scene.i18n.t(text, interpolation));
		});
	}
}
