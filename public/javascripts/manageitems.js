$(document).ready(function() {


    $("#items").DataTable({
        "sDom": '<"H"lT>frt<"F"ip>',

        "oTableTools": {
            "sSwfPath":  "/assets/play-jquery-tabletools/swf/copy_cvs_xls_pdf.swf",
            "aButtons" : ["xls", "copy", "csv", "pdf"]
        }
    });


    $('#itemmodal').hide();
    $('.newitem').hide();


    $( "#qbexport").click(function(){

        window.location.href = jsRoutes.controllers.Vendors_rd.itemQBexcelExport().url  + location.search
    });

    $('#newItemtype').change(
        function()
        {
            if ($('#newItemtype')[0].selectedIndex > 0)
            {
                $('.newitem').show();
            }else
            {
                $('.newitem').hide();
            }
        });


    $("#items tbody").on("click", "tr td .actinact", function(){
            var returnVal = $(this).is(":checked");
            // alert($(this).val().toString() + returnVal);
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var vendoridno = $(this).val();
            jsRoutes.controllers.Vendors_rd.updateItemActive().ajax(
                {
                    data: {
                        itemid: vendoridno,
                        active: returnVal
                    },
                    success: function(data) {
                        if (returnVal)
                            var n = noty({type: 'success', text: 'Item ' + a + ' is active.',  timeout: 3000});
                        else
                            var n = noty({type: 'success', text: 'Item ' + a + ' is inactive.',  timeout: 3000});
                    },
                    error: function(err) {
                        return alert("There was an error changing the customer! Please refresh the page and try again.");
                    }
                });
        }
    );



    $("#buttonadditem").click(function()
        {
            if ($('#addorupdate').val() == 0)
            {
                jsRoutes.controllers.Vendors_rd.addItem().ajax(
                    {
                        data: {
                            itemType: $("#newItemtype").find("option:selected").val(),
                            name: $("#newItemName").val()
                        },
                        success: function(data) {
                            $('#itemdivselectedtext').text("Item " + data["name"]);
                            $('input[name="id"]').val(data["id"]);
                            $('input[name="name"]').val(data["name"]);

                            $('#itemmodal').hide();
                            window.location.href = "/admin/vendors/items";

                        },
                        error: function(err) {
                            return alert("There was an error adding the customer! Please refresh the page and try again.");
                        }
                    }
                );
            }
            else
            {
                jsRoutes.controllers.Vendors_rd.updateItem().ajax(
                    {
                        data: {
                            id: $('input[name="id"]').val(),
                            itemType: $("#newItemtype").find("option:selected").val(),
                            name: $("#newItemName").val()
                        },
                        success: function(data) {
                            var n = noty({type: 'success', text: 'Item ' + $("#newItemName").val() + ' was updated',  timeout: 2000});
                            $('#itemmodal').hide();
                            window.location.href = "/admin/vendors/items";

                        },
                        error: function(err) {
                            return alert("There was an error adding the customer! Please refresh the page and try again.");
                        }
                    }
                );
            }
 });


    function populatedatatableitems(idto){

    }



    // updateItem



    function openwhatneeded(){
        $('#itemmodal').show();
        if($('#addorupdate').val()==0)
        {
            //

        }
        else
        {
            // update vendor

        }
    }


    $("#linkaddnewvendor").click(function() {
        $('#addorupdate').val(0);
        $('#itemdivselectedtext').text("Add new item");
        openwhatneeded();
    });


    $("#items tbody").on("click", "tr td .clicka", function(){
        // znaci sakame update
        $('#addorupdate').val(1);
        openwhatneeded();
        $('.newitem').show();
        $('#itemdivselectedtext').text("Item  " + $(this).closest('tr').find("td:nth-child(2)").text());
        $("#dataDiv").val($(this).closest('tr').attr("data-user-id"));
        $('input[name="id"]').val($(this).closest('tr').attr("data-user-id"));

        populatefields($(this).closest('tr').attr("data-user-id"));


        // ke ni treba update na tabelata
      //  populatedatatableitems(data["id"]);

    });



    function populatefields(idto){

        jsRoutes.controllers.Vendors_rd.getItemByid(idto).ajax(
            {
                data: {
                    id:idto
                },
                success: function(datasub) {
                    /*  var c = jQuery.parseJSON( datasub );*/
                    if ( datasub.itemType.name != null)
                    {
                        $("#newItemtype").find("option[value='" + datasub.itemType.id + "']").attr("selected", "selected").end().change();
                    }
                    $( '#newItemName').val( datasub['name'] );
                    $( '#buttonadditem').val( 'Update Item');
                },
                error: function(err) {
                    return alert("There was an error reading the item information! Please refresh the page and try again.");
                }
            }
        );

    };




            $("#items tbody").on("click", "tr td .deleteUser", function(){
            var d = $(this).closest('tr');
            var a = $(this).closest('tr').find("td:nth-child(2)").text();
            var context;
            context = this;
            if (confirm("Are you sure?")) {
                return jsRoutes.controllers.Vendors_rd.deleteItem().ajax({
                    data: {
                        id: $(this).closest('tr').attr("data-user-id")
                    },
                    success: function(data) {
                        var n = noty({type: 'success', text: 'Item  ' + a + ' was deleted',  timeout: 3000});
                        return d.remove();
                    },
                    error: function(err) {
                        return alert("There was an error deleting the market! Please refresh the page and try again.");
                    }
                });
            }
    });


    $(".close").click(function() {
        $('#itemmodal').hide();
    });

    $("#close").click(function() {
        $('#itemmodal').hide();
    });



});
