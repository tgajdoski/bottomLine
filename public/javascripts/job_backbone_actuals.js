

$(document).ready(function() {
    $('body').on('focus',".jobstartdate", function(){
        $(this).datepicker({ dateFormat: 'yy-mm-dd' });
     //   $(this).datepicker("option", "dateFormat",'yy-mm-dd' );
    });
});



function goToByScroll(id){
    // Remove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    $('html,body').animate({
            scrollTop: $("#"+id).offset().top},
        'slow');
}

function refreshmeactuals(){

    var jobidno = $("#totals").attr("data-job-id");
    jsRoutes.controllers.Jobs_rd.reorderLineItemActualRefresh().ajax(
        {
            async: false,
            type: "GET",
            data: {
                jobid: jobidno
            },
            success: function(datasub) {
                $("#actual").empty().append(datasub);

                (function() {
                    var ActualLineitem, ActualLineitems, Task;
                    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
                        for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
                        function ctor() { this.constructor = child; }
                        ctor.prototype = parent.prototype;
                        child.prototype = new ctor;
                        child.__super__ = parent.prototype;
                        return child;
                    };
                    ActualLineitems = (function() {
                        __extends(ActualLineitems, Backbone.View);
                        function ActualLineitems() {
                            ActualLineitems.__super__.constructor.apply(this, arguments);
                        }
                        ActualLineitems.prototype.events = {
                         /*   "click    .addActualLineitem": "addActualLineitem",*/
                            "click    .addTask": "addTask",
                            "click    .completeTask": "completeTask"
                        };
                        ActualLineitems.prototype.initialize = function() {
                            var actual, cost, fprofit, left, mprofit, sale, total;
                            this.el.find(".actualLineitem").each(function(i, lineitem) {
                                return new ActualLineitem({
                                    el: $(lineitem)
                                });
                            });
                            this.el.find(".tasks").each(function(i, tasks) {
                                return $(tasks).children("tr.calTask").each(function(j, t) {
                                    return new Task({
                                        el: $(t)
                                    });
                                });
                            });
                            cost = 0;
                            actual = 0;
                            left = 0;
                            this.el.find(".noClass").each(function(i, t) {
                                var used;
                                $("#actual").find("." + $(t).attr("class").split(" ")[1]).each(function(j, total) {
                                    var itemTypeId, taskBudgetTotal, taskTypeId;
                                    if ($(total).hasClass("hasClass")) {
                                        taskTypeId = $(total).parent().attr("id").split("-")[0];
                                        itemTypeId = $(total).parent().attr("id").split("-")[1];
                                        taskBudgetTotal = 0;
                                        $("#budgetitems td[data-item-type-id='" + itemTypeId + "']").each(function(k, lineitem) {
                                            return taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task" + taskTypeId + "-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"));
                                        });
                                        $(total).html(taskBudgetTotal.toFixed(2));
                                        return $(total).parent().find(".left").html((parseFloat($(total).html()) - parseFloat($(total).parent().find(".used").html())).toFixed(2));
                                    }
                                });
                                cost += parseFloat($(t).html());
                                used = 0;
                                $(".task ." + $(t).attr("class").split(" ")[1]).parent().find(".used").each(function(j, u) {
                                    return used += parseFloat($(u).html());
                                });
                                actual += used;
                                left += parseFloat($(t).html()) - used;
                                $(t).parent().find(".used").html(used.toFixed(2));
                                return $(t).parent().find(".left").html((parseFloat($(t).html()) - used).toFixed(2));
                            });
                            $("#actual .cost").html(cost.toFixed(2));
                            $("#actual .actualcost").html(actual.toFixed(2));
                            $("#actual .diffcost").html(left.toFixed(2));
                            sale = parseFloat($("#totals").attr("data-sale"));
                            total = parseFloat($("#totals").attr("data-cost"));
                            $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
                            $("#actual .markup").html((total / sale).toFixed(2));
                            $("#actual .actualmarkup").html((actual / sale).toFixed(2));
                            mprofit = ((sale-actual)>0)?(left>0)?((sale-actual)*.1):((sale-actual)*.1):0;
                            fprofit = ((sale-actual)>0)?(left>0)?((sale-actual)*.9):((sale-actual)*.9):(sale-actual);
                            $("#managerprofit").html(mprofit.toFixed(2));
                           // return; $("#ffiprofit").html(fprofit.toFixed(2));
                            return $("#ffiprofit").html((sale-total-mprofit).toFixed(2))
                        };
                      /*  ActualLineitems.prototype.addActualLineitem = function(e) {
                            var target;
                            target = $(e.currentTarget);
                            return jsRoutes.controllers.Lineitems_rd.addActualNewLineitem().ajax({
                                data: {
                                    id: $("#totals").attr("data-job-id"),
                                    taskType: target.attr("data-task-type-id"),
                                    itemType: target.attr("data-item-type-id"),
                                    task: target.parent().parent().parent().find("tr:eq(0)>td:eq(0)>table>tbody>tr:first").attr("data-task-id")
                                },
                                success: function(data) {
                                    var _view;
                                    return _view = new ActualLineitem({
                                        el: $(data).appendTo($("tbody[data-budget-item-id='" + target.attr("data-budget-item-id") + "']"))
                                    });
                                },
                                error: function(err) {
                                    return alert("There was an error adding the job line item! Please refresh the page and try again.");
                                }
                            });
                        };*/
                        ActualLineitems.prototype.addTask = function(e) {
                            var target;
                            target = $(e.currentTarget);
                            return jsRoutes.controllers.Tasks_rd.addTask().ajax({
                                data: {
                                    id: $("#totals").attr("data-job-id"),
                                    taskType: target.attr("data-task-type-id")
                                },
                                success: function(data) {
                                    var _view;
                                    return _view = new Task({
                                        el: $(data).appendTo(target.parent().parent().find(".tasks"))
                                    });
                                },
                                error: function(err) {
                                    return alert("There was an error adding the task! Please refresh the page and try again.");
                                }
                            });
                        };
                        ActualLineitems.prototype.completeTask = function(e) {
                            var target;
                            target = $(e.currentTarget);
                            return target.parent().parent().find(".calTask").each(function(i, t) {
                                return jsRoutes.controllers.Tasks_rd.updateTask($(t).attr("data-task-id")).ajax({
                                    data: {
                                        completed: target.is(":checked")
                                    },
                                    error: function(err) {
                                        return alert("There was an error completing the task! Please refresh the page and try again.");
                                    }
                                });
                            });
                        };
                        return ActualLineitems;
                    })();
                    Task = (function() {
                        __extends(Task, Backbone.View);
                        function Task() {
                            Task.__super__.constructor.apply(this, arguments);
                        }
                        Task.prototype.events = {
                            "click    .editTask": "editTask",
                            "click    .deleteTask": "deleteTask"
                        };
                        Task.prototype.initialize = function() {
                            var task;
                            task = this.gup("task");
                            if (task === this.el.attr("data-task-id")) {
                                return this.el.find(".editTasks").click();
                            }
                        };
                        Task.prototype.gup = function(name) {
                            var regex, regexS, results;
                            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                            regexS = "[\\?&]" + name + "=([^&#]*)";
                            regex = new RegExp(regexS);
                            results = regex.exec(window.location.href);
                            if (results === null) {
                                return "";
                            } else {
                                return results[1];
                            }
                        };
                        Task.prototype.editTask = function(e) {
                            var altDate, context, crew, crewRow, date, dateParts, defaultDate, i, managerFunction, managerRow, notes, order, orderRow, table;
                            context = this;
                            crew = $('<select/>').css('width', '50px').change(function() {
                                return context.el.attr("data-crew", $(this).val());
                            });
                            for (i = 1; i <= 20; i++) {
                                crew.append($('<option/>').attr({
                                    value: i
                                }).html(i));
                            }
                            crew.find("option[value='" + this.el.attr("data-crew") + "']").attr("selected", "selected");
                            order = $('<select/>').css('width', '50px').change(function() {
                                return context.el.attr("data-card-order", $(this).val());
                            });
                            for (i = 1; i <= 10; i++) {
                                order.append($('<option/>').attr({
                                    value: i
                                }).html(i));
                            }
                            order.find("option[value='" + this.el.attr("data-card-order") + "']").attr("selected", "selected");
                            dateParts = this.el.attr("data-date").split("-");
                            defaultDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                            altDate = $("<input/>").attr({
                                type: "hidden",
                                id: "altDate"
                            });
                            date = $("<div/>").datepicker({
                                altField: "#altDate",
                                altFormat: "yy-mm-dd",
                                defaultDate: defaultDate,
                                onSelect: function(d, i) {
                                    context.el.attr("data-date", $("#altDate").val());
                                    return context.el.find("td:eq(1)").html($("#altDate").val());
                                }
                            });
                            notes = $("<textarea>" + this.el.attr("data-notes") + "</textarea>").css("width", "251px").change(function() {
                                return context.el.attr("data-notes", $(this).val());
                            });
                            managerFunction = function() {
                                $(this).find("option[value='" + context.el.attr("data-manager-id") + "']").attr("selected", "selected");
                                return $(this).find("select").change(function() {
                                    return context.el.attr("data-manager-id", $(this).val());
                                });
                            };
                            managerRow = $("<tr/>").append("<td>Crew Leader </td>").append($("<td/>").load(jsRoutes.controllers.Home_rd.getCrewLeader().url, managerFunction));
                            crewRow = $("<tr/>").append("<td>Box</td>");
                            $("<td/>").append(crew).appendTo(crewRow);
                            orderRow = $("<tr/>").append("<td>Order</td>");
                            $("<td/>").append(order).appendTo(orderRow);
                            table = $("<table/>");
                            $("<tbody/>").append(managerRow).append(crewRow).append(orderRow).appendTo(table);
                            $("#dialog").dialog({
                                autoOpen: false,
                                modal: true,
                                draggable: false,
                                resizable: false,
                                width: 450,
                                title: "Update Task"
                            });
                            return $("#dialog").html("").append(table).append(date).append(altDate).append("Notes<br/>").append(notes).on("dialogclose", function(e, ui) {
                                jsRoutes.controllers.Tasks_rd.updateTask(context.el.attr("data-task-id")).ajax({
                                    data: {
                                        crew: context.el.attr("data-crew"),
                                        cardOrder: context.el.attr("data-card-order"),
                                        date: context.el.attr("data-date"),
                                        notes: context.el.attr("data-notes"),
                                        manager: context.el.attr("data-manager-id")
                                    },
                                    success: function(data) {
                                        var task, _i, _len, _results;
                                        _results = [];
                                        for (_i = 0, _len = data.length; _i < _len; _i++) {
                                            task = data[_i];
                                            _results.push($("tr[data-task-id='" + task.id + "']").attr("data-card-order", task.cardOrder));
                                        }
                                        return _results;
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                    }
                                });
                                return $("#dialog").unbind("dialogclose");
                            }).dialog("open");
                        };
                        Task.prototype.deleteTask = function(e) {
                            var context;
                            context = this;
                            e.preventDefault();
                            if (confirm('Assigned lineitems for that task will be deleted. Are you sure? ')) {
                                return jsRoutes.controllers.Tasks_rd.deleteTask(this.el.attr("data-task-id")).ajax({
                                    context: this,
                                    success: function(data) {
                                        var task, _i, _len, _results;
                                        // tuka izbrisi lineitems od toj task i izbrisi assigns za toj task
                                        // pa prodolzi go...
                                        context.el.remove();
                                        _results = [];
                                        for (_i = 0, _len = data.length; _i < _len; _i++) {
                                            task = data[_i];
                                            _results.push($("tr[data-task-id='" + task.id + "']").attr("data-card-order", task.cardOrder));
                                        }
                                        return _results;
                                    },
                                    error: function(err) {
                                        return alert("There was an error deleting the task! Please refresh the page and try again.");
                                    }
                                });
                            }
                        };
                        return Task;
                    })();
                    ActualLineitem = (function() {
                        __extends(ActualLineitem, Backbone.View);
                        function ActualLineitem() {
                            ActualLineitem.__super__.constructor.apply(this, arguments);
                        }
                        ActualLineitem.prototype.events = {
                            "click    .deleteLineitemactual": "deleteActualLineitem",
                            "focus    .vendor>input": "loadVendorSelect",
                            "focus    .item>input": "loadItemSelect",
                            "click    .notes": "editNotes",
                            "change   .quantity,.rate": "updateActualLineitem",
                            "click    .invoice": "updateActualLineitem",
                            "dblclick .purchaseorder": "updateActualLineitem"
                        };
                        ActualLineitem.prototype.initialize = function() {
                            this.id = this.el.attr("data-lineitem-id");
                            this.vendor = this.el.find("td:eq(2)");
                            this.item = this.el.find("td:eq(3)");
                            this.quantity = this.el.find("td:eq(4) input");
                            this.rate = this.el.find("td:eq(6) input");
                            this.units = this.el.find("td:eq(8)");
                            this.cost = this.el.find("td:eq(9)");
                            return this.recalculate();
                        };
                        ActualLineitem.prototype.deleteActualLineitem = function(e) {
                            e.preventDefault();
                            if (confirm('Are you sure?')) {
                                return jsRoutes.controllers.Lineitems_rd.deleteLineitem(this.id).ajax({
                                    context: this,
                                    success: function() {
                                        this.quantity.val(0);
                                        this.rate.val(0);
                                        this.recalculate();
                                        return this.el.remove();
                                    },
                                    error: function(err) {
                                        return alert("There was an error deleting the job line item! Please refresh the page and try again.");
                                    }
                                });
                            }
                        };
                        ActualLineitem.prototype.loadVendorSelect = function(e) {
                            var context, target, v;
                            target = $(e.currentTarget);
                            v = $();
                            context = this;
                            jsRoutes.controllers.Lineitems_rd.getVendorSelect().ajax({
                                context: this,
                                async: false,
                                data: {
                                    id: $("#totals").attr("data-market-id"),
                                    itemType: context.item.attr("data-item-type-id")
                                },
                                success: function(data) {
                                    v = $(data);
                                    v.find("option[value='" + context.vendor.attr("data-vendor-id") + "']").attr("selected", "selected");
                                    v.change(function() {
                                        context.vendor.attr("data-vendor-id", $(this).find("option:selected").val());
                                        context.item.attr("data-item-id", "");
                                        return context.item.children("input").val("");
                                    });
                                    return v.blur(function() {
                                        var input;
                                        input = $("<input/>").css("text-align", "left").val($(this).find("option:selected").html());
                                        return $(this).replaceWith(input);
                                    });
                                },
                                error: function(err) {
                                    return alert("There was an error loading the vendors! Please refresh the page and try again.");
                                }
                            });
                            target.replaceWith(v);
                            return v.focus();
                        };
                        ActualLineitem.prototype.loadItemSelect = function(e) {
                            var context, i, target;
                            target = $(e.currentTarget);
                            i = $();
                            context = this;
                            jsRoutes.controllers.Lineitems_rd.getItemSelect().ajax({
                                context: this,
                                async: false,
                                data: {
                                    id: context.vendor.attr("data-vendor-id"),
                                    itemType: this.item.attr("data-item-type-id")
                                },
                                success: function(data) {
                                    i = $(data);
                                    i.find("option[value='" + context.item.attr("data-item-id") + "']").attr("selected", "selected");
                                    i.change(function() {
                                        var vendorItem;
                                        vendorItem = $(this).find("option:selected");
                                        context.item.attr("data-item-id", vendorItem.val());
                                        context.item.children("input").val(vendorItem.html());
                                        context.el.attr("data-rate", vendorItem.attr("data-default-rate"));
                                        context.rate.val(parseFloat(vendorItem.attr("data-default-rate")).toFixed(2));
                                        return context.rate.change();
                                    });
                                    return i.blur(function() {
                                        var input;
                                        input = $("<input/>").css("text-align", "left").val($(this).find("option:selected").html());
                                        return $(this).replaceWith(input);
                                    });
                                },
                                error: function(err) {
                                    return alert("There was an error loading the items! Please refresh the page and try again.");
                                }
                            });
                            target.replaceWith(i);
                            return i.focus();
                        };
                        ActualLineitem.prototype.editNotes = function() {
                            var context, notes, task;
                            context = this;
                            notes = $("<textarea>" + this.el.attr("data-notes") + "</textarea>").css("width", "251px").change(function() {
                                context.el.attr("data-notes", $(this).val());
                                if ($(this).val() !== "") {
                                    context.el.find("td:eq(1)>span").css("color", "#F00");
                                } else {
                                    context.el.find("td:eq(1)>span").css("color", "#000");
                                }
                                return context.rate.change();
                            });
                            task = $("<select/>").html($("<option value=\"\"/>")).change(function() {
                                context.el.attr("data-task-id", $(this).val());
                                if ($(this).val() !== "") {
                                    context.el.find("td:eq(1)>span").html($(this).find("option:selected").html().split("-").slice(1).join("-"));
                                } else {
                                    context.el.find("td:eq(1)>span").html("NOTE");
                                }
                                return context.rate.change();
                            });
                            this.el.parent().parent().parent().parent().parent().find("tr:eq(0)>td:eq(0)>table>tbody>tr.calTask").each(function(i, l) {
                                return task.append($("<option value=\"" + $(l).attr("data-task-id") + "\">" + $(l).find("td:eq(1)").html() + "</option>"));
                            });
                            task.find("option[value='" + this.el.attr("data-task-id") + "']").attr("selected", "selected");
                            $("#dialog").dialog({
                                autoOpen: false,
                                modal: true,
                                draggable: false,
                                resizable: false,
                                width: 450,
                                title: "Update Line Item"
                            });
                            return $("#dialog").html("").append("Notes<br/>").append(notes).append("<br/>Task<br/>").append(task).dialog("open");
                        };
                        // ni treba da se updatira covekot FM na kogo e assigniran
                        ActualLineitem.prototype.updateActualLineitem = function(e) {
                            var po, target;
                            target = $(e.currentTarget);
                            po = this.el.find(".purchaseorder").html();
                            if (target.hasClass("invoice") || target.hasClass("purchaseorder")) {
                                po = prompt("Please enter a Purchase Order #, or just click OK to add line automatically.", "...");
                            }
                            return jsRoutes.controllers.Lineitems_rd.updateNewLineitemNeww(this.id).ajax({
                                context: this,
                                data: {
                                    vendor: this.vendor.attr("data-vendor-id"),
                                    item: this.item.attr("data-item-id"),
                                    units: this.units.html(),
                                    quantity: this.quantity.val(),
                                    rate: this.rate.val(),
                                    saleprice: parseFloat(this.quantity.val()) * parseFloat(this.rate.val()),
                                    task: this.el.attr("data-task-id"),
                                    notes: this.el.attr("data-notes"),
                                    po: po
                                },
                                success: function() {
                                    if (target.hasClass("invoice") || target.hasClass("purchaseorder")) {
                                        return target.replaceWith($("<span/>").attr("class", "purchaseorder").html(po));
                                    } else {
                                        return this.recalculate();
                                    }
                                },
                                error: function(err) {
                                    return alert("There was an error updating the job line item! Please refresh the page and try again.");
                                }
                            });
                        };
                        ActualLineitem.prototype.recalculate = function() {
                            var actual, cost, fprofit, left, mprofit, sale, taskitem, total;
                            this.el.attr("data-cost", parseFloat(this.quantity.val()) * parseFloat(this.rate.val()));
                            this.cost.html(parseFloat(this.el.attr("data-cost")).toFixed(2));
                            total = 0;
                            this.el.parent().children("tr").each(function(i, row) {
                                return total += parseFloat($(row).attr("data-cost"));
                            });
                            taskitem = $("#" + this.el.parent().attr("data-task-type-id") + "-" + this.el.find(".item").attr("data-item-type-id"));
                            taskitem.find(".used").html(total.toFixed(2));
                            taskitem.find(".left").html((total - parseFloat(taskitem.find(".hasClass").html())).toFixed(2));
                            cost = 0;
                            actual = 0;
                            left = 0;
                            $("#actual .noClass").each(function(i, t) {
                                var used;
                                $("#actual").find("." + $(t).attr("class").split(" ")[1]).each(function(j, total) {
                                    var itemTypeId, taskBudgetTotal, taskTypeId;
                                    if ($(total).hasClass("hasClass")) {
                                        taskTypeId = $(total).parent().attr("id").split("-")[0];
                                        itemTypeId = $(total).parent().attr("id").split("-")[1];
                                        taskBudgetTotal = 0;
                                        $("#budgetitems td[data-item-type-id='" + itemTypeId + "']").each(function(k, lineitem) {
                                            return taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task" + taskTypeId + "-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"));
                                        });
                                        $(total).html(taskBudgetTotal.toFixed(2));
                                        return $(total).parent().find(".left").html((parseFloat($(total).html()) - parseFloat($(total).parent().find(".used").html())).toFixed(2));
                                    }
                                });
                                cost += parseFloat($(t).html());
                                used = 0;
                                $(".task ." + $(t).attr("class").split(" ")[1]).parent().find(".used").each(function(j, u) {
                                    return used += parseFloat($(u).html());
                                });
                                actual += used;
                                left += parseFloat($(t).html()) - used;
                                $(t).parent().find(".used").html(used.toFixed(2));
                                return $(t).parent().find(".left").html((parseFloat($(t).html()) - used).toFixed(2));
                            });
                            $("#actual .cost").html(cost.toFixed(2));
                            $("#actual .actualcost").html(actual.toFixed(2));
                            $("#actual .diffcost").html(left.toFixed(2));
                            sale = parseFloat($("#totals").attr("data-sale"));
                            total = parseFloat($("#totals").attr("data-cost"));
                            $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
                            $("#actual .markup").html((total / sale).toFixed(2));
                            $("#actual .actualmarkup").html((actual / sale).toFixed(2));
                            mprofit = ((sale-total)>0)?(left>0)?((sale-total)*.1):((sale-total)*.1):0;
                            fprofit = ((sale-total)>0)?(left>0)?((sale-total)*.9):((sale-total)*.9):(sale-total);
                            $("#managerprofit").html(mprofit.toFixed(2));
                          //  return $("#ffiprofit").html(fprofit.toFixed(2));
                            return $("#ffiprofit").html((sale-total-mprofit).toFixed(2))
                        };
                        return ActualLineitem;
                    })();
                    $(function() {
                        var lineitems;
                        lineitems = new ActualLineitems({
                            el: $("#actual")
                        });
                        $("body").on("change", "#jobCategory", function(e) {
                            var dateParts, defaultDate, task3;
                            task3 = $("tr[data-task-type-id='3']");
                            if (task3.length > 0) {
                                dateParts = task3.filter(":last").attr("data-date").split("-");
                                defaultDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                            } else {
                                defaultDate = new Date();
                            }
                            $("#jobDate").val($.datepicker.formatDate('yy-mm-dd', defaultDate));
                            return jsRoutes.controllers.Jobs_rd.updateJob().ajax({
                                data: {
                                    id: $("#totals").attr("data-job-id"),
                                    category: $("#jobCategory").val(),
                                    date: $("#jobDate").val()
                                },
                                error: function(err) {
                                    return alert("There was an error updating the job category! Please refresh the page and try again.");
                                }
                            });
                        });
                        $("body").on("click", "#jobCategory", function(e) {
                            var target, that;
                            that = this;
                            target = $(e.currentTarget);
                            return setTimeout(function() {
                                var dblclick;
                                dblclick = parseInt($(that).data('double'), 10);
                                if (dblclick > 0) {
                                    return $(that).data('double', dblclick - 1);
                                }
                            }, 300);
                        });
                        $("body").on("dblclick", "#jobCategory", function(e) {
                            var dateParts, defaultDate, input, select, target;
                            $(this).data('double', 2);
                            target = $(e.currentTarget);
                            select = target.clone();
                            select.find("option[value='" + $("#jobCategory").val() + "']").attr("selected", "selected");
                            dateParts = $("#jobDate").val().split("-");
                            defaultDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                            input = $("<input/>").val($("#jobDate").val()).datepicker({
                                altField: "#jobDate",
                                altFormat: "yy-mm-dd",
                                defaultDate: defaultDate,
                                onClose: function(d, i) {
                                    $(this).datepicker("destroy");
                                    return $(this).replaceWith(select);
                                },
                                onSelect: function(d, i) {
                                    $(this).datepicker("destroy");
                                    $(this).replaceWith(select);
                                    return jsRoutes.controllers.Jobs_rd.updateJob().ajax({
                                        data: {
                                            id: $("#totals").attr("data-job-id"),
                                            date: $("#jobDate").val()
                                        }
                                    });
                                }
                            });
                            target.replaceWith(input);
                            return input.datepicker("show");
                        });
                        $("#jobNotes").change(function() {
                            return jsRoutes.controllers.Jobs_rd.updateJob().ajax({
                                data: {
                                    id: $("#totals").attr("data-job-id"),
                                    notes: $("#jobNotes").val()
                                },
                                error: function(err) {
                                    return alert("There was an error updating the job notes! Please refresh the page and try again.");
                                }
                            });
                        });
                        $("#copyToPlans").click(function() {
                            $("#dialog").dialog({
                                autoOpen: false,
                                modal: true,
                                draggable: false,
                                resizable: false,
                                width: 450,
                                title: "Save as plan...",
                                buttons: [
                                    {
                                        text: "save",
                                        click: function() {
                                            jsRoutes.controllers.Jobs_rd.copyToPlans().ajax({
                                                data: {
                                                    id: $("#totals").attr("data-job-id"),
                                                    name: $("#newPlanName").val()
                                                },
                                                error: function(err) {
                                                    return alert("There was an error copying the job to plans! Please refresh the page and try again.");
                                                }
                                            });
                                            return $("#dialog").dialog("close");
                                        }
                                    }
                                ]
                            });
                            return $("#dialog").html("Name ").append($("<input/>").attr("id", "newPlanName")).dialog("open");
                        });
                        $("#applyTemplate").click(function() {
                            $("#dialog").dialog({
                                autoOpen: false,
                                modal: true,
                                draggable: false,
                                resizable: false,
                                width: 450,
                                title: "Apply template...",
                                buttons: [
                                    {
                                        text: "apply",
                                        click: function() {
                                            jsRoutes.controllers.Jobs_rd.applyTemplateNewJob().ajax({
                                                data: {
                                                    id: $("#totals").attr("data-job-id"),
                                                    template: $("#planSelect").val()
                                                },
                                                error: function(err) {
                                                    return alert("There was an error applying the template! Please refresh the page and try again.");
                                                },
                                                success: function() {
                                                    return location.reload();
                                                }
                                            });
                                            return $("#dialog").dialog("close");
                                        }
                                    }
                                ]
                            });
                            return $("#dialog").html("").load(jsRoutes.controllers.Jobs_rd.getPlanSelect().url, {
                                customer: $("#totals").attr("data-customer-id")
                            }).dialog("open");
                        });
                        $("#jobMarket").dblclick(function(e) {
                            var oldVal, target;
                            target = $(e.currentTarget);
                            oldVal = target.html();
                            return jsRoutes.controllers.Jobs_rd.getMarketSelect().ajax({
                                success: function(data) {
                                    var m;
                                    m = $(data).children("option[value='']").remove().end();
                                    m.find("option[value='" + $("#totals").attr("data-market-id") + "']").attr("selected", "selected");
                                    m.change(function() {
                                        var context, jobMarket;
                                        context = $(this);
                                        jobMarket = $("<span/>").attr("id", "jobMarket").html(oldVal);
                                        jsRoutes.controllers.Jobs_rd.updateJob().ajax({
                                            data: {
                                                id: $("#totals").attr("data-job-id"),
                                                market: context.val()
                                            },
                                            success: function(data) {
                                                jobMarket.html(context.find("option:selected").html());
                                                return $("#totals").attr("data-market-id", context.val());
                                            },
                                            error: function(err) {
                                                return alert("There was an error updating the job market! Please refresh the page and try again.");
                                            }
                                        });
                                        return $(this).replaceWith(jobMarket);
                                    });
                                    m.blur(function() {
                                        var jobMarket;
                                        jobMarket = $("<span/>").attr("id", "jobMarket").html(oldVal);
                                        return $(this).replaceWith(jobMarket);
                                    });
                                    target.replaceWith(m);
                                    return m.focus();
                                },
                                error: function(err) {
                                    return alert("There was an error loading the customers! Please refresh the page and try again.");
                                }
                            });
                        });
                        $("body").on("click", "#jobCustomer", function(e) {
                            var oldVal, target;
                            target = $(e.currentTarget);
                            oldVal = target.html();
                            return jsRoutes.controllers.Jobs_rd.getCustomerSelect().ajax({
                                success: function(data) {
                                    var c;
                                    c = $(data).children("option[value='']").remove().end();
                                    c.find("option[value='" + $("#totals").attr("data-customer-id") + "']").attr("selected", "selected");
                                    c.change(function() {
                                        var jobCustomer;
                                        jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
                                            data: {
                                                customer: $(this).val()
                                            },
                                            success: function(data) {
                                                if (data.length) {
                                                    return window.location.href = "/jobs/" + data[0].id;
                                                }
                                            },
                                            error: function(err) {
                                                return alert("There was an error loading the jobs! Please refresh the page and try again.");
                                            }
                                        });
                                        jobCustomer = $("<span/>").attr("id", "jobCustomer").html(oldVal);
                                        return $(this).replaceWith(jobCustomer);
                                    });
                                    c.blur(function() {
                                        var jobCustomer;
                                        jobCustomer = $("<span/>").attr("id", "jobCustomer").html(oldVal);
                                        return $(this).replaceWith(jobCustomer);
                                    });
                                    target.replaceWith(c);
                                    return c.focus();
                                },
                                error: function(err) {
                                    return alert("There was an error loading the customers! Please refresh the page and try again.");
                                }
                            });
                        });
                        $("body").on("click", "#jobSubdivision", function(e) {
                            var oldVal, target;
                            target = $(e.currentTarget);
                            oldVal = target.html();
                            return jsRoutes.controllers.Jobs_rd.getSubdivisionSelect().ajax({
                                data: {
                                    customer: $("#totals").attr("data-customer-id")
                                },
                                success: function(data) {
                                    var s;
                                    s = $(data).children("option[value='']").remove().end();
                                    s.find("option[value='" + $("#totals").attr("data-subdivision-id") + "']").attr("selected", "selected");
                                    s.change(function() {
                                        var jobSubdivision;
                                        jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
                                            data: {
                                                subdivision: $(this).val()
                                            },
                                            success: function(data) {
                                                if (data.length) {
                                                    return window.location.href = "/jobs/" + data[0].id;
                                                }
                                            },
                                            error: function(err) {
                                                return alert("There was an error loading the jobs! Please refresh the page and try again.");
                                            }
                                        });
                                        jobSubdivision = $("<span/>").attr("id", "jobSubdivision").html(oldVal);
                                        return $(this).replaceWith(jobSubdivision);
                                    });
                                    s.blur(function() {
                                        var jobSubdivision;
                                        jobSubdivision = $("<span/>").attr("id", "jobSubdivision").html($(this).find("option:selected").html());
                                        return $(this).replaceWith(jobSubdivision);
                                    });
                                    target.replaceWith(s);
                                    return s.focus();
                                },
                                error: function(err) {
                                    return alert("There was an error loading the subdivisions! Please refresh the page and try again.");
                                }
                            });
                        });
                        /*$("body").on("click", "#jobLot", function(e) {
                            var target, that;
                            that = this;
                            target = $(e.currentTarget);
                            return setTimeout(function() {
                                var dblclick;
                                dblclick = parseInt($(that).data('double'), 10);
                                if (dblclick > 0) {
                                    return $(that).data('double', dblclick - 1);
                                } else {
                                    return jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
                                        data: {
                                            subdivision: $("#totals").attr("data-subdivision-id")
                                        },
                                        success: function(data) {
                                            var j, job, _i, _len;
                                            j = $("<select/>");
                                            for (_i = 0, _len = data.length; _i < _len; _i++) {
                                                job = data[_i];
                                                j.append($("<option/>").html(job.lot).val(job.id));
                                            }
                                            j.append($("<option/>").html("New Job").val("0"));
                                            j.find("option[value='" + $("#totals").attr("data-job-id") + "']").attr("selected", "selected");
                                            j.change(function() {
                                                var newJobMarket, newJobPlan, saleitem;
                                                if ($(this).val() === "0") {
                                                    $("#dialog").dialog({
                                                        autoOpen: false,
                                                        modal: true,
                                                        draggable: false,
                                                        resizable: false,
                                                        width: 450,
                                                        title: "Add a Job",
                                                        buttons: [
                                                            {
                                                                text: "Add",
                                                                click: function() {
                                                                    jsRoutes.controllers.Jobs_rd.addJobTask().ajax({
                                                                        data: {
                                                                            market: $("#newJobMarket").val(),
                                                                            subdivision: $("#totals").attr("data-subdivision-id"),
                                                                            lot: $("#newJobLot").val(),
                                                                            saleitem: $("#saleitem").val(),
                                                                            plan: $("#newJobPlan").val()
                                                                        },
                                                                        success: function(data) {
                                                                            return window.location.href = "/jobs/" + data.id;
                                                                        },
                                                                        error: function(err) {
                                                                            return alert("There was an error adding the job! Please refresh the page and try again.");
                                                                        }
                                                                    });
                                                                    return $("#dialog").dialog("close");
                                                                }
                                                            }
                                                        ]
                                                    });
                                                    newJobMarket = $("<td/>").load(jsRoutes.controllers.Jobs_rd.getMarketSelect().url, function() {
                                                        return $(this).children("select").attr("id", "newJobMarket").children("option[value='']").remove().end().children("option[value='" + $("#totals").attr("data-market-id") + "']").attr("selected", "selected");
                                                    });
                                                    newJobPlan = $("<td/>").load(jsRoutes.controllers.Jobs_rd.getPlanSelect().url, {
                                                        customer: $("#totals").attr("data-customer-id")
                                                    }, function() {
                                                        return $(this).children("select").attr("id", "newJobPlan");
                                                    });
                                                    saleitem = $("<select/>").attr("id", "saleitem").append($("<option/>").html("SALEITEM").val(""));
                                                    jsRoutes.controllers.Jobs_rd.getSaleitems().ajax({
                                                        success: function(data) {
                                                            var item, _j, _len2, _results;
                                                            _results = [];
                                                            for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
                                                                item = data[_j];
                                                                _results.push(saleitem.append($("<option/>").html(item.name).val(item.id)));
                                                            }
                                                            return _results;
                                                        },
                                                        error: function(err) {
                                                            return alert("There was an error loading the sale items! Please refresh the page and try again.");
                                                        }
                                                    });
                                                    $("<table/>").html($("<tbody/>").html($("<tr/>").html($("<td/>").html("Market ")).append(newJobMarket)).append($("<tr/>").html($("<td/>").html("Lot ")).append($("<td/>").html($("<input/>").attr("id", "newJobLot")))).append($("<tr/>").html($("<td/>").html("Sale Item ")).append($("<td/>").html(saleitem))).append($("<tr/>").html($("<td/>").html("Plan ")).append(newJobPlan))).appendTo($("#dialog").html(""));
                                                    return $("#dialog").dialog("open");
                                                } else {
                                                    return window.location.href = "/jobs/" + $(this).val();
                                                }
                                            });
                                            j.blur(function() {
                                                var jobLot;
                                                jobLot = $("<span/>").attr("id", "jobLot").html($(this).find("option[value='" + $("#totals").attr("data-job-id") + "']").html());
                                                return $(this).replaceWith(jobLot);
                                            });
                                            target.replaceWith(j);
                                            return j.focus();
                                        },
                                        error: function(err) {
                                            return alert("There was an error loading the jobs! Please refresh the page and try again.");
                                        }
                                    });
                                }
                            }, 300);
                        });*/
                        $("body").on("dblclick", "#jobLot", function(e) {
                            var input, oldVal, target;
                            $(this).data('double', 2);
                            target = $(e.currentTarget);
                            oldVal = target.html();
                            input = $("<input/>").val(oldVal).blur(function() {
                                var context, jobLot;
                                context = $(this);
                                jobLot = $("<span/>").attr("id", "jobLot").html(oldVal);
                                if (context.val() !== oldVal) {
                                    jsRoutes.controllers.Jobs_rd.updateJob().ajax({
                                        data: {
                                            id: $("#totals").attr("data-job-id"),
                                            lot: context.val()
                                        },
                                        success: function() {
                                            return jobLot.html(context.val());
                                        },
                                        error: function(err) {
                                            return alert("There was an error updating the job lot! Please refresh the page and try again.");
                                        }
                                    });
                                }
                                return $(this).replaceWith(jobLot);
                            });
                            target.replaceWith(input);
                            return input.focus();
                        });
                        return $("body").on("dblclick", "#jobSaleitem", function(e) {
                            var oldVal, saleitem, target;
                            $(this).data('double', 2);
                            target = $(e.currentTarget);
                            oldVal = $("#totals").attr("data-saleitem-id");
                            saleitem = $("<select/>").attr("id", "jobSaleitem").append($("<option/>").html("SALEITEM"));
                            jsRoutes.controllers.Jobs_rd.getSaleitems().ajax({
                                success: function(data) {
                                    var item, _i, _len;
                                    for (_i = 0, _len = data.length; _i < _len; _i++) {
                                        item = data[_i];
                                        saleitem.append($("<option/>").html(item.name).val(item.id));
                                    }
                                    return saleitem.find("option[value='" + oldVal + "']").attr("selected", "selected");
                                },
                                error: function(err) {
                                    return alert("There was an error loading the sale items! Please refresh the page and try again.");
                                }
                            });
                            saleitem.bind("blur change", function() {
                                var context, jobSaleitem;
                                context = $(this);
                                jobSaleitem = $("<span/>").attr("id", "jobSaleitem").html(context.find("option[value='" + oldVal + "']").html());
                                if (context.val() !== oldVal) {
                                    jsRoutes.controllers.Jobs_rd.updateJob().ajax({
                                        data: {
                                            id: $("#totals").attr("data-job-id"),
                                            saleitem: context.val()
                                        },
                                        success: function() {
                                            $("#totals").attr("data-saleitem-id", context.val());
                                            return jobSaleitem.html(context.find("option:selected").html());
                                        },
                                        error: function(err) {
                                            return alert("There was an error updating the job saleitem! Please refresh the page and try again.");
                                        }
                                    });
                                }
                                return $(this).replaceWith(jobSaleitem);
                            });
                            target.replaceWith(saleitem);
                            return saleitem.focus();
                        });
                    });
                }).call(this);

                //  Backbone.history.loadUrl( Backbone.history.fragment );
            },
            error: function(err) {
                return alert("There was an error refreshing job budget lines.");
            }
        }

    );

    goToByScroll("budget");

   // $(window).scrollTo(scrollPos);

}


(function() {
  var ActualLineitem, ActualLineitems, Task;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  ActualLineitems = (function() {
    __extends(ActualLineitems, Backbone.View);
    function ActualLineitems() {
      ActualLineitems.__super__.constructor.apply(this, arguments);
    }
    ActualLineitems.prototype.events = {
      "click    .addActualLineitem": "addActualLineitem",
      "click    .addTask": "addTask",
      "click    .completeTask": "completeTask"
    };
    ActualLineitems.prototype.initialize = function() {
      var actual, cost, fprofit, left, mprofit, sale, total;
      this.el.find(".actualLineitem").each(function(i, lineitem) {
        return new ActualLineitem({
          el: $(lineitem)
        });
      });
      this.el.find(".tasks").each(function(i, tasks) {
        return $(tasks).children("tr.calTask").each(function(j, t) {
          return new Task({
            el: $(t)
          });
        });
      });
      cost = 0;
      actual = 0;
      left = 0;
      this.el.find(".noClass").each(function(i, t) {
        var used;
        $("#actual").find("." + $(t).attr("class").split(" ")[1]).each(function(j, total) {
          var itemTypeId, taskBudgetTotal, taskTypeId;
          if ($(total).hasClass("hasClass")) {
            taskTypeId = $(total).parent().attr("id").split("-")[0];
            itemTypeId = $(total).parent().attr("id").split("-")[1];
            taskBudgetTotal = 0;
            $("#budgetitems td[data-item-type-id='" + itemTypeId + "']").each(function(k, lineitem) {
              return taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task" + taskTypeId + "-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"));
            });
            $(total).html(taskBudgetTotal.toFixed(2));
            return $(total).parent().find(".left").html((parseFloat($(total).html()) - parseFloat($(total).parent().find(".used").html())).toFixed(2));
          }
        });
        cost += parseFloat($(t).html());
        used = 0;
        $(".task ." + $(t).attr("class").split(" ")[1]).parent().find(".used").each(function(j, u) {
          return used += parseFloat($(u).html());
        });
        actual += used;
        left += parseFloat($(t).html()) - used;
        $(t).parent().find(".used").html(used.toFixed(2));
        return $(t).parent().find(".left").html((parseFloat($(t).html()) - used).toFixed(2));
      });
      $("#actual .cost").html(cost.toFixed(2));
      $("#actual .actualcost").html(actual.toFixed(2));
      $("#actual .diffcost").html(left.toFixed(2));
      sale = parseFloat($("#totals").attr("data-sale"));
      total = parseFloat($("#totals").attr("data-cost"));
      $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
      $("#actual .markup").html((total / sale).toFixed(2));
      $("#actual .actualmarkup").html((actual / sale).toFixed(2));
      mprofit = ((sale-actual)>0)?(left>0)?((sale-actual)*.1):((sale-actual)*.1):0;
      fprofit = ((sale-actual)>0)?(left>0)?((sale-actual)*.9):((sale-actual)*.9):(sale-actual);
      $("#managerprofit").html(mprofit.toFixed(2));
     // return $("#ffiprofit").html(fprofit.toFixed(2));
        return $("#ffiprofit").html((sale-total-mprofit).toFixed(2));
    };
    ActualLineitems.prototype.addActualLineitem = function(e) {
      var target;
      target = $(e.currentTarget);
      return jsRoutes.controllers.Lineitems_rd.addActualNewLineitem().ajax({
        data: {
          id: $("#totals").attr("data-job-id"),
          taskType: target.attr("data-task-type-id"),
          itemType: target.attr("data-item-type-id"),
          task: target.parent().parent().parent().find("tr:eq(0)>td:eq(0)>table>tbody>tr:first").attr("data-task-id")
        },
        success: function(data) {
          var _view;
          return _view = new ActualLineitem({
            el: $(data).appendTo($("tbody[data-budget-item-id='" + target.attr("data-budget-item-id") + "']"))
          });
        },
        error: function(err) {
          return alert("There was an error adding the job line item! Please refresh the page and try again.");
        }
      });
    };
    ActualLineitems.prototype.addTask = function(e) {
      var target;
      target = $(e.currentTarget);
      return jsRoutes.controllers.Tasks_rd.addTask().ajax({
        data: {
          id: $("#totals").attr("data-job-id"),
          taskType: target.attr("data-task-type-id")
        },
        success: function(data) {
          var _view;
          return _view = new Task({
            el: $(data).appendTo(target.parent().parent().find(".tasks"))
          });
        },
        error: function(err) {
          return alert("There was an error adding the task! Please refresh the page and try again.");
        }
      });
    };
    ActualLineitems.prototype.completeTask = function(e) {
      var target;
      target = $(e.currentTarget);
      return target.parent().parent().find(".calTask").each(function(i, t) {
        return jsRoutes.controllers.Tasks_rd.updateTask($(t).attr("data-task-id")).ajax({
          data: {
            completed: target.is(":checked")
          },
          error: function(err) {
            return alert("There was an error completing the task! Please refresh the page and try again.");
          }
        });
      });
    };
    return ActualLineitems;
  })();
  Task = (function() {
    __extends(Task, Backbone.View);
    function Task() {
      Task.__super__.constructor.apply(this, arguments);
    }
    Task.prototype.events = {
      "click    .editTask": "editTask",
      "click    .deleteTask": "deleteTask"
    };
    Task.prototype.initialize = function() {
      var task;
      task = this.gup("task");
      if (task === this.el.attr("data-task-id")) {
        return this.el.find(".editTask").click();
      }
    };
    Task.prototype.gup = function(name) {
      var regex, regexS, results;
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      regexS = "[\\?&]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(window.location.href);
      if (results === null) {
        return "";
      } else {
        return results[1];
      }
    };
    Task.prototype.editTask = function(e) {
      var altDate, context, crew, crewRow, date, dateParts, defaultDate, i, managerFunction, managerRow, notes, order, orderRow, table;
      context = this;
      crew = $('<select/>').css('width', '50px').change(function() {
        return context.el.attr("data-crew", $(this).val());
      });
      for (i = 1; i <= 20; i++) {
        crew.append($('<option/>').attr({
          value: i
        }).html(i));
      }
      crew.find("option[value='" + this.el.attr("data-crew") + "']").attr("selected", "selected");
      order = $('<select/>').css('width', '50px').change(function() {
        return context.el.attr("data-card-order", $(this).val());
      });
      for (i = 1; i <= 10; i++) {
        order.append($('<option/>').attr({
          value: i
        }).html(i));
      }
      order.find("option[value='" + this.el.attr("data-card-order") + "']").attr("selected", "selected");
      dateParts = this.el.attr("data-date").split("-");
      defaultDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      altDate = $("<input/>").attr({
        type: "hidden",
        id: "altDate"
      });
      date = $("<div/>").datepicker({
        altField: "#altDate",
        altFormat: "yy-mm-dd",
        defaultDate: defaultDate,
        onSelect: function(d, i) {
          context.el.attr("data-date", $("#altDate").val());
          return context.el.find("td:eq(1)").html($("#altDate").val());
        }
      });
      notes = $("<textarea>" + this.el.attr("data-notes") + "</textarea>").css("width", "251px").change(function() {
        return context.el.attr("data-notes", $(this).val());
      });
      managerFunction = function() {
        $(this).find("option[value='" + context.el.attr("data-manager-id") + "']").attr("selected", "selected");
        return $(this).find("select").change(function() {
          return context.el.attr("data-manager-id", $(this).val());
        });
      };
      managerRow = $("<tr/>").append("<td>Crew Leader </td>").append($("<td/>").load(jsRoutes.controllers.Home_rd.getCrewLeader().url, managerFunction));
      crewRow = $("<tr/>").append("<td>Box</td>");
      $("<td/>").append(crew).appendTo(crewRow);
      orderRow = $("<tr/>").append("<td>Order</td>");
      $("<td/>").append(order).appendTo(orderRow);
      table = $("<table/>");
      $("<tbody/>").append(managerRow).append(crewRow).append(orderRow).appendTo(table);
      $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        width: 450,
        title: "Update Task"
      });
      return $("#dialog").html("").append(table).append(date).append(altDate).append("Notes<br/>").append(notes).on("dialogclose", function(e, ui) {
        jsRoutes.controllers.Tasks_rd.updateTask(context.el.attr("data-task-id")).ajax({
          data: {
            crew: context.el.attr("data-crew"),
            cardOrder: context.el.attr("data-card-order"),
            date: context.el.attr("data-date"),
            notes: context.el.attr("data-notes"),
            manager: context.el.attr("data-manager-id")
          },
          success: function(data) {
            var task, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              task = data[_i];
              _results.push($("tr[data-task-id='" + task.id + "']").attr("data-card-order", task.cardOrder));
            }
            return _results;
          },
          error: function(err) {
            return alert("There was an error updating the task! Please refresh the page and try again.");
          }
        });
        return $("#dialog").unbind("dialogclose");
      }).dialog("open");
    };
    Task.prototype.deleteTask = function(e) {
      var context;
      context = this;
      e.preventDefault();
      if (confirm('Assigned lineitems for that task will be deleted. Are you sure? ')) {
        return jsRoutes.controllers.Tasks_rd.deleteTask(this.el.attr("data-task-id")).ajax({
          context: this,
          success: function(data) {
            var task, _i, _len, _results;
              // tuka izbrisi lineitems od toj task i izbrisi assigns za toj task
              // pa prodolzi go...
            context.el.remove();
            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              task = data[_i];
              _results.push($("tr[data-task-id='" + task.id + "']").attr("data-card-order", task.cardOrder));
            }
            return _results;
          },
          error: function(err) {
            return alert("There was an error deleting the task! Please refresh the page and try again.");
          }
        });
      }
    };
    return Task;
  })();
  ActualLineitem = (function() {
    __extends(ActualLineitem, Backbone.View);
    function ActualLineitem() {
      ActualLineitem.__super__.constructor.apply(this, arguments);
    }
    ActualLineitem.prototype.events = {
      "click    .deleteLineitemactual": "deleteActualLineitem",
      "focus    .vendor>input": "loadVendorSelect",
      "focus    .item>input": "loadItemSelect",
      "click    .notes": "editNotes",
      "change   .quantity,.rate": "updateActualLineitem",
      "click    .invoice": "updateActualLineitem",
      "dblclick .purchaseorder": "updateActualLineitem"
    };
    ActualLineitem.prototype.initialize = function() {
      this.id = this.el.attr("data-lineitem-id");
      this.vendor = this.el.find("td:eq(2)");
      this.item = this.el.find("td:eq(3)");
      this.quantity = this.el.find("td:eq(4) input");
      this.rate = this.el.find("td:eq(6) input");
      this.units = this.el.find("td:eq(8)");
      this.cost = this.el.find("td:eq(9)");
      return this.recalculate();
    };
    ActualLineitem.prototype.deleteActualLineitem = function(e) {
      e.preventDefault();
      if (confirm('Are you sure?')) {
        return jsRoutes.controllers.Lineitems_rd.deleteLineitem(this.id).ajax({
          context: this,
          success: function() {
            this.quantity.val(0);
            this.rate.val(0);
            this.recalculate();
            return this.el.remove();
          },
          error: function(err) {
            return alert("There was an error deleting the job line item! Please refresh the page and try again.");
          }
        });
      }
    };
    ActualLineitem.prototype.loadVendorSelect = function(e) {
      var context, target, v;
      target = $(e.currentTarget);
      v = $();
      context = this;
      jsRoutes.controllers.Lineitems_rd.getVendorSelect().ajax({
        context: this,
        async: false,
        data: {
          id: $("#totals").attr("data-market-id"),
          itemType: context.item.attr("data-item-type-id")
        },
        success: function(data) {
          v = $(data);
          v.find("option[value='" + context.vendor.attr("data-vendor-id") + "']").attr("selected", "selected");
          v.change(function() {
            context.vendor.attr("data-vendor-id", $(this).find("option:selected").val());
            context.item.attr("data-item-id", "");
            return context.item.children("input").val("");
          });
          return v.blur(function() {
            var input;
            input = $("<input/>").css("text-align", "left").val($(this).find("option:selected").html());
            return $(this).replaceWith(input);
          });
        },
        error: function(err) {
          return alert("There was an error loading the vendors! Please refresh the page and try again.");
        }
      });
      target.replaceWith(v);
      return v.focus();
    };
    ActualLineitem.prototype.loadItemSelect = function(e) {
      var context, i, target;
      target = $(e.currentTarget);
      i = $();
      context = this;
      jsRoutes.controllers.Lineitems_rd.getItemSelect().ajax({
        context: this,
        async: false,
        data: {
          id: context.vendor.attr("data-vendor-id"),
          itemType: this.item.attr("data-item-type-id")
        },
        success: function(data) {
          i = $(data);
          i.find("option[value='" + context.item.attr("data-item-id") + "']").attr("selected", "selected");
          i.change(function() {
            var vendorItem;
            vendorItem = $(this).find("option:selected");
            context.item.attr("data-item-id", vendorItem.val());
            context.item.children("input").val(vendorItem.html());
            context.el.attr("data-rate", vendorItem.attr("data-default-rate"));
            context.rate.val(parseFloat(vendorItem.attr("data-default-rate")).toFixed(2));
            return context.rate.change();
          });
          return i.blur(function() {
            var input;
            input = $("<input/>").css("text-align", "left").val($(this).find("option:selected").html());
            return $(this).replaceWith(input);
          });
        },
        error: function(err) {
          return alert("There was an error loading the items! Please refresh the page and try again.");
        }
      });
      target.replaceWith(i);
      return i.focus();
    };
    ActualLineitem.prototype.editNotes = function() {
      var context, notes, task;
      context = this;
      notes = $("<textarea>" + this.el.attr("data-notes") + "</textarea>").css("width", "251px").change(function() {
        context.el.attr("data-notes", $(this).val());
        if ($(this).val() !== "") {
          context.el.find("td:eq(1)>span").css("color", "#F00");
        } else {
          context.el.find("td:eq(1)>span").css("color", "#000");
        }
        return context.rate.change();
      });
      task = $("<select/>").html($("<option value=\"\"/>")).change(function() {
        context.el.attr("data-task-id", $(this).val());
        if ($(this).val() !== "") {
          context.el.find("td:eq(1)>span").html($(this).find("option:selected").html().split("-").slice(1).join("-"));
        } else {
          context.el.find("td:eq(1)>span").html("NOTE");
        }
        return context.rate.change();
      });
      this.el.parent().parent().parent().parent().parent().find("tr:eq(0)>td:eq(0)>table>tbody>tr.calTask").each(function(i, l) {
        return task.append($("<option value=\"" + $(l).attr("data-task-id") + "\">" + $(l).find("td:eq(1)").html() + "</option>"));
      });
      task.find("option[value='" + this.el.attr("data-task-id") + "']").attr("selected", "selected");
      $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        width: 450,
        title: "Update Line Item"
      });
      return $("#dialog").html("").append("Notes<br/>").append(notes).append("<br/>Task<br/>").append(task).dialog("open");
    };
    ActualLineitem.prototype.updateActualLineitem = function(e) {
      var po, target;
      target = $(e.currentTarget);
      po = this.el.find(".purchaseorder").html();
      if (target.hasClass("invoice") || target.hasClass("purchaseorder")) {
        po = prompt("Please enter a Purchase Order #, or just click OK to add line automatically.", "...");
      }
        // ni treba da se updatira covekot FM na kogo e assigniran
      return jsRoutes.controllers.Lineitems_rd.updateNewLineitemNeww(this.id).ajax({
        context: this,
        data: {
          vendor: this.vendor.attr("data-vendor-id"),
          item: this.item.attr("data-item-id"),
          units: this.units.html(),
          quantity: this.quantity.val(),
          rate: this.rate.val(),
          saleprice: parseFloat(this.quantity.val()) * parseFloat(this.rate.val()),
          task: this.el.attr("data-task-id"),
          notes: this.el.attr("data-notes"),
          po: po
        },
        success: function() {
          if (target.hasClass("invoice") || target.hasClass("purchaseorder")) {
            return target.replaceWith($("<span/>").attr("class", "purchaseorder").html(po));
          } else {
              //    return refreshmeactuals();
           return  this.recalculate();

          }
        },
        error: function(err) {
          return alert("There was an error updating the job line item! Please refresh the page and try again.");
        }
      });
    };
    ActualLineitem.prototype.recalculate = function() {
      var actual, cost, fprofit, left, mprofit, sale, taskitem, total;
      this.el.attr("data-cost", parseFloat(this.quantity.val()) * parseFloat(this.rate.val()));
      this.cost.html(parseFloat(this.el.attr("data-cost")).toFixed(2));
      total = 0;
      this.el.parent().children("tr").each(function(i, row) {
        return total += parseFloat($(row).attr("data-cost"));
      });
      taskitem = $("#" + this.el.parent().attr("data-task-type-id") + "-" + this.el.find(".item").attr("data-item-type-id"));
      taskitem.find(".used").html(total.toFixed(2));
      taskitem.find(".left").html((total - parseFloat(taskitem.find(".hasClass").html())).toFixed(2));
      cost = 0;
      actual = 0;
      left = 0;
      $("#actual .noClass").each(function(i, t) {
        var used;
        $("#actual").find("." + $(t).attr("class").split(" ")[1]).each(function(j, total) {
          var itemTypeId, taskBudgetTotal, taskTypeId;
          if ($(total).hasClass("hasClass")) {
            taskTypeId = $(total).parent().attr("id").split("-")[0];
            itemTypeId = $(total).parent().attr("id").split("-")[1];
            taskBudgetTotal = 0;
            $("#budgetitems td[data-item-type-id='" + itemTypeId + "']").each(function(k, lineitem) {
              return taskBudgetTotal += parseFloat($(lineitem).parent().attr("data-task" + taskTypeId + "-percentage")) * 0.01 * parseFloat($(lineitem).parent().attr("data-cost"));
            });
            $(total).html(taskBudgetTotal.toFixed(2));
            return $(total).parent().find(".left").html((parseFloat($(total).html()) - parseFloat($(total).parent().find(".used").html())).toFixed(2));
          }
        });
        cost += parseFloat($(t).html());
        used = 0;
        $(".task ." + $(t).attr("class").split(" ")[1]).parent().find(".used").each(function(j, u) {
          return used += parseFloat($(u).html());
        });
        actual += used;
        left += parseFloat($(t).html()) - used;
        $(t).parent().find(".used").html(used.toFixed(2));
        return $(t).parent().find(".left").html((parseFloat($(t).html()) - used).toFixed(2));
      });
      $("#actual .cost").html(cost.toFixed(2));
      $("#actual .actualcost").html(actual.toFixed(2));
      $("#actual .diffcost").html(left.toFixed(2));
      sale = parseFloat($("#totals").attr("data-sale"));
      total = parseFloat($("#totals").attr("data-cost"));
      $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
      $("#actual .markup").html((total / sale).toFixed(2));
      $("#actual .actualmarkup").html((actual / sale).toFixed(2));
      mprofit = ((sale-total)>0)?(left>0)?((sale-total)*.1):((sale-total)*.1):0;
      fprofit = ((sale-total)>0)?(left>0)?((sale-total)*.9):((sale-total)*.9):(sale-total);
      $("#managerprofit").html(mprofit.toFixed(2));
    //  return $("#ffiprofit").html(fprofit.toFixed(2));
        return $("#ffiprofit").html((sale-total-mprofit).toFixed(2))
    };
    return ActualLineitem;
  })();
  $(function() {
    var lineitems;
    lineitems = new ActualLineitems({
      el: $("#actual")
    });
    $("body").on("change", "#jobCategory", function(e) {
      var dateParts, defaultDate, task3;
      task3 = $("tr[data-task-type-id='3']");
      if (task3.length > 0) {
        dateParts = task3.filter(":last").attr("data-date").split("-");
        defaultDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      } else {
        defaultDate = new Date();
      }
      $("#jobDate").val($.datepicker.formatDate('yy-mm-dd', defaultDate));
      return jsRoutes.controllers.Jobs_rd.updateJob().ajax({
        data: {
          id: $("#totals").attr("data-job-id"),
          category: $("#jobCategory").val(),
          date: $("#jobDate").val()
        },
        error: function(err) {
          return alert("There was an error updating the job category! Please refresh the page and try again.");
        }
      });
    });
    $("body").on("click", "#jobCategory", function(e) {
      var target, that;
      that = this;
      target = $(e.currentTarget);
      return setTimeout(function() {
        var dblclick;
        dblclick = parseInt($(that).data('double'), 10);
        if (dblclick > 0) {
          return $(that).data('double', dblclick - 1);
        }
      }, 300);
    });
    $("body").on("dblclick", "#jobCategory", function(e) {
      var dateParts, defaultDate, input, select, target;
      $(this).data('double', 2);
      target = $(e.currentTarget);
      select = target.clone();
      select.find("option[value='" + $("#jobCategory").val() + "']").attr("selected", "selected");
      dateParts = $("#jobDate").val().split("-");
      defaultDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      input = $("<input/>").val($("#jobDate").val()).datepicker({
        altField: "#jobDate",
        altFormat: "yy-mm-dd",
        defaultDate: defaultDate,
        onClose: function(d, i) {
          $(this).datepicker("destroy");
          return $(this).replaceWith(select);
        },
        onSelect: function(d, i) {
          $(this).datepicker("destroy");
          $(this).replaceWith(select);
          return jsRoutes.controllers.Jobs_rd.updateJob().ajax({
            data: {
              id: $("#totals").attr("data-job-id"),
              date: $("#jobDate").val()
            }
          });
        }
      });
      target.replaceWith(input);
      return input.datepicker("show");
    });
    $("#jobNotes").change(function() {
      return jsRoutes.controllers.Jobs_rd.updateJob().ajax({
        data: {
          id: $("#totals").attr("data-job-id"),
          notes: $("#jobNotes").val()
        },
        error: function(err) {
          return alert("There was an error updating the job notes! Please refresh the page and try again.");
        }
      });
    });
    $("#copyToPlans").click(function() {
      $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        width: 450,
        title: "Save as plan...",
        buttons: [
          {
            text: "save",
            click: function() {
              jsRoutes.controllers.Jobs_rd.copyToPlans().ajax({
                data: {
                  id: $("#totals").attr("data-job-id"),
                  name: $("#newPlanName").val()
                },
                error: function(err) {
                  return alert("There was an error copying the job to plans! Please refresh the page and try again.");
                }
              });
              return $("#dialog").dialog("close");
            }
          }
        ]
      });
      return $("#dialog").html("Name ").append($("<input/>").attr("id", "newPlanName")).dialog("open");
    });
    $("#applyTemplate").click(function() {
      $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        draggable: false,
        resizable: false,
        width: 450,
        title: "Apply template...",
        buttons: [
          {
            text: "apply",
            click: function() {
              jsRoutes.controllers.Jobs_rd.applyTemplateNewJob().ajax({
                data: {
                  id: $("#totals").attr("data-job-id"),
                  template: $("#planSelect").val()
                },
                error: function(err) {
                  return alert("There was an error applying the template! Please refresh the page and try again.");
                },
                success: function() {
                  return location.reload();
                }
              });
              return $("#dialog").dialog("close");
            }
          }
        ]
      });
      return $("#dialog").html("").load(jsRoutes.controllers.Jobs_rd.getPlanSelect().url, {
        customer: $("#totals").attr("data-customer-id")
      }).dialog("open");
    });
    $("#jobMarket").dblclick(function(e) {
      var oldVal, target;
      target = $(e.currentTarget);
      oldVal = target.html();
      return jsRoutes.controllers.Jobs_rd.getMarketSelect().ajax({
        success: function(data) {
          var m;
          m = $(data).children("option[value='']").remove().end();
          m.find("option[value='" + $("#totals").attr("data-market-id") + "']").attr("selected", "selected");
          m.change(function() {
            var context, jobMarket;
            context = $(this);
            jobMarket = $("<span/>").attr("id", "jobMarket").html(oldVal);
            jsRoutes.controllers.Jobs_rd.updateJob().ajax({
              data: {
                id: $("#totals").attr("data-job-id"),
                market: context.val()
              },
              success: function(data) {
                jobMarket.html(context.find("option:selected").html());
                return $("#totals").attr("data-market-id", context.val());
              },
              error: function(err) {
                return alert("There was an error updating the job market! Please refresh the page and try again.");
              }
            });
            return $(this).replaceWith(jobMarket);
          });
          m.blur(function() {
            var jobMarket;
            jobMarket = $("<span/>").attr("id", "jobMarket").html(oldVal);
            return $(this).replaceWith(jobMarket);
          });
          target.replaceWith(m);
          return m.focus();
        },
        error: function(err) {
          return alert("There was an error loading the customers! Please refresh the page and try again.");
        }
      });
    });
    $("body").on("click", "#jobCustomer", function(e) {
      var oldVal, target;
      target = $(e.currentTarget);
      oldVal = target.html();
      return jsRoutes.controllers.Jobs_rd.getCustomerSelect().ajax({
        success: function(data) {
          var c;
          c = $(data).children("option[value='']").remove().end();
          c.find("option[value='" + $("#totals").attr("data-customer-id") + "']").attr("selected", "selected");
          c.change(function() {
            var jobCustomer;
            jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
              data: {
                customer: $(this).val()
              },
              success: function(data) {
                if (data.length) {
                  return window.location.href = "/jobs/" + data[0].id;
                }
              },
              error: function(err) {
                return alert("There was an error loading the jobs! Please refresh the page and try again.");
              }
            });
            jobCustomer = $("<span/>").attr("id", "jobCustomer").html(oldVal);
            return $(this).replaceWith(jobCustomer);
          });
          c.blur(function() {
            var jobCustomer;
            jobCustomer = $("<span/>").attr("id", "jobCustomer").html(oldVal);
            return $(this).replaceWith(jobCustomer);
          });
          target.replaceWith(c);
          return c.focus();
        },
        error: function(err) {
          return alert("There was an error loading the customers! Please refresh the page and try again.");
        }
      });
    });
    $("body").on("click", "#jobSubdivision", function(e) {
      var oldVal, target;
      target = $(e.currentTarget);
      oldVal = target.html();
      return jsRoutes.controllers.Jobs_rd.getSubdivisionSelect().ajax({
        data: {
          customer: $("#totals").attr("data-customer-id")
        },
        success: function(data) {
          var s;
          s = $(data).children("option[value='']").remove().end();
          s.find("option[value='" + $("#totals").attr("data-subdivision-id") + "']").attr("selected", "selected");
          s.change(function() {
            var jobSubdivision;
            jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
              data: {
                subdivision: $(this).val()
              },
              success: function(data) {
                if (data.length) {
                  return window.location.href = "/jobs/" + data[0].id;
                }
              },
              error: function(err) {
                return alert("There was an error loading the jobs! Please refresh the page and try again.");
              }
            });
            jobSubdivision = $("<span/>").attr("id", "jobSubdivision").html(oldVal);
            return $(this).replaceWith(jobSubdivision);
          });
          s.blur(function() {
            var jobSubdivision;
            jobSubdivision = $("<span/>").attr("id", "jobSubdivision").html($(this).find("option:selected").html());
            return $(this).replaceWith(jobSubdivision);
          });
          target.replaceWith(s);
          return s.focus();
        },
        error: function(err) {
          return alert("There was an error loading the subdivisions! Please refresh the page and try again.");
        }
      });
    });
    $("body").on("click", "#jobLot", function(e) {
      var target, that;
      that = this;
      target = $(e.currentTarget);
      return setTimeout(function() {
        var dblclick;
        dblclick = parseInt($(that).data('double'), 10);
        if (dblclick > 0) {
          return $(that).data('double', dblclick - 1);
        } else {
          return jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
            data: {
              subdivision: $("#totals").attr("data-subdivision-id")
            },
            success: function(data) {
              var j, job, _i, _len;
              j = $("<select/>");
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                job = data[_i];
                j.append($("<option/>").html(job.lot).val(job.id));
              }
              j.append($("<option/>").html("New Job").val("0"));
              j.find("option[value='" + $("#totals").attr("data-job-id") + "']").attr("selected", "selected");
              j.change(function() {
                var newJobMarket, newJobPlan, saleitem;
                if ($(this).val() === "0") {
                  $("#dialog").dialog({
                    autoOpen: false,
                    modal: true,
                    draggable: false,
                    resizable: false,
                    width: 450,
                    title: "Add a Job",
                    buttons: [
                      {
                        text: "Add",
                        click: function() {
                          jsRoutes.controllers.Jobs_rd.addJobTask().ajax({
                            data: {
                              market: $("#newJobMarket").val(),
                              subdivision: $("#totals").attr("data-subdivision-id"),
                              lot: $("#newJobLot").val(),
                              saleitem: $("#saleitem").val(),
                              plan: $("#newJobPlan").val(),
                              date: $(".jobstartdate").val()
                        },
                            success: function(data) {
                              return window.location.href = "/jobs/" + data.id;
                            },
                            error: function(err) {
                              return alert("There was an error adding the job! Please refresh the page and try again.");
                            }
                          });
                          return $("#dialog").dialog("close");
                        }
                      }
                    ]
                  });
                  newJobMarket = $("<td/>").load(jsRoutes.controllers.Jobs_rd.getMarketSelect().url, function() {
                    return $(this).children("select").attr("id", "newJobMarket").children("option[value='']").remove().end().children("option[value='" + $("#totals").attr("data-market-id") + "']").attr("selected", "selected");
                  });
                  newJobPlan = $("<td/>").load(jsRoutes.controllers.Jobs_rd.getPlanSelect().url, {
                    customer: $("#totals").attr("data-customer-id")
                  }, function() {
                    return $(this).children("select").attr("id", "newJobPlan");
                  });
                  saleitem = $("<select/>").attr("id", "saleitem").append($("<option/>").html("SALEITEM").val(""));
                  jsRoutes.controllers.Jobs_rd.getSaleitems().ajax({
                    success: function(data) {
                      var item, _j, _len2, _results;
                      _results = [];
                      for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
                        item = data[_j];
                        _results.push(saleitem.append($("<option/>").html(item.name).val(item.id)));
                      }
                      return _results;
                    },
                    error: function(err) {
                      return alert("There was an error loading the sale items! Please refresh the page and try again.");
                    }
                  });


/*
                    defaultDate = new Date();// new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    altDate = $("<input/>").attr({
                        type: "hidden",
                        id: "altDate"
                    });*/
  /*                  date = $("<div/>").datepicker({

                        altField: "#altDate",
                        altFormat: "yy-mm-dd",
                        defaultDate: defaultDate,
                       *//* onSelect: function(d, i) {
                            this.el.attr("data-date", $("#altDate").val());
                            this.el.find("td:eq(1)").html($("#altDate").val());
                        }*//*
                    })
*/
                    date = "<p>Start Date: <input type='text' class='jobstartdate'></p>";
                  $("<table/>").html($("<tbody/>").html($("<tr/>").html($("<td/>").html("Market ")).append(newJobMarket)).append($("<tr/>").html($("<td/>").html("Lot ")).append($("<td/>").html($("<input/>").attr("id", "newJobLot")))).append($("<tr/>").html($("<td/>").html("Sale Item ")).append($("<td/>").html(saleitem))).append($("<tr/>").html($("<td/>").html("Plan ")).append(newJobPlan)).append(date)).appendTo($("#dialog").html(""));
                  return $("#dialog").dialog("open");
                } else {
                  return window.location.href = "/jobs/" + $(this).val();
                }
              });
              j.blur(function() {
                var jobLot;
                jobLot = $("<span/>").attr("id", "jobLot").html($(this).find("option[value='" + $("#totals").attr("data-job-id") + "']").html());
                return $(this).replaceWith(jobLot);
              });
              target.replaceWith(j);
              return j.focus();
            },
            error: function(err) {
              return alert("There was an error loading the jobs! Please refresh the page and try again.");
            }
          });
        }
      }, 300);
    });
    $("body").on("dblclick", "#jobLot", function(e) {
      var input, oldVal, target;
      $(this).data('double', 2);
      target = $(e.currentTarget);
      oldVal = target.html();
      input = $("<input/>").val(oldVal).blur(function() {
        var context, jobLot;
        context = $(this);
        jobLot = $("<span/>").attr("id", "jobLot").html(oldVal);
        if (context.val() !== oldVal) {
          jsRoutes.controllers.Jobs_rd.updateJob().ajax({
            data: {
              id: $("#totals").attr("data-job-id"),
              lot: context.val()
            },
            success: function() {
              return jobLot.html(context.val());
            },
            error: function(err) {
              return alert("There was an error updating the job lot! Please refresh the page and try again.");
            }
          });
        }
        return $(this).replaceWith(jobLot);
      });
      target.replaceWith(input);
      return input.focus();
    });
    return $("body").on("dblclick", "#jobSaleitem", function(e) {
      var oldVal, saleitem, target;
      $(this).data('double', 2);
      target = $(e.currentTarget);
      oldVal = $("#totals").attr("data-saleitem-id");
      saleitem = $("<select/>").attr("id", "jobSaleitem").append($("<option/>").html("SALEITEM"));
      jsRoutes.controllers.Jobs_rd.getSaleitems().ajax({
        success: function(data) {
          var item, _i, _len;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            item = data[_i];
            saleitem.append($("<option/>").html(item.name).val(item.id));
          }
          return saleitem.find("option[value='" + oldVal + "']").attr("selected", "selected");
        },
        error: function(err) {
          return alert("There was an error loading the sale items! Please refresh the page and try again.");
        }
      });
      saleitem.bind("blur change", function() {
        var context, jobSaleitem;
        context = $(this);
        jobSaleitem = $("<span/>").attr("id", "jobSaleitem").html(context.find("option[value='" + oldVal + "']").html());
        if (context.val() !== oldVal) {
          jsRoutes.controllers.Jobs_rd.updateJob().ajax({
            data: {
              id: $("#totals").attr("data-job-id"),
              saleitem: context.val()
            },
            success: function() {
              $("#totals").attr("data-saleitem-id", context.val());
              return jobSaleitem.html(context.find("option:selected").html());
            },
            error: function(err) {
              return alert("There was an error updating the job saleitem! Please refresh the page and try again.");
            }
          });
        }
        return $(this).replaceWith(jobSaleitem);
      });
      target.replaceWith(saleitem);
      return saleitem.focus();
    });
  });
}).call(this);
