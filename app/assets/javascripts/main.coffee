$ ->
    $("#logout").click ->
        if (confirm('Are you sure you wish to logout?'))
            window.location.href = "/logout"

    $( "#dialog" ).dialog
        autoOpen: false
        modal: true
        draggable: false
        resizable: false
        width: 450

    $("#search>input").autocomplete
        source: (request,response) ->
            jsRoutes.controllers.Jobs.searchJobs().ajax
                data:
                    search: $("#search>input").val()
                success: (data) ->
                    response($.map(data, (job) ->
                        label: `job.customer?job.customer.name+" "+(job.subdivision?job.subdivision.name+" "+job.lot:job.lot):(job.subdivision?job.subdivision.name+" "+job.lot:job.lot)`
                        value: job.id
                    ))
                error: (err) ->
                    alert("There was an error loading the jobs! Please refresh the page and try again.")
        select: (event, ui) ->
            if ( ui.item )
                window.location.href = "/jobs/" + ui.item.value
        open: ->
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top")
        close: ->
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all")

    $("#loading").ajaxStart ->
        $(this).show()
    .ajaxStop ->
        $(this).hide()
    .hide()

    $("#deleteJob").click ->
        if (confirm("Are you sure?"))
            jsRoutes.controllers.Jobs.deleteJob().ajax
                data:
                    id: $("#totals").attr("data-job-id")
                success: ->
                    window.location.href = "/"
                error: (err) ->
                    alert("There was an error deleting the job! Please refresh the page and try again.")

    $("#deletePlan").click ->
        if (confirm("Are you sure?"))
            jsRoutes.controllers.Plans.deletePlan().ajax
                data:
                    id: $("#totals").attr("data-plan-id")
                success: ->
                    window.location.href = "/"
                error: (err) ->
                    alert("There was an error deleting the plan! Please refresh the page and try again.")

    $("input[value='Delete']").live "click", ->
        $(this).parent().submit ->
            confirm("Are you sure?")

    $("#budget>table>thead>tr>th:gt(0)").click ->
        if (confirm('Remove column \''+$(this).html()+'\'?'))
            $(this).parent().parent().parent().find("tr>td:eq("+$(this).parent().find("th").index($(this))+")").each ->
                $(this).remove()
            $(this).remove()
    $("#saleprice>span,#totals>table,#saleitems>table>thead>tr>th:gt(0),#planitems>table>thead>tr>th:gt(0),#attachments>table>tbody>tr>td:eq(0),#actualitems>table:eq(0)>tbody>tr>td:lt(3)").click ->
        if ($(this).parents("section,h1").hasClass("noPrint"))
            $(this).parents("section,h1").removeClass("noPrint")
        else
            $(this).parents("section,h1").addClass("noPrint")