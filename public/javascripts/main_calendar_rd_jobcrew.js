
$(document).ready(function() {

    var d = new Date();

    jQuery(document).ajaxStart(function () {
        //show ajax indicator
        ajaxindicatorstart('loading report data... please wait..');
    }).ajaxStop(function () {
        ajaxindicatorstop();
    });

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


    $("#reporttable tbody").on("click", "tr td .clicka", function(){
       // window.location.href = "/jobs/" + $(this).text();
        window.open("/jobs/" + $(this).text());
    });


    jQuery.ajax({
        type: "GET",
        url: "/report/front/calendar/print",
        cache: false,
        data: {
            date: getQueryVariable('date')
        },
        success: function(datata) {

            $('#reporttable').DataTable().destroy()


            $('#reporttable').DataTable( {
                "sDom": '<"H"lT>rt<"F"ip>',
                "oTableTools": {
                    "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
                    "aButtons" : ["xls", "copy", "csv"]
                },
                "aaData": datata['data'],
                "bAutoWidth": false,
                "aoColumns": [
                    { "mData": "0" , "sWidth": "5%"}, // <-- which values to use inside object
                    { "mData": "1" }, // <-- which values to use inside object
                    { "mData": "2" }, // <-- which values to use inside object
                    { "mData": "3" }, // <-- which values to use inside object
                    { "mData": "4"},
                    { "mData": "5" },
                    { "mData": "6"},
                    { "mData": "7" },
                    { "mData": "8" , "sWidth": "45%"},
                    { "mData": "9" }
                   /* { "mData": "10"}*/

                ]
            });

        },
        error: function(err) {
            return alert(err);
        }
    });

    $("#printperjobs").click(function() {
           var parms;
           parms = (window.location.href.indexOf("?")!=-1)?"&"+window.location.href.split("?")[1]:"";
        //    return window.open("/report/front/newpurchase/printperjob?font=" + $(this).css("font-size") + 10);
       // var parms;
     //   parms = (window.location.href.indexOf("?")!=-1)?"&date="+window.location.href.split("&market=")[1]:"";

        return window.open("/report/front/calendar/printjobcrew?"+ parms);
      //  return window.open("/report/front/newpurchase/printperjob?market=" + getQueryVariable("market") +"&itemCategory=" + getQueryVariable("itemCategory") +"&manager=" + getQueryVariable("manager") +"&vendor=" + getQueryVariable("vendor") +"&startDate=" + getQueryVariable("startDate") +"&endDate=" + getQueryVariable("endDate") +"&vendorview=" + getQueryVariable("vendorview") + "&font=10");
    })

    $( "#excel").click(function(){
        // zemi parametri od url i prosledi gi nakaj...  /report/front/job/excel

        window.location.href = jsRoutes.controllers.Reports_rd.excelExport().url  + location.search
        /*window.location.href = jsRoutes.controllers.Reports_rd.excelExport().url  +  "?market=" + $("#marketSelect").val() +
         "&jobCategory=" + $("#reportJobCategory").val() + "&startDate=" + $("#startdatepicker").val()
         + "&endDate=" + $("#enddatepicker").val()*/
    });



    function normilize(data){
        var result = [];
        for(var row in data){
            result.push(data[row]);
        }
        return result;
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


function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}


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

