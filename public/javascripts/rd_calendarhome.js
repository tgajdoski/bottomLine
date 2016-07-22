$(document).ready(function() {

        var loadCustomerSelect, loadPlanSelect, loadSubdivisionSelect;
        $("body").on("click",".openJob,.openTask", function(e) {
            e.preventDefault();
            return window.open($(this).attr("href"));
        });
        if (($(".notes").length)) {
            $(".notes").editable({
                closeOnEnter: true,
                callback: function(data) {
                    var id;
                    if (data.content) {
                        id = data.$el.parent().attr("data-task-id");
                        return jsRoutes.controllers.Tasks_rd.updateTask(id).ajax({
                            data: {
                                notes: data.content
                            },
                            error: function(err) {
                                return alert("There was an error updating the task notes! Please refresh the page and try again.");
                            }
                        });
                    }
                }
            });
        }
        $("#dialog").dialog({
            title: "Add a task",
            buttons: [
                {
                    text: "Add",
                    click: function() {
                        jsRoutes.controllers.Jobs_rd.addJobTask().ajax({
                            data: {
                                market: $("#marketSelect").find("option:selected").val(),
                                subdivision: $("#subdivisionSelect").find("option:selected").val(),
                                lot: $("#lot").val(),
                                job: $("#lot").attr("data-job-id"),
                                saleitem: $("#saleitem").val(),
                                plan: $("#planSelect").val(),
                                task: $("#taskSelect").val(),
                                crew: $("#crew").val(),
                                date: $("#date").val()
                            },
                            success: function(data) {
                                $(data).appendTo($("tr[data-crew='" + $("#crew").val() + "']").find("ol[data-date='" + $("#date").val() + "']"));
                                return $("#marketSelect").remove();
                            },
                            error: function(err) {
                                return alert("There was an error adding the job task! Please refresh the page and try again.");
                            }
                        });
                        return $("#dialog").dialog("close");
                    }
                }
            ]
        });

        $(".addJob").click(function(e) {

          $(".ui-dialog").show();
            var crew, customerRow, date, lot, lotRow, marketRow, markets, planRow, saleitem, saleitemRow, subdivisionRow, table, target, taskRow;
            target = $(e.currentTarget);
            crew = $("<input/>").attr("type", "hidden").attr("id", "crew").val(target.parent().parent().attr("data-crew"));
            date = $("<input/>").attr("type", "hidden").attr("id", "date").val(target.parent().find("ol").attr("data-date"));
            markets = $("#calMarketSelect").clone();
            markets.attr("id", "marketSelect").change(function() {
                if ($("#customerSelect").find("option:selected").val() === "") {
                    $("#customerSelect").replaceWith(loadCustomerSelect());
                    return $("#subdivisionSelect").replaceWith($("<select/>").attr("id", "subdivisionSelect"));
                }
            });
            markets.find("option[value='" + $("#calHead>select").find("option:selected").val() + "']").attr("selected", "selected");
            marketRow = $("<tr/>").append("<td>Market</td>");
            $("<td/>").append(markets).appendTo(marketRow);
            customerRow = $("<tr/>").append("<td>Customer</td>");
            $("<td/>").append(loadCustomerSelect()).appendTo(customerRow);
            subdivisionRow = $("<tr/>").append("<td>Subdivision</td>");
            $("<td/>").append($("<select/>").attr("id", "subdivisionSelect")).appendTo(subdivisionRow);
            lot = $("<input/>").attr("id", "lot").attr("data-job-id", "");
            lot.autocomplete({
                source: function(request, response) {
                    return jsRoutes.controllers.Jobs_rd.getJobsByLot().ajax({
                        data: {
                            market: $("#marketSelect").find("option:selected").val(),
                            customer: $("#customerSelect").find("option:selected").val(),
                            subdivision: $("#subdivisionSelect").find("option:selected").val(),
                            lot: $("#lot").val()
                        },
                        success: function(data) {
                            return response($.map(data, function(job) {
                                return {
                                    label: job.customer?job.customer.name+" "+(job.subdivision?job.subdivision.name+" "+job.lot:job.lot):(job.subdivision?job.subdivision.name+" "+job.lot:job.lot),
                                    value: job.lot,
                                    market: job.market?job.market.id:"",
                                    customer: job.customer?job.customer.id:"",
                                    subdivision: job.subdivision?job.subdivision.id:"",
                                    job: job.id,
                                    saleitem: job.item?job.item.id:"",
                                    plan: job.plan?job.plan.id:""
                                };
                            }));
                        },
                        error: function(err) {
                            return alert("There was an error loading the jobs! Please refresh the page and try again.");
                        }
                    });
                },
                select: function(event, ui) {
                    if (ui.item) {
                        $("#lot").attr("data-job-id", ui.item.job);
                        if (ui.item.market !== "") {
                            $("#marketSelect").find("option[value='" + ui.item.market + "']").attr("selected", "selected");
                        }
                        if (ui.item.customer !== "") {
                            $("#customerSelect").find("option[value='" + ui.item.customer + "']").attr("selected", "selected");
                            $("#customerSelect").change();
                        }
                        if (ui.item.subdivision !== "") {
                            $("#subdivisionSelect").find("option[value='" + ui.item.subdivision + "']").attr("selected", "selected");
                        }
                        if (ui.item.saleitem !== "") {
                            $("#saleitem").find("option[value='" + ui.item.saleitem + "']").attr("selected", "selected");
                        }
                        if (ui.item.plan !== "") {
                            return $("#planSelect").find("option[value='" + ui.item.plan + "']").attr("selected", "selected");
                        }
                    }
                },
                open: function() {
                    return $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                },
                close: function() {
                    return $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                }
            });
            lotRow = $("<tr/>").append("<td>Lot</td>");
            $("<td/>").append($("<div/>").attr("class", "ui-widget").append(lot)).appendTo(lotRow);
            saleitem = $("<select/>").attr("id", "saleitem").append($("<option/>").html("SALEITEM").val(""));
            jsRoutes.controllers.Jobs_rd.getSaleitems().ajax({
                success: function(data) {
                    var item, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = data.length; _i < _len; _i++) {
                        item = data[_i];
                        _results.push(saleitem.append($("<option/>").html(item.name).val(item.id)));
                    }
                    return _results;
                },
                error: function(err) {
                    return alert("There was an error loading the sale items! Please refresh the page and try again.");
                }
            });
            saleitemRow = $("<tr/>").append("<td>Saleitem</td>");
            $("<td/>").append($("<div/>").attr("class", "ui-widget").append(saleitem)).appendTo(saleitemRow);
            planRow = $("<tr/>").append("<td>Plan</td>");
            $("<td/>").append(loadPlanSelect()).appendTo(planRow);
            taskRow = $("<tr/>").append("<td>Task</td>");
            $("<td/>").append($("<select/>").attr("id", "taskSelect").append($("<option/>").html("Task1").val(1)).append($("<option/>").html("Task2").val(2)).append($("<option/>").html("Task3").val(3))).appendTo(taskRow);
            table = $("<table/>");
            $("<tbody/>").append(marketRow).append(customerRow).append(subdivisionRow).append(lotRow).append(saleitemRow).append(planRow).append(taskRow).appendTo(table);
            return $("#dialog").html("").append(table).append(crew).append(date).dialog("open");
        });
        $(".printweek").click(function() {
            var parms;
            parms = (window.location.href.indexOf("?")!=-1)?"&"+window.location.href.split("?")[1]:"";
            return window.open("/calendar/print?font=" + $(this).css("font-size") + parms);
        });
        $(".printicon").click(function() {
            var parms;
            parms = (window.location.href.indexOf("?")!=-1)?"&market="+window.location.href.split("&market=")[1]:"";
            return window.open("/calendar/jobcards?withrates=" + confirm("Show rates?") + "&date=" + $(this).attr("data-date") + parms);
        });


      /*  return $("#itemReport").click(function() {
            var parms;
            parms = (window.location.href.indexOf("?")!=-1)?"?"+window.location.href.split("?")[1]:"";
            return window.open("/rd/calendar/items" + parms);
        });
*/



})

