


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



    $(function() {
        var d =   $( "#duedatepicker" ).val();
        $( "#duedatepicker" ).datepicker();
        $( "#duedatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#duedatepicker" ).val(d);
    });


    $(function() {
        var d =   $( "#incurreddatepicker" ).val();
        $( "#incurreddatepicker" ).datepicker();
        $( "#incurreddatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#incurreddatepicker" ).val(d);
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

/*

    $("#vendorSelect").change(
        function()
        {
          */
/*  getselection();*//*


        });
*/



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
        jsRoutes.controllers.Bills.Updatebill().ajax(
            {
                data: {
                    expid: idd,
                    datebill:   $("#startdatepicker").val(),
                    incurreddate:   $("#incurreddatepicker").val(),
                    marketid: $("#marketSelect").val(),
                    vendorid: $("#vendorSelect").val(),
                    jobid: $("#jobnumber").val(),
                    billnumber: $("#billnumber").val(),
                    amount: $("#amount").val(),

                    duedate:   $("#duedatepicker").val(),
                   // termsfullname: $("#termsfullname").val($("#termsfullname option:first").val()),
                    termsfullname: $( "#termsfullname option:selected" ).text(),
                    accountfullname:   $("#accountfullname").val(),
                    accountType:   $("#accounttypeSelect").val(),
                    note: $("#note").val()
                },
                success: function(datasub) {
                    var n = noty({type: 'success', text: 'bill was changed. ',  timeout: 1000});
                    $("#amount").val("");
                    $("#note").val("");

                    alert("bill was changed");
                    window.setTimeout(window.close(), 3000);
                },
                error: function(err) {
                    return alert("There was an error saving bill information! Please refresh the page.");
                }
            }
        );


        // gore snimame a dolu pokazuvame vo datatable sto se stavilo po istite selektirani market vendor datum
        getselection();



    });



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
                        { "mData": "0" }, // <-- which values to use inside object
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


});


