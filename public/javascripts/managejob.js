$(document).ready(function() {



    $('#jobs').DataTable( {
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "bServerSide": true,
        "sPaginationType": "full_numbers",
        "sAjaxSource": "/admin/ajax/jobs",
        "aLengthMenu": [[ 10, 25, 50, 100 , -1], [ 10,  25, 50, 100, "All"]],
        "iDisplayLength" : 10,

        "sDom": '<"H"lT>frt<"F"ip>',
        "oTableTools": {
            "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }

    });


/*

    $('#jobs').DataTable( {
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "bServerSide": true,
        "sPaginationType": "full_numbers",
        "sAjaxSource": "/admin/ajax/jobs"
    });


    $.ajax({
        type: "GET",
        url: '/admin/ajax/jobs',
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            loadDatatable(result['aaData']);
        },
        error: function (result) {
            alert('Some error occurred while retrieving account list. ' + result.responseText);
        }
    });


    function loadDatatable(aaData) {
        var oTable = $('#dataTableAccountList').dataTable({
            "aaData": aaData,
            "sDom": '<"H"lT>frt<"F"ip>',
            "oTableTools": {
                "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
                "aButtons" : ["xls", "copy", "csv", "pdf"]
            }
        })
    }
*/



    $('#planmodam').hide();

    $("#skrijgobezmarket").hide();

    $("#skrijgobezsubdivision").hide();





    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#planmodam').show();
    });


    $(function() {
        $( "#jobstartdatepicker" ).datepicker();
        $( "#jobstartdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        //  $( "#jobstartdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });


    $("#jobs tbody").on("click", "tr td .clicka", function(){
        // znaci sakame update
        $('#planmodam').hide();
        window.location.href = "/jobs/" + $(this).closest('tr').attr("id");
    });

    $("#jobs tbody").on("click", "tr td .deleteUser", function(){

        var d = $(this).closest('tr');
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        $("#defaultrateandunits").hide();
        var context;
        context = this;
        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Jobs_rd.deleteJob().ajax({
                data: {
                    id: $(this).closest('tr').attr("id")
                },
                success: function(data) {
                    var n = noty({type: 'success', text: 'Job ' + a + ' was removed',  timeout: 3000});
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the job! Please refresh the page and try again.");
                }
            });
        }
    });


    $("#buttonaddplan").click(function(){
            var planidno = $("#newjobplan").find("option:selected").val();
            if(planidno!='')
            {
                jsRoutes.controllers.Jobs_rd.addJobTask().ajax(
                    {
                        data: {
                            market: $("#newJobMarket").find("option:selected").val(),
                            subdivision: $("#newJobsubdivision").find("option:selected").val(),
                            lot: $("#lot").val(),
                            saleitem: $("#newjobitemtype").find("option:selected").val(),
                            plan: planidno,
                            date:   $("#jobstartdatepicker").val(),
                            task: "4"
                            //newJobcustomer
                        },
                        success: function(data) {
                            window.location.href = "/jobs/" + data.id
                        },
                        error: function(err) {
                            return alert("There was an error adding the customer! Please refresh the page and try again.");
                        }
                    }
                );
            }
            else
            {
                var n = noty({type: 'error', text: 'Plan is mandatory. Please select one from the dropdown menu.',  timeout: 3000});
            }

        });




    $(".close").click(function() {
        $('#planmodam').hide();
    });

    $("#close").click(function() {
        $('#planmodam').hide();
    });




    function populatecustomers(marketidto){
        jsRoutes.controllers.Customers_rd.getCustomerList(marketidto).ajax(
            {
                data: {
                    id:marketidto
                },
                success: function(datasub) {
                    //  $('#innersubdivisionSelect')..find('option').remove();
                    var html = '';
                    var len = datasub.length;

                    html+='<option value=""></option>';
                    for (var i = 0; i< len; i++) {

                        if (datasub[i] != null)
                        {
                            html +=  '<option value="' + datasub[i].id + '">' +  datasub[i].name + '</option>';
                        }
                    }
                    $('#newJobcustomer').empty().append(html);
                    //  $('#customers').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
                },
                error: function(err) {
                    return alert("There was an error reading customers information! Please refresh the page.");
                }
            }
        );
    }


function populatesubdivisions(custidto){
    jsRoutes.controllers.Customers_rd.getSubdivisionsList(custidto).ajax(
        {
            data: {
                id:custidto
            },
            success: function(datasub) {
                //  $('#innersubdivisionSelect')..find('option').remove();
                var html = '';
                var len = datasub.length;

                html+='<option value=""></option>';
                for (var i = 0; i< len; i++) {

                    if (datasub[i] != null)
                    {
                        html +=  '<option value="' + datasub[i].id + '">' +  datasub[i].name + '</option>';
                    }
                }
                $('#newJobsubdivision').empty().append(html);
                //  $('#customers').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
            },
            error: function(err) {
                return alert("There was an error reading subdivisions for selected customer! Please refresh the page.");
            }
        }
    );
}




    function populateplan(custidto){
        jsRoutes.controllers.Plans_rd.getPlanListformCustomerid(custidto).ajax(
            {
                data: {
                    id:custidto
                },
                success: function(datasub) {
                    //  $('#innersubdivisionSelect')..find('option').remove();
                    var html = '';
                    var len = datasub.length;

                    html+='<option value=""></option>';
                    for (var i = 0; i< len; i++) {

                        if (datasub[i] != null)
                        {
                            html +=  '<option value="' + datasub[i].id + '">' +  datasub[i].name + '</option>';
                        }
                    }
                    $('#newjobplan').empty().append(html);
                    //  $('#customers').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
                },
                error: function(err) {
                    return alert("There was an error reading subdivisions for selected customer! Please refresh the page.");
                }
            }
        );
    }



// getSubdivisionsList

    $("#newJobMarket").change(
        function()
        {
            if ($("#newJobMarket")[0].selectedIndex > 0)
            {

                $("#skrijgobezmarket").show();
                // zemi gi customers tuka od getCustomerList(marketid)
                populatecustomers($("#newJobMarket option:selected" ).val())

            }else
            {
                $("#skrijgobezmarket").hide();
            }
        });




    $("#newJobcustomer").change(
        function()
        {
            if ($("#newJobcustomer")[0].selectedIndex > 0)
            {
                populatesubdivisions($("#newJobcustomer option:selected" ).val());
                populateplan($("#newJobcustomer option:selected" ).val());
            }
        });


    $("#newJobsubdivision").change(
        function()
        {
            if ($("#newJobsubdivision")[0].selectedIndex > 0)
            {
                $("#skrijgobezsubdivision").show();
            }else
            {
                $("#skrijgobezsubdivision").hide();
            }
        });

});