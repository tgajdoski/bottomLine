$(document).ready(function() {



    var n = noty({
        layout: 'topLeft',
        theme: 'defaultTheme',
        type: 'confirm',
        text: '<table><tr><td width="50%" style="vertical-align: top;"> Do you want to try new version of the page? </td><td width="50%"><img src="assets/images/logo.png"></img></td></tr></table>',
        animation: {
            open: {height: 'toggle'},
            close: {height: 'toggle'},
            easing: 'swing',
            speed: 500 // opening & closing animation speed
        },
        buttons: [
            {addClass: 'btn btn-primary', text: 'YES', onClick: function($noty) {
                window.location.href = "";
            }
            },
            {addClass: 'btn btn-danger', text: 'NO', onClick: function($noty) {
                $noty.close();
            }
            }
        ]
    });


});
