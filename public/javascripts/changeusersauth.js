$(document).ready(function() {

    $("select").change(function() {
        var n = noty({layout: 'center',  type: 'success', text: 'You successfully changed the authority',  timeout: 2000});
    });

});
