package controllers;

import models.*;
import play.Logger;
import play.Play;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.restricted_rd;
import static play.data.Form.form;

import com.feth.play.module.mail.Mailer;
import com.feth.play.module.mail.Mailer.Mail.Body;

import javax.swing.text.html.HTML;
import java.util.ArrayList;
import java.util.List;

@Security.Authenticated(Secured.class)
public class Home_rd extends Controller {
    public static Result test() {
        if (Play.isDev()) {
            return ok(
                    /*views.html.test.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            User.find.all(),
                            ItemType.find.all(),
                            JobCategory.find.all())*/
            );
        } else {
            return forbidden(/*restricted.render(Application.getLocalUser(session()))*/);
        }
    }

    public static Result index() {
        if (Secured.hasGuestAccess()) {

            String market = request().getQueryString("market");
            return ok(views.html.index_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    ItemType.find.all(),
                    JobCategory.find.all(),
                    market
            ));
        } else {
            return forbidden(/*restricted.render(Application.getLocalUser(session()))*/);
        }
    }


    public static Result getUserSelect() {
        if (Secured.hasAdministratorAccess()) {
             return ok(views.html.userselect.render(User.find.all()));
        } else {
            return forbidden();
        }
    }

    public static Result getCrewLeader() {
        if (Secured.hasAdministratorAccess()) {

            return ok(views.html.userselect.render(User.find.where().eq("authority", "1").findList()));
        } else {
            return forbidden();
        }
    }





    public static Result sendEmailTest() {
        if (Secured.hasAdministratorAccess()) {
            return ok(views.html.sendemail.render(User.find.byId(Long.parseLong(request().username()))));
        } else {
            return forbidden();
        }
    }

    public static Result sendemail() {
        if (Secured.hasAdministratorAccess()) {

            String to = form().bindFromRequest().get("to");
            String from = form().bindFromRequest().get("from");
            String subject = form().bindFromRequest().get("subject");
            String bd = form().bindFromRequest().get("body");


            final Mailer defaultMailer = Mailer.getDefaultMailer();


          //  font=10&blocks=3-&jobid=52134

            String blocks = "3-4-";
            String font = "10";
            String jobid = "52134";

            Long id = Long.parseLong(jobid);
            Job job = Job.find.byId(id);

            List<Assigns> asslist = new ArrayList<Assigns>();
            asslist = Assigns.find.where().eq("jobid", jobid).findList(); //.isNull("tasktypeid")
            List<Task> tasks = Task.findByJob(id);


         /*
            Body body = new Body("", "from : " + from + "<br> <br>  " +  views.html.print.job_rd_new_print.render(
                    User.find.byId(Long.parseLong(request().username())),
                    job,
                    JobCategory.find.all(),
                    PlanItem.find.all(),
                    Lineitem.findBudgetLineitemsByJob(id),
                    Lineitem.findActualLineitemsByJob(id),
                    tasks,
                    User.find.all(),
                    asslist
            ));
*/
            Body body = new Body("", "from : " + from + "<br> <br>  " +  bd);

            final Mailer.Mail csutomemail = new Mailer.Mail(subject, body, new String[] {to});
            defaultMailer.sendMail(csutomemail);

            return ok();
        } else {
            return forbidden();
        }
    }
}
