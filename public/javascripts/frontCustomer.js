
$(document).ready(function() {

   $(".step2").hide();

    // populate option subdivs if any


    $(".buttonaddsubdivision").click(
        function()
        {
            jsRoutes.controllers.Customers_rd.addSubdivision().ajax(
                {
                    data: {
                        customer:$(".custdivselected").text(),
                        name: $("#newSubdivision").val()
                    },
                    success: function(datasub) {
                        /*   $("#typeSelect").change();
                         return $("#customerSelect").find("option[value='" + data.id + "']").attr("selected", "selected").end().change();*/
                        $("#subdivisionSelect").append($('<option/>', {value:  datasub.id , text: datasub.name}));
                        $("#subdivisionSelect").find("option[value='" + datasub.id + "']").attr("selected", "selected").end().change();
                        $('input[name="id"]').val(datasub["id"]);
                        $('input[name="name"]').val(datasub["name"]);
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

    $("#subdivisionSelect").change(
        function()
        {
            if ($("#subdivisionSelect")[0].selectedIndex > 0)
            {
               /* $('input[name="id"]').val($(".subdivisionSelect").val());
                $('input[name="name"]').val($(".subdivisionSelect").text());
                $(".step2").show();*/
                window.location = "/customers/subdivisions/" + $("#subdivisionSelect").val();
                // ni treba redirect kon toj sundivision
            }
        }
    );



});