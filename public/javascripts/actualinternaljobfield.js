
$( document ).ready(function() {

    var lineitemidto;
    var taskidno =0;
    var d = new Date();
    var jobMarket = 0;
    var selectedJob = 0;
    var selectedTaskType = 0;
    var selektiranprvpat= 0;

    $('#assigntask').hide();
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

    $(document).on('click', '#commentbutton1', function()
    {
        sercomment($('#comment1text').val());
    });

    $("div.id_100 select").val("val2");

    $(document).on('change', '#lablineitemsperuser', function()
    {
        populateLaborItems(selectedJob, taskidno , $('#lablineitemsperuser option:selected').val());
    });







    function sercomment (comment)
    {
        if (selectedJob != ""){
        jsRoutes.controllers.Jobs_rd.appendCommentJob(selectedJob).ajax(
            {
                data: {
                    id:selectedJob,
                    notes: comment
                },
                success: function() {
                    $('#comment1text').val(comment);
                    var n = noty({type: 'success', text: 'comment was added. select the job again to refresh the comments.',  timeout: 3000});
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
    }
    }



    $('#comment1text').focus(function() {
        $(this).val('');
    });



    $(document).on('click', '.openJob', function()
    {

        ajaxindicatorstart('loading job data, preparing and populating lineitem entries... please wait..');

        var tasktipidno = $($(this)).parents('li').find('.openTask').attr('data-href');
        var dateon = $($(this)).parents('li').find('.assignedTask').attr('data-href-date');

        taskidno = $($(this)).parents('li').find('.assignedTask').attr('data-href');

        selectedTaskType = tasktipidno;
        selectedJob = $(this).attr('data-href');

        $( "#labdatepicker").val(dateon);
        $( "#matdatepicker").val(dateon);
        $( "#condatepicker").val(dateon);
        $( "#landdatepicker").val(dateon);
        $( "#misdatepicker").val(dateon);

       // lineitemidto = $(this).attr("data-line-id");

        $($(this)).parents('li').find('.assignTask').css('display', 'inline');

        // ova e smeneto da gi dava samo vendorite sto ni trebaat
        for (var i = 1; i< 6; i++) {
            getactualvendorsmin(0,i, selectedJob);
        }


        someFunction( $(this).attr('data-href'));

        getlineitemsid( $(this).attr('data-href'), taskidno);




        // treba da se popolnat lineitemi za labor za toj covek vo dropdown so value ednakvo na linetiemid ovie prvo  lablineitemsperuser
        // jobid
        /* taskid
         task_tupe_id = null
         item_type_id = 1
         datum*/

        $('#lablineitemsperuser').html('');
        populatelaborlineitemsdropdown(selectedJob, taskidno);
        populateLaborItems(selectedJob, taskidno , $('#lablineitemsperuser option:selected').val());

        populateAllItems($(this).attr('data-href'), taskidno);
       // taskidno = $($(this)).parents('li').attr('data-task-id');
        ajaxindicatorstop();
        window.scrollTo(0, 0);
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

    function formatDateShow(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [month, day, year].join('-');
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
      //  var date= $('#labdatepicker').val();
        var date= $('#labdatepicker').val() + " 12:00:00.0";

        var lineitemORG = $('#lablineitemsperuser option:selected').val();

/*

        $.ajax({
            async: false,
            type: 'GET',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&itemtype=1&date="+date+"&taskidno="+taskidno,
            success: function(data) {
                linitemORG = data.id;
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
*/


        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno+"&lineitemidORG="+lineitemORG+"&insertactual=true",
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearlabinserts()}, 450);
        populateLaborItems(selectedJob, taskidno, $('#lablineitemsperuser option:selected').val());

    }
});
/// MAT BUTTONS///

$(document).on('click', '#addmatbutton', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#matdatepicker').val() !=""  && $("#matvendorselect option:selected").text() !=""  && $("#matitemselect option:selected").text()  !=""  &&  $('#matquantity').val() !=""  &&  $('#matprice').val() !=""  &&  $('#mattotal').val() !="" )
    {
        var vendorid =  $(".matvendors option:selected" ).val();
        var itemid =     $(".matitems option:selected" ).val();
        var itemtype = 2; // material
        var quantity =  $('#matquantity').val() ;
        var rate =  $('#matprice').val();
        var saleprice =   $('#mattotal').val();
        var date= $('#matdatepicker').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        setTimeout(function(){clearmatinserts()}, 450);
        populateMaterialsItems(selectedJob, taskidno);
    }
});
/// CON BUTTONS////

$(document).on('click', '#addconbutton', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#condatepicker').val() !=""  && $("#convendorselect option:selected").text() !=""  && $("#conitemselect option:selected").text()  !=""  &&  $('#conquantity').val() !=""  &&  $('#conprice').val() !=""  &&  $('#contotal').val() !="" )
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
            url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        //  populateAllItems(selectedJob);
        setTimeout(function(){clearconinserts()}, 450);
        populateConcreteItems(selectedJob, taskidno);
    }
});

// LAND BUTTONS ////
$(document).on('click', '#addlandbutton', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#landdatepicker').val() !=""  && $("#landvendorselect option:selected").text() !=""  && $("#landitemselect option:selected").text()  !=""  &&  $('#landquantity').val() !=""  &&  $('#landprice').val() !=""  &&  $('#landtotal').val() !="" )
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
            url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        //   populateAllItems(selectedJob);
        setTimeout(function(){clearlandinserts()}, 450);
        populateLandscapeItems(selectedJob, taskidno);
    }
});

// MISC BUTTONS ///
$(document).on('click', '#addmisbutton', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#misdatepicker').val() !=""  && $("#misvendorselect option:selected").text() !=""  && $("#misitemselect option:selected").text()  !=""  &&  $('#misquantity').val() !=""  &&  $('#misprice').val() !=""  &&  $('#mistotal').val() !="" )
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
            url: '/jobs/lineitemsActual/addnegativeActuals?jobid='+selectedJob+"&tasktype="+selectedTaskType+"&&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearmisinserts()},450);
        populateMiscellaneousItems(selectedJob, taskidno);
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

    function addnewTaskLineItem( jobid ,taskType, itemType,  Taskid , vendorid ,itemid, units , quantity, rate , saleprice, notes, po )
    {
    var postlink = "/jobs/lineitems/newactual?id="+jobid+"&taskType="+taskType+"&itemType="+itemType+"&task="+Taskid;
    $.ajax({
        url: postlink,
        async: false,
        type: 'POST',
        success: function(newlineitem) {
            updatenewTaskLineItem(newlineitem.id, vendorid, itemid, units,  quantity , rate, saleprice, Taskid, "", "", taskType)
        },
        error:  $.noop
    });
}

    function updatenewTaskLineItem( lineitemid, vendorid ,itemid, units , quantity, rate , saleprice,  Taskid, notes, po , taskType)
    {
    // vendor=807&item=106&units=&quantity=8&rate=14.00&saleprice=112&task=98656&notes=&po=null
        var putlink = "";
     if (po != "")
     {
         putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
     }
        else
     {
         putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po=null";
     }

    $.ajax({
        url: putlink,
        type: 'POST',
        success: function() {
          // return existinglineitem.id;

            populateLaborItems(selectedJob, taskidno, $('#lablineitemsperuser option:selected').val());
            populateMaterialsItems(selectedJob, taskidno);
            populateConcreteItems(selectedJob, taskidno);
            populateLandscapeItems(selectedJob, taskidno);
            populateMiscellaneousItems(selectedJob, taskidno);

        },
        error:  $.noop
    });
}

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

    $(document).on('click', '.deletematlistitem', function()
    {
        if (confirm("Are you sure?")) {
            var deletelink = "/jobs/lineitems/"+ $(this).attr('data-href');
            $.ajax({
                url: deletelink,
                type: 'DELETE',
                success: function() {
                    populateMaterialsItems(selectedJob, taskidno);

                },
                error:  $.noop
            });
        }
        else
        {
            return false;
        }
    });

    $(document).on('click', '.deleteconlistitem', function()
    {
        if (confirm("Are you sure?")) {
            var deletelink = "/jobs/lineitems/"+ $(this).attr('data-href');
            $.ajax({
                url: deletelink,
                type: 'DELETE',
                success: function() {
                    populateConcreteItems(selectedJob, taskidno);
                },
                error:  $.noop
            });
        }
        else
        {
            return false;
        }
    });

    $(document).on('click', '.deletelandlistitem', function()
    {
        if (confirm("Are you sure?")) {
            var deletelink = "/jobs/lineitems/"+ $(this).attr('data-href');
            $.ajax({
                url: deletelink,
                type: 'DELETE',
                success: function() {
                    populateLandscapeItems(selectedJob, taskidno);

                },
                error:  $.noop
            });
        }
        else
        {
            return false;
        }
    });

    $(document).on('click', '.deletemislistitem', function()
    {
        if (confirm("Are you sure?")) {
            var deletelink = "/jobs/lineitems/"+ $(this).attr('data-href');
            $.ajax({
                url: deletelink,
                type: 'DELETE',
                success: function() {
                    populateMiscellaneousItems(selectedJob, taskidno);
                },
                error:  $.noop
            });
        }
        else
        {
            return false;
        }
    });

// edit labor
$(document).on('click', '.editlablistitem1, .editlablistitem3, .editlablistitem2, .editlablistitem4', function()
{
    var lineitemid =  $(this).attr('data-href');

   var tasktype =  $(this).attr('class').slice(-1);;

    $("#addlabbutton").html('edit');


    // get lineitem vals and populate
    jsRoutes.controllers.Jobs_rd.getsinglelineitem(lineitemid).ajax(
        {
            async: false,
            data: {
                id:lineitemid
            },
            success: function(dtli) {
                if (dtli != null)
                {
                    if (dtli.task.date != null)
                    {
                        var utcSeconds = dtli.task.date  /1000;
                        var dd = new Date(0);
                        dd.setUTCSeconds(utcSeconds);

                            $( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));

                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();


                        $("select#labvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#labquantity").val(dtli.quantity);
                        $("#labprice").val(dtli.rate);
                        $("#labtotal").val(dtli.saleprice);
                        $('#addlabbutton').attr('data-href', 'edit');
                        $('#addlabbutton').attr('data-item-id', lineitemid);


                        getvendoritems($(".labvendors option:selected" ).val() , selectedTaskType ,1);

                        setTimeout(function(){
                            $("select#labitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit mat
$(document).on('click', '.editmatlistitem1, .editmatlistitem3, .editmatlistitem2, .editmatlistitem4', function()
{
    var lineitemid =  $(this).attr('data-href');

    var tasktype =  $(this).attr('class').slice(-1);;



        $("#addmatbutton").html('edit');


    // get lineitem vals and populate
    jsRoutes.controllers.Jobs_rd.getsinglelineitem(lineitemid).ajax(
        {
            data: {
                id:lineitemid
            },
            success: function(dtli) {
                if (dtli != null)
                {
                    if (dtli.task.date != null)
                    {
                        var utcSeconds = dtli.task.date  /1000;
                        var dd = new Date(0);
                        dd.setUTCSeconds(utcSeconds);

                            $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }

                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();


                        $("select#matvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#matquantity").val(dtli.quantity);
                        $("#matprice").val(dtli.rate);
                        $("#mattotal").val(dtli.saleprice);
                        $('#addmatbutton').attr('data-href', 'edit');
                        $('#addmatbutton').attr('data-item-id', lineitemid);


                        getvendoritems($(".matvendors option:selected" ).val() , selectedTaskType ,2);

                        setTimeout(function(){
                            $("select#matitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit conc
$(document).on('click', '.editconlistitem1, .editconlistitem3, .editconlistitem2, .editconlistitem4', function()
{
    var lineitemid =  $(this).attr('data-href');

    var tasktype =  $(this).attr('class').slice(-1);;


    if (tasktype==1)
    {
        $("#addconbutton").html('edit');
    }
    if (tasktype==2)
    {
        $("#addconbutton2").html('edit');
    }
    if (tasktype==3)
    {
        $("#addconbutton3").html('edit');
    }
    // get lineitem vals and populate
    jsRoutes.controllers.Jobs_rd.getsinglelineitem(lineitemid).ajax(
        {
            data: {
                id:lineitemid
            },
            success: function(dtli) {
                if (dtli != null)
                {
                    if (dtli.task.date != null)
                    {
                        var utcSeconds = dtli.task.date  /1000;
                        var dd = new Date(0);
                        dd.setUTCSeconds(utcSeconds);
                         $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));

                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();


                        $("select#convendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#conquantity").val(dtli.quantity);
                        $("#conprice").val(dtli.rate);
                        $("#contotal").val(dtli.saleprice);
                        $('#addconbutton').attr('data-href', 'edit');
                        $('#addconbutton').attr('data-item-id', lineitemid);




                        getvendoritems($(".convendors option:selected" ).val() , selectedTaskType ,3);

                        setTimeout(function(){
                            $("select#conitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);


                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit land
$(document).on('click', '.editlandlistitem1, .editlandlistitem3, .editlandlistitem2, .editlandlistitem4', function()
{
    var lineitemid =  $(this).attr('data-href');

    var tasktype =  $(this).attr('class').slice(-1);;

    if (tasktype==1)
    {
        $("#addlandbutton").html('edit');
    }
    if (tasktype==2)
    {
        $("#addlandbutton2").html('edit');
    }
    if (tasktype==3)
    {
        $("#addlandbutton3").html('edit');
    }

    // get lineitem vals and populate
    jsRoutes.controllers.Jobs_rd.getsinglelineitem(lineitemid).ajax(
        {
            data: {
                id:lineitemid
            },
            success: function(dtli) {
                if (dtli != null)
                {
                    if (dtli.task.date != null)
                    {
                        var utcSeconds = dtli.task.date  /1000;
                        var dd = new Date(0);
                        dd.setUTCSeconds(utcSeconds);

                            $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));

                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();


                        $("select#landvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#landquantity").val(dtli.quantity);
                        $("#landprice").val(dtli.rate);
                        $("#landtotal").val(dtli.saleprice);
                        $('#addlandbutton').attr('data-href', 'edit');
                        $('#addlandbutton').attr('data-item-id', lineitemid);


                        getvendoritems($(".landvendors option:selected" ).val() , selectedTaskType ,4);

                        setTimeout(function(){
                            $("select#landitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit mis
$(document).on('click', '.editmislistitem1, .editmislistitem3, .editmislistitem2, .editmislistitem4', function()
{
    var lineitemid =  $(this).attr('data-href');

    var tasktype =  $(this).attr('class').slice(-1);;



        $("#addmisbutton").html('edit');



    // get lineitem vals and populate
    jsRoutes.controllers.Jobs_rd.getsinglelineitem(lineitemid).ajax(
        {
            data: {
                id:lineitemid
            },
            success: function(dtli) {
                if (dtli != null)
                {
                    if (dtli.task.date != null)
                    {
                        var utcSeconds = dtli.task.date  /1000;
                        var dd = new Date(0);
                        dd.setUTCSeconds(utcSeconds);

                            $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));

                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();


                        $("select#misvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#misquantity").val(dtli.quantity);
                        $("#misprice").val(dtli.rate);
                        $("#mistotal").val(dtli.saleprice);
                        $('#addmisbutton').attr('data-href', 'edit');
                        $('#addmisbutton').attr('data-item-id', lineitemid);


                        getvendoritems($(".misvendors option:selected" ).val() , selectedTaskType ,5);

                        setTimeout(function(){
                            $("select#misitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});



function populateMaterialsItems(jobid, taskidno){
    jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
        {
            data: {
                id:jobid,
                taskid: taskidno
            },
            success: function(datasubajliit) {

                    $('#materials > tbody').html("<tr></tr>");


                var htmltablerow = "";
                for (i = 0; i < datasubajliit.length; ++i) {


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 2 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);
                        if ( formatDate(dd) == $( "#labdatepicker").val())
                        {
                            htmltablerow += "<tr>";
                            htmltablerow += "<td class=\"deletematlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                            htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                       /*     htmltablerow += "<td class=\"editmatlistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                            htmltablerow +=    "</tr>"
                        }
                    }

                }

                    $('#materials > tbody:last').append(htmltablerow);

            },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );

}

function populateConcreteItems(jobid, taskidno){
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


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 3 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);
                        if ( formatDate(dd) == $( "#labdatepicker").val())
                        {
                            htmltablerow += "<tr>";
                            htmltablerow += "<td class=\"deleteconlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                            htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                     /*       htmltablerow += "<td class=\"editconlistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                            htmltablerow +=    "</tr>"
                        }
                    }

                }

                    $('#concrete > tbody:last').append(htmltablerow);

            },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );

    // zemi gi site sto se zapisani vo baza kako labor i popolni za sekoj od niv vakov red

    // na kraj dodaj go redot vo labor tabelata


}

function populateLandscapeItems(jobid, taskidno){
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


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null &&  datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 4 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);
                        if ( formatDate(dd) == $( "#labdatepicker").val())
                        {
                            htmltablerow += "<tr>";
                            htmltablerow += "<td class=\"deletelandlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                            htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                     /*       htmltablerow += "<td class=\"editlandlistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                            htmltablerow +=    "</tr>"
                        }
                    }

                }
                    $('#landscape > tbody:last').append(htmltablerow);

            },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );
}

function populateMiscellaneousItems(jobid,taskidno ){
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


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 5 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        if ( formatDate(dd) == $( "#labdatepicker").val())
                        {
                            htmltablerow += "<tr>";
                            htmltablerow += "<td class=\"deletemislistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                            htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";

                                htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                            htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
               /*             htmltablerow += "<td class=\"editmislistitem"+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                            htmltablerow +=    "</tr>"
                        }
                    }

                }

                    $('#miscellaneous > tbody:last').append(htmltablerow);

            },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );

    // zemi gi site sto se zapisani vo baza kako labor i popolni za sekoj od niv vakov red

    // na kraj dodaj go redot vo labor tabelata


}


    function populatelaborlineitemsdropdown(jobid, taskidno ){
        // treba da se popolnat lineitemi za labor za toj covek vo dropdown so value ednakvo na linetiemid ovie prvo  lablineitemsperuser
        // jobid
        /* taskid
         task_tupe_id = null
         item_type_id = 1
         datum*/

        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitemsLaborUser(jobid).ajax(
            {
                data: {
                    id:jobid,
                    taskid: taskidno
                },
                success: function(datasubajliit) {
                    if(datasubajliit.length>0)
                    {
                        selektiranprvpat = datasubajliit[0].id;
                    }
                    var options = $("#lablineitemsperuser");
                    for (var m = 0; m < datasubajliit.length; m++) {
                        if (datasubajliit[m].vendor!=null)
                        {
                        options.append($("<option />").val(datasubajliit[m].id).text(" vendor: " + datasubajliit[m].vendor.name + " - item: " + datasubajliit[m].item.name));
                        }
                        else
                        {
                            options.append($("<option />").val(datasubajliit[m].id).text(" vendor: NA - item: " + datasubajliit[m].item.name));
                        }
                    }

                    populateLaborItems(selectedJob, taskidno , selektiranprvpat);
                    /*
                    $.each(datasubajliit, function() {
                        options.append($("<option />").val(datasubajliit.id).text(" vendor: " + datasubajliit.vendor.name + " - item: " + datasubajliit.item.name));
                    });*/
                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );
    };




    function populateLaborItems(jobid, taskidno, lineitemid){

       // $('#labor > tbody:last').append("");

        $("#labor > tbody").find("tr:gt(0)").remove();

        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitemsLaborPerLineitemORG(jobid).ajax(
            {
                data: {
                    id:jobid,
                    taskid: taskidno,
                    lineitemORG: lineitemid
                },
                success: function(datasubajliit) {

                    $('#labor > tbody').html("<tr></tr>");
                    var editlink = "";
                    var dellink = "";
                    var htmltablerow = "";
                    editlink = "editlablistitem";
                    dellink = "deletelablistitem";

                        for (i = 0; i < datasubajliit.length; ++i) {
                            if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].vendor != null && datasubajliit[i].taskType.id == selectedTaskType  && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 1 )
                            {
                                var utcSeconds = datasubajliit[i].daysdate /1000;
                                var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                dd.setUTCSeconds(utcSeconds);

                                /*if ( formatDate(dd) == $( "#labdatepicker").val())
                                {*/
                                    htmltablerow += "<tr>";
                                    htmltablerow += "<td class=\""+dellink+"\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                                    htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                    /*  htmltablerow += "<td class=\""+editlink+""+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                    htmltablerow +=    "</tr>"
                                /*}*/
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



    function populateAllItems(jobid, taskidno ){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
            {
                data: {
                    id:jobid,
                    taskid: taskidno
                },
                success: function(datasubajliit) {

                    $('#labor > tbody').html("<tr></tr>");
                    $('#materials > tbody').html("<tr></tr>");
                    $('#concrete > tbody').html("<tr></tr>");
                    $('#landscape > tbody').html("<tr></tr>");
                    $('#miscellaneous > tbody').html("<tr></tr>");

                    for (j = 1; j < 6; j++) {
                        var editlink = "";
                        var dellink = "";
                        var htmltablerow = "";
                        switch (j) {
                            case 1:
                                editlink = "editlablistitem";
                                dellink = "deletelablistitem";
                                break;
                            case 2:
                                editlink = "editmatlistitem";
                                dellink = "deletematlistitem";
                                break;
                            case 3:
                                editlink = "editconlistitem";
                                dellink = "deleteconlistitem";
                                break;
                            case 4:
                                editlink = "editlandlistitem";
                                dellink = "deletelandlistitem";
                                break;
                            case 5:
                                editlink = "editmislistitem";
                                dellink = "deletemislistitem";
                                break;
                        }



                        for (i = 0; i < datasubajliit.length; ++i) {
                            if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].taskType.id == selectedTaskType && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == j )
                            {
                                var utcSeconds = datasubajliit[i].task.date /1000;
                                var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                dd.setUTCSeconds(utcSeconds);

                                if ( formatDate(dd) == $( "#labdatepicker").val())
                                {
                                    htmltablerow += "<tr>";
                                    htmltablerow += "<td class=\""+dellink+"\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                                    htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                    htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                    /*  htmltablerow += "<td class=\""+editlink+""+ selectedTaskType +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";*/
                                    htmltablerow +=    "</tr>"
                                }
                            }

                        }

                        switch (j) {
                            case 1:
                                // $('#labor > tbody:last').append(htmltablerow);

                                break;
                            case 2:

                                $('#materials > tbody:last').append(htmltablerow);

                                break;
                            case 3:

                                $('#concrete > tbody:last').append(htmltablerow);

                                break;
                            case 4:

                                $('#landscape > tbody:last').append(htmltablerow);

                                break;
                            case 5:
                                $('#miscellaneous > tbody:last').append(htmltablerow);
                                break;
                        }

                    }

                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );
    }


function getlineitemsid(abc, taskidto) {
    jsRoutes.controllers.Jobs_rd.getselectedJoblineitems(abc).ajax(
        {

            data: {
                id:abc,
                taskid:taskidto
            },
            success: function(datalist) {


                var datalines;
                var percentages;

                var task1percpropose = [];
                var task2percpropose = [];
                var task3percpropose = [];
                var itemtypepropose = [];
                var lineitemspropose=[];
                var vendornamepropose=[];
                var vendoridpropose=[];
                var itemnamespropose=[];
                var itemidpropose=[];
                var quantitypropose=[];
                var ratepropose=[];
                var totpropose=[];


                for (itemindex = 0; itemindex < datalist.length; itemindex++) {
                 {
                        jsRoutes.controllers.Jobs_rd.getsinglelineitem(datalist[itemindex]).ajax(
                            {
                                async: false,
                                data: {
                                    id:datalist[itemindex]
                                },
                                success: function(datalineitem) {
                                    datalines = datalineitem;
                                },
                                error: function(err) {
                                    return alert("There was an error reading lineitem details! Please refresh the page.");
                                }
                            }
                        );

                     var percentage = [0,0,0]

                     if (datalist[itemindex] != null && datalist[itemindex] != "")
                     {
                         jsRoutes.controllers.Jobs_rd.getsinglelineitempersentage(datalist[itemindex]).ajax(
                             {
                                 async: false,
                                 data: {
                                     id:datalist[itemindex]
                                 },
                                 success: function(datalineitempercentage) {
                                     if (datalineitempercentage.length > 0) {
                                     for (a = 0; a < datalineitempercentage.length; a++) {
                                         if (datalineitempercentage[a].taskType.id ==1){
                                             percentage[0]= datalineitempercentage[a].percentage;}
                                         if (datalineitempercentage[a].taskType.id ==2){
                                             percentage[1]= datalineitempercentage[a].percentage;}
                                         if (datalineitempercentage[a].taskType.id ==3){
                                             percentage[2]= datalineitempercentage[a].percentage;}
                                     }
                                     }
                                 },
                                 error: function(err) {
                                     return alert("There was an error reading lineitem percentage!  Please refresh the page.");
                                 }
                             }
                         );
                     }
                     var vendorname = "";
                     var vendorid = "";
                     var itemname = "";
                     var itemid = "";
                     if (datalines.vendor != null)
                     {
                        vendorname = datalines.vendor.name;
                        vendorid= datalines.vendor.id;
                     }

                     if (datalines.item != null)
                     {
                         itemname = datalines.item.name;
                         itemid= datalines.item.id;
                     }

                    /* var tempfdate = "";

                     if (datalines.task != null)
                     {
                         if (datalines.task.date != null)
                         {
                             var utcSeconds = datalines.task.date   /1000;
                             var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                             dd.setUTCSeconds(utcSeconds);
                             tempfdate =   formatDate(dd) ;
                         }
                     }
*/

                    if (vendorid !="" && itemid  != "")
                    {
                         itemtypepropose.push(datalines.itemType.id);
                         lineitemspropose.push(datalines.id);
                         vendoridpropose.push(vendorid);
                         vendornamepropose.push(vendorname + " t1:" + percentage[0]  + " t2:" + percentage[1]  + " t3:" + percentage[2] + " - " + datalines.itemType.name);
                         itemnamespropose.push(itemname);
                         itemidpropose.push(itemid);
                         quantitypropose.push(datalines.quantity);
                         ratepropose.push(datalines.rate);
                         totpropose.push(datalines.quantity * datalines.rate);
                         task1percpropose.push(percentage[0]);
                         task2percpropose.push(percentage[1]);
                         task3percpropose.push(percentage[2]);
                    }


                     // console.log(" lijneitemID: " + datalines.id + " " + " vendor: " + vendorname + " " + " vendor ID: " + vendorid + " " + " item: " + itemname + " " + " item ID: " + itemid + " " + datalines.itemType.name + " task1:" + percentage[0]  + " task2:" + percentage[1]  + " task3:" + percentage[2]);
                    }

                }

                // POPULATE PROPOSALS
                /*var htmltablerowlab = "";
                var htmltablerowmat = "";
                var htmltablerowcon = "";
                var htmltablerowland = "";
                var htmltablerowmis = "";


                $('#labproposal > tbody').html("<tr></tr>");
                $('#matproposal > tbody').html("<tr></tr>");
                $('#conproposal > tbody').html("<tr></tr>");
                $('#landproposal > tbody').html("<tr></tr>");
                $('#misproposal > tbody').html("<tr></tr>");

               for (j=0; j<vendoridpropose.length; j++)
               {
                   var tabletasskid = gettabletaskid(task1percpropose[j], task2percpropose[j], task3percpropose[j]);
                   switch (itemtypepropose[j]) {
                       case 1:
                           htmltablerowlab += "<tr>";
                           htmltablerowlab += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 350px;\"/></td>";
                           htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\" class=\"form-control\" readonly style=\"width: 200px;\"/></td>";
                           htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j]+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                           htmltablerowlab += "</tr>";


                           for (m=0; m<tabletasskid.length; m++)
                           {
                               var tabelname = "#labproposal"
                               if (m==0)
                               {
                                 tabelname = "#labproposal";
                               }
                               else
                               {
                                   tabelname = "#labproposal"+m+1;
                               }
                               if (tabletasskid[m] != 0)
                               {
                               $(tabelname + '> tbody:last').append(htmltablerowlab);
                               }
                           }
                           break;
                       case 2:
                           htmltablerowmat += "<tr>";
                           htmltablerowmat += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 350px;\"/></td>";
                           htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\" class=\"form-control\" readonly style=\"width: 200px;\"/></td>";
                           htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j]+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                           htmltablerowmat += "</tr>";

                           for (m=0; m<tabletasskid.length; m++)
                           {
                               var tabelname = "#matproposal"
                               if (m==0)
                               {
                                   tabelname = "#matproposal";
                               }
                               else
                               {
                                   tabelname = "#matproposal"+m+1;
                               }
                               if (tabletasskid[m] != 0)
                               {
                                $( tabelname + '> tbody:last').append(htmltablerowmat);
                               }
                           }
                           break;
                       case 3:
                           htmltablerowcon += "<tr>";
                           htmltablerowcon += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 350px;\"/></td>";
                           htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\" class=\"form-control\" readonly style=\"width: 200px;\"/></td>";
                           htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j]+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                           htmltablerowcon += "</tr>";


                           for (m=0; m<tabletasskid.length; m++)
                           {
                               var tabelname = "#conproposal"
                               if (m==0)
                               {
                                   tabelname = "#conproposal";
                               }
                               else
                               {
                                   tabelname = "#conproposal"+m+1;
                               }
                               if (tabletasskid[m] != 0)
                               {
                               $( tabelname + '> tbody:last').append(htmltablerowcon);
                               }
                           }
                           break;
                       case 4:
                           htmltablerowland += "<tr>";
                           htmltablerowland += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 350px;\"/></td>";
                           htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\" class=\"form-control\" readonly style=\"width: 200px;\"/></td>";
                           htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j]+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                           htmltablerowland += "</tr>";

                           for (m=0; m<tabletasskid.length; m++)
                           {
                               var tabelname = "#landproposal"
                               if (m==0)
                               {
                                   tabelname = "#landproposal";
                               }
                               else
                               {
                                   tabelname = "#landproposal"+m+1;
                               }
                               if (tabletasskid[m] != 0)
                               {
                               $( tabelname + '> tbody:last').append(htmltablerowland);
                               }
                           }
                           break;
                       case 5:
                           htmltablerowmis += "<tr>";
                           htmltablerowmis += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 350px;\"/></td>";
                           htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\" class=\"form-control\" readonly style=\"width: 200px;\"/></td>";
                           htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                           htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j]+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                           htmltablerowmis += "</tr>";
                           for (m=0; m<tabletasskid.length; m++)
                           {
                               var tabelname = "#misproposal"
                               if (m==0)
                               {
                                   tabelname = "#misproposal";
                               }
                               else
                               {
                                   tabelname = "#misproposal"+m+1;
                               }
                               if (tabletasskid[m] != 0)
                               {
                               $(tabelname + '> tbody:last').append(htmltablerowmis);
                               }
                           }
                           break;
                   }
               }*/
            },
            error: function(err) {
                return alert("There was an error reading job lineitems! Please refresh the page.");
            }
        }
    );
}






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
                    $('#labvendorselect2').empty().append(html);
                    $('#labvendorselect3').empty().append(html);
                }
                if (itemtype == 2)
                {
                    $('#matvendorselect').empty().append(html);
                    $('#matvendorselect2').empty().append(html);
                    $('#matvendorselect3').empty().append(html);
                }
                if (itemtype == 3)
                {
                    $('#convendorselect').empty().append(html);
                    $('#convendorselect2').empty().append(html);
                    $('#convendorselect3').empty().append(html);
                }
                if (itemtype == 4)
                {
                    $('#landvendorselect').empty().append(html);
                    $('#landvendorselect2').empty().append(html);
                    $('#landvendorselect3').empty().append(html);
                }
                if (itemtype == 5)
                {
                    $('#misvendorselect').empty().append(html);
                    $('#misvendorselect2').empty().append(html);
                    $('#misvendorselect3').empty().append(html);
                }

                if (itemtype == 6)
                {
                    $('#salvendorselect').empty().append(html);
                    $('#salvendorselect2').empty().append(html);
                    $('#salvendorselect3').empty().append(html);
                }
            },
            error: function (result) {
                alert('Some error occurred while retrieving vendor list. ');
            }
        });

    }





    function gettabletaskid(task1percent , task2percent , task3percent ){
        var difftabs = [];
        if (task1percent == 0 && task2percent == 0 && task3percent == 0)
        {
            difftabs.push(100);
            difftabs.push(0);
            difftabs.push(0);
        }
        else
        {
            difftabs.push(task1percent);
            difftabs.push(task2percent);
            difftabs.push(task3percent);
        }
         return difftabs;
    }

function someFunction(abc) {


    jsRoutes.controllers.Jobs_rd.getJobforActuals(abc).ajax(
        {

            data: {
                id:abc
            },
            success: function(datasub) {
                // popolni gi site drugi polinja
                selectedJob = abc;
                jobMarket = datasub.market.id;
                var tekstot =  "Job " + datasub.id  +  " "+ datasub.subdivision.customer.name+  " "+ datasub.subdivision.name +  " "+ datasub.lot;
                $('#jobDetails').empty().append(tekstot);

                var comment = datasub.notes;
                //$('#comment1text').empty().append(comment);
                $('#comment1text').val(comment);
            },
            error: function(err) {
                return alert("There was an error reading job details! Please refresh the page.");
            }
        });
}

function getvendoritems(vendorid, task, type){
        jsRoutes.controllers.Vendors_rd.getVendorActualItems(vendorid).ajax(
            {

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

});