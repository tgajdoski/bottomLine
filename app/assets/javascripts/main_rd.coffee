$ ->
    $( "#dialog" ).dialog
        autoOpen: false
        modal: true
        draggable: false
        resizable: false
        width: 450

    $("#search").autocomplete
        source: (request,response) ->
            jsRoutes.controllers.Jobs_rd.searchJobs().ajax
                data:
                    search: $("#search").val()
                success: (data) ->
                    response($.map(data, (job) ->
                        label: `job.customer?job.customer.name+" "+(job.subdivision?job.subdivision.name+" "+job.lot:job.lot):(job.subdivision?job.subdivision.name+" "+job.lot:job.lot)`
                        value: job.id
                    ))
                error: (err) ->
                    alert("There was an error loading the jobs! Please refresh the page and try again.")
        select: (event, ui) ->
            if ( ui.item )
               window.location = window.location.protocol + "//" + window.location.host + "/jobs/" + ui.item.value
        open: ->
            $(this).removeClass("ui-corner-all").addClass("ui-corner-top")
        close: ->
            $(this).removeClass("ui-corner-top").addClass("ui-corner-all")


    $("#loading").ajaxStart ->
          $(this).show()
      .ajaxStop ->
          $(this).hide()
      .hide()


