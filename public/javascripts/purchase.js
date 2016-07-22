
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

    $( ".btn").click(function(){
        var market = $("#marketSelect").val();
        var itemCategory = $("#itemcatSelect").val();
        var vendoriid = $("#vendorSelect").val();
        var managerid = $("#managerSelect").val();
        var customersid = $("#customerSelect").val();
        var vendorview = $("input:radio[name='choices']:checked").val();


        var itemCategory = "";
        $('#itemcatSelect :selected').each(function(i, selected){
            itemCategory += $(selected).val() + "-";
        });

        if (itemCategory =="" || itemCategory == "-")
        {
            itemCategory = "";
            $('#itemcatSelect option').each(function(){
                if ($(this).val() != "")
                 itemCategory += $(this).val() + "-";
            });
        }
/*

         window.location.href = jsRoutes.controllers.Reports_rd.getPurchaseReportRedesigned().url + "?market=" + market
            + "&itemCategory=" + itemCategory + "&customer=" + customersid + "&manager=" + managerid  + "&vendor=" + vendoriid
            + "&startDate=" + $("#startdatepicker").val() + "&endDate=" + $("#enddatepicker").val()


 */

if (vendorview != 3)
        {
            window.location.href = jsRoutes.controllers.Reports_rd.getPurchaseReportRedesigned().url + "?market=" + market
                + "&itemCategory=" + itemCategory + "&customer=" + customersid + "&manager=" + managerid  + "&vendor=" + vendoriid
                + "&startDate=" + $("#startdatepicker").val() + "&endDate=" + $("#enddatepicker").val() + "&vendorview=" + vendorview
        }
        else
        {
        window.location.href = jsRoutes.controllers.Reports_rd.getPurchaseReportActivityRedesigned().url + "?market=" + market
                    + "&itemCategory=" + itemCategory + "&customer=" + customersid + "&manager=" + managerid  + "&vendor=" + vendoriid
                    + "&startDate=" + $("#startdatepicker").val() + "&endDate=" + $("#enddatepicker").val() + "&vendorview=2"
        }

/*

        window.location.href = jsRoutes.controllers.Reports_rd.getPurchaseReportActivityRedesigned().url + "?market=" + market
            + "&itemCategory=" + itemCategory + "&customer=" + customersid + "&manager=" + managerid  + "&vendor=" + vendoriid
            + "&startDate=" + $("#startdatepicker").val() + "&endDate=" + $("#enddatepicker").val() + "&vendorview=" + vendorview
            */
    });




    $(function() {
        $( "#accordion" ).accordion({
            /*   heightStyle: "content",*/
            collapsible: true,
            autoHeight: false
        });
    });

    $("#accordion").accordion({ active: 0});
});

function ExportAllTablesToExcel(){

    var html;
    var table_html = '<table><tr>';
    //go through all tables
    $('table.eachvendor').each(function(){
        //add their HTML to our big HTML string
        table_html += '<tr><table>' + $(this).html() + '</table></tr>';
        //remove that table from the page
        //  html+=$(this.outerHTML);
    });

    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(table_html));
}

