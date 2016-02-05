window.ConektaButton = function() {
  var _helpers, cancelButton, cc_cvc, cc_date, cc_number, defaultParams, formatted, makePayment, params;
  defaultParams = {
    amount: 0,
    name: "",
    description: "",
    onSuccess: function() {
      return null;
    }
  };
  _helpers = {
    extend: function(a, b) {
      var i, key, len;
      for (i = 0, len = b.length; i < len; i++) {
        key = b[i];
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
    numToStr: function(amount) {
      var dec, num;
      num = amount.toFixed().substring(amount.toFixed().length - 2, 0);
      dec = amount.toFixed().substring(amount.toFixed().length - 2);
      amount = (num + "." + dec).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return amount;
    },
    openModal: function(params) {
      var _form, wrapHtml;
      _form = "<div class=\"c-modal\">\n    <div class=\"c-modal-dialog\">\n        <div class=\"c-modal-content \">\n            <div class=\"c-modal-header\">\n                <h1>Pagar</h1>\n                <img src=\"conekta-logo.png\" alt=\"\">\n            </div>\n            \n            <form>\n                <div class=\"c-modal-body\">\n                    <div class=\"message-field\" style=\"display:none;\"> </div>\n                    <div class=\"card\">\n                        <div class=\"info\">\n                            <div class=\"tag\">Total: $ " + params.total + "</div>\n                        </div>\n                        \n                        <div class=\"line\">\n                            <div class=\"group number\">\n                                <label>Numero de la Tarjeta</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-number placeholder=\"**** **** **** ****\"/>\n                            </div>\n\n                            <div class=\"group date\">\n                                <label>Fecha de Expiracion</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-date placeholder=\"MM / YY\"/>\n                            </div>\n                        </div>\n\n                        <div class=\"line\">\n                            <div class=\"group name\">\n                                <label>Nombre en la Tarjeta</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-name placeholder=\"John Appleseed\"/>\n                            </div>\n\n                            <div class=\"group cvc\">\n                                <label>CVC</label>\n                                <input type=\"text\" class=\"control\" data-conekta-card-cvc placeholder=\"cvc\"/>\n                            </div>\n                        </div>\n\n                    </div>\n                </div>\n                <div class=\"c-modal-footer\">\n                    <div class=\"actions\">\n                        <button type=\"button\" class=\"control\" id=\"cancel\" data-conekta-card-cancel>Cancelar</button>\n                        <button type=\"button\" class=\"control\" id=\"paynow\" data-conekta-card-submit>Pagar ahora</button>\n                        <button style=\"display:none;\" type=\"button\" class=\"control\" id=\"close\" data-conekta-card-close>Cerrar</button>\n                    </div>\n                </div>\n            </form>\n\n        </div>\n    </div>\n</div>";
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
    if (arguments[0].onSuccess != null) {
      if (typeof arguments[0].onSuccess !== "function") {
        window.console.error("Unexpected type of 'onSuccess'! Expected \"function\", got " + (typeof arguments[0].onSuccess));
        return false;
      }
    }
    params.amount = arguments[0].amount;
    params.name = arguments[0].name;
    params.total = _helpers.numToStr(params.amount);
    params.description = arguments[0].description || defaultParams.description;
    params.onSuccess = arguments[0].onSuccess || defaultParams.onSuccess;
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
      var card, charge, cvc, date, ele, error, errors, fn, has_error, i, len, month, msg, name, number, success, year;
      e.preventDefault();
      has_error = false;
      errors = new Array;
      card = {};
      name = document.querySelector("[data-conekta-card-name]").value;
      if (!name) {
        has_error = true;
        errors.push("El nombre en la tarjeta es necesario.");
      } else {
        card.name = name;
      }
      date = document.querySelector("[data-conekta-card-date]").value;
      if (!date) {
        has_error = true;
        errors.push("La fecha de expiracion es necesaria.");
      } else {
        date = date.split(" / ");
        month = date[0];
        year = date[1];
        if (!Conekta.card.validateExpirationDate(month, year)) {
          has_error = true;
          errors.push("La fecha de expiración es invalida.");
        } else {
          card.exp_year = year;
          card.exp_month = month;
        }
      }
      number = document.querySelector("[data-conekta-card-number]").value;
      if (!Conekta.card.validateNumber(number)) {
        has_error = true;
        errors.push("El número de tu tarjeta es incorrecto.");
      } else {
        card.number = number;
      }
      cvc = document.querySelector("[data-conekta-card-cvc]").value;
      if (!Conekta.card.validateCVC(cvc)) {
        has_error = true;
        errors.push("El CVC es incorrecto.");
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
          var btn1, btn2, btn3, ele;
          card = document.querySelector(".c-modal .card");
          card.style.display = 'none';
          btn1 = document.querySelector("#cancel");
          btn1.style.display = 'none';
          btn2 = document.querySelector("#paynow");
          btn2.style.display = 'none';
          btn3 = document.querySelector("#close");
          btn3.style.display = '';
          ele = document.querySelector(".c-modal .message-field");
          ele.style.display = 'none';
          ele.classList.remove('error');
          ele.classList.add('success');
          ele.innerHTML = "<h2>¡Cargo exitoso!</h2>";
          ele.style.display = '';
          params.onSuccess();
        };
        error = function(response) {
          var ele, msg;
          errors.push("");
          msg = "<ul><li> " + response.message_to_purchaser + "</li></ul>";
          ele = document.querySelector(".c-modal .message-field");
          ele.style.display = 'none';
          ele.classList.remove('success');
          ele.classList.add('error');
          ele.innerHTML = msg;
          return ele.style.display = '';
        };
        return Conekta.charge.create(charge, success, error);
      } else {
        msg = "<ul>";
        fn = function(error) {
          return msg += "<li> " + error + "</li>";
        };
        for (i = 0, len = errors.length; i < len; i++) {
          error = errors[i];
          fn(error);
        }
        msg += "</ul>";
        ele = document.querySelector(".c-modal .message-field");
        ele.style.display = 'none';
        ele.classList.remove('success');
        ele.classList.add('error');
        ele.innerHTML = msg;
        ele.style.display = '';
      }
    };
    document.querySelector("[data-conekta-card-submit]").addEventListener("click", makePayment, false);
    document.querySelector("[data-conekta-card-cancel]").addEventListener("click", cancelButton, false);
    document.querySelector("#close").addEventListener("click", cancelButton, false);
    return this;
  }
  return params;
};
