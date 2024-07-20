import type Phaseri18n from "./plugins";
import type { TranslatedText } from "./plugins";

declare module "phaser" {
	interface Scene {
		i18n: Phaseri18n;
	}
	namespace GameObjects {
		interface GameObjectFactory {
			i18Text: (payload: {
				x: number;
				y: number;
				style: Phaser.Types.GameObjects.Text.TextStyle;
				text: string | string[];
				interpolation: Record<string, string | boolean | number>;
			}) => TranslatedText;
		}
	}
}
