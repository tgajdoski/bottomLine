


$(document).ready(function() {

    $( "#reportot").hide();



    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


    $(function() {
        var d = $( "#startdatepicker" ).val();
       $( "#startdatepicker" ).datepicker();
       $( "#startdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
//        $( "#startdatepicker").val($.datepicker.formatDate('yy-mm-dd', getMonday(new Date())));
       $( "#startdatepicker" ).val(d);
    });
    $(function() {
      var d =   $( "#qbdatepicker" ).val();
        $( "#qbdatepicker" ).datepicker();
        $( "#qbdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#qbdatepicker" ).val(d);
    });


    $( "#exall").click(function(){
        ExportAllTablesToExcel();
    });

    $('#open').click(function () {
        if ($(this).text() == "expand all")
        {
            $(this).text("colapse all")
            $('.ui-accordion-header').removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({'aria-selected':'true','tabindex':'0'});
            $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
            $('.ui-accordion-content').addClass('ui-accordion-content-active').attr({'aria-expanded':'true','aria-hidden':'false'}).show();
        }
        else
        {
            $(this).text("expand all")
            $('.ui-accordion-header').removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({'aria-selected':'false','tabindex':'-1'});
            $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
            $('.ui-accordion-content').removeClass('ui-accordion-content-active').attr({'aria-expanded':'false','aria-hidden':'true'}).hide();
        }
    });


    $("#vendorSelect").change(
        function()
        {
            getselection();
            getvendorinfo();
        });



    $("#amount").blur(function(){
        if($.isNumeric(this.value)){
        //    alert("number " + this.value);
        } else{
            // not a number
            alert("please insert number in the amount field");
            $("#amount").val("");
        }
    });

    $(".btn").click(function(){

        var idto = document.location.pathname.split("/")
          var len = idto.length;
          var idd = idto[len-1];
        jsRoutes.controllers.Expenses.UpdateExpence().ajax(
            {
                data: {
                    expid: idd,
                    accountTypeid: $("#accounttypeSelect").val(),
                    datebill:   $("#startdatepicker").val(),
                    qbdatebill:   $("#qbdatepicker").val(),
                    marketid: $("#marketSelect").val(),
                    vendorid: $("#vendorSelect").val(),
                    billnumber: $("#billnumber").val(),
                    amount: $("#amount").val(),
                    note: $("#note").val()
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'expense was added. ',  timeout: 1000});

                //    $("#accounttypeSelect").val($("#accounttypeSelect option:first").val());

                //    $("#marketSelect").val($("#marketSelect option:first").val());
               //     $("#vendorSelect").val($("#vendorSelect option:first").val());

                    $("#amount").val("");
                    $("#note").val("");
                },
                error: function(err) {
                    return alert("There was an error saving expence information! Please refresh the page.");
                }
            }
        );


        // gore snimame a dolu pokazuvame vo datatable sto se stavilo po istite selektirani market vendor datum
        getselection();



    });



    function getvendorinfo(){
        var vendorid = $("#vendorSelect").val();
        jsRoutes.controllers.Vendors_rd.getVendorbyID(vendorid).ajax(
            {
                data: {
                    id:vendorid
                },
                success: function(datasub) {
                    $("#vendorinfo").val(datasub['address1']  + " " +datasub['address2'] + " " +  datasub['city'] + " "
                        +  datasub['state'] + " " + datasub['zip'] )
                },
                error: function(err) {
                    return alert("There was an error reading the vendor information! Please refresh the page and try again.");
                }
            }
        );
    };

function getselection(){


    var vendorid = $("#vendorSelect").val();
    var marketid = $("#marketSelect").val();
    var accountTypeid = $("#accounttypeSelect").val();
    var datebill = $("#startdatepicker").val();


    jQuery.ajax({
        type: "GET",
        url: "/expenses/getdata",
        cache: false,
        data: {
            vendorid: vendorid,
            marketid: marketid,
            accountTypeid: accountTypeid,
            datebill: datebill
        },
        success: function(datata) {

            $('#reporttable').DataTable().destroy()

            $('#reporttable').DataTable( {
                "sDom": '<"H"lT>rt<"F"ip>',
                "oTableTools": {
                    "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
                    "aButtons" : ["xls", "copy", "csv", "pdf"]
                },
                "aaSorting": [[1,'desc']],
                "aaData": datata['data'],// <-- your array of objects
                "aoColumns": [
                    { "mData": "0" }, // <-- which values to use inside object
                    { "mData": "1"  }, // <-- which values to use inside object , "sWidth": "15%"
                    { "mData": "2" }, // <-- which values to use inside object
                    { "mData": "3" }, // <-- which values to use inside object
                    { "mData": "4" },
                    { "mData": "5" },
                    { "mData": "6" }
                ]
            } );
        },
        error: function(err) {
            return alert(err);
        }
    });
    $( "#reportot").show();

};
    /*
    $("#vendorSelect").change(
        function()
        {
            if ($("#vendorSelect")[0].selectedIndex > 0)
            {
                populatevendorinfo($("#vendorSelect option:selected" ).val());
            }
        });


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

                    $('#subdivisionSelect').empty().append(html);

                    //  $('#customers').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
                },
                error: function(err) {
                    return alert("There was an error reading subdivisions for selected customer! Please refresh the page.");
                }
            }
        );
    }*/


});


