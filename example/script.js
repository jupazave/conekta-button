(function () {
	Conekta.setPublishableKey("key_E9Q2zxKmsKsNyZy9");
	$("#conektaButton").click(function (e) {
		e.preventDefault();
		cb = ConektaButton({
			amount: 2000,
			name: "Prueba de Boton",
			description: "Boton que crea un Modal",
			element: "#conektaButton"
		});
		console.log(cb);
	});
})();