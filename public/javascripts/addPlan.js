
$(document).ready(function() {

   $("#selecttemplate").hide();


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