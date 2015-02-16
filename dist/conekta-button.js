window.ConektaButton = function() {
  var cancelButton, cc_cvc, cc_date, cc_number, defaultParams, formatted, makePayment, params, _helpers;
  defaultParams = {
    amount: 0,
    name: "",
    description: ""
  };
  _helpers = {
    extend: function(a, b) {
      var key, _i, _len;
      for (_i = 0, _len = b.length; _i < _len; _i++) {
        key = b[_i];
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    },
    getModal: function() {
      return document.querySelector(".c-modal");
    },
    removeModal: function() {
      document.body.removeChild(_helpers.getModal());
    },
    openModal: function(params) {
      var wrapHtml, _form;
      _form = "<div class=\"c-modal\">\n    <div class=\"c-modal-dialog\">\n        <div class=\"c-modal-content \">\n            <div class=\"c-modal-header\">\n                <h1>Pagar</h1>\n            </div>\n            <form>\n                <div class=\"c-modal-body\">\n                    <div class=\"card\">\n                        <div class=\"info\">\n                            <div class=\"tag\">Total: $ " + params.total + "</div>\n                            <div class=\"brand-cards\">\n                                <div class=\"logo-visa\"></div>\n                                <div class=\"logo-mastercard\"></div>\n                                <div class=\"logo-amex\"></div>\n                            </div>\n                        </div>\n                        <div class=\"line\">\n                            <div class=\"group number\">\n                                <label>Numero de la Tarjeta</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-number placeholder=\"**** **** **** ****\"/>\n                            </div>\n\n                            <div class=\"group date\">\n                                <label>Fecha de Expiracion</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-date placeholder=\"MM / YY\"/>\n                            </div>\n                        </div>\n\n                        <div class=\"line\">\n                            <div class=\"group name\">\n                                <label>Nombre en la Tarjeta</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-name placeholder=\"John Appleseed\"/>\n                            </div>\n\n                            <div class=\"group cvc\">\n                                <label>CVC</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-cvc placeholder=\"cvc\"/>\n                            </div>\n                        </div>\n\n                    </div>\n                </div>\n                <div class=\"c-modal-footer\">\n                    <div class=\"actions\">\n                        <button type=\"button\" class=\"control\" id=\"cancel\" data-conekta-card-cancel>Cancelar</button>\n                        <button type=\"button\" class=\"control\" id=\"paynow\" data-conekta-card-submit>Pagar ahora</button>\n                    </div>\n                </div>\n            </form>\n            \n        </div>\n    </div>\n</div>";
      wrapHtml = document.createElement('div');
      wrapHtml.setAttribute("class", "c-modal");
      wrapHtml.innerHTML = _form;
      document.body.appendChild(wrapHtml);
    }
  };
  window.document.onkeydown = function(e) {
    if (!e) {
      e = event;
    }
    if (e.keyCode === 27) {
      _helpers.removeModal();
      window.document.onkeydown = function(e) {
        if (!e) {
          e = event;
        }
        return e;
      };
    }
  };
  if (arguments[0] === null) {
    window.console.error('ConektaButton expects at least 1 attribute of type Object!');
    return false;
  }
  if (typeof arguments[0] !== "object") {
    window.console.error("Unexpected type of argument! Expected \"object\", got " + (typeof arguments[0]));
    return false;
  } else {
    params = _helpers.extend(defaultParams, {});
    if (arguments[0].amount == null) {
      window.console.error('Missing "Amount" Attribute');
      return false;
    }
    if (arguments[0].name == null) {
      window.console.error('Missing "Name" Attribute');
      return false;
    }
    params.amount = arguments[0].amount;
    params.name = arguments[0].name;
    params.total = ((params.amount.toFixed().substring(params.amount.toFixed().length - 2, 0)) + "." + (params.amount.toFixed().substring(params.amount.toFixed().length - 2))).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    params.description = arguments[0].description || defaultParams.description;
    _helpers.openModal(params);
    cc_number = document.querySelector("[data-conekta-card-number]");
    cc_date = document.querySelector("[data-conekta-card-date]");
    cc_cvc = document.querySelector("[data-conekta-card-cvc]");
    formatted = new Formatter(cc_number, {
      'pattern': '{{9999}} {{9999}} {{9999}} {{9999}}',
      'persistent': false
    });
    formatted = new Formatter(cc_date, {
      'pattern': '{{99}} / {{99}}',
      'persistent': false
    });
    formatted = new Formatter(cc_cvc, {
      'pattern': '{{9999}}',
      'persistent': false
    });
    cancelButton = function(e) {
      return _helpers.removeModal();
    };
    makePayment = function(e) {
      var card, charge, cvc, date, error, has_error, month, name, number, success, year;
      e.preventDefault();
      has_error = false;
      card = {};
      name = document.querySelector("[data-conekta-card-name]").value;
      if (!name) {
        has_error = true;
      } else {
        card.name = name;
      }
      date = document.querySelector("[data-conekta-card-date]").value;
      if (!date) {
        has_error = trueconsole.log("The date is invalid: ", date);
      } else {
        date = date.split(" / ");
        month = date[0];
        year = date[1];
        if (!Conekta.card.validateExpirationDate(month, year)) {
          has_error = trueconsole.log("The date is invalid. Month", month, ", Year: ", year);
        } else {
          card.exp_year = year;
          card.exp_month = month;
        }
      }
      number = document.querySelector("[data-conekta-card-number]").value;
      if (!Conekta.card.validateNumber(number)) {
        has_error = true;
      } else {
        card.number = number;
      }
      cvc = document.querySelector("[data-conekta-card-cvc]").value;
      if (!Conekta.card.validateCVC(cvc)) {
        has_error = true;
      } else {
        card.cvc = cvc;
      }
      if (!has_error) {
        charge = {
          amount: params.amount,
          currency: 'MXN',
          description: params.description,
          card: card
        };
        success = function(charge) {
          _helpers.removeModal();
          return alert("Cargo Realizado");
        };
        error = function(response) {
          return alert("Error al realizar el cargo");
        };
        return Conekta.charge.create(charge, success, error);
      } else {

      }
    };
    document.querySelector("[data-conekta-card-submit]").addEventListener("click", makePayment, false);
    document.querySelector("[data-conekta-card-cancel]").addEventListener("click", cancelButton, false);
    return this;
  }
  return params;
};
