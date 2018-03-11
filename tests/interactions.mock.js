/**
 * Bouchon permettant de simuler des interactions avec l'utilisateur
 */

// Chiffre entré par l'utilisateur
var userInput = 1;

exports.alert = function (text) {
}


exports.prompt = function (text) {
	return userInput;
}


exports.setUserInput = function (value) {
	userInput = value;
}