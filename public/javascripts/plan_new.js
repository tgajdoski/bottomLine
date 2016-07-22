
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
                    Backbone.history.loadUrl( Backbone.history.fragment );

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
