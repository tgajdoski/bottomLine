
$(document).ready(function() {
/*

   $(".step2").hide();

    // populate option subdivs if any


    $(".buttonaddsubdivision").click(
        function()
        {
             jsRoutes.controllers.Vendors_rd.addVendorItem().ajax(
                {
                    data: {

                        item: $("#itemdivisionSelect").find("option:selected").val(),
                        vendor: $('input[name="id"]').val()

                    },
                    success: function(datasub) {

                         $("#vendoritems").append($(
                        '<tr data-user-id='+datasub.id+'>' +
                            '<td><a class="deleteUser"><i class="fa fa-trash-o"></i></a></td>' +
                            '<td style="margin:0;padding-left:14px;">'+datasub.item.name+'</td>' +
                        '</tr>'));
                      */
/*  $("#subdivisionSelect").find("option[value='" + datasub.id + "']").attr("selected", "selected").end().change();*//*

                    },
                    error: function(err) {
                        return alert("There was an error adding the vendor item! Please refresh the page and try again.");
                    }
                }
            );

        }
    );


*/

    $("#vendoritems tbody").on("click", "tr td .deleteUser", function(){
        var d = $(this).closest('tr');
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        var context;
        context = this;
        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Vendors_rd.deleteVendorItem().ajax({
                data: {
                    id: $(this).closest('tr').attr("data-user-id")
                },
                success: function(data) {
                    var n = noty({type: 'success', text: 'Vendor item ' + a + ' was removed',  timeout: 3000});
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the customer! Please refresh the page and try again.");
                }
            });
        }
    });

/*
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
               *//* $('input[name="id"]').val($(".subdivisionSelect").val());
                $('input[name="name"]').val($(".subdivisionSelect").text());
                $(".step2").show();*//*
                window.location = "/vendors/vendoritems/" + $("#subdivisionSelect").val();
                // ni treba redirect kon toj sundivision
            }
        }
    );*/



});