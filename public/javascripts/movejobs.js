$(document).ready(function() {
    $("#optgroup").multiselect();


    $( "#getids" ).click(function() {

        // vrti po site values od i ispisi gi
        var options = $('#optgroup_to optgroup option');

        var alltasks = '';
        var values = $.map(options ,function(option) {
            alltasks+= option.value + ' ';
        });

        alert(alltasks);

    });


});