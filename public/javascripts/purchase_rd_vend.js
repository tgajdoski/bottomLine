
$(document).ready(function() {

    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }



    $("body").on("click", ".clicka", function(){
        //  window.location.href = "/jobs/" + $(this).text();
        window.open("/jobs/" + $(this).text());
    });

    $( "#exall").click(function(){
        ExportAllTablesToExcel();
    });

    function ExportAllTablesToExcel(){

        var html;
        var table_html = '<table><tr>';
        //go through all tables
        $('table.eachvendor').each(function(){
            //add their HTML to our big HTML string
            table_html += '<tr><table>' + $(this).html() + '</table></tr>';
            //remove that table from the page
            //  html+=$(this.outerHTML);
        });

        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(table_html));
    }
    $("#printtotals").click(function() {
        return window.open("/report/front/newpurchase/print?market=" + getQueryVariable("market") +"&itemCategory=" + getQueryVariable("itemCategory") +"&manager=" + getQueryVariable("manager") +"&vendor=" + getQueryVariable("vendor") +"&startDate=" + getQueryVariable("startDate") +"&endDate=" + getQueryVariable("endDate") +"&vendorview=" + getQueryVariable("vendorview") + "&font=10");
    })

    $("#printperjobs").click(function() {
        return window.open("/report/front/newpurchase/printperjob?market=" + getQueryVariable("market") +"&itemCategory=" + getQueryVariable("itemCategory") +"&manager=" + getQueryVariable("manager") +"&vendor=" + getQueryVariable("vendor") +"&startDate=" + getQueryVariable("startDate") +"&endDate=" + getQueryVariable("endDate") +"&vendorview=" + getQueryVariable("vendorview") + "&font=10");
    })

    $("#printtot").click(function() {
        return window.open("/report/front/newpurchase/printtotals?market=" + getQueryVariable("market") +"&itemCategory=" + getQueryVariable("itemCategory") +"&manager=" + getQueryVariable("manager") +"&vendor=" + getQueryVariable("vendor") +"&startDate=" + getQueryVariable("startDate") +"&endDate=" + getQueryVariable("endDate") +"&vendorview=" + getQueryVariable("vendorview") + "&font=10");
    })

    $("#printtotorder").click(function() {
        // var parms;
        // parms
        //?market=&itemCategory=2&customer=&manager=&vendor=&startDate=2015-05-01&endDate=2015-05-04&vendorview=0
        //parms = (window.location.href.indexOf("?")!=-1)?"&"+window.location.href.split("?")[1]:"";
        return window.open("/report/front/newpurchase/printtotalsorder?market=" + getQueryVariable("market") +"&itemCategory=" + getQueryVariable("itemCategory") +"&manager=" + getQueryVariable("manager") +"&vendor=" + getQueryVariable("vendor") +"&startDate=" + getQueryVariable("startDate") +"&endDate=" + getQueryVariable("endDate") +"&vendorview=" + getQueryVariable("vendorview") + "&font=10");
    })

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



    $( '.noteupdates').focusout(function(){
        // mora so this
        var lineitemid = $(this).closest('tr').find('td:nth-child(1)').attr('data-href');

        var notetext = $(this).closest('tr').find('td:nth-child(8)').find('.noteupdates').val();


        if (notetext != "")
        {
            // update na note na taskot ako imame samo lineitemid

            jsRoutes.controllers.Lineitems_rd.updateTaskNoteLineItem().ajax(
                {
                    async: false,
                    data: {
                        lineitemid:lineitemid,
                        note: notetext
                    },
                    success: function(datasubve) {

                    },
                    error: function(err) {
                        return alert("There was an error saving note!");
                    }
                }
            );
        }

    });




    $("body").on('change','.addtopo', function() {

     /*   var historyflag = 0;
        if ($(this).closest('tr').find('td:nth-child(9)').find('.addtopo').prop('checked'))
        {
            historyflag = 0;
        }
        else
        {
            historyflag = 1;
        }

        var lineitemid = $(this).closest('tr').find('td:nth-child(1)').attr('data-href');
        var notetext = $(this).closest('tr').find('td:nth-child(7)').find('.noteupdates').val();
        var taskid =  $(this).closest('tr').find('td:nth-child(1)').attr('data-task-id');
        var fromwhere = $(this).closest('tr').find('td:nth-child(8)').find('.fromdropdown').val();

        jsRoutes.controllers.Lineitem_POs_rd.savePo().ajax(
            {
                async: false,
                data: {
                    lineitemid:lineitemid,
                    historyflag: historyflag,
                    fromwhere: fromwhere,
                    taskid: taskid,
                    notes: notetext

                },
                success: function(datasubit) {
                    // pokazi note
                },
                error: function(err) {
                    return alert("There was an error saving PO");
                }
            }
        );
*/
        var lineitemid = $(this).closest('tr').find('td:nth-child(1)').attr('data-href');
        var notetext = $(this).closest('tr').find('td:nth-child(8)').find('.noteupdates').val();
        var taskid =  $(this).closest('tr').find('td:nth-child(1)').attr('data-task-id');
        var fromwhere = $(this).closest('tr').find('td:nth-child(9)').find('.fromdropdown').val();
        var itemtype = $(this).closest('tr').find('td:nth-child(1)').attr('data-item-type');
        var selectedJob = $(this).closest('tr').find('td:nth-child(1)').attr('data-job-id');
        var vendorid =$(this).closest('tr').find('td:nth-child(3)').find('.vendorSelect').val();
        var itemid = $(this).closest('tr').find('td:nth-child(4)').attr('data-item-id');
        var quantity =  $(this).closest('tr').find('td:nth-child(5)').text();
        var units = $(this).closest('tr').find('td:nth-child(4)').attr('data-units');
        var rate =  $(this).closest('tr').find('td:nth-child(6)').text();
        var saleprice = $(this).closest('tr').find('td:nth-child(7)').text();
        var selectedTaskType = 4;

        var historyflag = 0;
        if ($(this).closest('tr').find('td:nth-child(10)').find('.addtopo').prop('checked'))
        {
            historyflag = 0;
            // redonly
            //   $('#vendorSelect-668792').prop('readonly', true);
         /*   $(this).closest('tr').find('td:nth-child(3)').find('.vendorSelect').prop('disabled', true);
            $(this).closest('tr').find('td:nth-child(4)').find('.itemSelect').prop('disabled', true);
            $(this).closest('tr').find('td:nth-child(5)').find('.quantity').prop('disabled', true);
            $(this).closest('tr').find('td:nth-child(6)').find('.price').prop('disabled', true);
            $(this).closest('tr').find('td:nth-child(7)').find('.total').prop('disabled', true);*/
            $(this).closest('tr').find('td:nth-child(8)').find('.noteupdates').prop('disabled', true);
            $(this).closest('tr').find('td:nth-child(9)').find('.fromdropdown').prop('disabled', true);
        }
        else
        {
            historyflag = 1;
            //remove readonly
         /*   $(this).closest('tr').find('td:nth-child(3)').find('.vendorSelect').prop('disabled', false);
            $(this).closest('tr').find('td:nth-child(4)').find('.itemSelect').prop('disabled', false);
            $(this).closest('tr').find('td:nth-child(5)').find('.quantity').prop('disabled', false);
            $(this).closest('tr').find('td:nth-child(6)').find('.price').prop('disabled', false);
            $(this).closest('tr').find('td:nth-child(7)').find('.total').prop('disabled', false);*/
            $(this).closest('tr').find('td:nth-child(8)').find('.noteupdates').prop('disabled', false);
            $(this).closest('tr').find('td:nth-child(9)').find('.fromdropdown').prop('disabled', false);

        }

        if (lineitemid != "" && itemid!="" && vendorid!="" &&  quantity!="" && rate!="" && saleprice!="")
        {

       //     EditBudgetLineItemfromPO(lineitemid,vendorid, itemid,    quantity, rate, saleprice);
            brisiStarActualPO(lineitemid, taskid);
            if (historyflag != 1)
                AddActualupdatedBLIPO(lineitemid, selectedJob, selectedTaskType , vendorid, itemid, itemtype,  quantity,   rate, saleprice, taskid, units)

        }


        jsRoutes.controllers.Lineitem_POs_rd.savePo().ajax(
            {
                async: false,
                data: {
                    lineitemid:lineitemid,
                    historyflag: historyflag,
                    fromwhere: fromwhere,
                    taskid: taskid,
                    notes: notetext

                },
                success: function(datasubit) {
                    // pokazi note
                },
                error: function(err) {
                    return alert("There was an error saving PO");
                }
            }
        );


    });







});


function brisiStarActualPO(lineitemid, taskid)
{
    jsRoutes.controllers.Lineitems_rd.deleteActualLinefromPO().ajax(
        {
            async: false,
            data: {
                lineitemid:lineitemid,
                taskid: taskid
            },
            success: function(datasubit) {
                // pokazi note
            },
            error: function(err) {
                return alert("There was an error saving PO");
            }
        }
    );
}



//   EditBudgetLineItemfromPO(lineitemid,vendor, itemid,  itemtype,  quantity, rate, saleprice);
function EditBudgetLineItemfromPO(lineitemid,vendor, item,  quantity, rate, saleprice ){
    jsRoutes.controllers.Lineitems_rd.EditBudgetLineItemfromPO().ajax(
        {
            async: false,
            data: {
                lineitemid:lineitemid,
                vendor:vendor,
                item:item,
                quantity:quantity,
                rate:rate,
                saleprice:saleprice
            },
            success: function(datasubit) {
                /*    var stringq = "'#quantity" +lineitemid+"'";
                 var stringgp = "'#quantity" +lineitemid +"'";
                 $(stringq).val('0.0');
                 $(stringgp).val( datasubit['default_rate'] );*/
            },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );
}




function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function AddActualupdatedBLIPO(lineitemid, selectedJob, tasktype , vendorid, itemid, itemtype,  quantity,   rate, saleprice, taskid, units)
{

    jsRoutes.controllers.Lineitems_rd.addActualLinefromPO().ajax(
        {
            async: false,
            type: 'POST',
            data: {
                lineitemid:lineitemid,
                selectedJob: selectedJob,
                tasktype: tasktype,
                vendor: vendorid,
                item: itemid,
                itemtype: itemtype,
                quantity: quantity,
                rate:rate,
                saleprice: saleprice,
                taskidno:taskid,
                lineitemidORG:lineitemid,
                units : units
            },
            success: function(datasubit) {
                // pokazi note
            },
            error: function(err) {
                return alert("There was an error saving PO");
            }
        }
    );
}


