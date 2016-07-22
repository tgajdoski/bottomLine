$(document).ready(function() {


$( "#reportot").hide();


    var someDate = new Date();
    var numberOfDaysToAdd = 12;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

    $(function() {

        $( "#startdatepicker1" ).datepicker();
        $( "#startdatepicker1" ).datepicker( "option", "dateFormat",'yy-mm-dd' );


        $( "#startdatepicker1" ).val($.datepicker.formatDate('yy-mm-dd',someDate));
    });
    $(function() {

        $( "#startdatepicker2" ).datepicker();
        $( "#startdatepicker2" ).datepicker( "option", "dateFormat",'yy-mm-dd' );

        $( "#startdatepicker2" ).val($.datepicker.formatDate('yy-mm-dd', someDate));
    });
    $(function() {

        $( "#startdatepicker3" ).datepicker();
        $( "#startdatepicker3" ).datepicker( "option", "dateFormat",'yy-mm-dd' );

        $( "#startdatepicker3" ).val($.datepicker.formatDate('yy-mm-dd', someDate));
    });
    $(function() {

        $( "#startdatepicker4" ).datepicker();
        $( "#startdatepicker4" ).datepicker( "option", "dateFormat",'yy-mm-dd' );

        $( "#startdatepicker4" ).val($.datepicker.formatDate('yy-mm-dd', someDate));
    });
    $(function() {

        $( "#startdatepicker5" ).datepicker();
        $( "#startdatepicker5" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#startdatepicker5" ).val($.datepicker.formatDate('yy-mm-dd', someDate));
    });
    $(function() {

        $( "#startdatepicker6" ).datepicker();
        $( "#startdatepicker6" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
        $( "#startdatepicker6" ).val($.datepicker.formatDate('yy-mm-dd', someDate));
    });


        $("#gotoDatePicker").datepicker({
            showOn: "button",
            buttonImageOnly: true,
            buttonImage: "/assets/images/calendar.gif",
            dateFormat: "yy-mm-dd",
            defaultDate: new Date($("#gotoDatePicker").val().split("-")[0], $("#gotoDatePicker").val().split("-")[1] - 1, $("#gotoDatePicker").val().split("-")[2]),
            onSelect: function(dateText, inst) {
                return window.location.href = "?date=" + dateText +  "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
            }
        });


    // when you change market - change vendor set and refresh table

    $("#calMarketSelect").change(
        function()
    {
            var foo = "";
            $('#calMarketSelect :selected').each(function(i, selected){
                foo = $(selected).val();
                populatevendors(foo,"");
                // izbrisi gi cenite
                // izbrisi gi vendor items

                $('#vendoritems').empty().append("");
                $(".hourrate").val("");


      });

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
                $('#calCategorySelect').empty().append(html);
            },
            error: function (result) {
                alert('Some error occurred while retrieving vendor list. ');
            }
        });

    }



    $(".printweek").click(function() {
            var parms;
            parms = (window.location.href.indexOf("?")!=-1)?"&"+window.location.href.split("?")[1]:"";
            return window.open("/labors/calendar/print?font=" + $(this).css("font-size") + parms);
        });



    // when you change vendor - refresh table


    function populatedatatableitems(idto){
        jsRoutes.controllers.Vendors_rd.getVendorItems(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    var html = '';
                    var len = datasub.length;
                  //  html+='<select class="userAuthority" id="subdivisionSelect">';
                 //   html+='<option value=""></option>';
                    for (var i = 0; i< len; i++) {

                        if (datasub[i].item != null)
                        {
                            html +=  '<option value="' + datasub[i].id + '" data-hourly="' + datasub[i].default_rate + '">' +  datasub[i].item.name + '</option>';
                            if (i==0)
                                $(".hourrate").val(datasub[i].default_rate);
                        }

                    }
                 //   html+='</select>';
                    $("#vendoritems").empty().append(html);
                },
                error: function(err) {
                    return alert("There was an error updating the datatable information! Please refresh the page.");
                }
            }
        );
    }


    $("#calCategorySelect").change(
        function() {
            populatedatatableitems($("#calCategorySelect").val());

            /* function()
             {
             //   return window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
             //  refreshTable();
             jQuery.ajax({
             type: "GET",
             url: "/labors/getvendorperhour",
             cache: false,
             data: {
             vendor:  $("#calCategorySelect").val()
             },
             success: function(datata) {
             $(".hourrate").val(datata);
             },
             error: function (result) {
             alert('Some error occurred while retrieving vendor information. ');
             }
             });




             $( "#reportot").show();
             getselection();



             }*/

        });



    $("#vendoritems").change(
        function() {
            $(".hourrate").val($('option:selected', this).attr('data-hourly'));
        });


        function refreshTable()
        {
            $('#calendar').empty();
            var urlto = window.location.host + "/labors/calendartable?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();

            $.ajax({
                type: "GET",
                // urlto: '/jobs/vendors/getvendorsmarketcat?marketid='+marketid+"&itemType="+itemtype+"&insurence=true",
                urlto: '/labors/calendartable?date='+$("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val(),
                success: function(data) {
                    $('#calendar').empty().append(data);
                },
                error: function (result) {
                    alert('Some error occurred while retrieving vendor list. ');
                }
            });
            // return urlto;
            // window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
        }



        function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };





function getselection(){



        $("#hourmonday").val("");
        $("#hourtuesday").val("");
        $("#hourwednesday").val("");
        $("#hourthursday").val("");
        $("#hourfriday").val("");
        $("#hoursaturday").val("");


    var vendorid = $("#calCategorySelect").val();
    var marketid = $("#calMarketSelect").val();
    var date = $("#gotoDatePicker").val();



        jQuery.ajax({
        type: "GET",
        url: "/labors/getlistlabors",
        cache: false,
        data: {
            vendorid:  vendorid,
            marketid:  marketid,
            date: date
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
            for (var f = 0; f < datata['data'].length; f++)
            {
             //   console.log(datata['data'][f]);

                if (datata['data'][f][1] == $("#hourmonday").attr("data-date"))
                    $("#hourmonday").val(datata['data'][f][4]);



                if (datata['data'][f][1] == $("#hourtuesday").attr("data-date"))
                    $("#hourtuesday").val(datata['data'][f][4]);



                if (datata['data'][f][1] == $("#hourwednesday").attr("data-date"))
                    $("#hourwednesday").val(datata['data'][f][4]);



                if (datata['data'][f][1] == $("#hourthursday").attr("data-date"))
                    $("#hourthursday").val(datata['data'][f][4]);




                if (datata['data'][f][1] == $("#hourfriday").attr("data-date"))
                    $("#hourfriday").val(datata['data'][f][4]);




                if (datata['data'][f][1] == $("#hoursaturday").attr("data-date"))
                    $("#hoursaturday").val(datata['data'][f][4]);





            }

        },
        error: function(err) {
            return alert(err);
        }
    });
    $( "#reportot").show();

};



    $(".btn").click(function() {

        var marketid =  $("#calMarketSelect option:selected" ).val();
        var vendorid =    $("#calCategorySelect option:selected" ).val();


        var noteappend =  $("#vendoritems option:selected" ).text();

        var datelabor =  $(this).closest("td").find('.hours').attr("data-date");
        var billdate =  $(this).closest("td").find('.startdatepicker').val();
        var amounthours = $(this).closest("td").find('.hours').val();

        var payrate =  $(this).closest("td").find('.hourrate').val();
        var note =  $(this).closest("td").find('.note').val() + " - " + noteappend;

        if (marketid !=""  && vendorid!=""  && datelabor  !=""  &&  amounthours !=""  &&  payrate !="" )
        {
            $(this).closest("td").find('.hours').val("");
            $(this).closest("td").find('.note').val("");

            $.ajax({
                async: false,
                type: 'POST',
                url: '/labors/addlabor?marketid='+marketid+"&vendorid="+vendorid+"&datelabor="+datelabor+"&amounthours="+amounthours+"&payrate="+payrate+"&note="+note+"&billdate="+billdate   ,
                success: function() {
                    // refreshme();
                    //    return  window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
                    $( "#reportot").show();
                    getselection();



                },
                error: function (result) {
                    alert('Some error occurred while saving labor hours ');
                }
            });


        }
        else
        {
            alert('Please select market and vendor before inserting hours ');
        }




    });


    $("#reporttable tbody").on("click", "tr td .clicka", function(){
        //  window.location.href = "/jobs/" + $(this).text();
        var labid =  $(this).closest("td").find('.clicka').attr("data-id");
      //  window.open("/labor/delete/" + $(this).text());

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

/*

 $(document).on('focusout', '#hourmonday, #hourtuesday, #hourwednesday, #hourthursday, #hourfriday, #hoursaturday', function()
    {

        var marketid =  $("#calMarketSelect option:selected" ).val();
       var vendorid =    $("#calCategorySelect option:selected" ).val();
       var datelabor = $(this).attr("data-date");
       var amounthours =  $(this).val() ;
       var payrate =  $('#hourrate').val();


        if (marketid !=""  && vendorid!=""  && datelabor  !=""  &&  amounthours !=""  &&  payrate !="" )
        {

            $.ajax({
                async: false,
                type: 'POST',
                url: '/labors/addlabor?marketid='+marketid+"&vendorid="+vendorid+"&datelabor="+datelabor+"&amounthours="+amounthours+"&payrate="+payrate,
                success: function() {
                   // refreshme();
                  //    return  window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
                    $( "#reportot").show();
                    getselection();


                },
                error: function (result) {
                    alert('Some error occurred while saving labor hours ');
                }
            });


        }
        else
        {
              alert('Please select market and vendor before inserting hours ');
        }


    });
*/


})

