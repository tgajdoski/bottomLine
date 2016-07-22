
$(document).ready(function() {
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

    $("#skrijgobezmarket").hide();

    $("#skrijgobezsubdivision").hide();




    $(function() {
        $( "#jobstartdatepicker" ).datepicker();
        $( "#jobstartdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
      //  $( "#jobstartdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
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
                            date:   $("#jobstartdatepicker").val(),
                            plan: planidno,
                            task: "4"
                            //newJobcustomer
                        },
                        success: function(data) {

                            // da gi napolnime samite actuals date - bez nikoj FM assigniran
                            window.location.href = "/jobs/" + data.id
                        },
                        error: function(err) {
                            return alert("There was an error adding the job! Please check your plan, refresh the page and try again.");
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
                    $('#newjobplan').html('');

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
                $("#lot").val();
                $("#lot").text();

                $('#newjobplan').html('');


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
            //isprazni gi plans i lot i se drugo

            if ($("#newJobsubdivision")[0].selectedIndex > 0)
            {
                $("#skrijgobezsubdivision").show();
            }else
            {
                $("#skrijgobezsubdivision").hide();
            }
        });





});