/**
 * Created by User on 5/18/14.
 */


$(document).ready(function() {
$(".weatherrow").hide();

  // da se najde event marketSelect .change pa da se proveri val
   // ako ne e 0 da se vikne show







    $("#marketSelect").change(function() {

        if ($("#marketSelect").val()!=0){
            var wowoid;

//            $.ajax({
//                url: jsRoutes.controllers.Customers.getMarketwoeid(woeid),
//                type: 'GET',
//                cache: false,
//                timeout: 3000,
//                error:  function(err) {
//                    console.debug("Error of ajax0 Call");
//                    console.debug(err);
//                },
//                success: function(datax) {
//                    if(datax != ""){
//                        wowoid = datax;
//                    }
//                }
//            });

            // da se povika kontrolerot i sto ke ni vrati da go mountirame
            $(".weatherrow").show();
             woeid = $("#marketSelect").val();



            var successFn0 = function(datax) {
                if(datax != ""){
                    wowoid = datax;
                    var successFn = function(data) {
                        if(data != ""){
                            $( "#weatherbody" ).html(data);
                        }
                        else{
                            $( "#weatherbody" ).html("cant reach the web service" );
                        }
                        console.debug("Success of Ajax Call");
                        console.debug(data);
                    };
                    var errorFn = function(err) {
                        console.debug("Error of ajax Call");
                        console.debug(err);
                    }


                    ajax1 = {
                        success: successFn,
                        error: errorFn
                    }

                    jsRoutes.controllers.weather.getWeather(wowoid).ajax(ajax1);

                }
            };

            var errorFn0 = function(err) {
                console.debug("Error of ajax Call");
                console.debug(err);
            }
            ajax0 = {
                success: successFn0,
                error: errorFn0
            }

            jsRoutes.controllers.Customers_rd.getMarketwoeid(woeid).ajax(ajax0);


//
                    }
        else
        {
            $(".weatherrow").hide();
        }
    });



    $("select#marketSelect option")
        .each(function() { this.selected = (this.text == 'Atlanta, GA'); });
    $('#marketSelect').change();


});