$(document).ready(function() {

    $('#marketmodal').hide();


    $("#buttonadditem").click(function()
    {
        if ($('#addorupdate').val() == 0)
        {
            jsRoutes.controllers.Customers_rd.addMarket().ajax(
                {
                    data: {
                        city: $("#city").val(),
                        state: $("#state").val(),
                        woeid: $('#woeid').val()
                    },
                    success: function(data) {
                        $('#marketdivselectedtext').text("Market " + data["name"]);
                        $('input[name="id"]').val(data["id"]);
                        $('#marketmodal').hide();
                        setTimeout(function(){window.location.href = "/admin/markets"}, 500);

                    },
                    error: function(err) {
                        return alert("There was an error adding the market! Please refresh the page and try again.");
                    }
                }
            );
        }
        else
        {
            jsRoutes.controllers.Customers_rd.updateMarket().ajax(
                {
                    data: {
                        id: $('input[name="id"]').val(),
                        city: $("#city").val(),
                        state: $("#state").val(),
                        woeid: $('#woeid').val()
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Market  ' + $("#city").val() + ' ' + $("#state").val() + ' was updated',  timeout: 3000});
                        $('#marketmodal').hide();
                        setTimeout(function(){window.location.href = "/admin/markets"}, 500);

                    },
                    error: function(err) {
                        return alert("There was an error updating the market! Please refresh the page and try again.");
                    }
                }
            );
        }
    });


    function populatedatatableitems(idto){

    }





    function openwhatneeded(){
        $('#marketmodal').show();
        if($('#addorupdate').val()==0)
        {
            //

        }
        else
        {
            // update vendor

        }
    }


    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#marketdivselectedtext').text("Add new market");
        openwhatneeded();
    });


    $("#markets tbody").on("click", "tr td .clicka", function(){
        $('#addorupdate').val(1);
        openwhatneeded();
        $('#marketdivselectedtext').text("Market  " + $(this).closest('tr').find("td:nth-child(2)").text());
        $("#dataDiv").val($(this).closest('tr').attr("data-user-id"));
        $('input[name="id"]').val($(this).closest('tr').attr("data-user-id"));

        populatefields($(this).closest('tr').attr("data-user-id"));

    });



    function populatefields(idto){

        jsRoutes.controllers.Customers_rd.getMarketByid(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    $( '#city').val( datasub['city']);
                    $( '#state').val( datasub['state']);
                    $( '#url').val( datasub['url'] );
                    $( '#woeid').val( datasub['woeid'] );
                    $( '#taxrate').val( datasub['taxrate'] );
                    $( '#buttonadditem').val( 'Update Market');
                },
                error: function(err) {
                    return alert("There was an error reading the item information! Please refresh the page and try again.");
                }
            }
        );
    }




    $("#markets").DataTable({
            "sDom": '<"H"lT>frt<"F"ip>',
            "oTableTools": {
                "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
                "aButtons" : ["xls", "copy", "csv", "pdf"]
            }
        }
    );


            $("#markets tbody").on("click", "tr td .deleteUser", function(){
            var d = $(this).closest('tr');
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var context;
            context = this;
            if (confirm("Are you sure?")) {
                return jsRoutes.controllers.Customers_rd.deleteMarket().ajax({
                    data: {
                        id: $(this).closest('tr').attr("data-user-id")
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Market ' + a + ' was deleted',  timeout: 3000});
                        return d.remove();
                    },
                    error: function(err) {
                        return alert("There was an error deleting the market! Please refresh the page and try again.");
                    }
                });
            }
    });


    $(".close").click(function() {
        $('#marketmodal').hide();
    });

    $("#close").click(function() {
        $('#marketmodal').hide();
    });


});
