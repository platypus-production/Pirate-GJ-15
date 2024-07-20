### Sounds
Gestion du son, musique, effet séparément.
## Mouvements
- Des mouvements classique avec une accélération et du drag qui fera de la décélération sur la durée.
- Un dash avec un cooldown.
[example movement with acceleration](https://labs.phaser.io/edit.html?src=src\physics\arcade\dragon%20movement.js)

### Inventory System
Basic inventory system 
Juste un liste d'objet collecter et les équipement posséder.
## Crafting
Pour la première itération.
Un système de craft assez simpliste:  liste d'objet à crafter,
proposé des recettes et si les objet son présent dans l'inventaire exécuter le craft et supprimer les objets.

Puis, ajouter un système de crafting plus sur de la logique "petit alchimiste", le but et de prendre des objet avec un certain type de propriété et en faire un  nouvelle objet.
## Collect and drop
Le drop et la collecte d'objet, tout au long de la phase de jeu.
les ennemis en drop (calcul de drop rate),
trouvable dans des pièces spécifique:
- Sanitaire, salle de bain, toilette:
	- Javel
	- Savon
	- etc..
- Cuisine, salle à manger
	- aluminium
	- plastique
	- silicon
	- etc...
- Salon, salle de vie, chambre:
	- Cuivre (appareil electronique)
	- Lithium
	- etc...

## Light and Shadow
Avec le système de RayCasting, le but et d'avoir la vision uniquement sur ce que le joueur et censé voir.

## Armes, Objets
#### Armes
Le joueur aura droit à une arme (contondante || tranchante || distance).
Avec les différentes ressources collecter, vous pouvez l'associé à votre arme.
- Dague imprégné de cyanure
- Balle au phosphore
- Batte explosive
#### Objets
Vous pouvez avoir jusqu'à 4 Object en quantité limité.
Les objets peut-être des actifs durant le niveau, de lancé ou des consommable.


# Arts Design

Pixel Arts, vue de dessus.

**Inspirations**
- https://jayjay99.itch.io/top-down-shooter-male-character-animation
- https://zanipixels.itch.io/survival-horror
- https://penusbmic.itch.io/the-dark-series-animated-items-blueprints

# Diagram

