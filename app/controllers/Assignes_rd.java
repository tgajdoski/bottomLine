package controllers;

import com.avaje.ebean.*;
import models.*;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import quickbooks.Queue;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static play.data.Form.form;
import static play.libs.Json.toJson;

import org.codehaus.jackson.JsonNode;
import play.mvc.BodyParser;

@Security.Authenticated(Secured.class)

public class Assignes_rd extends Controller {


    public static Result index() {
        return ok();
    }


/*

    public static Result saveAssignsNew() {
        if (Secured.hasManagerAccess()) {
            String datetask = form().bindFromRequest().get("datetask");
            String date = form().bindFromRequest().get("datetask");
            String[] splitDate = date.split("-");
            // if exists
            Assigns ass = Assigns.find.where().eq("taskid", Long.parseLong(form().bindFromRequest().get("taskid"))).findUnique();
            if (ass!=null)
                ass.delete();


            Assigns assign = new Assigns();
            assign.jobid = Long.parseLong(form().bindFromRequest().get("jobid"));
            assign.taskid = Long.parseLong(form().bindFromRequest().get("taskid"));

            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String date = form().bindFromRequest().get("datetask");
            try {
                if (date!=null) {
                    assign.datetask = format.parse(date);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            assign.fieldmanagerid = Long.parseLong(form().bindFromRequest().get("fieldid"));

            User fm = User.find.byId(assign.fieldmanagerid);

            final User u = Application.getLocalUser(session());
            assign.assigneby = u.id;
            assign.dateassign = new Date();


            assign.save();
            assign.refresh();

            return ok(toJson(fm.name));
        } else {
            return forbidden();
        }
    }

*/


    public static Result updateAssign(Long id) {
        if (Secured.hasManagerAccess()) {

            // if exists
            Assigns ass = Assigns.find.where().eq("taskid",id ).findUnique();
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String date = form().bindFromRequest().get("date");


            if (ass!=null)
            {
                try {
                    if (date!=null) {
                        ass.datetask = format.parse(date);

                        ass.save();
                    }
                } catch (ParseException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
            }
        }
        return ok();
    }



    public static Result saveAssign() {
        if (Secured.hasManagerAccess()) {

            // if exists
           Assigns ass = Assigns.find.where().eq("taskid", Long.parseLong(form().bindFromRequest().get("taskid"))).findUnique();
           if (ass!=null)
                ass.delete();


            Assigns assign = new Assigns();
            assign.jobid = Long.parseLong(form().bindFromRequest().get("jobid"));
            assign.taskid = Long.parseLong(form().bindFromRequest().get("taskid"));

            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String date = form().bindFromRequest().get("datetask");
            try {
                if (date!=null) {
                    assign.datetask = format.parse(date);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            String fmanger = form().bindFromRequest().get("fieldid");
            if (fmanger!="0")
                assign.fieldmanagerid = Long.parseLong(fmanger);
            else
                assign.fieldmanagerid = 0l;


             User fm = User.find.byId(assign.fieldmanagerid);

            final User u = Application.getLocalUser(session());
            assign.assigneby = u.id;
            assign.dateassign = new Date();


            assign.save();
            assign.refresh();
            if (!fmanger.endsWith("0"))
                return ok(toJson(fm.name));
            else
                return ok();
        } else {
            return forbidden();
        }
}


    public static Result editAssign() {
        if (Secured.hasManagerAccess()) {
         //   Assigns assign = Assigns.find.where().eq("id", id).finduni;
            String strigngo = form().bindFromRequest().get("id");
            Long idno = Long.parseLong(strigngo);
            Assigns assign = Assigns.find.where().eq("taskid", idno).findUnique();
            User fm = new User();
            String fmanger = form().bindFromRequest().get("fieldid");

            if (assign != null)
            {
                /*
                assign.jobid = Long.parseLong(form().bindFromRequest().get("jobid"));
                assign.taskid = Long.parseLong(form().bindFromRequest().get("taskid"));

                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                String date = form().bindFromRequest().get("datetask");
                try {
                    if (date!=null) {
                        assign.datetask = format.parse(date);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                */

                // if exists
               // Assigs ass = Assigns.find.where().eq("taskid", Long.parseLong(form().bindFromRequest().get("taskid"))).findUnique();
               // ass.delete();


              //  assign.fieldmanagerid = Long.parseLong(form().bindFromRequest().get("fieldid"));
                if (fmanger!="0")
                    assign.fieldmanagerid = Long.parseLong(fmanger);
                else
                    assign.fieldmanagerid = 0l;

                fm = User.find.byId(assign.fieldmanagerid);

                final User u = Application.getLocalUser(session());
                assign.assigneby = u.id;
                assign.dateassign = new Date();

                assign.update();
                assign.refresh();
            }
            if (!fmanger.endsWith("0"))
                return ok(toJson(fm.name));
            else
                return ok();
        } else {
            return forbidden();
        }



    }



}
