# ------------------------------------ ACTUALLINEITEMS
class ActualLineitems extends Backbone.View
    events:
        "click    .addActualLineitem"         : "addActualLineitem"
        "click    .addTask"                   : "addTask"
        "click    .completeTask"              : "completeTask"
    initialize: ->
        @el.find(".actualLineitem").each (i,lineitem) ->
            new ActualLineitem
                el: $(lineitem)
        @el.find(".tasks").each (i,tasks) ->
            $(tasks).children("tr.calTask").each (j,t) ->
                new Task
                    el: $(t)
        cost = 0
        actual = 0
        left = 0
        @el.find(".noClass").each (i,t) ->
#            $(t).change()
            $("#actual").find("."+$(t).attr("class").split(" ")[1]).each (j,total) ->
                if ($(total).hasClass("hasClass"))
                    taskTypeId = $(total).parent().attr("id").split("-")[0]
                    itemTypeId = $(total).parent().attr("id").split("-")[1]
                    taskBudgetTotal = 0
                    $("#budgetitems td[data-item-type-id='"+itemTypeId+"']").each (k,lineitem) ->
                        taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task"+taskTypeId+"-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"))
                    $(total).html(taskBudgetTotal.toFixed(2))
                    $(total).parent().find(".left").html((parseFloat($(total).html())-parseFloat($(total).parent().find(".used").html())).toFixed(2))
            cost += parseFloat($(t).html())
            used = 0
            $(".task ."+$(t).attr("class").split(" ")[1]).parent().find(".used").each (j,u) ->
                used += parseFloat($(u).html())
            actual += used
            left += parseFloat($(t).html())-used
            $(t).parent().find(".used").html(used.toFixed(2))
            $(t).parent().find(".left").html((parseFloat($(t).html())-used).toFixed(2))
        $("#actual .cost").html(cost.toFixed(2))
        $("#actual .actualcost").html(actual.toFixed(2))
        $("#actual .diffcost").html(left.toFixed(2))
        sale = parseFloat($("#totals").attr("data-sale"))
        total = parseFloat($("#totals").attr("data-cost"))
        $("#actual .overhead").html((sale*parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2))
        $("#actual .markup").html((total/sale).toFixed(2))
        $("#actual .actualmarkup").html((actual/sale).toFixed(2))
#        mprofit = `((sale*.93-total)>0)?(left>0)?((sale*.93-total)*.2+left*.5):((sale*.93-total)*.2+left):0`
#        fprofit = `((sale*.93-total)>0)?(left>0)?((sale*.93-total)*.8+left*.5):((sale*.93-total)*.8):(sale*.93-total)`

     #   mprofit = `((sale-total)>0)?(left>0)?((sale-total)*.15+left*.5):((sale-total)*.15+left):0`
     #   fprofit = `((sale-total)>0)?(left>0)?((sale-total)*.85+left*.5):((sale-total)*.85):(sale-total)`
        mprofit = `((sale-actual)>0)?(left>0)?((sale-actual)*.1):((sale-actual)*.1):0`
        fprofit = `((sale-actual)>0)?(left>0)?((sale-actual)*.9):((sale-actual)*.9):(sale-actual)`
        $("#managerprofit").html(mprofit.toFixed(2))
        $("#ffiprofit").html(fprofit.toFixed(2))
    addActualLineitem: (e) ->
        target = $(e.currentTarget)
        jsRoutes.controllers.Lineitems_rd.addActualLineitem().ajax
            data:
                id: $("#totals").attr("data-job-id")
                taskType: target.attr("data-task-type-id")
                itemType: target.attr("data-item-type-id")
                task: target.parent().parent().parent().find("tr:eq(0)>td:eq(0)>table>tbody>tr:first").attr("data-task-id")
            success: (data) ->
                _view = new ActualLineitem
                    el: $(data).appendTo($("tbody[data-budget-item-id='"+target.attr("data-budget-item-id")+"']"))
#                _view.el.find(".groupName").editInPlace("edit")
            error: (err) ->
                alert("There was an error adding the job line item! Please refresh the page and try again.")
                # TODO: Deal with
    addTask: (e) ->
        target = $(e.currentTarget)
        jsRoutes.controllers.Tasks_rd.addTask().ajax
            data:
                id: $("#totals").attr("data-job-id")
                taskType: target.attr("data-task-type-id")
            success: (data) ->
                _view = new Task
                    el: $(data).appendTo(target.parent().parent().find(".tasks"))
#                _view.el.find(".groupName").editInPlace("edit")
            error: (err) ->
                alert("There was an error adding the task! Please refresh the page and try again.")
                # TODO: Deal with
    completeTask: (e) ->
        target = $(e.currentTarget)
        target.parent().parent().find(".calTask").each (i,t) ->
            jsRoutes.controllers.Tasks_rd.updateTask($(t).attr("data-task-id")).ajax
                data:
                    completed: target.is(":checked")
                error: (err) ->
                    alert("There was an error completing the task! Please refresh the page and try again.")


# ---------------------------------------------- TASK
class Task extends Backbone.View
    events:
        "click    .editTask"                    : "editTask"
        "click    .deleteTask"                  : "deleteTask"
    initialize: ->
        task = @gup("task")
        if (task==@el.attr("data-task-id"))
            @el.find(".editTask").click()
    gup: (name) ->
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]")
        regexS = "[\\?&]"+name+"=([^&#]*)"
        regex = new RegExp( regexS )
        results = regex.exec( window.location.href )
        if ( results == null )
            ""
        else
            results[1]
    editTask: (e) ->
        context = this
        crew = $('<select/>').css('width','50px').change ->
             context.el.attr("data-crew",$(this).val())
        for i in [1..20]
            crew.append($('<option/>').attr({value: i}).html(i))
        crew.find("option[value='"+@el.attr("data-crew")+"']").attr("selected","selected")
        order = $('<select/>').css('width','50px').change ->
            context.el.attr("data-card-order",$(this).val())
        for i in [1..10]
            order.append($('<option/>').attr({value: i}).html(i))
        order.find("option[value='"+@el.attr("data-card-order")+"']").attr("selected","selected")
        dateParts = @el.attr("data-date").split("-")
        defaultDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2])
        altDate = $("<input/>").attr
            type: "hidden"
            id: "altDate"
        date = $("<div/>").datepicker
            altField: "#altDate"
            altFormat: "yy-mm-dd"
            defaultDate: defaultDate
            onSelect: (d,i) ->
                context.el.attr("data-date",$("#altDate").val())
                context.el.find("td:eq(1)").html($("#altDate").val())
        notes = $("<textarea>"+@el.attr("data-notes")+"</textarea>").css("width","251px").change ->
            context.el.attr("data-notes",$(this).val())
        managerFunction = ->
            $(this).find("option[value='"+context.el.attr("data-manager-id")+"']").attr("selected","selected")
            $(this).find("select").change ->
                context.el.attr("data-manager-id",$(this).val())
        managerRow = $("<tr/>").append("<td>Crew Leader </td>").append($("<td/>").load(jsRoutes.controllers.Home_rd.getCrewLeader().url,managerFunction))
        crewRow = $("<tr/>").append("<td>Box</td>")
        $("<td/>").append(crew).appendTo(crewRow)
        orderRow = $("<tr/>").append("<td>Order</td>")
        $("<td/>").append(order).appendTo(orderRow)
        table = $("<table/>")
        $("<tbody/>").append(managerRow).append(crewRow).append(orderRow).appendTo(table)
     ##   $("#dialog").dialog "destroy"
        $("#dialog").dialog
            autoOpen: false
            modal: true
            draggable: false
            resizable: false
            width: 450
            title: "Update Task"
        $("#dialog").html("")
            .append(table)
            .append(date)
            .append(altDate)
            .append("Notes<br/>")
            .append(notes)
            .on("dialogclose", (e, ui) ->
                jsRoutes.controllers.Tasks_rd.updateTask(context.el.attr("data-task-id")).ajax
                    data:
                        crew: context.el.attr("data-crew")
                        cardOrder: context.el.attr("data-card-order")
                        date: context.el.attr("data-date")
                        notes: context.el.attr("data-notes")
                        manager: context.el.attr("data-manager-id")
                    success: (data) ->
                        for task in data
                            $("tr[data-task-id='"+task.id+"']").attr("data-card-order",task.cardOrder)
                    error: (err) ->
                        alert("There was an error updating the task! Please refresh the page and try again.")
                $("#dialog").unbind("dialogclose")
            )
            .dialog "open"
    deleteTask: (e) ->
        context = this
        e.preventDefault()
        if (confirm('Are you sure?'))
            jsRoutes.controllers.Tasks_rd.deleteTask(@el.attr("data-task-id")).ajax
                context: this
                success: (data) ->
                    context.el.remove()
                    for task in data
                        $("tr[data-task-id='"+task.id+"']").attr("data-card-order",task.cardOrder)
                error: (err) ->
                    alert("There was an error deleting the task! Please refresh the page and try again.")


# ------------------------------------ ACTUALLINEITEM
class ActualLineitem extends Backbone.View
    events:
        "click    .deleteLineitem"              : "deleteActualLineitem"
        "focus    .vendor>input"                : "loadVendorSelect"
        "focus    .item>input"                  : "loadItemSelect"
        "click    .notes"                       : "editNotes"
        "change   .quantity,.rate"              : "updateActualLineitem"
        "click    .invoice"                     : "updateActualLineitem"
        "dblclick .purchaseorder"               : "updateActualLineitem"
    initialize: ->
        @id = @el.attr("data-lineitem-id")
        @vendor = @el.find("td:eq(2)")
#        jsRoutes.controllers.Lineitems.getVendorSelect().ajax
#                context: this
#                data:
#                    id: $("#plan").attr("data-market-id")
#                success: (data) ->
#                    d = $(data)
#                    d.find("option[value='"+@vendor.attr("data-vendor-id")+"']").attr("selected","selected")
#                    @vendor.html(d)
        @item = @el.find("td:eq(3)")
#        jsRoutes.controllers.Lineitems.getItemSelect().ajax
#                context: this
#                data:
#                    id: @vendor.attr("data-vendor-id")
#                success: (data) ->
#                    i = $(data)
#                    i.find("option[value='"+@item.attr("data-item-id")+"']").attr("selected","selected")
#                    @item.html(i)
        @quantity = @el.find("td:eq(4) input")
        @rate = @el.find("td:eq(6) input")
        @units = @el.find("td:eq(8)")
        @cost = @el.find("td:eq(9)")
        @recalculate()
    deleteActualLineitem: (e) ->
        e.preventDefault()
        if (confirm('Are you sure?'))
            jsRoutes.controllers.Lineitems_rd.deleteLineitem(@id).ajax
                context: this
                success: ->
                    @quantity.val(0)
                    @rate.val(0)
                    @recalculate()
                    @el.remove()
                error: (err) ->
                    alert("There was an error deleting the job line item! Please refresh the page and try again.")
    loadVendorSelect: (e) ->
        target = $(e.currentTarget)
        v = $()
        context = this
        jsRoutes.controllers.Lineitems_rd.getVendorSelect().ajax
                context: this
                async: false
                data:
                    id: $("#totals").attr("data-market-id")
                    itemType: context.item.attr("data-item-type-id")
                success: (data) ->
                    v = $(data)
                    v.find("option[value='"+context.vendor.attr("data-vendor-id")+"']").attr("selected","selected")
                    v.change ->
                        context.vendor.attr("data-vendor-id",$(this).find("option:selected").val())
                        context.item.attr("data-item-id","")
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
        jsRoutes.controllers.Lineitems_rd.getItemSelect().ajax
                context: this
                async: false
                data:
                    id: context.vendor.attr("data-vendor-id")
                    itemType: @item.attr("data-item-type-id")
                success: (data) ->
                    i = $(data)
                    i.find("option[value='"+context.item.attr("data-item-id")+"']").attr("selected","selected")
                    i.change ->
                        vendorItem = $(this).find("option:selected")
                        context.item.attr("data-item-id",vendorItem.val())
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
    editNotes: ->
        context = this
        notes = $("<textarea>"+@el.attr("data-notes")+"</textarea>").css("width","251px").change ->
            context.el.attr("data-notes",$(this).val())
            if ($(this).val()!="")
                context.el.find("td:eq(1)>span").css("color","#F00")
            else
                context.el.find("td:eq(1)>span").css("color","#000")
            context.rate.change()
        task = $("<select/>").html($("<option value=\"\"/>")).change ->
            context.el.attr("data-task-id",$(this).val())
            if ($(this).val()!="")
                context.el.find("td:eq(1)>span").html($(this).find("option:selected").html().split("-").slice(1).join("-"))
            else
                context.el.find("td:eq(1)>span").html("NOTE")
            context.rate.change()
        @el.parent().parent().parent().parent().parent().find("tr:eq(0)>td:eq(0)>table>tbody>tr.calTask").each (i,l) ->
            task.append($("<option value=\""+$(l).attr("data-task-id")+"\">"+$(l).find("td:eq(1)").html()+"</option>"))
        task.find("option[value='"+@el.attr("data-task-id")+"']").attr("selected","selected")
    ##    $("#dialog").dialog "destroy"
        $("#dialog").dialog
            autoOpen: false
            modal: true
            draggable: false
            resizable: false
            width: 450
            title: "Update Line Item"
        $("#dialog").html("")
            .append("Notes<br/>")
            .append(notes)
            .append("<br/>Task<br/>")
            .append(task)
            .dialog "open"
    updateActualLineitem: (e) ->
        target = $(e.currentTarget)
        po = @el.find(".purchaseorder").html()
        if (target.hasClass("invoice")||target.hasClass("purchaseorder"))
            po = prompt "Please enter a Purchase Order #, or just click OK to add line automatically.", "..."
        jsRoutes.controllers.Lineitems_rd.updateLineitem(@id).ajax
            context: this
            data:
                vendor: @vendor.attr("data-vendor-id")
                item: @item.attr("data-item-id")
                units: @units.html()
                quantity: @quantity.val()
                rate: @rate.val()
                saleprice: parseFloat(@quantity.val())*parseFloat(@rate.val())
                task: @el.attr("data-task-id")
                notes: @el.attr("data-notes")
                po: po
            success: ->
                if (target.hasClass("invoice")||target.hasClass("purchaseorder"))
                    target.replaceWith($("<span/>").attr("class","purchaseorder").html(po))
                else
                    @recalculate()
            error: (err) ->
                alert("There was an error updating the job line item! Please refresh the page and try again.")
    recalculate: ->
        @el.attr("data-cost",parseFloat(@quantity.val())*parseFloat(@rate.val()))
        @cost.html(parseFloat(@el.attr("data-cost")).toFixed(2))
        total = 0
        @el.parent().children("tr").each (i,row) ->
            total += parseFloat($(row).attr("data-cost"))
        taskitem = $("#"+@el.parent().attr("data-task-type-id")+"-"+@el.find(".item").attr("data-item-type-id"))
        taskitem.find(".used").html(total.toFixed(2))
        taskitem.find(".left").html((total-parseFloat(taskitem.find(".hasClass").html())).toFixed(2))
        cost = 0
        actual = 0
        left = 0
        $("#actual .noClass").each (i,t) ->
            $("#actual").find("."+$(t).attr("class").split(" ")[1]).each (j,total) ->
                if ($(total).hasClass("hasClass"))
                    taskTypeId = $(total).parent().attr("id").split("-")[0]
                    itemTypeId = $(total).parent().attr("id").split("-")[1]
                    taskBudgetTotal = 0
                    $("#budgetitems td[data-item-type-id='"+itemTypeId+"']").each (k,lineitem) ->
                        taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task"+taskTypeId+"-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"))
                    $(total).html(taskBudgetTotal.toFixed(2))
                    $(total).parent().find(".left").html((parseFloat($(total).html())-parseFloat($(total).parent().find(".used").html())).toFixed(2))
            cost += parseFloat($(t).html())
            used = 0
            $(".task ."+$(t).attr("class").split(" ")[1]).parent().find(".used").each (j,u) ->
                used += parseFloat($(u).html())
            actual += used
            left += parseFloat($(t).html())-used
            $(t).parent().find(".used").html(used.toFixed(2))
            $(t).parent().find(".left").html((parseFloat($(t).html())-used).toFixed(2))
        $("#actual .cost").html(cost.toFixed(2))
        $("#actual .actualcost").html(actual.toFixed(2))
        $("#actual .diffcost").html(left.toFixed(2))
        sale = parseFloat($("#totals").attr("data-sale"))
        total = parseFloat($("#totals").attr("data-cost"))
        $("#actual .overhead").html((sale*parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2))
        $("#actual .markup").html((total/sale).toFixed(2))
        $("#actual .actualmarkup").html((actual/sale).toFixed(2))
#        mprofit = `((sale*.93-total)>0)?(left>0)?((sale*.93-total)*.2+left*.5):((sale*.93-total)*.2+left):0`
#        fprofit = `((sale*.93-total)>0)?(left>0)?((sale*.93-total)*.8+left*.5):((sale*.93-total)*.8):(sale*.93-total)`
        mprofit = `((sale-total)>0)?(left>0)?((sale-total)*.1):((sale-total)*.1):0`
        fprofit = `((sale-total)>0)?(left>0)?((sale-total)*.9):((sale-total)*.9):(sale-total)`

#  mprofit = `((sale-total)>0)?(left>0)?((sale-total)*.15+left*.5):((sale-total)*.15+left):0`
 # fprofit = `((sale-total)>0)?(left>0)?((sale-total)*.85+left*.5):((sale-total)*.85):(sale-total)`
        $("#managerprofit").html(mprofit.toFixed(2))
        $("#ffiprofit").html(fprofit.toFixed(2))


# ------------------------------------- INIT APP
$ ->
    lineitems = new ActualLineitems
        el: $("#actual")


    $("body").on "change", "#jobCategory", (e) ->
        task3 = $("tr[data-task-type-id='3']")
        if (task3.length > 0)
            dateParts = task3.filter(":last").attr("data-date").split("-")
            defaultDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2])
        else
            defaultDate = new Date()
        $("#jobDate").val($.datepicker.formatDate('yy-mm-dd', defaultDate))
        jsRoutes.controllers.Jobs_rd.updateJob().ajax
            data:
                id: $("#totals").attr("data-job-id")
                category: $("#jobCategory").val()
                date: $("#jobDate").val()
            error: (err) ->
                alert("There was an error updating the job category! Please refresh the page and try again.")

    $("body").on "click", "#jobCategory", (e) ->
        that = this
        target = $(e.currentTarget)
        setTimeout ->
            dblclick = parseInt($(that).data('double'), 10)
            if (dblclick > 0)
                $(that).data('double', dblclick-1)
        , 300


    $("body").on "dblclick", "#jobCategory", (e) ->
        $(this).data('double', 2)
        target = $(e.currentTarget)
        select = target.clone()
        select.find("option[value='"+$("#jobCategory").val()+"']").attr("selected","selected")
        dateParts = $("#jobDate").val().split("-")
        defaultDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2])
        input = $("<input/>").val($("#jobDate").val()).datepicker
            altField: "#jobDate"
            altFormat: "yy-mm-dd"
            defaultDate: defaultDate
            onClose: (d,i) ->
                $(this).datepicker("destroy")
                $(this).replaceWith(select)
            onSelect: (d,i) ->
                $(this).datepicker("destroy")
                $(this).replaceWith(select)
                jsRoutes.controllers.Jobs_rd.updateJob().ajax
                    data:
                        id: $("#totals").attr("data-job-id")
                        date: $("#jobDate").val()
        target.replaceWith(input)
        input.datepicker("show")

    $("#jobNotes").change ->
        jsRoutes.controllers.Jobs_rd.updateJob().ajax
            data:
                id: $("#totals").attr("data-job-id")
                notes: $("#jobNotes").val()
            error: (err) ->
                alert("There was an error updating the job notes! Please refresh the page and try again.")

    $("#copyToPlans").click ->
    ##    $("#dialog").dialog "destroy"
        $("#dialog").dialog
            autoOpen: false
            modal: true
            draggable: false
            resizable: false
            width: 450
            title: "Save as plan..."
            buttons: [
                text: "save"
                click: ->
                    jsRoutes.controllers.Jobs_rd.copyToPlans().ajax
                        data:
                            id: $("#totals").attr("data-job-id")
                            name: $("#newPlanName").val()
                        error: (err) ->
                            alert("There was an error copying the job to plans! Please refresh the page and try again.")
                    $("#dialog").dialog "close"
            ]
        $("#dialog").html("Name ").append($("<input/>").attr("id","newPlanName"))
            .dialog "open"

    $("#applyTemplate").click ->
 ##       $("#dialog").dialog "destroy"
        $("#dialog").dialog
            autoOpen: false
            modal: true
            draggable: false
            resizable: false
            width: 450
            title: "Apply template..."
            buttons: [
                text: "apply"
                click: ->
                    jsRoutes.controllers.Jobs_rd.applyTemplate().ajax
                        data:
                            id: $("#totals").attr("data-job-id")
                            template: $("#planSelect").val()
                        error: (err) ->
                            alert("There was an error applying the template! Please refresh the page and try again.")
                        success: ->
                            location.reload()
                    $("#dialog").dialog "close"
            ]
        $("#dialog").html("").load(jsRoutes.controllers.Jobs_rd.getPlanSelect().url,
            customer: $("#totals").attr("data-customer-id")
        )
        .dialog "open"

    $("#jobMarket").dblclick (e) ->
        target = $(e.currentTarget)
        oldVal = target.html()
        jsRoutes.controllers.Jobs_rd.getMarketSelect().ajax
            success: (data) ->
                m = $(data).children("option[value='']").remove().end()
                m.find("option[value='"+$("#totals").attr("data-market-id")+"']").attr("selected","selected")
                m.change ->
                    context = $(this)
                    jobMarket = $("<span/>").attr("id","jobMarket").html(oldVal)
                    jsRoutes.controllers.Jobs_rd.updateJob().ajax
                        data:
                            id: $("#totals").attr("data-job-id")
                            market: context.val()
                        success: (data) ->
                            jobMarket.html(context.find("option:selected").html())
                            $("#totals").attr("data-market-id",context.val())
                        error: (err) ->
                            alert("There was an error updating the job market! Please refresh the page and try again.")
                    $(this).replaceWith(jobMarket)
                m.blur ->
                    jobMarket = $("<span/>").attr("id","jobMarket").html(oldVal)
                    $(this).replaceWith(jobMarket)
                target.replaceWith(m)
                m.focus()
            error: (err) ->
                alert("There was an error loading the customers! Please refresh the page and try again.")


    $("body").on "click", "#jobCustomer", (e) ->
        target = $(e.currentTarget)
        oldVal = target.html()
        jsRoutes.controllers.Jobs_rd.getCustomerSelect().ajax
            success: (data) ->
                c = $(data).children("option[value='']").remove().end()
                c.find("option[value='"+$("#totals").attr("data-customer-id")+"']").attr("selected","selected")
                c.change ->
                    jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax
                        data:
                            customer: $(this).val()
                        success: (data) ->
                            if (data.length)
                                window.location.href = "/jobs/" + data[0].id
                        error: (err) ->
                            alert("There was an error loading the jobs! Please refresh the page and try again.")
                    jobCustomer = $("<span/>").attr("id","jobCustomer").html(oldVal)
                    $(this).replaceWith(jobCustomer)
                c.blur ->
                    jobCustomer = $("<span/>").attr("id","jobCustomer").html(oldVal)
                    $(this).replaceWith(jobCustomer)
                target.replaceWith(c)
                c.focus()
            error: (err) ->
                alert("There was an error loading the customers! Please refresh the page and try again.")

    $("body").on "click", "#jobSubdivision", (e) ->
        target = $(e.currentTarget)
        oldVal = target.html()
        jsRoutes.controllers.Jobs_rd.getSubdivisionSelect().ajax
            data:
                customer: $("#totals").attr("data-customer-id")
            success: (data) ->
                s = $(data).children("option[value='']").remove().end()
                s.find("option[value='"+$("#totals").attr("data-subdivision-id")+"']").attr("selected","selected")
                s.change ->
                    jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax
                        data:
                            subdivision: $(this).val()
                        success: (data) ->
                            if (data.length)
                                window.location.href = "/jobs/" + data[0].id
                        error: (err) ->
                            alert("There was an error loading the jobs! Please refresh the page and try again.")
                    jobSubdivision = $("<span/>").attr("id","jobSubdivision").html(oldVal)
                    $(this).replaceWith(jobSubdivision)
                s.blur ->
                    jobSubdivision = $("<span/>").attr("id","jobSubdivision").html($(this).find("option:selected").html())
                    $(this).replaceWith(jobSubdivision)
                target.replaceWith(s)
                s.focus()
            error: (err) ->
                alert("There was an error loading the subdivisions! Please refresh the page and try again.")


    $("body").on "click", "#jobLot", (e) ->
        that = this
        target = $(e.currentTarget)
        setTimeout ->
            dblclick = parseInt($(that).data('double'), 10)
            if (dblclick > 0)
                $(that).data('double', dblclick-1)
            else
                jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax
                    data:
                        subdivision: $("#totals").attr("data-subdivision-id")
                    success: (data) ->
                        j = $("<select/>")
                        for job in data
                            j.append($("<option/>").html(job.lot).val(job.id))
                        j.append($("<option/>").html("New Job").val("0"))
                        j.find("option[value='"+$("#totals").attr("data-job-id")+"']").attr("selected","selected")
                        j.change ->
                            if ($(this).val() == "0")
                ##               $("#dialog").dialog "destroy"
                                $("#dialog").dialog
                                    autoOpen: false
                                    modal: true
                                    draggable: false
                                    resizable: false
                                    width: 450
                                    title: "Add a Job"
                                    buttons: [
                                        text: "Add"
                                        click: ->
                                            jsRoutes.controllers.Jobs_rd.addJobTask().ajax
                                                data:
                                                    market: $("#newJobMarket").val()
                                                    subdivision: $("#totals").attr("data-subdivision-id")
                                                    lot: $("#newJobLot").val()
                                                    saleitem: $("#saleitem").val()
                                                    plan: $("#newJobPlan").val()
                                                success: (data) ->
                                                    window.location.href = "/jobs/" + data.id
                                                error: (err) ->
                                                    alert("There was an error adding the job! Please refresh the page and try again.")
                                            $("#dialog").dialog "close"
                                    ]
                                newJobMarket = $("<td/>").load jsRoutes.controllers.Jobs_rd.getMarketSelect().url, ->
                                    $(this).children("select").attr("id","newJobMarket")
                                        .children("option[value='']").remove().end()
                                        .children("option[value='"+$("#totals").attr("data-market-id")+"']").attr("selected","selected")
                                newJobPlan = $("<td/>").load jsRoutes.controllers.Jobs_rd.getPlanSelect().url,
                                    customer: $("#totals").attr("data-customer-id")
                                , ->
                                    $(this).children("select").attr("id","newJobPlan")
                                saleitem = $("<select/>").attr("id","saleitem").append($("<option/>").html("SALEITEM").val(""))
                                jsRoutes.controllers.Jobs_rd.getSaleitems().ajax
                                    success: (data) ->
                                        for item in data
                                            saleitem.append($("<option/>").html(item.name).val(item.id))
                                    error: (err) ->
                                        alert("There was an error loading the sale items! Please refresh the page and try again.")
                                $("<table/>").html($("<tbody/>")
                                    .html($("<tr/>").html($("<td/>").html("Market ")).append(newJobMarket))
                                    .append($("<tr/>").html($("<td/>").html("Lot ")).append($("<td/>").html($("<input/>").attr("id","newJobLot"))))
                                    .append($("<tr/>").html($("<td/>").html("Sale Item ")).append($("<td/>").html(saleitem)))
                                    .append($("<tr/>").html($("<td/>").html("Plan ")).append(newJobPlan))).appendTo($("#dialog").html(""))
                                $("#dialog").dialog "open"
                            else
                                window.location.href = "/jobs/" + $(this).val()
                        j.blur ->
                            jobLot = $("<span/>").attr("id","jobLot").html($(this).find("option[value='"+$("#totals").attr("data-job-id")+"']").html())
                            $(this).replaceWith(jobLot)
                        target.replaceWith(j)
                        j.focus()
                    error: (err) ->
                        alert("There was an error loading the jobs! Please refresh the page and try again.")
        , 300

    $("body").on "dblclick", "#jobLot", (e) ->
        $(this).data('double', 2)
        target = $(e.currentTarget)
        oldVal = target.html()
        input = $("<input/>").val(oldVal).blur ->
            context = $(this)
            jobLot = $("<span/>").attr("id","jobLot").html(oldVal)
            if (context.val()!=oldVal)
                jsRoutes.controllers.Jobs_rd.updateJob().ajax
                    data:
                        id: $("#totals").attr("data-job-id")
                        lot: context.val()
                    success: ->
                        jobLot.html(context.val())
                    error: (err) ->
                        alert("There was an error updating the job lot! Please refresh the page and try again.")
            $(this).replaceWith(jobLot)
        target.replaceWith(input)
        input.focus()

    $("body").on "dblclick", "#jobSaleitem", (e) ->
        $(this).data('double', 2)
        target = $(e.currentTarget)
        oldVal = $("#totals").attr("data-saleitem-id")
        saleitem = $("<select/>").attr("id","jobSaleitem").append($("<option/>").html("SALEITEM"))
        jsRoutes.controllers.Jobs_rd.getSaleitems().ajax
            success: (data) ->
                for item in data
                    saleitem.append($("<option/>").html(item.name).val(item.id))
                saleitem.find("option[value='"+oldVal+"']").attr("selected","selected")
            error: (err) ->
                alert("There was an error loading the sale items! Please refresh the page and try again.")
        saleitem.bind "blur change", ->
            context = $(this)
            jobSaleitem = $("<span/>").attr("id","jobSaleitem").html(context.find("option[value='"+oldVal+"']").html())
            if (context.val()!=oldVal)
                jsRoutes.controllers.Jobs_rd.updateJob().ajax
                    data:
                        id: $("#totals").attr("data-job-id")
                        saleitem: context.val()
                    success: ->
                        $("#totals").attr("data-saleitem-id",context.val())
                        jobSaleitem.html(context.find("option:selected").html())
                    error: (err) ->
                        alert("There was an error updating the job saleitem! Please refresh the page and try again.")
            $(this).replaceWith(jobSaleitem)
        target.replaceWith(saleitem)
        saleitem.focus()

