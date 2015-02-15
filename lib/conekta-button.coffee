window.ConektaButton  = ->
    defaultParams =
        amount: 0
        name: ""
        description: ""

    _helpers =
        extend : (a, b) ->
            for key in b 
              if b.hasOwnProperty key 
                a[key] = b[key]
            a

        getModal : ->
            document.querySelector ".c-modal"

        removeModal : ->
            #do some animations
            # obj = $(".c-modal")
            document.body.removeChild( _helpers.getModal() )
            return

        openModal : (params) ->
            _form = """
                <div class="c-modal">
                    <div class="c-modal-dialog">
                        <div class="c-modal-content ">
                            <div class="c-modal-header">
                                <h1>Pagar</h1>
                            </div>
                            <form>
                                <div class="c-modal-body">
                                    <div class="card">
                                        <div class="info">
                                            <div class="tag">Total: $ #{params.total}</div>
                                            <div class="brand-cards">
                                                <div class="logo-visa"></div>
                                                <div class="logo-mastercard"></div>
                                                <div class="logo-amex"></div>
                                            </div>
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

        params.amount = arguments[0].amount
        params.name = arguments[0].name
        params.total = params.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        params.description = arguments[0].description || defaultParams.description

        _helpers.openModal params

        cc_number = $("[data-conekta-card-number]")
        cc_date = $("[data-conekta-card-date]")
        cc_cvc = $("[data-conekta-card-cvc]")

        ###
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
        ###

        cancelButton = (e) ->
            _helpers.removeModal()

        makePayment = (e) ->
            e.preventDefault()

            date = $("[data-conekta-card-date]").val().split(" / ")

            month = date[0]
            year = date[1]
            card =
                number    : $("[data-conekta-card-number]").val()
                exp_year  : year
                exp_month : month
                cvc       : $("[data-conekta-card-cvc]").val()
                name      : $("[data-conekta-card-name]").val()


            unless Conekta.card.validateNumber(card.number) 
                has_error = true
            else
                #do something
                #document.querySelector("[data-conekta-card-number]")

            unless Conekta.card.validateExpirationDate(card.exp_month, card.exp_year)
                has_error = true
            else
                #do something 
                #document.querySelector("[data-conekta-card-date]")


            unless Conekta.card.validateCVC(card.cvc)
                has_error = true
            else
                #do something 
                #document.querySelector("[data-conekta-card-cvc]")

            unless has_error

                charge =
                    amount: params.amount
                    currency: 'MXN'
                    description: params.description
                    card: card
                
                success = (charge) ->
                    _helpers.removeModal()
                    alert "charge"

                error = (response) ->
                    alert "error"
                    #display error

                Conekta.charge.create charge, success, error

            else 
                # Animate
                return


        document.querySelector("[data-conekta-card-submit]").addEventListener "click", makePayment, false
        document.querySelector("[data-conekta-card-cancel]").addEventListener "click", cancelButton, false


        return this

    
    params

    