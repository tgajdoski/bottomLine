$(document).ready(function() {


$( "#reportot").hide();

    $( "#exall").hide();
    $(".btn").click(function(){
         getselection();
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




function getselection(){

 var vendorid = $("#vendorSelect").val();
    var marketid = $("#marketSelect").val();
    var startdate = $("#startdatepicker").val();
    var enddate = $("#enddatepicker").val();


        jQuery.ajax({
        type: "GET",
        url: "/reports/getlistlaborper",
        cache: false,
        data: {
            vendorid:  vendorid,
            marketid:  marketid,
            startdate: startdate,
            enddate: enddate
        },
        success: function(datata) {
            $('#bodyto').append(datata);
            $( "#exall").show();
        },
        error: function(err) {
            return alert(err);
        }
    });
    $( "#reportot").show();

};


    $( "#exall").click(function(){
        ExportAllTablesToExcel();
    });

    function ExportAllTablesToExcel(){

        var html;
        var table_html = '<table><tr>';
        //go through all tables
        $('table.display').each(function(){
            //add their HTML to our big HTML string
            table_html += '<tr><table>' + $(this).html() + '</table></tr>';
            //remove that table from the page
            //  html+=$(this.outerHTML);
        });

        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(table_html));
    }



    $("#marketSelect").change(
        function()
    {
            var foo = "";
            $('#marketSelect :selected').each(function(i, selected){
                foo = $(selected).val();
                populatevendors(foo,"");
            });
      //  refreshTable();
       //     return window.location.href = "?date=" + dateText +  "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
      //        return  window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&vendor=" + $("#calCategorySelect").val();
        });


    function populatevendors(marketid, itemtype)
    {
        $.ajax({

            type: "GET",
            url: '/jobs/vendors/getvendorsmarketcat?marketid='+marketid+"&itemType="+itemtype+"&insurence=true",
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
                $('#vendorSelect').empty().append(html);
            },
            error: function (result) {
                alert('Some error occurred while retrieving vendor list. ');
            }
        });

    }


    $("#reporttable tbody").on("click", "tr td .clicka", function(){

        var labid =  $(this).closest("td").find('.clicka').attr("data-id");

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

})

