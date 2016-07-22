$(document).ready(function() {

    $("#accounttypes").DataTable({
        "sDom": '<"H"lT>frt<"F"ip>',

        "oTableTools": {
            "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }
    });

 //   $('#customermodal').hide();
  //  $("#accordion").hide();

  //  $(".custdivselectedview").hide();
 //   $(".subdivselectedview").hide();
 //   $(".subdivdetails").hide();
//    $(".newcust").hide();


    $("body").on("click", ".actinact", function(){
            var retval = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var customerid = $(this).closest('tr').attr('data-user-id');// $(this).val();
            jsRoutes.controllers.Bills.updateaccounttypeActive().ajax(
                {
                    data: {
                        accounttypeid: customerid,
                        active: retval
                    },
                    success: function(data) {
                        if (retval)
                            var n = noty({type: 'success', text: 'Account type ' + a + ' is active.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Account type ' + a + ' is inactive.',  timeout: 3000});
                    },
                    error: function(err) {
                        return alert("There was an error changing the customer! Please refresh the page and try again.");
                    }
                });
        }
    );



    $("#accounttypes tbody").on("click", "tr td .clicka", function(){

        // znaci sakame update
        $('#addorupdate').val(1);


        $('#accounttypeselect').text("Account type  " + $(this).closest('tr').find("td:nth-child(2)").text());


        $('#name').val($(this).closest('tr').find("td:nth-child(2)").text());
        $('#type').val( $(this).closest('tr').find("td:nth-child(3)").text());

    //    console.log($(this).closest('tr').find("td:nth-child(2)").text());
    //    console.log($(this).closest('tr').find("td:nth-child(3)").text());
        $('#accounttypemodel').show();


        $("#dataDiv").val($(this).closest('tr').attr("data-user-id"));



    });




    $("#updateaccounttype").click(function(){

        jsRoutes.controllers.Bills.updateaccountType().ajax(
            {
                data: {

                    id: $('#dataDiv').val(),
                    name: $('#name').val(),
                    type:$('#type').val()

                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'account type ' + $('#name').val() + ' was updated',  timeout: 2000});
                    $('#accounttypemodel').hide();
                     location.reload();
                },
                error: function(err) {
                    return alert("There was an error updating the account type! Please refresh the page and try again.");
                }
            }
        );

    });


    $(".close").click(function() {
        $('#accounttypemodel').hide();
    });

    $("#close").click(function() {
        $('#accounttypemodel').hide();
    });

});
