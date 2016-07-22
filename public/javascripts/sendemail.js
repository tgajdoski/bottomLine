
$(document).ready(function() {

    $("#buttonsend").click(function(){
        var to  = $("#emailto").val()
        var from  = $("#emailfrom").val()
        var subject  = $("#subject").val()
        var body  = $("#bodyto").val()

        if(to !='' &&  from !='' )
        {
                jsRoutes.controllers.Home_rd.sendemail().ajax(
                    {
                        data: {

                            to: to,
                            from: from,
                            subject: subject,
                            body: body
                        },
                        success: function(data) {

                            return alert("Email is sent. Please check your email");
                        },
                        error: function(err) {
                            return alert("There was an error sending email");
                        }
                    }
                );
        }
        else
        {
            var n = noty({type: 'error', text: 'Plan is mandatory. Please select one from the dropdown menu.',  timeout: 3000});
        }
    });





});