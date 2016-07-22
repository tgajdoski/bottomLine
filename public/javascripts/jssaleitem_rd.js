var Saleitem, Saleitems,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Saleitems = (function(_super) {
    __extends(Saleitems, _super);

    function Saleitems() {
        return Saleitems.__super__.constructor.apply(this, arguments);
    }

    Saleitems.prototype.events = {
        "click    #addSaleitem": "addSaleitem"
    };

    Saleitems.prototype.initialize = function() {
        return this.el.find("tbody>tr").each(function(i, saleitem) {
            return new Saleitem({
                el: $(saleitem)
            });
        });
    };

    Saleitems.prototype.addSaleitem = function(e) {
        var target;
        target = $(e.currentTarget);
        return jsRoutes.controllers.Saleitems.addSaleitem().ajax({
            data: {
                job: $("#totals").attr("data-job-id"),
                plan: $("#totals").attr("data-plan-id")
            },
            success: function(data) {
                var _view;
                return _view = new Saleitem({
                    el: $(data).appendTo("#saleitems table tbody")
                });
            },
            error: function(err) {
                return alert("There was an error adding the sale item! Please refresh the page and try again.");
            }
        });
    };

    return Saleitems;

})(Backbone.View);

Saleitem = (function(_super) {
    __extends(Saleitem, _super);

    function Saleitem() {
        return Saleitem.__super__.constructor.apply(this, arguments);
    }

    Saleitem.prototype.events = {
        "click    .deleteSaleitem": "deleteSaleitem",
        "change   .name,.quantity,.units,.rate": "updateSaleitem",
        "click    .invoice": "updateSaleitem",
        "dblclick .salesorder": "updateSaleitem",
        "change   .saleprice": "recalculate"
    };

    Saleitem.prototype.initialize = function() {
        this.id = this.el.attr("data-saleitem-id");
        this.name = this.el.find("td:eq(1) textarea").autogrow();
        this.quantity = this.el.find("td:eq(2) input");
        this.units = this.el.find("td:eq(3) input");
        this.rate = this.el.find("td:eq(4) input");
        return this.recalculate();
    };

    Saleitem.prototype.deleteSaleitem = function(e) {
        e.preventDefault();
        if (confirm('Are you sure?')) {
            return jsRoutes.controllers.Saleitems.deleteSaleitem(this.id).ajax({
                context: this,
                success: function() {
                    this.el.remove();
                    return this.recalculate();
                },
                error: function(err) {
                    return alert("There was an error deleting the sale item! Please refresh the page and try again.");
                }
            });
        }
    };

    Saleitem.prototype.updateSaleitem = function(e) {
        var so, target;
        target = $(e.currentTarget);
        so = this.el.find(".salesorder").html();
        if (target.hasClass("invoice") || target.hasClass("salesorder")) {
            so = prompt("Please enter a Sales Order #, or just click OK to add line automatically.", "...");
        }
        return jsRoutes.controllers.Saleitems.updateSaleitem(this.id).ajax({
            context: this,
            data: {
                name: this.name.val(),
                quantity: this.quantity.val(),
                rate: this.rate.val(),
                units: this.units.val(),
                saleprice: parseFloat(this.quantity.val()) * parseFloat(this.rate.val()),
                so: so
            },
            success: function() {
                if (target.hasClass("invoice") || target.hasClass("salesorder")) {
                    if (($("#totals").attr("data-saleitem-id").length)) {
                        return target.replaceWith($("<span/>").attr("class", "salesorder").html(so));
                    } else {
                        return alert("Select a SALEITEM before invoicing!");
                    }
                } else if (!target.hasClass("name") && !target.hasClass("units")) {
                    return this.recalculate();
                }
            },
            error: function(err) {
                return alert("There was an error updating the sale item! Please refresh the page and try again.");
            }
        });
    };

    Saleitem.prototype.recalculate = function() {
        var fprofit, left, mprofit, pctprofit, ppsqft, sale, total, totalsqft;
        this.el.find(".saleprice").val((parseFloat(this.quantity.val()) * parseFloat(this.rate.val())).toFixed(2));
        sale = 0;
        $("#saleitems").find(".saleprice").each(function(i, sp) {
            return sale += parseFloat($(sp).val());
        });
        $("#saleprice>span").html(sale.toFixed(2));
        $("#totals").attr("data-sale", sale);
        $("#actual .saleprice").html(sale.toFixed(2));
        total = parseFloat($("#totals").attr("data-cost"));
        ppsqft = 0;
        totalsqft = parseFloat($("#totalsqft").html());
        if (totalsqft > 0) {
            ppsqft = sale / totalsqft;
        }
        $("#totals").attr("data-ppsqft", ppsqft);
        $("#grossprofit").html((sale - total).toFixed(2));
        pctprofit = 0;
        if (sale > 0) {
            pctprofit = 100 * (1 - total / sale);
        }
        $("#pctprofit").html(pctprofit.toFixed(2));
        $("#ppsqft").html(ppsqft.toFixed(2));
        if (($("#actual").length)) {
            $("#actual .overhead").html((sale * parseFloat($("#actual").attr("data-op-multiplier"))).toFixed(2));
            if ($("#actual .cost").html() !== "") {
                $("#actual .markup").html((parseFloat($("#actual .cost").html()) / sale).toFixed(2));
            }
            if ($("#actual .actualcost").html() !== "") {
                $("#actual .actualmarkup").html((parseFloat($("#actual .actualcost").html()) / sale).toFixed(2));
            }
            left = parseFloat($("#actual .diffcost").html());
            mprofit = ((sale-total)>0)?(left>0)?((sale-total)*.15+left*.5):((sale-total)*.15+left):0;
            fprofit = ((sale-total)>0)?(left>0)?((sale-total)*.85+left*.5):((sale-total)*.85):(sale-total);
            $("#managerprofit").html(mprofit.toFixed(2));
            return $("#ffiprofit").html(fprofit.toFixed(2));
        }
    };

    return Saleitem;

})(Backbone.View);

$(function() {
    var saleitems;
    return saleitems = new Saleitems({
        el: $("#saleitems")
    });
});
