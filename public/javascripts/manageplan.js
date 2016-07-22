$(document).ready(function() {

    // $("#plans").DataTable();




    $("#plans tbody").on("click", "tr td .actinact", function(){
        var returnVal = $(this).is(":checked");
       // alert($(this).val().toString() + returnVal);
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        var planid = $(this).val();
        jsRoutes.controllers.Plans_rd.updateActive().ajax(
            {
                data: {
                    planid: planid,
                    active: returnVal
                },
                success: function(data) {
                    if (returnVal)
                        var n = noty({type: 'success', text: 'Plan ' + a + ' is active.',  timeout: 3000});
                    else
                        var n = noty({type: 'success', text: 'Plan ' + a + ' is inactive.',  timeout: 3000});
                },
                error: function(err) {
                    return alert("There was an error changing the plan! Please refresh the page and try again.");
                }
            });
        }
    );

    $('#plans').DataTable( {
       /* "bProcessing": true,
        "aaSorting": [[ 0, "asc" ]],
        "bServerSide": true,

        "sPaginationType": "full_numbers",
        "sAjaxSource": "/admin/ajax/plans"
*/

        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "bServerSide": true,
        "sPaginationType": "full_numbers",
        "sAjaxSource": "/admin/ajax/plans",
        "aLengthMenu": [[ 10, 25, 50, 100 , -1], [ 10,  25, 50, 100, "All"]],
        "iDisplayLength" : 10,

        "sDom": '<"H"lT>frt<"F"ip>',
        "oTableTools": {
        "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }

    });


 /*
    $('#plans').dataTable( {
        "processing": true,
        "serverSide": true,
        "ajax":  "/admin/ajax/plans"
    } );
    */

    $('#planmodam').hide();

    $("#selecttemplate").hide();


    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#planmodam').show();

    });



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
                    $('#newtemplate').empty().append(html);
               },
                error: function(err) {
                    return alert("There was an error reading plan templates for selected customer! Please refresh the page.");
                }
            }
        );
    }




    $("#plans tbody").on("click", "tr td .clicka", function(){
        // znaci sakame update
        $('#planmodam').hide();
        window.location.href = "/plans/" + $(this).closest('tr').attr("id");
    });

    $("#plans tbody").on("click", "tr td .deleteUser", function(){

        var d = $(this).closest('tr');
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        $("#defaultrateandunits").hide();
        var context;
        context = this;
        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Plans_rd.deletePlan().ajax({
                data: {
                    id: $(this).closest('tr').attr("id")
                },
                success: function(data) {
                    var n = noty({type: 'success', text: 'Plan ' + a + ' was removed',  timeout: 3000});
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the plan! Please refresh the page and try again.");
                }
            });
        }
    });


    $("#buttonaddplan").click(
        function()
        {
            jsRoutes.controllers.Plans_rd.checkPrices().ajax(
                {
                    data: {
                        template: $("#newtemplate").find("option:selected").val()
                    },
                    success: function(data) {
                        if (data["priceChanges"].length > 0)
                        {
                            var changedvenditems = '';
                            var len = data["priceChanges"].length;
                            for (var i = 0; i< len; i++) {
                                changedvenditems+= 'Vendor: ' + data["priceChanges"][i]['venorname'] + '  item: ' + data["priceChanges"][i]['itemname'] + ' template price: ' + data["priceChanges"][i]['templateprice'] + ' current price: '+ data["priceChanges"][i]['itemnewprice'] + '<br>';
                            }

                            var n = noty({
                                type: 'confirm',
                                text: 'item price differences detected: <br> <br> ' + changedvenditems +' <br><br> Do you want to use template prices or current item prices?<br>',
                                buttons: [
                                    {addClass: 'btn btn-primary', text: 'OLD', onClick: function($noty) {
                                        $noty.close();
                                        noty({type: 'success', text: 'plan vendor items price will be copied from template',  timeout: 3000});

                                        jsRoutes.controllers.Plans_rd.addPlan().ajax(
                                            {
                                                data: {
                                                    template: $("#newtemplate").find("option:selected").val(),
                                                    customer: $("#newCustomerMarket").find("option:selected").val(),
                                                    name: $("#newplanname").val()
                                                },
                                                success: function(data) {
                                                    window.location.href = "/plans/" + data.id
                                                },
                                                error: function(err) {
                                                    return alert("There was an error adding the plan! Please refresh the page and try again.");
                                                }
                                            });


                                    }
                                    },
                                    {addClass: 'btn btn-danger', text: 'NEW', onClick: function($noty) {
                                        $noty.close();
                                        noty({type: 'success', text: 'plan vendor items price will be the new one ',  timeout: 3000});
                                        jsRoutes.controllers.Plans_rd.addPlanNewPrice().ajax(
                                            {
                                                data: {
                                                    template: $("#newtemplate").find("option:selected").val(),
                                                    customer: $("#newCustomerMarket").find("option:selected").val(),
                                                    name: $("#newplanname").val()
                                                },
                                                success: function(data) {
                                                    window.location.href = "/plans/" + data.id
                                                },
                                                error: function(err) {
                                                    return alert("There was an error adding the plan! Please refresh the page and try again.");
                                                }
                                            });

                                    }
                                    }
                                ]
                            });

                        }
                        else
                        {
                            jsRoutes.controllers.Plans_rd.addPlan().ajax(
                                {
                                    data: {
                                        template: $("#newtemplate").find("option:selected").val(),
                                        customer: $("#newCustomerMarket").find("option:selected").val(),
                                        name: $("#newplanname").val()
                                    },
                                    success: function(data) {
                                        window.location.href = "/plans/" + data.id
                                    },
                                    error: function(err) {
                                        return alert("There was an error adding the customer! Please refresh the page and try again.");
                                    }
                                });
                        }
                    },
                    error: function(err) {
                        alert("cant check price differences.")
                    }
                });



        }
    );


    $(".close").click(function() {
        $('#planmodam').hide();
    });

    $("#close").click(function() {
        $('#planmodam').hide();
    });


    $("#newCustomerMarket").change(
        function()
        {
            if ($("#newCustomerMarket")[0].selectedIndex > 0)
            {
                $("#selecttemplate").show();
                populateplan($('#newCustomerMarket').val());
            }else
            {
                $("#selecttemplate").hide();
            }
        });

});