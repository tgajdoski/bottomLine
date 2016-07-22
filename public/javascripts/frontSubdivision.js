
$(document).ready(function() {



    $(".buttonaddsubdivision").click(
        function()
        {
             jsRoutes.controllers.Customers_rd.addSubdivision().ajax(
                {
                    data: {
                        customer:$(".custdivselected").text(),
                        name: $("#newSubdivision").val()
                    },
                    success: function(datasub) {
                        alert("PROBLEMS");
                     /*    $(".subdivisionSelect").append($('<option/>', {value:  datasub.id , text: datasub.name}));
                        $(".subdivisionSelect").find("option[value='" + datasub.id + "']").attr("selected", "selected").end().change();
                        $('input[name="id"]').val(datasub["id"]);
                        $('input[name="name"]').val(datasub["name"]);
                        $(".step2").show();
                        return $(".subdivselection").text(datasub["name"]);*/
                    },
                    error: function(err) {
                        return alert("There was an error adding the subdivision! Please refresh the page and try again.");
                    }
                }
            );

        }
    );

});