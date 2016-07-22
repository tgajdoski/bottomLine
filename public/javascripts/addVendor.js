
$(document).ready(function() {

    $(".step2").hide();
    $(".custdivselectedview").hide();
    $(".subdivselectedview").hide();
   $(".subdiv").hide();
    $(".newcust").hide();

$("#buttonaddcustomer").click(
    function()
    {
        jsRoutes.controllers.Vendors_rd.addVendor().ajax(
            {
                data: {
                    market: $("#newCustomerMarket").find("option:selected").val(),
                    name: $("#newCustomerName").val()
                },
                success: function(data) {
                         $(".custdivselected").text(data["name"]);
                      //  $(".custiddivselected").text(data["id"]);
                    $(".newCustomerview").hide();
                    $(".step2").show();

                    $(".custdivselectedview").show();
                    $('input[name="id"]').val(data["id"]);

                    $('input[name="name"]').val(data["name"]);
                },
                error: function(err) {
                    return alert("There was an error adding the customer! Please refresh the page and try again.");
                }
            }
        );

      //  $(".subdiv").show();
    //    $(".newCustomerview").hide();
    }
);



    $(".buttonaddsubdivision").click(
        function()
        {
             jsRoutes.controllers.Vendors_rd.addItem().ajax(
                {
                    data: {
                        customer:$(".custdivselected").text(),
                        name: $("#newSubdivision").val()
                    },
                    success: function(datasub) {
                        /*   $("#typeSelect").change();
                         return $("#customerSelect").find("option[value='" + data.id + "']").attr("selected", "selected").end().change();*/
                         $(".subdivisionSelect").append($('<option/>', {value:  datasub.id , text: datasub.name}));
                        $(".subdivisionSelect").find("option[value='" + datasub.id + "']").attr("selected", "selected").end().change();

                        $(".step2").show();
                        return $(".subdivselected").text('with selected subdivision: ' + datasub["name"]);
                    },
                    error: function(err) {
                        return alert("There was an error adding the customer! Please refresh the page and try again.");
                    }
                }
            );

        }
    );



    $("#newCustomerMarket").change(
        function()
        {
            if ($("#newCustomerMarket")[0].selectedIndex > 0)
            {
                 $(".newcust").show();
            }else
            {
                $(".newcust").hide();
            }
        });

    $(".subdivisionSelect").change(
        function()
        {
            alert("smenato sto da se pram");
        }
    );



});