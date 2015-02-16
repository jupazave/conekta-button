# conekta-button
An easy way to integrate Conekta Checkout, without a lot of work. It takes care of building forms, validating input, and securing your customers' card data.

## How To

To integrate:

- Import the [conekta.js](https://www.conekta.io/es/docs/referencias/conekta-js) [v0.3.2](https://conektaapi.s3.amazonaws.com/v0.3.2/js/conekta.js)

- Set your Conekta Public Key
    
        Conekta.setPublishableKey("key_XXXXXXXXXXXXXXX");

- Call the plugin

    	ConektaButton({
    		amount: 2000, //Amount must be in MXN cents
    		name: "Payment Name",
    		description: "Payment Description"
    	});

Example

    Conekta.setPublishableKey("key_E9Q2zxKmsKsNyZy9");
    $("#conektaButton").click(function () {
        ConektaButton({
            amount: 2000,
    		name: "Payment Name",
    		description: "Payment Description"
        });
    });

See an example here: http://jupazave.github.io/conekta-button/example/index.html

## To Do

- [ ] On succes param
- [ ] On click default listener
- [ ] Disable default button
- [ ] Disable payment button after click
- [ ] Show using card brand
