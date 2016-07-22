
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


     //   var jobidstring = $("#jobidto").val();
     //   var crewleaderid = $("#crewLeaderselect").val();
    //    var managerid = $("#managerSelect").val();
        var customersid = $("#customerSelect").val();
        jQuery.ajax({
            /*   jsRoutes.controllers.Reports_rd.getnew3frontdata().ajax(
             {*/
            type: "GET",
            url: "/report/front/new3frontdata",
            cache: false,

                    data: {
                        markets: foo,
                        jobCategories: foo1,
                        startDate: $("#startdatepicker").val(),
                        endDate: $("#enddatepicker").val(),
                        customer: customersid
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
                                { "mData": "0"}, // <-- which values to use inside object
                                { "mData": "1", "sWidth": "35%"  }, // <-- which values to use inside object
                                { "mData": "2" },
                                { "mData": "3",  "sWidth": "35%" }
                            ]
                        } );
                        goToByScroll("reportot");
                    },
            error: function(err) {
                return alert(err);
            }
        });
        $( "#reportot").show();

    });





});



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



function goToByScroll(id){
    // Remove "link" from the ID
    id = id.replace("link", "");
    // Scroll
    $('html,body').animate({
            scrollTop: $("#"+id).offset().top},
        'slow');
}