
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

        if(typeof(taskidno)  == "undefined")
            taskidno = $($(this)).parents('li').find('.assignTask').attr('data-href');

        if(typeof(dateon)  == "undefined")
            dateon = $($(this)).parents('li').find('.assignTask').attr('data-href-date');


        selectedTaskType = tasktipidno;
        selectedJob = $(this).attr('data-href');

        $( "#labdatepicker").val(dateon);


       // lineitemidto = $(this).attr("data-line-id");

      //  $($(this)).parents('li').find('.assignedTask').css('display', 'none');

        // ova e smeneto da gi dava samo vendorite sto ni trebaat

        getactualvendorsmin(0,1, selectedJob);

        someFunction( $(this).attr('data-href'));

      //  getlineitemsid( $(this).attr('data-href'), taskidno);

        $('#lablineitemsperuser').html('');
        populatelaborlineitemsdropdown(selectedJob, taskidno);
        populateLaborItems(selectedJob, taskidno , $('#lablineitemsperuser option:selected').val());

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

// lab clears //

    function clearlabinserts(){

    $("#labvendorselect")[0].selectedIndex = 0;
    $("#labitemselect")[0].selectedIndex = 0;
    $("#labquantity").val('');
    $("#labprice").val('');
    $("#labtotal").val('');
    $("#addlabbutton").html('add');
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


    function populatelaborlineitemsdropdown(jobid, taskidno ){
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
                                var utcSeconds = datasubajliit[i].daysdate /1000 +43200;
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
                   }
                }
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