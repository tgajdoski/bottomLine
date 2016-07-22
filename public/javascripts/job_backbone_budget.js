$(window).on('load', function() {
    $('#jobbudgetlists').DataTable().destroy();
    $('#budgetitems').removeData();
   // console.log("na load");
});

$(document).ready(function() {

    $("#calendarmalendar").datepicker({
        onSelect: function() {
            // alert("zedov datum"+ this.value);
            // treba da proverime dali ima na toj datum task i ako ima da mu go zemime note-od
            // zemi task od job_id i od datumot
            // selectedJob i this.value
            jsRoutes.controllers.Jobs_rd.getTaskNotesPerDay().ajax({
                data: {
                    jobid: $("#totals").attr("data-job-id"),
                    datumo: this.value
                },
                cache: false,
                success: function(data) {
                    if (data!=null && data!='')
                        $("#notes").val(data);
                },
                error: function(err) {
                }
            });
        }
    });


    $(window).on('beforeunload', function() {
          $('#jobbudgetlists').DataTable().destroy();
          $('#jobbudgetlists').removeData();
    });


    $(window).unload(function() {
      //  $('#jobbudgetlists').DataTable().destroy();
      //  $('#jobbudgetlists').removeData();
        location.reload(true);
    });




    $(function() {
        $( "#jobstartdatepicker" ).datepicker();
        $( "#jobstartdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        //  $( "#jobstartdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });




    $("#buttonReschedule").click(function(){
        var jobidno = $("#totals").attr("data-job-id");

            jsRoutes.controllers.Jobs_rd.rescheduleTasks().ajax(
                {
                    cache: false,
                    data: {
                        date:   $("#jobstartdatepicker").val(),
                        jobid : jobidno
                     },
                    success: function(data) {
                            refreshme();
                    },
                    error: function(err) {
                        return alert("There was an error adding the job! Please check your plan, refresh the page and try again.");
                    }
                }
            );
    });


    $("#groupcheck").prop("checked", true);

    $('#assigntask').hide();
    $('#updateTask').hide();
    $('#lineitemlist').hide();


    var d = new Date();
    var jobMarket = 0;
    var selectedJob = 0;
    var postojatstari = 0;

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
    $(function() {
        $( "#accordionON" ).accordion({
            heightStyle: "content",
            collapsible: true
        });
    });

    $('#oldversion').click(function () {
        var jobidno = $("#totals").attr("data-job-id");
        window.open("/jobsold/"+jobidno);
    });

    $(".close").click(function() {

        refreshme();
        refreshmeactuals();

        $('#assigntask').hide();
      //  $('body').scrollTo(scrollPos);

    });
    $("#close").click(function() {


        refreshme();
        refreshmeactuals();

        $('#assigntask').hide();
      //  $('body').scrollTo(scrollPos);

    });

    $(".closeeA").click(function() {
        $('#updateTask').hide();
    });
    $("#closeeA").click(function() {
        $('#updateTask').hide();
    });

    $(".closeeB").click(function() {
        $('#lineitemlist').hide();
    });
    $("#closeeB").click(function() {
        $('#lineitemlist').hide();
    });





    $(function() {
        $( "#calendarmalendar" ).datepicker();
        $( "#calendarmalendar" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#calendarmalendar").val($.datepicker.formatDate('yy-mm-dd', new Date()));

        $( "#calendarmalendarA" ).datepicker();
        $( "#calendarmalendarA" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#calendarmalendarA").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });

    $("body").on('change','#groupcheck', function() {
    // $('#groupcheck').change(function(){
        cb = $(this);
        cb.val(cb.prop('checked'));

    });




    $("#updatetaskon").click(function() {

            jsRoutes.controllers.Tasks_rd.updateTask(this.getAttribute("data-task-id")).ajax({
                data: {
                    cache: false,
                    crew: $("#boxA").val(),
                    cardOrder: $("#orderA").val(),
                    date: $("#calendarmalendarA").val(),
                    notes:  $("#notesA").val(),
                    manager:  $("#crewleaderA").val()

            },
            success: function(data) {
                refreshme();
              //  goToByScroll("budget");
            },
            error: function(err) {
                return alert("There was an error updating the task! Please refresh the page and try again.");
            }
           });
            $('#updateTask').hide();
    });

    //  var table = $('#jobbudgetlists').DataTable();
    $("body").on('click','#jobbudgetlists tbody tr', function(event) {
        //  var oTable = $('#jobbudgetlists').DataTable();
        var toogle = $(this).find('td:last').html().toString();
        var datumstringoy =  $(this).find('td:eq(7)').html().toString();

        // tuka treba
        // setiraj go calendarot na datetask
     //   var st = "01.26.2015";
        var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
        var dateoncal = new Date(datumstringoy.replace(pattern,'$3-$1-$2')+ "T12:00:00");
       // console.log(dateoncal);
//        $( "#calendarmalendar").val($.datepicker.formatDate('yy-mm-dd', dateoncal));

        if (!(event.target.id == "itemSelect" ||  event.target.id == "vendorSelect" || event.target.className == "quantity"  || event.target.className == "deleteLineitem"  || event.target.className == "editTasks" || event.target.className == "needitTasks" || event.target.className == "rate" || event.target.className == 'checkActuals' ||     event.target.className == 'editTask' || event.target.className == 'verifybutt'))
        {
      /*     $('#jobbudgetlists').DataTable( {
         "sDom": 't',
         "bPaginate": false,
         "info":     false,
         "bFilter": false,
         'bSortable' : false,
         'bDestroy': true

         });*/


            if ($('#groupcheck').is(":checked"))
            {
                // grupno klikanje
               // if(toogle.indexOf("verified") !=-1)
               // if(!$(this).children().eq(9).text().contains("verified"))
                if($(this).find('td:eq(9)').text().indexOf("verified")!=-1)
                {
                    $('#jobbudgetlists').DataTable().destroy();
                    //  $(this).removeClass('selected');
                    $('#jobbudgetlists').DataTable( {
                        "sDom": 't',
                        "cache": false,
                        "bPaginate": false,
                        "info":     false,
                        "bFilter": false,
                        'bSortable' : false,
                        'bDestroy': true,
                        "aaSorting": [],
                        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            if (aData[7] == datumstringoy && !(aData[9].indexOf("verified")!=-1)) {
                                $(nRow).toggleClass('selected');
                            }
                        }
                    } );

                    // DODADI LOGIKA ZA NEW LINEITEM... AKO E KLIKNATO A NEMA PLANDATE


                }
                else
                {

    //            $(this).toggleClass('selected');
                    $('#jobbudgetlists').DataTable().destroy();
                    $('#jobbudgetlists').DataTable( {
                        "sDom": 't',
                        "cache": false,
                        "bPaginate": false,
                        "info":     false,
                        "bFilter": false,
                        'bSortable' : false,
                        'bDestroy': true,
                        "aaSorting": [],
                        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            if (aData[7] == datumstringoy && !(aData[9].indexOf("verified")!=-1)) {
                                $(nRow).toggleClass('selected');
                            }
                        }
                    } );

                    if($(this).find('td:eq(7)').text()==' ')
                    {
                        if($(this).find('td:eq(9)').text().indexOf("verified")!=-1)
                        {
                            $(this).removeClass('selected');
                        }
                        else
                        {
                            $(this).toggleClass('selected');
                        }
                    }
                }

            }
            else
            {

                // na poedinecno klikanje
                $('#jobbudgetlists').DataTable().destroy();

                $('#jobbudgetlists').DataTable( {
                    "sDom": 't',
                    "cache": false,
                    "bPaginate": false,
                    "info":     false,
                    "bFilter": false,
                    'bSortable' : false,
                    'bDestroy': true,
                    "aaSorting": [],
                } );

                if($(this).find('td:eq(9)').text().indexOf("verified")!=-1)
                {
                    $(this).removeClass('selected');
                }
                else
                {
                    $(this).toggleClass('selected');

                }
            }
        }
    });

    var startPosition;
    var endPosition;
    $("#jobbudgetlists tbody").sortable({
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


   $("body").on('click','#buttonaddign', function() {

        var table = $('#jobbudgetlists').DataTable();
        var celstring  = "";

        // brisime se na pocetok
        $('#crewleaderA option').each(function() {
            $(this).removeAttr('selected');
        });
        $('#fieldManagers option').each(function() {
            $(this).removeAttr('selected');
        });

        $('#notes').val("");
         // do tuka brisenje
       $('#boxA option').each(function() {
           $(this).removeAttr('selected');
       });
       $('#orderA option').each(function() {
           $(this).removeAttr('selected');
       });

        if (table.rows('.selected').data().length ==0)
        {
            $('#jobbudgetlists').DataTable( {
                "sDom": 't',
                "bPaginate": false,
                "info":     false,
                "bFilter": false,
                'bSortable' : false,
                'bDestroy': true
            });

            alert("No budgetline items are selected. Please select some and try again.")
        }
        else
        {
            try
            {
                var idnja= "";
                var celstring= "";
                var crew = "";
                var manager = "";
                var notes = "";
                var taskdateon = "";

                var taskid = "";
                var ovaepoleto;


                // tuka treba da se vidi dali od selektiranite linitemi (taskovite nivni) barem eden e verified


                // vo toj slucaj da se pojavi poraka deka nemoze da se menuva zosto ima verificirani lineitemi


                var totalselectedids = '';
                var idnja = '';
                (table.rows('.selected')).each(function() {
                    var idnja = table.rows('.selected')[0];
                    ovaepoleto = $("#jobbudgetlists tbody tr").eq(idnja[0]);
                    for (var i=0; i<idnja.length; i++) {
                    totalselectedids += $("#jobbudgetlists tbody tr").eq(idnja[i]).attr("data-lineitem-id") + "-";
                    }
                });
             //   for (var i=0; i<table.rows('.selected').count; i++) {

             //   }


                try{
                    $('#boxA').val(ovaepoleto.attr("data-crew").replace(/['"]+/g, ''));
                    $('#orderA').val(ovaepoleto.attr("data-card-order").replace(/['"]+/g, ''));
                }
                catch(err){
                    console.log(err);
                }
                try{
                    manager =ovaepoleto.attr("data-assign-manager-id").replace(/['"]+/g, '');
                }
                catch(err){
                    console.log(err);
                }
                try{
                    notes = ovaepoleto.attr("data-notes").replace(/['"]+/g, '');
                }
                catch (err){
                    console.log(err);
                }

                if (manager !== "0")
                {
                    $("#fieldManagers").find("option[value='" + manager + "']").prop("selected", true).end().change();
                }

               /* if (crew !== "0")
                {
                    $("#crewleader").find("option[value='" + crew + "']").prop("selected", true).end().change();
                }*/
                $("#notes").val(notes);
                $('#lineidodupdate').val(totalselectedids);

                taskdateon = ovaepoleto.attr("data-date").replace(/['"]+/g, '');
                if (taskdateon==null || taskdateon=='')
                    taskdateon = new Date();
                var dateon = new Date(taskdateon + "T12:00:00");
                $( "#calendarmalendar").val($.datepicker.formatDate('yy-mm-dd', dateon));
            }
            catch(err){
                console.log(err);
            }

        $('#assigntask').show();
        }
    } );

    $("body").on('click','.editTasks', function()
    {
  // brisime se na pocetok
        $('#crewleader option').each(function() {
            $(this).removeAttr('selected');
        });
        $('#fieldManagers option').each(function() {
            $(this).removeAttr('selected');
        });
        $("#notes").val("");
        // do tuka brisenje
        $('#boxA option').each(function() {
            $(this).removeAttr('selected');
        });
        $('#orderA option').each(function() {
            $(this).removeAttr('selected');
        });

        // probaj da gi setiras vrednostite
        var order = this.parentNode.getAttribute("data-card-order").replace(/['"]+/g, '');
        var crew = this.parentNode.getAttribute("data-crew").replace(/['"]+/g, '');
        var manager = this.parentNode.getAttribute("data-manager-id").replace(/['"]+/g, '');
        var notes = this.parentNode.getAttribute("data-notes").replace(/['"]+/g, '');
       // var taskdateon = this.parentNode.getAttribute("data-date").replace(/['"]+/g, '').replace(/['"]+/g, '');

        var taskdateon = this.closest('tr').getAttribute("data-date")

        var fieldmanager = this.parentNode.getAttribute("data-assign-manager-id").replace(/['"]+/g, '');

        var selectiranlineid = this.parentNode.parentNode.getAttribute("data-line-id").replace(/['"]+/g, '');

        var taskid = this.parentNode.getAttribute("data-task-id").replace(/['"]+/g, '');

        $("#orderA").find("option[value='" + order + "']").prop("selected", true).end().change();
        $("#boxA").find("option[value='" + crew + "']").prop("selected", true).end().change();


        $("#updatetaskon").attr("data-task-id", taskid);


        /* $("#crewleaderA").selectedIndex = -1;
         $("#crewleaderA").attr("selected", "-1");*/

        $('#crewleader option').each(function() {
            $(this).removeAttr('selected');
        });
        if (manager !== "0")
        {
            $("#crewleaderA").find("option[value='" + manager + "']").prop("selected", true).end().change();
            // $("#crewleaderA").val($("#crewleaderA").find('option:selected').text());
        }
        if (fieldmanager !== "0")
        {
            $("#fieldManagers").find("option[value='" + fieldmanager + "']").prop("selected", true).end().change();
            // $("#crewleaderA").val($("#crewleaderA").find('option:selected').text());
        }

        $("#notes").val(notes);
        $('#lineidodupdate').val(selectiranlineid +'-');




         taskdateon = taskdateon.replace(/['"]+/g, '');
        if (taskdateon==null || taskdateon=='')
            taskdateon = new Date();
        var dateon = new Date(taskdateon + "T12:00:00");
        $( "#calendarmalendar").val($.datepicker.formatDate('yy-mm-dd', dateon));

/*

        var dateon = new Date(taskdateon + "T12:00:00");
        dateon.setDate(dateon.getDate());
        console.log(dateon);
        $( "#calendarmalendar").val($.datepicker.formatDate('yyyy-mm-dd', dateon));

*/

      //  $("#jobbudgetlists tbody tr").removeClass('selected');
        $('#assigntask').show();

    });



    //  Backbone.history.loadUrl( Backbone.history.fragment );

    $("body").on('click','#addBudgetLineitem', function() {
        setTimeout(function(){refreshme()}, 300);

    });

    $('#updatedates').click( function() {
        var table = $('#jobbudgetlists').DataTable();
        var celstring  = "";
        var rowCount = 0; // table.rows('.selected').data().length

        (table.rows('.selected')).each(function() {
            //   celstring+= this[0][rowCount] + " ";
            var idnja = table.rows('.selected')[0];
            for (var i=0; i<idnja.length; i++)
            {
                celstring+=  $("#jobbudgetlists tbody tr").eq(idnja[i]).attr('id')+ " ";
            }
        });
        updateLineItemAssignments(celstring);
    });





    $('#assignmanager').click( function() {
        // alert( table.rows('.selected').data().length +' row(s) selected' );
        //  var managerid
        var table = $('#jobbudgetlists').DataTable();
        var celstring  = "";
        var datetask = "";

        if ($('#calendarmalendar').val() !="")
             datetask = $('#calendarmalendar').val();

        var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
        datetask = datetask.replace(pattern,'$2-$3-$1')+ " 12:00:00.0";


        // tuka gledame dali se selektirani redovi ili se kliknalo od datumot (update crew) - sega spoeno
        var selecCount = table.rows('.selected')[0].length;
        if (table.rows('.selected').count>0)
        {
        (table.rows('.selected')).each(function() {
            var idnja = table.rows('.selected')[0];
            for (var i=0; i<idnja.length; i++)
            {
                celstring+=  $("#jobbudgetlists tbody tr").eq(idnja[i]).attr('id')+ "-";
                //  datetask += table.cell(table.rows()[0][i], 7).data()+ " ";

            }
          //  datetask = table.cell('.selected', 7).data(); // table.cell(table.rows('.selected')[0][idnja[0]], 7).data();
        });
        }
        else
        {
            celstring= $("#lineidodupdate").val()+"-";
        }


        var jobidno = $("#totals").attr("data-job-id");

        // BARAME DALI POSTOJAT TASKOVI za SELEKTIRANITE BLI I KOLKU GI IMA
        // gi mapirame so FLAG uste na start
        jsRoutes.controllers.Lineitems_rd.CheckExistTaskperDateJob(celstring).ajax(
            {
                async: false,
                success: function(datalist) {
                  // se vraka json taskovi                      // datalist[itemindex]
                            if (datalist.length == 0)
                            {
                                // NE  postoi taks - moze e nov dodaden so ADD
                              //  alert("ne postoi - 0");
                                // setiraj flag
                                jsRoutes.controllers.Lineitems_rd.CheckDailyTasks().ajax({
                                    data: {
                                        date: $("#calendarmalendar").val(),
                                        jobid: jobidno
                                        },
                                    success: function(data) {
                                        if (data!=null && data!='' && data.length > 0)
                                        {
                                            // znaci deka ima nekoj task na toj datum i mora da prasame
                                            //merge ili ne
                                           if (data[0].id != null && data[0].id != '' && data[0].id !=0)
                                           {

                                               var n = noty({
                                                   type: 'confirm',
                                                   text: 'There is task on that date <br><br> Would you like to merge lineitems to that task ? <br><br>Actuals from selected lineitems will be removed.<br>',
                                                   buttons: [
                                                       {addClass: 'btn btn-primary', text: 'Merge', onClick: function($noty) {
                                                           $noty.close();


                                                           jsRoutes.controllers.Lineitems_rd.deleteTaskNotAllActuals(celstring).ajax(
                                                               {
                                                                   async: false,
                                                                   data: {
                                                                       jobid: jobidno
                                                                   },
                                                                   success: function(data) {
                                                                       // izbrisani se site actuals
                                                                   },
                                                                   error: function(err) {
                                                                       return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                   }
                                                               }
                                                           );


                                                            // MERGE
                                                            // zemame taskid i nego go updatirame i go dodavame lineitemot
                                                           taskidEx = data[0].id;

                                                           // mora site lineitemi da se updatiraat na toj task
                                                           // updatirame samiod lineitem da go nosi toj task





                                                           jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                               {
                                                                   async: false,
                                                                   data: {
                                                                       taskid: taskidEx
                                                                   },
                                                                   success: function(datax) {

                                                                   },
                                                                   error: function(err) {
                                                                       return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                   }
                                                               }
                                                           );

                                                           // treba da go updatirame so order i so note i crew leader

                                                           // da se izbrisat actuals

                                                           refreshme();
                                                           // do tuka update assign
                                                           $('#assigntask').hide();

                                                           //  do tuka


                                                           noty({type: 'success', text: 'lineitem are added to existing task',  timeout: 3000});
                                                           $('#assigntask').hide();



                                                       }
                                                       },
                                                       {addClass: 'btn btn-danger', text: 'Open new task', onClick: function($noty) {
                                                           $noty.close();



                                                           console.log("otvorame nov task vo ova mesto");
                                                           // brisi actuals od selektiranite lineitemi

                                                           jsRoutes.controllers.Lineitems_rd.deleteTaskNotAllActuals(celstring).ajax(
                                                               {
                                                                   async: false,
                                                                   data: {
                                                                       jobid: jobidno
                                                                   },
                                                                   success: function(data) {
                                                                       // izbrisani se site actuals
                                                                   },
                                                                   error: function(err) {
                                                                       return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                   }
                                                               }
                                                           );

                                                           // NOV TASK
                                                           // otvorame nov task i cepame so sam lineitem
                                                           jsRoutes.controllers.Tasks_rd.addTaskNewPlans().ajax(
                                                               {
                                                                   async: false,
                                                                   data: {
                                                                       jobid: jobidno,
                                                                       taskType: 4,
                                                                       crew: $("#boxA  option:selected").val(),
                                                                       datumot: datetask
                                                                   },
                                                                   success: function(dataxx) {
                                                                       // id-to na taskot ni treba
                                                                       taskidx = dataxx.id;
                                                                       // treba da go updatirame so order i so note i crew leader
                                                                       jsRoutes.controllers.Tasks_rd.updateTask(taskidx).ajax({
                                                                           async: false,
                                                                           data: {
                                                                               cardOrder: $("#orderA  option:selected").val(),
                                                                               notes:  $("#notes").val(),
                                                                               manager:  $("#crewleaderA  option:selected").val()
                                                                           },
                                                                           success: function(data) {

                                                                               // updatirame samiod lineitem da go nosi toj task
                                                                               jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                                                   {
                                                                                       async: false,
                                                                                       data: {
                                                                                           taskid: taskidx
                                                                                       },
                                                                                       success: function(data) {

                                                                                       },
                                                                                       error: function(err) {
                                                                                           return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                                       }
                                                                                   }
                                                                               );

                                                                               // treba da zapiseme FM ako postoi
                                                                               var fieldid =  $("#fieldManagers option:selected" ).val();
                                                                               if (fieldid != null && fieldid != '' && fieldid !=0)
                                                                               {
                                                                                   var dt = $("#calendarmalendar").val();
                                                                                   $.ajax({
                                                                                       async: false,
                                                                                       type: 'POST',
                                                                                       url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskidx + '&datetask='+dt+'&fieldid='+fieldid,
                                                                                       success: function(datana) {
                                                                                       },
                                                                                       error: function (result) {
                                                                                           $("#assigntask").hide();
                                                                                           alert('Some error occurred while assigning the date task.');
                                                                                       }
                                                                                   });
                                                                               }
                                                                           },
                                                                           error: function(err) {
                                                                               return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                           }
                                                                       });

                                                                       // treba da se updatiraat lineitemite za na toj task
                                                                    /*   $("#assigntask").hide();
                                                                       refreshme();*/
                                                                       // do tuka
                                                                   },
                                                                   error: function(err) {
                                                                       $("#assigntask").hide();
                                                                       refreshme();

                                                                       return alert("There was an error adding task! Please refresh the page and try again.");
                                                                   }
                                                               }
                                                           );

                                                           // do tuka
                                                           noty({type: 'success', text: 'new task opened',  timeout: 3000});
                                                           $('#assigntask').hide();

                                                       }
                                                       }
                                                   ]
                                               });
                                           }


                                        }
                                        else
                                        {
                                            // nema task na toj datum

                                            // brisime actuals od selektiranite lineitemi
                                            jsRoutes.controllers.Lineitems_rd.deleteTaskNotAllActuals(celstring).ajax(
                                                {
                                                    async: false,
                                                    data: {
                                                        jobid: jobidno
                                                    },
                                                    success: function(data) {
                                                        // izbrisani se site actuals
                                                    },
                                                    error: function(err) {
                                                        return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                    }
                                                }
                                            );


                                            // nema task na toj datum - otvori go so parametrite
                                            var st = $("#calendarmalendar").val();
                                            var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
                                            //  var dt = new Date(st.replace(pattern,'$3-$1-$2'));
                                            var dt = st.replace(pattern,'$2-$3-$1');

                                            jsRoutes.controllers.Tasks_rd.addTaskNewPlans().ajax(
                                                {
                                                    async: false,
                                                    data: {
                                                        jobid: jobidno,
                                                        taskType: 4,
                                                        crew: $("#boxA  option:selected").val(),
                                                        datumot: dt
                                                    },
                                                    success: function(data) {
                                                        // id-to na taskot ni treba
                                                        taskidx = data.id;
                                                        // treba da go updatirame so order i so note i crew leader
                                                        jsRoutes.controllers.Tasks_rd.updateTask(taskidx).ajax({
                                                            async: false,
                                                            data: {
                                                                cardOrder: $("#orderA  option:selected").val(),
                                                                notes:  $("#notes").val(),
                                                                manager:  $("#crewleaderA  option:selected").val()
                                                            },
                                                            success: function(data) {

                                                                // updatirame samiod lineitem da go nosi toj task
                                                                jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                                    {
                                                                        async: false,
                                                                        data: {
                                                                            taskid: taskidx
                                                                        },
                                                                        success: function(data) {

                                                                        },
                                                                        error: function(err) {
                                                                            return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                        }
                                                                    }
                                                                );


                                                                // treba da zapiseme FM ako postoi
                                                                var fieldid =  $("#fieldManagers option:selected" ).val();
                                                                if (fieldid != null && fieldid != '' && fieldid !=0)
                                                                {
                                                                    var dt = $("#calendarmalendar").val();
                                                                    $.ajax({
                                                                        async: false,
                                                                        type: 'POST',
                                                                        url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskidx + '&datetask='+dt+'&fieldid='+fieldid,
                                                                        success: function(datana) {
                                                                        },
                                                                        error: function (result) {
                                                                            $("#assigntask").hide();
                                                                            alert('Some error occurred while assigning the date task.');
                                                                        }
                                                                    });
                                                                }
                                                            },
                                                            error: function(err) {
                                                                return alert("There was an error updating the task! Please refresh the page and try again.");
                                                            }
                                                        });
                                                        $("#assigntask").hide();
                                                        refreshme();
                                                        // do tuka
                                                    },
                                                    error: function(err) {
                                                        $("#assigntask").hide();
                                                        refreshme();

                                                        return alert("There was an error adding task! Please refresh the page and try again.");
                                                    }
                                                }
                                            );
                                        }
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                    }
                                });
                            }
                            // PROVERI DALI e selektiran 1 job
                            if (datalist.length == 1)
                            {
                                // postoi taks
                            //    alert(" samo 1 job e selektiran i toa " + datalist[0].id);
                                taskid = datalist[0].id;

                                var taskidEx = 0;


                                // kolku lineitemi ima selektiraniot taskid - BEZ ACTUALS
                                var countLIORGtask =  0;
                                jsRoutes.controllers.Lineitems_rd.getLineItemCount().ajax({
                                    async: false,
                                    data: {
                                        taskid: taskid
                                    },
                                    success: function(data) {

                                        //  goToByScroll("budget");
                                        countLIORGtask = data;
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                    }
                                });

                                // dali na baraniot datum imame task i dali da prajme merge ili open new task

                                jsRoutes.controllers.Lineitems_rd.CheckDailyTasks().ajax({
                                    data: {
                                        date: $("#calendarmalendar").val(),
                                        jobid: jobidno
                                    },
                                    success: function(data) {
                                        if (data!=null && data!='' && data.length > 0)
                                        {
                                            // znaci deka ima nekoj task na toj datum i mora da prasame
                                            //merge ili ne
                                            if (data[0].id != null && data[0].id != '' && data[0].id !=0)
                                            {
                                                // ako e samiot toj faten i nikoj drug i ako se site selektirani
                                                taskidEx = data[0].id;

                                                // treba samo da se updatira taskot samiot so ostanatite informacii
                                                // i da ne prasuva ni merge ni nisto
                                                if (taskidEx == taskid)
                                                {
                                                    // vazno e da se vidi dali se site lineitemi fateni ili samo nekoj od niv
                                                    // ako se site upadte samo na taskot

                                                    jsRoutes.controllers.Tasks_rd.updateTask(taskid).ajax({
                                                        async: false,
                                                        data: {
                                                            cardOrder: $("#orderA  option:selected").val(),
                                                            notes:  $("#notes").val(),
                                                            crew : $("#boxA  option:selected").val(),
                                                            manager:  $("#crewleaderA  option:selected").val()
                                                        },
                                                        success: function(data) {


                                                            // treba da zapiseme FM ako postoi
                                                            var fieldid =  $("#fieldManagers option:selected" ).val();
                                                            if (fieldid != null && fieldid != '' && fieldid !=0)
                                                            {
                                                                var dt = $("#calendarmalendar").val();
                                                                $.ajax({
                                                                    async: false,
                                                                    type: 'POST',
                                                                    url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskid + '&datetask='+dt+'&fieldid='+fieldid,
                                                                    success: function(datana) {
                                                                    },
                                                                    error: function (result) {
                                                                        $("#assigntask").hide();
                                                                        alert('Some error occurred while assigning the date task.');
                                                                    }
                                                                });
                                                            }
                                                        },
                                                        error: function(err) {
                                                            return alert("There was an error updating the task! Please refresh the page and try again.");
                                                        }
                                                    });
                                                    $("#assigntask").hide();
                                                    refreshme();

                                                }
                                                else
                                                {
                                                    // ne e samiot toj sto treba da se promeni tuku na drug task datum

                                                    var n = noty({
                                                    type: 'confirm',
                                                    text: 'There is task on that date <br><br> Would you like to merge lineitems to that task ? <br><br>Actuals from selected lineitems will be removed.<br> ',
                                                    buttons: [
                                                        {addClass: 'btn btn-primary', text: 'Merge', onClick: function($noty) {
                                                            $noty.close();
                                                            // MERGE
                                                            // zemame taskid i nego go updatirame i go dodavame lineitemot
                                                            taskidEx = data[0].id;
                                                            // TUKA MORA DA SE PrOVERI DALI LINEITEMS SELEKTIRANI SE SITE od ORG TASKOT ili ne
                                                            // dali se selektirani site lineitemi od toj task

                                                            // AKO SE SITE LINEITEMI OD TOJ TASK SELEKTIRANI TOGAS MORA DA GI MIGRIRAME LINEITEMITE // I POSLE DA GO IZBRISEME STARIOT TASK
                                                            // KOJ E STARIOT TASK ????


                                                            if (countLIORGtask == selecCount || countLIORGtask ==0)
                                                            {
                                                              //  console.log("FATENI SITE");
                                                                //  gi brise site actuals naednas//
                                                                 jsRoutes.controllers.Lineitems_rd.deleteTaskActuals().ajax(
                                                                 {
                                                                     async: false,
                                                                     data: {
                                                                        jobid: jobidno,
                                                                        taskid: taskid
                                                                     },
                                                                        success: function(data) {
                                                                     // izbrisani se site actuals
                                                                        },
                                                                        error: function(err) {
                                                                     return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                     }
                                                                     }
                                                                 );

                                                                // mora site lineitemi da se updatiraat na toj task
                                                                // updatirame samiod lineitem da go nosi toj task

                                                                jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                                    {
                                                                        async: false,
                                                                        data: {
                                                                            taskid: taskidEx
                                                                        },
                                                                        success: function(datax) {

                                                                        },
                                                                        error: function(err) {
                                                                            return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                        }
                                                                    }
                                                                );

                                                                   if (taskidEx != taskid)
                                                                   {
                                                                       // brisi go stariot task
                                                                        jsRoutes.controllers.Tasks_rd.deleteTask(taskid).ajax({
                                                                            async: false,
                                                                            data: {
                                                                                id: taskid
                                                                            },
                                                                            success: function(data) {
                                                                            },
                                                                            error: function(err) {
                                                                                return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                            }
                                                                        });
                                                                   }
                                                                $("#assigntask").hide();
                                                                refreshme();
                                                            }
                                                            else
                                                            // AKO NE SE SITE LINEITEMI OD TOJ TASK SELEKTIRANI TOGAS
                                                            {

                                                                console.log("NE SE FATENI SITE");

                                                                jsRoutes.controllers.Lineitems_rd.deleteTaskNotAllActuals(celstring).ajax(
                                                                    {
                                                                        async: false,
                                                                        data: {
                                                                            jobid: jobidno
                                                                        },
                                                                        success: function(data) {
                                                                            // izbrisani se site actuals
                                                                        },
                                                                        error: function(err) {
                                                                            return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                        }
                                                                    }
                                                                );


                                                                // SELEKTIRANI SE SAMO NEKOLKU A NE SITE LINEITEMI OD TOJ TASJ
                                                                // PRAVI SAMO UPDATE NA SELETIRANITE LINEITEMS SO TOJ TASK_ID i toa e se
                                                                // AKO SE SITE PRaVI KO DOSEGA:

                                                                //  update na podatocite za toj TASK vo slucaj da imame task na noviot datum
                                                                if ( countLIORGtask > selecCount && taskidEx >0){
                                                                    jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax({
                                                                        async: false,
                                                                        data: {
                                                                            taskid: taskidEx
                                                                        },
                                                                        success: function(data) {

                                                                            //  goToByScroll("budget");
                                                                        },
                                                                        error: function(err) {
                                                                            return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                        }
                                                                    });

                                                                }

                                                                    if (taskidEx != taskid &&  countLIORGtask ==0 )
                                                                    {
                                                                        // brisi go stariot task
                                                                        jsRoutes.controllers.Tasks_rd.deleteTask(taskid).ajax({
                                                                            async: false,
                                                                            data: {
                                                                                id: taskid
                                                                            },
                                                                            success: function(data) {
                                                                            },
                                                                            error: function(err) {
                                                                                return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                            }
                                                                        });
                                                                    }

                                                                refreshme();
                                                                    // do tuka update assign
                                                                $('#assigntask').hide();
                                                             }
                                                            //  do tuka
                                                          //  noty({type: 'success', text: 'lineitem is added to existing task',  timeout: 3000});
                                                          //  $('#assigntask').hide();
                                                            $("#assigntask").hide();
                                                            refreshme();
                                                        }
                                                        },
                                                        {addClass: 'btn btn-danger', text: 'Open new task', onClick: function($noty) {
                                                            $noty.close();

                                                                console.log("otvorame nov task tukaa");

                                                            // brisime actuals od selektiranite lineitemi
                                                            jsRoutes.controllers.Lineitems_rd.deleteTaskNotAllActuals(celstring).ajax(
                                                                {
                                                                    async: false,
                                                                    data: {
                                                                        jobid: jobidno
                                                                    },
                                                                    success: function(data) {
                                                                        // izbrisani se site actuals
                                                                    },
                                                                    error: function(err) {
                                                                        return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                    }
                                                                }
                                                            );
                                                                // NOV TASK
                                                                // otvorame nov task i cepame so sam lineitem
                                                                // nema task na toj datum - dali selektiranite itemi sto ne se site
                                                                // treba da se otvori task i da se prenesat na nego na toj datum ???
                                                                // nema task na toj datum - otvori go so parametrite



                                                                var st = $("#calendarmalendar").val();
                                                                var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
                                                                //  var dt = new Date(st.replace(pattern,'$3-$1-$2'));
                                                                var dt = st.replace(pattern,'$2-$3-$1');

                                                               // if (countLIORGtask > 0) {
                                                            if (countLIORGtask != selecCount && countLIORGtask !=0) {
                                                                    // znaci deka ne se fateni site od originalniot task tuku samo del od lineitems
                                                                    jsRoutes.controllers.Tasks_rd.addTaskNewPlans().ajax(
                                                                        {
                                                                            async: false,
                                                                            data: {
                                                                                jobid: jobidno,
                                                                                taskType: 4,
                                                                                crew: $("#boxA  option:selected").val(),
                                                                                datumot: dt
                                                                            },
                                                                            success: function(data) {
                                                                                // id-to na taskot ni treba
                                                                                taskidx = data.id;
                                                                                // treba da go updatirame so order i so note i crew leader
                                                                                jsRoutes.controllers.Tasks_rd.updateTask(taskidx).ajax({
                                                                                    async: false,
                                                                                    data: {
                                                                                        cardOrder: $("#orderA  option:selected").val(),
                                                                                        notes:  $("#notes").val(),
                                                                                        manager:  $("#crewleaderA  option:selected").val()
                                                                                    },
                                                                                    success: function(data) {

                                                                                        // updatirame samiod lineitem da go nosi toj task
                                                                                        jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                                                            {
                                                                                                async: false,
                                                                                                data: {
                                                                                                    taskid: taskidx
                                                                                                },
                                                                                                success: function(data) {

                                                                                                },
                                                                                                error: function(err) {
                                                                                                    return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                                                }
                                                                                            }
                                                                                        );


                                                                                        // treba da zapiseme FM ako postoi
                                                                                        var fieldid =  $("#fieldManagers option:selected" ).val();
                                                                                        if (fieldid != null && fieldid != '' && fieldid !=0)
                                                                                        {
                                                                                            var dt = $("#calendarmalendar").val();
                                                                                            $.ajax({
                                                                                                async: false,
                                                                                                type: 'POST',
                                                                                                url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskidx + '&datetask='+dt+'&fieldid='+fieldid,
                                                                                                success: function(datana) {
                                                                                                },
                                                                                                error: function (result) {
                                                                                                    $("#assigntask").hide();
                                                                                                    alert('Some error occurred while assigning the date task.');
                                                                                                }
                                                                                            });
                                                                                        }

                                                                                        if (countLIORGtask != selecCount)
                                                                                        {
                                                                                            if (taskidEx != taskid)
                                                                                            {
                                                                                                // brisi go stariot task
                                                                                                jsRoutes.controllers.Tasks_rd.deleteTask(taskid).ajax({
                                                                                                    async: false,
                                                                                                    data: {
                                                                                                        id: taskid
                                                                                                    },
                                                                                                    success: function(data) {
                                                                                                    },
                                                                                                    error: function(err) {
                                                                                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    error: function(err) {
                                                                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                                    }
                                                                                });
                                                                                $("#assigntask").hide();
                                                                                refreshme();
                                                                                // do tuka
                                                                            },
                                                                            error: function(err) {
                                                                                $("#assigntask").hide();
                                                                                refreshme();

                                                                                return alert("There was an error adding task! Please refresh the page and try again.");
                                                                            }
                                                                        }
                                                                    );
                                                                    }
                                                                    else
                                                                    {
                                                                        // dateni se stie lineitems
                                                                        // ako nema lineitems na toj task brisi go za da ne se pojavuva na calendar
                                                                        jsRoutes.controllers.Tasks_rd.deleteTask(taskid).ajax({
                                                                            async: false,
                                                                            data: {
                                                                                id: taskid
                                                                            },
                                                                            success: function(data) {
                                                                            },
                                                                            error: function(err) {
                                                                                return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                            }
                                                                        });
                                                                        $('#assigntask').hide();
                                                                        refreshme();
                                                                    }

                                                                    // nema task na noviot datum - dali da gi odnesime selektiranite na nov task ?
                                                                   $('#assigntask').hide();
                                                            refreshme();
                                                            // do tuka
                                                            noty({type: 'success', text: 'new task opened',  timeout: 3000});

                                                        }}
                                                    ]
                                                });
                                                }
                                            }
                                        }
                                        else
                                        {
                                            // nema task na toj datum - update na taskot na noviot datum
                                            var st = $("#calendarmalendar").val();
                                            var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
                                            //  var dt = new Date(st.replace(pattern,'$3-$1-$2'));
                                            var dt = st.replace(pattern,'$2-$3-$1');

                                            // dali se site selektirani ili sAMO del od lineitemite
                                            if (countLIORGtask == selecCount || countLIORGtask ==0 || countLIORGtask ==1)
                                            {
                                                // treba da go updatirame taskot so order i so note i crew leader
                                                jsRoutes.controllers.Tasks_rd.updateTask(taskid).ajax({
                                                        async: false,
                                                        data: {
                                                            /* cardOrder: $("#orderA  option:selected").val(),
                                                             crew: $("#boxA  option:selected").val(),
                                                             //  notes:  $("#notes").val(),
                                                             // manager:  $("#crewleaderA  option:selected").val(),
                                                             date: dt*/
                                                            cardOrder: $("#orderA  option:selected").val(),
                                                            crew: $("#boxA  option:selected").val(),
                                                            notes:  $("#notes").val(),
                                                            manager:  $("#crewleaderA  option:selected").val(),
                                                            date: st
                                                        },
                                                        success: function(data) {
                                                            // treba da zapiseme FM ako postoi
                                                            var fieldid =  $("#fieldManagers option:selected" ).val();
                                                            if (fieldid != null && fieldid != '' && fieldid !=0)
                                                            {
                                                                var dt = $("#calendarmalendar").val();
                                                                $.ajax({
                                                                    async: false,
                                                                    type: 'POST',
                                                                    url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskid + '&datetask='+dt+'&fieldid='+fieldid,
                                                                    success: function(datana) {
                                                                    },
                                                                    error: function (result) {
                                                                        $("#assigntask").hide();
                                                                        alert('Some error occurred while assigning the date task.');
                                                                    }
                                                                });
                                                            }


                                                            var actualsCount = 0;
                                                            // treba da vidime dali ima actuals i ako ima da prasame
                                                            jsRoutes.controllers.Lineitems_rd.checkTaskActuals().ajax(
                                                                {
                                                                    async: false,
                                                                    data: {
                                                                        jobid: jobidno,
                                                                        taskid: taskid
                                                                    },
                                                                    success: function(data) {
                                                                        actualsCount = data;
                                                                        // ako ima actuals
                                                                        // prasaj da gi ostavi - ne pravi nisto (NE SME PRASALE)
                                                                        if (actualsCount > 0){
                                                                            var n = noty({
                                                                                type: 'confirm',
                                                                                text: '<br><br> Would you like to delete actuals from this task ? <br>',
                                                                                buttons: [
                                                                                    {addClass: 'btn btn-primary', text: 'Delete', onClick: function($noty) {
                                                                                        $noty.close();

                                                                                        // da gi brise
                                                                                        jsRoutes.controllers.Lineitems_rd.deleteTaskActuals().ajax(
                                                                                            {
                                                                                                async: false,
                                                                                                data: {
                                                                                                    jobid: jobidno,
                                                                                                    taskid: taskid
                                                                                                },
                                                                                                success: function(data) {
                                                                                                    // izbrisani se site actuals
                                                                                                },
                                                                                                error: function(err) {
                                                                                                    return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                                                }
                                                                                            }
                                                                                        );

                                                                                        noty({type: 'success', text: 'Actuals are deleted',  timeout: 3000});
                                                                                        $("#assigntask").hide();
                                                                                        refreshme();
                                                                                    }
                                                                                    },
                                                                                    {addClass: 'btn btn-danger', text: 'Leave actuals', onClick: function($noty) {
                                                                                        $noty.close();
                                                                                        $("#assigntask").hide();
                                                                                        refreshme();
                                                                                    }
                                                                                    }
                                                                                ]
                                                                            });
                                                                        }
                                                                    },
                                                                    error: function(err) {
                                                                        return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                    }
                                                                }
                                                            );

                                                        },
                                                        error: function(err) {
                                                            $("#assigntask").hide();
                                                            refreshme();

                                                            return alert("There was an error adding task! Please refresh the page and try again.");
                                                        }
                                                    }
                                                );
                                                $("#assigntask").hide();
                                                refreshme();

                                            }
                                            else {
                                              // countLIORGtask - KOLKU LINEITEMI IMA SELEKTIRANIOT TASK - BEZ ACTUALS
                                                if (countLIORGtask > 0 && countLIORGtask > selecCount) {

                                                    // brisime actuals od selektiranite lineitemi
                                                    jsRoutes.controllers.Lineitems_rd.deleteTaskNotAllActuals(celstring).ajax(
                                                        {
                                                            async: false,
                                                            data: {
                                                                jobid: jobidno
                                                            },
                                                            success: function(data) {
                                                                // izbrisani se site actuals
                                                            },
                                                            error: function(err) {
                                                                return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                            }
                                                        }
                                                    );

                                                    // ne se site selektirani
                                                    // treba da se otvori nov task samo za selektiranite
                                                    jsRoutes.controllers.Tasks_rd.addTaskNewPlans().ajax(
                                                        {
                                                            async: false,
                                                            data: {
                                                                jobid: jobidno,
                                                                taskType: 4,
                                                                crew: $("#boxA  option:selected").val(),
                                                                datumot: dt
                                                            },
                                                            success: function(data) {
                                                                // id-to na taskot ni treba
                                                                taskidx = data.id;
                                                                // treba da go updatirame so order i so note i crew leader
                                                                jsRoutes.controllers.Tasks_rd.updateTask(taskidx).ajax({
                                                                    async: false,
                                                                    data: {
                                                                        cardOrder: $("#orderA  option:selected").val(),
                                                                        notes:  $("#notes").val(),
                                                                        manager:  $("#crewleaderA  option:selected").val()
                                                                    },
                                                                    success: function(data) {

                                                                        // updatirame samiod lineitem da go nosi toj task
                                                                        jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                                            {
                                                                                async: false,
                                                                                data: {
                                                                                    taskid: taskidx
                                                                                },
                                                                                success: function(data) {

                                                                                },
                                                                                error: function(err) {
                                                                                    return alert("There was an error modifying lineitem task! Please refresh the page and try again.");
                                                                                }
                                                                            }
                                                                        );


                                                                        // treba da zapiseme FM ako postoi
                                                                        var fieldid =  $("#fieldManagers option:selected" ).val();
                                                                        if (fieldid != null && fieldid != '' && fieldid !=0)
                                                                        {
                                                                            var dt = $("#calendarmalendar").val();
                                                                            $.ajax({
                                                                                async: false,
                                                                                type: 'POST',
                                                                                url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskidx + '&datetask='+dt+'&fieldid='+fieldid,
                                                                                success: function(datana) {
                                                                                },
                                                                                error: function (result) {
                                                                                    $("#assigntask").hide();
                                                                                    alert('Some error occurred while assigning the date task.');
                                                                                }
                                                                            });
                                                                        }
                                                                    },
                                                                    error: function(err) {
                                                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                                                    }
                                                                });
                                                                $("#assigntask").hide();
                                                                refreshme();
                                                                // do tuka
                                                            },
                                                            error: function(err) {
                                                                $("#assigntask").hide();
                                                                refreshme();

                                                                return alert("There was an error adding task! Please refresh the page and try again.");
                                                            }
                                                        }
                                                    );
                                                    $("#assigntask").hide();
                                                    refreshme();

                                                   /*  if (countLIORGtask == 1) {
                                                        // ako nema lineitems na toj task brisi go za da ne se pojavuva na calendar
                                                        jsRoutes.controllers.Tasks_rd.deleteTask(taskid).ajax({
                                                            async: false,
                                                            data: {
                                                                id: taskid
                                                            },
                                                            success: function(data) {
                                                            },
                                                            error: function(err) {
                                                                return alert("There was an error updating the task! Please refresh the page and try again.");
                                                            }
                                                        });
                                                        }
                                                        $('#assigntask').hide();
                                                        refreshme();
                                                    */
                                                }
                                                else
                                                {
                                                 if (countLIORGtask == 0 ) {
                                                    // ako nema lineitems na toj task brisi go za da ne se pojavuva na calendar
                                                    jsRoutes.controllers.Tasks_rd.deleteTask(taskid).ajax({
                                                        async: false,
                                                        data: {
                                                            id: taskid
                                                        },
                                                        success: function(data) {
                                                        },
                                                        error: function(err) {
                                                            return alert("There was an error updating the task! Please refresh the page and try again.");
                                                        }
                                                    });
                                                    }
                                                    $('#assigntask').hide();
                                                    refreshme();
                                                }
                                            }
                                        }
                                    },
                                    error: function(err) {
                                        return alert("There was an error updating the task! Please refresh the page and try again.");
                                    }
                                });

                            }


                            if (datalist.length > 1)
                            {
                                // postoi taks
                                alert("You selected line items that belong to more than 2 tasks. Merge is not allowed");
                                $("#assigntask").hide();
                                refreshme();
                            }

                    // brisi gi taskovite od toj job sto nemaat lineitemi i visat vo calendarot
                    // na sekoj povik
                    jsRoutes.controllers.Lineitems_rd.DeleteTasksWithoutLineitems().ajax(
                        {
                            async: false,
                            data: {
                                jobid: jobidno
                            },
                            success: function() {

                            },
                            error: function(err) {
                                return alert("There was an error adding task! Please refresh the page and try again.");
                            }

                        });

                },
                error: function(err) {
                    return alert("There was an error adding task! Please refresh the page and try again.");
                }

            });


    });


    $('#removetask').click( function() {
        var table = $('#jobbudgetlists').DataTable();
        var celstring  = "";
        var datetask = "";

        if ($('#calendarmalendar').val() !="")
            datetask = $('#calendarmalendar').val();

        var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
        datetask = datetask.replace(pattern,'$2-$3-$1')+ " 12:00:00.0";


        // tuka gledame dali se selektirani redovi ili se kliknalo od datumot (update crew) - sega spoeno
        if (table.rows('.selected').count>0)
        {
            (table.rows('.selected')).each(function() {
                var idnja = table.rows('.selected')[0];
                for (var i=0; i<idnja.length; i++)
                {
                    celstring+=  $("#jobbudgetlists tbody tr").eq(idnja[i]).attr('id')+ "-";
                    //  datetask += table.cell(table.rows()[0][i], 7).data()+ " ";

                }
                //  datetask = table.cell('.selected', 7).data(); // table.cell(table.rows('.selected')[0][idnja[0]], 7).data();
            });
        }
        else
        {
            celstring= $("#lineidodupdate").val()+"-";
        }


        var jobidno = $("#totals").attr("data-job-id");
    //    alert(celstring);



        jsRoutes.controllers.Lineitems_rd.CheckExistTaskperDateJob(celstring).ajax(
            {
                async: false,
                success: function(datalist) {
                    // se vraka json taskovi                      // datalist[itemindex]
                    if (datalist.length == 0)
                    {
                        return alert("There is no task that should be removed.");
                        // NE  postoi taks - moze e nov dodaden so ADD
                        // PROVERI DALI IMA TASK NA TOJ DATUM... AKO IMA VRATI GO PRVIOT
                    }
                    if (datalist.length == 1)
                    {

                        var n = noty({
                            type: 'confirm',
                            text: 'Task will be deleted <br><br> Actuals, assignments will be deleted. Do you want to proceed ? <br>',
                            buttons: [
                                {addClass: 'btn btn-primary', text: 'Delete', onClick: function($noty) {
                                    $noty.close();

                                    // postoi taks
                                    //    alert("postoi samo 1 i toa " + datalist[0].id);
                                    taskidno = datalist[0].id;

                                    //  delete na toj task i na negovite actials
                                    jsRoutes.controllers.Lineitems_rd.deleteTaskActualsAssignsResetPlanItems().ajax({
                                        data: {
                                            taskid: taskidno,
                                            jobid: jobidno
                                        },
                                        success: function(data) {
                                            refreshme();
                                            // do tuka update assign
                                            $('#assigntask').hide();
                                            //  goToByScroll("budget");
                                        },
                                        error: function(err) {
                                            return alert("There was an error updating the task! Please refresh the page and try again.");
                                        }
                                    });


                                    noty({type: 'success', text: 'Task is removed from calendar',  timeout: 3000});
                                    $('#assigntask').hide();
                                }
                                },
                                {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
                                    $noty.close();
                                    $('#assigntask').hide();

                                }
                                }
                            ]
                        });

                        // ne se pipaat actuals voopsto
                    }
                    if (datalist.length > 1)
                    {
                        // postoi taks
                        alert("You selected line items that belong to more than 2 tasks. Removing is not allowed");
                        $("#assigntask").hide();
                        refreshme();
                    }

                },
                error: function(err) {
                    return alert("There was an error adding task! Please refresh the page and try again.");
                }

            });








        $('#assigntask').hide();
    });


    $("body").on('click','.verifybutt', function(e) {
            e.preventDefault();
            if (window.confirm("Are you sure?")) {
                // fati go id-to od verifybutt
                var lineid = this.parentNode.getAttribute("data-line-id");
                verifyLineItem(lineid);
            }
    });

    $("body").on('click','.unverifybut', function(e) {
        e.preventDefault();
        if (window.confirm("LineItem will be unverified. Are you sure?")) {
            // fati go id-to od verifybutt
            var lineid = this.parentNode.getAttribute("data-line-id");
            UnverifyLineItem(lineid);
        }
    });



    $("body").on('click','#buttonverifyall', function(e) {
            e.preventDefault();
            if (window.confirm("Are you sure?")) {
                var jobidno = $("#totals").attr("data-job-id");
                verifyAllLineItem(jobidno);
            }
       // setTimeout(function(){refreshme()}, 1000);
    });

});

function updatenewTaskLineItem( lineitemid, Taskid, notes, po , taskType)
{
    // vendor=807&item=106&units=&quantity=8&rate=14.00&saleprice=112&task=98656&notes=&po=null
    var putlink = "";
    if (po != "")
    {
        putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
    }
    else
    {
        putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po=null";
    }

    $.ajax({
        url: putlink,
        type: 'POST',
        success: function() {
            // return existinglineitem.id;

            populateLaborItems(selectedJob, taskType);
            populateMaterialsItems(selectedJob, taskType);
            populateConcreteItems(selectedJob, taskType);
            populateLandscapeItems(selectedJob, taskType);
            populateMiscellaneousItems(selectedJob, taskType);

        },
        error:  $.noop
    });
}

function datatablefunctions(){

/*

    $("#jobbudgetlists").DataTable({
        "sDom": 't',
        "bPaginate": false,
        "info":     false,
        "bFilter": false,
        'bSortable' : false
    });
*/


}

function updateLineItemOrder(){
    var celstring  = "";
    var rowCount = $('#jobbudgetlists tr').length

    $('#jobbudgetlists > tbody > tr').each(function() {
        celstring+= this.id + " ";
        $(this).removeClass('selected');
    });

    jsRoutes.controllers.Jobs_rd.reorderLineItems().ajax(
        {
            type: "POST",
            async: false,
            data: {
                lineitemsid: celstring
            },
            success: function(datasub) {
                refreshme();

            },
            error: function(err) {
                return alert("There was an error saving job  budget lines order.");
            }
        }
    );
}

function verifyLineItem(lineitemid){
    if (lineitemid!=''){
        jsRoutes.controllers.Jobs_rd.verifyLineItems().ajax(
            {
                async: false,
                type: "POST",
                data: {
                    verifylineitemid: lineitemid
                },
                success: function(datasub) {
                    refreshme();
                    goToByScroll("budget");
                },
                error: function(err) {
                    return alert("There was an error saving job  budget lines order.");
                }
            }
        );
    }
}


function UnverifyLineItem(lineitemid){
    if (lineitemid!=''){
        jsRoutes.controllers.Jobs_rd.unverifyLineItems().ajax(
            {
                async: false,
                type: "POST",
                data: {
                    verifylineitemid: lineitemid
                },
                success: function(datasub) {
                    refreshme();
                    goToByScroll("budget");
                },
                error: function(err) {
                    return alert("There was an error saving job  budget lines order.");
                }
            }
        );
    }
}


function verifyAllLineItem(jobid){
    if (jobid!=''){
        jsRoutes.controllers.Jobs_rd.verifyAllLineItems().ajax(
            {
                async: false,
                type: "POST",
                data: {
                    jobid: jobid
                },
                success: function() {
                    refreshme();
                    goToByScroll("budget");
                },
                error: function(err) {
                    return alert("There was an error saving job  budget lines order.");
                }
            }
        );
    }
}

function updateLineItemAssignments(linitemsspilit){


    if ($('#calendarmalendar').val() !="")
        var selectedDate = $('#calendarmalendar').val();

    jsRoutes.controllers.Jobs_rd.reorderLineItemDates().ajax(
        {
            type: "POST",
            async: false,
            data: {
                lineitemsid: linitemsspilit,
                datesel : selectedDate
            },
            success: function(datasub) {
                refreshme();
                refreshmeactuals();
                goToByScroll("budget");
                $('#assigntask').hide();
            },
            error: function(err) {
                return alert("There was an error saving job budget lines dates.");
            }
        }
    );

}


function goToByScroll(id){
    // Remove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    $('html,body').animate({
            scrollTop: $("#"+id).offset().top},
        'slow');
}


function refreshme(){
  /*  var scrollPos = 0;
    if(window.location.hash !== ''){
        scrollPos = parseInt(window.location.hash.substring(1),10);
    }*/

    var jobidno = $("#totals").attr("data-job-id");
    jsRoutes.controllers.Jobs_rd.reorderLineItemRefresh().ajax(
        {
            async: false,
            type: "GET",
            data: {
                jobid: jobidno
            },
            success: function(datasub) {
                $("#budget").empty().append(datasub);
        //        Backbone.history.loadUrl( Backbone.history.fragment );

                (function() {
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
                         /*   "click    #addBudgetLineitem": "addBudgetLineitem"*/
                        };
                        BudgetLineitems.prototype.initialize = function() {
                            return this.el.find("#budgetitems").children("tr").each(function(i, lineitem) {
                                return new BudgetLineitem({
                                    el: $(lineitem)
                                });
                            });
                        };
/*                        BudgetLineitems.prototype.addBudgetLineitem = function(e) {
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
                        };*/
                        return BudgetLineitems;
                    })();
                    BudgetLineitem = (function() {
                        __extends(BudgetLineitem, Backbone.View);
                        function BudgetLineitem() {
                            BudgetLineitem.__super__.constructor.apply(this, arguments);
                        }
                        BudgetLineitem.prototype.events = {
                            "click    .deleteLineitem": "deleteBudgetLineitem",
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
                         BudgetLineitem.prototype.deleteBudgetLineitem = function(e) {
                         e.preventDefault();
                         // da se vleze so proverka dali e verified
                         if (confirm('Are you sure?')) {
                         return jsRoutes.controllers.Lineitems_rd.deleteLineitemNewJob(this.id).ajax({
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
                         };
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
                                        context.item.closest("tr").attr("data-item-type-id", vendorItem.attr("data-item-type-id"));
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
                            task1BudgetInput = $("<input/>").css("width", "100px").css("visibility", "hidden").attr("id", "task1Budget").attr("data-lineitem-id", this.id).val(task1Budget).change(function() {
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
                            /*    return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
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
                                });*/
                            });
                            task2BudgetInput = $("<input/>").css("width", "100px").css("visibility", "hidden").attr("id", "task2Budget").attr("data-lineitem-id", this.id).val(task2Budget).change(function() {
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
                               /* return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
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
                                });*/
                            });
                            task3BudgetInput = $("<input/>").css("width", "100px").css("visibility", "hidden").attr("id", "task3Budget").attr("data-lineitem-id", this.id).val(task3Budget).change(function() {
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
                               /* return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
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
                                });*/
                            });
                            // table = $("<table/>").css("width", "100%").html($("<tr/>").append($("<td/>").html("Tie to: ").append(planItems).append("With units: ").append(planUnits).append("Multiplier:<br/>").append(multiplier).append("<br/>Markup:<br/>").append(markup)).append($("<td/>").html("Task1: ").append(task1BudgetInput).append("<br/>Task2: ").append(task2BudgetInput).append("<br/>Task3: ").append(task3BudgetInput)));
                            table = $("<table/>").css("width", "100%").html($("<tr/>").append($("<td/>").html("Tie to: ").append(planItems).append("With units: ").append(planUnits).append("Multiplier:<br/>").append(multiplier).append("<br/>Markup:<br/>").append(markup)).append($("<td/>")));
                            return $("#dialog").html(table).append("<br/><br/>")/*.append($("<div/>").attr("id", "budgetSlider").slider({
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
                            }))*/.dialog("open");
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
                                async: false,
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
                        var lineitems;
                        return lineitems = new BudgetLineitems({
                            el: $("#budget")
                        });
                    });
                }).call(this);


                var startPosition;
                var endPosition;
                $("#jobbudgetlists tbody").sortable({
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



            },
            error: function(err) {
                return alert("There was an error refreshing job budget lines.");
            }
        }
    );


  //  $('body').scrollTo(scrollPos);


   // datatablefunctions();


    goToByScroll("budget");

}




(function() {
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
            "click    .deleteLineitem": "deleteBudgetLineitem",
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
      BudgetLineitem.prototype.deleteBudgetLineitem = function(e) {
            e.preventDefault();
            if (confirm('Are you sure?')) {
                return jsRoutes.controllers.Lineitems_rd.deleteLineitemNewJob(this.id).ajax({
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
        };
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
            task1BudgetInput = $("<input/>").css("width", "100px").css("visibility", "hidden").attr("id", "task1Budget").attr("data-lineitem-id", this.id).val(task1Budget).change(function() {
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
            /*    return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
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
                });*/
            });
            task2BudgetInput = $("<input/>").css("width", "100px").css("visibility", "hidden").attr("id", "task2Budget").attr("data-lineitem-id", this.id).val(task2Budget).change(function() {
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
            /*    return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
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
                });*/
            });
            task3BudgetInput = $("<input/>").css("width", "100px").css("visibility", "hidden").attr("id", "task3Budget").attr("data-lineitem-id", this.id).val(task3Budget).change(function() {
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
           /*     return jsRoutes.controllers.Lineitems_rd.updateLineitem(context.el.attr("data-lineitem-id")).ajax({
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
                });*/
            });
            // table = $("<table/>").css("width", "100%").html($("<tr/>").append($("<td/>").html("Tie to: ").append(planItems).append("With units: ").append(planUnits).append("Multiplier:<br/>").append(multiplier).append("<br/>Markup:<br/>").append(markup)).append($("<td/>").html("Task1: ").append(task1BudgetInput).append("<br/>Task2: ").append(task2BudgetInput).append("<br/>Task3: ").append(task3BudgetInput)));
            table = $("<table/>").css("width", "100%").html($("<tr/>").append($("<td/>").html("Tie to: ").append(planItems).append("With units: ").append(planUnits).append("Multiplier:<br/>").append(multiplier).append("<br/>Markup:<br/>").append(markup)));
            return $("#dialog").html(table).append("<br/><br/>")/*.append($("<div/>").attr("id", "budgetSlider").slider({
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
            }))*/.dialog("open");
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
                async: false,
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
        var lineitems;
        return lineitems = new BudgetLineitems({
            el: $("#budget")
        });
    });
}).call(this);



