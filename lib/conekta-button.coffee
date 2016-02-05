window.ConektaButton  = ->
    defaultParams =
        amount: 0
        name: ""
        description: ""
        onSuccess: ->
            null

    _helpers =
        extend : (a, b) ->
            for key in b
              if b.hasOwnProperty key
                a[key] = b[key]
            a

        getModal : ->
            document.querySelector ".c-modal"

        removeModal : ->
            #To-Do: animations
            document.body.removeChild( _helpers.getModal() )
            return

        numToStr: (amount)->
            num = amount.toFixed().substring(amount.toFixed().length-2, 0)
            dec = amount.toFixed().substring(amount.toFixed().length-2)
            amount = "#{num}.#{dec}".replace(/\d(?=(\d{3})+\.)/g, '$&,')
            return amount

        openModal : (params) ->
            _form = """
                <div class="c-modal">
                    <div class="c-modal-dialog">
                        <div class="c-modal-content ">
                            <div class="c-modal-header">
                                <h1>Pagar</h1>
                                <img src="conekta-logo.png" alt="">
                            </div>
                            
                            <form>
                                <div class="c-modal-body">
                                    <div class="message-field" style="display:none;"> </div>
                                    <div class="card">
                                        <div class="info">
                                            <div class="tag">Total: $ #{params.total}</div>
                                        </div>
                                        
                                        <div class="line">
                                            <div class="group number">
                                                <label>Numero de la Tarjeta</label>
                                                <input type="text" class="control" data-conekta-card-number placeholder="**** **** **** ****"/>
                                            </div>

                                            <div class="group date">
                                                <label>Fecha de Expiracion</label>
                                                <input type="text" class="control" data-conekta-card-date placeholder="MM / YY"/>
                                            </div>
                                        </div>

                                        <div class="line">
                                            <div class="group name">
                                                <label>Nombre en la Tarjeta</label>
                                                <input type="text" class="control" data-conekta-card-name placeholder="John Appleseed"/>
                                            </div>

                                            <div class="group cvc">
                                                <label>CVC</label>
                                                <input type="text" class="control" data-conekta-card-cvc placeholder="cvc"/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="c-modal-footer">
                                    <div class="actions">
                                        <button type="button" class="control" id="cancel" data-conekta-card-cancel>Cancelar</button>
                                        <button type="button" class="control" id="paynow" data-conekta-card-submit>Pagar ahora</button>
                                        <button style="display:none;" type="button" class="control" id="close" data-conekta-card-close>Cerrar</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            """

            wrapHtml = document.createElement('div')
            wrapHtml.setAttribute("class", "c-modal")
            wrapHtml.innerHTML = _form
            document.body.appendChild wrapHtml
            # To-Do: Animate
            return


    window.document.onkeydown = (e) ->
        if !e
            e = event

        if e.keyCode == 27
            _helpers.removeModal()
            window.document.onkeydown = (e) ->
                if !e
                    e = event
                e
        return


    if arguments[0] == null
        window.console.error 'ConektaButton expects at least 1 attribute of type Object!'
        return false

    if typeof arguments[0] != "object"
        window.console.error "Unexpected type of argument! Expected \"object\", got #{typeof arguments[0]}"
        return false

    else

        params = _helpers.extend defaultParams, {}

        if !arguments[0].amount?
            window.console.error 'Missing "Amount" Attribute'
            return false

        if !arguments[0].name?
            window.console.error 'Missing "Name" Attribute'
            return false

        if arguments[0].onSuccess?
            if typeof arguments[0].onSuccess != "function"
                window.console.error "Unexpected type of 'onSuccess'! Expected \"function\", got #{typeof arguments[0].onSuccess}"
                return false

        params.amount = arguments[0].amount
        params.name = arguments[0].name
        params.total = _helpers.numToStr params.amount
        params.description = arguments[0].description || defaultParams.description
        params.onSuccess = arguments[0].onSuccess || defaultParams.onSuccess

        _helpers.openModal params

        cc_number = document.querySelector("[data-conekta-card-number]")
        cc_date = document.querySelector("[data-conekta-card-date]")
        cc_cvc = document.querySelector("[data-conekta-card-cvc]")

        formatted = new Formatter cc_number, {
            'pattern': '{{9999}} {{9999}} {{9999}} {{9999}}',
            'persistent': false
            }

        formatted = new Formatter cc_date, {
            'pattern': '{{99}} / {{99}}',
            'persistent': false
            }

        formatted = new Formatter cc_cvc, {
            'pattern': '{{9999}}',
            'persistent': false
            }

        cancelButton = (e) ->
            _helpers.removeModal()

        makePayment = (e) ->
            e.preventDefault()
            has_error= false
            errors = new Array
            card = {}
            name = document.querySelector("[data-conekta-card-name]").value

            unless name
                has_error = true
                errors.push("El nombre en la tarjeta es necesario.")
            else
                card.name = name


            date = document.querySelector("[data-conekta-card-date]").value

            unless date
                has_error = true
                errors.push("La fecha de expiracion es necesaria.")

            else
                date = date.split(" / ")
                month = date[0]
                year = date[1]

                unless Conekta.card.validateExpirationDate(month, year)
                    has_error = true
                    errors.push("La fecha de expiración es invalida.")

                else
                    card.exp_year = year
                    card.exp_month = month

            number = document.querySelector("[data-conekta-card-number]").value

            unless Conekta.card.validateNumber(number)
                has_error = true
                errors.push("El número de tu tarjeta es incorrecto.")
            else
                card.number = number


            cvc = document.querySelector("[data-conekta-card-cvc]").value

            unless Conekta.card.validateCVC(cvc)
                has_error = true
                errors.push("El CVC es incorrecto.")
            else
                card.cvc = cvc


            unless has_error

                charge =
                    amount: params.amount
                    currency: 'MXN'
                    description: params.description
                    card: card

                success = (charge) ->
                    #_helpers.removeModal()

                    card = document.querySelector(".c-modal .card")
                    card.style.display = 'none'

                    btn1 = document.querySelector("#cancel")
                    btn1.style.display = 'none'

                    btn2 = document.querySelector("#paynow")
                    btn2.style.display = 'none'

                    btn3 = document.querySelector("#close")
                    btn3.style.display = ''

                    ele = document.querySelector(".c-modal .message-field")
                    ele.style.display = 'none'
                    ele.classList.remove 'error'
                    ele.classList.add 'success'
                    ele.innerHTML = "<h2>¡Cargo exitoso!</h2>"
                    ele.style.display = ''

                    params.onSuccess()


                    return

                error = (response) ->
                    errors.push("")
                    msg = "<ul><li> #{response.message_to_purchaser}</li></ul>"
                    ele = document.querySelector(".c-modal .message-field")
                    ele.style.display = 'none'
                    ele.classList.remove 'success'
                    ele.classList.add 'error'
                    ele.innerHTML = msg
                    ele.style.display = ''

                Conekta.charge.create charge, success, error

            else
                msg = "<ul>"
                for error in errors
                    do (error) ->
                        msg += "<li> #{error}</li>"

                msg += "</ul>"
                ele = document.querySelector(".c-modal .message-field")
                ele.style.display = 'none'
                ele.classList.remove 'success'
                ele.classList.add 'error'
                ele.innerHTML = msg
                ele.style.display = ''
                # To-Do: Animate
                return


        document.querySelector("[data-conekta-card-submit]").addEventListener "click", makePayment, false
        document.querySelector("[data-conekta-card-cancel]").addEventListener "click", cancelButton, false
        document.querySelector("#close").addEventListener "click", cancelButton, false


        return this


    params

