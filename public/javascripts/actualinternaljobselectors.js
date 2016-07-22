$( document ).ready(function() {

var d = new Date();
var jobMarket = 0;
var selectedJob = 0;

function getMonday(d) {
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 1 ? -6 : 1);
    return new Date(d.setDate(diff));
}
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

$(function() {
    $( "#labdatepicker" ).datepicker();
    $( "#labdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#labdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#matdatepicker" ).datepicker();
    $( "#matdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#matdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#condatepicker" ).datepicker();
    $( "#condatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#condatepicker").val($.datepicker.formatDate('yy-mm-dd',new Date()));
});
$(function() {
    $( "#landdatepicker" ).datepicker();
    $( "#landdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#landdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#misdatepicker" ).datepicker();
    $( "#misdatepicker" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#misdatepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});




$(function() {

    $( "#labdatepicker2" ).datepicker();
    $( "#labdatepicker2" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#labdatepicker2").val($.datepicker.formatDate('yy-mm-dd',new Date()));
});
$(function() {
    $( "#matdatepicker2" ).datepicker();
    $( "#matdatepicker2" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#matdatepicker2").val($.datepicker.formatDate('yy-mm-dd',new Date()));
});
$(function() {
    $( "#condatepicker2" ).datepicker();
    $( "#condatepicker2" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#condatepicker2").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#landdatepicker2" ).datepicker();
    $( "#landdatepicker2" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#landdatepicker2").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#misdatepicker2" ).datepicker();
    $( "#misdatepicker2" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#misdatepicker2").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});




$(function() {

    $( "#labdatepicker3" ).datepicker();
    $( "#labdatepicker3" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#labdatepicker3").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#matdatepicker3" ).datepicker();
    $( "#matdatepicker3" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#matdatepicker3").val($.datepicker.formatDate('yy-mm-dd',new Date()));
});
$(function() {
    $( "#condatepicker3" ).datepicker();
    $( "#condatepicker3" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#condatepicker3").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});
$(function() {
    $( "#landdatepicker3" ).datepicker();
    $( "#landdatepicker3" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#landdatepicker3").val($.datepicker.formatDate('yy-mm-dd',new Date()));
});
$(function() {
    $( "#misdatepicker3" ).datepicker();
    $( "#misdatepicker3" ).datepicker( "option", "dateFormat",'yy-mm-dd' );
    $( "#misdatepicker3").val($.datepicker.formatDate('yy-mm-dd', new Date()));
});



function getvendoritemsprice(vendorid, itemid, task, type){
    jsRoutes.controllers.Vendors_rd.getVendorActualItem().ajax(
        {
            data: {
                itemid:itemid,
                vendorid:vendorid
            },
            success: function(datasubit) {
                if (task == 1)
                {
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
                }

                if (task == 2)
                {
                    switch(type) {
                        case 1:
                            $( '#labprice2').val( datasubit['default_rate'] );
                            break;
                        case 2:
                            $( '#matprice2').val( datasubit['default_rate'] );
                            break;
                        case 3:
                            $( '#conprice2').val( datasubit['default_rate'] );
                            break;
                        case 4:
                            $( '#landprice2').val( datasubit['default_rate'] );
                            break;
                        case 5:
                            $( '#misprice2').val( datasubit['default_rate'] );
                            break;
                    }
                }

                if (task == 3)
                {
                    switch(type) {
                        case 1:
                            $( '#labprice3').val( datasubit['default_rate'] );
                            break;
                        case 2:
                            $( '#matprice3').val( datasubit['default_rate'] );
                            break;
                        case 3:
                            $( '#conprice3').val( datasubit['default_rate'] );
                            break;
                        case 4:
                            $( '#landprice3').val( datasubit['default_rate'] );
                            break;
                        case 5:
                            $( '#misprice3').val( datasubit['default_rate'] );
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


    function orderSelect($element) {
        var options   = $element.find('option'),
            n_options = options.length,
            temp = [],
            parts,
            i;

        for(i = n_options; i --;) {
            temp[i] = options[i].text + "," + options[i].value ;
        }

        temp.sort();

        for(i = n_options; i --;) {
            parts = temp[i].split(',');

            options[i].text  = parts[0];
            options[i].value = parts[1];
        }
    }

function getvendoritems(vendorid, task, type){
    jsRoutes.controllers.Vendors_rd.getVendorActualItems(vendorid).ajax(
        {
            data: {
                id:vendorid
            },
            success: function(datasubve) {
                var html = '';
              //  var len = datasubve.length;

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
                            orderSelect( $('#labitemselect'));
                            break;
                        case 2:
                            $('#matitemselect').empty().append(html);
                            orderSelect( $('#matitemselect'));
                            break;
                        case 3:
                            $('#conitemselect').empty().append(html);
                            orderSelect( $('#conitemselect'));
                            break;
                        case 4:
                            $('#landitemselect').empty().append(html);
                            orderSelect( $('#landitemselect'));
                            break;
                        case 5:
                            $('#misitemselect').empty().append(html);
                            orderSelect( $('#misitemselect'));
                            break;
                    }
                }

                if (task == 2)
                {
                    switch(type) {
                        case 1:
                            $('#labitemselect2').empty().append(html);
                            orderSelect( $('#labitemselect2'));
                            break;
                        case 2:
                            $('#matitemselect2').empty().append(html);
                            orderSelect( $('#matitemselect2'));
                            break;
                        case 3:
                            $('#conitemselect2').empty().append(html);
                            orderSelect( $('#conitemselect2'));
                            break;
                        case 4:
                            $('#landitemselect2').empty().append(html);
                            orderSelect( $('#landitemselect2'));
                            break;
                        case 5:
                            $('#misitemselect2').empty().append(html);
                            orderSelect( $('#misitemselect2'));
                            break;
                    }
                }

                if (task == 3)
                {
                    switch(type) {
                        case 1:
                            $('#labitemselect3').empty().append(html);
                            orderSelect( $('#labitemselect3'));
                            break;
                        case 2:
                            $('#matitemselect3').empty().append(html);
                            orderSelect( $('#matitemselect3'));
                            break;
                        case 3:
                            $('#conitemselect3').empty().append(html);
                            orderSelect( $('#conitemselect3'));
                            break;
                        case 4:
                            $('#landitemselect3').empty().append(html);
                            orderSelect( $('#landitemselect3'));
                            break;
                        case 5:
                            $('#misitemselect3').empty().append(html);
                            orderSelect( $('#misitemselect3'));
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

$('.labvendors2').change(function(){
    if ($(".labvendors2")[0].selectedIndex > 0)
    {
        getvendoritems($(".labvendors2 option:selected" ).val(),2,1 );
        $('#addlabbutton2').attr('data-href', 'add');
        $('#addlabbutton2').attr('data-item-id', 0);
        $("#addlabbutton2").html('add');


        $("#labitemselect2")[0].selectedIndex = 0;
        $("#labquantity2").val('');
        $("#labprice2").val('');
        $("#labtotal2").val('');
    }
});

$('.labvendors3').change(function(){
    if ($(".labvendors3")[0].selectedIndex > 0)
    {
        getvendoritems($(".labvendors3 option:selected" ).val(), 3, 1);
        $('#addlabbutton3').attr('data-href', 'add');
        $('#addlabbutton3').attr('data-item-id', 0);
        $("#addlabbutton3").html('add');


        $("#labitemselect3")[0].selectedIndex = 0;
        $("#labquantity3").val('');
        $("#labprice3").val('');
        $("#labtotal3").val('');
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

$('.labitems2').change(function(){
    if ($(".labitems2")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".labvendors2 option:selected" ).val(), $(".labitems2 option:selected" ).val(), 2,1);
        $('#addlabbutton2').attr('data-href', 'add');
        $('#addlabbutton2').attr('data-item-id', 0);
        $("#addlabbutton2").html('add');
        $("#labquantity2").val('');
        //  $("#labprice").val('');
        $("#labtotal2").val('');
    }
});

$('.labitems3').change(function(){
    if ($(".labitems3")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".labvendors3 option:selected" ).val(), $(".labitems3 option:selected" ).val() , 3,1);
        $('#addlabbutton3').attr('data-href', 'add');
        $('#addlabbutton3').attr('data-item-id', 0);
        $("#addlabbutton3").html('add');
        $("#labquantity3").val('');
        //  $("#labprice").val('');
        $("#labtotal3").val('');
    }
});


////MATERIALS ////////////////////////////////////////////////////


$('.matvendors').change(function(){
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


$('.matvendors2').change(function(){
    if ($(".matvendors2")[0].selectedIndex > 0)
    {
        getvendoritems($(".matvendors2 option:selected" ).val(),2, 2 );
        $('#addmatbutton2').attr('data-href', 'add');
        $('#addmatbutton2').attr('data-item-id', 0);
        $("#addmatbutton2").html('add');


        $("#matitemselect2")[0].selectedIndex = 0;
        $("#matquantity2").val('');
        $("#matprice2").val('');
        $("#mattotal2").val('');
    }
});

$('.matvendors3').change(function(){
    if ($(".matvendors3")[0].selectedIndex > 0)
    {
        getvendoritems($(".matvendors3 option:selected" ).val(), 3, 2);
        $('#addmatbutton3').attr('data-href', 'add');
        $('#addmatbutton3').attr('data-item-id', 0);
        $("#addmatbutton3").html('add');


        $("#matitemselect3")[0].selectedIndex = 0;
        $("#matquantity3").val('');
        $("#matprice3").val('');
        $("#mattotal3").val('');
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


$('.matitems2').change(function(){
    if ($(".matitems2")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".matvendors2 option:selected" ).val(), $(".matitems2 option:selected" ).val(), 2,2);
        $('#addmatbutton2').attr('data-href', 'add');
        $('#addmatbutton2').attr('data-item-id', 0);
        $("#addmatbutton2").html('add');
        $("#matquantity2").val('');
        //  $("#labprice").val('');
        $("#mattotal2").val('');
    }
});

$('.matitems3').change(function(){
    if ($(".matitems3")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".matvendors3 option:selected" ).val(), $(".matitems3 option:selected" ).val(),3,2);
        $('#addmatbutton3').attr('data-href', 'add');
        $('#addmatbutton3').attr('data-item-id', 0);
        $("#addmatbutton3").html('add');
        $("#matquantity3").val('');
        //  $("#labprice").val('');
        $("#mattotal3").val('');
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


$('.convendors2').change(function(){
    if ($(".convendors2")[0].selectedIndex > 0)
    {
        getvendoritems($(".convendors2 option:selected" ).val(),2,3);
        $('#addconbutton2').attr('data-href', 'add');
        $('#addconbutton2').attr('data-item-id', 0);
        $("#addconbutton2").html('add');


        $("#conitemselect2")[0].selectedIndex = 0;
        $("#conquantity2").val('');
        $("#conprice2").val('');
        $("#contotal2").val('');
    }
});


$('.convendors3').change(function(){
    if ($(".convendors3")[0].selectedIndex > 0)
    {
        getvendoritems($(".convendors3 option:selected" ).val() , 3,3);
        $('#addconbutton3').attr('data-href', 'add');
        $('#addconbutton3').attr('data-item-id', 0);
        $("#addconbutton3").html('add');


        $("#conitemselect3")[0].selectedIndex = 0;
        $("#conquantity3").val('');
        $("#conprice3").val('');
        $("#contotal3").val('');
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


$('.conitems2').change(function(){
    if ($(".conitems2")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".convendors2 option:selected" ).val(), $(".conitems2 option:selected" ).val() , 2, 3);
        $('#addconbutton2').attr('data-href', 'add');
        $('#addconbutton2').attr('data-item-id', 0);
        $("#addconbutton2").html('add');
        $("#conquantity2").val('');
        //  $("#labprice").val('');
        $("#contotal2").val('');
    }
});

$('.conitems3').change(function(){
    if ($(".conitems3")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".convendors3 option:selected" ).val(), $(".conitems3 option:selected" ).val(), 3,3);
        $('#addconbutton3').attr('data-href', 'add');
        $('#addconbutton3').attr('data-item-id', 0);
        $("#addconbutton3").html('add');
        $("#conquantity3").val('');
        //  $("#labprice").val('');
        $("#contotal3").val('');
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


$('.landvendors2').change(function(){
    if ($(".landvendors2")[0].selectedIndex > 0)
    {
        getvendoritems($(".landvendors2 option:selected" ).val() , 2, 4);
        $('#addlandbutton2').attr('data-href', 'add');
        $('#addlandbutton2').attr('data-item-id', 0);
        $("#addlandbutton2").html('add');


        $("#landitemselect2")[0].selectedIndex = 0;
        $("#landquantity2").val('');
        $("#landprice2").val('');
        $("#landtotal2").val('');
    }
});

$('.landvendors3').change(function(){
    if ($(".landvendors3")[0].selectedIndex > 0)
    {
        getvendoritems($(".landvendors3 option:selected" ).val(), 3, 4);
        $('#addlandbutton3').attr('data-href', 'add');
        $('#addlandbutton3').attr('data-item-id', 0);
        $("#addlandbutton3").html('add');


        $("#landitemselect3")[0].selectedIndex = 0;
        $("#landquantity3").val('');
        $("#landprice3").val('');
        $("#landtotal3").val('');
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

$('.landitems2').change(function(){
    if ($(".landitems2")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".landvendors2 option:selected" ).val(), $(".landitems2 option:selected" ).val(), 2,4);
        $('#addlandbutton2').attr('data-href', 'add');
        $('#addlandbutton2').attr('data-item-id', 0);
        $("#addlandbutton2").html('add');
        $("#landquantity2").val('');
        //  $("#labprice").val('');
        $("#landtotal2").val('');
    }
});

$('.landitems3').change(function(){
    if ($(".landitems3")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".landvendors3 option:selected" ).val(), $(".landitems3 option:selected" ).val(), 3,4);
        $('#addlandbutton3').attr('data-href', 'add');
        $('#addlandbutton3').attr('data-item-id', 0);
        $("#addlandbutton3").html('add');
        $("#landquantity3").val('');
        //  $("#labprice").val('');
        $("#landtotal3").val('');
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


$('.misvendors2').change(function(){
    if ($(".misvendors2")[0].selectedIndex > 0)
    {
        getvendoritems($(".misvendors2 option:selected" ).val(), 2 , 5);
        $('#addmisbutton2').attr('data-href', 'add');
        $('#addmisbutton2').attr('data-item-id', 0);
        $("#addmisbutton2").html('add');


        $("#misitemselect2")[0].selectedIndex = 0;
        $("#misquantity2").val('');
        $("#misprice2").val('');
        $("#mistotal2").val('');
    }
});



$('.misvendors3').change(function(){
    if ($(".misvendors3")[0].selectedIndex > 0)
    {
        getvendoritems($(".misvendors3 option:selected" ).val() , 3 , 5);
        $('#addmisbutton3').attr('data-href', 'add');
        $('#addmisbutton3').attr('data-item-id', 0);
        $("#addmisbutton3").html('add');


        $("#misitemselect3")[0].selectedIndex = 0;
        $("#misquantity3").val('');
        $("#misprice3").val('');
        $("#mistotal3").val('');
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

$('.misitems2').change(function(){
    if ($(".misitems2")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".misvendors2 option:selected" ).val(), $(".misitems2 option:selected" ).val(), 2,5);
        $('#addmisbutton2').attr('data-href', 'add');
        $('#addmisbutton2').attr('data-item-id', 0);
        $("#addmisbutton2").html('add');
        $("#misquantity2").val('');
        //  $("#labprice").val('');
        $("#mistotal2").val('');
    }
});


 $('.misitems3').change(function(){
    if ($(".misitems3")[0].selectedIndex > 0)
    {
        getvendoritemsprice($(".misvendors3 option:selected" ).val(), $(".misitems3 option:selected" ).val(), 3,5);
        $('#addmisbutton3').attr('data-href', 'add');
        $('#addmisbutton3').attr('data-item-id', 0);
        $("#addmisbutton3").html('add');
        $("#misquantity3").val('');
        //  $("#labprice").val('');
        $("#mistotal3").val('');
    }
});


////////////////////////////////////////////////////////////////////////////


$( '#labquantity').focusout(function(){
    $('#labtotal').val($( '#labquantity').val() * $( '#labprice').val());
});

$( '#labquantity2').focusout(function(){
    $('#labtotal2').val($( '#labquantity2').val() * $( '#labprice2').val());
});

$( '#labquantity3').focusout(function(){
    $('#labtotal3').val($( '#labquantity3').val() * $( '#labprice3').val());
});



$( '#matquantity').focusout(function(){
    $('#mattotal').val($( '#matquantity').val() * $( '#matprice').val());
});

$( '#matquantity2').focusout(function(){
    $('#mattotal2').val($( '#matquantity2').val() * $( '#matprice2').val());
});

$( '#matquantity3').focusout(function(){
    $('#mattotal3').val($( '#matquantity3').val() * $( '#matprice3').val());
});




$( '#conquantity').focusout(function(){
    $('#contotal').val($( '#conquantity').val() * $( '#conprice').val());
});

$( '#conquantity2').focusout(function(){
    $('#contotal2').val($( '#conquantity2').val() * $( '#conprice2').val());
});

$( '#conquantity3').focusout(function(){
    $('#contotal3').val($( '#conquantity3').val() * $( '#conprice3').val());
});




$( '#landquantity').focusout(function(){
    $('#landtotal').val($( '#landquantity').val() * $( '#landprice').val());
});

$( '#landquantity2').focusout(function(){
    $('#landtotal2').val($( '#landquantity2').val() * $( '#landprice2').val());
});

$( '#landquantity3').focusout(function(){
    $('#landtotal3').val($( '#landquantity3').val() * $( '#landprice3').val());
});



$( '#misquantity').focusout(function(){
    $('#mistotal').val($( '#misquantity').val() * $( '#misprice').val());
});

$( '#misquantity2').focusout(function(){
    $('#mistotal2').val($( '#misquantity2').val() * $( '#misprice2').val());
});

$( '#misquantity3').focusout(function(){
    $('#mistotal3').val($( '#misquantity3').val() * $( '#misprice3').val());
});



///////////////////////////////////////////////////////////////////////////////////////////////


});