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

////////////////////////////////////////////////////////////////////////////


$( '#labquantity').focusout(function(){
    $('#labtotal').val($( '#labquantity').val() * $( '#labprice').val());
});




    $( '#labprice').focusout(function(){
        $('#labtotal').val($( '#labquantity').val() * $( '#labprice').val());
    });



///////////////////////////////////////////////////////////////////////////////////////////////


});