$(document).ready(function() {

    $("#customers").DataTable({
        "sDom": '<"H"lT>frt<"F"ip>',

        "oTableTools": {
            "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }
    });

    $('#customermodal').hide();
    $("#accordion").hide();

    $(".custdivselectedview").hide();
    $(".subdivselectedview").hide();
    $(".subdivdetails").hide();
    $(".newcust").hide();






    $(function() {
        $( "#accordion" ).accordion({
            heightStyle: "content",
            collapsible: true
        });
    });


    $( "#qbexport").click(function(){
        window.location.href = jsRoutes.controllers.Customers_rd.customerQBexcelExport().url  + location.search
    });



    $("#customers tbody").on("click", "tr td .clicka", function(){

        // znaci sakame update
        $('#addorupdate').val(1);
        openwhatneeded();
        $("#accordion").accordion({ active: 0});

        $('#vendivselectedtext').text("Customer  " + $(this).closest('tr').find("td:nth-child(2)").text());

        $("#dataDivs").val($(this).closest('tr').attr("data-user-id"));

 // alert($(this).closest('tr').attr("data-user-id"));

        populatefields($(this).closest('tr').attr("data-user-id"));
        populatesubdivisions($(this).closest('tr').attr("data-user-id"));

        // selectiraj go marketot vo dropdownmenito... ne RABOTI

        $("#editCustomerMarket").find("option[value='" + $(this).closest('tr').find("td:nth-child(3)").text() + "']").attr("selected", "selected").end().change();


    });

    $("#customers tbody").on("change", "tr td #subdivisionSelect", function(){
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        var b = $(this).closest('tr').attr("data-user-id");//$(this).find("option:selected").val();
        $('#addorupdate').val(1);
        openwhatneeded();

        $('#vendivselectedtext').text("Customer " + $(this).closest('tr').find("td:nth-child(2)").text());
        $("#accordion").accordion({ active: 1});


        $('#divSubs').val($("#subdivisionSelect option:selected" ).val());


        $('input[name="id"]').val($(this).closest('tr').attr("data-user-id"));

        populatefields($(this).closest('tr').attr("data-user-id"));
        populatesubdivisions($(this).closest('tr').attr("data-user-id"));


        // selectiraj go marketot vo dropdownmenito... ne RABOTI

        $("#editCustomerMarket").find("option[value='" + $(this).closest('tr').find("td:nth-child(3)").text() + "']").attr("selected", "selected").end().change();;


        //  $("#innersubdivisionSelect").find("option[value='" +$("#subdivisionSelect option:selected" ).val() + "']").attr("selected", "selected").end().change();
      //  $("#innersubdivisionSelect").find("option[value='" +$("#subdivisionSelect option:selected" ).val() + "']").attr("selected", "selected").end().change();
    });

    $("body").on("click", ".actinact", function(){
            var retval = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var customerid = $(this).closest('tr').attr('data-user-id');// $(this).val();
            jsRoutes.controllers.Customers_rd.updateActive().ajax(
                {
                    data: {
                        customerid: customerid,
                        active: retval
                    },
                    success: function(data) {
                        if (retval)
                            var n = noty({type: 'success', text: 'Customer ' + a + ' is active.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Customer ' + a + ' is inactive.',  timeout: 3000});
                    },
                    error: function(err) {
                        return alert("There was an error changing the customer! Please refresh the page and try again.");
                    }
                });
        }
    );



    $('#innersubdivisionSelect').change(function(){
            if ($("#innersubdivisionSelect")[0].selectedIndex > 0)
            {
               // alert($("#innersubdivisionSelect option:selected" ).val());
                $('#divSubs').val($("#innersubdivisionSelect option:selected" ).val());
                $(".subdivdetails").show();
                populatesubdivisionfields($("#innersubdivisionSelect option:selected" ).val());
                $("#addsubdivlabel").text($("#innersubdivisionSelect option:selected" ).text());
            }
        else
            {
                $(".subdivdetails").hide();
                $("#addsubdivlabel").text("Add new subdivision");
            }
    });


    function populatesubdivisionfields(idto){

        jsRoutes.controllers.Customers_rd.getSubdivision(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    /*  var c = jQuery.parseJSON( datasub );*/
                    $( '#names' ).val( datasub['name'] );
                    $( '#address1s' ).val( datasub['address1'] );
                    $( '#address2s' ).val( datasub['address2'] );
                    $( '#citys' ).val( datasub['city'] );
                    $( '#states' ).val( datasub['state'] );
                    $( '#zips' ).val( datasub['zip'] );
                    $( '#contact_names' ).val( datasub['contact_name'] );
                    $( '#contact_number1s' ).val( datasub['contact_number1'] );
                    $( '#contact_number2s' ).val( datasub['contact_number2'] );
                    $( '#contact_faxs' ).val( datasub['contact_fax'] );
                    $( '#contact_email1s' ).val( datasub['contact_email1'] );
                    $( '#contact_email2s' ).val( datasub['contact_email2'] );
                    $( '#contact_email3s' ).val( datasub['contact_email3'] );
                    $( '#url' ).val( datasub['url'] );
                    $('.subdivdetails').show();
                },
                error: function(err) {
                    return alert("There was an error reading the customer information! Please refresh the page and try again.");
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
                    $('#innersubdivisionSelect').empty().append(html);
                  //  $('#customers').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
                },
                error: function(err) {
                    return alert("There was an error reading customer subdivision information! Please refresh the page.");
                }
            }
        );

    }

    function populatefields(idto){

        jsRoutes.controllers.Customers_rd.getCustomerbyID(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    /*  var c = jQuery.parseJSON( datasub );*/
                    $( '#name' ).val( datasub['name'] );
                    $( '#address1' ).val( datasub['address1'] );
                    $( '#address2' ).val( datasub['address2'] );
                    $( '#city' ).val( datasub['city'] );
                    $( '#state' ).val( datasub['state'] );
                    $( '#zip' ).val( datasub['zip'] );
                    $( '#contact_name' ).val( datasub['contact_name'] );
                    $( '#contact_number1' ).val( datasub['contact_number1'] );
                    $( '#contact_number2' ).val( datasub['contact_number2'] );
                    $( '#contact_fax' ).val( datasub['contact_fax'] );
                    $( '#contact_email1' ).val( datasub['contact_email1'] );
                    $( '#contact_email2' ).val( datasub['contact_email2'] );
                    $( '#contact_email3' ).val( datasub['contact_email3'] );
                    $('#updatevendormodal').show();
                },
                error: function(err) {
                    return alert("There was an error reading the customer information! Please refresh the page and try again.");
                }
            }
        );

        // selectiraj go marketot vo dropdownmenito... ne RABOTI

        $("#editCustomerMarket").find("option[value='" + $(this).closest('tr').find("td:nth-child(3)").text() + "']").attr("selected", "selected").end().change();;

    }

    $("#customers tbody").on("click", "tr td .deleteUser", function(){
        var d = $(this).closest('tr');
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        var context;
        context = this;
        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Customers_rd.deleteCustomer().ajax({
                data: {
                    id: $(this).closest('tr').attr("data-user-id")
                },
                success: function(data) {
                    var n = noty({type: 'success', text: 'Customer ' + a + ' was deleted',  timeout: 3000});
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the customer! Please refresh the page and try again.");
                }
            });
        }
    });





    $("#deletecustomersub").click(function(){

    var subid     =   $("#innersubdivisionSelect  option:selected" ).val();
        if (confirm("Deleting the subdivision will delete all jobs for that subdivision. Are you sure?")) {
        jsRoutes.controllers.Customers_rd.deleteCustomerSubdivision(subid).ajax(
            {
                data: {
                    id: subid
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'Subdivision ' + $('#names').val() + ' was deleted',  timeout: 2000});
                    $('#customermodal').hide();
                },
                error: function(err) {
                    return alert("There was an error deleting subdivision! Please refresh the page and try again.");
                }
            }
        );
        }

    });



    $("#updatecustomermarket").click(function(){

        if (confirm("Are you sure you want to change customer market?")) {
            jsRoutes.controllers.Customers_rd.updateCustomerMarket().ajax(
                {
                    data: {
                        id: $("#dataDivs").val(),
                        market: $("#editCustomerMarket").find("option:selected").val()
                    },
                    success: function(datasub) {
                        var n = noty({type: 'success', text: 'Customer market was updated',  timeout: 2000});
                        $('#customermodal').hide();
                    },
                    error: function(err) {
                        return alert("There was an error changing customer market! Please refresh the page and try again.");
                    }
                }
            );
        }

    });



    $("#updatevendorinformation").click(function(){

        jsRoutes.controllers.Customers_rd.updateCustomer().ajax(
            {
                data: {

                    id: $('#dataDivs').val(),
                    name: $('#name').val(),
                    address1:$('#address1').val(),
                    address2:$('#address2').val(),
                    city:$('#city').val(),
                    state:$('#state').val(),
                    zip:$('#zip').val(),
                    contact_name:$('#contact_name').val(),
                    contact_number1:$('#contact_number1').val(),
                    contact_number2:$('#contact_number2').val(),
                    contact_fax:$('#contact_fax').val(),
                    contact_email1:$('#contact_email1').val(),
                    contact_email2:$('#contact_email2').val(),
                    contact_email3:$('#contact_email3').val()
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'Customer ' + $('#name').val() + ' was updated',  timeout: 2000});
                    $('#updatevendorinformationdiv').hide();
                    $('#updatevendoritemsdiv').show();
               //     alert($('#dataDiv').val());
                 //   alert(datasub['id']);
                 //   $('#customers').dataTable().fnUpdate('<a class="clicka" href="#">'+$('#name').val()+'</a>' , $("tr[data-user-id='" + datasub['id'] + "']")[0], 1 );
                    location.reload();
                },
                error: function(err) {
                    return alert("There was an error updating the customer! Please refresh the page and try again.");
                }
            }
        );

    });


    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#vendivselectedtext').text("Add new customer");

        openwhatneeded();
    });

    function openwhatneeded(){
        $('#customermodal').show();
        if($('#addorupdate').val()==0)
        {
            // add vendor
            $('#addnewvendorfrontdiv').show();
            $('#accordion').hide();

        }
        else
        {
            // update vendor
            $('#addnewvendorfrontdiv').hide();
            $('#accordion').show();

        }
        // selectiraj go marketot vo dropdownmenito... ne RABOTI

        $("#editCustomerMarket").find("option[value='" + $(this).closest('tr').find("td:nth-child(3)").text() + "']").attr("selected", "selected").end().change();;

    }


    $(".close").click(function() {
        $('#customermodal').hide();
    });

    $("#close").click(function() {
        $('#customermodal').hide();
    });


// ZA ADD NEW CUSTOMER

    $("#buttonaddcustomer").click(
        function()
        {
            jsRoutes.controllers.Customers_rd.addCustomer().ajax(
                {
                    data: {
                        market: $("#newCustomerMarket").find("option:selected").val(),
                        name: $("#newCustomerName").val()
                    },
                    success: function(data) {
                      //  $(".custdivselected").text(data["name"]);
                        $("#addnewvendorfrontdiv").hide();
                    //    populatefields(data["id"]);
                        $('#accordion').show();
                        $("#accordion").accordion({ active: 0});
                        $("#updatevendorinformationdiv").show();
                        $('#vendivselectedtext').text("Customer " + data["name"]);

                        $('input[name="id"]').val(data["id"]);
                       // $('#dataDiv').val(data["id"]);
                        $('input[name="name"]').val(data["name"]);

                   //     populateitemtablefields(data["id"]);
                    },
                    error: function(err) {
                        return alert("There was an error adding the customer! Please refresh the page and try again.");
                    }
                }
            );
        }
    );



    $("#updatecustomersubinformation").click(
        function()
        {
            jsRoutes.controllers.Customers_rd.updateSubdivision($("#innersubdivisionSelect option:selected" ).val()).ajax(
                {
                    data: {

                        id: $('#dataDivs').val(),
                        name: $('#names').val(),
                        address1:$('#address1s').val(),
                        address2:$('#address2s').val(),
                        city:$('#citys').val(),
                        state:$('#states').val(),
                        zip:$('#zips').val(),
                        contact_name:$('#contact_names').val(),
                        contact_number1:$('#contact_number1s').val(),
                        contact_number2:$('#contact_number2s').val(),
                        contact_fax:$('#contact_faxs').val(),
                        contact_email1:$('#contact_email1s').val(),
                        contact_email2:$('#contact_email2s').val(),
                        contact_email3:$('#contact_email3s').val(),
                        url:$('#url').val()
                    },
                    success: function(datasub) {

                        var n = noty({type: 'success', text: 'Subdivision ' + $('#names').val() + ' was updated',  timeout: 2000});

                        $('.subdivdetails').hide();
                        $('.subdiv').show();
                        $('#addsubdivlabel').text('Add new subdivision');

                       // return  $("#innersubdivisionSelect").find("option[value='']").attr("selected", "selected").end().change();
                       // $('.classname').find('option:first').attr('selected','selected');
                         $("#newSubdivision").val('');
                        return  $("#innersubdivisionSelect")[0].selectedIndex = 0;

                    },
                    error: function(err) {
                        return alert("There was an error updating the subdivision! Please refresh the page and try again.");
                    }
                });
        });



    $(".buttonaddsubdivision").click(
        function()
        {
            jsRoutes.controllers.Customers_rd.addSubdivision().ajax(
                {
                    data: {

                        customer:$("#name").val(),
                        name: $("#newSubdivision").val()
                    },
                    success: function(datasub) {
                        $("#innersubdivisionSelect").append($('<option/>', {value:  datasub.id , text: datasub.name}));

                        $("#dataDivs").val(datasub.id);
                         $("#names").val(datasub.name);

                        $("#addsubdivlabel").val(datasub.name);


                        populatesubdivisionfields(datasub.id);
                        $(".subdivdetails").show();

                        return  $("#innersubdivisionSelect").find("option[value='" + datasub.id + "']").attr("selected", "selected").end().change();

                        // return $(".subdivselected").text('with selected subdivision: ' + datasub["name"]);
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


});
