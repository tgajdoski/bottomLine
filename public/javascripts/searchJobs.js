
$(document).ready(function() {

    $("#search").autocomplete$("#search").autocomplete({
        source: function(request, response) {
            return jsRoutes.controllers.Jobs_rd.searchJobs().ajax({
                data: {
                    search: $("#search").val()
                },
                success: function(data) {
                    return response($.map(data, function(job) {
                        return {
                            label: job.customer?job.customer.name+" "+(job.subdivision?job.subdivision.name+" "+job.lot:job.lot):(job.subdivision?job.subdivision.name+" "+job.lot:job.lot),
                            value: job.id
                        };
                    }));
                },
                error: function(err) {
                    return alert("There was an error loading the jobs! Please refresh the page and try again.");
                }
            });
        },
        select: function(event, ui) {
            if (ui.item) {
                return window.location.href = "rd/jobs/" + ui.item.value;
            }
        },
        open: function() {
            return $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function() {
            return $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
    });

    $("#loading").ajaxStart(function() {
        return $(this).show();
    }).ajaxStop(function() {
        return $(this).hide();
    }).hide();

});