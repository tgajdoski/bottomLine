
$(document).ready(function() {


    $( "#reportot").hide();
    $('#billmodal').hide();

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

    var d = new Date();

    function getMonday(d) {
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -6 : 1);
        return new Date(d.setDate(diff));
    }


       $("#reporttable tbody").on("click", "tr td .clicka", function(){
       // window.open("/quickbooks/bills/" + $(this).text());

           populatefields($(this).text());




    });



    function populatefields(idto){

        $("#termsfullname").selectedIndex = -1;
        $("#termsfullname option").prop("selected", false);

        jsRoutes.controllers.Bills.getBillbyID(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    /*  var c = jQuery.parseJSON( datasub );*/

                    if( datasub['market'] != null && typeof  datasub['market'] != 'undefined')
                        setTimeout(function(){

                            $("select#marketSelectmodal option")
                                .each(function() { this.selected = (this.value == datasub['market']['id'] ); });
                            //  $("#vendorSelectmodal").find("option[value='" + datasub['vendor']['id']  + "']").attr("selected", "selected").end().change();
                        }, 200);
                      //  $("#marketSelectmodal").find("option[value='" + datasub['market']['id']  + "']").attr("selected", "selected").end().change();





                    $("#idnoskrieno").val(datasub['id']);


                    $( '#billnumber' ).val( datasub['billnumber'] );
                    $( '#amount' ).val( datasub['amount'] );

                    if(datasub['accountType'] != null &&  typeof  datasub['accountType'] != 'undefined')
                    {
                        $("select#accounttypeSelect option")
                            .each(function() { this.selected = (this.value == datasub['accountType']['id']); });
                    }
                            //$("#accounttypeSelect").find("option[value='" + datasub['accountType']['id']  + "']").attr("selected", "selected").end().change();


                    $( '#jobnumber' ).val( datasub['job_id'] );
                    $( '#note' ).val( datasub['note'] );



                    var myText =  datasub['termsfullname'].trim();
                    console.log(myText);


                    if(datasub['termsfullname'] != null &&  typeof  datasub['termsfullname'] != 'undefined')
                    {
                        $("select#termsfullname option")
                            .each(function() { this.selected = (this.text == datasub['termsfullname']); });
                    }

                    //    $("#termsfullname option:contains(" + myText +")").attr("selected", "selected").end().change();





                    var billdate = new Date(datasub['billdate']);
                    billdate.setTime(billdate.getTime() + (11*60*60*1000));
                    $( '#startdatepickermodal' ).datepicker('setDate', billdate);


                    var duedate = new Date(datasub['duedate']);
                    duedate.setTime(duedate.getTime() + (11*60*60*1000));
                    $( '#duedatepicker' ).datepicker('setDate', duedate);


                    var incurreddate = new Date(datasub['incurreddate']);
                    incurreddate.setTime(incurreddate.getTime() + (11*60*60*1000));
                    $( '#incurreddatepicker' ).datepicker('setDate', incurreddate);

                    $( '#accountfullname' ).val( datasub['accountfullname'] );



                    if( datasub['vendor'] != null &&  typeof  datasub['vendor'] != 'undefined')
                        setTimeout(function(){

                                $("select#vendorSelectmodal option")
                                    .each(function() { this.selected = (this.value == datasub['vendor']['id'] ); });
                          //  $("#vendorSelectmodal").find("option[value='" + datasub['vendor']['id']  + "']").attr("selected", "selected").end().change();
                        }, 500);


                    $('#billmodal').show();
                },
                error: function(err) {
                    return alert("There was an error reading the customer information! Please refresh the page and try again.");
                }
            }
        );

        // selectiraj go marketot vo dropdownmenito... ne RABOTI


    }



    $("#reporttable tbody").on("click", "tr td .clickdel", function(){

        var d = $(this).closest('tr');
        var billid = $(this).attr('value');

        if (confirm("Are you sure?")) {
            return jsRoutes.controllers.Bills.deletebill().ajax({
                data: {
                    id: billid
                },
                success: function(data) {
                   // $("#reporttable").find("tr").remove();
                    var n = noty({type: 'success', text: 'Bill was deleted',  timeout: 3000});
                    return d.remove();
                },
                error: function(err) {
                    return alert("There was an error deleting the bill! Please refresh the page and try again.");
                }
            });
        }


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

    $(function() {

        $( "#startenterdatepicker" ).datepicker();
        $( "#startenterdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#startenterdatepicker" ).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });
    $(function() {
        $( "#endenterdatepicker" ).datepicker();
        $( "#endenterdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#endenterdatepicker" ).val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });



    $(function() {
        var d = $( "#startdatepickermodal" ).val();
        $( "#startdatepickermodal" ).datepicker();
        $( "#startdatepickermodal" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
//        $( "#startdatepicker").val($.datepicker.formatDate('yy-mm-dd', getMonday(new Date())));
        $( "#startdatepickermodal" ).val(d);
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



    $(".close").click(function() {
        $('#billmodal').hide();
    });

    $("#close").click(function() {
        $('#billmodal').hide();
    });


    $(".btn").click(function(){
        getselection();
    });



    $(".btnnn").click(function(){

        jsRoutes.controllers.Bills.Updatebill().ajax(
            {
                data: {
                    expid: $("#idnoskrieno").val(),
                    datebill:   $("#startdatepickermodal").val(),
                    incurreddate:   $("#incurreddatepicker").val(),
                    marketid: $("#marketSelectmodal").val(),
                    vendorid: $("#vendorSelectmodal").val(),
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
                   // alert("bill was changed");
                    getselection();
                    $("#billmodal").hide();
                   // window.setTimeout(window.close(), 3000);
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
    var startdate = $("#startdatepicker").val();
    var enddate = $("#enddatepicker").val();

    var startenterdate = $("#startenterdatepicker").val();
    var endenterdate = $("#endenterdatepicker").val();



    var bybilldate = false;
    // if ($('input.bybilldate').is(':checked'))
    if($('#bybilldate').is(':checked'))
         bybilldate = true;

    var byenterdate = false;
 //   if ($('input.byenterdate').is(':checked'))
    if($('#byenterdate').is(':checked'))
        byenterdate = true;



        jQuery.ajax({
        type: "GET",
        url: "/bills/getlistexpenses",
        cache: false,
        data: {
            vendorid: vendorid,
            marketid: marketid,
            startdate: startdate,
            enddate: enddate,
            startenterdate: startenterdate,
            endenterdate: endenterdate,
            byenterdate: byenterdate,
            bybilldate:bybilldate
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
                    { "mData": "13" },
                    { "mData": "14" }

                ]
            } );
        },
        error: function(err) {
            return alert(err);
        }
    });
    $( "#reportot").show();

};


    $("#marketSelectmodal").change(
        function()
        {
            var foo = "";
            $('#marketSelectmodal :selected').each(function(i, selected){
                foo = $(selected).val();
                populatevendors(foo,"");
            });
        });







    function populatevendors(marketid, itemtype)
    {

        $.ajax({

            type: "GET",
            url: '/jobs/vendors/getvendorsmarketcat?marketid='+marketid+"&itemType="+itemtype+"&insurence=true&invoice=1",
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
                $('#vendorSelectmodal').empty().append(html);
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


        var startenterdate = $("#startenterdatepicker").val();
        var endenterdate = $("#endenterdatepicker").val();


        var bybilldate = false;
        // if ($('input.bybilldate').is(':checked'))
        if($('#bybilldate').is(':checked'))
            bybilldate = true;

        var byenterdate = false;
        //   if ($('input.byenterdate').is(':checked'))
        if($('#byenterdate').is(':checked'))
            byenterdate = true;


        //    var urlto = jsRoutes.controllers.Bills.billQBexcelExport().url  + location.search + '?vendorid='+vendorid+'&marketid='+marketid+'&startdate='+startdate+'&enddate='+enddate;




        window.location.href = jsRoutes.controllers.Bills.billQBexcelExport().url  + location.search + '?vendorid='+vendorid+'&marketid='+marketid+'&startdate='+startdate+'&enddate='+enddate+'&startenterdate='+startenterdate+'&endenterdate='+endenterdate+'&bybilldate='+bybilldate+'&byenterdate='+byenterdate;

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


});


