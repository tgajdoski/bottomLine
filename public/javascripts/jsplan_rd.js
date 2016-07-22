var AppRouter, Attachments, Dimension, Plan, PlanItem,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };


$("body").on("click",".options dt", function(){
    if ($(this).parent().hasClass("opened"))
    {
        $(this).parent().removeClass("opened");
    }
    else
    {
        $(this).parent().addClass("opened");
        $(document).one("click", function() {
            return $(this).parent().removeClass("opened");
        });
    }
    return false;
});


Plan = (function(_super) {
    __extends(Plan, _super);

    function Plan() {
        return Plan.__super__.constructor.apply(this, arguments);
    }

    Plan.prototype.events = {
        "click    .addPlanItem": "addPlanItem"
    };

    Plan.prototype.initialize = function() {
        $("#addPlanItem").click(this.addPlanItem);
        this.el.children("div").each(function(i, planItem) {
            new PlanItem({
                el: $(planItem)
            });
            return $("table.planitem tr", planItem).each(function(i, dimension) {
                return new Dimension({
                    el: $(dimension)
                });
            });
        });
        return new Attachments({
            el: $("#attachments")
        });
    };

    Plan.prototype.addPlanItem = function(e) {
        var target;
        target = $(e.currentTarget);
        return jsRoutes.controllers.Plans_rd.addPlanItem().ajax({
            data: {
                id: target.attr("data-plan-item-id")
            },
            success: function(data) {
                var _view;
                _view = new PlanItem({
                    el: $(data).appendTo("#planitems")
                });
                return target.remove();
            },
            error: function(err) {
                return alert("There was an error adding the plan item! Please refresh the page and try again.");
            }
        });
    };

    return Plan;

})(Backbone.View);

Attachments = (function(_super) {
    __extends(Attachments, _super);

    function Attachments() {
        return Attachments.__super__.constructor.apply(this, arguments);
    }

    Attachments.prototype.events = {
        "click .deleteAttachment": "deleteAttachment"
    };

    Attachments.prototype.initialize = function() {
        return this.attachment = $("#attachment");
    };

    Attachments.prototype.deleteAttachment = function(e) {
        var id, target;
        e.preventDefault();
        target = $(e.currentTarget);
        id = target.parent().parent().attr("data-attachment-id");
        if (confirm('Are you sure?')) {
            return jsRoutes.controllers.Plans_rd.deleteAttachment(id).ajax({
                success: function() {
                    return target.parent().parent().remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the attachment! Please refresh the page and try again.");
                }
            });
        }
    };

    return Attachments;

})(Backbone.View);

PlanItem = (function(_super) {
    __extends(PlanItem, _super);

    function PlanItem() {
        return PlanItem.__super__.constructor.apply(this, arguments);
    }

    PlanItem.prototype.events = {
        "click    .addition,.subtraction": "newDimension"
    };

    PlanItem.prototype.initialize = function() {
        return this.id = this.el.attr("data-plan-item");
    };

    PlanItem.prototype.newDimension = function(e) {
        var target;
        e.preventDefault();
        target = $(e.currentTarget);
        return jsRoutes.controllers.Plans_rd.addDimension().ajax({
            context: this,
            data: {
                job: $("#totals").attr("data-job-id"),
                plan: $("#totals").attr("data-plan-id"),
                planItem: this.id,
                deduction: target.hasClass("addition") ? "false" : "true"
            },
            success: function(tpl) {
                var _list, _view;
                _list = $("table.planitem tbody", this.el);
                return _view = new Dimension({
                    el: $(tpl).appendTo(_list)
                });
            },
            error: function(err) {
                return alert("There was an error adding the dimension! Please refresh the page and try again.");
            }
        });
    };

    return PlanItem;

})(Backbone.View);

Dimension = (function(_super) {
    __extends(Dimension, _super);

    function Dimension() {
        return Dimension.__super__.constructor.apply(this, arguments);
    }

    Dimension.prototype.events = {
        "click    .deleteDimension": "deleteDimension",
        "change   .notes,.feet,.inches": "updateDimension"
    };

    Dimension.prototype.initialize = function() {
        this.id = this.el.attr("data-dimension-id");
        this.length_feet = this.el.find("td:eq(3) input");
        this.length_inches = this.el.find("td:eq(4) input");
        this.width_feet = this.el.find("td:eq(5) input");
        this.width_inches = this.el.find("td:eq(6) input");
        this.depth_feet = this.el.find("td:eq(7) input");
        this.depth_inches = this.el.find("td:eq(8) input");
        return this.recalculate();
    };

    Dimension.prototype.deleteDimension = function(e) {
        e.preventDefault();
        if (confirm('Are you sure?')) {
            return jsRoutes.controllers.Plans_rd.deleteDimension(this.id).ajax({
                context: this,
                success: function() {
                    this.length_feet.val(0);
                    this.length_inches.val(0);
                    this.width_feet.val(0);
                    this.width_inches.val(0);
                    this.depth_feet.val(0);
                    this.depth_inches.val(0);
                    this.recalculate();
                    return this.el.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the dimension! Please refresh the page and try again.");
                }
            });
        }
    };

    Dimension.prototype.updateDimension = function(e) {
        var target, temp;
        target = $(e.currentTarget);
        temp = {};
        temp[target.attr('class').split(" ").join("_")] = target.val();
        return jsRoutes.controllers.Plans_rd.updateDimension(this.id).ajax({
            context: this,
            data: temp,
            success: function() {
                if (!target.hasClass("notes")) {
                    return this.recalculate();
                }
            },
            error: function(err) {
                return alert("There was an error updating the dimension! Please refresh the page and try again.");
            }
        });
    };

    Dimension.prototype.recalculate = function() {
        var cuft, cuyds, lnft, sqft, tcy, tlf, tsf;
        this.el.attr("data-length", parseFloat(this.length_feet.val()) + parseFloat(this.length_inches.val()) / 12);
        this.el.attr("data-width", parseFloat(this.width_feet.val()) + parseFloat(this.width_inches.val()) / 12);
        this.el.attr("data-depth", parseFloat(this.depth_feet.val()) + parseFloat(this.depth_inches.val()) / 12);
        this.el.find("td:eq(9)").html((parseFloat(this.el.attr("data-length")) * parseFloat(this.el.attr("data-width")) * parseFloat(this.el.attr("data-depth"))).toFixed(2));
        this.el.find("td:eq(10)").html((this.el.find("td:eq(9)").html() / 27).toFixed(2));
        lnft = 0.0;
        sqft = 0.0;
        cuft = 0.0;
        cuyds = 0.0;
        this.el.parent().parent().find(".dimension").each(function(i, dim) {
            if ($(dim).hasClass("deduction")) {
                lnft -= parseFloat($(dim).attr("data-length"));
                sqft -= parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width"));
                return cuft -= parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width")) * parseFloat($(dim).attr("data-depth"));
            } else {
                lnft += parseFloat($(dim).attr("data-length"));
                sqft += parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width"));
                return cuft += parseFloat($(dim).attr("data-length")) * parseFloat($(dim).attr("data-width")) * parseFloat($(dim).attr("data-depth"));
            }
        });
        this.el.parent().parent().parent().find(".lnft").html(lnft.toFixed(2));
        this.el.parent().parent().parent().find(".sqft").html(sqft.toFixed(2));
        this.el.parent().parent().parent().find(".cuft").html(cuft.toFixed(2));
        this.el.parent().parent().parent().find(".cuyds").html((cuft / 27).toFixed(2));
        tlf = 0.0;
        tsf = 0.0;
        tcy = 0.0;
        $("#planitems").children("div").each(function(i, p) {
            tcy += parseFloat($(p).find(".cuyds").html());
            if ($(p).hasClass("footing")) {
                return tlf += parseFloat($(p).find(".lnft").html());
            } else {
                return tsf += parseFloat($(p).find(".sqft").html());
            }
        });
        $("#totallnft").html(tlf.toFixed(2));
        $("#totalsqft").html(tsf.toFixed(2));
        $("#totalcuyds").html(tcy.toFixed(2));
        return $("#budget>table>tbody").find("tr[data-units='lnft'],tr[data-units='sqft'],tr[data-units='cuyds']").find(".rate").change();
    };

    return Dimension;

})(Backbone.View);

AppRouter = (function(_super) {
    __extends(AppRouter, _super);

    function AppRouter() {
        return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.initialize = function() {
        return this.currentApp = new Plan({
            el: $("#planitems")
        });
    };

    AppRouter.prototype.routes = {
        "": "index"
    };

    AppRouter.prototype.index = function() {};

    return AppRouter;

})(Backbone.Router);

$(function() {
    var app;
    app = new AppRouter();
    Backbone.history.start({
        pushHistory: true
    });
    $("#attachment").uploadify({
        swf: "/assets/javascripts/uploadify/uploadify.swf",
        uploader: "/plans/attachments",
        buttonText: "ATTACH FILE",
        multi: false,
        formData: {
            job: $("#totals").attr("data-job-id") ? $("#totals").attr("data-job-id") : "",
            plan: $("#totals").attr("data-plan-id") ? $("#totals").attr("data-plan-id") : ""
        },
        onUploadSuccess: function(file, data, response) {
            return $(data).appendTo("#attachTable");
        }
    });
    $("#dialog").dialog({
        title: "Edit lineitem"
    });
    $("#duplicatePlan").click(function() {
        var newPlanCustomer;
        $("#dialog").dialog("destroy");
        $("#dialog").dialog({
            autoOpen: false,
            modal: true,
            draggable: false,
            resizable: false,
            width: 450,
            title: "Duplicate plan...",
            buttons: [
                {
                    text: "apply",
                    click: function() {
                        jsRoutes.controllers.Plans_rd.addPlan().ajax({
                            data: {
                                template: $("#totals").attr("data-plan-id"),
                                customer: $("#newPlanCustomer").val(),
                                name: $("#newPlanName").val()
                            },
                            error: function(err) {
                                return alert("There was an error duplicating the plan! Please refresh the page and try again.");
                            },
                            success: function(data) {
                                return window.location.href = "/plans/" + data.id;
                            }
                        });
                        return $("#dialog").dialog("close");
                    }
                }
            ]
        });
        newPlanCustomer = $("<td/>").load(jsRoutes.controllers.Jobs.getCustomerSelect().url, function() {
            return $(this).children("select").attr("id", "newPlanCustomer").children("option[value='" + $("#totals").attr("data-customer-id") + "']").attr("selected", "selected");
        });
        $("<table/>").html($("<tbody/>").html($("<tr/>").html($("<td/>").html("Customer ")).append(newPlanCustomer)).append($("<tr/>").html($("<td/>").html("Name ")).append($("<td/>").html($("<input/>").css("width", "100%").attr("id", "newPlanName").val("Copy of " + $("#planName").html()))))).appendTo($("#dialog").html(""));
        return $("#dialog").dialog("open");
    });
    $("#planName").on("click", function(e) {
        var target, that;
        that = this;
        target = $(e.currentTarget);
        return setTimeout(function() {
            var dblclick;
            dblclick = parseInt($(that).data('double'), 10);
            if (dblclick > 0) {
                return $(that).data('double', dblclick - 1);
            } else {
                return jsRoutes.controllers.Jobs.getPlanSelect().ajax({
                    data: {
                        customer: $("#totals").attr("data-customer-id")
                    },
                    success: function(data) {
                        var p;
                        p = $(data);
                        p.append($("<option/>").html("New Plan").val("0")).children("option[value='']").remove();
                        p.find("option[value='" + $("#totals").attr("data-plan-id") + "']").attr("selected", "selected");
                        p.change(function() {
                            var newPlanTemplate;
                            if ($(this).val() === "0") {
                                $("#dialog").dialog("destroy");
                                $("#dialog").dialog({
                                    autoOpen: false,
                                    modal: true,
                                    draggable: false,
                                    resizable: false,
                                    width: 450,
                                    title: "Add a Plan",
                                    buttons: [
                                        {
                                            text: "Add",
                                            click: function() {
                                                jsRoutes.controllers.Plans.addPlan().ajax({
                                                    data: {
                                                        customer: $("#totals").attr("data-customer-id"),
                                                        name: $("#newPlanName").val(),
                                                        template: $("#newPlanTemplate").find("option:selected").val()
                                                    },
                                                    success: function(data) {
                                                        return window.location.href = "/plans/" + data.id;
                                                    },
                                                    error: function(err) {
                                                        return alert("There was an error adding the plan! Please refresh the page and try again.");
                                                    }
                                                });
                                                return $("#dialog").dialog("close");
                                            }
                                        }
                                    ]
                                });
                                newPlanTemplate = $("<td/>").load(jsRoutes.controllers.Jobs.getPlanSelect().url, {
                                    customer: $("#totals").attr("data-customer-id")
                                }, function() {
                                    return $(this).children("select").attr("id", "newJobPlan");
                                });
                                $("<table/>").html($("<tbody/>").html($("<tr/>").html($("<td/>").html("Name ")).append($("<td/>").html($("<input/>").attr("id", "newPlanName")))).append($("<tr/>").html($("<td/>").html("Template ")).append(newPlanTemplate))).appendTo($("#dialog").html(""));
                                return $("#dialog").dialog("open");
                            } else {
                                return window.location.href = "/plans/" + $(this).val();
                            }
                        });
                        p.blur(function() {
                            var planName;
                            planName = $("<span/>").attr("id", "planName").html($(this).find("option[value='" + $("#totals").attr("data-plan-id") + "']").html());
                            return $(this).replaceWith(planName);
                        });
                        target.replaceWith(p);
                        return p.focus();
                    },
                    error: function(err) {
                        return alert("There was an error loading the jobs! Please refresh the page and try again.");
                    }
                });
            }
        }, 300);
    });
    return $("#planName").on("dblclick", function(e) {
        var input, oldVal, target;
        $(this).data('double', 2);
        target = $(e.currentTarget);
        oldVal = target.html();
        input = $("<input/>").val(oldVal).blur(function() {
            var context, planName;
            context = $(this);
            planName = $("<span/>").attr("id", "planName").html(oldVal);
            if (context.val() !== oldVal) {
                jsRoutes.controllers.Plans_rd.updatePlan().ajax({
                    data: {
                        id: $("#totals").attr("data-plan-id"),
                        name: context.val()
                    },
                    success: function() {
                        return planName.html(context.val());
                    },
                    error: function(err) {
                        return alert("There was an error updating the job lot! Please refresh the page and try again.");
                    }
                });
            }
            return $(this).replaceWith(planName);
        });
        target.replaceWith(input);
        return input.focus();
    });
});
