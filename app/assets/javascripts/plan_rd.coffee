# ------------------------------- DROP DOWN MENUS
###$("body").on "click", ".options dt, .users dt", (e) ->
  e.preventDefault()
  if $(e.target).parent().hasClass("opened")
    $(e.target).parent().removeClass("opened")
  else
    $(e.target).parent().addClass("opened")
    $(document).one "click", ->
      $(e.target).parent().removeClass("opened")
  false###

# ---------------------------------------- PLAN
class Plan extends Backbone.View
  events:
    "click    .addPlanItem"         : "addPlanItem"
  initialize: ->
    $("#addPlanItem").click @addPlanItem
    @el.children("div").each (i,planItem) ->
      new PlanItem
        el: $(planItem)
      $("table.planitem tr",planItem).each (i,dimension) ->
        new Dimension
          el: $(dimension)
    new Attachments
      el: $("#attachments")
  addPlanItem: (e) ->
    target = $(e.currentTarget);
    jsRoutes.controllers.Plans_rd.addPlanItem().ajax
      data:
        id: target.attr("data-plan-item-id")
      success: (data) ->
        _view = new PlanItem
          el: $(data).appendTo("#planitems")
        #                _view.el.find(".groupName").editInPlace("edit")
        target.remove()
      error: (err) ->
        alert("There was an error adding the plan item! Please refresh the page and try again.")

# --------------------------------- ATTACHMENTS
class Attachments extends Backbone.View
  events:
    "click .deleteAttachment"       : "deleteAttachment"
  initialize: ->
    @attachment = $("#attachment")
  deleteAttachment: (e) ->
    e.preventDefault()
    target = $(e.currentTarget)
    id = target.parent().parent().attr("data-attachment-id")
    if (confirm('Are you sure?'))
      jsRoutes.controllers.Plans_rd.deleteAttachment(id).ajax
        success: ->
          target.parent().parent().remove()
        error: (err) ->
          alert("There was an error deleting the attachment! Please refresh the page and try again.")

# ----------------------------------- PLAN ITEM
class PlanItem extends Backbone.View
  events:
    "click    .addition,.subtraction"        : "newDimension"
  initialize: ->
    @id = @el.attr("data-plan-item")
  newDimension: (e) ->
    e.preventDefault()
    target = $(e.currentTarget)
    jsRoutes.controllers.Plans_rd.addDimension().ajax
      context: this
      data:
        job: $("#totals").attr("data-job-id")
        plan: $("#totals").attr("data-plan-id")
        planItem: @id
        deduction: if (target.hasClass("addition"))
          "false"
        else
          "true"
      success: (tpl) ->
        _list = $("table.planitem tbody",@el)
        _view = new Dimension
          el: $(tpl).appendTo(_list)
#                _view.el.find(".name").editInPlace("edit")
      error: (err) ->
        alert("There was an error adding the dimension! Please refresh the page and try again.")

# ----------------------------------- Dimension
class Dimension extends Backbone.View
  events:
    "click    .deleteDimension"        : "deleteDimension"
    "change   .notes,.feet,.inches"    : "updateDimension"
  initialize: ->
    @id = @el.attr("data-dimension-id")
    @length_feet = @el.find("td:eq(3) input")
    @length_inches = @el.find("td:eq(4) input")
    @width_feet = @el.find("td:eq(5) input")
    @width_inches = @el.find("td:eq(6) input")
    @depth_feet = @el.find("td:eq(7) input")
    @depth_inches = @el.find("td:eq(8) input")
    @recalculate()
  deleteDimension: (e) ->
    e.preventDefault()
    if (confirm('Are you sure?'))
      jsRoutes.controllers.Plans_rd.deleteDimension(@id).ajax
        context: this
        success: ->
          @length_feet.val(0)
          @length_inches.val(0)
          @width_feet.val(0)
          @width_inches.val(0)
          @depth_feet.val(0)
          @depth_inches.val(0)
          @recalculate()
          @el.remove()
        error: (err) ->
          alert("There was an error deleting the dimension! Please refresh the page and try again.")
  updateDimension: (e) ->
    target = $(e.currentTarget)
    temp = {}
    temp[target.attr('class').split(" ").join("_")] = target.val()
    jsRoutes.controllers.Plans_rd.updateDimension(@id).ajax
      context: this
      data: temp
      success: ->
        if (!target.hasClass("notes"))
          @recalculate()
      error: (err) ->
        alert("There was an error updating the dimension! Please refresh the page and try again.")
  recalculate: ->
    @el.attr("data-length",parseFloat(@length_feet.val())+parseFloat(@length_inches.val())/12)
    @el.attr("data-width",parseFloat(@width_feet.val())+parseFloat(@width_inches.val())/12)
    @el.attr("data-depth",parseFloat(@depth_feet.val())+parseFloat(@depth_inches.val())/12)
    @el.find("td:eq(9)").html((parseFloat(@el.attr("data-length"))*parseFloat(@el.attr("data-width"))*parseFloat(@el.attr("data-depth"))).toFixed(2))
    @el.find("td:eq(10)").html((@el.find("td:eq(9)").html()/27).toFixed(2))
    lnft = 0.0
    sqft = 0.0
    cuft = 0.0
    cuyds = 0.0
    @el.parent().parent().find(".dimension").each (i,dim) ->
      if ($(dim).hasClass("deduction"))
        lnft -= parseFloat($(dim).attr("data-length"))
        sqft -= parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width"))
        cuft -= parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width")) * parseFloat($(dim).attr("data-depth"))
      else
        lnft += parseFloat($(dim).attr("data-length"))
        sqft += parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width"))
        cuft += parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width")) * parseFloat($(dim).attr("data-depth"))
    @el.parent().parent().parent().find(".lnft").html(lnft.toFixed(2))
    @el.parent().parent().parent().find(".sqft").html(sqft.toFixed(2))
    @el.parent().parent().parent().find(".cuft").html(cuft.toFixed(2))
    @el.parent().parent().parent().find(".cuyds").html((cuft/27).toFixed(2))

    tlf = 0.0
    tsf = 0.0
    tcy = 0.0
    $("#planitems").children("div").each (i,p) ->
      tcy += parseFloat($(p).find(".cuyds").html())
      if ($(p).hasClass("footing"))
        tlf += parseFloat($(p).find(".lnft").html())
      else
        tsf += parseFloat($(p).find(".sqft").html())
    $("#totallnft").html(tlf.toFixed(2))
    $("#totalsqft").html(tsf.toFixed(2))
    $("#totalcuyds").html(tcy.toFixed(2))
    $("#budget>table>tbody").find("tr[data-units='lnft'],tr[data-units='sqft'],tr[data-units='cuyds']").find(".rate").change()

# ---------------------------------------- ROUTER
class AppRouter extends Backbone.Router
  initialize: ->
    @currentApp = new Plan
      el: $("#planitems")
  routes:
    ""                          : "index"
  index: ->

# ------------------------------------- INIT APP
$ -> # document is ready!

  app = new AppRouter()

  Backbone.history.start
    pushHistory: true

 # $("#attachment").uploadify
#    swf: "/assets/javascripts/uploadify/uploadify.swf"
 #   uploader: "/plans/attachments"
  #  buttonText: "ATTACH FILE"
 #   multi: false
 #   formData:
 #     job: if $("#totals").attr("data-job-id") then $("#totals").attr("data-job-id") else ""
 #     plan: if $("#totals").attr("data-plan-id") then $("#totals").attr("data-plan-id") else ""
 #   onUploadSuccess: (file, data, response) ->
 #     $(data).appendTo("#attachTable")
#
 # $( "#dialog" ).dialog
  #  title: "Edit lineitem"

  $("#duplicatePlan").click ->
   # $("#dialog").dialog "destroy"
    $("#dialog").dialog
      autoOpen: false
      modal: true
      draggable: false
      resizable: false
      width: 450
      title: "Duplicate plan..."
      buttons: [
        text: "apply"
        click: ->
          jsRoutes.controllers.Plans_rd.addPlan().ajax
            data:
              template: $("#totals").attr("data-plan-id")
              customer: $("#newPlanCustomer").val()
              name: $("#newPlanName").val()
            error: (err) ->
              alert("There was an error duplicating the plan! Please refresh the page and try again.")
            success: (data) ->
              window.location.href = "/plans/" + data.id
          $("#dialog").dialog "close"
      ]
    newPlanCustomer = $("<td/>").load jsRoutes.controllers.Jobs_rd.getCustomerSelect().url, ->
      $(this).children("select").attr("id","newPlanCustomer")
      .children("option[value='"+$("#totals").attr("data-customer-id")+"']").attr("selected","selected")
    $("<table/>").html($("<tbody/>")
    .html($("<tr/>").html($("<td/>").html("Customer ")).append(newPlanCustomer))
    .append($("<tr/>").html($("<td/>").html("Name ")).append($("<td/>").html($("<input/>").css("width","100%").attr("id","newPlanName").val("Copy of " + $("#planName").html())))))
    .appendTo($("#dialog").html(""))
    $("#dialog").dialog "open"

  $("body").on "click", "#planName", (e) ->
    that = this
    target = $(e.currentTarget)
    setTimeout ->
      dblclick = parseInt($(that).data('double'), 10)
      if (dblclick > 0)
        $(that).data('double', dblclick-1)
      else
        jsRoutes.controllers.Jobs_rd.getPlanSelect().ajax
          data:
            customer: $("#totals").attr("data-customer-id")
          success: (data) ->
            p = $(data)
            p.append($("<option/>").html("New Plan").val("0")).children("option[value='']").remove()
            p.find("option[value='"+$("#totals").attr("data-plan-id")+"']").attr("selected","selected")
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
                      jsRoutes.controllers.Plans_rd.addPlan().ajax
                        data:
                          customer: $("#totals").attr("data-customer-id")
                          name: $("#newPlanName").val()
                          template: $("#newPlanTemplate").find("option:selected").val()
                        success: (data) ->
                          window.location.href = "/plans/" + data.id
                        error: (err) ->
                          alert("There was an error adding the plan! Please refresh the page and try again.")
                      $("#dialog").dialog "close"
                  ]
                newPlanTemplate = $("<td/>").load jsRoutes.controllers.Jobs_rd.getPlanSelect().url,
                  customer: $("#totals").attr("data-customer-id")
                , ->
                  $(this).children("select").attr("id","newJobPlan")
                $("<table/>").html($("<tbody/>")
                .html($("<tr/>").html($("<td/>").html("Name ")).append($("<td/>").html($("<input/>").attr("id","newPlanName"))))
                .append($("<tr/>").html($("<td/>").html("Template ")).append(newPlanTemplate))).appendTo($("#dialog").html(""))
                $("#dialog").dialog "open"
              else
                window.location.href = "/plans/" + $(this).val()
            p.blur ->
              planName = $("<span/>").attr("id","planName").html($(this).find("option[value='"+$("#totals").attr("data-plan-id")+"']").html())
              $(this).replaceWith(planName)
            target.replaceWith(p)
            p.focus()
          error: (err) ->
            alert("There was an error loading the jobs! Please refresh the page and try again.")
    , 300

  $("body").on "dblclick", "#planName", (e) ->
    $(this).data('double', 2)
    target = $(e.currentTarget)
    oldVal = target.html()
    input = $("<input/>").val(oldVal).blur ->
      context = $(this)
      planName = $("<span/>").attr("id","planName").html(oldVal)
      if (context.val()!=oldVal)
        jsRoutes.controllers.Plans_rd.updatePlan().ajax
          data:
            id: $("#totals").attr("data-plan-id")
            name: context.val()
          success: ->
            planName.html(context.val())
          error: (err) ->
            alert("There was an error updating the job lot! Please refresh the page and try again.")
      $(this).replaceWith(planName)
    target.replaceWith(input)
    input.focus()



  $("#deleteJob").click ->
    if (confirm("Are you sure?"))
      jsRoutes.controllers.Jobs_rd.deleteJob().ajax
        data:
          id: $("#totals").attr("data-job-id")
        success: ->
          window.location.href = ""
        error: (err) ->
          alert("There was an error deleting the job! Please refresh the page and try again.")

  $("#deletePlan").click ->
    if (confirm("Are you sure?"))
      jsRoutes.controllers.Plans_rd.deletePlan().ajax
        data:
          id: $("#totals").attr("data-plan-id")
        success: ->
          window.location.href = ""
        error: (err) ->
          alert("There was an error deleting the plan! Please refresh the page and try again.")
