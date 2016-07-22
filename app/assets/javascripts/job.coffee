# ------------------------------- DROP DOWN MENUS
$(".options dt, .users dt").live "click", (e) ->
    e.preventDefault()
    if $(e.target).parent().hasClass("opened")
        $(e.target).parent().removeClass("opened")
    else
        $(e.target).parent().addClass("opened")
        $(document).one "click", ->
            $(e.target).parent().removeClass("opened")
    false

# ---------------------------------------- JOB
class Job extends Backbone.View
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
    addPlanItem: (e) ->
        target = $(e.currentTarget);
        jsRoutes.controllers.Jobs.addPlanItem().ajax
            data:
                id: target.attr("data-plan-item-id")
            success: (data) ->
                _view = new PlanItem
                    el: $(data).appendTo("#planitems")
#                _view.el.find(".groupName").editInPlace("edit")
                target.remove()
            error: (err) ->
                # TODO: Deal with

# ----------------------------------- PLAN ITEM
class PlanItem extends Backbone.View
    events:
        "click    .addition,.subtraction"        : "newDimension"
    initialize: ->
        @id = @el.attr("data-plan-item")
    newDimension: (e) ->
        e.preventDefault()
        target = $(e.currentTarget)
        jsRoutes.controllers.Jobs.addDimension().ajax
            context: this
            data:
                job: $("#plan").attr("data-job-id")
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
                $("body").append($("#plan").attr("data-job-id"))
                $("body").append(@id)
                $.error("Error: " + JSON.stringify(err))

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
            jsRoutes.controllers.Jobs.deleteDimension(@id).ajax
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
                    $.error("Error: " + err)
    updateDimension: (e) ->
        target = $(e.currentTarget)
        temp = {}
        temp[target.attr('class').split(" ").join("_")] = target.val()
        jsRoutes.controllers.Jobs.updateDimension(@id).ajax
            context: this
            data: temp
            success: ->
                if (!target.hasClass("notes"))
                    @recalculate()
            error: (err) ->
                $.error("Error: " + err)
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
        @el.parent().parent().parent().find(".lnft").val(lnft.toFixed(2))
        @el.parent().parent().parent().find(".sqft").val(sqft.toFixed(2))
        @el.parent().parent().parent().find(".cuft").val(cuft.toFixed(2))
        @el.parent().parent().parent().find(".cuyds").val((cuft/27).toFixed(2))

        tlf = 0.0
        tsf = 0.0
        tcy = 0.0
        $("#planitems").children("div").each (i,p) ->
            tcy += parseFloat($(p).find(".cuyds").val())
            if ($(p).hasClass("footing"))
                tlf += parseFloat($(p).find(".lnft").val())
            else
                tsf += parseFloat($(p).find(".sqft").val())
        $("#totallnft").val(tlf.toFixed(2))
        $("#totalsqft").val(tsf.toFixed(2))
        $("#totalcuyds").val(tcy.toFixed(2))

# ---------------------------------------- ROUTER
class AppRouter extends Backbone.Router
    initialize: ->
        @currentApp = new Job
            el: $("#planitems")
    routes:
        "/"                          : "index"
    index: ->
        # show dashboard
        $("#main").load "/ #main"

# ------------------------------------- INIT APP
$ -> # document is ready!

    app = new AppRouter()

    Backbone.history.start
        pushHistory: true
