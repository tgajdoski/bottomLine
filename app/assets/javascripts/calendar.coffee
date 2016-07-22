$ ->
    $(".openJob,.openTask").live "click", (e) ->
        e.preventDefault()
        window.open($(this).attr("href"))

    if ($(".notes").length)
        $(".notes").editable
            closeOnEnter: true
            callback: (data) ->
                if (data.content)
                    id = data.$el.parent().attr("data-task-id")
                    jsRoutes.controllers.Tasks.updateTask(id).ajax
                        data:
                            notes: data.content
                        error: (err) ->
                            alert("There was an error updating the task notes! Please refresh the page and try again.")

    $("#dialog").dialog
        title: "Add a task"
        buttons: [
            text: "Add"
            click: ->
                jsRoutes.controllers.Jobs.addJobTask().ajax
                    data:
                        market: $("#marketSelect").find("option:selected").val()
                        subdivision: $("#subdivisionSelect").find("option:selected").val()
                        lot: $("#lot").val()
                        job: $("#lot").attr("data-job-id")
                        saleitem: $("#saleitem").val()
                        plan: $("#planSelect").val()
                        task: $("#taskSelect").val()
                        crew: $("#crew").val()
                        date: $("#date").val()
                    success: (data) ->
                        $(data).appendTo($("tr[data-crew='"+$("#crew").val()+"']").find("ol[data-date='"+$("#date").val()+"']"))
                        $("#marketSelect").remove()
                    error: (err) ->
                        alert("There was an error adding the job task! Please refresh the page and try again.")
                $("#dialog").dialog "close"
        ]

    $("#gotoDatePicker").datepicker
        showOn: "button"
        buttonImageOnly: true
        buttonImage: "/assets/images/calendar.gif"
        dateFormat: "yy-mm-dd"
        defaultDate: new Date($("#gotoDatePicker").val().split("-")[0], $("#gotoDatePicker").val().split("-")[1]-1, $("#gotoDatePicker").val().split("-")[2])
        onSelect: (dateText, inst) ->
            window.location.href = "?date="+dateText+"&market="+$("#calMarketSelect").val()+"&manager="+$("#calManagerSelect").val();

    $("ol").dragsort
        dragSelector: "li strong"
        dragBetween: true
        placeHolderTemplate: "<li><strong>+</strong></li>"
        dragEnd: ->
            id = $(this).attr("data-task-id")
            cardOrder = 1
            $(this).parent().children("li").each (i,r) ->
                if ($(this).attr("data-task-id")==id)
                    cardOrder += i
            $(this).find("strong").html(cardOrder)
            jsRoutes.controllers.Tasks.updateTask(id).ajax
                data:
                    crew: $(this).parent().parent().parent().attr("data-crew")
                    cardOrder: cardOrder
                    date: $(this).parent().attr("data-date")
                success: (data) ->
                    for task in data
                        $("li[data-task-id='"+task.id+"']>strong").html(task.cardOrder)
                error: (err) ->
                    alert("There was an error reordering the tasks! Please refresh the page and try again.")


    $("#calHead select").change ->
        window.location.href = "?date="+$("#gotoDatePicker").val()+"&market="+$("#calMarketSelect").val()+"&manager="+$("#calManagerSelect").val();

    loadCustomerSelect = ->
        c = $()
        jsRoutes.controllers.Jobs.getCustomerSelect().ajax
                async: false
                data:
                    market: $("#marketSelect").find("option:selected").val()
                success: (data) ->
                    c = $(data)
                    c.change ->
                        $("#marketSelect").find("option[value='"+$(this).find("option:selected").attr("data-market-id")+"']").attr("selected","selected")
                        $("#subdivisionSelect").replaceWith(loadSubdivisionSelect())
                        $("#planSelect").replaceWith(loadPlanSelect())
                error: (err) ->
                    alert("There was an error loading the customers! Please refresh the page and try again.")
        c

    loadSubdivisionSelect = ->
        s = $()
        context = this
        jsRoutes.controllers.Jobs.getSubdivisionSelect().ajax
                context: this
                async: false
                data:
                    customer: $("#customerSelect").find("option:selected").val()
                success: (data) ->
                    s = $(data)
                error: (err) ->
                    alert("There was an error loading the subdivisions! Please refresh the page and try again.")
        s

    loadPlanSelect = ->
        p = $()
        context = this
        jsRoutes.controllers.Jobs.getPlanSelect().ajax
                context: this
                async: false
                data:
                    customer: $("#customerSelect").find("option:selected").val()
                success: (data) ->
                    p = $(data)
                error: (err) ->
                    alert("There was an error loading the plans! Please refresh the page and try again.")
        p

    $(".addJob").click (e) ->
        target = $(e.currentTarget)
        crew = $("<input/>").attr("type","hidden").attr("id","crew").val(target.parent().parent().attr("data-crew"))
        date = $("<input/>").attr("type","hidden").attr("id","date").val(target.parent().find("ol").attr("data-date"))
        markets = $("#calMarketSelect").clone()
        markets.attr("id","marketSelect").change ->
            if ($("#customerSelect").find("option:selected").val()=="")
                $("#customerSelect").replaceWith(loadCustomerSelect())
                $("#subdivisionSelect").replaceWith($("<select/>").attr("id","subdivisionSelect"))
        markets.find("option[value='"+$("#calHead>select").find("option:selected").val()+"']").attr("selected","selected")
        marketRow = $("<tr/>").append("<td>Market</td>")
        $("<td/>").append(markets).appendTo(marketRow)
        customerRow = $("<tr/>").append("<td>Customer</td>")
        $("<td/>").append(loadCustomerSelect()).appendTo(customerRow)
        subdivisionRow = $("<tr/>").append("<td>Subdivision</td>")
        $("<td/>").append($("<select/>").attr("id","subdivisionSelect")).appendTo(subdivisionRow)
        lot = $("<input/>").attr("id","lot").attr("data-job-id","")
        lot.autocomplete
            source: (request,response) ->
                jsRoutes.controllers.Jobs.getJobsByLot().ajax
                    data:
                        market: $("#marketSelect").find("option:selected").val()
                        customer: $("#customerSelect").find("option:selected").val()
                        subdivision: $("#subdivisionSelect").find("option:selected").val()
                        lot: $("#lot").val()
                    success: (data) ->
                        response($.map(data, (job) ->
                            label: `job.customer?job.customer.name+" "+(job.subdivision?job.subdivision.name+" "+job.lot:job.lot):(job.subdivision?job.subdivision.name+" "+job.lot:job.lot)`
                            value: job.lot
                            market: `job.market?job.market.id:""`
                            customer: `job.customer?job.customer.id:""`
                            subdivision: `job.subdivision?job.subdivision.id:""`
                            job: job.id
                            saleitem: `job.item?job.item.id:""`
                            plan: `job.plan?job.plan.id:""`
                        ))
                    error: (err) ->
                        alert("There was an error loading the jobs! Please refresh the page and try again.")
            select: (event, ui) ->
                if ( ui.item )
                    $("#lot").attr("data-job-id",ui.item.job)
                    if (ui.item.market!="")
                        $("#marketSelect").find("option[value='"+ui.item.market+"']").attr("selected","selected")
                    if (ui.item.customer!="")
                        $("#customerSelect").find("option[value='"+ui.item.customer+"']").attr("selected","selected")
                        $("#customerSelect").change()
                    if (ui.item.subdivision!="")
                        $("#subdivisionSelect").find("option[value='"+ui.item.subdivision+"']").attr("selected","selected")
                    if (ui.item.saleitem!="")
                        $("#saleitem").find("option[value='"+ui.item.saleitem+"']").attr("selected","selected")
                    if (ui.item.plan!="")
                        $("#planSelect").find("option[value='"+ui.item.plan+"']").attr("selected","selected")
            open: ->
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top")
            close: ->
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all")
        lotRow = $("<tr/>").append("<td>Lot</td>")
        $("<td/>").append($("<div/>").attr("class","ui-widget").append(lot)).appendTo(lotRow)
        saleitem = $("<select/>").attr("id","saleitem").append($("<option/>").html("SALEITEM").val(""))
        jsRoutes.controllers.Jobs.getSaleitems().ajax
            success: (data) ->
                for item in data
                    saleitem.append($("<option/>").html(item.name).val(item.id))
            error: (err) ->
                alert("There was an error loading the sale items! Please refresh the page and try again.")
        saleitemRow = $("<tr/>").append("<td>Saleitem</td>")
        $("<td/>").append($("<div/>").attr("class","ui-widget").append(saleitem)).appendTo(saleitemRow)
        planRow = $("<tr/>").append("<td>Plan</td>")
        $("<td/>").append(loadPlanSelect()).appendTo(planRow)
        taskRow = $("<tr/>").append("<td>Task</td>")
        $("<td/>").append($("<select/>").attr("id","taskSelect").append($("<option/>").html("Task1").val(1))
            .append($("<option/>").html("Task2").val(2))
            .append($("<option/>").html("Task3").val(3))).appendTo(taskRow)
        table = $("<table/>")
        $("<tbody/>").append(marketRow)
            .append(customerRow)
            .append(subdivisionRow)
            .append(lotRow)
            .append(saleitemRow)
            .append(planRow)
            .append(taskRow)
            .appendTo(table)
        $("#dialog").html("")
            .append(table)
            .append(crew)
            .append(date)
            .dialog "open"

    $(".printweek").click ->
        parms = `(window.location.href.indexOf("?")!=-1)?"&"+window.location.href.split("?")[1]:""`
        window.open("/calendar/print?font="+$(this).css("font-size")+parms)

    $(".printicon").click ->
        parms = `(window.location.href.indexOf("?")!=-1)?"&market="+window.location.href.split("&market=")[1]:""`
        window.open("/calendar/jobcards?withrates="+confirm("Show rates?")+"&date="+$(this).attr("data-date")+parms)

    $("#itemReport").click ->
        parms = `(window.location.href.indexOf("?")!=-1)?"?"+window.location.href.split("?")[1]:""`
        window.open("/calendar/items"+parms)



