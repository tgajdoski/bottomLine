
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


    var d = new Date();

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



    jQuery(document).ajaxStart(function () {
        //show ajax indicator
        ajaxindicatorstart('loading report data... please wait..');
    }).ajaxStop(function () {
        ajaxindicatorstop();
    });




    $( ".btn").click(function(){


        $( "#reportot").show();
        // multi:
        // marketSelect
        // reportJobCategory
        var foo = "";
        $('#marketSelect :selected').each(function(i, selected){
            foo += $(selected).val() + "-";
        });
        var foo1 = "";
        $('#reportJobCategory :selected').each(function(i, selected){
            foo1 += $(selected).val() + "-";
        });

            // single:
            // jobidstring OR
            // managerSelect
            // customerSelect
            // crewLeaderselect
        $("#enddatepicker").val();



        $("#reportSelect").val();

        var jobidstring = $("#jobidto").val();
        var crewleaderid = $("#crewLeaderselect").val();
     //    var managerid = $("#managerSelect").val();
        var customersid = $("#customerSelect").val();
        var subdivisionid = $("#subdivisionSelect").val();

                     jQuery.ajax({
            /* jsRoutes.controllers.Reports_rd.getnew2frontdata().ajax(
             {*/
                            type: "GET",
                            url: "/report/front/new1frontdata",
                            cache: false,
                  /*  jsRoutes.controllers.Reports_rd.getnew1frontdata().ajax(
                        {*/
                            data: {
                                jobid: jobidstring,
                                markets: foo,
                                jobCategories: foo1,
                              //  crewleader: crewleaderid,
                             //   manager: managerid,
                                customer: customersid,
                                startDate: $("#startdatepicker").val(),
                                endDate: $("#enddatepicker").val(),
                                subdivision: subdivisionid
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
                                        { "mData": "1", "sWidth": "35%"  }, // <-- which values to use inside object
                                        { "mData": "2" }, // <-- which values to use inside object
                                        { "mData": "3" }, // <-- which values to use inside object
                                        { "mData": "4" },
                                        { "mData": "5" },
                                        { "mData": "6" },
                                        { "mData": "7" }
                                    ]
                                } );


                                $("#totalsale").html(toformat(sumOfColumns("reporttable", 3, true)));
                                $("#totalctualcost").html(toformat(sumOfColumns("reporttable", 4, true)));
                                $("#totalbudcost").html(toformat(sumOfColumns("reporttable", 5, true)));
                                $("#totalprofit").html(toformat(sumOfColumns("reporttable", 6, true)));
                                $("#totalprofitmargin").html(toformat(sumOfColumnsPercent("reporttable", 7, true)) +"%");
                                $("#totaloverbudget").html(toformat(sumOfColumns("reporttable", 8, true)));
                            },
                         error: function(err) {
                             return alert(err);
                         }
                     });
        $( "#reportot").show();
        goToByScroll("reportot");

    });




    $("#customerSelect").change(
        function()
        {
            if ($("#customerSelect")[0].selectedIndex > 0)
            {
                populatesubdivisions($("#customerSelect option:selected" ).val());
            }
      });


    $("#marketSelect").change(
        function()
        {

                var foo = "";
                $('#marketSelect :selected').each(function(i, selected){
                    foo += $(selected).val() + "-";
                });

            //    alert(foo);
                populatecustomers(foo);
              //  populatesubdivisions($("#customerSelect option:selected" ).val());

        });


});


    function sumOfColumns(tableID, columnIndex, hasHeader) {
        var tot = 0;
        $("#" + tableID + " tr" + (hasHeader ? ":gt(0)" : ""))
        .children("td:nth-child(" + columnIndex + ")")
        .each(function() {
        tot += parseFloat($(this).html().replace(",", ""));
        });
    return tot;
    }



function sumOfColumnsPercent(tableID, columnIndex, hasHeader) {
    var tot = 0;
    var count = 0;
    $("#" + tableID + " tr" + (hasHeader ? ":gt(0)" : ""))
        .children("td:nth-child(" + columnIndex + ")")
        .each(function() {
            tot += parseFloat($(this).html().replace(",", ""));
            count++;
        });
    return tot/count;
}




function toformat(n) {
    return n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}


function populatecustomers(marketidto){
    jsRoutes.controllers.Customers_rd.getCustomerpermarketS().ajax(
        {
            data: {
                markets:marketidto
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
}



function goToByScroll(id){
    // Remove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    $('html,body').animate({
            scrollTop: $("#"+id).offset().top},
        'slow');
}