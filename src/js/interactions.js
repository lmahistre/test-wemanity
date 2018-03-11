/**
 * Gère des interactions avec l'utilisateur
 * L'encapsulation de ces fonctions dans un module permet de bouchonner ces
 * interactions pour les tests unitaires
 */
exports.alert = function (text) {
	window.alert(text);
}


exports.prompt = function (text) {
	return window.prompt(text);
}