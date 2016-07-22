$(document).ready(function() {


 // var t =   jsRoutes.controllers.Tasks_rd.getDailyTasksHome().ajax();


    jsRoutes.controllers.Tasks_rd.getDailyTasksHome().ajax(
        {
            data: {
                market: $("#calMarketSelect").val()
            },
            success: function(datasub) {
                $('#calendarbody').empty().append(datasub);
            },

            /*error: function (xhr, textStatus, errorThrown) {
                if (xhr.status === 500) {
                    console.log(xhr);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            }*/
            error: function(err, xhr) {
                    if (xhr.status === 500) {
                        return alert("There was an error reading daily calendar information! Please refresh the page.");
                    }
            }
        }
    );




    $("#itemReport").click(function() {
        var parms;
        parms = (window.location.href.indexOf("?")!=-1)?"?"+window.location.href.split("?")[1]:"";
        return window.open("/calendar/items" + parms);
    });




    $("#calMarketSelect").change(function() {
        return window.location.href = "?market=" + $("#calMarketSelect").val();
    });



    clearlinksbyauth();



    function clearlinksbyauth(){
        var auth =  $("#authority").val();

        if (auth<= 1)
        {
            $(".calendarot").hide();
        }

        // reportot
        if (auth < 5)
        {
            $(".reportot").hide();
        }


        // input actuals
        if (auth != 3)
        {
            $(".actuals").hide();
        }


        //plansot
        if (auth >5 || auth ==4 || auth == 3)
        {
            $(".plansot").show();
        }
        else
        {
            $(".plansot").hide();
        }

        // vendorsot

        if (auth >4 || auth==2 || auth ==1)
        {
            $(".vendorsot").show();
        }
        else
        {
            $(".vendorsot").hide();
        }

        //customersot
       if (auth >4 || auth==2 || auth ==1)
        {
            $(".customersot").show();
        }
        else
        {
            $(".customersot").hide();
        }

    }



});