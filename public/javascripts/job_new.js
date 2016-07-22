
$(document).ready(function() {


    $('#assigntask').hide();

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

    datatablefunctions();

    Backbone.history.loadUrl( Backbone.history.fragment );

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

        (table.rows('.selected')).each(function() {
            var idnja = table.rows('.selected')[0];
            for (var i=0; i<idnja.length; i++)
            {
                celstring+=  $("#jobbudgetlists tbody tr").eq(idnja[i]).attr('id')+ "-";
              //  datetask += table.cell(table.rows()[0][i], 7).data()+ " ";

            }
            datetask = table.cell('.selected', 7).data(); // table.cell(table.rows('.selected')[0][idnja[0]], 7).data();
        });



        // PROVERI dali ima takvi taskovi...

        //
        jsRoutes.controllers.Lineitems_rd.CheckExistAssignedLineItemsTaskidsNewJob(celstring).ajax(
            {
                async: false,
                data: {

                },
                success: function(data) {
                  if (data!=null && data !="")
                  {
                      postojatstari = 1;
                      var n = noty({
                          type: 'confirm',
                          text: 'Some of these lineitems are already assigned <br><br> Assignmets and their tasks and allocated lineitems will be deleted. <br><br> Do you want to reassign selected lineitems ? <br>',
                          buttons: [
                              {addClass: 'btn btn-primary', text: 'Reallocate', onClick: function($noty) {
                                  $noty.close();
                                  noty({type: 'success', text: ' deleting old assignments, task and lineitems',  timeout: 3000});

                                  jsRoutes.controllers.Lineitems_rd.CheckExistAssignedLineItemsNewJob(celstring).ajax(
                                      {
                                          async: false,
                                          data: {

                                          },
                                          success: function() {
                                              // ZA DA NAPOLNIME FIELD MANAGER NI TREBA jobid  taskid - MOZE DA TREBA SE OTVORI PRVO NOV TASK ID SO TYPE - 1OO NA TOJ DATUM
                                              // datetask - TOA E OD LINEITEMITE - STO SE SELEKTIRANI, I MANAGEROT
                                              // /admin/actualjobs/assigns?jobid='+jobid+'&taskid='+ taskid + '&datetask='+datetask+'&fieldid='+fieldid,
                                              var jobidno = $("#totals").attr("data-job-id");
                                              var tasktypeid = 4;
                                              var fieldid =  $("#fieldManagers option:selected" ).val();
                                              var crewleaderid =  $("#crewleader option:selected" ).val();
                                              var boxid =  $("#box option:selected" ).val();
                                              var orderid =  $("#order option:selected" ).val();

                                              var notes = $("#notes").val();

                                              // izbrisano
                                              // otvori nov task so addTaskNew... a sto e so edit na toj task... dali starite assignmenti treba da se brisat;
                                              var taskid = 0;
                                              jsRoutes.controllers.Tasks_rd.addTaskNewPlans().ajax(
                                                  {
                                                      async: false,
                                                      data: {
                                                          jobid: jobidno,
                                                          taskType: tasktypeid,
                                                          crew: boxid,
                                                          datumot: datetask
                                                      },
                                                      success: function(data) {
                                                          // id-to na taskot ni treba
                                                          taskid = data.id;
                                                      },
                                                      error: function(err) {
                                                          return alert("There was an error adding task! Please refresh the page and try again.");
                                                      }
                                                  }
                                              );

                                              // update napraj mu so
                                              /*jsRoutes.controllers.Tasks.updateTask(context.el.attr("data-task-id")).ajax
                                               data:
                                               crew: context.el.attr("data-crew")
                                               cardOrder: context.el.attr("data-card-order")
                                               date: context.el.attr("data-date")
                                               notes: context.el.attr("data-notes")
                                               manager: context.el.attr("data-manager-id")*/
                                              // konecno mapiraj gi lineitems so toj taskid...
                                              jsRoutes.controllers.Tasks_rd.updateTask(taskid).ajax(
                                                  {
                                                      async: false,
                                                      data: {
                                                          cardOrder: orderid,
                                                          notes: notes,
                                                          crew: boxid
                                                      },
                                                      success: function(data) {
                                                          //   alert(data[0].id);
                                                      },
                                                      error: function(err) {
                                                          return alert("There was an error modifying task! Please refresh the page and try again.");
                                                      }
                                                  }
                                              );



                                              // do tuka


                                              // DA SE STAVI KONECNO ASSIGNMENT na toj TASK
                                              var st = datetask;
                                              var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
                                              //  var dt = new Date(st.replace(pattern,'$3-$1-$2'));
                                              var dt = st.replace(pattern,'$3-$1-$2');


                                              $.ajax({
                                                  async: false,
                                                  type: 'POST',
                                                  url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskid + '&datetask='+dt+'&fieldid='+fieldid,
                                                  success: function(datana) {
                                                      var n = noty({type: 'success', text: 'Task was assigned to ' + $("#fieldManagers option:selected" ).text(),  timeout: 3000});
                                                      $('.assignTask[data-href-date='+datetask+'][data-href='+taskid+']').html(datana);
                                                      $('#assigntask').hide();
                                                  },
                                                  error: function (result) {
                                                      alert('Some error occurred while assigning the date task.');
                                                  }
                                              });


                                            /*  (table.rows('.selected')).each(function() {*/
                                                  var idnja = table.rows('.selected')[0];
                                                  for (var i=0; i<idnja.length; i++)
                                                  {
                                                      (function(i)
                                                      {
                                                      //  var jobidto =  $("#jobbudgetlists tbody tr").eq(idnja[i]).attr('id');

                                                      var vendorid =  $("#jobbudgetlists tbody > tr:nth-child("+(idnja[i]+1) +") td:nth-child(2)").attr('data-vendor-id');


                                                      /*var vendorid =  $("#jobbudgetlists tbody tr td:nth-child(2)").attr('data-vendor-id');*/
                                                      var itemid = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(3)").attr('data-item-id');
                                                      var itemtypeid = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(3)").attr('data-item-type-id');

                                                      var quantity = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(4)").find('.quantity').val();
                                                      var rate = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(5)").find('.rate').val();
                                                      rate = rate.replace(',', '');
                                                      var saleprice = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(7)").html();

                                                      var tasktypeid = 4;
                                                      //    var date = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(8)").html();
                                                      //   var taskidno =  $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(9)").attr('data-task-id');

                                                      if (itemid != "" && itemtypeid != "" && quantity != "" && rate != ""  && tasktypeid != "" && dt != "") // && saleprice !=""
                                                      {
                                                          $.ajax({
                                                              async: false,
                                                              type: 'POST',
                                                              url: '/jobs/lineitemsActual/addeditActual?jobid='+jobidno+"&tasktype="+tasktypeid+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtypeid+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+dt+"&taskidno="+taskid,
                                                              success: function() {
                                                              },
                                                              error: function (result) {
                                                                  alert('Some error occurred while updating lineitems.');
                                                              }
                                                          });
                                                      }
                                                    })(i);
                                                  }
                                                  // da se osvezi cardot... vidi kako mozeme toa;
                                             /* });*/


                                              // STO TREBA DA SE NAPRAVI SO LINEITEMS otkako ke se popolni TASK-ot
                                              // update na lineitems set task_id kolona na taskot nas... where sto se selektirani so toj lineid

                                              jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                                                  {
                                                      async: false,
                                                      data: {
                                                          taskid: taskid
                                                      },
                                                      success: function(data) {
                                                          //   alert("OK");
                                                          refreshme();
                                                          refreshmeactuals();
                                                      },
                                                      error: function(err) {
                                                          return alert("There was an error modifying task! Please refresh the page and try again.");
                                                      }
                                                  }
                                              );
                                          },
                                          error: function(err) {
                                              return alert("There was an error deleting old assignments! Please refresh the page and try again.");
                                          }
                                      });
                              }
                              },
                              {addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
                                  $noty.close();
                                  $('#assigntask').hide();
                                  noty({type: 'success', text: 'please select other lineitems for assignment',  timeout: 3000});
                              }
                              }
                          ]
                      });

                  }

                },
                error: function(err) {
                    return alert("There was an error assigning lineitems! Please refresh the page and try again.");
                }
            }
        );


        if (postojatstari==0)
        {
            // ZA DA NAPOLNIME FIELD MANAGER NI TREBA jobid  taskid - MOZE DA TREBA SE OTVORI PRVO NOV TASK ID SO TYPE - 1OO NA TOJ DATUM
            // datetask - TOA E OD LINEITEMITE - STO SE SELEKTIRANI, I MANAGEROT
            // /admin/actualjobs/assigns?jobid='+jobid+'&taskid='+ taskid + '&datetask='+datetask+'&fieldid='+fieldid,
            var jobidno = $("#totals").attr("data-job-id");
            var tasktypeid = 4;
            var fieldid =  $("#fieldManagers option:selected" ).val();
            var crewleaderid =  $("#crewleader option:selected" ).val();
            var boxid =  $("#box option:selected" ).val();
            var orderid =  $("#order option:selected" ).val();

            var notes = $("#notes").val();

            // izbrisano
            // otvori nov task so addTaskNew... a sto e so edit na toj task... dali starite assignmenti treba da se brisat;
            var taskid = 0;
            jsRoutes.controllers.Tasks_rd.addTaskNewPlans().ajax(
                {
                    async: false,
                    data: {
                        jobid: jobidno,
                        taskType: tasktypeid,
                        crew: boxid,
                        datumot: datetask
                    },
                    success: function(data) {
                        // id-to na taskot ni treba
                        taskid = data.id;
                    },
                    error: function(err) {
                        return alert("There was an error adding task! Please refresh the page and try again.");
                    }
                }
            );

            // update napraj mu so
            /*jsRoutes.controllers.Tasks.updateTask(context.el.attr("data-task-id")).ajax
             data:
             crew: context.el.attr("data-crew")
             cardOrder: context.el.attr("data-card-order")
             date: context.el.attr("data-date")
             notes: context.el.attr("data-notes")
             manager: context.el.attr("data-manager-id")*/
            // konecno mapiraj gi lineitems so toj taskid...
            jsRoutes.controllers.Tasks_rd.updateTask(taskid).ajax(
                {
                    async: false,
                    data: {
                        cardOrder: orderid,
                        notes: notes,
                        crew: boxid
                    },
                    success: function(data) {
                        //   alert(data[0].id);
                    },
                    error: function(err) {
                        return alert("There was an error modifying task! Please refresh the page and try again.");
                    }
                }
            );



            // do tuka


            // DA SE STAVI KONECNO ASSIGNMENT na toj TASK
            var st = datetask;
            var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
            //  var dt = new Date(st.replace(pattern,'$3-$1-$2'));
            var dt = st.replace(pattern,'$3-$1-$2');


            $.ajax({
                async: false,
                type: 'POST',
                url: '/admin/actualjobs/assigns?jobid='+jobidno+'&taskid='+ taskid + '&datetask='+dt+'&fieldid='+fieldid,
                success: function(datana) {
                    var n = noty({type: 'success', text: 'Task was assigned to ' + $("#fieldManagers option:selected" ).text(),  timeout: 3000});
                    $('.assignTask[data-href-date='+datetask+'][data-href='+taskid+']').html(datana);
                    $('#assigntask').hide();
                },
                error: function (result) {
                    alert('Some error occurred while assigning the date task.');
                }
            });


           /* (table.rows('.selected')).each(function() {*/
                var idnja = table.rows('.selected')[0];
                    for (var i=0; i<idnja.length; i++)
                    {
                        (function(i)
                        {
                        //  var jobidto =  $("#jobbudgetlists tbody tr").eq(idnja[i]).attr('id');

                        var vendorid =  $("#jobbudgetlists tbody > tr:nth-child("+(idnja[i]+1) +") td:nth-child(2)").attr('data-vendor-id');


                        /*var vendorid =  $("#jobbudgetlists tbody tr td:nth-child(2)").attr('data-vendor-id');*/
                        var itemid = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(3)").attr('data-item-id');
                        var itemtypeid = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(3)").attr('data-item-type-id');

                        var quantity = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(4)").find('.quantity').val();
                        var rate = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(5)").find('.rate').val();
                        var saleprice = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(6)").html();

                        var tasktypeid = 4;
                        //    var date = $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(8)").html();
                        //   var taskidno =  $("#jobbudgetlists tbody > tr:nth-child("+ (idnja[i]+1) +") td:nth-child(9)").attr('data-task-id');

                        if (itemid != "" && itemtypeid != "" && quantity != "" && rate != ""  && tasktypeid != "" && dt != "") // && saleprice !=""
                        {
                            $.ajax({
                                async: false,
                                type: 'POST',
                                url: '/jobs/lineitemsActual/addeditActual?jobid='+jobidno+"&tasktype="+tasktypeid+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtypeid+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+dt+"&taskidno="+taskid,
                                success: function() {
                                },
                                error: function (result) {
                                    alert('Some error occurred while updating lineitems.');
                                }
                            });
                        }
                    })(i);
                }
                // da se osvezi cardot... vidi kako mozeme toa;
          /*  });*/


            // STO TREBA DA SE NAPRAVI SO LINEITEMS otkako ke se popolni TASK-ot
            // update na lineitems set task_id kolona na taskot nas... where sto se selektirani so toj lineid

            jsRoutes.controllers.Lineitems_rd.updateLineItemforNewJob(celstring).ajax(
                {
                    async: false,
                    data: {
                        taskid: taskid
                    },
                    success: function(data) {
                        refreshme();
                        refreshmeactuals();
                        //   alert("OK");
                    },
                    error: function(err) {
                        return alert("There was an error modifying task! Please refresh the page and try again.");
                    }
                }
            );
        }
       });



    $("body").on('click','.deleteLineitem', function() {
        if (confirm('Are you sure?')) {

            var blineid = this.parentNode.parentNode.getAttribute("data-lineitem-id"); //this.parentNode.parentNode.id;
            return jsRoutes.controllers.Lineitems_rd.deleteLineitem(blineid).ajax({
                context: this,
                success: function() {
                    // this.closest("tr").remove();
                    refreshme();
                    refreshmeactuals();
                },
                error: function(err) {
                    return alert("There was an error deleting the budget line item! Please refresh the page and try again.");
                }
            });
        }
    });


    $("body").on('click','.deleteLineitemactual', function() {
        if (confirm('Are you sure?')) {

            var blineid = this.parentNode.parentNode.getAttribute("data-lineitem-id"); //this.parentNode.parentNode.id;
            return jsRoutes.controllers.Lineitems_rd.deleteLineitem(blineid).ajax({
                context: this,
                success: function() {
                    // this.closest("tr").remove();
                    refreshmeactuals();
                },
                error: function(err) {
                    return alert("There was an error deleting the budget line item! Please refresh the page and try again.");
                }
            });
        }
    });




    $("body").on('click','#addBudgetLineitem', function() {
        refreshme();
        refreshmeactuals();
    });

    $("body").on('click','.verifybutt', function() {
        // fati go id-to od verifybutt
        var lineid = this.parentNode.getAttribute("data-line-id");
        verifyLineItem(lineid);
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


    $("#jobbudgetlists").DataTable({
        "sDom": 't',
        "bPaginate": false,
        "info":     false,
        "bFilter": false,
        'bSortable' : false
    });


    var table = $('#jobbudgetlists').DataTable();
    $("#jobbudgetlists tbody").on('click','tr', function() {
        var table = $('#jobbudgetlists').DataTable();
        var toogle = $(this).find('td:last').html().toString();
        if(toogle.contains("verified"))
        {
            $(this).removeClass('selected');
        }
        else
        {
            $(this).toggleClass('selected');
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

    $('#buttonaddign').click( function() {
      //  window.scrollTo(0, 0);
        $('#assigntask').show();
    } );

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
                type: "POST",
                data: {
                    verifylineitemid: lineitemid
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
}



function updateLineItemAssignments(linitemsspilit){


    if ($('#calendarmalendar').val() !="")
        var selectedDate = $('#calendarmalendar').val();

    jsRoutes.controllers.Jobs_rd.reorderLineItemDates().ajax(
        {
            type: "POST",
            data: {
                lineitemsid: linitemsspilit,
                datesel : selectedDate
            },
            success: function(datasub) {
                refreshme();
                refreshmeactuals();
                $('#assigntask').hide();
            },
            error: function(err) {
                return alert("There was an error saving job budget lines dates.");
            }
        }
    );

}


function refreshme(){

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
                Backbone.history.loadUrl( Backbone.history.fragment );


                $("#jobbudgetlists").DataTable({
                    "sDom": 't',
                    "bPaginate": false,
                    "info":     false,
                    "bFilter": false,
                    'bSortable' : false
                });

                var table = $('#jobbudgetlists').DataTable();
                $("#jobbudgetlists tbody").on('click','tr', function() {
                    var table = $('#jobbudgetlists').DataTable();
                    var toogle = $(this).find('td:last').html().toString();
                    if(toogle.contains("verified"))
                    {
                        $(this).removeClass('selected');
                    }
                    else
                    {
                        $(this).toggleClass('selected');
                    }
                });


             // OVA ZA TOTALITE

/*

                    var budgetTotal, fprofit, i, left, mprofit, pctprofit, ppsqft, prevTotal, sale, salecosttotal, temp, total, totalsqft, used;
                total = 0;
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

                    if ($("#saleitems>table>tbody>tr").length === 0) {
                        $("#saleprice>span").html(sale.toFixed(2));
                        $("#totals").attr("data-sale");
                    } else {
                        sale = parseFloat($("#totals").attr("data-sale"));
                    }
                    $("#actual .saleprice").html(sale.toFixed(2));
                    $("#totals").attr("data-cost");
                    ppsqft = 0;
                    totalsqft = parseFloat($("#totalsqft").html());
                    if (totalsqft > 0) {
                        ppsqft = sale / totalsqft;
                    }
                    $("#totals").attr("data-ppsqft");
                    pctprofit = 0;
                    if (sale > 0) {
                        pctprofit = 100 * (1 - total / sale);
                    }
                    $("#ppsqft").html(ppsqft.toFixed(2));
                    $("#totalcost").html(total.toFixed(2));
                    $("#totalsale").html(salecosttotal.toFixed(2));

*/

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




                $('#buttonaddign').click( function() {
                    //  window.scrollTo(0, 0);
                    $('#assigntask').show();
                } );
            },
            error: function(err) {
                return alert("There was an error refreshing job budget lines.");
            }
        }

    );
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
                Backbone.history.loadUrl( Backbone.history.fragment );
            },
            error: function(err) {
                return alert("There was an error refreshing job budget lines.");
            }
        }

    );
}
