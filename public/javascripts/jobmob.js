    /**
 * Created by User on 11/9/14.
 */

$(document).ready(function() {



    $(document).ready(function() {
        $(".dropdown-toggle").dropdown();
    });


 var selectedJob,selectedLineType,taskidno, lineitemidto;
    var selectedTaskType;

    $('[data-toggle="tooltip"]').tooltip();

// novi presmetki
    var ffiprofit=0;
    var gross = 0;
    var over =0;
    gross = $('#grossprofit').val();
    over = $('#managerprofit').val();
    $('#ffiprofit').val(ffiprofit);

    // do tuka za vo hederot so brojkite





    $('#modalprintjobCard').hide();
    $('#modallineitemnote').hide();

    $(".closeprint").click(function() {
        $('#modalprintjobCard').hide();
    });
    $("#closeprint").click(function() {
        $('#modalprintjobCard').hide();
    });



    $(".closenote").click(function() {
        $('#modallineitemnote').hide();
        goToByScroll("budget");
    });
    $("#closenote").click(function() {
        $('#modallineitemnote').hide();
        goToByScroll("budget");
    });

    $(".closeemail").click(function() {
        $('#modalemailjobCard').hide();
    });
    $("#closeemail").click(function() {
        $('#modalemailjobCard').hide();
    });


    $("#printjobcard").click(function() {
       // $('#closeprint').html("Print");
     //   $('#print').text('Print');
      //  $('#closeprint').prop("value", "Print");
        $('#print').attr('data-href', 'print');
        $('#modalprintjobCard').show();
    });

    $("#emailjobcard").click(function() {
      //  $('#closeprint').prop("value", "Email");
     //   $('#email').text('Email');
        $('#email').attr('data-href', 'email');
        $('#modalemailjobCard').show();
    });






    $("#print").click(function() {
        var checked = $('input[name="chk_group"]:checked');
//number of checked items
        var checkedlength = checked.length;
//an array containing values of all checked inputs
        var values = checked.map(function(){
            return this.value
        }).get();

        var izbrani = "";
        for (i = 0; i < values.length; i++) {
            izbrani += values[i] + "-";
        }
       // alert(izbrani);
        var parms;
        var jobid = $("#totals").attr("data-job-id");
        parms = "&blocks=" + izbrani+ "&jobid="+ jobid;

        $('#modalprintjobCard').hide();
        return window.open("/jobcard/print?font=10" + parms);

    });


    $("#email").click(function() {
        var checked = $('input[name="chk_groupss"]:checked');
//number of checked items
        var checkedlength = checked.length;
//an array containing values of all checked inputs
        var values = checked.map(function(){
            return this.value
        }).get();
        var izbrani = "";
        for (i = 0; i < values.length; i++) {
            izbrani += values[i] + "-";
        }
        // alert(izbrani);
        var parms;
        var jobid = $("#totals").attr("data-job-id");
        var to = $("#emailto").val();

        var messagehtml = $("#messagehtml").val();


        parms = "&blocks=" + izbrani+ "&jobid="+ jobid +"&to="+to+"&message="+messagehtml;
       var emaillink = "/jobcard/email?font=10" + parms;
        $.ajax({
            async: false,
            url: emaillink,
            success: function() {
                alert("Your message was sent successfully.")
                $('#modalemailjobCard').hide();
            },
            error:   function() {
                alert("Error sending massage. Please contact your system administrator")
            }
        });

    });


    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
/*

    $(function() {
        $( "#labdatepicker" ).datepicker();
        $( "#labdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        //  $( "#jobstartdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
    });

    $(function() {
        $( "#matdatepicker" ).datepicker();
        $( "#matdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
       */
/* $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));*//*

    });
    $(function() {
        $( "#condatepicker" ).datepicker();
        $( "#condatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
      */
/*  $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd',new Date()));*//*

    });
    $(function() {
        $( "#landdatepicker" ).datepicker();
        $( "#landdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    */
/*    $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));*//*

    });
    $(function() {
        $( "#misdatepicker" ).datepicker();
        $( "#misdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
      */
/*  $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));*//*

    });

*/


    $("th").on("click", ".options dt", function(e) {
        e.preventDefault();
        if ($(e.target).parent().hasClass("opened")) {
            $(e.target).parent().removeClass("opened");
        } else {
            $(e.target).parent().addClass("opened");
            $(document).one("click", function() {
                return $(e.target).parent().removeClass("opened");
            });
        }
        return false;
    });


    $(document).on('click', '.deletelablistitem', function()
    {
        if (confirm("Are you sure?")) {
            var deletelink = "/jobs/lineitems/"+ $(this).attr('data-href');
            $.ajax({
                url: deletelink,
                type: 'DELETE',
                success: function() {
                    populateLaborItems(selectedJob, taskidno, $('#lablineitemsperuser option:selected').val());

                },
                error:  $.noop
            });
        }
        else
        {
            return false;
        }
    });


    $("body").delegate('.labdatepicker', 'blur', function(){
        var idno =  $(this).parents('tr').attr('data-saleitem-id');
        var saleitemdate = $($(this)).val();
        var jobid = $("#totals").attr("data-job-id");

        if (saleitemdate !=""){
            jsRoutes.controllers.Saleitems_rd.updateSaleitem(idno).ajax(
                {
                    data: {
                        saleitemdate: $($(this)).val()
                    },
                    success: function(data) {
                        // window.location.href = "/jobs/" + jobid
                        var n = noty({type: 'success', text: 'date was added to saleitem',  timeout: 1000});
                    },
                    error: function(err) {
                        return alert("There was an error adding date to saleitem! Please refresh the page and try again.");
                    }
                }
            );
        }
    });

    $("body").on("click", ".checkActuals", function(e) {

        // ako e verifikuvan frli samo alert
        var checkedverified = $(this).closest('tr').find('td:nth-child(10)').find('button').html();



        if (checkedverified == "verify")
        {
            // alert($(this).attr("data-line-id"));
            selectedJob = $(this).attr("data-job-id");
            selectedLineType= $(this).attr("data-line-type-id");
            taskidno = $(this).attr("data-task-id");
            lineitemidto = $(this).attr("data-line-id");

            var vendoridno = $(this).closest('tr').find('td:nth-child(2)').attr('data-vendor-id');
            var itemidno = $(this).closest('tr').find('td:nth-child(3)').attr('data-item-id');

            selectedTaskType = 4;

            $('#addlabbutton').attr("data-lineitemorg-id" ,lineitemidto );



            $('#typeoditem').text($(this).attr("data-line-type").toUpperCase());
         //   getactualvendors($(this).attr("data-market-id"), $(this).attr("data-line-type-id"));

            getactualvendorsmin($(this).attr("data-market-id"), $(this).attr("data-line-type-id"), selectedJob);


           // this.parentNode.getAttribute("data-date").replace(/['"]+/g, '');
            var datumactual = $(this).closest('tr').find('td:nth-child(11)').find('.calTask').attr('data-date').replace(/['"]+/g, '');
            // namesto denesen den mora da se zeme denot od actuals
            /*$( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
            $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
            $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
            $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
            $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));*/

            $( "#labdatepicker").val(datumactual);
            $( "#condatepicker").val(datumactual);
            $( "#landdatepicker").val(datumactual);
            $( "#misdatepicker").val(datumactual);
            $( "#matdatepicker").val(datumactual);


            if (selectedLineType == "1")
            {
                $("#laborinfo ").show();
                $("#coninfo").hide();
                $("#matinfo").hide();
                $("#landinfo").hide();
                $("#misinfo").hide();
                $('#addlabbutton').prop('disabled', false);
                populateLaborItems(selectedJob, taskidno, lineitemidto);
            }
            else if (selectedLineType == "2")
            {
                $("#laborinfo ").hide();
                $("#matinfo").show();
                $("#coninfo").hide();
                $("#landinfo").hide();
                $("#misinfo").hide();
                populateMaterialsItems(selectedJob, taskidno, vendoridno, itemidno );
            }
            else if (selectedLineType == "3")
            {
                $("#laborinfo ").hide();
                $("#matinfo").hide();
                $("#coninfo").show();
                $("#landinfo").hide();
                $("#misinfo").hide();
                populateConcreteItems(selectedJob, taskidno, vendoridno, itemidno);
            }
            else if (selectedLineType == "4")
            {
                $("#laborinfo ").hide();
                $("#matinfo").hide();
                $("#coninfo").hide();
                $("#landinfo").show();
                $("#misinfo").hide();
                populateLandscapeItems(selectedJob, taskidno, vendoridno, itemidno);
            }
            else if (selectedLineType == "5")
            {
                $("#laborinfo ").hide();
                $("#matinfo").hide();
                $("#coninfo").hide();
                $("#landinfo").hide();
                $("#misinfo").show();
                populateMiscellaneousItems(selectedJob, taskidno, vendoridno, itemidno);
            }
            // ako ne e labor skri go

            $('#lineitemlist').show();
        }
        else
        {
            selectedJob = $(this).attr("data-job-id");
            selectedLineType= $(this).attr("data-line-type-id");
            taskidno = $(this).attr("data-task-id");
            lineitemidto = $(this).attr("data-line-id");

            var vendoridno = $(this).closest('tr').find('td:nth-child(2)').attr('data-vendor-id');
            var itemidno = $(this).closest('tr').find('td:nth-child(3)').attr('data-item-id');

            selectedTaskType = 4;

            $('#addlabbutton').attr("data-lineitemorg-id" ,lineitemidto );



            $('#typeoditem').text($(this).attr("data-line-type").toUpperCase());
            //   getactualvendors($(this).attr("data-market-id"), $(this).attr("data-line-type-id"));

            getactualvendorsmin($(this).attr("data-market-id"), $(this).attr("data-line-type-id"), selectedJob);


            // this.parentNode.getAttribute("data-date").replace(/['"]+/g, '');
            var datumactual = $(this).closest('tr').find('td:nth-child(11)').find('.calTask').attr('data-date').replace(/['"]+/g, '');
            // namesto denesen den mora da se zeme denot od actuals
            /*$( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
             $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
             $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
             $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
             $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));*/

            $( "#labdatepicker").val(datumactual);
            $( "#condatepicker").val(datumactual);
            $( "#landdatepicker").val(datumactual);
            $( "#misdatepicker").val(datumactual);
            $( "#matdatepicker").val(datumactual);


            if (selectedLineType == "1")
            {
                $("#laborinfo ").show();
                $("#coninfo").hide();
                $("#matinfo").hide();
                $("#landinfo").hide();
                $("#misinfo").hide();
                populateLaborItems(selectedJob, taskidno, lineitemidto);
                $('#addlabbutton').prop('disabled', true);
                $('#lineitemlist').show();
            }
            else
            {
                alert("This Budget line item is already verified");
            }
        }
    });



    function getactualvendorsmin(marketid, itemtype, jobid)
    {
        $.ajax({

            type: "GET",
            url: '/jobs/vendors/getactualvendorsmin?jobid='+jobid+'&marketid='+marketid+"&itemType="+itemtype,
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

                if (itemtype == 1)
                {
                    $('#labvendorselect').empty().append(html);
                }
                if (itemtype == 2)
                {
                    $('#matvendorselect').empty().append(html);
                }
                if (itemtype == 3)
                {
                    $('#convendorselect').empty().append(html);
                }
                if (itemtype == 4)
                {
                    $('#landvendorselect').empty().append(html);
                }
                if (itemtype == 5)
                {
                    $('#misvendorselect').empty().append(html);
                }

                if (itemtype == 6)
                {
                    $('#salvendorselect').empty().append(html);
                }

            },
            error: function (result) {
                alert('Some error occurred while retrieving vendor list. ');
            }
        });

    }


    function getactualvendors(marketid, itemtype)
    {
        $.ajax({

            type: "GET",
            url: '/jobs/vendors/getactualvendors?marketid='+marketid+"&itemType="+itemtype,
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



                if (itemtype == 1)
                {
                    $('#labvendorselect').empty().append(html);
                }
                if (itemtype == 2)
                {
                    $('#matvendorselect').empty().append(html);
                }
                if (itemtype == 3)
                {
                    $('#convendorselect').empty().append(html);
                }
                if (itemtype == 4)
                {
                    $('#landvendorselect').empty().append(html);
                }
                if (itemtype == 5)
                {
                    $('#misvendorselect').empty().append(html);
                }

                if (itemtype == 6)
                {
                    $('#salvendorselect').empty().append(html);
                }


            },
            error: function (result) {
                alert('Some error occurred while retrieving vendor list. ');
            }
        });

    }




//// LABOR ///////////////////// components/////////

    $('.labvendors').change(function(){
        if ($(".labvendors")[0].selectedIndex > 0)
        {
            getvendoritems($(".labvendors option:selected" ).val(), 1 , 1);
            $('#addlabbutton').attr('data-href', 'add');
            $('#addlabbutton').attr('data-item-id', 0);
            $("#addlabbutton").html('add');


            $("#labitemselect")[0].selectedIndex = 0;
            $("#labquantity").val('');
            $("#labprice").val('');
            $("#labtotal").val('');
        }
    });

    $('.labitems').change(function(){
        if ($(".labitems")[0].selectedIndex > 0)
        {
            getvendoritemsprice($(".labvendors option:selected" ).val(), $(".labitems option:selected" ).val(), 1,1);
            $('#addlabbutton').attr('data-href', 'add');
            $('#addlabbutton').attr('data-item-id', 0);
            $("#addlabbutton").html('add');
            $("#labquantity").val('');
            //  $("#labprice").val('');
            $("#labtotal").val('');
        }
    });






////MATERIALS ////////////////////////////////////////////////////

    $("body").on('change','.matvendors', function() {
   // $('.matvendors').change(function(){
        if ($(".matvendors")[0].selectedIndex > 0)
        {
            getvendoritems($(".matvendors option:selected" ).val(), 1, 2);
            $('#addmatbutton').attr('data-href', 'add');
            $('#addmatbutton').attr('data-item-id', 0);
            $("#addmatbutton").html('add');


            $("#matitemselect")[0].selectedIndex = 0;
            $("#matquantity").val('');
            $("#matprice").val('');
            $("#mattotal").val('');
        }
    });

    $('.matitems').change(function(){
        if ($(".matitems")[0].selectedIndex > 0)
        {
            getvendoritemsprice($(".matvendors option:selected" ).val(), $(".matitems option:selected" ).val(), 1,2);
            $('#addmatbutton').attr('data-href', 'add');
            $('#addmatbutton').attr('data-item-id', 0);
            $("#addmatbutton").html('add');
            $("#matquantity").val('');
            //  $("#labprice").val('');
            $("#mattotal").val('');
        }
    });

///////CONCRETE ////////////////////////////////////////////////////////////////////////////

    $('.convendors').change(function(){
        if ($(".convendors")[0].selectedIndex > 0)
        {
            getvendoritems($(".convendors option:selected" ).val(), 1,3);
            $('#addconbutton').attr('data-href', 'add');
            $('#addconbutton').attr('data-item-id', 0);
            $("#addconbutton").html('add');


            $("#conitemselect")[0].selectedIndex = 0;
            $("#conquantity").val('');
            $("#conprice").val('');
            $("#contotal").val('');
        }
    });

    $('.conitems').change(function(){
        if ($(".conitems")[0].selectedIndex > 0)
        {
            getvendoritemsprice($(".convendors option:selected" ).val(), $(".conitems option:selected" ).val(),1,3);
            $('#addconbutton').attr('data-href', 'add');
            $('#addconbutton').attr('data-item-id', 0);
            $("#addconbutton").html('add');
            $("#conquantity").val('');
            //  $("#labprice").val('');
            $("#contotal").val('');
        }
    });

///////LANDSCAPE //////////////////////////////////////////////////////////////////////

    $('.landvendors').change(function(){
        if ($(".landvendors")[0].selectedIndex > 0)
        {
            getvendoritems($(".landvendors option:selected" ).val(), 1,4);
            $('#addlandbutton').attr('data-href', 'add');
            $('#addlandbutton').attr('data-item-id', 0);
            $("#addlandbutton").html('add');


            $("#landitemselect")[0].selectedIndex = 0;
            $("#landquantity").val('');
            $("#landprice").val('');
            $("#landtotal").val('');
        }
    });

    $('.landitems').change(function(){
        if ($(".landitems")[0].selectedIndex > 0)
        {
            getvendoritemsprice($(".landvendors option:selected" ).val(), $(".landitems option:selected" ).val(), 1,4);
            $('#addlandbutton').attr('data-href', 'add');
            $('#addlandbutton').attr('data-item-id', 0);
            $("#addlandbutton").html('add');
            $("#landquantity").val('');
            //  $("#labprice").val('');
            $("#landtotal").val('');
        }
    });

///////MISCELLANEOUS//////////////////////////////////////////////////////

    $('.misvendors').change(function(){
        if ($(".misvendors")[0].selectedIndex > 0)
        {
            getvendoritems($(".misvendors option:selected" ).val(), 1, 5);
            $('#addmisbutton').attr('data-href', 'add');
            $('#addmisbutton').attr('data-item-id', 0);
            $("#addmisbutton").html('add');


            $("#misitemselect")[0].selectedIndex = 0;
            $("#misquantity").val('');
            $("#misprice").val('');
            $("#mistotal").val('');
        }
    });

    $('.misitems').change(function(){
        if ($(".misitems")[0].selectedIndex > 0)
        {
            getvendoritemsprice($(".misvendors option:selected" ).val(), $(".misitems option:selected" ).val(), 1,5);
            $('#addmisbutton').attr('data-href', 'add');
            $('#addmisbutton').attr('data-item-id', 0);
            $("#addmisbutton").html('add');
            $("#misquantity").val('');
            //  $("#labprice").val('');
            $("#mistotal").val('');
        }
    });

////////////////////////////////////////////////////////////////////////////


    $( '#labquantity, #labprice').focusout(function(){
        $('#labtotal').val($( '#labquantity').val() * $( '#labprice').val());
    });

    $( '#matquantity, #matprice').focusout(function(){
        $('#mattotal').val($( '#matquantity').val() * $( '#matprice').val());
    });

    $( '#conquantity, #conprice').focusout(function(){
        $('#contotal').val($( '#conquantity').val() * $( '#conprice').val());
    });

    $( '#landquantity, #landprice').focusout(function(){
        $('#landtotal').val($( '#landquantity').val() * $( '#landprice').val());
    });

    $( '#misquantity, #misprice').focusout(function(){
        $('#mistotal').val($( '#misquantity').val() * $( '#misprice').val());
    });


    function getitem(itemid)
    {
        jsRoutes.controllers.Vendors_rd.getonlyItem(itemid).ajax(
            {
                async: false,
                data: {
                    id:itemid
                },
                success: function(datasubve) {
                    var html = '';
                    //   var len = datasubve.length;

                         if (datasubve!='' && datasubve.name!='' && datasubve.id !=''){
                            html +=  '<option  value="' + datasubve.id + '" data-href-id="'+ datasubve.id +'" >' + datasubve.name  + '</option>';
                        }
                    switch(datasubve.itemType.id) {
                        case 1:
                            $('#labitemselect').empty().append(html);
                            break;
                        case 2:
                            $('#matitemselect').empty().append(html);
                            break;
                        case 3:
                            $('#conitemselect').empty().append(html);
                            break;
                        case 4:
                            $('#landitemselect').empty().append(html);
                            break;
                        case 5:
                            $('#misitemselect').empty().append(html);
                            break;
                    }

                    //  alert("ok popolneti se");
                },
                error: function(err) {
                    return alert("There was an error reading item information!");
                }
            }
        );
    }

    function getvendoritems(vendorid, task, type){
        jsRoutes.controllers.Vendors_rd.getVendorActualItems(vendorid).ajax(
            {
                async: false,
                data: {
                    id:vendorid
                },
                success: function(datasubve) {
                    var html = '';
                    //   var len = datasubve.length;

                    html+='<option value=""></option>';


                    for (var key in datasubve){
                        if (datasubve.hasOwnProperty(key)){
                            html +=  '<option value="' + key + '" data-href-id="'+ key +'">' + datasubve[key]  + '</option>';
                        }
                    }

                    switch(type) {
                        case 1:
                            $('#labitemselect').empty().append(html);
                            break;
                        case 2:
                            $('#matitemselect').empty().append(html);
                            break;
                        case 3:
                            $('#conitemselect').empty().append(html);
                            break;
                        case 4:
                            $('#landitemselect').empty().append(html);
                            break;
                        case 5:
                            $('#misitemselect').empty().append(html);
                            break;
                    }

                    //  alert("ok popolneti se");
                },
                error: function(err) {
                    return alert("There was an error reading vendor items information!");
                }
            }
        );

    }

    function getvendoritemsprice(vendorid, itemid, task, type){
        jsRoutes.controllers.Vendors_rd.getVendorActualItem().ajax(
            {
                async: false,
                data: {
                    itemid:itemid,
                    vendorid:vendorid
                },
                success: function(datasubit) {
                    switch(type) {
                        case 1:
                            $( '#labprice').val( datasubit['default_rate'] );
                            break;
                        case 2:
                            $( '#matprice').val( datasubit['default_rate'] );
                            break;
                        case 3:
                            $( '#conprice').val( datasubit['default_rate'] );
                            break;
                        case 4:
                            $( '#landprice').val( datasubit['default_rate'] );
                            break;
                        case 5:
                            $( '#misprice').val( datasubit['default_rate'] );
                            break;
                    }
                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );
    }




/// LAB BUTTONS //////
    $(document).on('click', '#addlabbutton', function()
    {
        // da se vidi dali se popolneti site polinja
        if ($('#labdatepicker').val() !=""  && $("#labvendorselect option:selected").text() !=""  && $("#labitemselect option:selected").text()  !=""  &&  $('#labquantity').val() !=""  &&  $('#labprice').val() !=""  &&  $('#labtotal').val() !="" )
        {
            var vendorid =  $(".labvendors option:selected" ).val();
            var itemid =     $(".labitems option:selected" ).val();
            var itemtype = 1; // labor
            var quantity =  $('#labquantity').val() ;
            var rate =  $('#labprice').val();
            var saleprice =   $('#labtotal').val();
            var date= $('#labdatepicker').val() + " 12:00:00.0";
            var lineitemORG =  $('#addlabbutton').attr("data-lineitemorg-id");

            $.ajax({
                async: false,
                type: 'POST',
                url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype="+"4"+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno+"&lineitemidORG="+lineitemORG+"&insertactual=true",
                success: function() {
                    refreshme();
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
            setTimeout(function(){clearlabinserts()}, 450);
            populateLaborItems(selectedJob, taskidno, lineitemidto);

        }
    });


    $(document).on('click', '#addmatbutton', function()
    {
        // da se vidi dali se popolneti site polinja
        //if ($('#matdatepicker').val() !=""  && $("#matvendorselect option:selected").text() !=""  && $("#matitemselect option:selected").text()  !=""  &&  $('#matquantity').val() !=""  &&  $('#matprice').val() !=""  &&  $('#mattotal').val() !="" )
        if ($('#matdatepicker').val() !=""   && $("#matitemselect option:selected").text()  !=""  &&  $('#matquantity').val() !=""  &&  $('#matprice').val() !=""  &&  $('#mattotal').val() !="" )
        {
            var vendorid =  $(".matvendors option:selected" ).val();
            var itemid =     $(".matitems option:selected" ).val();
            var itemtype = 2; // material
            var quantity =  $('#matquantity').val() ;
            var rate =  $('#matprice').val();
            var saleprice =   $('#mattotal').val();
            var date= $('#matdatepicker').val()  + " 12:00:00.0";

            $.ajax({
                async: false,
                type: 'POST',
                url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno+"&insertactual=true",
                success: function() {
                    refreshme();
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });

            setTimeout(function(){clearmatinserts()}, 450);
            populateMaterialsItems(selectedJob, taskidno, vendorid, itemid );
        }
    });


/// CON BUTTONS////

    $(document).on('click', '#addconbutton', function()
    {
        // da se vidi dali se popolneti site polinja
        //if ($('#condatepicker').val() !=""  && $("#convendorselect option:selected").text() !=""  && $("#conitemselect option:selected").text()  !=""  &&  $('#conquantity').val() !=""  &&  $('#conprice').val() !=""  &&  $('#contotal').val() !="" )
        if ($('#condatepicker').val() !=""   && $("#conitemselect option:selected").text()  !=""  &&  $('#conquantity').val() !=""  &&  $('#conprice').val() !=""  &&  $('#contotal').val() !="" )
        {
            var vendorid =  $(".convendors option:selected" ).val();
            var itemid =     $(".conitems option:selected" ).val();
            var itemtype = 3; // concrete
            var quantity =  $('#conquantity').val() ;
            var rate =  $('#conprice').val();
            var saleprice =   $('#contotal').val();
            var date= $('#condatepicker').val();

            $.ajax({
                async: false,
                type: 'POST',
                url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno+"&insertactual=true",
                success: function() {
                    refreshme();
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
            //  populateAllItems(selectedJob);
            setTimeout(function(){clearconinserts()}, 450);
            populateConcreteItems(selectedJob, taskidno, vendorid, itemid);
        }
    });

// LAND BUTTONS ////
    $(document).on('click', '#addlandbutton', function()
    {
        // da se vidi dali se popolneti site polinja
        //if ($('#landdatepicker').val() !=""  && $("#landvendorselect option:selected").text() !=""  && $("#landitemselect option:selected").text()  !=""  &&  $('#landquantity').val() !=""  &&  $('#landprice').val() !=""  &&  $('#landtotal').val() !="" )
        if ($('#landdatepicker').val() !=""  && $("#landitemselect option:selected").text()  !=""  &&  $('#landquantity').val() !=""  &&  $('#landprice').val() !=""  &&  $('#landtotal').val() !="" )
        {
            // da se vidi dali ima takov datum vo taskovite
            var vendorid =  $(".landvendors option:selected" ).val();
            var itemid =     $(".landitems option:selected" ).val();
            var itemtype = 4; // landscape
            var quantity =  $('#landquantity').val() ;
            var rate =  $('#landprice').val();
            var saleprice =   $('#landtotal').val();
            var date= $('#landdatepicker').val();

            $.ajax({
                async: false,
                type: 'POST',
                url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno+"&insertactual=true",
                success: function() {
                    refreshme();
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
            //   populateAllItems(selectedJob);
            setTimeout(function(){clearlandinserts()}, 450);
            populateLandscapeItems(selectedJob, taskidno, vendorid, itemid);
        }
    });

// MISC BUTTONS ///
    $(document).on('click', '#addmisbutton', function()
    {
        // da se vidi dali se popolneti site polinja
        //if ($('#misdatepicker').val() !=""  && $("#misvendorselect option:selected").text() !=""  && $("#misitemselect option:selected").text()  !=""  &&  $('#misquantity').val() !=""  &&  $('#misprice').val() !=""  &&  $('#mistotal').val() !="" )
            if ($('#misdatepicker').val() !=""  && $("#misitemselect option:selected").text()  !=""  &&  $('#misquantity').val() !=""  &&  $('#misprice').val() !=""  &&  $('#mistotal').val() !="" )
        {
            // da se vidi dali ima takov datum vo taskovite
            var vendorid =  $(".misvendors option:selected" ).val();
            var itemid =     $(".misitems option:selected" ).val();
            var itemtype = 5; // miscellanious
            var quantity =  $('#misquantity').val() ;
            var rate =  $('#misprice').val();
            var saleprice =   $('#mistotal').val();
            var date= $('#misdatepicker').val();

            $.ajax({
                async: false,
                type: 'POST',
                url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno+"&insertactual=true",
                success: function() {
                    refreshme();
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
            setTimeout(function(){clearmisinserts()},450);
            populateMiscellaneousItems(selectedJob, taskidno, vendorid, itemid);
        }
    });

// lab clears //

    function clearlabinserts(){

        $("#labvendorselect")[0].selectedIndex = 0;
        $("#labitemselect")[0].selectedIndex = 0;
        $("#labquantity").val('');
        $("#labprice").val('');
        $("#labtotal").val('');
        $("#addlabbutton").html('add');
    }
// mat clears //
    function clearmatinserts(){

        $("#matvendorselect")[0].selectedIndex = 0;
        $("#matitemselect")[0].selectedIndex = 0;
        $("#matquantity").val('');
        $("#matprice").val('');
        $("#mattotal").val('');
        $("#addmatbutton").html('add');
    }
// con clears //
    function clearconinserts(){

        $("#convendorselect")[0].selectedIndex = 0;
        $("#conitemselect")[0].selectedIndex = 0;
        $("#conquantity").val('');
        $("#conprice").val('');
        $("#contotal").val('');
        $("#addconbutton").html('add');
    }
// land clears //
    function clearlandinserts(){

        $("#landvendorselect")[0].selectedIndex = 0;
        $("#landitemselect")[0].selectedIndex = 0;
        $("#landquantity").val('');
        $("#landprice").val('');
        $("#landtotal").val('');
        $("#addlandbutton").html('add');
    }
// mis clears //
    function clearmisinserts(){

        $("#misvendorselect")[0].selectedIndex = 0;
        $("#misitemselect")[0].selectedIndex = 0;
        $("#misquantity").val('');
        $("#misprice").val('');
        $("#mistotal").val('');
        $("#addmisbutton").html('add');
    }





    $("body").on('click','.matcalendartextnote, .labcalendartextnote, .concalendartextnote, .landcalendartextnote, .misccalendartextnote', function() {
        $('#savelineitem').attr('data-href',  this.getAttribute("data-href"));
        $('#lineitemnote').val('');

        var id = this.getAttribute("data-href");
        // probaj da go zemis
        $.ajax({
            async: false,
            type: 'GET',
            url: '/jobs/lineitemsActual/getnote?id='+id,
            success: function(data) {
                // ke treba da se refresh
                $('#lineitemnote').val(data);
            },
            error: function (result) {
                alert('Some error occurred while retrieving job lineitem notes. ');
            }
        });


        $('#modallineitemnote').show();
    });

    $("body").on('click','#savelineitem', function() {
        // snimi go lineitemot so note-ot
        // id vo data-href atribute
        var id = this.getAttribute("data-href");
        var note = $('#lineitemnote').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/noteupdatel?id='+id+"&note="+note,
            success: function() {
                // ke treba da se refresh
                var n = noty({type: 'success', text: 'note was added to lineitem',  timeout: 1000});
            },
            error: function (result) {
                alert('Some error occurred while saving lineitem note. ');
            }
        });
        $('#modallineitemnote').hide();
    });





    function populateLaborItems(jobid, taskidno, lineitemidto){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitemsbyLineItem(jobid).ajax(
            {

                data: {
                    id:jobid,
                    taskid: taskidno,
                    lineitemid: lineitemidto
                },
                success: function(datasubajliit) {

                    $('#labor > tbody').html("<tr></tr>");


                    var htmltablerow = "";
                    for (i = 0; i < datasubajliit.length; ++i) {

                        if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 1 )
                        {
                            var utcSeconds = datasubajliit[i].daysdate /1000 +43200;
                            var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            dd.setUTCSeconds(utcSeconds);

                            var bojata = "width: 270px;";
                            var tooltipo = "";
                            if(datasubajliit[i].notes != null && datasubajliit[i].notes != "" ) {
                                bojata += "color:red;";
                               tooltipo = datasubajliit[i].notes;
                            }
                          /* if ( formatDate(dd) == $( "#labdatepicker").val())
                            {*/
                                htmltablerow += "<tr>";
                                htmltablerow += "<td class=\"deletelablistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                                //htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 110px;\"/></td>";
                               /* htmltablerow += "<td><input type=\"text\"  class=\"labcalendartextnote\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"" + bojata + "\"/></td>";*/
                            htmltablerow += "<td><input type=\"text\" title=\""+tooltipo+ "\" class=\"labcalendartextnote\" data-href=\"" + datasubajliit[i].id+ "\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"" + bojata + "\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                /*   htmltablerow += "<td class=\"editlablistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                htmltablerow +=    "</tr>"
                          /*  }*/
                        }

                    }

                    $('#labor > tbody:last').append(htmltablerow);

                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );
    }

    function populateMaterialsItems(jobid, taskidno, vendoridno, itemidno ){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
            {
                data: {
                    id:jobid,
                    taskid: taskidno,
                },
                success: function(datasubajliit) {

                    $('#materials > tbody').html("<tr></tr>");


                    var htmltablerow = "";
                    for (i = 0; i < datasubajliit.length; ++i) {

                        // datasubajliit[i].vendor != null && datasubajliit[i].vendor.id == vendoridno &&
                        if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].task.id == taskidno &&  datasubajliit[i].item!=null && datasubajliit[i].item.id == itemidno && datasubajliit[i].itemType.id == 2 )
                        {
                          //  var utcSeconds = datasubajliit[i].task.date /1000 +43200;
                            var utcSeconds = datasubajliit[i].daysdate /1000 +43200;

                            var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            dd.setUTCSeconds(utcSeconds);
                                  var bojata = "width: 270px;";
                            var tooltipo = ""
                            if(datasubajliit[i].notes != null && datasubajliit[i].notes != "" ) {
                                bojata += "color:red;";
                                tooltipo = datasubajliit[i].notes;
                            }
                            //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);
                           /* if ( formatDate(dd) == $( "#labdatepicker").val())
                            {*/
                                htmltablerow += "<tr>";
                                /*htmltablerow += "<td class=\"deletematlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";*/
                                htmltablerow += "<td><input type=\"text\" title=\""+tooltipo+ "\" class=\"matcalendartextnote\" data-href=\"" + datasubajliit[i].id+ "\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"" + bojata + "\"/></td>";
                                if (datasubajliit[i].vendor!=null)
                                {
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 270px;\"/></td>";
                                }
                                else
                                {
                                    htmltablerow+="<td></td>"
                                }

                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 125px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 55px;\"/></td>";
                                /*     htmltablerow += "<td class=\"editmatlistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                htmltablerow +=    "</tr>"
                           /* }*/
                        }

                    }

                    $('#materials > tbody:last').append(htmltablerow);

                    // tuka moze da se popolnat samite dropdowns
                    $('#matvendorselect').val(vendoridno);
                    if (vendoridno!=''){
                        getvendoritems(vendoridno, 1, 2);

                        setTimeout(function(){$('#matitemselect').val(itemidno)}, 350);
                        getvendoritemsprice(vendoridno, itemidno, 1,2);
                       // $('#matitemselect').val(itemidno);
                    }
                    else
                    {
                        getitem(itemidno);
                    }

                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );

    }

    function populateConcreteItems(jobid, taskidno, vendoridno, itemidno ){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
            {

                data: {
                    id:jobid,
                    taskid: taskidno
                },
                success: function(datasubajliit) {

                    $('#concrete > tbody').html("<tr></tr>");

                    var htmltablerow = "";
                    for (i = 0; i < datasubajliit.length; ++i) {
                        // ova go trgnav
                        if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].task.id == taskidno && datasubajliit[i].item!=null && datasubajliit[i].item.id == itemidno && datasubajliit[i].itemType.id == 3 )
                        {
                          //  var utcSeconds = datasubajliit[i].task.date /1000 +43200;;
                            var utcSeconds = datasubajliit[i].daysdate /1000 +43200;

                            var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            dd.setUTCSeconds(utcSeconds);


                            var bojata = "width: 270px;";
                            var tooltipo = ""
                            if(datasubajliit[i].notes != null && datasubajliit[i].notes != "" ) {
                                bojata += "color:red;";
                                tooltipo = datasubajliit[i].notes;
                            }
                            //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);
                           /* if ( formatDate(dd) == $( "#labdatepicker").val())
                            {*/
                                htmltablerow += "<tr>";
                              /*  htmltablerow += "<td class=\"deleteconlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";*/
                                htmltablerow += "<td><input type=\"text\" title=\""+tooltipo+ "\"  class=\"concalendartextnote\" data-href=\"" + datasubajliit[i].id+ "\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"" + bojata + "\"/></td>";
                              /*  htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 110px;\"/></td>";*/
                                if (datasubajliit[i].vendor!=null)
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                else
                                    htmltablerow +=    "<td></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                /*       htmltablerow += "<td class=\"editconlistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                htmltablerow +=    "</tr>"
                           /* }*/
                        }

                    }

                    $('#concrete > tbody:last').append(htmltablerow);

                    // tuka moze da se popolnat samite dropdowns
                    $('#convendorselect').val(vendoridno);
                    if (vendoridno!='')
                    {
                        getvendoritems(vendoridno, 1, 3);

                        setTimeout(function(){$('#conitemselect').val(itemidno)}, 350);
                        getvendoritemsprice(vendoridno, itemidno, 1,3);
                    }
                    else
                    {
                        getitem(itemidno);
                    }

                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );

        // zemi gi site sto se zapisani vo baza kako labor i popolni za sekoj od niv vakov red

        // na kraj dodaj go redot vo labor tabelata


    }

    function populateLandscapeItems(jobid, taskidno,  vendoridno, itemidno ){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
            {

                data: {
                    id:jobid,
                    taskid: taskidno
                },
                success: function(datasubajliit) {

                    $('#landscape > tbody').html("<tr></tr>");



                    var htmltablerow = "";
                    for (i = 0; i < datasubajliit.length; ++i) {

                        // && datasubajliit[i].vendor != null && datasubajliit[i].vendor.id == vendoridno
                        if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].task.id == taskidno  && datasubajliit[i].item!=null && datasubajliit[i].item.id == itemidno && datasubajliit[i].itemType.id == 4 )
                        {
                          //  var utcSeconds = datasubajliit[i].task.date /1000 +43200;
                            var utcSeconds = datasubajliit[i].daysdate /1000 +43200;

                            var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            dd.setUTCSeconds(utcSeconds);

                            //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);
                          /*  if ( formatDate(dd) == $( "#labdatepicker").val())
                            {*/
                            var bojata = "width: 270px;";
                            var tooltipo = ""
                            if(datasubajliit[i].notes != null && datasubajliit[i].notes != "" ) {
                                bojata += "color:red;";
                                tooltipo = datasubajliit[i].notes;
                            }

                                htmltablerow += "<tr>";
                               /* htmltablerow += "<td class=\"deletelandlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                                htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 110px;\"/></td>";*/
                                htmltablerow += "<td><input type=\"text\" title=\""+tooltipo+ "\" class=\"landcalendartextnote\" data-href=\"" + datasubajliit[i].id+ "\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"" + bojata + "\"/></td>";
                                if (datasubajliit[i].vendor!=null)
                                {
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                }
                                else
                                {
                                    htmltablerow+="<td></td>"
                                }
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                /*       htmltablerow += "<td class=\"editlandlistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                htmltablerow +=    "</tr>"
                           /* }*/
                        }

                    }
                    $('#landscape > tbody:last').append(htmltablerow);
                    // tuka moze da se popolnat samite dropdowns
                    $('#landvendorselect').val(vendoridno);
                        if (vendoridno!=''){
                        getvendoritems(vendoridno, 1, 4);

                        setTimeout(function(){$('#landitemselect').val(itemidno)}, 350);
                        getvendoritemsprice(vendoridno, itemidno, 1,4);
                    }
                        else
                        {
                            getitem(itemidno);
                        }
                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );
    }

    function populateMiscellaneousItems(jobid, taskidno,  vendoridno, itemidno  ){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
            {

                data: {
                    id:jobid,
                    taskid: taskidno
                },
                success: function(datasubajliit) {
                    $('#miscellaneous > tbody').html("<tr></tr>");

                    var htmltablerow = "";
                    for (i = 0; i < datasubajliit.length; ++i) {
                    // && datasubajliit[i].vendor != null && datasubajliit[i].vendor.id == vendoridno
                        if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].task.id == taskidno && datasubajliit[i].item!=null && datasubajliit[i].item.id == itemidno && datasubajliit[i].itemType.id == 5 )
                        {
                           // var utcSeconds = datasubajliit[i].task.date /1000 +43200;
                            var utcSeconds = datasubajliit[i].daysdate /1000 +43200;

                            var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            dd.setUTCSeconds(utcSeconds);

                            var bojata = "width: 270px;";
                            var tooltipo = ""
                            if(datasubajliit[i].notes != null && datasubajliit[i].notes != "" ) {
                                bojata += "color:red;";
                                tooltipo = datasubajliit[i].notes;
                            }
                           /* if ( formatDate(dd) == $( "#labdatepicker").val())
                            {*/
                                htmltablerow += "<tr>";
                              /*  htmltablerow += "<td class=\"deletemislistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                                htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 110px;\"/></td>";*/
                                htmltablerow += "<td><input type=\"text\" title=\""+tooltipo+ "\" class=\"misccalendartextnote\" data-href=\"" + datasubajliit[i].id+ "\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"" + bojata + "\"/></td>";
                                if (datasubajliit[i].vendor!=null)
                                {
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                }
                                else
                                {
                                    htmltablerow+="<td></td>"
                                }
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                /*             htmltablerow += "<td class=\"editmislistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                htmltablerow +=    "</tr>"
                           /* }*/
                        }

                    }

                    $('#miscellaneous > tbody:last').append(htmltablerow);
                    // tuka moze da se popolnat samite dropdowns
                    $('#miscvendorselect').val(vendoridno);
                    if (vendoridno!=''){
                    getvendoritems(vendoridno, 1, 5);

                    setTimeout(function(){$('#miscitemselect').val(itemidno)}, 350);
                    getvendoritemsprice(vendoridno, itemidno, 1,5);
                    }
                    else
                    {
                        getitem(itemidno);
                    }
                },
                error: function(err) {

                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );

        // zemi gi site sto se zapisani vo baza kako labor i popolni za sekoj od niv vakov red

        // na kraj dodaj go redot vo labor tabelata


    }


    // sumite podolu
    var sum = 0;
    $(".actualtotal").each(function() {
        //add only if the value is number
        if(!(this.textContent == "NA") && this.textContent != "0.00") {
            sum += parseFloat(this.textContent.replace(/[$,]+/g,""));
        }
    });
    $("#totalact").html(sum.toFixed(2));


    var sumdiff = 0;
    $(".checkActuals").each(function() {
        //add only if the value is number
        if(!(this.textContent == "NA") && this.textContent != "0.00") {
            sumdiff += parseFloat(this.textContent.replace(/[$,]+/g,""));
        }
    });
    $("#totaldiff").html(sumdiff.toFixed(2));




});
