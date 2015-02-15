(function () {
	Conekta.setPublishableKey("key_E9Q2zxKmsKsNyZy9");
	$(document).document(function () {
		cb = ConektaButton({
			amount: 2000,
			name: "Prueba de Boton",
			description: "Boton que crea un Modal"
		});
		console.log(cb);
	});
})();