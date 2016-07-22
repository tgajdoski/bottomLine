
$(document).ready(function() {

    $( "#reportot").hide();

    var d = new Date();


    function ajaxindicatorstart(text)
    {
        if(jQuery('body').find('#resultLoading').attr('id') != 'resultLoading'){
            jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="/assets/images/ajax-loader.gif"><div>'+text+'</div></div><div class="bg"></div></div>');
        }

        jQuery('#resultLoading').css({
            'width':'100%',
            'height':'100%',
            'position':'fixed',
            'z-index':'10000000',
            'top':'0',
            'left':'0',
            'right':'0',
            'bottom':'0',
            'margin':'auto'
        });

        jQuery('#resultLoading .bg').css({
            'background':'#000000',
            'opacity':'0.7',
            'width':'100%',
            'height':'100%',
            'position':'absolute',
            'top':'0'
        });

        jQuery('#resultLoading>div:first').css({
            'width': '250px',
            'height':'75px',
            'text-align': 'center',
            'position': 'fixed',
            'top':'0',
            'left':'0',
            'right':'0',
            'bottom':'0',
            'margin':'auto',
            'font-size':'16px',
            'z-index':'10',
            'color':'#ffffff'

        });

        jQuery('#resultLoading .bg').height('100%');
        jQuery('#resultLoading').fadeIn(300);
        jQuery('body').css('cursor', 'wait');
    }

    function ajaxindicatorstop()
    {
        jQuery('#resultLoading .bg').height('100%');
        jQuery('#resultLoading').fadeOut(300);
        jQuery('body').css('cursor', 'default');
    }



    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    $("#reporttable tbody").on("click", "tr td .clicka", function(){
      //  window.location.href = "/jobs/" + $(this).text();
        window.open("/jobs/" + $(this).text());
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




    $( "#excel").click(function(){
        window.location.href = jsRoutes.controllers.Reports_rd.excelExport().url  + location.search
    });



    function normilize(data){
        var result = [];
        for(var row in data){
            result.push(data[row]);
        }
        return result;
    }



    jQuery(document).ajaxStart(function () {
        //show ajax indicator
        ajaxindicatorstart('loading report data... please wait..');
    }).ajaxStop(function () {
        ajaxindicatorstop();
    });

    $( ".btn").click(function(){
        $( "#reportot").show();

        var market = $("#marketSelect").val();
        var itemCategory = $("#itemcatSelect").val();
        var vendoriid = $("#vendorSelect").val();
        var managerid = $("#managerSelect").val();
        var customersid = $("#customerSelect").val();

        jQuery.ajax({
            type: "GET",
            url: "/report/front/new4frontdata",
            cache: false,

                    data: {
                        market: market,
                        itemCategory: itemCategory,
                        startDate: $("#startdatepicker").val(),
                        endDate: $("#enddatepicker").val(),
                        customer: customersid,
                        manager: managerid,
                        vendor: vendoriid
                    },
                    success: function(datata) {

                        $('#reporttable').DataTable().destroy()

                        $('#reporttable').DataTable( {
                            "sDom": '<"H"lT>rt<"F"ip>',
                            "oTableTools": {
                                "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
                                "aButtons" : ["xls", "copy", "csv", "pdf"]
                            },
                            "aaData": datata['data'],// <-- your array of objects
                            "aoColumns": [
                                { "mData": "0" }, // <-- which values to use inside object
                                { "mData": "1" }, // <-- which values to use inside object
                                { "mData": "2" }, // <-- which values to use inside object
                                { "mData": "3" }, // <-- which values to use inside object
                                { "mData": "4" },
                                { "mData": "5" },
                                { "mData": "6" },
                                { "mData": "7" },
                                { "mData": "8" },
                                { "mData": "9" }
                            ]
                        } );
                    },
            error: function(err) {
                return alert(err);
            }
        });
        $( "#reportot").show();

    });



    $("#marketSelect").change(
        function()
        {
              // ako se smenal market popolni customers
                   populatecustomers($("#marketSelect option:selected" ).val());
                // ako se smenal market popolni vendori za toj market
                populatevendors($("#marketSelect option:selected" ).val(), $("#itemcatSelect option:selected" ).val());
        });


    $("#itemcatSelect").change(
        function()
        {
                // ako se smenal market popolni vendori za toj market
                populatevendors($("#marketSelect option:selected" ).val(), $("#itemcatSelect option:selected" ).val());
        });

});


function populatevendors(marketid, itemtype)
{
    $.ajax({

        type: "GET",
        url: '/jobs/vendors/getvendorsmarketcat?marketid='+marketid+"&itemType="+itemtype,
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


function populatecustomers(marketidto){
    jsRoutes.controllers.Customers_rd.getCustomerpermarketS(marketidto).ajax(
        {
            data: {
                id:marketidto
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
                $('#customerSelect').empty().append(html);
                //  $('#customers').dataTable().fnUpdate(html , $("tr[data-user-id='" + $(this).closest('tr').attr("data-user-id") + "']")[0], 3 );
            },
            error: function(err) {
                return alert("There was an error reading customers information! Please refresh the page.");
            }
        }
    );
}


function goToByScroll(id){
    // Remove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    $('html,body').animate({
            scrollTop: $("#"+id).offset().top},
        'slow');
}