# ------------------------------------ SALEITEMS
class Saleitems extends Backbone.View
    events:
        "click    #addSaleitem"         : "addSaleitem"
    initialize: ->
        @el.find("tbody>tr").each (i,saleitem) ->
            new Saleitem
                el: $(saleitem)
    addSaleitem: (e) ->
        target = $(e.currentTarget);
        jsRoutes.controllers.Saleitems_rd.addSaleitem().ajax
            data:
                job: $("#totals").attr("data-job-id")
                plan: $("#totals").attr("data-plan-id")
            success: (data) ->
                _view = new Saleitem
                      el: $(data).appendTo("#saleitems table tbody")
#                _view.el.find(".groupName").editInPlace("edit")"#saleitems table tbody"
            error: (err) ->
                alert("There was an error adding the sale item! Please refresh the page and try again.")

# ------------------------------------ SALEITEM
class Saleitem extends Backbone.View
    events:
        "click    .deleteSaleitem"                        : "deleteSaleitem"
        "change   .name,.quantity,.units,.rate"           : "updateSaleitem"
        "click    .invoice"                               : "updateSaleitem"
        "dblclick .salesorder"                            : "updateSaleitem"
        "change   .saleprice"                             : "recalculate"
    initialize: ->
        @id = @el.attr("data-saleitem-id")
        @name = @el.find("td:eq(1) textarea").autogrow()
        @quantity = @el.find("td:eq(2) input")
        @units = @el.find("td:eq(3) input")
        @rate = @el.find("td:eq(4) input")
        @saleitemdate = @el.find("td:eq(5) input")
        @recalculate()
    deleteSaleitem: (e) ->
        e.preventDefault()
        if (confirm('Are you sure?'))
            jsRoutes.controllers.Saleitems_rd.deleteSaleitem(@id).ajax
                context: this
                success: ->
                    @el.remove()
                    @recalculate()
                error: (err) ->
                    alert("There was an error deleting the sale item! Please refresh the page and try again.")
    updateSaleitem: (e) ->
        target = $(e.currentTarget)
        so = @el.find(".salesorder").html()
        if (target.hasClass("invoice")||target.hasClass("salesorder"))
            so = prompt "Please enter a Sales Order #, or just click OK to add line automatically.", "..."
        jsRoutes.controllers.Saleitems_rd.updateSaleitem(@id).ajax
            context: this
            data:
                name: @name.val()
                quantity: @quantity.val()
                rate: @rate.val()
                units: @units.val()
                saleprice: parseFloat(@quantity.val())*parseFloat(@rate.val())
                so: so
            success: ->
                if (target.hasClass("invoice")||target.hasClass("salesorder"))
                    if ($("#totals").attr("data-saleitem-id").length)
                        target.replaceWith($("<span/>").attr("class","salesorder").html(so))
                    else
                        alert("Select a SALEITEM before invoicing!")
                else if (!target.hasClass("name")&&!target.hasClass("units"))
                    @recalculate()
            error: (err) ->
                alert("There was an error updating the sale item! Please refresh the page and try again.")
    recalculate: ->
        @el.find(".saleprice").val((parseFloat(@quantity.val())*parseFloat(@rate.val())).toFixed(2))
        sale = 0
        $("#saleitems").find(".saleprice").each (i,sp) ->
            sale += parseFloat($(sp).val())
        $("#saleprice>span").html(sale.toFixed(2))
        $("#totals").attr("data-sale",sale)
        $("#actual .saleprice").html(sale.toFixed(2))
        total = parseFloat($("#totals").attr("data-cost"))
        actual = parseFloat($("#actual .actualcost").html())
        ppsqft = 0
        totalsqft = parseFloat($("#totalsqft").html())
        if (totalsqft>0)
            ppsqft = sale/totalsqft
        $("#totals").attr("data-ppsqft",ppsqft)
#        $("#grossprofit").val((sale*.93-total).toFixed(2))
   #     $("#grossprofit").html((sale-actual).toFixed(2))
        pctprofit = 0
        if (sale>0)
#            pctprofit = (100*(1-total/sale/.93))
            pctprofit = (100*(1-total/sale))
      #  $("#pctprofit").html(pctprofit.toFixed(2))
        $("#ppsqft").html(ppsqft.toFixed(2))
        if ($("#actual").length)
            $("#actual .overhead").html((sale*parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2))
            if ($("#actual .cost").html()!="")
                $("#actual .markup").html((parseFloat($("#actual .cost").html())/sale).toFixed(2))
            if ($("#actual .actualcost").html()!="")
                $("#actual .actualmarkup").html((parseFloat($("#actual .actualcost").html())/sale).toFixed(2))
            left = parseFloat($("#actual .diffcost").html())
            mprofit = `((sale-total)>0)?(left>0)?((sale-actual)*.1):((sale-actual)*.1):0`
            fprofit = `((sale-actual)>0)?(left>0)?((sale-actual)*.9):((sale-actual)*.9):(sale-actual)`
            $("#managerprofit").html(mprofit.toFixed(2))
            $("#ffiprofit").html(fprofit.toFixed(2))
# ------------------------------------- INIT APP
$ ->
    saleitems = new Saleitems
        el: $("#saleitems")
