package controllers;

import models.Saleitem;
import models.User;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import quickbooks.Queue;

import java.util.Date;

import static play.data.Form.form;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/3/13
 * Time: 10:25 PM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Saleitems_rd extends Controller {
    public static Result addSaleitem() {
        if (Secured.hasManagerAccess()) {
            Saleitem newSaleitem = Saleitem.addBlank(
                    form().bindFromRequest().get("job"),
                    form().bindFromRequest().get("plan")
            );
            return ok(views.html.saleitems.saleitem_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    newSaleitem));
        } else {
            return forbidden();
        }
    }



    public static Result deleteSaleitem(Long saleitem) {
        if (Secured.hasManagerAccess()) {
            Saleitem.find.ref(saleitem).delete();
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result updateSaleitem(Long id) {
        if (Secured.hasManagerAccess()) {
            Saleitem saleitem = Saleitem.find.byId(id);
            String so = form().bindFromRequest().get("so");
            if (so!=null&&!so.equals("null")&&saleitem.job.item!=null) {
                if (so.equals("")&&saleitem.qb_refnumber!=null) {
                    saleitem.qb_refnumber = null;
                    saleitem.qb_txnid = null;
                    saleitem.qb_editsequence = null;
                    saleitem.qb_txnlineid = "-1";
                    saleitem.update();
                } else if (!so.equals("")) {
                    if (saleitem.qb_refnumber==null||!saleitem.qb_refnumber.equals(so)) {
                        if (!so.equals("...")) {
                            saleitem.qb_txnid = null;
                            saleitem.qb_editsequence = null;
                            saleitem.qb_txnlineid = "-1";
                        }
                        saleitem.qb_refnumber = so;
                        saleitem.update();
                    }

                    if (so.equals("...")||(saleitem.qb_txnid!=null&&saleitem.qb_editsequence!=null&&saleitem.qb_txnlineid!="-1"))
                    {
                        if (!so.equals("...")) {
                            saleitem.qb_refnumber = "...";
                            saleitem.update();
                        }

                        Queue queue = new Queue();
                        queue.username = quickbooks.User.find.byId("qbffi");
                        queue.action = "SalesOrderMod";
                        queue.ident = id.toString();
                        queue.extra = "";
                        queue.qbxml = "";
                        queue.priority = 1;
                        queue.status = Character.forDigit(26,36);
                        queue.enqueueDatetime = new Date();
                        queue.save("quickbooks");
                    }
                }
            }
            return ok(
                    Saleitem.update(
                            id,
                            form().bindFromRequest().data()
                    )
            );
        } else {
            return forbidden();
        }
    }
}
