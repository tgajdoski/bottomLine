# ------------------------------------ BUDGETLINEITEMS
class BudgetLineitems extends Backbone.View
    events:
        "click    #addBudgetLineitem"         : "addBudgetLineitem"
    initialize: ->
        @el.find("#budgetitems").children("tr").each (i,lineitem) ->
            new BudgetLineitem
                el: $(lineitem)
    addBudgetLineitem: (e) ->
        target = $(e.currentTarget);
        jsRoutes.controllers.Lineitems.addBudgetLineitem().ajax
            data:
                job: $("#totals").attr("data-job-id")
                plan: $("#totals").attr("data-plan-id")
            success: (data) ->
                _view = new BudgetLineitem
                    el: $(data).appendTo("#budgetitems")
#                _view.el.find(".groupName").editInPlace("edit")
            error: (err) ->
                alert("There was an error adding the budget line item! Please refresh the page and try again.")
                # TODO: Deal with

# ------------------------------------ BUDGETLINEITEM
class BudgetLineitem extends Backbone.View
    events:
        "click    .deleteLineitem"              : "deleteBudgetLineitem"
        "focus    .vendor>input"                : "loadVendorSelect"
        "focus    .item>input"                  : "loadItemSelect"
        "change   .quantity,.rate"              : "updateBudgetLineitem"
        "dblclick .quantity"                    : "editBudgetLineitem"
    initialize: ->
        @id = @el.attr("data-lineitem-id")
        @vendor = @el.find("td:eq(1)")
        @item = @el.find("td:eq(2)")
        @quantity = @el.find("td:eq(3) input")
        @rate = @el.find("td:eq(4) input")
        @cost = @el.find("td:eq(5)")
        @saleprice = @el.find("td:eq(6)")
        @recalculate()
    deleteBudgetLineitem: (e) ->
        e.preventDefault()
        if (confirm('Are you sure?'))
            jsRoutes.controllers.Lineitems.deleteLineitem(@id).ajax
                context: this
                success: ->
                    @quantity.val(0)
                    @rate.val(0)
                    @recalculate()
                    @el.remove()
                error: (err) ->
                    alert("There was an error deleting the budget line item! Please refresh the page and try again.")
    loadVendorSelect: (e) ->
        target = $(e.currentTarget)
        v = $()
        context = this
        jsRoutes.controllers.Lineitems.getVendorSelect().ajax
                context: this
                async: false
                data:
                    id: $("#totals").attr("data-market-id")
                    itemType: context.item.attr("data-item-type-id")
                success: (data) ->
                    v = $(data)
                    v.find("option[value='"+context.vendor.attr("data-vendor-id")+"']").attr("selected","selected")
                    v.change ->
                        context.vendor.attr("data-vendor-id",$(this).val())
                        context.item.attr("data-item-id","")
                        context.item.attr("data-item-type-id","")
                        context.item.children("input").val("")
                    v.blur ->
                        input = $("<input/>").css("text-align","left").val($(this).find("option:selected").html())
                        $(this).replaceWith(input)
                error: (err) ->
                    alert("There was an error loading the vendors! Please refresh the page and try again.")
        target.replaceWith(v)
        v.focus()
    loadItemSelect: (e) ->
        target = $(e.currentTarget)
        i = $()
        context = this
        jsRoutes.controllers.Lineitems.getItemSelect().ajax
                context: this
                async: false
                data:
                    id: context.vendor.attr("data-vendor-id")
                success: (data) ->
                    i = $(data)
                    i.find("option[value='"+context.item.attr("data-item-id")+"']").attr("selected","selected")
                    i.change ->
                        vendorItem = $(this).find("option:selected")
                        context.item.attr("data-item-id",vendorItem.val())
                        context.item.attr("data-item-type-id",vendorItem.attr("data-item-type-id"))
                        context.item.children("input").val(vendorItem.html())
                        context.el.attr("data-rate",vendorItem.attr("data-default-rate"))
                        context.rate.val(parseFloat(vendorItem.attr("data-default-rate")).toFixed(2))
                        context.rate.change()
                    i.blur ->
                        input = $("<input/>").css("text-align","left").val($(this).find("option:selected").html())
                        $(this).replaceWith(input)
                error: (err) ->
                    alert("There was an error loading the items! Please refresh the page and try again.")
        target.replaceWith(i)
        i.focus()
    editBudgetLineitem: ->
        context = this
        planItems = $("<select/>").html($("<option/>")).change ->
            context.el.attr("data-plan-item-id",$(this).val())
            context.rate.change()
        $("#planitems").children("div").each ->
            planItems.append($("<option/>").html($(this).attr("class")).val($(this).attr("data-plan-item")))
        planItems.find("option[value='"+@el.attr("data-plan-item-id")+"']").attr("selected","selected")
        planUnits = $("<select/>").html($("<option/>"))
            .append($("<option/>").html("Linear Feet").val("lnft"))
            .append($("<option/>").html("Square Feet").val("sqft"))
            .append($("<option/>").html("Cubic Yards").val("cuyds"))
            .change ->
                context.el.attr("data-units",$(this).val())
                context.rate.change()
        planUnits.find("option[value='"+@el.attr("data-units")+"']").attr("selected","selected")
        multiplier = $("<input/>").val(@el.attr("data-multiplier")).change ->
            context.el.attr("data-multiplier",$(this).val())
            context.rate.change()
        markup = $("<input/>").val(@el.attr("data-markup")).change ->
            context.el.attr("data-markup",$(this).val())
            context.rate.change()
        itemTypeId = @item.attr("data-item-type-id")
        task1Budget = parseInt(context.el.attr("data-task1-percentage"))
        task2Budget = parseInt(context.el.attr("data-task2-percentage"))
        task3Budget = parseInt(context.el.attr("data-task3-percentage"))
        if (itemTypeId != '' && task1Budget+task2Budget+task3Budget == 0)
            task1Budget = parseFloat($("#1-"+itemTypeId).attr("data-price-multiplier"))*100
            task2Budget = parseFloat($("#2-"+itemTypeId).attr("data-price-multiplier"))*100
            task3Budget = parseFloat($("#3-"+itemTypeId).attr("data-price-multiplier"))*100
        task1BudgetInput = $("<input/>").css("width","100px").attr("id","task1Budget").attr("data-lineitem-id", @id).val(task1Budget).change ->
            t1b = parseInt($(this).val())
            if (t1b==100)
                $("#task2Budget").val(0)
                $("#budgetSlider").slider("values", 1, 100)
                $("#task3Budget").val(0)
            else
                t2b = $("#budgetSlider").slider("values", 1)
                if (t1b>t2b)
                    $("#task2Budget").val(0)
                    $("#task3Budget").val(100-t1b)
                    $("#budgetSlider").slider("values", 1, t1b)
                else
                    $("#task2Budget").val(t2b-t1b)
            $("#budgetSlider").slider("values", 0, t1b)
            jsRoutes.controllers.Lineitems.updateLineitem(context.el.attr("data-lineitem-id")).ajax
                context: this
                data:
                    task1Percentage: $("#task1Budget").val()
                    task2Percentage: $("#task2Budget").val()
                    task3Percentage: $("#task3Budget").val()
                success: ->
                    context.el.attr("data-task1-percentage", $("#task1Budget").val())
                    context.el.attr("data-task2-percentage", $("#task2Budget").val())
                    context.el.attr("data-task3-percentage", $("#task3Budget").val())
                    $("#total-"+context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0")
                    context.rate.change()
                error: (err) ->
                    alert("There was an error updating the budget line item! Please refresh the page and try again.")
        task2BudgetInput = $("<input/>").css("width","100px").attr("id","task2Budget").attr("data-lineitem-id", @id).val(task2Budget).change ->
            t1b = $("#budgetSlider").slider("values", 0)
            t2b = parseInt($(this).val())
            if (t2b==100)
                $("#task1Budget").val(0)
                $("#budgetSlider").slider("values", 0, 0)
                $("#task3Budget").val(0)
                $("#budgetSlider").slider("values", 2, 100)
            else
                t1b = $("#budgetSlider").slider("values", 0)
                if (t1b+t2b>100)
                    t1b = 100 - t2b
                    $("#task1Budget").val(t1b)
                    $("#task3Budget").val(0)
                    $("#budgetSlider").slider("values", 0, t1b)
                else
                    $("#task3Budget").val(100 - (t1b+t2b))
            $("#budgetSlider").slider("values", 1, t2b+t1b)
            jsRoutes.controllers.Lineitems.updateLineitem(context.el.attr("data-lineitem-id")).ajax
                context: this
                data:
                    task1Percentage: $("#task1Budget").val()
                    task2Percentage: $("#task2Budget").val()
                    task3Percentage: $("#task3Budget").val()
                success: ->
                    context.el.attr("data-task1-percentage", $("#task1Budget").val())
                    context.el.attr("data-task2-percentage", $("#task2Budget").val())
                    context.el.attr("data-task3-percentage", $("#task3Budget").val())
                    $("#total-"+context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0")
                    context.rate.change()
                error: (err) ->
                    alert("There was an error updating the budget line item! Please refresh the page and try again.")
        task3BudgetInput = $("<input/>").css("width","100px").attr("id","task3Budget").attr("data-lineitem-id", @id).val(task3Budget).change ->
            t3b = parseInt($(this).val())
            $("#task3Budget").val(t3b)
            if (t3b==100)
                $("#task1Budget").val(0)
                $("#budgetSlider").slider("values", 0, 0)
                $("#task2Budget").val(0)
            else
                t1b = $("#budgetSlider").slider("values", 0)
                if (t1b+t3b>100)
                    $("#task1Budget").val(100 - t3b)
                    $("#budgetSlider").slider("values", 0, 100 - t3b)
                    $("#task2Budget").val(0)
                else
                    $("#task2Budget").val(100-(t1b+t3b))
            $("#budgetSlider").slider("values", 1, 100 - t3b)
            jsRoutes.controllers.Lineitems.updateLineitem(context.el.attr("data-lineitem-id")).ajax
                context: this
                data:
                    task1Percentage: $("#task1Budget").val()
                    task2Percentage: $("#task2Budget").val()
                    task3Percentage: $("#task3Budget").val()
                success: ->
                    context.el.attr("data-task1-percentage", $("#task1Budget").val())
                    context.el.attr("data-task2-percentage", $("#task2Budget").val())
                    context.el.attr("data-task3-percentage", $("#task3Budget").val())
                    $("#total-"+context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0")
                    context.rate.change()
                error: (err) ->
                    alert("There was an error updating the budget line item! Please refresh the page and try again.")
        table = $("<table/>").css("width","100%").html($("<tr/>")
            .append($("<td/>")
                .html("Tie to: ")
                .append(planItems)
                .append("With units: ")
                .append(planUnits)
                .append("Multiplier:<br/>")
                .append(multiplier)
                .append("<br/>Markup:<br/>")
                .append(markup))
            .append($("<td/>")
                .html("Task1: ")
                .append(task1BudgetInput)
                .append("<br/>Task2: ")
                .append(task2BudgetInput)
                .append("<br/>Task3: ")
                .append(task3BudgetInput)))
        $("#dialog").html(table)
            .append("<br/><br/>")
            .append($("<div/>").attr("id","budgetSlider").slider(
                range: true
                min: 0
                max: 100
                values: [task1Budget, task1Budget+task2Budget]
                slide: (e, ui) ->
                    $("#task1Budget").val(ui.values[0])
                    $("#task2Budget").val(ui.values[1]-ui.values[0])
                    $("#task3Budget").val(100-ui.values[1])
                stop: (e, ui) ->
                    $("#task1Budget").change()
            ))
            .dialog "open"
    updateBudgetLineitem: (e) ->
        target = $(e.currentTarget)
        if (target.hasClass("rate"))
            @el.attr("data-rate",target.val())
            q = 0.0
            if (typeof @el.attr("data-units")!="undefined" && @el.attr("data-units")!="")
                if (typeof @el.attr("data-plan-item-id")!="undefined" && @el.attr("data-plan-item-id")!="")
                    if ($("#planitems").find("div[data-plan-item='"+@el.attr("data-plan-item-id")+"']").length)
                        q += parseFloat($("#planitems").find("div[data-plan-item='"+@el.attr("data-plan-item-id")+"']>.planitemtotals ."+@el.attr("data-units")).html())
                    else
                        @el.attr("data-plan-item-id","")
                        @el.attr("data-units","")
                else
                    q += parseFloat($("#total"+@el.attr("data-units")).html())
                if (parseFloat(@el.attr("data-multiplier")))
                    q *= parseFloat(@el.attr("data-multiplier"))
                @quantity.val(@roundToHalf(q))
        else if (target.hasClass("quantity"))
            @quantity.val(@roundToHalf(parseFloat(@quantity.val())))
            @el.attr("data-plan-item-id","")
            @el.attr("data-units","")
        jsRoutes.controllers.Lineitems.updateLineitem(@id).ajax
            context: this
            data:
                vendor: @vendor.attr("data-vendor-id")
                item: @item.attr("data-item-id")
                itemType: @item.attr("data-item-type-id")
                planItem: @el.attr("data-plan-item-id")
                units: @el.attr("data-units")
                multiplier: @el.attr("data-multiplier")
                markup: @el.attr("data-markup")
                quantity: @quantity.val()
                rate: @el.attr("data-rate")
                saleprice: parseFloat(@quantity.val())*parseFloat(@el.attr("data-rate"))/(1-parseFloat(@el.attr("data-markup"))/100)
            success: ->
                if (!target.hasClass("name")&&!target.hasClass("units"))
                    @recalculate()
            error: (err) ->
                alert("There was an error updating the budget line item! Please refresh the page and try again.")
    recalculate: ->
        @rate.val(parseFloat(@el.attr("data-rate")).toFixed(2))
        @el.attr("data-cost",parseFloat(@quantity.val())*parseFloat(@el.attr("data-rate")))
        @el.attr("data-sale",parseFloat(@el.attr("data-cost"))/(1-parseFloat(@el.attr("data-markup"))/100))
        @cost.html(parseFloat(@el.attr("data-cost")).toFixed(2))
        @saleprice.html(parseFloat(@el.attr("data-sale")).toFixed(2))
        total = 0
        sale = 0
        temp = {}
        $("#budgetitems").children("tr").each (i,c) ->
            i = $(c).find(".item").attr("data-item-type-id")
            if (typeof temp[i] == "undefined")
                temp[i] = 0
            itemCost = parseFloat($(c).find("td:eq(3) input").val())*parseFloat($(c).attr("data-rate"))
            temp[i] += itemCost
            total += itemCost
            sale += itemCost/(1-parseFloat($(c).attr("data-markup"))/100)
        for i of temp
            budgetTotal = $("#total-"+i).find("td:eq(3)")
            prevTotal = budgetTotal.html()
            budgetTotal.html(temp[i].toFixed(2))
            if (budgetTotal.length && budgetTotal.html() != prevTotal)
                if ($(".actualLineitem").length)
                    $(".actualLineitem:first").find(".rate").change()
                else
                    $("#actual").find("."+budgetTotal.attr("class").split(" ")[1]).each (j,total) ->
                        if ($(total).hasClass("hasClass"))
                            taskTypeId = $(total).parent().attr("id").split("-")[0]
                            itemTypeId = $(total).parent().attr("id").split("-")[1]
                            taskBudgetTotal = 0
                            $("#budgetitems td[data-item-type-id='"+itemTypeId+"']").each (k,lineitem) ->
                                taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task"+taskTypeId+"-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"))
                            $(total).html(taskBudgetTotal.toFixed(2))
                            $(total).parent().find(".left").html((parseFloat($(total).html())-parseFloat($(total).parent().find(".used").html())).toFixed(2))
                    used = 0
                    $(".task ."+budgetTotal.attr("class").split(" ")[1]).parent().find(".used").each (j,u) ->
                        used += parseFloat($(u).html())
                    budgetTotal.parent().find(".used").html(used.toFixed(2))
                    budgetTotal.parent().find(".left").html((parseFloat(budgetTotal.html())-used).toFixed(2))
        if ($("#saleitems>table>tbody>tr").length==0)
            $("#saleprice>span").html(sale.toFixed(2))
            $("#totals").attr("data-sale",sale)
        else
            sale = parseFloat($("#totals").attr("data-sale"))
        $("#actual .saleprice").html(sale.toFixed(2))
        $("#totals").attr("data-cost",total)
        ppsqft = 0
        totalsqft = parseFloat($("#totalsqft").html())
        if (totalsqft>0)
            ppsqft = sale/totalsqft
        $("#totals").attr("data-ppsqft",ppsqft)
#        $("#grossprofit").val((sale*.93-total).toFixed(2))
        $("#grossprofit").html((sale-total).toFixed(2))
        pctprofit = 0
        if (sale>0)
#            pctprofit = (100*(1-total/sale/.93))
            pctprofit = (100*(1-total/sale))
        $("#pctprofit").html(pctprofit.toFixed(2))
        $("#ppsqft").html(ppsqft.toFixed(2))
        $("#totalcost").html(total.toFixed(2))
        if ($("#actual").length)
            $("#actual .overhead").html((sale*parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2))
            if ($("#actual .cost").html()!="")
                $("#actual .markup").html((parseFloat($("#actual .cost").html())/sale).toFixed(2))
            if ($("#actual .actualcost").html()!="")
                $("#actual .actualmarkup").html((parseFloat($("#actual .actualcost").html())/sale).toFixed(2))
            left = parseFloat($("#actual .diffcost").html())
            mprofit = `((sale-total)>0)?(left>0)?((sale-total)*.15+left*.5):((sale-total)*.15+left):0`
            fprofit = `((sale-total)>0)?(left>0)?((sale-total)*.85+left*.5):((sale-total)*.85):(sale-total)`
            $("#managerprofit").html(mprofit.toFixed(2))
            $("#ffiprofit").html(fprofit.toFixed(2))
    roundToHalf: (converted) ->
#        converted = parseFloat(v)
        if (converted<.5)
            converted.toFixed(1)
        else
            decimal = (converted-parseInt(converted,10))
            decimal = Math.round(decimal*10)
            if (decimal==5)
                (parseInt(converted,10)+0.5)
            else
                if (decimal<3||decimal>7)
                    Math.round(converted)
                else
                    (parseInt(converted,10)+0.5)

# ------------------------------------- INIT APP
$ ->
    lineitems = new BudgetLineitems
        el: $("#budget")
