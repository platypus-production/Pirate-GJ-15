# Phaser I18n

> Disclaimer: This plugin works in my phaser configuration, it has not yet been developed and tested so that it works independently.   

`Phaser-i18n` is a small plugin to handle a simple case of internationalization for a game.
It implements the [`i18next`](https://www.i18next.com/) library in a global plugin, accessible via `this.i18n` in a `Phaser.Scene`,

but also a `GameObject` that automatically translates text, accessible via `this.add.i18Text` in a `Phaser.Scene`.


# Installation

```js
  import {phaserI18n} from '@plugins'

	new Phaser.Game({
    height: 800,
    width: 600
    plugin: {
      global: [
        {
          // add the classic i18n options
          // [i18next#Configuration-Option]('https://www.i18next.com/overview/configuration-options')
          phaserI18n(options)
        }
      ]
    }
  });
```

# Exemple

## Without `i18Text`
```js
class MyScene extends Phaser.Scene {
  create() {
    this.add.text(
      100,
      100
      this.i18n.t('translate-key')
    )
  }
}
```

## Without `i18Text`
```js
class MyScene extends Phaser.Scene {
  create() {
    const buttonContainer = this.add.container(
			150,
			150,
		);
		for (const lang of this.i18n.supportedLngs) {
			const text = this.add
				.text(0 + buttonContainer.length * 32, 0, lang)
				.setInteractive()
				.on("pointerdown", () => this.i18n.changeLanguage(lang));
			buttonContainer.add(text);
		}

    this.add.i18Text(
      100,
      100
      this.i18n.t('translate-key')
    )
  }
}

```