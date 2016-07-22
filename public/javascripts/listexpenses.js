
$(document).ready(function() {

    $( "#reportot").hide();


    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


       $("#reporttable tbody").on("click", "tr td .clicka", function(){
        window.open("/quickbooks/expenses/" + $(this).text());
    });




    $(function() {

        $( "#startdatepicker" ).datepicker();
        $( "#startdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#startdatepicker").val($.datepicker.formatDate('yy-mm-dd', getMonday(new Date())));
    });
    $(function() {
        $( "#enddatepicker" ).datepicker();
        $( "#enddatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#enddatepicker" ).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });






    $(".btn").click(function(){
        getselection();
    });



function getselection(){


    var vendorid = $("#vendorSelect").val();
    var marketid = $("#marketSelect").val();
    var accountTypeid = $("#accounttypeSelect").val();
    var startdate = $("#startdatepicker").val();
    var enddate = $("#enddatepicker").val();


    jQuery.ajax({
        type: "GET",
        url: "/expenses/getlistexpenses",
        cache: false,
        data: {
            vendorid: vendorid,
            marketid: marketid,
            accountTypeid: accountTypeid,
            startdate: startdate,
            enddate: enddate,
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
                    { "mData": "8" }
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


