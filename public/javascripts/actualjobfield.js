$(document).ready(function() {

    $(function() {
        $( "#tabs" ).tabs();
    });

    $(function() {
        $( "#accordion" ).accordion();
    });


    $(function() {
        $( "#datepicker" ).datepicker();
    });



    $('#jobs').DataTable( {
        "bProcessing": true,
        "aaSorting": [[ 0, "desc" ]],
        "bServerSide": true,
        "sPaginationType": "full_numbers",
        "sAjaxSource": "/admin/ajax/actuals",
        "aLengthMenu": [[ 10, 25, 50, 100 , -1], [ 10,  25, 50, 100, "All"]],
        "iDisplayLength" : 10,
        "sDom": '<"top">rt<"bottom"lpfi><"clear">'
    });




    jsRoutes.controllers.Tasks_rd.getDailyTasksActuals().ajax(
        {
            data: {
                market: $("#calMarketSelect").val(),
                date:   $("#gotoDatePicker").val(),
                manager: $("#calManagerSelect").val()
            },
            success: function(datasub) {
                $('#calendarbody').empty().append(datasub);
              /*  for (var i = 1; i< 6; i++) {
                    getactualvendors(0,i);
                }*/

            },
            error: function(err) {
                return alert("There was an error reading daily calendar information! Please refresh the page.");
            }
        }
    );






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



    $("#calMarketSelect, #calManagerSelect" ).change(function() {
        return window.location.href = "?date=" + $("#gotoDatePicker").val() + "&market=" + $("#calMarketSelect").val() + "&manager=" + $("#calManagerSelect").val();
    });



    $(function() {
        $(".calendarmalendar").datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: function () {
                selectedDate = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker('getDate'));
                return window.location.href = "?date=" + selectedDate + "&market=" + $("#calMarketSelect").val() + "&manager=" + $("#calManagerSelect").val() + "&category=" + $("#calCategorySelect").val();
                // alert(selectedDate);
                //  http://localhost:9000/admin/actualjobs?date=2014-11-11&market=&manager=
                // url: '/admin/actualjobs/editassigns?jobid='+jobid+'&taskid='+ taskid + '&datetask='+datetask+'&fieldid='+fieldid+'&id='+addoredit,
            }
        });
    });



    $('#planmodam').hide();

    $("#skrijgobezmarket").hide();

    $("#skrijgobezsubdivision").hide();





    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#planmodam').show();
    });




    $("#jobs tbody").on("click", "tr td .clicka", function(){
      // OTVORI DOLEN DEL OD ACCORDITION I PROBAJ DA POPOLNIS STO IMA
        $("#accordion").accordion({ active: 1});
       // window.location.href = "/jobs/" + $(this).closest('tr').attr("id");

        // zemi job od server kako object i zalepi mu gi site ovie parametri za title

        // popolni gi site drugi polinja



      //  @job.market.city, @job.market.state
       // Job @job.id - <span id="jobCustomer">@job.subdivision.customer.name</span> <span id="jobSubdivision">@job.subdivision.name</span> <span id="jobLot">@job.lot</span> <span id="jobSaleitem">@(if (job.item!=null) job.item.name else "SALEITEM")</span>@(if (job.plan!=null) " ("+job.plan.name+" plan)")@if(user.authority >= Secured.MANAGER){<a id="deleteJob">x</a>}



    });

});

