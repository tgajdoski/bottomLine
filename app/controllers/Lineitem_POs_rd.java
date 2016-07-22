package controllers;

import com.avaje.ebean.*;
import models.Assigns;
import models.Lineitempos;
import models.User;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static play.data.Form.form;
import static play.libs.Json.toJson;

@Security.Authenticated(Secured.class)

public class Lineitem_POs_rd extends Controller {


    public static Result index() {
        return ok();
    }




    public static Result updatePo(Long id) {
        if (Secured.hasManagerAccess()) {
            String lineitemid = form().bindFromRequest().get("lineitemid");
            String taskid = form().bindFromRequest().get("taskid");
            String fromwhere = form().bindFromRequest().get("fromwhere");
            String historyflag = form().bindFromRequest().get("historyflag");
            String notes = form().bindFromRequest().get("notes");
            // if exists
            Lineitempos ass = Lineitempos.find.byId(id);
            if (ass!=null)
            {

                    Date date = new Date();
                        ass.datepurchase = date;
                        ass.lineitemid = Long.parseLong(lineitemid);
                        ass.taskid = Long.parseLong(taskid);
                        ass.fromwhere = Long.parseLong(fromwhere);
                        ass.historyflag = Long.parseLong(historyflag);
                        ass.notes = notes;
                        ass.purchaseby = Long.parseLong(request().username());
                        ass.update();
                        ass.refresh();
            }
            return ok();
        }else {
            return forbidden();
        }
    }


    public static Result savePo() {
        if (Secured.hasManagerAccess()) {

            String lineitemid = form().bindFromRequest().get("lineitemid");
            String taskid = form().bindFromRequest().get("taskid");
            String fromwhere = form().bindFromRequest().get("fromwhere");
            String historyflag = form().bindFromRequest().get("historyflag");
            String notes = form().bindFromRequest().get("notes");



            // if exists so history 0 znaci aktivno
            Lineitempos ass = Lineitempos.find.where().eq("taskid", Long.parseLong(taskid)).eq("lineitemid", Long.parseLong(lineitemid)).eq("historyflag",0).findUnique();
            if (ass!=null)
            {
                ass.historyflag = 1l;
                ass.update();
                ass.refresh();
            }

            if (historyflag.equals("0"))
            {
                Lineitempos asshh  = new Lineitempos();
                if (asshh!=null)
                {
                    Date date = new Date();
                    asshh.datepurchase = date;
                    asshh.lineitemid = Long.parseLong(lineitemid);
                    asshh.taskid = Long.parseLong(taskid);
                    asshh.fromwhere = Long.parseLong(fromwhere);
                    asshh.historyflag = 0l;
                    asshh.notes = historyflag;
                    asshh.purchaseby = Long.parseLong(request().username());
                    asshh.save();
                    asshh.refresh();
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }

}
