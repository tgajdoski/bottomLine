$(document).ready(function() {

    $("#vendors").DataTable({
        "sDom": '<"H"lT>frt<"F"ip>',

        "oTableTools": {
            "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }
    });

    $('#vendormodal').hide();
    $("#accordion").hide();

    $(".custdivselectedview").hide();
    $(".subdivselectedview").hide();
  $(".subdiv").hide();
    $(".newcust").hide();


    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }




    $(function() {

        $( "#insurancedatepicker" ).datepicker();
        $( "#insurancedatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#insurancedatepicker").val($.datepicker.formatDate('yy-mm-dd', getMonday(new Date())));

    });




    $("#defaultrateandunits").hide();

    $( "#qbexport").click(function(){

        window.location.href = jsRoutes.controllers.Vendors_rd.vendorQBexcelExport().url  + location.search
    });

    $("#vendors tbody").on("click", "tr td .actinact", function(){
            var returnVal = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var vendoridno = $(this).val();
            jsRoutes.controllers.Vendors_rd.updateActive().ajax(
                {
                    data: {
                        vendorid: vendoridno,
                        active: returnVal
                    },
                    success: function(data) {
                        if (returnVal)
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is active.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is inactive.',  timeout: 3000});
                    },
                    error: function(err) {
                        return alert("There was an error changing the vendor! Please refresh the page and try again.");
                    }
                });
        }
    );

    $("#vendors tbody").on("click", "tr td .employeeinact", function(){
            var returnVal = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(3)").text();

            if (returnVal){
                $(this).closest('tr').find("td:nth-child(7)").find('input:checkbox:first').prop('checked', false);
                $(this).closest('tr').find("td:nth-child(8)").find('input:checkbox:first').prop('checked', false);
            }

            var vendoridno = $(this).val();
            jsRoutes.controllers.Vendors_rd.updateEmployee().ajax(
                {
                    data: {
                        vendorid: vendoridno,
                        employee: returnVal
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Vendors ' + a + ' type is changed.',  timeout: 3000});
                       /* if (returnVal)
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is employee.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is not employee.',  timeout: 3000});*/
                    },
                    error: function(err) {
                        return alert("There was an error changing the vendor! Please refresh the page and try again.");
                    }
                });
        }
    );


    $("#vendors tbody").on("click", "tr td .type1099inact", function(){
            var returnVal = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(3)").text();
            if (returnVal){
                $(this).closest('tr').find("td:nth-child(6)").find('input:checkbox:first').prop('checked', false);
                $(this).closest('tr').find("td:nth-child(8)").find('input:checkbox:first').prop('checked', false);
            }

            var vendoridno = $(this).val();
            jsRoutes.controllers.Vendors_rd.update1099().ajax(
                {
                    data: {
                        vendorid: vendoridno,
                        type_1099: returnVal
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Vendors ' + a + ' type is changed.',  timeout: 3000});
                       /* if (returnVal)
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is employee.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is not employee.',  timeout: 3000});*/
                    },
                    error: function(err) {
                        return alert("There was an error changing the vendor! Please refresh the page and try again.");
                    }
                });
        }
    );

    $("#vendors tbody").on("click", "tr td .invoiceinact", function(){
            var returnVal = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(3)").text();

            if (returnVal){
                $(this).closest('tr').find("td:nth-child(6)").find('input:checkbox:first').prop('checked', false);
                $(this).closest('tr').find("td:nth-child(7)").find('input:checkbox:first').prop('checked', false);
            }
            var vendoridno = $(this).val();
            jsRoutes.controllers.Vendors_rd.updateInvoice().ajax(
                {
                    data: {
                        vendorid: vendoridno,
                        invoice: returnVal
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Vendors ' + a + ' type is changed.',  timeout: 3000});
                       /* if (returnVal)
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is employee.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Vendor ' + a + ' is not employee.',  timeout: 3000});*/
                    },
                    error: function(err) {
                        return alert("There was an error changing the vendor! Please refresh the page and try again.");
                    }
                });
        }
    );



    $(function() {
        $( "#accordion" ).accordion({
            heightStyle: "content",
            collapsible: true
        });
    });

    $("#vendors tbody").on("change", "tr td #subdivisionSelect", function(){
        var a = $(this).closest('tr').find("td:nth-child(3)").text();
        var b = $(this).closest('tr').attr("data-user-id");//$(this).find("option:selected").val();
        $('#addorupdate').val(1);
        openwhatneeded();

        $('#vendivselectedtext').text("Vendor " + $(this).closest('tr').find("td:nth-child(2)").text());
        $("#accordion").accordion({ active: 1});

        $('input[name="id"]').val($(this).closest('tr').attr("data-user-id"));

        populatefields($(this).closest('tr').attr("data-user-id"));
        populateitemtablefields($(this).closest('tr').attr("data-user-id"));
    });



    function populatedatatableitems(idto){
        jsRoutes.controllers.Vendors_rd.getVendorItems(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    var html = '';
                    var len = datasub.length;
                    html+='<select class="userAuthority" id="subdivisionSelect">';
                    html+='<option value=""></option>';
                    for (var i = 0; i< len; i++) {

                        if (datasub[i].item != null)
                        {
                            html +=  '<option value="' + datasub[i].id + '">' +  datasub[i].item.name + '</option>';
                        }

                    }
                    html+='</select>';
                    $('#vendors').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
                },
                error: function(err) {
                    return alert("There was an error updating the datatable information! Please refresh the page.");
                }
            }
        );
    }


    function populateitemtablefields(idto){
        jsRoutes.controllers.Vendors_rd.getVendorItems(idto).ajax(
            {
                data: {
                    id:$(this).closest('tr').attr("data-user-id")
                },
                success: function(datasub) {
                    $("#vendoritems").find("tr").remove();
                    var html = '';
                    var len = datasub.length;
                    for (var i = 0; i< len; i++) {
                        if (datasub[i].item != null)
                        {
                            html += '<tr data-user-id="' + datasub[i].id + '">';
                            html += '<td><a class="deleteUser"><i class="fa fa-trash-o"></i></a></td>';
                            html += '<td style="margin:0;padding-left:14px;"><a class="vendoritemdefaultslink">' +  datasub[i].item.name + '</a></td>';
                            html += '</tr>';
                        }

                    }
                    $('#vendoritems').append(html);

                    $('#addorupdate').val(1);

                    openwhatneeded();
                },
                error: function(err) {
                    return alert("There was an error reading the vendor information! Please refresh the page and try again.");
                }
            }
        );
    }

    $("#vendors tbody").on("click", "tr td .clicka", function(){

        // znaci sakame update
        $('#addorupdate').val(1);
        openwhatneeded();
        $("#accordion").accordion({ active: 0});

        $('#vendivselectedtext').text("Vendor " + $(this).closest('tr').find("td:nth-child(2)").text());

        $("#dataDiv").val($(this).closest('tr').attr("data-user-id"));

        populatefields($(this).closest('tr').attr("data-user-id"));
        populateitemtablefields($(this).closest('tr').attr("data-user-id"));

    });

    function populatefields(idto){

        jsRoutes.controllers.Vendors_rd.getVendorbyID(idto).ajax(
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
                    $( '#accounttypeSelect' ).val( datasub['expense_account'] );

                 //   var insurancedate = datasub['insurance_date']
                    var insuranced = new Date(datasub['insurance_date']);


                    insuranced.setTime(insuranced.getTime() + (11*60*60*1000));

//                    console.log(insuranced.toISOString());
                   // $( '#insurancedatepicker' ).val( datasub['insurance_date'] );
  //                console.log(insuranced);
                    $( '#insurancedatepicker' ).datepicker('setDate', insuranced);
                //    $( "#insurancedatepicker").val($.datepicker.formatDate('yy-mm-dd', datasub['insurance_date']));

                    console.log(datasub['employee']);
                    if (datasub['employee']==1) {

                        $("#employee").prop("checked", true);
                    }
                        else
                    {
                        $("#employee").prop("checked", false);
                    }
                    if (datasub['type_1099']==1) {

                        $("#type_1099").prop("checked", true);
                    }
                    else
                    {
                        $("#type_1099").prop("checked", false);
                    }
                    if (datasub['invoice']==1) {

                        $("#invoice").prop("checked", true);
                    }
                    else
                    {
                        $("#invoice").prop("checked", false);
                    }

                    $('#updatevendormodal').show();
                },
                error: function(err) {
                    return alert("There was an error reading the vendor information! Please refresh the page and try again.");
                }
            }
        );


    }





        $("#vendoritems").on("click", "tbody tr td .vendoritemdefaultslink", function(){

        var d = $(this).closest('tr').attr("data-user-id");
        var a = $(this).closest('tr').find("td:nth-child(2)").text();


       $('input[name="vendoritemid"]').val($(this).closest('tr').attr("data-user-id"));

        var context;
        context = this;
       // treba da go pokaze toa i da go popolni

        jsRoutes.controllers.Vendors_rd.getVendorItem($(this).closest('tr').attr("data-user-id")).ajax(
            {
                data: {
                    id:$(this).closest('tr').attr("data-user-id")//idto
                },
                success: function(datasub) {
                    /*  var c = jQuery.parseJSON( datasub );*/
                    $( '#default_rate' ).val( datasub['default_rate'] );
                    $( '#default_units' ).val( datasub['default_units'] );
                    $("#defaultrateandunits").show();

                    $('#selectedvendoritemnamediv').text(a);
                },
                error: function(err) {
                    return alert("There was an error reading the vendor item information! Please refresh the page and try again.");
                }
            }
        );
   });


    $("#vendors tbody").on("click", "tr td .deleteVendor", function(){
        var d = $(this).closest('tr');
        var a = $(this).closest('tr').find("td:nth-child(2)").text();

        var context;
        context = this;
        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Vendors_rd.deleteVendor().ajax({
                data: {
                    id: $(this).closest('tr').attr("data-user-id")
                },
                success: function(data) {
                    var n = noty({type: 'success', text: 'Vendor ' + a + ' was deleted',  timeout: 3000});
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the vendor! Please refresh the page and try again.");
                }
            });
        }
    });

    $("#vendoritems").on("click", "tbody tr td .deleteUser", function(){

        var d = $(this).closest('tr');
        var a = $(this).closest('tr').find("td:nth-child(2)").text();
        $("#defaultrateandunits").hide();
        var context;
        context = this;
        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Vendors_rd.deleteVendorItem().ajax({
                data: {
                    id: $(this).closest('tr').attr("data-user-id")
                },
                success: function(data) {
                    var n = noty({type: 'success', text: 'Vendor item ' + a + ' was removed',  timeout: 3000});

                    populatedatatableitems($('#dataDiv').val());
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the vendor! Please refresh the page and try again.");
                }
            });
        }
    });

    $("#addVendorbutton").click(function(){


        jsRoutes.controllers.Vendors_rd.updateVendor().ajax(
            {
                data: {

                    id: $('#dataDiv').val(),
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
                    contact_email3:$('#contact_email3').val(),
                    insurance_date: $("#insurancedatepicker").val()
                },
                success: function(datasub) {

                    var n = noty({type: 'success', text: 'Vendor ' + $('#name').val() + ' was updated',  timeout: 2000});

                    $('.step2').hide();
                    $('.subdiv').show();


                },
                error: function(err) {
                    return alert("There was an error updating the vendor! Please refresh the page and try again.");
                }
            });
    });



    $("#updatevendormarket").click(function(){

        if (confirm("Are you sure you want to change vendor market?")) {
            jsRoutes.controllers.Vendors_rd.updateVendorMarket().ajax(
                {
                    data: {
                        id: $("#dataDiv").val(),
                        market: $("#editVendorMarket").find("option:selected").val()
                    },
                    success: function(datasub) {
                        var n = noty({type: 'success', text: 'Vendor market was updated.',  timeout: 2000});
                        $('#vendormodal').hide();
                    },
                    error: function(err) {
                        return alert("There was an error changing vendor market! Please refresh the page and try again.");
                    }
                }
            );
        }

    });




    $("#updatevendorinformation").click(function(){

        var employee = $("#employee").is(':checked') ? 1 : 0;
        var type_1099 = $("#type_1099").is(':checked') ? 1 : 0;
        var invoice = $("#invoice").is(':checked') ? 1 : 0;


        jsRoutes.controllers.Vendors_rd.updateVendor().ajax(
            {
                data: {

                    id: $('#dataDiv').val(),
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
                    contact_email3:$('#contact_email3').val(),
                    insurance_date: $("#insurancedatepicker").val(),
                    expense_account:   $("#accounttypeSelect").val(),
                    employee:   employee,
                    type_1099: type_1099,
                    invoice: invoice
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'Vendor ' + $('#name').val() + ' was updated',  timeout: 2000});
                    $('#updatevendorinformationdiv').hide();
                    $('#updatevendoritemsdiv').show();

                    $('#vendors').dataTable().fnUpdate('<a class="clicka" href="#">'+$('#name').val()+'</a>' , $("tr[data-user-id='" + $('#dataDiv').val() + "']")[0], 2 );

                },
                error: function(err) {
                    return alert("There was an error updating the vendor! Please refresh the page and try again.");
                }
            }
        );

    });





    $("#updatevendoritemdefaults").click(function(){
        jsRoutes.controllers.Vendors_rd.updateVendorItem().ajax(
            {
                data: {
                    item: $('input[name="vendoritemid"]').val(), // $(this).closest('tr').attr("data-user-id").val(), // $("#itemdivisionSelect").find("option:selected").val(),
                    vendor: $('input[name="id"]').val(),
                    default_rate: $("#default_rate").val(),
                    default_units: $("#default_units").val()
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'Vendor item was updated',  timeout: 2000});
                    populatedatatableitems($('#dataDiv').val());
                    $("#defaultrateandunits").hide();
                },


                error: function(err) {
                    return alert("There was an error adding the vendor item! Please refresh the page and try again.");
                }
            }
        );

    });



    $("#updatevendoritem").click(function(){
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
                                '<td style="margin:0;padding-left:14px;"><a class="vendoritemdefaultslink">'+datasub.item.name+'</td>' +
                                '</a></tr>'));

                            $('input[name="vendoritemid"]').val($("#itemdivisionSelect").find("option:selected").val());
                            $("#default_rate").val("");
                            $("#default_units").val("");


                            $('#selectedvendoritemnamediv').text($("#itemdivisionSelect").find("option:selected").text());
                            $("#vendoritemid").val(datasub.id);
                        populatedatatableitems($('#dataDiv').val())
                        $("#defaultrateandunits").show();

                        },


                    error: function(err) {
                        return alert("There was an error adding the vendor item! Please refresh the page and try again.");
                    }
                }
            );

        });

    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#vendivselectedtext').text("Add new vendor");

        openwhatneeded();
    });

    function openwhatneeded(){
        $('#vendormodal').show();
        if($('#addorupdate').val()==0)
        {
            $('#addnewvendorfrontdiv').show();
            $('#accordion').hide();
        }
        else
        {
            // update vendor
        //    alert($('#addorupdate').val());
            $('#addnewvendorfrontdiv').hide();
            $('#accordion').show();
        }
   }


    $(".close").click(function() {
        $('#vendormodal').hide();
    });

    $("#close").click(function() {
        $('#vendormodal').hide();
    });


// ZA ADD NEW VENDOR

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
                        $("#addnewvendorfrontdiv").hide();
                        populatefields(data["id"]);
                        $("#updatevendorinformationdiv").show();
                        $('#vendivselectedtext').text("Vendor " + data["name"]);
                        $('input[name="id"]').val(data["id"]);
                        $('input[name="name"]').val(data["name"]);
                        populateitemtablefields(data["id"]);

                    },
                    error: function(err) {
                        return alert("There was an error adding the customer! Please refresh the page and try again.");
                    }
                }
            );
        }
    );

    $(".buttonaddnewvendoritem").click(
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


});
