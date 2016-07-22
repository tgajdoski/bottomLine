$(document).ready(function() {


$( "#reportot").hide();


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



    jQuery(document).ajaxStart(function () {
        //show ajax indicator
        ajaxindicatorstart('loading report data... please wait..');
    }).ajaxStop(function () {
        ajaxindicatorstop();
    });


    $(".btn").click(function(){
        getselection();
    });


    $(function() {

        $( "#startdatepicker" ).datepicker();
        $( "#startdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#startdatepicker" ).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });
    $(function() {
        $( "#enddatepicker" ).datepicker();
        $( "#enddatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#enddatepicker" ).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });




function getselection(){

 var vendorid = $("#vendorSelect").val();
    var marketid = $("#marketSelect").val();
    var startdate = $("#startdatepicker").val();
    var enddate = $("#enddatepicker").val();


        jQuery.ajax({
        type: "GET",
        url: "/labors/getlistlaborsperiod",
        cache: false,
        data: {
            vendorid:  vendorid,
            marketid:  marketid,
            startdate: startdate,
            enddate: enddate
        },
        success: function(datata) {

//mapObj.put("1", formattedDate);  mapObj.put("4", e.amounthours);
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
                    { "mData": "6", "sWidth": "15%" },
                    { "mData": "7" },
                    { "mData": "8", "sWidth": "30%"  }

                ]
            } );


        },
        error: function(err) {
            return alert(err);
        }
    });
    $( "#reportot").show();

};





    $("#marketSelect").change(
        function()
    {
            var foo = "";
            $('#marketSelect :selected').each(function(i, selected){
                foo = $(selected).val();
                populatevendors(foo,"");
            });
      //  refreshTable();
       //     return window.location.href = "?date=" + dateText +  "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
      //        return  window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
        });


    function populatevendors(marketid, itemtype)
    {
        $.ajax({

            type: "GET",
            url: '/jobs/vendors/getvendorsmarketcat?marketid='+marketid+"&itemType="+itemtype+"&insurence=true&employee=1",
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




    $( "#qbexport").click(function(){
        //    window.location.href = jsRoutes.controllers.Bills.billQBexcelExport().url  + location.search

        var vendorid = $("#vendorSelect").val();
        var marketid = $("#marketSelect").val();
        var startdate = $("#startdatepicker").val();
        var enddate = $("#enddatepicker").val();


        //    var urlto = jsRoutes.controllers.Bills.billQBexcelExport().url  + location.search + '?vendorid='+vendorid+'&marketid='+marketid+'&startdate='+startdate+'&enddate='+enddate;

        window.location.href = jsRoutes.controllers.Labors.laborQBexcelExport().url  + location.search + '?vendorid='+vendorid+'&marketid='+marketid+'&startdate='+startdate+'&enddate='+enddate;

        var nesto = "";
        /*        jQuery.ajax({
         type: "GET",
         url: "/report/front/bills/excel",
         cache: false,
         data: {
         vendorid: vendorid,
         marketid: marketid,
         startdate: startdate,
         enddate: enddate
         },
         success: function(datata) {
         },
         error: function(err) {
         return alert(err);
         }
         });*/
    });



    $("#reporttable tbody").on("click", "tr td .clicka", function(){

        var labid =  $(this).closest("td").find('.clicka').attr("data-id");

        if (confirm("Are you sure?")) {
            $.ajax({
                async: false,
                type: 'POST',
                url: '/labor/delete?id='+ labid,
                success: function() {
                    $( "#reportot").show();
                    getselection();
                    goToByScroll("reportot");
                },
                error: function (result) {
                    alert('Some error occurred while saving labor hours ');
                }
            });
        }


    });

    function goToByScroll(id){
        // Remove "link" from the ID
        id = id.replace("link", "");
        // Scroll
        $('html,body').animate({
                scrollTop: $("#"+id).offset().top},
            'slow');
    }

})

