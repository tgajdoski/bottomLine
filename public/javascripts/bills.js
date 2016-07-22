
$(document).ready(function() {

    $( "#reportot").hide();




    $(function() {
        $( "#accordion" ).accordion({
            heightStyle: "content",
            collapsible: true
        });
    });


    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


    getselection($("#startdatepicker").val());



    $(function() {

        $( "#startdatepicker" ).datepicker();
        $( "#startdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#startdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
       // $( "#startdatepicker").val($.datepicker.formatDate('yy-mm-dd', getMonday(new Date())));

        $("#startdatepicker").datepicker({
            onSelect: function() {
                // getselection(this.value);
            }
        }).on("change", function() {
            $("#billnumber").val("");
            $("#amount").val("");
            $("#note").val("");
            getselection(this.value);
        });


        $( "#duedatepicker" ).datepicker();
        $( "#duedatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#duedatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));


        $("#duedatepicker").datepicker({
            onSelect: function() {

            }
        }).on("change", function() {
            // menuva tip neznam zossto
         //   $("#accounttypeSelect").val(1);

        });



        $( "#incurreddatepicker" ).datepicker();
        $( "#incurreddatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#incurreddatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));


    });



    $("#termsfullname").change(
        function()
        {
            var foo = "";
            $('#termsfullname :selected').each(function(i, selected){
                foo = $(selected).text();
                    if (foo.indexOf("10") != -1)
                        setduedate(10);
                if (foo.indexOf("15") != -1)
                    setduedate(15);
                if (foo.indexOf("30") != -1)
                    setduedate(30);
                if (foo.indexOf("45") != -1)
                    setduedate(45);
                if (foo.indexOf("60") != -1)
                    setduedate(60);
                if (foo.indexOf("Receipt")!= -1)
                    setduedate(0);
            });
        });


function setduedate(days){
 //   var date2 = $('#startdatepicker').datepicker('getDate', '+'+days+'d');
  //  date2.setDate(date2.getDate()+1);
   // $('#duedatepicker').datepicker('setDate', date2);
    var date2 = $('#startdatepicker').datepicker('getDate');
    var dueDate = new Date();
    dueDate.setDate(date2.getDate() + days);

    $( "#duedatepicker").val($.datepicker.formatDate('yy-mm-dd',dueDate));
}




    $("#vendorSelect").change(
        function()
        {
            var foo = "";
            $('#vendorSelect :selected').each(function(i, selected){
                foo = $(selected).val();
                populateexpenseaccount(foo);
            });
        });

    $("#marketSelect").change(
        function()
        {
            var foo = "";
            $('#marketSelect :selected').each(function(i, selected){
                 foo = $(selected).val();
                    populatevendors(foo,"");
            });
        });




    function populateexpenseaccount(vendorid)
    {
        jsRoutes.controllers.Vendors_rd.getVendorbyID(vendorid).ajax(
            {
                data: {
                    id:   vendorid
                },
                success: function(datasub) {
                        $("#accounttypeSelect").val(datasub.expense_account);
                },
                error: function(err) {
                    //   console.log(err);
                   // return alert("There was an error saving bill information! Please refresh the page.");
                }
            }
        );

    }



    function populatevendors(marketid, itemtype)
    {

        $.ajax({

            type: "GET",
            url: '/jobs/vendors/getvendorsmarketcat?marketid='+marketid+"&itemType="+itemtype+"&insurence=true&invoice=1",
            success: function(datasubctualvedors) {
                // popolni go dropdown poleto za vendor
                //  $('#innersubdivisionSelect')..find('option').remove();
                var html = '';
                var len = datasubctualvedors.length;

                html+='<option value=""></option>';
                for (var i = 0; i< len; i++) {

                    if (datasubctualvedors[i] != null)
                    {
                        html +=  '<option value="' + datasubctualvedors[i].id + '">' +  datasubctualvedors[i].name + '</option>';
                    }
                }
                $('#vendorSelect').empty().append(html);
            },
            error: function (result) {
                alert('Some error occurred while retrieving vendor list. ');
            }
        });

    }


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
       //     getselection();
        //    getvendorinfo();
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




    $("#billnumber").blur(function(){

        var imabillnumber = false;

        jsRoutes.controllers.Bills.checkBillnum().ajax(
            {
                data: {
                    billnumber: $("#billnumber").val()
                },
                success: function(datasub) {
                    if (datasub > 0)
                        imabillnumber = true;


                    if(!imabillnumber){
                        //    alert("number " + this.value);
                    } else{
                        // not a number
                        alert("this bill number already exist in the system");
                        $( "#billnumber" ).focus();
                    }


                },
                error: function(err) {
                    //   console.log(err);
                    return alert("There was an error checking bill number!");
                }
            }
        );



    });



    $(".btn").click(function(){

        var popolneto = false;

           jsRoutes.controllers.Bills.addBill().ajax(
            {
                data: {
                    datebill:   $("#startdatepicker").val(),
                    incurreddate:   $("#incurreddatepicker").val(),
                    marketid: $("#marketSelect").val(),
                    vendorid: $("#vendorSelect").val(),
                    jobid: $("#jobnumber").val(),
                    billnumber: $("#billnumber").val(),
                    amount: $("#amount").val(),

                    duedate:   $("#duedatepicker").val(),
                    termsfullname: $( "#termsfullname option:selected" ).text(),
                    accountfullname:   $("#accountfullname").val(),
                    accountType:   $("#accounttypeSelect").val(),

                    note: $("#note").val()
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'bill was added. ',  timeout: 1000});

                  //  $("#accounttypeSelect").val($("#accounttypeSelect option:first").val());

              //      $("#marketSelect").val($("#marketSelect option:first").val());
               //     $("#vendorSelect").val($("#vendorSelect option:first").val());

                   // $("#termsfullname option:eq(2)").attr('selected', 'selected');
                  //  $("select[name='termsfullname'] option:eq(2)").attr("selected", "selected");

                    $("#billnumber").focus();
                    $("#amount").val("");
                    $("#note").val("");
                //    $("#accountfullname").val("");
                    $("#jobnumber").val("");


                    getselection($("#startdatepicker").val());


                },
                error: function(err) {
                 //   console.log(err);
                    return alert("There was an error saving bill information! Please fill all fields.");
                }
            }
        );


        // gore snimame a dolu pokazuvame vo datatable sto se stavilo po istite selektirani market vendor datum
        getselection();



    });


    $("#reporttable tbody").on("click", "tr td .clicka", function(){
         window.open("/quickbooks/bills/" + $(this).text());
      //  $('#billmodal').show();
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
    var datebill = $("#startdatepicker").val();


    jQuery.ajax({
        type: "GET",
        url: "/bills/getdata",
        cache: false,
        data: {
            vendorid: vendorid,
            marketid: marketid,
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
                    { "mData": "0" ,  "visible": false }, // <-- which values to use inside object
                    { "mData": "1"  }, // <-- which values to use inside object , "sWidth": "15%"
                    { "mData": "2" }, // <-- which values to use inside object
                    { "mData": "3" }, // <-- which values to use inside object
                    { "mData": "4" },
                    { "mData": "5" },
                    { "mData": "6" },
                    { "mData": "7" },
                    { "mData": "8" },
                    { "mData": "9" },
                    { "mData": "10" },
                    { "mData": "11" },
                    { "mData": "12" },
                    { "mData": "13" }
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


