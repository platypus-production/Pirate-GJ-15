import { Enemy, Entity, Player } from "@game/objects";

export const isEntity = <T>(object: T) => object instanceof Entity;
export const isEnemy = <T>(object: T) => object instanceof Enemy;
export const isPlayer = <T>(object: T) => object instanceof Player;

export const toEntity = <T>(object: T) => {
	if (!isEntity(object))
		throw new Error("ENTITY_UTILS: The passed object is not an Entity");
	return object as Entity;
};

export const toEnemy = <T>(object: T) => {
	if (!isEnemy(object))
		throw new Error("ENTITY_UTILS: The passed object is not an Enemy");
	return object as Enemy;
};

export const toPlayer = <T>(object: T) => {
	if (!isPlayer(object))
		throw new Error("ENTITY_UTILS: The passed object is not an Player");
	return object as Player;
};
