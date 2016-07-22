$(document).ready(function() {

        var loadCustomerSelect, loadPlanSelect, loadSubdivisionSelect;
/*        $(".openJob,.openTask").live("click", function(e) {*/
        $("body").on("click", ".openJob,.openTask", function(e) {
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
                                if (data.id != ""){
                                    location.reload();
                                }else {
                                    // not json
                                    $(data).appendTo($("tr[data-crew='" + $("#crew").val() + "']").find("ol[data-date='" + $("#date").val() + "']"));
                                    return $("#marketSelect").remove();
                                }


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
        $("#gotoDatePicker").datepicker({
            showOn: "button",
            buttonImageOnly: true,
            buttonImage: "/assets/images/calendar.gif",
            dateFormat: "yy-mm-dd",
            defaultDate: new Date($("#gotoDatePicker").val().split("-")[0], $("#gotoDatePicker").val().split("-")[1] - 1, $("#gotoDatePicker").val().split("-")[2]),
            onSelect: function(dateText, inst) {
                return window.location.href = "?date=" + dateText + "&market=" + $("#calMarketSelect").val() + "&manager=" + $("#calManagerSelect").val() + "&category=" + $("#calCategorySelect").val();
            }
        });
        $("ol").dragsort({
            dragSelector: "li strong",
            dragBetween: true,
            placeHolderTemplate: "<li><strong>+</strong></li>",
            dragEnd: function() {
                var cardOrder, id;
                id = $(this).attr("data-task-id");
                cardOrder = 1;
                $(this).parent().children("li").each(function(i, r) {
                    if ($(this).attr("data-task-id") === id) {
                        return cardOrder += i;
                    }
                });
                $(this).find("strong").html(cardOrder);

                jsRoutes.controllers.Assignes_rd.updateAssign(id).ajax({
                    data: {
                        date: $(this).parent().attr("data-date")
                    },
                    success: function(data) {

                    },
                    error: function(err) {
                       alert("There was an error reordering the tasks! Please refresh the page and try again.");
                    }
                });
                return jsRoutes.controllers.Tasks_rd.updateTask(id).ajax({
                    data: {
                        crew: $(this).parent().parent().parent().attr("data-crew"),
                        cardOrder: cardOrder,
                        date: $(this).parent().attr("data-date")
                    },
                    success: function(data) {
                        var task, _i, _len, _results;
                        _results = [];
                        for (_i = 0, _len = data.length; _i < _len; _i++) {
                            task = data[_i];
                            _results.push($("li[data-task-id='" + task.id + "']>strong").html(task.cardOrder));
                        }
                        return _results;
                    },
                    error: function(err) {
                        return alert("There was an error reordering the tasks! Please refresh the page and try again.");
                    }
                });
            }
        });
        $("#calHead select").change(function() {
            return window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&manager=" + $("#calManagerSelect").val() + "&category=" + $("#calCategorySelect").val();
        });
        loadCustomerSelect = function() {
            var c;
            c = $();
            jsRoutes.controllers.Jobs_rd.getCustomerSelect().ajax({
                async: false,
                data: {
                    market: $("#marketSelect").find("option:selected").val()
                },
                success: function(data) {
                    c = $(data);
                    return c.change(function() {
                        $("#marketSelect").find("option[value='" + $(this).find("option:selected").attr("data-market-id") + "']").attr("selected", "selected");
                        $("#subdivisionSelect").replaceWith(loadSubdivisionSelect());
                        return $("#planSelect").replaceWith(loadPlanSelect());
                    });
                },
                error: function(err) {
                    return alert("There was an error loading the customers! Please refresh the page and try again.");
                }
            });
            return c;
        };
        loadSubdivisionSelect = function() {
            var context, s;
            s = $();
            context = this;
            jsRoutes.controllers.Jobs_rd.getSubdivisionSelect().ajax({
                context: this,
                async: false,
                data: {
                    customer: $("#customerSelect").find("option:selected").val()
                },
                success: function(data) {
                    return s = $(data);
                },
                error: function(err) {
                    return alert("There was an error loading the subdivisions! Please refresh the page and try again.");
                }
            });
            return s;
        };
        loadPlanSelect = function() {
            var context, p;
            p = $();
            context = this;
            jsRoutes.controllers.Jobs_rd.getPlanSelect().ajax({
                context: this,
                async: false,
                data: {
                    customer: $("#customerSelect").find("option:selected").val()
                },
                success: function(data) {
                    return p = $(data);
                },
                error: function(err) {
                    return alert("There was an error loading the plans! Please refresh the page and try again.");
                }
            });
            return p;
        };
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
            // staroto gore
          //  return window.open("/calendar/jobcards?withrates=" + confirm("Show rates?") + "&date=" + $(this).attr("data-date") + parms);


            // za pdf kako printjob card dolu
          //   return window.open("/report/front/calendar/print?date=" + $(this).attr("data-date") + parms);

            // NAJNOVO SO DATATABLES
            return window.open("/report/front/calendar/calendarjobcrewfront?date=" + $(this).attr("data-date") + parms);


        });


        return $("#itemReport").click(function() {
            var parms;
            parms = (window.location.href.indexOf("?")!=-1)?"?"+window.location.href.split("?")[1]:"";
            return window.open("/calendar/items" + parms);
        });




})



$(document).ready(function(){
    $(".ui-dialog").hide();



    $('input:checkbox.checkreschedule').each(function() {
        $(this).removeAttr('checked');
    });


    $(function() {
        $( "#jobstartdatepicker" ).datepicker();
        $( "#jobstartdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        //  $( "#jobstartdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });



    $(function() {
        $( "#taskstartdatepicker" ).datepicker();
        $( "#taskstartdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        //  $( "#jobstartdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });

    $(".close").click(function() {
        $('#planmodam').hide();
        $('#taskmodal').hide();

    });

    $("#close").click(function() {
        $('#planmodam').hide();
        $('#taskmodal').hide();
    });


    $("#closeT").click(function() {
        $('#taskmodal').hide();
    });


    $("#planmodam").hide();
    $('#taskmodal').hide();

    $(".reschedule").click(function() {


        $('#taskmodal').show();




    });

    $("#movejobs").click(function() {
    // find all with checkreschedule
        var selectedjobs = [];
        var selectedtasks = [];
        var removedjobs = [];
        $('input:checkbox.checkreschedule').each(function() {
            if (this.checked) {
                selectedjobs.push($(this).attr('data-job-id'));
                selectedtasks.push($(this).attr('data-task-id'));
            }
        });
      /*  console.log(selectedjobs);
        console.log(selectedtasks);*/
        // DA SE POMESTAT SITE TASKOVI SO SE SELEKTIRANIOT POCNUVAJKI OD DATUMOT STO KE GO OBEZBEDAT
        // (DALI DA PRASUVA ZA SEKOJ TASK POSEBNO) ?

        // remove duplicate from array

        var uniqueselectedjobs = [];
        var uniqueselectedtasks = [];
        var m=1;
        $.each(selectedjobs, function(i, el){
            if($.inArray(el, uniqueselectedjobs) === -1) {
                uniqueselectedjobs.push(el);
                removedjobs.push(i);
            }

        });

        //    console.log(removedjobs);

        $.each(selectedtasks, function(i, el){
            var remove = false;
            $.each(removedjobs, function(j, elr){
                if(i==elr){
                    remove = true;
                }
            });
            if (remove)
                uniqueselectedtasks.push(el);
          //  console.log(remove + " " + el );

        });


        console.log(uniqueselectedjobs);
        console.log(uniqueselectedtasks);



            jsRoutes.controllers.Jobs_rd.rescheduleCalendarTasks().ajax(
                {
                    cache: false,
                    data: {
                        date:   $("#taskstartdatepicker").val(),
                        jobid : JSON.stringify(uniqueselectedjobs) ,
                        taskid: JSON.stringify(uniqueselectedtasks)
                    },
                    success: function(data) {
                        location.reload();
                    },
                    error: function(err) {
                        return alert("There was an error moving the task! Please check calendar, refresh the page and try again.");
                    }
                }
            );

    });


    $(".openTaskMask").click(function() {


        $("#quantity").val('');
        $("#rate").val('');
        $("#seelcttedjob").val($(this).attr('data-job-id'));
        $('#note').val('');
        $("#planmodam").show();


        // find all with checkreschedule
        /*var selectedjobs = [];
        var selectedtasks = [];

                selectedjobs.push($(this).attr('data-job-id'));
                selectedtasks.push($(this).attr('data-task-id'));

        console.log(selectedjobs);
        console.log(selectedtasks);*/
        // DA SE OTVORI MODAL ZA DA SE DODADE BUDGET LINE ITEM NOV

    });


    $("#buttonaddplan").click(function() {
           /* var quantity =  $("#quantity" ).val();
            var rate =  $("#rate" ).val();*/
            var quantity = 0;
            var rate =  0;
            var selectedjob =  $("#seelcttedjob" ).val();
            var taskdate = $('#jobstartdatepicker').val();
            var note =  $('#note').val();
            var item = $( "#selectItem option:selected" ).val();

        var taskid = 0;

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/taskslabor?jobid='+selectedjob+"&note="+note+"&taskdate="+taskdate,
            success: function(datana) {
                // console.log(datana['id']);
                taskid = datana['id'];
                // tuka treba da se zapise nov lineitem za toj task za da se pojavi na bli

                if (!taskid==0)
                {
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: '/jobs/lineitems/addlinecalendarlabor?selectedJob='+selectedjob+"&itemtype=1&item="+item+"&quantity="+quantity+"&rate="+rate+"&taskidno="+taskid+"&dateactual="+taskdate,
                        success: function(ddata) {
                          //  console.log(ddata['id']);
                            $("#planmodam").hide();
                            location.reload();
                        },
                        error: function (result) {
                            alert('Some error occurred while retrieving job task list. ');
                        }
                    });
                }
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        //alert(quantity + " " + rate + " " + selectedjob + " " + taskdate +" " + note);



    });



})