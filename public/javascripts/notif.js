
/*

$.validator.setDefaults({
    submitHandler:  function() {
        var n = noty({layout: 'center',  type: 'success', text: 'You successfully changed your password',  timeout: 2000});
       */
/* setTimeout(function(){window.location = "/profile"}, 500);*//*

   }
});
*/

$().ready(function() {

    $("#changepass").click(function() {
        var n = noty({layout: 'center',  type: 'success', text: 'You successfully changed your password',  timeout: 2000});
    });


    $("#signupForm").validate({
        rules: {
            password: {
                required: true,
                minlength: 5
            },
            repeatPassword: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            }
        },
        messages: {
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            repeatPassword: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long",
                equalTo: "Please enter the same password as above"
            }
        }
    });

});
