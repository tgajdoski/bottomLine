
$.validator.setDefaults({
    submitHandler:  function() {
        jsRoutes.controllers.Application.doSignup().ajax({
            data: {
                email: $("#email").val(),
                password: $("#password").val(),
                repeatPassword: $("#repeatpassword").val(),
                name: $("#username").val()
            },
            success: function() {
                var n = noty({layout: 'center',  type: 'success', text: 'You successfully added new user',  timeout: 2000});
                setTimeout(function(){window.location = "/rd/admin/users"}, 500);
            },
            error: function(err) {
                return alert("There was an error adding the user! Please refresh the page and try again.");
            }
        });
    }
});

$(document).ready(function() {

    $('#resetuser').hide();

    $("#users").DataTable();

    /*$("#users tbody").on("click", "tr", function(){
        var name=$('td', this).eq(1).text();
        alert('You clicked on ' + name);
    });*/

        // changeAuthority
          /*  $(".userAuthority").change(function() {*/
                $("#users tbody").on("change", "tr td .userAuthority", function(){
                var a = $(this).closest('tr').find("td:nth-child(2)").text();
                var b = $(this).find("option:selected").text();

                var c =  $(this).closest('tr');

                jsRoutes.controllers.Users_rd.updateUser().ajax({
                    data: {
                            id: $(this).closest('tr').attr("data-user-id"),
                            authority: $(this).val()
                    },
                    success: function() {
                        c.noty({ type: 'success', text:  a + ' is now  ' + b,  timeout: 2000});
                   /*     setTimeout(function(){window.location = "/rd/admin/users"}, 0);*/

                    },
                    error: function(err) {
                        return alert("There was an error adding the user! Please refresh the page and try again.");
                    }
                });

            });




    // deleteUser
       /* $("*.deleteUser").click(function() {*/

            $("#users tbody").on("click", "tr td .deleteUser", function(){
            var d = $(this).closest('tr');
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var context;
            context = this;
            if (confirm("Are you sure?")) {
                return jsRoutes.controllers.Users_rd.deleteUser().ajax({
                    data: {
                        id: $(this).closest('tr').attr("data-user-id")
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'user ' + a + ' was deleted',  timeout: 3000});
                        return d.remove();
                    },
                    error: function(err) {
                        return alert("There was an error deleting the user! Please refresh the page and try again.");
                    }
                });
            }
    });


    // changePassword


    $("#users tbody").on("click", "tr td .resetPassword", function(){

        var a = $(this).closest('tr').find("td:nth-child(2)").text();

        $("#dataDiv").val($(this).closest('tr').attr("data-user-id"));
        $( '#userselected').text(a);
        $('#resetuser').show();

    });


    $(".close").click(function() {
        $('#resetuser').hide();
    });

    $("#close").click(function() {
        $('#resetuser').hide();
    });




    $("#users tbody").on("click", "tr td .actinact", function(){
            var returnVal = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var userid = $(this).val();
            return jsRoutes.controllers.Users_rd.updateActive().ajax({
                    data: {
                        userid: userid,
                        active: returnVal
                    },
                    success: function(data) {
                        if (returnVal)
                            var n = noty({type: 'success', text: 'User ' + a + ' is active.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'User ' + a + ' is inactive.',  timeout: 3000});
                    },
                    error: function(err) {
                        return alert("There was an error changing the user! Please refresh the page and try again.");
                    }
                });
        }
    );



    $("#resteuserpass").click(
        function()
        {

            jsRoutes.controllers.Users_rd.updateUser().ajax(
                {
                    data: {
                        id: $('#dataDiv').val(),
                        password: $('#newuserpass').val()
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Password for user ' + $( '#userselected' ).text() + ' is reset.',  timeout: 3000});
                        $('#resetuser').hide();
                    },
                    error: function(err) {
                        return alert("There was an error resetting the password! Please refresh the page and try again.");
                    }
                }
            );
        }
    );

    $("#signupForm").validate({
        rules: {
            username: {
                required: true,
                minlength: 3
            },
        email: {
            required: true,
            email: true
            },
        password: {
            required: true,
            minlength: 5
            },
        repeatpassword: {
            required: true,
            minlength: 5,
            equalTo: "#password"
            }
        },
        messages: {
            username: {
            required: "Please enter a username",
            minlength: "Your username must consist of at least 3 characters"
            },
        email: "Please enter a valid email address",
        password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long"
            },
        repeatpassword: {
            required: "Please provide a password",
            minlength: "Your password must be at least 5 characters long",
            equalTo: "Please enter the same password as above"
            }
        }
});

});
