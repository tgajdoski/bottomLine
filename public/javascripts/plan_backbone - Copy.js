
$(document).ready(function() {


    $('#assigntask').hide();

    var d = new Date();
    var jobMarket = 0;
    var selectedJob = 0;

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }



    $("th").on("click", ".options dt", function(e) {
        e.preventDefault();
        if ($(e.target).parent().hasClass("opened")) {
            $(e.target).parent().removeClass("opened");
        } else {
            $(e.target).parent().addClass("opened");
            $(document).one("click", function() {
                return $(e.target).parent().removeClass("opened");
            });
        }
        return false;
    });



    $(".close").click(function() {
        $('#assigntask').hide();
    });

    $("#close").click(function() {
        $('#assigntask').hide();
    });


    $(function() {
        $( "#calendarmalendar" ).datepicker();
        $( "#calendarmalendar" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#calendarmalendar").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });


    $('#open').click(function () {
        if ($(this).text() == "expand all")
        {
            $(this).text("colapse all")
            $('.ui-accordion-header').removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({'aria-selected':'true','tabindex':'0'});
            $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
            $('.ui-accordion-content').addClass('ui-accordion-content-active').attr({'aria-expanded':'true','aria-hidden':'false'}).show();
        }
        else
        {
            $(this).text("expand all")
            $('.ui-accordion-header').removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({'aria-selected':'false','tabindex':'-1'});
            $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
            $('.ui-accordion-content').removeClass('ui-accordion-content-active').attr({'aria-expanded':'false','aria-hidden':'true'}).hide();
        }
    });



    $(function() {
        $( "#accordion" ).accordion({
            /*   heightStyle: "content",*/
            collapsible: true,
            autoHeight: false
        });
    });

    $("#accordion").accordion({ active: 0});



    datatablefunctions();

    Backbone.history.loadUrl( Backbone.history.fragment );

    $('#buttonassign').click( function() {
        // alert( table.rows('.selected').data().length +' row(s) selected' );
        var table = $('#planbudgetlists').DataTable();
        var celstring  = "";
        var rowCount = 0; // table.rows('.selected').data().length

        (table.rows('.selected')).each(function() {
            //   celstring+= this[0][rowCount] + " ";
            var idnja = table.rows('.selected')[0];
            for (var i=0; i<idnja.length; i++)
            {
                celstring+=  $("#planbudgetlists tbody tr").eq(idnja[i]).attr('id')+ " ";
            }
        });
        // alert(celstring);
        updateLineItemAssignments(celstring);

    } );



    $("body").on('click','#addBudgetLineitem', function() {
        refreshme();
    });


    $("body").on('click','.deleteLineitem', function() {
        if (confirm('Are you sure?')) {

            var blineid = this.parentNode.parentNode.getAttribute("data-lineitem-id"); //this.parentNode.parentNode.id;
            return jsRoutes.controllers.Lineitems_rd.deleteLineitem(blineid).ajax({
                context: this,
                success: function() {
                    // this.closest("tr").remove();
                    refreshme();
                },
                error: function(err) {
                    return alert("There was an error deleting the budget line item! Please refresh the page and try again.");
                }
            });
        }
    });




});

function datatablefunctions(){

    $("#planbudgetlists").DataTable({
        "sDom": 't',
        "bPaginate": false,
        "info":     false,
        "bFilter": false,
        "bSortable" : false
    });


    var table = $('#planbudgetlists').DataTable();
    $("#planbudgetlists tbody").on('click','tr', function() {
        $(this).toggleClass('selected');
    });



    var startPosition;
    var endPosition;
    $("#planbudgetlists tbody").sortable({
        cursor: "move",
        start:function(event, ui){
            startPosition = ui.item.prevAll().length + 1;
        },
        update: function(event, ui) {
            endPosition = ui.item.prevAll().length + 1;
            //   alert('Start Position: ' + startPosition + ' End Position: ' + endPosition);
            updateLineItemOrder();
        }
    });




    $('#buttonaddign').click( function() {
        // window.scrollTo(0, 0);

        $('#assigntask').show();
        /*  var offset = $(document).scrollTop();
         var viewportHeight = $(window).height();
         $('#assigntask').css('top',  (offset  + (viewportHeight/2)) - ($('#assigntask').outerHeight()/2));
         */

    } );

}

function updateLineItemOrder(){
    var celstring  = "";
    var rowCount = $('#planbudgetlists tr').length

    $('#planbudgetlists > tbody > tr').each(function() {
        //        celstring+= this.id + " ";
        celstring+= this.getAttribute("data-lineitem-id") + " "; // this.attr("data-lineitem-id") + " ";
        $(this).removeClass('selected');
    });

    jsRoutes.controllers.Plans_rd.reorderLineItems().ajax(
        {
            type: "POST",
            data: {
                lineitemsid: celstring
            },
            success: function(datasub) {
                refreshme();
            },
            error: function(err) {
                return alert("There was an error saving plan budget lines order.");
            }
        }
    );
}

function updateLineItemAssignments(linitemsspilit){


    if ($('#calendarmalendar').val() !="")
        var selectedDate = $('#calendarmalendar').val();

    jsRoutes.controllers.Plans_rd.reorderLineItemDates().ajax(
        {
            type: "POST",
            data: {
                lineitemsid: linitemsspilit,
                datesel : selectedDate
            },
            success: function(datasub) {
                //  refreshme();
                updateLineItemOrder();
                $('#assigntask').hide();
            },
            error: function(err) {
                return alert("There was an error saving plan budget lines dates.");
            }
        }
    );

}




function refreshme(){

    var planidno = $("#totals").attr("data-plan-id");
    jsRoutes.controllers.Plans_rd.reorderLineItemRefresh().ajax(
        {
            async: false,
            type: "GET",
            data: {
                planid: planidno
            },
            success: function(datasub) {
                $("#budget").empty().append(datasub);

                // tuka treba da se osvezi setot na backbone
           //     Backbone.history.loadUrl( Backbone.history.fragment );


                (function() {
                    // Backbone.history.loadUrl( Backbone.history.fragment );
                    var BudgetLineitem, BudgetLineitems;
                    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
                        for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
                        function ctor() { this.constructor = child; }
                        ctor.prototype = parent.prototype;
                        child.prototype = new ctor;
                        child.__super__ = parent.prototype;
                        return child;
                    };
                    BudgetLineitems = (function() {
                        __extends(BudgetLineitems, Backbone.View);
                        function BudgetLineitems() {
                            BudgetLineitems.__super__.constructor.apply(this, arguments);
                        }
                        BudgetLineitems.prototype.events = {
                          /*  "click    #addBudgetLineitem": "addBudgetLineitem"*/
                        };
                        BudgetLineitems.prototype.initialize = function() {
                            return this.el.find("#budgetitems").children("tr").each(function(i, lineitem) {
                                return new BudgetLineitem({
                                    el: $(lineitem)
                                });
                            });
                        };
                        return BudgetLineitems;
                    })();
                    BudgetLineitem = (function() {
                        __extends(BudgetLineitem, Backbone.View);
                        function BudgetLineitem() {
                            BudgetLineitem.__super__.constructor.apply(this, arguments);
                        }
                        BudgetLineitem.prototype.events = {
                            /*  "click    .deleteLineitem": "deleteBudgetLineitem",*/
                            "focus    .vendor>input": "loadVendorSelect",
                            "focus    .item>input": "loadItemSelect",
                            "change   .quantity,.rate": "updateBudgetLineitem",
                            "dblclick .quantity": "editBudgetLineitem"
                        };
                        BudgetLineitem.prototype.initialize = function() {
                            this.id = this.el.attr("data-lineitem-id");
                            this.vendor = this.el.find("td:eq(1)");
                            this.item = this.el.find("td:eq(2)");
                            this.quantity = this.el.find("td:eq(3) input");
                            this.rate = this.el.find("td:eq(4) input");
                            this.cost = this.el.find("td:eq(5)");
                            this.saleprice = this.el.find("td:eq(6)");
                            return this.recalculate();
                        };
                        /* BudgetLineitem.prototype.deleteBudgetLineitem = function(e) {
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
                         return alert("There was an error deleting the budget line item! Please refresh the page and try again.");
                         }
                         });
                         }
                         };*/
                        BudgetLineitem.prototype.loadVendorSelect = function(e) {
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
                                        context.vendor.attr("data-vendor-id", $(this).val());
                                        context.item.attr("data-item-id", "");
                                        context.item.attr("data-item-type-id", "");
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
                        BudgetLineitem.prototype.loadItemSelect = function(e) {
                            var context, i, target;
                            target = $(e.currentTarget);
                            i = $();
                            context = this;
                            jsRoutes.controllers.Lineitems_rd.getItemSelect().ajax({
                                context: this,
                                async: false,
                                data: {
                                    id: context.vendor.attr("data-vendor-id")
                                },
                                success: function(data) {
                                    i = $(data);
                                    i.find("option[value='" + context.item.attr("data-item-id") + "']").attr("selected", "selected");
                                    i.change(function() {
                                        var vendorItem;
                                        vendorItem = $(this).find("option:selected");
                                        context.item.attr("data-item-id", vendorItem.val());
                                        context.item.attr("data-item-type-id", vendorItem.attr("data-item-type-id"));
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
                        BudgetLineitem.prototype.editBudgetLineitem = function() {
                            var context, itemTypeId, markup, multiplier, planItems, planUnits, table, task1Budget, task1BudgetInput, task2Budget, task2BudgetInput, task3Budget, task3BudgetInput;
                            context = this;
                            planItems = $("<select/>").html($("<option/>")).change(function() {
                                context.el.attr("data-plan-item-id", $(this).val());
                                return context.rate.change();
                            });
                            $("#planitems").children("div").each(function() {
                                return planItems.append($("<option/>").html($(this).attr("class")).val($(this).attr("data-plan-item")));
                            });
                            planItems.find("option[value='" + this.el.attr("data-plan-item-id") + "']").attr("selected", "selected");
                            planUnits = $("<select/>").html($("<option/>")).append($("<option/>").html("Linear Feet").val("lnft")).append($("<option/>").html("Square Feet").val("sqft")).append($("<option/>").html("Cubic Yards").val("cuyds")).change(function() {
                                context.el.attr("data-units", $(this).val());
                                return context.rate.change();
                            });
                            planUnits.find("option[value='" + this.el.attr("data-units") + "']").attr("selected", "selected");
                            multiplier = $("<input/>").val(this.el.attr("data-multiplier")).change(function() {
                                context.el.attr("data-multiplier", $(this).val());
                                return context.rate.change();
                            });
                            markup = $("<input/>").val(this.el.attr("data-markup")).change(function() {
                                context.el.attr("data-markup", $(this).val());
                                return context.rate.change();
                            });
                            itemTypeId = this.item.attr("data-item-type-id");
                            task1Budget = parseInt(context.el.attr("data-task1-percentage"));
                            task2Budget = parseInt(context.el.attr("data-task2-percentage"));
                            task3Budget = parseInt(context.el.attr("data-task3-percentage"));
                            if (itemTypeId !== '' && task1Budget + task2Budget + task3Budget === 0) {
                                task1Budget = parseFloat($("#1-" + itemTypeId).attr("data-price-multiplier")) * 100;
                                task2Budget = parseFloat($("#2-" + itemTypeId).attr("data-price-multiplier")) * 100;
                                task3Budget = parseFloat($("#3-" + itemTypeId).attr("data-price-multiplier")) * 100;
                            }
                            task1BudgetInput = $("<input/>").css("width", "100px").attr("id", "task1Budget").attr("data-lineitem-id", this.id).val(task1Budget).change(function() {
                                var t1b, t2b;
                                t1b = parseInt($(this).val());
                                if (t1b === 100) {
                                    $("#task2Budget").val(0);
                                    $("#budgetSlider").slider("values", 1, 100);
                                    $("#task3Budget").val(0);
                                } else {
                                    t2b = $("#budgetSlider").slider("values", 1);
                                    if (t1b > t2b) {
                                        $("#task2Budget").val(0);
                                        $("#task3Budget").val(100 - t1b);
                                        $("#budgetSlider").slider("values", 1, t1b);
                                    } else {
                                        $("#task2Budget").val(t2b - t1b);
                                    }
                                }
                                $("#budgetSlider").slider("values", 0, t1b);
                                return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
                                    context: this,
                                    data: {
                                        task1Percentage: $("#task1Budget").val(),
                                        task2Percentage: $("#task2Budget").val(),
                                        task3Percentage: $("#task3Budget").val()
                                    },
                                    success: function() {
                                        context.el.attr("data-task1-percentage", $("#task1Budget").val());
                                        context.el.attr("data-task2-percentage", $("#task2Budget").val());
                                        context.el.attr("data-task3-percentage", $("#task3Budget").val());
                                        $("#total-" + context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0");
                                        return context.rate.change();
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                                    }
                                });
                            });
                            task2BudgetInput = $("<input/>").css("width", "100px").attr("id", "task2Budget").attr("data-lineitem-id", this.id).val(task2Budget).change(function() {
                                var t1b, t2b;
                                t1b = $("#budgetSlider").slider("values", 0);
                                t2b = parseInt($(this).val());
                                if (t2b === 100) {
                                    $("#task1Budget").val(0);
                                    $("#budgetSlider").slider("values", 0, 0);
                                    $("#task3Budget").val(0);
                                    $("#budgetSlider").slider("values", 2, 100);
                                } else {
                                    t1b = $("#budgetSlider").slider("values", 0);
                                    if (t1b + t2b > 100) {
                                        t1b = 100 - t2b;
                                        $("#task1Budget").val(t1b);
                                        $("#task3Budget").val(0);
                                        $("#budgetSlider").slider("values", 0, t1b);
                                    } else {
                                        $("#task3Budget").val(100 - (t1b + t2b));
                                    }
                                }
                                $("#budgetSlider").slider("values", 1, t2b + t1b);
                                return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
                                    context: this,
                                    data: {
                                        task1Percentage: $("#task1Budget").val(),
                                        task2Percentage: $("#task2Budget").val(),
                                        task3Percentage: $("#task3Budget").val()
                                    },
                                    success: function() {
                                        context.el.attr("data-task1-percentage", $("#task1Budget").val());
                                        context.el.attr("data-task2-percentage", $("#task2Budget").val());
                                        context.el.attr("data-task3-percentage", $("#task3Budget").val());
                                        $("#total-" + context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0");
                                        return context.rate.change();
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                                    }
                                });
                            });
                            task3BudgetInput = $("<input/>").css("width", "100px").attr("id", "task3Budget").attr("data-lineitem-id", this.id).val(task3Budget).change(function() {
                                var t1b, t3b;
                                t3b = parseInt($(this).val());
                                $("#task3Budget").val(t3b);
                                if (t3b === 100) {
                                    $("#task1Budget").val(0);
                                    $("#budgetSlider").slider("values", 0, 0);
                                    $("#task2Budget").val(0);
                                } else {
                                    t1b = $("#budgetSlider").slider("values", 0);
                                    if (t1b + t3b > 100) {
                                        $("#task1Budget").val(100 - t3b);
                                        $("#budgetSlider").slider("values", 0, 100 - t3b);
                                        $("#task2Budget").val(0);
                                    } else {
                                        $("#task2Budget").val(100 - (t1b + t3b));
                                    }
                                }
                                $("#budgetSlider").slider("values", 1, 100 - t3b);
                                return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
                                    context: this,
                                    data: {
                                        task1Percentage: $("#task1Budget").val(),
                                        task2Percentage: $("#task2Budget").val(),
                                        task3Percentage: $("#task3Budget").val()
                                    },
                                    success: function() {
                                        context.el.attr("data-task1-percentage", $("#task1Budget").val());
                                        context.el.attr("data-task2-percentage", $("#task2Budget").val());
                                        context.el.attr("data-task3-percentage", $("#task3Budget").val());
                                        $("#total-" + context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0");
                                        return context.rate.change();
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                                    }
                                });
                            });
                            table = $("<table/>").css("width", "100%").html($("<tr/>").append($("<td/>").html("Tie to: ").append(planItems).append("With units: ").append(planUnits).append("Multiplier:<br/>").append(multiplier).append("<br/>Markup:<br/>").append(markup)).append($("<td/>").html("Task1: ").append(task1BudgetInput).append("<br/>Task2: ").append(task2BudgetInput).append("<br/>Task3: ").append(task3BudgetInput)));
                            return $("#dialog").html(table).append("<br/><br/>").append($("<div/>").attr("id", "budgetSlider").slider({
                                range: true,
                                min: 0,
                                max: 100,
                                values: [task1Budget, task1Budget + task2Budget],
                                slide: function(e, ui) {
                                    $("#task1Budget").val(ui.values[0]);
                                    $("#task2Budget").val(ui.values[1] - ui.values[0]);
                                    return $("#task3Budget").val(100 - ui.values[1]);
                                },
                                stop: function(e, ui) {
                                    return $("#task1Budget").change();
                                }
                            })).dialog("open");
                        };
                        BudgetLineitem.prototype.updateBudgetLineitem = function(e) {
                            var q, target;
                            target = $(e.currentTarget);
                            if (target.hasClass("rate")) {
                                this.el.attr("data-rate", target.val());
                                q = 0.0;
                                if (typeof this.el.attr("data-units") !== "undefined" && this.el.attr("data-units") !== "") {
                                    if (typeof this.el.attr("data-plan-item-id") !== "undefined" && this.el.attr("data-plan-item-id") !== "") {
                                        if (($("#planitems").find("div[data-plan-item='" + this.el.attr("data-plan-item-id") + "']").length)) {
                                            q += parseFloat($("#planitems").find("div[data-plan-item='" + this.el.attr("data-plan-item-id") + "']>.planitemtotals ." + this.el.attr("data-units")).html());
                                        } else {
                                            this.el.attr("data-plan-item-id", "");
                                            this.el.attr("data-units", "");
                                        }
                                    } else {
                                        q += parseFloat($("#total" + this.el.attr("data-units")).html());
                                    }
                                    if (parseFloat(this.el.attr("data-multiplier"))) {
                                        q *= parseFloat(this.el.attr("data-multiplier"));
                                    }
                                    this.quantity.val(this.roundToHalf(q));
                                }
                            } else if (target.hasClass("quantity")) {
                                this.quantity.val(this.roundToHalf(parseFloat(this.quantity.val())));
                                this.el.attr("data-plan-item-id", "");
                                this.el.attr("data-units", "");
                            }
                            return jsRoutes.controllers.Lineitems_rd.updateLineitem(this.id).ajax({
                                context: this,
                                data: {
                                    vendor: this.vendor.attr("data-vendor-id"),
                                    item: this.item.attr("data-item-id"),
                                    itemType: this.item.attr("data-item-type-id"),
                                    planItem: this.el.attr("data-plan-item-id"),
                                    units: this.el.attr("data-units"),
                                    multiplier: this.el.attr("data-multiplier"),
                                    markup: this.el.attr("data-markup"),
                                    quantity: this.quantity.val(),
                                    rate: this.el.attr("data-rate"),
                                    saleprice: parseFloat(this.quantity.val()) * parseFloat(this.el.attr("data-rate")) / (1 - parseFloat(this.el.attr("data-markup")) / 100)
                                },
                                success: function() {
                                    if (!target.hasClass("name") && !target.hasClass("units")) {
                                        return this.recalculate();
                                    }
                                },
                                error: function(err) {
                                    return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                                }
                            });
                        };
                        BudgetLineitem.prototype.recalculate = function() {
                            var budgetTotal, fprofit, i, left, mprofit, pctprofit, ppsqft, prevTotal, sale, salecosttotal, temp, total, totalsqft, used;
                            this.rate.val(parseFloat(this.el.attr("data-rate")).toFixed(2));
                            this.el.attr("data-cost", parseFloat(this.quantity.val()) * parseFloat(this.el.attr("data-rate")));
                            this.el.attr("data-sale", parseFloat(this.el.attr("data-cost")) / (1 - parseFloat(this.el.attr("data-markup")) / 100));
                            this.cost.html(parseFloat(this.el.attr("data-cost")).toFixed(2));
                            this.saleprice.html(parseFloat(this.el.attr("data-sale")).toFixed(2));
                            total = 0;
                            salecosttotal = 0;
                            sale = 0;
                            temp = {};
                            $("#budgetitems").children("tr").each(function(i, c) {
                                var itemCost;
                                i = $(c).find(".item").attr("data-item-type-id");
                                if (typeof temp[i] === "undefined") {
                                    temp[i] = 0;
                                }
                                itemCost = parseFloat($(c).find("td:eq(3) input").val()) * parseFloat($(c).attr("data-rate"));
                                temp[i] += itemCost;
                                total += itemCost;
                                sale += itemCost / (1 - parseFloat($(c).attr("data-markup")) / 100);
                                return salecosttotal += parseFloat($(c).attr("data-sale"));
                            });
                            for (i in temp) {
                                budgetTotal = $("#total-" + i).find("td:eq(3)");
                                prevTotal = budgetTotal.html();
                                budgetTotal.html(temp[i].toFixed(2));
                                if (budgetTotal.length && budgetTotal.html() !== prevTotal) {
                                    if (($(".actualLineitem").length)) {
                                        $(".actualLineitem:first").find(".rate").change();
                                    } else {
                                        $("#actual").find("." + budgetTotal.attr("class").split(" ")[1]).each(function(j, total) {
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
                                        used = 0;
                                        $(".task ." + budgetTotal.attr("class").split(" ")[1]).parent().find(".used").each(function(j, u) {
                                            return used += parseFloat($(u).html());
                                        });
                                        budgetTotal.parent().find(".used").html(used.toFixed(2));
                                        budgetTotal.parent().find(".left").html((parseFloat(budgetTotal.html()) - used).toFixed(2));
                                    }
                                }
                            }
                            if ($("#saleitems>table>tbody>tr").length === 0) {
                                $("#saleprice>span").html(sale.toFixed(2));
                                $("#totals").attr("data-sale", sale);
                            } else {
                                sale = parseFloat($("#totals").attr("data-sale"));
                            }
                            $("#actual .saleprice").html(sale.toFixed(2));
                            $("#totals").attr("data-cost", total);
                            ppsqft = 0;
                            totalsqft = parseFloat($("#totalsqft").html());
                            if (totalsqft > 0) {
                                ppsqft = sale / totalsqft;
                            }
                            $("#totals").attr("data-ppsqft", ppsqft);
                            pctprofit = 0;
                            if (sale > 0) {
                                pctprofit = 100 * (1 - total / sale);
                            }
                            $("#ppsqft").html(ppsqft.toFixed(2));
                            $("#totalcost").html(total.toFixed(2));
                            $("#totalsale").html(salecosttotal.toFixed(2));
                            if (($("#actual").length)) {
                                $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
                                if ($("#actual .cost").html() !== "") {
                                    $("#actual .markup").html((parseFloat($("#actual .cost").html()) / sale).toFixed(2));
                                }
                                if ($("#actual .actualcost").html() !== "") {
                                    $("#actual .actualmarkup").html((parseFloat($("#actual .actualcost").html()) / sale).toFixed(2));
                                }
                                left = parseFloat($("#actual .diffcost").html());
                                mprofit = ((sale-total)>0)?(left>0)?((sale-total)*.15+left*.5):((sale-total)*.15+left):0;
                                fprofit = ((sale-total)>0)?(left>0)?((sale-total)*.85+left*.5):((sale-total)*.85):(sale-total);
                                $("#managerprofit").html(mprofit.toFixed(2));
                                return $("#ffiprofit").html(fprofit.toFixed(2));
                            }
                        };
                        BudgetLineitem.prototype.roundToHalf = function(converted) {
                            var decimal;
                            if (converted < .5) {
                                return converted.toFixed(1);
                            } else {
                                decimal = converted - parseInt(converted, 10);
                                decimal = Math.round(decimal * 10);
                                if (decimal === 5) {
                                    return parseInt(converted, 10) + 0.5;
                                } else {
                                    if (decimal < 3 || decimal > 7) {
                                        return Math.round(converted);
                                    } else {
                                        return parseInt(converted, 10) + 0.5;
                                    }
                                }
                            }
                        };

                        return BudgetLineitem;
                    })();
                    $(function() {
//        Backbone.history.loadUrl( Backbone.history.fragment );
                        var lineitems;
                        return lineitems = new BudgetLineitems({
                            el: $("#budget")
                        });
                    });
                }).call(this);


                $("#planbudgetlists").DataTable({
                    "sDom": 't',
                    "bPaginate": false,
                    "info":     false,
                    "bFilter": false,
                    "bSortable" : false
                });

                $("#planbudgetlists tbody").on('click','tr', function() {
                    $(this).toggleClass('selected');
                });

                var startPosition;
                var endPosition;
                $("#planbudgetlists tbody").sortable({
                    cursor: "move",
                    start:function(event, ui){
                        startPosition = ui.item.prevAll().length + 1;
                    },
                    update: function(event, ui) {
                        endPosition = ui.item.prevAll().length + 1;
                        updateLineItemOrder();

                    }
                });

                $('#buttonaddign').click( function() {
                    $('#assigntask').show();
                } );

            },
            error: function(err) {
                return alert("There was an error refreshing plan budget lines.");
            }
        }

    );
}


(function() {
    // Backbone.history.loadUrl( Backbone.history.fragment );
    var BudgetLineitem, BudgetLineitems;
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
    };
    BudgetLineitems = (function() {
        __extends(BudgetLineitems, Backbone.View);
        function BudgetLineitems() {
            BudgetLineitems.__super__.constructor.apply(this, arguments);
        }
        BudgetLineitems.prototype.events = {
            "click    #addBudgetLineitem": "addBudgetLineitem"
        };
        BudgetLineitems.prototype.initialize = function() {
            return this.el.find("#budgetitems").children("tr").each(function(i, lineitem) {
                return new BudgetLineitem({
                    el: $(lineitem)
                });
            });
        };
        BudgetLineitems.prototype.addBudgetLineitem = function(e) {
            var target;
            target = $(e.currentTarget);

            return jsRoutes.controllers.Lineitems_rd.addBudgetLineitem().ajax({
                data: {
                    job: $("#totals").attr("data-job-id"),
                    plan: $("#totals").attr("data-plan-id")
                },
                success: function(data) {

                    var _view;
                    return _view = new BudgetLineitem({
                        el: $(data).appendTo("#budgetitems")
                    });
                    refreshme();
                },
                error: function(err) {
                    return alert("There was an error adding the budget line item! Please refresh the page and try again.");
                }
            });
        };
        return BudgetLineitems;
    })();
    BudgetLineitem = (function() {
        __extends(BudgetLineitem, Backbone.View);
        function BudgetLineitem() {
            BudgetLineitem.__super__.constructor.apply(this, arguments);
        }
        BudgetLineitem.prototype.events = {
          /*  "click    .deleteLineitem": "deleteBudgetLineitem",*/
            "focus    .vendor>input": "loadVendorSelect",
            "focus    .item>input": "loadItemSelect",
            "change   .quantity,.rate": "updateBudgetLineitem",
            "dblclick .quantity": "editBudgetLineitem"
        };
        BudgetLineitem.prototype.initialize = function() {
            this.id = this.el.attr("data-lineitem-id");
            this.vendor = this.el.find("td:eq(1)");
            this.item = this.el.find("td:eq(2)");
            this.quantity = this.el.find("td:eq(3) input");
            this.rate = this.el.find("td:eq(4) input");
            this.cost = this.el.find("td:eq(5)");
            this.saleprice = this.el.find("td:eq(6)");
            return this.recalculate();
        };
      /* BudgetLineitem.prototype.deleteBudgetLineitem = function(e) {
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
                        return alert("There was an error deleting the budget line item! Please refresh the page and try again.");
                    }
                });
            }
        };*/
        BudgetLineitem.prototype.loadVendorSelect = function(e) {
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
                        context.vendor.attr("data-vendor-id", $(this).val());
                        context.item.attr("data-item-id", "");
                        context.item.attr("data-item-type-id", "");
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
        BudgetLineitem.prototype.loadItemSelect = function(e) {
            var context, i, target;
            target = $(e.currentTarget);
            i = $();
            context = this;
            jsRoutes.controllers.Lineitems_rd.getItemSelect().ajax({
                context: this,
                async: false,
                data: {
                    id: context.vendor.attr("data-vendor-id")
                },
                success: function(data) {
                    i = $(data);
                    i.find("option[value='" + context.item.attr("data-item-id") + "']").attr("selected", "selected");
                    i.change(function() {
                        var vendorItem;
                        vendorItem = $(this).find("option:selected");
                        context.item.attr("data-item-id", vendorItem.val());
                        context.item.attr("data-item-type-id", vendorItem.attr("data-item-type-id"));
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
        BudgetLineitem.prototype.editBudgetLineitem = function() {
            var context, itemTypeId, markup, multiplier, planItems, planUnits, table, task1Budget, task1BudgetInput, task2Budget, task2BudgetInput, task3Budget, task3BudgetInput;
            context = this;
            planItems = $("<select/>").html($("<option/>")).change(function() {
                context.el.attr("data-plan-item-id", $(this).val());
                return context.rate.change();
            });
            $("#planitems").children("div").each(function() {
                return planItems.append($("<option/>").html($(this).attr("class")).val($(this).attr("data-plan-item")));
            });
            planItems.find("option[value='" + this.el.attr("data-plan-item-id") + "']").attr("selected", "selected");
            planUnits = $("<select/>").html($("<option/>")).append($("<option/>").html("Linear Feet").val("lnft")).append($("<option/>").html("Square Feet").val("sqft")).append($("<option/>").html("Cubic Yards").val("cuyds")).change(function() {
                context.el.attr("data-units", $(this).val());
                return context.rate.change();
            });
            planUnits.find("option[value='" + this.el.attr("data-units") + "']").attr("selected", "selected");
            multiplier = $("<input/>").val(this.el.attr("data-multiplier")).change(function() {
                context.el.attr("data-multiplier", $(this).val());
                return context.rate.change();
            });
            markup = $("<input/>").val(this.el.attr("data-markup")).change(function() {
                context.el.attr("data-markup", $(this).val());
                return context.rate.change();
            });
            itemTypeId = this.item.attr("data-item-type-id");
            task1Budget = parseInt(context.el.attr("data-task1-percentage"));
            task2Budget = parseInt(context.el.attr("data-task2-percentage"));
            task3Budget = parseInt(context.el.attr("data-task3-percentage"));
            if (itemTypeId !== '' && task1Budget + task2Budget + task3Budget === 0) {
                task1Budget = parseFloat($("#1-" + itemTypeId).attr("data-price-multiplier")) * 100;
                task2Budget = parseFloat($("#2-" + itemTypeId).attr("data-price-multiplier")) * 100;
                task3Budget = parseFloat($("#3-" + itemTypeId).attr("data-price-multiplier")) * 100;
            }
            task1BudgetInput = $("<input/>").css("width", "100px").attr("id", "task1Budget").attr("data-lineitem-id", this.id).val(task1Budget).change(function() {
                var t1b, t2b;
                t1b = parseInt($(this).val());
                if (t1b === 100) {
                    $("#task2Budget").val(0);
                    $("#budgetSlider").slider("values", 1, 100);
                    $("#task3Budget").val(0);
                } else {
                    t2b = $("#budgetSlider").slider("values", 1);
                    if (t1b > t2b) {
                        $("#task2Budget").val(0);
                        $("#task3Budget").val(100 - t1b);
                        $("#budgetSlider").slider("values", 1, t1b);
                    } else {
                        $("#task2Budget").val(t2b - t1b);
                    }
                }
                $("#budgetSlider").slider("values", 0, t1b);
                return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
                    context: this,
                    data: {
                        task1Percentage: $("#task1Budget").val(),
                        task2Percentage: $("#task2Budget").val(),
                        task3Percentage: $("#task3Budget").val()
                    },
                    success: function() {
                        context.el.attr("data-task1-percentage", $("#task1Budget").val());
                        context.el.attr("data-task2-percentage", $("#task2Budget").val());
                        context.el.attr("data-task3-percentage", $("#task3Budget").val());
                        $("#total-" + context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0");
                        return context.rate.change();
                    },
                    error: function(err) {
                        return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                    }
                });
            });
            task2BudgetInput = $("<input/>").css("width", "100px").attr("id", "task2Budget").attr("data-lineitem-id", this.id).val(task2Budget).change(function() {
                var t1b, t2b;
                t1b = $("#budgetSlider").slider("values", 0);
                t2b = parseInt($(this).val());
                if (t2b === 100) {
                    $("#task1Budget").val(0);
                    $("#budgetSlider").slider("values", 0, 0);
                    $("#task3Budget").val(0);
                    $("#budgetSlider").slider("values", 2, 100);
                } else {
                    t1b = $("#budgetSlider").slider("values", 0);
                    if (t1b + t2b > 100) {
                        t1b = 100 - t2b;
                        $("#task1Budget").val(t1b);
                        $("#task3Budget").val(0);
                        $("#budgetSlider").slider("values", 0, t1b);
                    } else {
                        $("#task3Budget").val(100 - (t1b + t2b));
                    }
                }
                $("#budgetSlider").slider("values", 1, t2b + t1b);
                return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
                    context: this,
                    data: {
                        task1Percentage: $("#task1Budget").val(),
                        task2Percentage: $("#task2Budget").val(),
                        task3Percentage: $("#task3Budget").val()
                    },
                    success: function() {
                        context.el.attr("data-task1-percentage", $("#task1Budget").val());
                        context.el.attr("data-task2-percentage", $("#task2Budget").val());
                        context.el.attr("data-task3-percentage", $("#task3Budget").val());
                        $("#total-" + context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0");
                        return context.rate.change();
                    },
                    error: function(err) {
                        return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                    }
                });
            });
            task3BudgetInput = $("<input/>").css("width", "100px").attr("id", "task3Budget").attr("data-lineitem-id", this.id).val(task3Budget).change(function() {
                var t1b, t3b;
                t3b = parseInt($(this).val());
                $("#task3Budget").val(t3b);
                if (t3b === 100) {
                    $("#task1Budget").val(0);
                    $("#budgetSlider").slider("values", 0, 0);
                    $("#task2Budget").val(0);
                } else {
                    t1b = $("#budgetSlider").slider("values", 0);
                    if (t1b + t3b > 100) {
                        $("#task1Budget").val(100 - t3b);
                        $("#budgetSlider").slider("values", 0, 100 - t3b);
                        $("#task2Budget").val(0);
                    } else {
                        $("#task2Budget").val(100 - (t1b + t3b));
                    }
                }
                $("#budgetSlider").slider("values", 1, 100 - t3b);
                return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
                    context: this,
                    data: {
                        task1Percentage: $("#task1Budget").val(),
                        task2Percentage: $("#task2Budget").val(),
                        task3Percentage: $("#task3Budget").val()
                    },
                    success: function() {
                        context.el.attr("data-task1-percentage", $("#task1Budget").val());
                        context.el.attr("data-task2-percentage", $("#task2Budget").val());
                        context.el.attr("data-task3-percentage", $("#task3Budget").val());
                        $("#total-" + context.el.find(".item").attr("data-item-type-id")).find("td:eq(3)").html("0");
                        return context.rate.change();
                    },
                    error: function(err) {
                        return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                    }
                });
            });
            table = $("<table/>").css("width", "100%").html($("<tr/>").append($("<td/>").html("Tie to: ").append(planItems).append("With units: ").append(planUnits).append("Multiplier:<br/>").append(multiplier).append("<br/>Markup:<br/>").append(markup)).append($("<td/>").html("Task1: ").append(task1BudgetInput).append("<br/>Task2: ").append(task2BudgetInput).append("<br/>Task3: ").append(task3BudgetInput)));
            return $("#dialog").html(table).append("<br/><br/>").append($("<div/>").attr("id", "budgetSlider").slider({
                range: true,
                min: 0,
                max: 100,
                values: [task1Budget, task1Budget + task2Budget],
                slide: function(e, ui) {
                    $("#task1Budget").val(ui.values[0]);
                    $("#task2Budget").val(ui.values[1] - ui.values[0]);
                    return $("#task3Budget").val(100 - ui.values[1]);
                },
                stop: function(e, ui) {
                    return $("#task1Budget").change();
                }
            })).dialog("open");
        };
        BudgetLineitem.prototype.updateBudgetLineitem = function(e) {
            var q, target;
            target = $(e.currentTarget);
            if (target.hasClass("rate")) {
                this.el.attr("data-rate", target.val());
                q = 0.0;
                if (typeof this.el.attr("data-units") !== "undefined" && this.el.attr("data-units") !== "") {
                    if (typeof this.el.attr("data-plan-item-id") !== "undefined" && this.el.attr("data-plan-item-id") !== "") {
                        if (($("#planitems").find("div[data-plan-item='" + this.el.attr("data-plan-item-id") + "']").length)) {
                            q += parseFloat($("#planitems").find("div[data-plan-item='" + this.el.attr("data-plan-item-id") + "']>.planitemtotals ." + this.el.attr("data-units")).html());
                        } else {
                            this.el.attr("data-plan-item-id", "");
                            this.el.attr("data-units", "");
                        }
                    } else {
                        q += parseFloat($("#total" + this.el.attr("data-units")).html());
                    }
                    if (parseFloat(this.el.attr("data-multiplier"))) {
                        q *= parseFloat(this.el.attr("data-multiplier"));
                    }
                    this.quantity.val(this.roundToHalf(q));
                }
            } else if (target.hasClass("quantity")) {
                this.quantity.val(this.roundToHalf(parseFloat(this.quantity.val())));
                this.el.attr("data-plan-item-id", "");
                this.el.attr("data-units", "");
            }
            return jsRoutes.controllers.Lineitems_rd.updateLineitem(this.id).ajax({
                context: this,
                data: {
                    vendor: this.vendor.attr("data-vendor-id"),
                    item: this.item.attr("data-item-id"),
                    itemType: this.item.attr("data-item-type-id"),
                    planItem: this.el.attr("data-plan-item-id"),
                    units: this.el.attr("data-units"),
                    multiplier: this.el.attr("data-multiplier"),
                    markup: this.el.attr("data-markup"),
                    quantity: this.quantity.val(),
                    rate: this.el.attr("data-rate"),
                    saleprice: parseFloat(this.quantity.val()) * parseFloat(this.el.attr("data-rate")) / (1 - parseFloat(this.el.attr("data-markup")) / 100)
                },
                success: function() {
                    if (!target.hasClass("name") && !target.hasClass("units")) {
                        return this.recalculate();
                    }
                },
                error: function(err) {
                    return alert("There was an error updating the budget line item! Please refresh the page and try again.");
                }
            });
        };
        BudgetLineitem.prototype.recalculate = function() {
            var budgetTotal, fprofit, i, left, mprofit, pctprofit, ppsqft, prevTotal, sale, salecosttotal, temp, total, totalsqft, used;
            this.rate.val(parseFloat(this.el.attr("data-rate")).toFixed(2));
            this.el.attr("data-cost", parseFloat(this.quantity.val()) * parseFloat(this.el.attr("data-rate")));
            this.el.attr("data-sale", parseFloat(this.el.attr("data-cost")) / (1 - parseFloat(this.el.attr("data-markup")) / 100));
            this.cost.html(parseFloat(this.el.attr("data-cost")).toFixed(2));
            this.saleprice.html(parseFloat(this.el.attr("data-sale")).toFixed(2));
            total = 0;
            salecosttotal = 0;
            sale = 0;
            temp = {};
            $("#budgetitems").children("tr").each(function(i, c) {
                var itemCost;
                i = $(c).find(".item").attr("data-item-type-id");
                if (typeof temp[i] === "undefined") {
                    temp[i] = 0;
                }
                itemCost = parseFloat($(c).find("td:eq(3) input").val()) * parseFloat($(c).attr("data-rate"));
                temp[i] += itemCost;
                total += itemCost;
                sale += itemCost / (1 - parseFloat($(c).attr("data-markup")) / 100);
                return salecosttotal += parseFloat($(c).attr("data-sale"));
            });
            for (i in temp) {
                budgetTotal = $("#total-" + i).find("td:eq(3)");
                prevTotal = budgetTotal.html();
                budgetTotal.html(temp[i].toFixed(2));
                if (budgetTotal.length && budgetTotal.html() !== prevTotal) {
                    if (($(".actualLineitem").length)) {
                        $(".actualLineitem:first").find(".rate").change();
                    } else {
                        $("#actual").find("." + budgetTotal.attr("class").split(" ")[1]).each(function(j, total) {
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
                        used = 0;
                        $(".task ." + budgetTotal.attr("class").split(" ")[1]).parent().find(".used").each(function(j, u) {
                            return used += parseFloat($(u).html());
                        });
                        budgetTotal.parent().find(".used").html(used.toFixed(2));
                        budgetTotal.parent().find(".left").html((parseFloat(budgetTotal.html()) - used).toFixed(2));
                    }
                }
            }
            if ($("#saleitems>table>tbody>tr").length === 0) {
                $("#saleprice>span").html(sale.toFixed(2));
                $("#totals").attr("data-sale", sale);
            } else {
                sale = parseFloat($("#totals").attr("data-sale"));
            }
            $("#actual .saleprice").html(sale.toFixed(2));
            $("#totals").attr("data-cost", total);
            ppsqft = 0;
            totalsqft = parseFloat($("#totalsqft").html());
            if (totalsqft > 0) {
                ppsqft = sale / totalsqft;
            }
            $("#totals").attr("data-ppsqft", ppsqft);
            pctprofit = 0;
            if (sale > 0) {
                pctprofit = 100 * (1 - total / sale);
            }
            $("#ppsqft").html(ppsqft.toFixed(2));
            $("#totalcost").html(total.toFixed(2));
            $("#totalsale").html(salecosttotal.toFixed(2));
            if (($("#actual").length)) {
                $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
                if ($("#actual .cost").html() !== "") {
                    $("#actual .markup").html((parseFloat($("#actual .cost").html()) / sale).toFixed(2));
                }
                if ($("#actual .actualcost").html() !== "") {
                    $("#actual .actualmarkup").html((parseFloat($("#actual .actualcost").html()) / sale).toFixed(2));
                }
                left = parseFloat($("#actual .diffcost").html());
                mprofit = ((sale-total)>0)?(left>0)?((sale-total)*.15+left*.5):((sale-total)*.15+left):0;
                fprofit = ((sale-total)>0)?(left>0)?((sale-total)*.85+left*.5):((sale-total)*.85):(sale-total);
                $("#managerprofit").html(mprofit.toFixed(2));
                return $("#ffiprofit").html(fprofit.toFixed(2));
            }
        };
        BudgetLineitem.prototype.roundToHalf = function(converted) {
            var decimal;
            if (converted < .5) {
                return converted.toFixed(1);
            } else {
                decimal = converted - parseInt(converted, 10);
                decimal = Math.round(decimal * 10);
                if (decimal === 5) {
                    return parseInt(converted, 10) + 0.5;
                } else {
                    if (decimal < 3 || decimal > 7) {
                        return Math.round(converted);
                    } else {
                        return parseInt(converted, 10) + 0.5;
                    }
                }
            }
        };

        return BudgetLineitem;
    })();
    $(function() {
//        Backbone.history.loadUrl( Backbone.history.fragment );
        var lineitems;
        return lineitems = new BudgetLineitems({
            el: $("#budget")
        });
    });
}).call(this);



/*

$("body").on('click','#addBudgetLineitem', function() {
    refreshme();
});*/