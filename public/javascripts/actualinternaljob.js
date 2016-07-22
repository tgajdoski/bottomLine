
$( document ).ready(function() {

    var d = new Date();
    var jobMarket = 0;
    var selectedJob = 0;
    var taskidno = 0;


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

    $(document).on('click', '.addproposemat, .addproposelab, .addproposeland, .addproposemis, .addproposecon', function()
    {
    //    var vendorname = $($(this)).parents('tr').find('td:first-child').find('.form-control').val();
        var vendorid = $($(this)).parents('tr').find('td:first-child').find('.form-control').attr('data-href');

   //     var itemname = $($(this)).parents('tr').find('td:nth-child(2)').find('.form-control').val();
        var itemid = $($(this)).parents('tr').find('td:nth-child(2)').find('.form-control').attr('data-href');
        var itemtypeid = $($(this)).parents('tr').find('td:nth-child(2)').find('.form-control').attr('data-href-itemtype');

        var quantity = $($(this)).parents('tr').find('td:nth-child(3)').find('.form-control').val();
        var rate = $($(this)).parents('tr').find('td:nth-child(4)').find('.form-control').val();
        var saleprice = $($(this)).parents('tr').find('td:nth-child(5)').find('.form-control').val();

        var tasktypeid = $(this).attr('data-href');
        var date = $(this).attr('data-item-date');

        var redot = $($(this)).parents('tr');



        if (vendorid != "" && itemid != "" && itemtypeid != "" && quantity != "" && rate != "" && saleprice !="" && tasktypeid != "" && date != "")
        {
            $.ajax({
                async: false,
                type: 'POST',
                url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype="+tasktypeid+"&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtypeid+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
                success: function() {
                    redot.hide();
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
            populateAllItems(selectedJob, taskidno);
        }
    });


    $('#comment1text').focus(function() {
        $(this).val('');
    });

    $('#comment2text').focus(function() {
        $(this).val('');
    });
    $('#comment3text').focus(function() {
        $(this).val('');
    });



$(document).on('click', '#commentbutton1', function()
{
    sercomment($('#comment1text').val());
});

$(document).on('click', ' #commentbutton2', function()
{
    sercomment($('#comment2text').val());
});

$(document).on('click', ' #commentbutton3', function()
{
    sercomment($('#comment3text').val());
});


function sercomment (comment)
{
    /*if (selectedJob != ""){
    jsRoutes.controllers.Jobs_rd.updateJob(selectedJob).ajax(
        {
            data: {
                id:selectedJob,
                notes: comment
            },
            success: function() {
                $('#comment2text').val(comment);
                $('#comment3text').val(comment);
                $('#comment1text').val(comment);
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
}*/
    if (selectedJob != ""){
        jsRoutes.controllers.Jobs_rd.appendCommentJob(selectedJob).ajax(
            {
                data: {
                    id:selectedJob,
                    notes: comment
                },
                success: function() {
                    $('#comment1text').val(comment);
                    $('#comment3text').val(comment);
                    $('#comment2text').val(comment);
                    var n = noty({type: 'success', text: 'comment was added. select the job again to refresh the comments.',  timeout: 3000});
                },
                error: function (result) {
                    alert('Some error occurred while retrieving job task list. ');
                }
            });
    }
}



$(document).on('click', '.openJob', function()
{
    ajaxindicatorstart('loading job data, preparing and populating lineitem entries... please wait..');


   var  taskidtype = $($(this)).parents('li').find('.openTask').attr('data-href');
    $( "#tabs" ).tabs( "option", "active",taskidtype-1 );
    taskidno = $($(this)).parents('li').attr('data-task-id');
   // $('.assignTask').hide();
    $('#assignTask').hide();

    $($(this)).parents('li').find('.assignTask').css('display', 'inline');




    someFunction( $(this).attr('data-href'));

    getlineitemsid( $(this).attr('data-href'), taskidno);

    populateAllItems($(this).attr('data-href'), taskidno);




    ajaxindicatorstop();

    window.scrollTo(0, 0);
});



    $(".close").click(function() {
        $('#assigntask').hide();
    });

    $("#close").click(function() {
        $('#assigntask').hide();
    });









    $(document).on('click', '#buttonassign', function()
    {
        var jobid =  $("#selectedJobtext" ).val();
        var taskid =  $("#selectedTasktext" ).val();
        var datetask =  $("#selectedTaskdate" ).val();

        var fieldid =  $("#fieldManagers option:selected" ).val();

        var addoredit = $('#addedit').val();

        if(addoredit == 0)
        {
            $.ajax({
                async: false,
                type: 'POST',
                url: '/admin/actualjobs/assigns?jobid='+jobid+'&taskid='+ taskid + '&datetask='+datetask+'&fieldid='+fieldid,
                success: function(datana) {
                    var n = noty({type: 'success', text: 'date-task was assigned to ' + $("#fieldManagers option:selected" ).text(),  timeout: 3000});
                   /* $('.assignTask').html(datana);*/
                    $('.assignTask[data-href-date='+datetask+'][data-href='+taskid+']').html(datana);
                    $('#assigntask').hide();
                },
                error: function (result) {
                    alert('Some error occurred while assigning the date task.');
                }
            });
        }
        else
        {
            $.ajax({
                async: false,
                type: 'POST',
                url: '/admin/actualjobs/editassigns?jobid='+jobid+'&taskid='+ taskid + '&datetask='+datetask+'&fieldid='+fieldid+'&id='+addoredit,
                success: function(datana) {
                    var n = noty({type: 'success', text: 'date-task was reassigned to ' + $("#fieldManagers option:selected" ).text(),  timeout: 3000});

                    $('.assignedTask[data-href-date='+datetask+'][data-href='+taskid+']').html(datana);
                    $('#assigntask').hide();
                },
                error: function (result) {
                    alert('Some error occurred while assigning the date task.');
                }
            });
        }

    });



    $(document).on('click', '.assignedTask', function()
    {
        $('#assigntask').show();


        var tasktypeon = $($(this)).parents('li').find('.assignedTask').attr('data-href-mref');
        taskidno = $($(this)).parents('li').find('.assignedTask').attr('data-href');

        var taskdateon = $($(this)).parents('li').find('.assignedTask').attr('data-href-date');
        var dateon = new Date(taskdateon);
        var jobidno = $($(this)).parents('li').find('.openJob').attr('data-href');
        $('#selectedJobtext').text("selected job: " + jobidno);
        $('#selectedTasktext').text("selected task: " +taskidno);
        $('#selectedTaskdate').text("selected date: " + formatDateShow(dateon));

        $('#selectedJobtext').val(jobidno);
        $('#selectedTasktext').val(taskidno);
        $('#selectedTaskdate').val(formatDate(dateon));


        $('#addedit').val(taskidno);

    });

    $(document).on('click', '.assignTask', function()
    {
       // show popup

        window.scrollTo(0, 0);
        $('#assigntask').show();


        var tasktypeon = $($(this)).parents('li').find('.assignTask').attr('data-href-mref');
        var taskidno = $($(this)).parents('li').find('.assignTask').attr('data-href');
        var taskdateon = $($(this)).parents('li').find('.assignTask').attr('data-href-date');
        var dateon = new Date(taskdateon);
        var jobidno = $($(this)).parents('li').find('.openJob').attr('data-href');
        $('#selectedJobtext').text("selected job: " + jobidno);
        $('#selectedTasktext').text("selected task: " +taskidno);
        $('#selectedTaskdate').text("selected date: " + formatDateShow(dateon));

        $('#selectedJobtext').val(jobidno);
        $('#selectedTasktext').val(taskidno);
        $('#selectedTaskdate').val(formatDate(dateon));


        $('#addedit').val(0);
        // da se popolnat dropdown za datumi na taskot i za fieldmanagers

        // taskDates : dates za taskot

        // da se zemat site fieldmanagers

    });




/*
function getMonday(d) {
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 1 ? -6 : 1);
    return new Date(d.setDate(diff));
}*/
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
         var date= $('#labdatepicker').val() + " 12:00:00.0";

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=1&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearlabinserts()}, 450);
        populateLaborItems(selectedJob, 1, taskidno);

    }
});
$(document).on('click', '#addlabbutton2', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#labdatepicker2').val() !=""  && $("#labvendorselect2 option:selected").text() !=""  && $("#labitemselect2 option:selected").text()  !=""  &&  $('#labquantity2').val() !=""  &&  $('#labprice2').val() !=""  &&  $('#labtotal2').val() !="" )
    {
        var vendorid =  $(".labvendors2 option:selected" ).val();
        var itemid =     $(".labitems2 option:selected" ).val();
        var itemtype = 1; // labor
        var quantity =  $('#labquantity2').val() ;
        var rate =  $('#labprice2').val();
        var saleprice =   $('#labtotal2').val();
        var date= $('#labdatepicker2').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=2&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearlab2inserts()}, 450);
        populateLaborItems(selectedJob, 2, taskidno);
    }
});
$(document).on('click', '#addlabbutton3', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#labdatepicker3').val() !=""  && $("#labvendorselect3 option:selected").text() !=""  && $("#labitemselect3 option:selected").text()  !=""  &&  $('#labquantity3').val() !=""  &&  $('#labprice3').val() !=""  &&  $('#labtotal3').val() !="" )
    {

        var vendorid =  $(".labvendors3 option:selected" ).val();
        var itemid =     $(".labitems3 option:selected" ).val();
        var itemtype = 1; // labor
        var quantity =  $('#labquantity3').val() ;
        var rate =  $('#labprice3').val();
        var saleprice =   $('#labtotal3').val();
        var date= $('#labdatepicker3').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=3&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearlab3inserts()}, 450);
        populateLaborItems(selectedJob, 3, taskidno);
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
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=1&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        setTimeout(function(){clearmatinserts()}, 450);
        populateMaterialsItems(selectedJob, 1, taskidno);
    }
});
$(document).on('click', '#addmatbutton2', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#matdatepicker2').val() !=""  && $("#matvendorselect2 option:selected").text() !=""  && $("#matitemselect2 option:selected").text()  !=""  &&  $('#matquantity2').val() !=""  &&  $('#matprice2').val() !=""  &&  $('#mattotal2').val() !="" )
    {
        // da se vidi dali ima takov datum vo taskovite
        var vendorid =  $(".matvendors2 option:selected" ).val();
        var itemid =     $(".matitems2 option:selected" ).val();
        var itemtype = 2; // material
        var quantity =  $('#matquantity2').val() ;
        var rate =  $('#matprice2').val();
        var saleprice =   $('#mattotal2').val();
        var date= $('#matdatepicker2').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=2&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearmat2inserts()}, 450);
        populateMaterialsItems(selectedJob, 2, taskidno);
    }
});
$(document).on('click', '#addmatbutton3', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#matdatepicker3').val() !=""  && $("#matvendorselect3 option:selected").text() !=""  && $("#matitemselect3 option:selected").text()  !=""  &&  $('#matquantity3').val() !=""  &&  $('#matprice3').val() !=""  &&  $('#mattotal3').val() !="" )
    {
        var vendorid =  $(".matvendors3 option:selected" ).val();
        var itemid =     $(".matitems3 option:selected" ).val();
        var itemtype = 2; // material
        var quantity =  $('#matquantity3').val() ;
        var rate =  $('#matprice3').val();
        var saleprice =   $('#mattotal3').val();
        var date= $('#matdatepicker3').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=3&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        //  populateAllItems(selectedJob);
        setTimeout(function(){clearmat3inserts()}, 450);
        populateMaterialsItems(selectedJob, 3, taskidno);
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
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=1&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        //  populateAllItems(selectedJob);
        setTimeout(function(){clearconinserts()}, 450);
        populateConcreteItems(selectedJob, 1, taskidno);
    }
});
$(document).on('click', '#addconbutton2', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#condatepicker2').val() !=""  && $("#convendorselect2 option:selected").text() !=""  && $("#conitemselect2 option:selected").text()  !=""  &&  $('#conquantity2').val() !=""  &&  $('#conprice2').val() !=""  &&  $('#contotal2').val() !="" )
    {
        var vendorid =  $(".convendors2 option:selected" ).val();
        var itemid =     $(".conitems2 option:selected" ).val();
        var itemtype = 3; // concrete
        var quantity =  $('#conquantity2').val() ;
        var rate =  $('#conprice2').val();
        var saleprice =   $('#contotal2').val();
        var date= $('#condatepicker2').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=2&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        //   populateAllItems(selectedJob);
        setTimeout(function(){clearcon2inserts()}, 450);
        populateConcreteItems(selectedJob, 2, taskidno);


    }
});
$(document).on('click', '#addconbutton3', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#condatepicker3').val() !=""  && $("#convendorselect3 option:selected").text() !=""  && $("#conitemselect3 option:selected").text()  !=""  &&  $('#conquantity3').val() !=""  &&  $('#conprice3').val() !=""  &&  $('#contotal3').val() !="" )
    {
        var vendorid =  $(".convendors3 option:selected" ).val();
        var itemid =     $(".conitems3 option:selected" ).val();
        var itemtype = 3; // concrete
        var quantity =  $('#conquantity3').val() ;
        var rate =  $('#conprice3').val();
        var saleprice =   $('#contotal3').val();
        var date= $('#condatepicker3').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=3&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearcon3inserts()}, 450);
        populateConcreteItems(selectedJob, 3, taskidno);
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
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=1&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        //   populateAllItems(selectedJob);
        setTimeout(function(){clearlandinserts()}, 450);
        populateLandscapeItems(selectedJob, 1, taskidno);
    }
});
$(document).on('click', '#addlandbutton2', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#landdatepicker2').val() !=""  && $("#landvendorselect2 option:selected").text() !=""  && $("#landitemselect2 option:selected").text()  !=""  &&  $('#landquantity2').val() !=""  &&  $('#landprice2').val() !=""  &&  $('#landtotal2').val() !="" )
    {
        var vendorid =  $(".landvendors2 option:selected" ).val();
        var itemid =     $(".landitems2 option:selected" ).val();
        var itemtype = 4; // landscape
        var quantity =  $('#landquantity2').val() ;
        var rate =  $('#landprice2').val();
        var saleprice =   $('#landtotal2').val();
        var date= $('#landdatepicker2').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=2&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearland2inserts()}, 450);
        populateLandscapeItems(selectedJob, 2, taskidno);
    }
});
$(document).on('click', '#addlandbutton3', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#landdatepicker3').val() !=""  && $("#landvendorselect3 option:selected").text() !=""  && $("#landitemselect3 option:selected").text()  !=""  &&  $('#landquantity3').val() !=""  &&  $('#landprice3').val() !=""  &&  $('#landtotal3').val() !="" )
    {
        var vendorid =  $(".landvendors3 option:selected" ).val();
        var itemid =     $(".landitems3 option:selected" ).val();
        var itemtype = 4; // landscape
        var quantity =  $('#landquantity3').val() ;
        var rate =  $('#landprice3').val();
        var saleprice =   $('#landtotal3').val();
        var date= $('#landdatepicker3').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=3&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        //   populateAllItems(selectedJob);
        setTimeout(function(){clearland3inserts()}, 450);
        populateLandscapeItems(selectedJob, 3, taskidno);
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
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=1&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });
        setTimeout(function(){clearmisinserts()},450);
        populateMiscellaneousItems(selectedJob, 1, taskidno);
    }
});
$(document).on('click', '#addmisbutton2', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#misdatepicker2').val() !=""  && $("#misvendorselect2 option:selected").text() !=""  && $("#misitemselect2 option:selected").text()  !=""  &&  $('#misquantity2').val() !=""  &&  $('#misprice2').val() !=""  &&  $('#mistotal2').val() !="" )
    {
        var vendorid =  $(".misvendors2 option:selected" ).val();
        var itemid =     $(".misitems2 option:selected" ).val();
        var itemtype = 5; // miscellanious
        var quantity =  $('#misquantity2').val() ;
        var rate =  $('#misprice2').val();
        var saleprice =   $('#mistotal2').val();
        var date= $('#misdatepicker2').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=2&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        // populateAllItems(selectedJob);
        setTimeout(function(){clearmis2inserts()}, 450);
        populateMiscellaneousItems(selectedJob, 2, taskidno);
    }
});
$(document).on('click', '#addmisbutton3', function()
{
    // da se vidi dali se popolneti site polinja
    if ($('#misdatepicker3').val() !=""  && $("#misvendorselect3 option:selected").text() !=""  && $("#misitemselect3 option:selected").text()  !=""  &&  $('#misquantity3').val() !=""  &&  $('#misprice3').val() !=""  &&  $('#mistotal3').val() !="" )
    {
        var vendorid =  $(".misvendors3 option:selected" ).val();
        var itemid =     $(".misitems3 option:selected" ).val();
        var itemtype = 5; // miscellanious
        var quantity =  $('#misquantity3').val() ;
        var rate =  $('#misprice3').val();
        var saleprice =   $('#mistotal3').val();
        var date= $('#misdatepicker3').val();

        $.ajax({
            async: false,
            type: 'POST',
            url: '/jobs/lineitemsActual/addeditActual?jobid='+selectedJob+"&tasktype=3&vendor="+vendorid+"&item="+itemid+"&itemtype="+itemtype+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&date="+date+"&taskidno="+taskidno,
            success: function() {
            },
            error: function (result) {
                alert('Some error occurred while retrieving job task list. ');
            }
        });

        // populateAllItems(selectedJob);
        setTimeout(function(){clearmis3inserts()}, 450);
        populateMiscellaneousItems(selectedJob, 3, taskidno);
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

function clearlab2inserts(){

    $("#labvendorselect2")[0].selectedIndex = 0;
    $("#labitemselect2")[0].selectedIndex = 0;
    $("#labquantity2").val('');
    $("#labprice2").val('');
    $("#labtotal2").val('');
    $("#addlabbutton2").html('add');
}

function clearlab3inserts(){

    $("#labvendorselect3")[0].selectedIndex = 0;
    $("#labitemselect3")[0].selectedIndex = 0;
    $("#labquantity3").val('');
    $("#labprice3").val('');
    $("#labtotal3").val('');
    $("#addlabbutton3").html('add');
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

function clearmat2inserts(){

    $("#matvendorselect2")[0].selectedIndex = 0;
    $("#matitemselect2")[0].selectedIndex = 0;
    $("#matquantity2").val('');
    $("#matprice2").val('');
    $("#mattotal2").val('');
    $("#addmatbutton2").html('add');
}

function clearmat3inserts(){

    $("#matvendorselect3")[0].selectedIndex = 0;
    $("#matitemselect3")[0].selectedIndex = 0;
    $("#matquantity3").val('');
    $("#matprice3").val('');
    $("#mattotal3").val('');
    $("#addmatbutton3").html('add');
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

function clearcon2inserts(){

    $("#convendorselect2")[0].selectedIndex = 0;
    $("#conitemselect2")[0].selectedIndex = 0;
    $("#conquantity2").val('');
    $("#conprice2").val('');
    $("#contotal2").val('');
    $("#addconbutton2").html('add');
}

function clearcon3inserts(){

    $("#convendorselect3")[0].selectedIndex = 0;
    $("#conitemselect3")[0].selectedIndex = 0;
    $("#conquantity3").val('');
    $("#conprice3").val('');
    $("#contotal3").val('');
    $("#addconbutton3").html('add');
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

function clearland2inserts(){

    $("#landvendorselect2")[0].selectedIndex = 0;
    $("#landitemselect2")[0].selectedIndex = 0;
    $("#landquantity2").val('');
    $("#landprice2").val('');
    $("#landtotal2").val('');
    $("#addlandbutton2").html('add');
}

function clearland3inserts(){

    $("#landvendorselect3")[0].selectedIndex = 0;
    $("#landitemselect3")[0].selectedIndex = 0;
    $("#landquantity3").val('');
    $("#landprice3").val('');
    $("#landtotal3").val('');
    $("#addlandbutton3").html('add');
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

function clearmis2inserts(){

    $("#misvendorselect2")[0].selectedIndex = 0;
    $("#misitemselect2")[0].selectedIndex = 0;
    $("#misquantity2").val('');
    $("#misprice2").val('');
    $("#mistotal2").val('');
    $("#addmisbutton2").html('add');
}

function clearmis3inserts(){

    $("#misvendorselect3")[0].selectedIndex = 0;
    $("#misitemselect3")[0].selectedIndex = 0;
    $("#misquantity3").val('');
    $("#misprice3").val('');
    $("#mistotal3").val('');
    $("#addmisbutton3").html('add');
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

            populateLaborItems(selectedJob, taskType, taskidno);
            populateMaterialsItems(selectedJob, taskType, taskidno);
            populateConcreteItems(selectedJob, taskType, taskidno);
            populateLandscapeItems(selectedJob, taskType, taskidno);
            populateMiscellaneousItems(selectedJob, taskType, taskidno);

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
                populateLaborItems(selectedJob, 1, taskidno);
                populateLaborItems(selectedJob, 2, taskidno);
                populateLaborItems(selectedJob, 3, taskidno);
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
                    populateMaterialsItems(selectedJob, 1, taskidno);
                    populateMaterialsItems(selectedJob, 2, taskidno);
                    populateMaterialsItems(selectedJob, 3, taskidno);
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
                    populateConcreteItems(selectedJob, 1, taskidno);
                    populateConcreteItems(selectedJob, 2, taskidno);
                    populateConcreteItems(selectedJob, 3, taskidno);
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
                    populateLandscapeItems(selectedJob, 1, taskidno);
                    populateLandscapeItems(selectedJob, 2, taskidno);
                    populateLandscapeItems(selectedJob, 3, taskidno);
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
                    populateMiscellaneousItems(selectedJob, 1, taskidno);
                    populateMiscellaneousItems(selectedJob, 2, taskidno);
                    populateMiscellaneousItems(selectedJob, 3, taskidno);
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
$(document).on('click', '.editlablistitem1, .editlablistitem3, .editlablistitem2', function()
{
    var lineitemid =  $(this).attr('data-href');

   var tasktype =  $(this).attr('class').slice(-1);;
    if (tasktype==1)
    {
    $("#addlabbutton").html('edit');
    }
    if (tasktype==2)
    {
        $("#addlabbutton2").html('edit');
    }
    if (tasktype==3)
    {
        $("#addlabbutton3").html('edit');
    }

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
                        if (tasktype==1)
                        {
                            $( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==2)
                        {
                            $( "#labdatepicker2").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==3)
                        {
                            $( "#labdatepicker3").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();

                    if (tasktype==1)
                    {
                        $("select#labvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#labquantity").val(dtli.quantity);
                        $("#labprice").val(dtli.rate);
                        $("#labtotal").val(dtli.saleprice);
                        $('#addlabbutton').attr('data-href', 'edit');
                        $('#addlabbutton').attr('data-item-id', lineitemid);

                    }

                    if (tasktype==2)
                    {
                        $("select#labvendorselect2 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#labquantity2").val(dtli.quantity);
                        $("#labprice2").val(dtli.rate);
                        $("#labtotal2").val(dtli.saleprice);
                        $('#addlabbutton2').attr('data-href', 'edit');
                        $('#addlabbutton2').attr('data-item-id', lineitemid);

                    }
                    if (tasktype==3)
                    {
                        $("select#labvendorselect3 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#labquantity3").val(dtli.quantity);
                        $("#labprice3").val(dtli.rate);
                        $("#labtotal3").val(dtli.saleprice);
                        $('#addlabbutton3').attr('data-href', 'edit');
                        $('#addlabbutton3').attr('data-item-id', lineitemid);

                    }



                 //  $.getScript("/assets/javascripts/actualinternaljobselectors.js", function(){
                    if (tasktype == 1){
                        getvendoritems($(".labvendors option:selected" ).val() , tasktype ,1);

                        setTimeout(function(){
                            $("select#labitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                    if (tasktype == 2){
                        getvendoritems($(".labvendors2 option:selected" ).val() , tasktype ,1);

                        setTimeout(function(){
                            $("select#labitemselect2 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                    if (tasktype == 3){
                        getvendoritems($(".labvendors3 option:selected" ).val() , tasktype ,1);

                        setTimeout(function(){
                            $("select#labitemselect3 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit mat
$(document).on('click', '.editmatlistitem1, .editmatlistitem3, .editmatlistitem2', function()
{
    var lineitemid =  $(this).attr('data-href');

    var tasktype =  $(this).attr('class').slice(-1);;


    if (tasktype==1)
    {
        $("#addmatbutton").html('edit');
    }
    if (tasktype==2)
    {
        $("#addmatbutton2").html('edit');
    }
    if (tasktype==3)
    {
        $("#addmatbutton3").html('edit');
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
                        if (tasktype==1)
                        {
                            $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==2)
                        {
                            $( "#matdatepicker2").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==3)
                        {
                            $( "#matdatepicker3").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();

                    if (tasktype==1)
                    {
                        $("select#matvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#matquantity").val(dtli.quantity);
                        $("#matprice").val(dtli.rate);
                        $("#mattotal").val(dtli.saleprice);
                        $('#addmatbutton').attr('data-href', 'edit');
                        $('#addmatbutton').attr('data-item-id', lineitemid);
                    }

                    if (tasktype==2)
                    {
                        $("select#matvendorselect2 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#matquantity2").val(dtli.quantity);
                        $("#matprice2").val(dtli.rate);
                        $("#mattotal2").val(dtli.saleprice);
                        $('#addmatbutton2').attr('data-href', 'edit');
                        $('#addmatbutton2').attr('data-item-id', lineitemid);

                    }
                    if (tasktype==3)
                    {
                        $("select#matvendorselect3 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#matquantity3").val(dtli.quantity);
                        $("#matprice3").val(dtli.rate);
                        $("#mattotal3").val(dtli.saleprice);
                        $('#addmatbutton3').attr('data-href', 'edit');
                        $('#addmatbutton3').attr('data-item-id', lineitemid);

                    }

       //

                    //  $.getScript("/assets/javascripts/actualinternaljobselectors.js", function(){

                    if (tasktype == 1){
                        getvendoritems($(".matvendors option:selected" ).val() , tasktype ,2);

                        setTimeout(function(){
                            $("select#matitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 2){
                        getvendoritems($(".matvendors2 option:selected" ).val() , tasktype ,2);


                        setTimeout(function(){
                            $("select#matitemselect2 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 3){
                        getvendoritems($(".matvendors3 option:selected" ).val() , tasktype ,2);

                        setTimeout(function(){
                            $("select#matitemselect3 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit conc
$(document).on('click', '.editconlistitem1, .editconlistitem3, .editconlistitem2', function()
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
                        if (tasktype==1)
                        {
                            $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==2)
                        {
                            $( "#condatepicker2").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==3)
                        {
                            $( "#condatepicker3").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();

                    if (tasktype==1)
                    {
                        $("select#convendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#conquantity").val(dtli.quantity);
                        $("#conprice").val(dtli.rate);
                        $("#contotal").val(dtli.saleprice);
                        $('#addconbutton').attr('data-href', 'edit');
                        $('#addconbutton').attr('data-item-id', lineitemid);

                    }

                    if (tasktype==2)
                    {
                        $("select#convendorselect2 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#conquantity2").val(dtli.quantity);
                        $("#conprice2").val(dtli.rate);
                        $("#contotal2").val(dtli.saleprice);
                        $('#addconbutton2').attr('data-href', 'edit');
                        $('#addconbutton2').attr('data-item-id', lineitemid);

                    }
                    if (tasktype==3)
                    {
                        $("select#convendorselect3 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#conquantity3").val(dtli.quantity);
                        $("#conprice3").val(dtli.rate);
                        $("#contotal3").val(dtli.saleprice);
                        $('#addconbutton3').attr('data-href', 'edit');
                        $('#addconbutton3').attr('data-item-id', lineitemid);

                    }

                  //  $("#").val(vendor);

                    //  $.getScript("/assets/javascripts/actualinternaljobselectors.js", function(){

                    if (tasktype == 1){
                        getvendoritems($(".convendors option:selected" ).val() , tasktype ,3);

                        setTimeout(function(){
                            $("select#conitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 2){
                        getvendoritems($(".convendors2 option:selected" ).val() , tasktype ,3);


                        setTimeout(function(){
                            $("select#conitemselect2 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 3){
                        getvendoritems($(".convendors3 option:selected" ).val() , tasktype ,3);

                        setTimeout(function(){
                            $("select#conitemselect3 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit land
$(document).on('click', '.editlandlistitem1, .editlandlistitem3, .editlandlistitem2', function()
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
                        if (tasktype==1)
                        {
                            $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==2)
                        {
                            $( "#landdatepicker2").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==3)
                        {
                            $( "#landdatepicker3").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();

                    if (tasktype==1)
                    {
                        $("select#landvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#landquantity").val(dtli.quantity);
                        $("#landprice").val(dtli.rate);
                        $("#landtotal").val(dtli.saleprice);
                        $('#addlandbutton').attr('data-href', 'edit');
                        $('#addlandbutton').attr('data-item-id', lineitemid);

                    }

                    if (tasktype==2)
                    {
                        $("select#landvendorselect2 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#landquantity2").val(dtli.quantity);
                        $("#landprice2").val(dtli.rate);
                        $("#landtotal2").val(dtli.saleprice);
                        $('#addlandbutton2').attr('data-href', 'edit');
                        $('#addlandbutton2').attr('data-item-id', lineitemid);

                    }
                    if (tasktype==3)
                    {
                        $("select#landvendorselect3 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#landquantity3").val(dtli.quantity);
                        $("#landprice3").val(dtli.rate);
                        $("#landtotal3").val(dtli.saleprice);
                        $('#addlandbutton3').attr('data-href', 'edit');
                        $('#addlandbutton3').attr('data-item-id', lineitemid);

                    }

                    if (tasktype == 1){
                        getvendoritems($(".landvendors option:selected" ).val() , tasktype ,4);

                        setTimeout(function(){
                            $("select#landitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 2){
                        getvendoritems($(".landvendors2 option:selected" ).val() , tasktype ,4);


                        setTimeout(function(){
                            $("select#landitemselect2 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 3){
                        getvendoritems($(".landvendors3 option:selected" ).val() , tasktype ,4);

                        setTimeout(function(){
                            $("select#landitemselect3 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});

// edit mis
$(document).on('click', '.editmislistitem1, .editmislistitem3, .editmislistitem2', function()
{
    var lineitemid =  $(this).attr('data-href');

    var tasktype =  $(this).attr('class').slice(-1);;


    if (tasktype==1)
    {
        $("#addmisbutton").html('edit');
    }
    if (tasktype==2)
    {
        $("#addmisbutton2").html('edit');
    }
    if (tasktype==3)
    {
        $("#addmisbutton3").html('edit');
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
                        if (tasktype==1)
                        {
                            $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==2)
                        {
                            $( "#misdatepicker2").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                        if (tasktype==3)
                        {
                            $( "#misdatepicker3").val($.datepicker.formatDate('yy-mm-dd', dd));
                        }
                    }
                    var vendor = dtli.vendor.name.trim();
                    var item = dtli.item.name.trim();

                    if (tasktype==1)
                    {
                        $("select#misvendorselect option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#misquantity").val(dtli.quantity);
                        $("#misprice").val(dtli.rate);
                        $("#mistotal").val(dtli.saleprice);
                        $('#addmisbutton').attr('data-href', 'edit');
                        $('#addmisbutton').attr('data-item-id', lineitemid);

                    }

                    if (tasktype==2)
                    {
                        $("select#misvendorselect2 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#misquantity2").val(dtli.quantity);
                        $("#misprice2").val(dtli.rate);
                        $("#mistotal2").val(dtli.saleprice);
                        $('#addmisbutton2').attr('data-href', 'edit');
                        $('#addmisbutton2').attr('data-item-id', lineitemid);

                    }
                    if (tasktype==3)
                    {
                        $("select#misvendorselect3 option")
                            .each(function() { this.selected = (this.text == vendor); });
                        $("#misquantity3").val(dtli.quantity);
                        $("#misprice3").val(dtli.rate);
                        $("#mistotal3").val(dtli.saleprice);
                        $('#addmisbutton3').attr('data-href', 'edit');
                        $('#addmisbutton3').attr('data-item-id', lineitemid);

                    }

                  //  $("#").val(vendor);

                    //  $.getScript("/assets/javascripts/actualinternaljobselectors.js", function(){

                    if (tasktype == 1){
                        getvendoritems($(".misvendors option:selected" ).val() , tasktype ,5);

                        setTimeout(function(){
                            $("select#misitemselect option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 2){
                        getvendoritems($(".misvendors2 option:selected" ).val() , tasktype ,5);


                        setTimeout(function(){
                            $("select#misitemselect2 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);

                    }
                    if (tasktype == 3){
                        getvendoritems($(".misvendors3 option:selected" ).val() , tasktype ,5);

                        setTimeout(function(){
                            $("select#misitemselect3 option").each(function() {
                                this.selected = (this.text == item); });
                        }, 350);
                    }
                }
            },
            error: function(err) {
                return alert("There was an error reading lineitem details! Please refresh the page.");
            }
        }
    );

});



function populateLaborItems(jobid, tasktype, taskid){
    jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
        {

            data: {
                id:jobid,
                taskid: taskid
            },
            success: function(datasubajliit) {
                if (tasktype == 1)
                {
                    $('#labor > tbody').html("<tr></tr>");
                }
                if (tasktype == 2)
                {
                    $('#labor2 > tbody').html("<tr></tr>");
                }
                if (tasktype == 3)
                {
                    $('#labor3 > tbody').html("<tr></tr>");
                }

                var htmltablerow = "";
                for (i = 0; i < datasubajliit.length; ++i) {

                    if (datasubajliit[i].id != "" && datasubajliit[i].taskType.id == tasktype  && datasubajliit[i].task != null && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 1 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);
                        htmltablerow += "<tr>";
                        htmltablerow += "<td class=\"deletelablistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                        htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                        htmltablerow += "<td class=\"editlablistitem"+ tasktype +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";
                        htmltablerow +=    "</tr>"
                    }

                }
                    if (tasktype == 1)
                    {
                     //   setTimeout(function(){$('#labor > tbody:last').append(htmltablerow)}, 450);
                        $('#labor > tbody:last').append(htmltablerow);
                    }
                    else if (tasktype == 2)
                    {
                     //   setTimeout(function(){$('#labor2 > tbody:last').append(htmltablerow)}, 450);
                       $('#labor2 > tbody:last').append(htmltablerow);
                    }
                    else if (tasktype == 3)
                    {
                      //  setTimeout(function(){$('#labor > tbody:last').append(htmltablerow)}, 450);
                        $('#labor3 > tbody:last').append(htmltablerow);
                    }
               },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );
}

function populateMaterialsItems(jobid, tasktype, taskid){
    jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
        {
            data: {
                id:jobid,
                taskid: taskid
            },
            success: function(datasubajliit) {
                if (tasktype == 1)
                {
                    $('#materials > tbody').html("<tr></tr>");
                }
                if (tasktype == 2)
                {
                    $('#materials2 > tbody').html("<tr></tr>");
                }
                if (tasktype == 3)
                {
                    $('#materials3 > tbody').html("<tr></tr>");
                }


                var htmltablerow = "";
                for (i = 0; i < datasubajliit.length; ++i) {


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].taskType.id == tasktype && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 2 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);

                        htmltablerow += "<tr>";
                        htmltablerow += "<td class=\"deletematlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                        htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                        htmltablerow += "<td class=\"editmatlistitem"+ tasktype +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";
                        htmltablerow +=    "</tr>"
                    }

                }
                if (tasktype == 1)
                {
                    $('#materials > tbody:last').append(htmltablerow);
                }
                else if (tasktype == 2)
                {
                    $('#materials2 > tbody:last').append(htmltablerow);
                }
                else if (tasktype == 3)
                {
                    $('#materials3 > tbody:last').append(htmltablerow);
                }
            },
            error: function(err) {
                return alert("There was an error reading the vendor item price information!.");
            }
        }
    );

}

function populateConcreteItems(jobid, tasktype, taskid){
    jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
        {

            data: {
                id:jobid,
                taskid: taskid
            },
            success: function(datasubajliit) {
                if (tasktype == 1)
                {
                $('#concrete > tbody').html("<tr></tr>");
                }
                if (tasktype == 2)
                {
                    $('#concrete2 > tbody').html("<tr></tr>");
                }
                if (tasktype == 3)
                {
                    $('#concrete3 > tbody').html("<tr></tr>");
                }

                var htmltablerow = "";
                for (i = 0; i < datasubajliit.length; ++i) {


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].taskType.id == tasktype && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 3 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);

                        htmltablerow += "<tr>";
                        htmltablerow += "<td class=\"deleteconlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                        htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                        htmltablerow += "<td class=\"editconlistitem"+ tasktype +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";
                        htmltablerow +=    "</tr>"
                    }

                }
                if (tasktype == 1)
                {
                    $('#concrete > tbody:last').append(htmltablerow);
                }
                if (tasktype == 2)
                {
                    $('#concrete2 > tbody:last').append(htmltablerow);
                }
                if (tasktype == 3)
                {
                    $('#concrete3 > tbody:last').append(htmltablerow);
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

function populateLandscapeItems(jobid, tasktype, taskid){
    jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
        {

            data: {
                id:jobid,
                taskid:taskid
            },
            success: function(datasubajliit) {
                if (tasktype == 1)
                {
                    $('#landscape > tbody').html("<tr></tr>");
                }
                if (tasktype == 2)
                {
                    $('#landscape2 > tbody').html("<tr></tr>");
                }
                if (tasktype == 3)
                {
                    $('#landscape3 > tbody').html("<tr></tr>");
                }


                var htmltablerow = "";
                for (i = 0; i < datasubajliit.length; ++i) {


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].taskType.id == tasktype && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 4 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);

                        htmltablerow += "<tr>";
                        htmltablerow += "<td class=\"deletelandlistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                        htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                        htmltablerow += "<td class=\"editlandlistitem"+ tasktype +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";
                        htmltablerow +=    "</tr>"
                    }

                }
                if (tasktype == 1)
                {
                    $('#landscape > tbody:last').append(htmltablerow);
                }
                if (tasktype == 2)
                {
                    $('#landscape2 > tbody:last').append(htmltablerow);
                }
                if (tasktype == 3)
                {
                    $('#landscape3 > tbody:last').append(htmltablerow);
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

function populateMiscellaneousItems(jobid, tasktype, taskid){
    jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
        {

            data: {
                id:jobid,
                taskid: taskid
            },
            success: function(datasubajliit) {
                if (tasktype == 1)
                {
                    $('#miscellaneous > tbody').html("<tr></tr>");
                }
                if (tasktype == 2)
                {
                    $('#miscellaneous2 > tbody').html("<tr></tr>");
                }
                if (tasktype == 3)
                {
                    $('#miscellaneous3 > tbody').html("<tr></tr>");
                }


                var htmltablerow = "";
                for (i = 0; i < datasubajliit.length; ++i) {


                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].taskType.id == tasktype && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == 5 )
                    {
                        var utcSeconds = datasubajliit[i].task.date /1000;
                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        dd.setUTCSeconds(utcSeconds);

                        //   console.log(datasubajliit[i].id + " name " + datasubajliit[i].itemType.name  + " task " + datasubajliit[i].taskType.id  + " date " + dateform  + " vendorname " + datasubajliit[i].vendor.name + " item " + datasubajliit[i].item.name);

                        htmltablerow += "<tr>";
                        htmltablerow += "<td class=\"deletemislistitem\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                        htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                        htmltablerow += "<td class=\"editmislistitem"+ tasktype +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";
                        htmltablerow +=    "</tr>"
                    }

                }
                if (tasktype == 1)
                {
                    $('#miscellaneous > tbody:last').append(htmltablerow);
                }
                if (tasktype == 2)
                {
                    $('#miscellaneous2 > tbody:last').append(htmltablerow);
                }
                if (tasktype == 3)
                {
                    $('#miscellaneous3 > tbody:last').append(htmltablerow);
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




    function populateAllItems(jobid, taskid){
        jsRoutes.controllers.Jobs_rd.getselectedJobActuallineitems(jobid).ajax(
            {
                data: {
                    id:jobid,
                    taskid: taskid
                },
                success: function(datasubajliit) {
                    for (tasktype = 1; tasktype <4; tasktype++)
                    {
                       if (tasktype == 1)
                        {
                            $('#labor > tbody').html("<tr></tr>");
                            $('#materials > tbody').html("<tr></tr>");
                            $('#concrete > tbody').html("<tr></tr>");
                            $('#landscape > tbody').html("<tr></tr>");
                            $('#miscellaneous > tbody').html("<tr></tr>");
                        }
                        if (tasktype == 2)
                        {
                            $('#labor2 > tbody').html("<tr></tr>");
                            $('#materials2 > tbody').html("<tr></tr>");
                            $('#concrete2 > tbody').html("<tr></tr>");
                            $('#landscape2 > tbody').html("<tr></tr>");
                            $('#miscellaneous2 > tbody').html("<tr></tr>");;
                        }
                        if (tasktype == 3)
                        {
                            $('#labor3 > tbody').html("<tr></tr>");
                            $('#materials3 > tbody').html("<tr></tr>");
                            $('#concrete3 > tbody').html("<tr></tr>");
                            $('#landscape3 > tbody').html("<tr></tr>");
                            $('#miscellaneous3 > tbody').html("<tr></tr>");
                        }

                        var tskd1 = "";
                        var tskd2 = "";
                        var tskd3 = "";

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

                                    if (datasubajliit[i].id != "" && datasubajliit[i].task != null && datasubajliit[i].taskType.id == tasktype && datasubajliit[i].vendor != null && datasubajliit[i].item!=null && datasubajliit[i].itemType.id == j )
                                    {
                                        var utcSeconds = datasubajliit[i].task.date /1000;
                                        var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                        dd.setUTCSeconds(utcSeconds);

                                        if (datasubajliit[i].taskType.id ==1)
                                        {
                                            tskd1 = dd;
                                        }
                                        else if(datasubajliit[i].taskType.id ==2)
                                        {
                                            tskd2 = dd;
                                        }
                                        else if(datasubajliit[i].taskType.id ==3)
                                        {
                                            tskd3 = dd;
                                        }


                                        htmltablerow += "<tr>";
                                        htmltablerow += "<td class=\""+dellink+"\" data-href=\"" + datasubajliit[i].id+ "\">X</td>";
                                        htmltablerow += "<td><input type=\"text\" name=\"\" value=\""+ formatDate(dd)+"\" class=\"form-control\" readonly style=\"width: 80px;\"/></td>";
                                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].vendor.name+"\" class=\"form-control\" readonly style=\"width: 300px;\"/></td>";
                                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].item.name+"\" class=\"form-control\" readonly style=\"width: 135px;\"/></td>";
                                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                        htmltablerow +=    "<td><input type=\"text\" name=\"\" value=\""+datasubajliit[i].rate*datasubajliit[i].quantity+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                        htmltablerow += "<td class=\""+editlink+""+ tasktype +"\" data-href=\"" + datasubajliit[i].id+ "\">edit</td>";
                                        htmltablerow +=    "</tr>"
                                    }

                                }




                                switch (j) {
                                case 1:
                                    if (tasktype == 1)
                                    {
                                        $('#labor > tbody:last').append(htmltablerow);

                                    }
                                    if (tasktype == 2)
                                    {
                                        $('#labor2 > tbody:last').append(htmltablerow);

                                    }
                                    if (tasktype == 3)
                                    {
                                        $('#labor3 > tbody:last').append(htmltablerow);
                                    }
                                    break;
                                case 2:
                                    if (tasktype == 1)
                                    {
                                        $('#materials > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 2)
                                    {
                                        $('#materials2 > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 3)
                                    {
                                        $('#materials3 > tbody:last').append(htmltablerow);
                                    }
                                    break;
                                case 3:
                                    if (tasktype == 1)
                                    {
                                        $('#concrete > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 2)
                                    {
                                        $('#concrete2 > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 3)
                                    {
                                        $('#concrete3 > tbody:last').append(htmltablerow);
                                    }
                                    break;
                                case 4:
                                    if (tasktype == 1)
                                    {
                                        $('#landscape > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 2)
                                    {
                                        $('#landscape2 > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 3)
                                    {
                                        $('#landscape3 > tbody:last').append(htmltablerow);
                                    }
                                    break;
                                case 5:
                                    if (tasktype == 1)
                                    {
                                        $('#miscellaneous > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 2)
                                    {
                                        $('#miscellaneous2 > tbody:last').append(htmltablerow);
                                    }
                                    if (tasktype == 3)
                                    {
                                        $('#miscellaneous3 > tbody:last').append(htmltablerow);
                                    }
                                    break;
                                }

                            }
/*
                        if (tskd1!="")
                        {
                            $( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                            $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                            $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                            $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                            $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                        }
                        if (tskd2!="")
                        {
                            $( "#labdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                            $( "#matdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                            $( "#condatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                            $( "#landdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                            $( "#misdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                        }
                        if (tskd3!="")
                        {
                            $( "#labdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                            $( "#matdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                            $( "#condatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                            $( "#landdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                            $( "#misdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                        }*/


                    }
                },
                error: function(err) {
                    return alert("There was an error reading the vendor item price information!.");
                }
            }
        );
    }


function getlineitemsid(abc,taskidno ) {
    jsRoutes.controllers.Jobs_rd.getselectedJoblineitems(abc).ajax(
        {
            data: {
                id:abc
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


                    if (vendorid !="" && itemid  != "")
                    {
                         itemtypepropose.push(datalines.itemType.id);
                         lineitemspropose.push(datalines.id);
                         vendoridpropose.push(vendorid);
                         vendornamepropose.push(vendorname); // + " t1:" + percentage[0]  + " t2:" + percentage[1]  + " t3:" + percentage[2] + " - " + datalines.itemType.name);
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
                     // raboti super do tuka

                    }
                }

                $('#labproposal > tbody').html("<tr></tr>");
                $('#matproposal > tbody').html("<tr></tr>");
                $('#conproposal > tbody').html("<tr></tr>");
                $('#landproposal > tbody').html("<tr></tr>");
                $('#misproposal > tbody').html("<tr></tr>");

                $('#labproposal2 > tbody').html("<tr></tr>");
                $('#matproposal2 > tbody').html("<tr></tr>");
                $('#conproposal2 > tbody').html("<tr></tr>");
                $('#landproposal2 > tbody').html("<tr></tr>");
                $('#misproposal2 > tbody').html("<tr></tr>");

                $('#labproposal3 > tbody').html("<tr></tr>");
                $('#matproposal3 > tbody').html("<tr></tr>");
                $('#conproposal3 > tbody').html("<tr></tr>");
                $('#landproposal3 > tbody').html("<tr></tr>");
                $('#misproposal3 > tbody').html("<tr></tr>");

               for (j=0; j<vendoridpropose.length; j++)
               {
                   var htmltablerowlab = "";
                   var htmltablerowmat = "";
                   var htmltablerowcon = "";
                   var htmltablerowland = "";
                   var htmltablerowmis = "";

                   var tabletasskid = gettabletaskid(task1percpropose[j], task2percpropose[j], task3percpropose[j]);

                   for (tasktypeon = 1; tasktypeon<4; tasktypeon++)
                   {

                       if (task1percpropose[j] == 0 && task2percpropose[j] == 0 && task3percpropose[j] == 0)
                       {
                           task1percpropose[j] = 100;
                       }
                        switch (itemtypepropose[j]) {
                       case 1:
                           htmltablerowlab = "";
                           switch (tasktypeon){
                               case 1:

                                   htmltablerowlab += "<tr>";
                                   htmltablerowlab += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\" data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowlab +=    "<td><button type=\"button\" class = \"addproposelab\" data-href=\"1\" data-href-date=\""+$("#labdatepicker").val()+"\"  data-item-id=\"0\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowlab += "</tr>";
                               break;
                               case 2:
                                   htmltablerowlab += "<tr>";
                                   htmltablerowlab += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"   data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowlab +=    "<td><button type=\"button\" class = \"addproposelab\" data-href=\"2\" data-item-date=\""+$("#labdatepicker2").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowlab += "</tr>";
                                   break;
                               case 3:
                                   htmltablerowlab += "<tr>";
                                   htmltablerowlab += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"   data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowlab +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowlab +=    "<td><button type=\"button\" class = \"addproposelab\" data-href=\"3\" data-item-id=\"0\" data-item-date=\""+$("#labdatepicker3").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowlab += "</tr>";
                                   break;
                           }
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
                           htmltablerowmat = "";
                           switch (tasktypeon){
                               case 1:
                                    var datemat1 =
                                   htmltablerowmat += "<tr>";
                                   htmltablerowmat += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\"  class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowmat +=    "<td><button type=\"button\" class = \"addproposemat\" data-href=\"1\" data-item-id=\"0\" data-item-date=\""+$("#matdatepicker").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowmat += "</tr>";
                                   break;
                               case 2:
                                   htmltablerowmat += "<tr>";
                                   htmltablerowmat += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\"  class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowmat +=    "<td><button type=\"button\" class = \"addproposemat\" data-href=\"2\" data-item-id=\"0\" data-item-date=\""+$("#matdatepicker2").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowmat += "</tr>";
                                   break;
                               case 3:
                                   htmltablerowmat += "<tr>";
                                   htmltablerowmat += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"   data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmat +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowmat +=    "<td><button type=\"button\" class = \"addproposemat\" data-href=\"3\" data-item-id=\"0\" data-item-date=\""+$("#matdatepicker3").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowmat += "</tr>";
                                   break;
                           }

                          /* for (m=0; m<tabletasskid.length; m++)
                           {*/
                               var tabelname = "#matproposal"
                               if (tasktypeon-1==0)
                               {
                                   tabelname = "#matproposal";
                               }
                               else
                               {
                                   tabelname = "#matproposal"+(tasktypeon);
                               }
                               if (tabletasskid[tasktypeon-1] != 0)
                               {
                                $( tabelname + '> tbody:last').append(htmltablerowmat);
                               }
                          /* }*/
                           break;
                       case 3:
                           htmltablerowcon = "";
                           switch (tasktypeon){
                               case 1:
                                   htmltablerowcon += "<tr>";
                                   htmltablerowcon += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\"  class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowcon +=    "<td><button type=\"button\" class = \"addproposecon\" data-href=\"1\" data-item-id=\"0\" data-item-date=\""+$("#condatepicker").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowcon += "</tr>";
                                   break;
                               case 2:
                                   htmltablerowcon += "<tr>";
                                   htmltablerowcon += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"   data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowcon +=    "<td><button type=\"button\" class = \"addproposecon\" data-href=\"2\" data-item-id=\"0\" data-item-date=\""+$("#condatepicker2").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowcon += "</tr>";
                                   break;
                               case 3:
                                   htmltablerowcon += "<tr>";
                                   htmltablerowcon += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowcon +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowcon +=    "<td><button type=\"button\" class = \"addproposecon\" data-href=\"3\" data-item-id=\"0\" data-item-date=\""+$("#condatepicker3").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowcon += "</tr>";
                                   break;
                           }


                               var tabelname = "#conproposal"
                                if (tasktypeon-1==0)
                               {
                                   tabelname = "#conproposal";
                               }
                               else
                               {
                                   tabelname = "#conproposal"+(tasktypeon);
                               }
                                    if (tabletasskid[tasktypeon-1] != 0)
                               {
                               $( tabelname + '> tbody:last').append(htmltablerowcon);
                               }
                           break;
                       case 4:
                           htmltablerowland = "";
                           switch (tasktypeon){
                               case 1:
                                   htmltablerowland += "<tr>";
                                   htmltablerowland += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\"  class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowland +=    "<td><button type=\"button\" class = \"addproposeland\" data-href=\"1\" data-item-id=\"0\" data-item-date=\""+$("#landdatepicker").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowland += "</tr>";
                                   break;
                               case 2:
                                   htmltablerowland += "<tr>";
                                   htmltablerowland += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"   data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j]+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowland +=    "<td><button type=\"button\" class = \"addproposeland\" data-href=\"2\" data-item-id=\"0\" data-item-date=\""+$("#landdatepicker2").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowland += "</tr>";
                                   break;
                               case 3:
                                   htmltablerowland += "<tr>";
                                   htmltablerowland += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowland +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowland +=    "<td><button type=\"button\" class = \"addproposeland\" data-href=\"3\" data-item-id=\"0\" data-item-date=\""+$("#landdatepicker3").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowland += "</tr>";
                                   break;
                           }

                               var tabelname = "#landproposal"
                           if (tasktypeon-1==0)
                               {
                                   tabelname = "#landproposal";
                               }
                               else
                               {
                                   tabelname = "#landproposal"+(tasktypeon);
                               }
                           if (tabletasskid[tasktypeon-1] != 0)
                               {
                               $( tabelname + '> tbody:last').append(htmltablerowland);
                               }

                           break;
                       case 5:
                           htmltablerowmis = "";
                           switch (tasktypeon){

                               case 1:
                                   htmltablerowmis += "<tr>";
                                   htmltablerowmis += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task1percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowmis +=    "<td><button type=\"button\" class = \"addproposemis\" data-href=\"1\" data-item-id=\"0\" data-item-date=\""+$("#misdatepicker").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowmis += "</tr>";
                                   break;
                               case 2:
                                   htmltablerowmis += "<tr>";
                                   htmltablerowmis += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"  data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task2percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowmis +=    "<td><button type=\"button\" class = \"addproposemis\" data-href=\"2\" data-item-id=\"0\" data-item-date=\""+$("#misdatepicker2").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowmis += "</tr>";
                                   break;
                               case 3:
                                   htmltablerowmis += "<tr>";
                                   htmltablerowmis += "<td><input type=\"text\" name=\"\" value=\""+ vendornamepropose[j]+"\" data-href = \""+ vendoridpropose[j]+"\" class=\"form-control\" readonly style=\"width: 280px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+itemnamespropose[j]+"\" data-href = \""+ itemidpropose[j]+"\"   data-href-itemtype = \""+itemtypepropose[j] +"\" class=\"form-control\" readonly style=\"width: 250px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+quantitypropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+ratepropose[j] +"\" class=\"form-control\" readonly style=\"width: 35px;\"/></td>";
                                   htmltablerowmis +=    "<td><input type=\"text\" name=\"\" value=\""+totpropose[j] * task3percpropose[j] / 100+"\" class=\"form-control\" readonly style=\"width: 45px;\"/></td>";
                                   htmltablerowmis +=    "<td><button type=\"button\" class = \"addproposemis\" data-href=\"3\" data-item-id=\"0\" data-item-date=\""+$("#misdatepicker3").val()+"\" class=\"btn btn-success\">add</button></td>";
                                   htmltablerowmis += "</tr>";
                                   break;
                           }

                               var tabelname = "#misproposal"
                                if (tasktypeon-1==0)
                               {
                                   tabelname = "#misproposal";
                               }
                               else
                               {
                                   tabelname = "#misproposal"+(tasktypeon);
                               }
                                if (tabletasskid[tasktypeon-1] != 0)
                               {
                                $(tabelname + '> tbody:last').append(htmltablerowmis);
                               }

                           break;
                   }
                   }
               }
            },
            error: function(err) {
                return alert("There was an error reading job lineitems! Please refresh the page.");
            }
        }
    );
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
            async: false,
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
               /*
               $('#comment1text').empty().append(comment);
                $('#comment2text').empty().append(comment);
                $('#comment3text').empty().append(comment);
                */
                $('#comment1text').val(comment);
                $('#comment2text').val(comment);
                $('#comment3text').val(comment);

                settaskdates(selectedJob);
            },
            error: function(err) {
                return alert("There was an error reading job details! Please refresh the page.");
            }
        });
}


    function settaskdates(jobid){
        jsRoutes.controllers.Tasks_rd.getTasksbyJob(jobid).ajax(
            {
                async: false,
                data: {
                    id:jobid
                },
                success: function(datalist) {
                    var tskd1 = "";
                    var tskd2 = "";
                    var tskd3 = "";
                    for (itemindex = 0; itemindex < datalist.length; itemindex++) {
                        if (datalist[itemindex].taskType != null && datalist[itemindex].taskType.id != "")
                        {
                            var utcSeconds = datalist[itemindex].date /1000;
                            var dd = new Date(0); // The 0 there is the key, which sets the date to the epoch
                            dd.setUTCSeconds(utcSeconds);

                            if (datalist[itemindex].taskType.id ==1)
                            {
                                tskd1 = dd;
                            }
                            else if(datalist[itemindex].taskType.id ==2)
                            {
                                tskd2 = dd;
                            }
                            else if(datalist[itemindex].taskType.id ==3)
                            {
                                tskd3 = dd;
                            }
                        }
                    }
                    if (tskd1!="")
                    {
                        $( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                        $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                        $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                        $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                        $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', tskd1));
                    }
                    if (tskd2!="")
                    {
                        $( "#labdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                        $( "#matdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                        $( "#condatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                        $( "#landdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                        $( "#misdatepicker2").val($.datepicker.formatDate('yy-mm-dd', tskd2));
                    }
                    if (tskd3!="")
                    {
                        $( "#labdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                        $( "#matdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                        $( "#condatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                        $( "#landdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                        $( "#misdatepicker3").val($.datepicker.formatDate('yy-mm-dd', tskd3));
                    }
                },
                error: function(err) {
                    return alert("There was an error reading task details! Please refresh the page.");
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
                    if (task == 1)
                    {
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
                    }

                    if (task == 2)
                    {
                        switch(type) {
                            case 1:
                                $('#labitemselect2').empty().append(html);
                                break;
                            case 2:
                                $('#matitemselect2').empty().append(html);
                                break;
                            case 3:
                                $('#conitemselect2').empty().append(html);
                                break;
                            case 4:
                                $('#landitemselect2').empty().append(html);
                                break;
                            case 5:
                                $('#misitemselect2').empty().append(html);
                                break;
                        }
                    }

                    if (task == 3)
                    {
                        switch(type) {
                            case 1:
                                $('#labitemselect3').empty().append(html);
                                break;
                            case 2:
                                $('#matitemselect3').empty().append(html);
                                break;
                            case 3:
                                $('#conitemselect3').empty().append(html);
                                break;
                            case 4:
                                $('#landitemselect3').empty().append(html);
                                break;
                            case 5:
                                $('#misitemselect3').empty().append(html);
                                break;
                        }
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
