
$(document).ready(function() {



    $("#jobs").DataTable({
        "sDom": '<"H"lT>rt<"F"ip>',

        "oTableTools": {
            "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }
    });


    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }



    $( "#excel").click(function(){
        // zemi parametri od url i prosledi gi nakaj...  /report/front/job/excel

        window.location.href = jsRoutes.controllers.Reports_rd.excelExport().url  + location.search
            /*window.location.href = jsRoutes.controllers.Reports_rd.excelExport().url  +  "?market=" + $("#marketSelect").val() +
            "&jobCategory=" + $("#reportJobCategory").val() + "&startDate=" + $("#startdatepicker").val()
            + "&endDate=" + $("#enddatepicker").val()*/
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


    $( ".btn").click(function(){
       /* window.open(jsRoutes.controllers.Reports_rd.getProfitReport().url + "?market=" + $("#marketSelect").val() +
            "&startDate=" + $("#startdatepicker").val() + "&endDate="
            + $("#enddatepicker").val())*/

        var foo = "";
        $('#marketSelect :selected').each(function(i, selected){
            foo += $(selected).val() + "-";
        });
        var foo1 = "";
        $('#reportJobCategory :selected').each(function(i, selected){
            foo1 += $(selected).val() + "-";
        });

        window.location.href = jsRoutes.controllers.Reports_rd.getJobsReportRedesigned().url + "?market=" + foo +
            "&jobCategory=" + foo1 + "&startDate=" + $("#startdatepicker").val()
            + "&endDate=" + $("#enddatepicker").val()
    });


});