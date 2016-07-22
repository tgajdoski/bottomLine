
$(document).ready(function() {

    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


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
         window.location.href = jsRoutes.controllers.Reports_rd.getItemsReport().url + "?market=" + $("#marketSelect").val()
            + "&user=" + $("#managerSelect").val() + "&itemType=" + $("#reportSelect").val()
            + "&startDate=" + $("#startdatepicker").val() + "&endDate=" + $("#enddatepicker").val()
    });



});