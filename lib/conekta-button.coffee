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
            return a

        getModal : ->
            return document.querySelector ".conekta-modal"

        removeModal : ->

            obj = document.getElementByClass("c-modal")
            document.body.removeChild(obj)

            return true

        openModal : (params) ->
            _form = """
                <div class="c-modal">
                    <div class="c-modal-dialog">

                        <div class="c-modal-content">
                            <h2>#{params.name}</h2>
                            <p>#{params.description}</p>
                            <div class="card">
                                <form>

                                    <div class="name input">
                                        <input type="text" class="control" data-conekta-card-name placeholder="name"/>
                                    </div>

                                    <div class="number input">
                                        <input type="text" class="control" data-conekta-card-number placeholder="number"/>
                                    </div>

                                    <div class="date cvc input">
                                        <input type="text" class="control" data-conekta-card-date placeholder="MM / YY"/>
                                        <input type="text" class="control" data-conekta-card-cvc placeholder="cvc"/>
                                    </div>

                                    <div class="actions">
                                        <button type="button" class="control" data-conekta-card-submit>Pagar $ #{params.total}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            """

            wrapHtml = document.createElement('div')
            wrapHtml.setAttribute("class", "c-modal")
            wrapHtml.innerHTML = _form
            document.body.appendChild wrapHtml
            return true


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

            date = document.querySelector("[data-conekta-card-date]").value.split(" / ")

            month = date[0]
            year = date[1]
            card =
                number    : document.querySelector("[data-conekta-card-number]").value
                exp_year  : year
                exp_month : month
                cvc       : document.querySelector("[data-conekta-card-cvc]").value
                name      : document.querySelector("[data-conekta-card-name]").value


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

                Conekta.charge.create charge, success, error

            else 
                return


        document.querySelector("[data-conekta-card-submit]").addEventListener "click", makePayment, false


        return this

    
    params

    