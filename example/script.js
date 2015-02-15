(function () {
	Conekta.setPublishableKey("key_E9Q2zxKmsKsNyZy9");
	$("#conektaButton").click(function () {
		cb = ConektaButton({
			amount: 2000,
			name: "Prueba de Boton",
			description: "Boton que crea un Modal"
		});
	});
})();