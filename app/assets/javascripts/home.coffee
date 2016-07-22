$ ->
  loadCustomerSelect = ->
    c = $()
    jsRoutes.controllers.Jobs.getCustomerSelect().ajax
      async: false
      data:
        market: $("#marketSelect").find("option:selected").val()
      success: (data) ->
        c = $(data).append($("<option/>").html("New Customer").val("0"))
        c.change ->
          if ($(this).val() == "0")
            if ($("#typeSelect").val()=="jobs")
              $("#subdivisionSelect").html("")
              $("#subdivisionSelect").css("display","inherit")
              if ($("#jobSelect").length)
                $("#jobSelect").replaceWith($("<select/>").attr("id","jobSelect").append($("<option/>")))
              else
                $("#planSelect").replaceWith($("<select/>").attr("id","jobSelect").append($("<option/>")))
            else if ($("#typeSelect").val()=="plans")
              $("#subdivisionSelect").css("display","none")
              $("#jobSelect").replaceWith(loadPlanSelect())
            $("#dialog").dialog "destroy"
            $("#dialog").dialog
              autoOpen: false
              modal: true
              draggable: false
              resizable: false
              width: 450
              title: "Add a Customer"
              buttons: [
                text: "Add"
                click: ->
                  jsRoutes.controllers.Customers.addCustomer().ajax
                    data:
                      market: $("#newCustomerMarket").find("option:selected").val()
                      name: $("#newCustomerName").val()
                    success: (data) ->
                      $("#typeSelect").change()
                      $("#customerSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
                    error: (err) ->
                      alert("There was an error adding the customer! Please refresh the page and try again.")
                  $("#dialog").dialog "close"
              ]
            $("#dialog").html($("#marketSelect").clone().unbind().attr("id","newCustomerMarket")
            .children("option[value='']").remove().end()
            .children("option[value='0']").remove().end()
            .children("option[value='"+$("#marketSelect").val()+"']").attr("selected","selected").end())
            .append("<br/>Name ").append($("<input/>").attr("id","newCustomerName"))
            .dialog "open"
          else
            $("#marketSelect").find("option[value='"+$(this).find("option:selected").attr("data-market-id")+"']").attr("selected","selected")
            if ($("#jobSelect").length)
              $("#subdivisionSelect").replaceWith(loadSubdivisionSelect())
            else
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
        s = $(data).append($("<option/>").html("New Subdivision").val("0"))
        s.change ->
          if ($(this).val() == "0")
            $("#dialog").dialog "destroy"
            $("#dialog").dialog
              autoOpen: false
              modal: true
              draggable: false
              resizable: false
              width: 450
              title: "Add a Subdivision"
              buttons: [
                text: "Add"
                click: ->
                  jsRoutes.controllers.Customers.addSubdivision().ajax
                    data:
                      customer: $("#customerSelect").find("option:selected").val()
                      name: $("#newSubdivisionName").val()
                    success: (data) ->
                      $("#subdivisionSelect").replaceWith(loadSubdivisionSelect())
                      $("#subdivisionSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
                    error: (err) ->
                      alert("There was an error adding the subdivision! Please refresh the page and try again.")
                  $("#dialog").dialog "close"
              ]
            $("#dialog").html("Name ").append($("<input/>").attr("id","newSubdivisionName"))
            .dialog "open"
          else
            $("#jobSelect").replaceWith(loadJobSelect())
      error: (err) ->
        alert("There was an error loading the subdivisions! Please refresh the page and try again.")
    s

  loadJobSelect = ->
    j = $("<select/>").attr("id","jobSelect").append($("<option/>"))
    jsRoutes.controllers.Jobs.getJobsByLot().ajax
      async: false
      data:
        subdivision: $("#subdivisionSelect").find("option:selected").val()
      success: (data) ->
        j.append($("<option/>").html("New Job").val("0"))
        for job in data
          j.append($("<option/>").html(job.lot).val(job.id))
        j.change ->
          if ($(this).val() == "0")
            $("#dialog").dialog "destroy"
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
                  jsRoutes.controllers.Jobs.addJobTask().ajax
                    data:
                      market: $("#newJobMarket").val()
                      subdivision: $("#subdivisionSelect").val()
                      lot: $("#newJobLot").val()
                      saleitem: $("#saleitem").val()
                      plan: $("#newJobPlan").val()
                    success: (data) ->
                      $("#jobSelect").replaceWith(loadJobSelect())
                      $("#jobSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
                    error: (err) ->
                      alert("There was an error adding the job! Please refresh the page and try again.")
                  $("#dialog").dialog "close"
              ]
            newJobMarket = $("<td/>").load jsRoutes.controllers.Jobs.getMarketSelect().url, ->
              $(this).children("select").attr("id","newJobMarket")
              .children("option[value='']").remove().end()
              .children("option[value='"+$("#customerSelect").find("option:selected").attr("data-market-id")+"']").attr("selected","selected")
            newJobPlan = $("<td/>").load jsRoutes.controllers.Jobs.getPlanSelect().url,
              customer: $("#customerSelect").val()
            , ->
              $(this).children("select").attr("id","newJobPlan")
            saleitem = $("<select/>").attr("id","saleitem").append($("<option/>").html("SALEITEM").val(""))
            jsRoutes.controllers.Jobs.getSaleitems().ajax
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
            if ($("#newWindow").attr("checked"))
              window.open("/jobs/" + $(this).val())
              $("#typeSelect").change()
            else
              window.location.href = "/jobs/" + $(this).val()
      error: (err) ->
        alert("There was an error loading the jobs! Please refresh the page and try again.")
    j

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
        p.children("option[value='']").after($("<option/>").html("New Plan").val("0"))
        p.change ->
          if ($(this).val() == "0")
            $("#dialog").dialog "destroy"
            $("#dialog").dialog
              autoOpen: false
              modal: true
              draggable: false
              resizable: false
              width: 450
              title: "Add a Plan"
              buttons: [
                text: "Add"
                click: ->
                  jsRoutes.controllers.Plans.addPlan().ajax
                    data:
                      customer: $("#customerSelect").find("option:selected").val()
                      name: $("#newPlanName").val()
                      template: $("#newPlanTemplate").find("option:selected").val()
                    success: (data) ->
                      $("#planSelect").replaceWith(loadPlanSelect())
                      $("#planSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
                    error: (err) ->
                      alert("There was an error adding the plan! Please refresh the page and try again.")
                  $("#dialog").dialog "close"
              ]
            $("#dialog").html("Plan  ").append($("<input/>").attr("id","newPlanName"))
            if ($("#customerSelect").find("option:selected").val()!="")
              $("#dialog").append("<br/>Template ").append(loadPlanSelect().unbind().attr("id","newPlanTemplate")
              .children("option[value='0']").remove().end())
            $("#dialog").dialog "open"
          else
            if ($("#newWindow").attr("checked"))
              window.open("/plans/" + $(this).val())
              $("#typeSelect").change()
            else
              window.location.href = "/plans/" + $(this).val()
      error: (err) ->
        alert("There was an error loading the plans! Please refresh the page and try again.")
    p

  $("#typeSelect").change ->
    $("#marketSelect").find("option:eq(0)").attr("selected","selected").end().change()



  $("#marketSelect").change ->
    if ($(this).val() == "0")
      $("#dialog").dialog "destroy"
      $("#dialog").dialog
        autoOpen: false
        modal: true
        draggable: false
        resizable: false
        width: 450
        title: "Add a Subdivision"
        buttons: [
          text: "Add"
          click: ->
            jsRoutes.controllers.Customers.addMarket().ajax
              data:
                city: $("#newMarketCity").val()
                state: $("#newMarketState").val()
              success: (data) ->
                $("#marketSelect").find("option[value='0']").before($("<option/>").html(data.city+", "+data.state).val(data.id))
                $("#marketSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
              error: (err) ->
                alert("There was an error adding the market! Please refresh the page and try again.")
            $("#dialog").dialog "close"
        ]
      $("#dialog").html("City  ").append($("<input/>").attr("id","newMarketCity"))
      .append("<br/>State ").append($("<input/>").attr("id","newMarketState"))
      .dialog "open"




    $("#customerSelect").replaceWith(loadCustomerSelect())
    $("#vendorSelect").replaceWith(loadVendorSelect())


    if ($("#typeSelect").val()=="jobs")
      $("#subdivisionSelect").html("")
      $("#subdivisionSelect").css("display","inherit")
      if ($("#jobSelect").length)
        $("#jobSelect").replaceWith($("<select/>").attr("id","jobSelect").append($("<option/>")))
      else
        $("#planSelect").replaceWith($("<select/>").attr("id","jobSelect").append($("<option/>")))
    else if ($("#typeSelect").val()=="plans")
      $("#subdivisionSelect").css("display","none")
      if ($("#jobSelect").length)
        $("#jobSelect").replaceWith(loadPlanSelect())
      else
        $("#planSelect").replaceWith(loadPlanSelect())

  $("#startDate").datepicker
    dateFormat: 'yy-mm-dd'

  $("#endDate").datepicker
    dateFormat: 'yy-mm-dd'

  $("#editCustomer").click ->
    if ($("#subdivisionSelect").find("option:selected").length && $("#subdivisionSelect").find("option:selected").val() != "")
      if ($("#newWindow").attr("checked"))
        window.open("/customers/subdivisions/" + $("#subdivisionSelect").find("option:selected").val())
        $("#typeSelect").change()
      else
        window.location.href = "/customers/subdivisions/" + $("#subdivisionSelect").find("option:selected").val()
    else if ($("#customerSelect").find("option:selected").val() != "")
      if ($("#newWindow").attr("checked"))
        window.open("/customers/" + $("#customerSelect").find("option:selected").val())
        $("#typeSelect").change()
      else
        window.location.href = "/customers/" + $("#customerSelect").find("option:selected").val()

  $("#editMarket").click ->
    if ($("#marketSelect").find("option:selected").length && $("#marketSelect").find("option:selected").val() != "")
      if ($("#newWindow").attr("checked"))
        window.open("/customers/markets/" + $("#marketSelect").find("option:selected").val())
        $("#typeSelect").change()
      else
        window.location.href = "/customers/markets/" + $("#marketSelect").find("option:selected").val()

  $("#itemReport").click ->
    if ($("#newWindow").attr("checked"))
      window.open(jsRoutes.controllers.Reports.getItemsReport().url + "?market=" + $("#marketSelect").val() + "&user=" + $("#managerSelect").val() + "&itemType=" + $("#reportSelect").val() + "&startDate=" + $("#startDate").val() + "&endDate=" + $("#endDate").val())
    else
      window.location.href = jsRoutes.controllers.Reports.getItemsReport().url + "?market=" + $("#marketSelect").val() + "&user=" + $("#managerSelect").val() + "&itemType=" + $("#reportSelect").val() + "&startDate=" + $("#startDate").val() + "&endDate=" + $("#endDate").val()


  $("#jobsReport").click ->
    if ($("#newWindow").attr("checked"))
      window.open(jsRoutes.controllers.Reports.getJobsReport().url + "?market=" + $("#marketSelect").val() + "&jobCategory=" + $("#reportJobCategory").val() + "&startDate=" + $("#startDate").val() + "&endDate=" + $("#endDate").val())
    else
      window.location.href = jsRoutes.controllers.Reports.getJobsReport().url + "?market=" + $("#marketSelect").val() + "&jobCategory=" + $("#reportJobCategory").val() + "&startDate=" + $("#startDate").val() + "&endDate=" + $("#endDate").val()

  $("#profitReport").click ->
    if ($("#newWindow").attr("checked"))
      window.open(jsRoutes.controllers.Reports.getProfitReport().url + "?market=" + $("#marketSelect").val() + "&startDate=" + $("#startDate").val() + "&endDate=" + $("#endDate").val())
    else
      window.location.href = jsRoutes.controllers.Reports.getProfitReport().url + "?market=" + $("#marketSelect").val() + "&startDate=" + $("#startDate").val() + "&endDate=" + $("#endDate").val()

  loadVendorSelect = ->
    v = $()
    jsRoutes.controllers.Lineitems.getVendorSelect().ajax
      async: false
      data:
        market: $("#marketSelect").val()
        itemType: $("#itemSelect").find("option:selected").attr("data-item-type-id")
      success: (data) ->
        v = $(data)
        v.append($("<option/>").html("New Vendor").val("0"))
        v.change ->
          if ($(this).val() == "0")
            $("#dialog").dialog "destroy"
            $("#dialog").dialog
              autoOpen: false
              modal: true
              draggable: false
              resizable: false
              width: 450
              title: "Add a Vendor"
              buttons: [
                text: "Add"
                click: ->
                  jsRoutes.controllers.Vendors.addVendor().ajax
                    data:
                      market: $("#newVendorMarket").find("option:selected").val()
                      name: $("#newVendorName").val()
                    success: (data) ->
                      $("#vendorSelect").find("option[value='']").attr("selected","selected")
                      $("#vendorSelect").replaceWith(loadVendorSelect())
                      $("#vendorSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
                    error: (err) ->
                      alert("There was an error adding the vendor! Please refresh the page and try again.")
                  $("#dialog").dialog "close"
              ]
            $("#dialog").html($("#marketSelect").clone().unbind().attr("id","newVendorMarket")
            .children("option[value='']").remove().end()
            .children("option[value='0']").remove().end()
            .children("option[value='"+$("#marketSelect").val()+"']").attr("selected","selected").end())
            .append("<br/>Name ").append($("<input/>").attr("id","newVendorName"))
            .dialog "open"
          else
            itemId = `($("#itemSelect").val()!="0")?$("#itemSelect").val():""`
            $("#itemSelect").replaceWith(loadItemSelect())
            $("#itemSelect").find("option[value='"+itemId+"']").attr("selected","selected")
            if ($(this).val() == "")
              $("#vendorItemUpdate").html("")
            else
              jsRoutes.controllers.Vendors.getVendor($(this).val()).ajax
                success: (data) ->
                  $("#vendorItemUpdate").html($(data))
        $("#vendorItemUpdate").html("")
        itemId = `($("#itemSelect").val()!="0")?$("#itemSelect").val():""`
        $("#itemSelect").replaceWith(loadItemSelect())
        $("#itemSelect").find("option[value='"+itemId+"']").attr("selected","selected")
      error: (err) ->
        alert("There was an error loading the vendors! Please refresh the page and try again.")
    v

  loadItemSelect = ->
    i = $()
    jsRoutes.controllers.Lineitems.getItemSelect().ajax
      async: false
      data:
        id: `($("#vendorSelect").val() != null)?$("#vendorSelect").val():""`
      success: (data) ->
        i = $(data)
        if ($("#vendorSelect").val() == null || $("#vendorSelect").val() == "")
          i.append($("<option/>").html("New Item").val("0"))
        else
          i.append($("<option/>").html("New Vendor Item").val("0"))
        i.change ->
          if ($(this).val() == "0")
            $("#dialog").dialog "destroy"
            $("#dialog").dialog
              autoOpen: false
              modal: true
              draggable: false
              resizable: false
              width: 450
              title: "Add an Item"
              buttons: [
                text: "Add"
                click: ->
                  if ($("#vendorSelect").val() != "")
                    jsRoutes.controllers.Vendors.addVendorItem().ajax
                      data:
                        vendor: $("#vendorSelect").val()
                        item: $("#newVendorItem").val()
                      success: (data) ->
                        $("#itemSelect").replaceWith(loadItemSelect())
                        $("#itemSelect").find("option[value='"+data.item.id+"']").attr("selected","selected").end().change()
                      error: (err) ->
                        alert("There was an error adding the vendor item! Please refresh the page and try again.")
                  else
                    jsRoutes.controllers.Vendors.addItem().ajax
                      data:
                        itemType: $("#newItemType").find("option:selected").val()
                        name: $("#newItemName").val()
                      success: (data) ->
                        $("#itemSelect").replaceWith(loadItemSelect())
                        $("#itemSelect").find("option[value='"+data.id+"']").attr("selected","selected").end().change()
                      error: (err) ->
                        alert("There was an error adding the item! Please refresh the page and try again.")
                  $("#dialog").dialog "close"
              ]
            if ($("#vendorSelect").val() != "")
              $("#dialog").html("").load(jsRoutes.controllers.Lineitems.getItemSelect().url, ->
                newVendorItem = $(this).children("select")
                newVendorItem.attr("id","newVendorItem")
                $("#itemSelect").children("option").each ->
                  newVendorItem.find("option[value='"+$(this).val()+"']").remove()
              )
              .dialog "open"
            else
              $("#dialog").html($("#reportSelect").clone().unbind().attr("id","newItemType")
              .children("option[value='']").remove().end())
              .append("<br/>Name ").append($("<input/>").attr("id","newItemName"))
              .dialog "open"
          else
            vendorId = $("#vendorSelect").val()
            if ($(this).val() == "")
              $("#vendorSelect").replaceWith(loadVendorSelect())
              $("#vendorSelect").find("option[value='"+vendorId+"']").attr("selected","selected").end().change()
            else
              if (vendorId != "")
                jsRoutes.controllers.Vendors.getVendorItem($(this).find("option:selected").attr("data-vendor-item-id")).ajax
                  success: (data) ->
                    $("#vendorItemUpdate").html($(data))
              else
                jsRoutes.controllers.Vendors.getItem($(this).val()).ajax
                  success: (data) ->
                    $("#vendorItemUpdate").html($(data))
                  error: (err) ->
                    alert("There was an error getting the item! Please refresh the page and try again.")
              $("#vendorSelect").replaceWith(loadVendorSelect())
              $("#vendorSelect").find("option[value='"+vendorId+"']").attr("selected","selected")
      error: (err) ->
        alert("There was an error loading the items! Please refresh the page and try again.")
    i

  $("#typeSelect").change()

  $("#marketSelect").live "click", (e) ->
    that = this
    target = $(e.currentTarget)
    setTimeout ->
      dblclick = parseInt($(that).data('double'), 10)
      if (dblclick > 0)
        target.preventDefault()
        $(that).data('double', dblclick-1)
    , 300

  $("#marketSelect").live "dblclick", (e) ->
    $(this).data('double', 2)
    target = $(e.currentTarget)
    window.open target.find("option:selected").attr("data-url")


