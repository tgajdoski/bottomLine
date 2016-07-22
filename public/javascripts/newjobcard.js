
$(document).ready(function() {



    function ExportToExcel(mytblId){
        var htmltable= document.getElementById(mytblId);
        var html = htmltable.outerHTML;
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
        }

    function ExportAllTablesToExcel(){

        var html;
        var table_html = '<table><tr>';
        //go through all tables
        $('table.market-row').each(function(){
            //add their HTML to our big HTML string
            table_html += '<tr><table>' + $(this).html() + '</table></tr>';
            //remove that table from the page
          //  html+=$(this.outerHTML);
        });

        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(table_html));
    }




    $('#open').click(function () {
        if ($(this).text() == "expand all")
        {
        $(this).text("colapse all")
        $('.ui-accordion-header').removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({'aria-selected':'true','tabindex':'0'});
        $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
        $('.ui-accordion-content').addClass('ui-accordion-content-active').attr({'aria-expanded':'true','aria-hidden':'false'}).show();
        }
        else
        {
            $(this).text("expand all")
            $('.ui-accordion-header').removeClass('ui-accordion-header-active ui-state-active ui-corner-top').addClass('ui-corner-all').attr({'aria-selected':'false','tabindex':'-1'});
            $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
            $('.ui-accordion-content').removeClass('ui-accordion-content-active').attr({'aria-expanded':'false','aria-hidden':'true'}).hide();
        }
    });



    $(function() {
        $( "#accordion" ).accordion({
         /*   heightStyle: "content",*/
            collapsible: true,
            autoHeight: false
        });
    });

    $("#accordion").accordion({ active: 0});

    $('#open').text("colapse all")
    $('.ui-accordion-header').removeClass('ui-corner-all').addClass('ui-accordion-header-active ui-state-active ui-corner-top').attr({'aria-selected':'true','tabindex':'0'});
    $('.ui-accordion-header .ui-icon').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
    $('.ui-accordion-content').addClass('ui-accordion-content-active').attr({'aria-expanded':'true','aria-hidden':'false'}).show();


});