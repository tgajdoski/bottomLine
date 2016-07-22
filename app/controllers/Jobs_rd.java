package controllers;

import com.avaje.ebean.*;
import models.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import quickbooks.Queue;

import util.pdf.PDF;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import org.joda.time.format.*;
import org.joda.time.DateTime;

import static play.data.Form.form;
import static play.libs.Json.toJson;


import com.feth.play.module.mail.Mailer;
import com.feth.play.module.mail.Mailer.Mail.Body;


/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/3/13
 * Date: 6/3/13
 * Time: 11:28 AM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Jobs_rd extends Controller {
    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok();
        } else {
            return forbidden();
        }
    }




    public static boolean ChecknewJob (Job j){
        boolean b = true;
        int counter = 0;
        if (j.plan != null)
        {
            for (Lineitem l : j.plan.lineitems) {
                if (l.position == 0 && l.itemType!=null)
                    counter++;
            }
        }
        /*else
            b = false;
        */
        if (counter >1)
            b = false;
        return b;
    }

    public static Result loadJob(Long id) {
        if (Secured.hasGuestAccess()) {
            Job job = Job.find.byId(id);


            List<Assigns> asslist = new ArrayList<Assigns>();
            asslist = Assigns.find.where().eq("jobid", id).findList(); //.isNull("tasktypeid")
            List<Task> tasks = Task.findByJob(id);
           // List<BudgetItem> budgetItems = BudgetItem.find.where("job_id", id); // .findBudgetLineitemsByJob(id)



            if (ChecknewJob(job))
            {
               // response.setHeader("Cache-Control", "no-cache");
            return ok(
                    views.html.job_rd_new.render(
                            User.find.byId(Long.parseLong(request().username())),
                            job,
                           // JobCategory.find.all(),
                            JobCategory.find.where().eq("Active", 1).findList(),
                            PlanItem.find.all(),
                            Lineitem.findBudgetLineitemsByJob(id),
                            Lineitem.findActualLineitemsByJob(id),
                            tasks,
                            User.find.all(),
                            asslist
                    )
            );
            }
            else
            {
                return ok(
                        views.html.job_rd.render(
                                User.find.byId(Long.parseLong(request().username())),
                                job,
                                //JobCategory.find.all(),
                                JobCategory.find.where().eq("Active", 1).findList(),
                                PlanItem.find.all(),
                                Lineitem.findBudgetLineitemsByJob(id),
                                Lineitem.findActualLineitemsByJob(id),
                                Task.findByJob(id)
                        )
                );
            }
        } else {
            return forbidden();
        }
    }






    public static Result loadOldJob(Long id) {
        if (Secured.hasGuestAccess()) {
            Job job = Job.find.byId(id);


            List<Assigns> asslist = new ArrayList<Assigns>();
            asslist = Assigns.find.where().eq("jobid", id).findList(); //.isNull("tasktypeid")
            List<Task> tasks = Task.findByJob(id);
            // List<BudgetItem> budgetItems = BudgetItem.find.where("job_id", id); // .findBudgetLineitemsByJob(id)
            return ok(
                    views.html.job_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            job,
                          //  JobCategory.find.all(),
                            JobCategory.find.where().eq("Active", 1).findList(),
                            PlanItem.find.all(),
                            Lineitem.findBudgetLineitemsByJob(id),
                            Lineitem.findActualLineitemsByJob(id),
                            Task.findByJob(id)
                    )
            );

        } else {
            return forbidden();
        }
    }


    public static Result loadNewJob(Long id) {
        if (Secured.hasGuestAccess()) {
            Job job = Job.find.byId(id);


            List<Assigns> asslist = new ArrayList<Assigns>();
            asslist = Assigns.find.where().eq("jobid", id).findList(); //.isNull("tasktypeid")
            List<Task> tasks = Task.findByJob(id);
            // List<BudgetItem> budgetItems = BudgetItem.find.where("job_id", id); // .findBudgetLineitemsByJob(id)
                return ok(
                        views.html.job_rd_new.render(
                                User.find.byId(Long.parseLong(request().username())),
                                job,
                              //  JobCategory.find.all(),
                                JobCategory.find.where().eq("Active", 1).findList(),
                                PlanItem.find.all(),
                                Lineitem.findBudgetLineitemsByJob(id),
                                Lineitem.findActualLineitemsByJob(id),
                                tasks,
                                User.find.all(),
                                asslist
                        )
                );

        } else {
            return forbidden();
        }
    }



    public static Result getTaskNotesPerDay() {
        if (Secured.hasGuestAccess()) {
            String jobid = form().bindFromRequest().get("jobid");
            String datumo = form().bindFromRequest().get("datumo");

            Date datumjob = new Date();
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                if (datumo!=null&&datumo!="") {
                    datumjob = format.parse(datumo);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String taskDate = df.format(datumjob);



            List<Task> tsks = Task.find.where().eq("job_id", jobid).eq("date" ,taskDate ).findList();
            String notes =  "";
            for(Task t: tsks)
            {
                if (t!=null && t.notes != null)
                    notes += t.notes +  "     ";
            }

            return ok(toJson(notes));
        } else {
            return forbidden();
        }
    }


    public static Result getJobforActuals(Long id) {
        if (Secured.hasGuestAccess()) {
            Job job = Job.find.byId(id);
            return ok(toJson(job));
        } else {
            return forbidden();
        }
    }


    public static Result getselectedJoblineitems(Long id) {
        if (Secured.hasGuestAccess()) {
            List<Lineitem> litem;
            List<Long> listitemsid = new ArrayList<Long>();
           /* try
            {*/
            String taskid = form().bindFromRequest().get("taskid");


               litem = Lineitem.find.where().eq("job.id",id).eq("task_id",taskid).isNull("taskType").findList();
                //    litem = Lineitem.findActualLineitemsByJob(id);
                for (Lineitem li : litem)
                {
                    boolean imaveke = false;
                    Lineitem litest = null;
                    if (li.vendor != null && li.item != null)
                        try{
                            litest = Lineitem.find.where().eq("job.id",id).eq("task_id",taskid).eq("vendor.id",li.vendor.id).eq("item.id",li.item.id).isNotNull("taskType").findUnique();
                        }
                        catch(Exception ex){
                            imaveke = true;
                        }
                    if (litest != null)
                        imaveke = true;
                    if (!imaveke)
                        listitemsid.add(li.id);
                }
           /* }
            catch(Exception ex){}*/
            // findActualLineitemsByJob
            return ok(toJson(listitemsid));
        } else {
            return forbidden();
        }
    }



    public static Result getselectedJobActuallineitems(Long id) {
        if (Secured.hasGuestAccess()) {


            String taskid = form().bindFromRequest().get("taskid");

            List<Lineitem> litem;
            List<Long> listitemsid = new ArrayList<Long>();
            litem = Lineitem.find.where().eq("job.id",id).eq("task.id",taskid).isNotNull("taskType").findList();
          /*  for (Lineitem li : litem)
            {
                listitemsid.add(li.id);
            }*/
            return ok(toJson(litem));
        } else {
            return forbidden();
        }
    }





    public static Result getselectedJobActuallineitemsLaborPerLineitemORG(Long id) {
        if (Secured.hasGuestAccess()) {
            String taskid = form().bindFromRequest().get("taskid");
            String lineitemidno = form().bindFromRequest().get("lineitemORG");

            Lineitem lzs = null;
            if (lineitemidno != null && lineitemidno != "")
                lzs = Lineitem.find.byId(Long.parseLong(lineitemidno));
            List<Lineitem> litem;
            List<Long> listitemsid = new ArrayList<Long>();


            if (lzs == null)
                litem = Lineitem.find.where().eq("job.id",id).eq("task.id",taskid).eq("item_type_id", 1).isNull("taskType").findList();
            else
                litem = Lineitem.find.where().eq("job.id", id).eq("task.id",taskid).eq("item_type_id", 1).eq("position", lzs.id).isNotNull("taskType").findList();

            return ok(toJson(litem));
        } else {
            return forbidden();
        }
       /* DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String reportDate = df.format(datumjob);*/
      /*  if (Secured.hasGuestAccess()) {
            String taskid = form().bindFromRequest().get("taskid");
            String lineitemORG = form().bindFromRequest().get("lineitemidORG");
            List<Lineitem> litem;
            Task t = Task.find.byId(Long.parseLong(taskid));

            if (t != null &&  t.date != null)
                if (lineitemORG== "")
                    litem = Lineitem.find.where().eq("job.id", id).eq("task.id", taskid).eq("item_type_id",1).eq("daysdate", t.date).isNull("taskType").findList();
                else
                {
                    Lineitem org = Lineitem.find.byId(Long.parseLong(lineitemORG));
                    if (org !=null)
                        litem = Lineitem.find.where().eq("job.id", id).eq("task.id", taskid).eq("item_type_id",1).eq("daysdate", t.date).eq("position", org.id).isNull("taskType").findList();
                    else
                        litem = Lineitem.find.where().eq("job.id", id).eq("task.id", taskid).eq("item_type_id",1).eq("daysdate", t.date).isNull("taskType").findList();
                }
            else
                litem = Lineitem.find.where().eq("job.id", id).eq("task.id", taskid).eq("item_type_id",1).isNull("taskType").findList();

            return ok(toJson(litem));
        } else {
            return forbidden();
        }*/
    }

    public static Result getselectedJobActuallineitemsLaborUser(Long id) {

        if (Secured.hasGuestAccess()) {
            String taskid = form().bindFromRequest().get("taskid");
            List<Lineitem> litem;
            Task t = Task.find.byId(Long.parseLong(taskid));

            if (t != null &&  t.date != null)
                litem = Lineitem.find.where().eq("job.id", id).eq("task.id", taskid).eq("item_type_id",1).isNull("taskType").findList();
            else
                litem = Lineitem.find.where().eq("job.id", id).eq("task.id", taskid).eq("item_type_id",1).isNull("taskType").findList();
            return ok(toJson(litem));
        } else {
            return forbidden();
        }
    }


    public static Result getselectedJobActuallineitemsbyLineItem(Long id) {
        if (Secured.hasGuestAccess()) {


            String taskid = form().bindFromRequest().get("taskid");
            String lineitemidno = form().bindFromRequest().get("lineitemid");

            Lineitem lzs = null;
            if (lineitemidno != null && lineitemidno != "")
                lzs = Lineitem.find.byId(Long.parseLong(lineitemidno));
            List<Lineitem> litem;
            List<Long> listitemsid = new ArrayList<Long>();

            if (lzs == null)
                litem = Lineitem.find.where().eq("job.id",id).eq("task.id",taskid).isNotNull("taskType").findList();
            else
            {
                if (lzs.itemType.id == 1) // .eq("position", lzs.id).eq("item_type_id", lzs.itemType.id)
                    litem = Lineitem.find.where().eq("job.id", id).eq("task.id",taskid).eq("position", lzs.id).eq("item_type_id", 1).isNotNull("taskType").findList();
                else
                    litem = Lineitem.find.where().eq("job.id", id).eq("task.id",taskid).eq("item_type_id", lzs.itemType.id).eq("vendor.id", lzs.vendor.id).eq("item.id", lzs.item.id).isNotNull("taskType").findList();
            }
            // ovde treba da se zemat istite
          /*  for (Lineitem li : litem)
            {
                listitemsid.add(li.id);
            }*/
                return ok(toJson(litem));
        } else {
            return forbidden();
        }
    }



    public static Result getsinglelineitem(Long id) {
        if (Secured.hasGuestAccess()) {
            Lineitem litem = Lineitem.find.byId(id);

            return ok(toJson(litem));
        } else {
            return forbidden();
        }
    }


    public static Integer checkCountTotal(Long jobid, Long taskid)
    {
        List<Lineitem> lms = Lineitem.find.where().eq("task_id", taskid).eq("job_id", jobid).isNotNull("task_type_id").findList();
        return lms.size();
    }

    public static void CheckDeleteTasksAssignemts( Long jobid, String datumot)
    {

        List<Task> tsks = Task.find.where().eq("job_id", jobid).eq("date" ,datumot ).findList();
        List<Long> taskid =  new ArrayList<Long>();


        for(Task t: tsks)
        {
            List<Lineitem> lmt = Lineitem.find.where().eq("task_id", t.id).eq("job_id", jobid).isNotNull("task_type_id").findList();
            if (lmt.size() == 0)
                taskid.add(t.id);
        }

        for (Long l:taskid)
        {
            Assigns ass = Assigns.find.where().eq("taskid", l).findUnique();
            if (ass!=null)
                ass.delete();
            Task t = Task.find.byId(l);
            if (t!=null)
                t.delete();
        }

    }



    public static Result getsinglelineitempersentage(Long id) {
        if (Secured.hasGuestAccess()) {
            List<LineitemPercentage> litemper = LineitemPercentage.find.where().eq("lineitem_id",id).findList();
            return ok(toJson(litemper));
        } else {
            return forbidden();
        }
    }


    public static Result deleteJob() {
        if (Secured.hasAdministratorAccess()) {
            Job job = Job.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            job.delete();
            return redirect(routes.Home_rd.index());
        } else {
            return forbidden();
        }
    }

    public static Result updateJob() {
        if (Secured.hasManagerAccess()) {
            Job job = Job.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            String market = form().bindFromRequest().get("market");
            if (market!=null && !market.equals("")) {
                job.market = Market.find.byId(Long.parseLong(market));
            }
            String jobCategory = form().bindFromRequest().get("category");
            if (jobCategory!=null && !jobCategory.equals("")) {
                job.jobCategory = JobCategory.find.byId(Long.parseLong(jobCategory));
            }
            String notes = form().bindFromRequest().get("notes");
            if (notes!=null) {
                job.notes = notes;
            }
            String lot = form().bindFromRequest().get("lot");
            if (lot!=null) {
                job.lot = lot.trim();
            }
            String saleitem = form().bindFromRequest().get("saleitem");
          /*  if (saleitem!=null && !saleitem.equals("")&& !saleitem.equals("SALEITEM")) {*/
            if (saleitem!=null && !saleitem.equals("")) {
                job.item = Item.find.byId(Long.parseLong(saleitem));
            }
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String date = form().bindFromRequest().get("date");
            try {
                if (date!=null&&job.date!=format.parse(date)) {
                    job.date = format.parse(date);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            job.update();

            String type = "job";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "CustomerQuery";
            queue.ident = job.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result appendCommentJob() {
        if (Secured.hasManagerAccess()) {
            Job job = Job.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            String market = form().bindFromRequest().get("market");
            if (market!=null && !market.equals("")) {
                job.market = Market.find.byId(Long.parseLong(market));
            }
            String jobCategory = form().bindFromRequest().get("category");
            if (jobCategory!=null && !jobCategory.equals("")) {
                job.jobCategory = JobCategory.find.byId(Long.parseLong(jobCategory));
            }


            User logiran = Application.getLocalUser(session());
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            DateFormat formatcomment = new SimpleDateFormat("MM-dd hh:mm");
            Date datumotlogi = new Date();
            String datumcomment = formatcomment.format(datumotlogi);
            String notes = form().bindFromRequest().get("notes");

            if (notes!=null) {
                if (job.notes == null)
                    job.notes = "";
                job.notes += logiran.username +  ": " + notes + "   "  + datumcomment + "\r";
            }
            String lot = form().bindFromRequest().get("lot");
            if (lot!=null) {
                job.lot = lot.trim();
            }
            String saleitem = form().bindFromRequest().get("saleitem");
          /*  if (saleitem!=null && !saleitem.equals("")&& !saleitem.equals("SALEITEM")) {*/
            if (saleitem!=null && !saleitem.equals("")) {
                job.item = Item.find.byId(Long.parseLong(saleitem));
            }

            String date = form().bindFromRequest().get("date");
            try {
                if (date!=null&&job.date!=format.parse(date)) {
                    job.date = format.parse(date);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            job.update();

            String type = "job";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "CustomerQuery";
            queue.ident = job.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result reorderLineItemRefresh(){
        if (Secured.hasGuestAccess()) {

            String jobid = form().bindFromRequest().get("jobid");
            List<Lineitem> lij = null;
            List<Assigns> ssa = null;
            if (jobid != null && jobid !=""){
                lij=  Lineitem.find.where().eq("job_id" , jobid).isNull("task_type_id").setOrderBy("position").findList();
            }
             ssa = Assigns.find.where().eq("jobid" , jobid).findList();

            List<Task> tasks = Task.findByJob(Long.parseLong(jobid));

            List<Task> tasksnq =  new ArrayList(new HashSet(tasks));

            return ok(views.html.budgets.index_rd_new_job.render(
                    User.find.byId(Long.parseLong(request().username())),
                    lij,
                    Lineitem.findActualLineitemsByJob(Long.parseLong(jobid)),
                    ssa,
                    User.find.all(),
                    tasksnq
            ));
        } else {
            return forbidden();
        }
    }


    public static Result reorderLineItemActualRefresh(){
        if (Secured.hasGuestAccess()) {

            String jobid = form().bindFromRequest().get("jobid");
            Job j = null;
            List<Task> tasks = new ArrayList<Task>();
            List<Assigns> ssa = null;
            if (jobid != null && jobid !=""){
           //     lij=  Lineitem.find.where().eq("job_id" , jobid).isNull("task_type_id").setOrderBy("position").findList();
             //   CheckDeleteTasksAssignemts(Long.parseLong(jobid));

                j = Job.find.byId(Long.parseLong(jobid));

                tasks = Task.findByJob(Long.parseLong(jobid));
                ssa = Assigns.find.where().eq("jobid" , jobid).findList();
            }
            // views.html.actuals.index_new(user,job.budget.budgetItems,actualLineitems,tasks)
            return ok(views.html.actuals.index_new.render(
                    User.find.byId(Long.parseLong(request().username())),
                    j.budget.budgetItems,
                    Lineitem.findActualLineitemsByJob(Long.parseLong(jobid)),
                    tasks,
                    ssa,
                    User.find.all()
            ));
        } else {
            return forbidden();
        }
    }


    public static Date addDays(Date date, int days)
    {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.DATE, days); //minus number would decrement the days
        return cal.getTime();
    }

    public static int daysBetween(Date d1, Date d2){
        return (int)( (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    }

    public static Result rescheduleTasks(){
        if (Secured.hasManagerAccess()) {
            String  startdate = form().bindFromRequest().get("date");
            String jobid = form().bindFromRequest().get("jobid");
            // najdi go najraniot task od jobot
            // i pomesti gi negovite datumi
            // ne pipaj se vo actuals
            // ako datumot e nedela + 1
            // na site drugi

            Date startdatetask = new Date();
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                if (startdate!=null) {
                    startdatetask = format.parse(startdate);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }


            List<Task> tasks = Task.find.where().eq("job_id", jobid).orderBy("date asc").findList();
            int days = 0;

            if (tasks!= null && tasks.size()>0)
            {
                //days = Days.daysBetween(new LocalDate(startdate), new LocalDate(tasks.get(0))).getDays();
                days = daysBetween( tasks.get(0).date, startdatetask);
            }

            for(Task t : tasks)
            {
                Date novadata = addDays(t.date, days);
                Calendar cal = Calendar.getInstance();
                cal.setTime(novadata);
                boolean Sunday = cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY;

               if (Sunday)
               {
                   novadata = addDays(novadata,1);
                    days++;
               }
                t.date = novadata;
                t.update();
            }

            return ok();
        }
        else {
            return forbidden();

        }
    }


    public static Result rescheduleCalendarTasks(){
        if (Secured.hasManagerAccess()) {
            String  startdate = form().bindFromRequest().get("date");
            String jobids = form().bindFromRequest().get("jobid");
            String najrantaskids = form().bindFromRequest().get("taskid");

            jobids=jobids.substring(1, jobids.length()-1).replace("\"", "");;
            najrantaskids=najrantaskids.substring(1, najrantaskids.length()-1).replace("\"", "");
            String[] jobid = jobids.split(",");
            String[] najrantaskid = najrantaskids.split(",");


            for(int i=0; i<jobid.length;i++){


                Task nastask = Task.find.byId(Long.parseLong(najrantaskid[i]));
                // najdi go najraniot task od jobot sto e [p
                // i pomesti gi negovite datumi
                // ne pipaj se vo actuals
                // ako datumot e nedela + 1
                // na site drugi

                Date startdatetask = new Date();
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                try {
                    if (startdate!=null) {
                        startdatetask = format.parse(startdate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }


                List<Task> tasks = Task.find.where().eq("job_id", jobid[i]).orderBy("date asc").findList();


                // odtuka treba da se izbrisat pominatite taskovi pred nasiot
                List<Task> resttasks = new ArrayList<Task>();


                if (nastask!=null){
                    boolean odtuka = false;
                    for(Task t : tasks)
                    {
                        if (t.id.equals(nastask.id))
                            odtuka = true;
                        if(odtuka)
                            resttasks.add(t);
                    }
                }

                int days = 0;


                if (resttasks!= null && resttasks.size()>0)
                {
                    //days = Days.daysBetween(new LocalDate(startdate), new LocalDate(tasks.get(0))).getDays();
                    days = daysBetween( resttasks.get(0).date, startdatetask);
                }

                int dolzina = resttasks.size();

                for(Task t : resttasks)
                {
                    Date novadata = addDays(t.date, days);
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(novadata);
                    boolean Sunday = cal.get(Calendar.DAY_OF_WEEK) == Calendar.SUNDAY;

                    if (Sunday)
                    {
                        novadata = addDays(novadata,1);
                        days++;
                    }
                    t.date = novadata;
                    t.update();
                }
            }

            return ok();
        }
        else {
            return forbidden();

        }
    }



    public static Result addJobTask() {
        if (Secured.hasManagerAccess()) {
            String id = form().bindFromRequest().get("job");
            String lot = form().bindFromRequest().get("lot");
            String subdivision = form().bindFromRequest().get("subdivision");
            /*String startdate = form().bindFromRequest().get("jobstartdate");
            if (startdate.equals(""))*/
            String  startdate = form().bindFromRequest().get("date");

            Job job;
            if (id!=null&&!id.equals("")) {
                job = Job.find.ref(Long.parseLong(id));
                if (!lot.equals(job.lot)) {
                    job = Job.addJob(
                            form().bindFromRequest().data()
                    );
                }
            } else if (subdivision!=null&&!subdivision.equals("")) {
                job = Job.addJob(
                        form().bindFromRequest().data()
                );
            } else {
                return null;
            }


            Date startdatelineitem = new Date();
            List<Integer> denovi=  new ArrayList<Integer>();

            if (startdate != "")
                {

                    // ako e nov vid plan... togas imame nov vid job i morame da gi setirame datumite na lineitems
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                try {
                    if (startdate!=null) {
                        startdatelineitem = format.parse(startdate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                List<Date> plandates =new ArrayList<Date>();

                String planid = form().bindFromRequest().get("plan");
                if (planid != null && planid != "")
                {
                    Plan p = Plan.find.byId(Long.parseLong(planid));
                 //   Plan p = Plan.find.byId(planid);
                   /* if (p!= null && job != null )
                        applyTemplatePercentage(job.id, p.id);*/

                    // ja dodavame logikata za lineitem datumite
                    if (ChecknewJob(job))
                    {
                       // zemi gi vo lista site razlicni datumi od lineitems od planot
                        SqlQuery q = Ebean.createSqlQuery("select distinct daysdate from lineitem where plan_id = " + job.plan.id);
                        List<SqlRow> rows = q.findList();
                        // List<Date> plandates =new ArrayList<Date>(rows.size());
                        for (SqlRow row : rows)
                            plandates.add(row.getDate("daysdate"));


                       /* List<Date> plandates = new ArrayList<Date>();
                        int brojka = 0;
                        for (Lineitem l : job.plan.lineitems) {
                                if (!postoi(l.daysdate, plandates))
                                    plandates.add(l.daysdate);
                        }*/
                        // zemi gi vo lista site razlicni datumi i podredi gi po golemina
                        Collections.sort(plandates, new Comparator<Date>(){
                            @Override
                            public int compare(Date o1, Date o2) {
                                return o1.compareTo(o2);
                            }
                        });
                        // napraj lista od denovi

                        if (plandates != null){
                            if (plandates.size() >0)
                            {
                            denovi.add(0);
                                int daysdiff = 0;
                                for (int i = 1; i <plandates.size();i++){
                                long diff =  plandates.get(i).getTime() -  plandates.get(0).getTime();
                            /*    int days = Days.daysBetween(new LocalDate(firstTime),
                                        new LocalDate(secondTime)).getDays();*/
                                long diffDays = diff / (24 * 60 * 60 * 1000);
                                daysdiff = (int) diffDays ;
                                denovi.add(daysdiff);
                                }
                            }
                        }

                       // konecno updateiraj gi lineitems
                        if(denovi!=null)
                        {
                           /* for (int i = 0; i <denovi.size();i++){*/
                                for (Lineitem l : job.plan.lineitems) {
                                    // find date in listdates
                                    int counter =0;
                                    for (int j=0; j<plandates.size();j++){
                                       /* if (l.daysdate == plandates.get(j))*/
                                        if (l.daysdate.compareTo(plandates.get(j))==0)
                                            break;
                                        else
                                            counter++;
                                    }
                                    Lineitem jl = Lineitem.find.where().eq("job_id", job.id).eq("position", l.position).findUnique();
                                    Calendar c = Calendar.getInstance();
                              //      c.setTime(l.daysdate);
                                    c.setTime(startdatelineitem);
                                    c.add(Calendar.DATE, denovi.get(counter));  // number of days to add
                                    // vidi koj den e, ako e nedela skokaj go
                                    jl.daysdate = c.getTime();
                                  //  jl.saleprice = l.saleprice;
                                 //   if (jl.itemType != null && jl.itemType.id > 1)
                                    jl.update();
                            }
                            /* }*/
                        }
                    }
                }
            }

            String type = "job";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "CustomerQuery";
            queue.ident = job.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");


            String tasktip = form().bindFromRequest().get("task");
             if (!ChecknewJob(job))
              {
                  if (startdate != "")
                  {

                      String date = form().bindFromRequest().get("date");
                      Calendar cal = Calendar.getInstance();
                      if (date != null) {
                          String[] splitDate = date.split("-");
                          cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]),0,0,0);
                      }
                      Task newTask = null;
                      if (form().bindFromRequest().get("task")!=null) {
                          newTask = Task.addTask(
                                  job.id.toString(),
                                  tasktip,
                                  form().bindFromRequest().get("crew"),
                                  cal.getTime()
                          );
                      }
                  }
                  return ok(toJson(job));
                // return ok(views.html.task_rd.render(newTask));
              }
                else
              {
                  if (startdate != "")
                  {
                          tasktip = "4";


                          String date = form().bindFromRequest().get("date");
                          Calendar cal = Calendar.getInstance();
                          if (date != null) {
                              String[] splitDate = date.split("-");
                              cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]),0,0,0);
                          }
                          // tuka treba da se otvorat novi taskovi za sekoj datum od planot
                          for (Integer denraz: denovi){
                          Calendar c = Calendar.getInstance();
                          c.setTime(startdatelineitem);
                          c.add(Calendar.DATE, denraz);  // number of days to add
                          // vidi koj den e, ako e nedela skokaj go

                          Task newTask = Task.addTask(
                                  job.id.toString(),
                                  tasktip,
                                  form().bindFromRequest().get("crew"),
                                  c.getTime()
                          );

                              // tuka treba da gi najdeme lineitemite sto se alocirani kon ovoj task i da gi updatirame so negoviot datum i so negovoto id

                              for (Lineitem l : job.plan.lineitems) {
                                  // find date in listdates
                                  int counter =0;

                                  Lineitem jl = Lineitem.find.where().eq("job_id", job.id).eq("position", l.position).findUnique();
                                 if (newTask.date.equals(jl.daysdate))
                                 {
                                    jl.task = newTask;
                                     jl.update();
                                 }
                              }

                              // do tuka obid
                         }
                  }
                       return ok(toJson(job));

              }

        } else {
            return forbidden();

        }
    }


    public static Result getMarketSelect() {
        if (Secured.hasGuestAccess()) {
            return ok(views.html.marketselect.render(Market.find.all()));
        } else {
            return forbidden();
        }
    }

    public static Result getCustomerSelect() {
        if (Secured.hasGuestAccess()) {
            List<Customer> customers;
            if (form().bindFromRequest().data().containsKey("market")
                    && !form().bindFromRequest().get("market").equals("")
                    && !form().bindFromRequest().get("market").equals("0")) {
                customers = Customer.find.where().eq("market.id",Long.parseLong(form().bindFromRequest().get("market"))).findList();
            } else {
                customers = Customer.find.all();
            }
            return ok(views.html.customerselect_rd.render(customers));
        } else {
            return forbidden();
        }
    }

    public static Result getSubdivisionSelect() {
        if (Secured.hasGuestAccess()) {
            List<Subdivision> subdivisions;
            if (form().bindFromRequest().data().containsKey("customer")
                    && !form().bindFromRequest().get("customer").equals("")
                    && !form().bindFromRequest().get("customer").equals("0")) {
                subdivisions = Subdivision.find.where().eq("customer.id",Long.parseLong(form().bindFromRequest().get("customer"))).findList();
            } else {
                subdivisions = Subdivision.find.all();
            }
            return ok(views.html.subdivisionselect.render(subdivisions));
        } else {
            return forbidden();
        }
    }

    public static Result getJobsByLot() {
        if (Secured.hasGuestAccess()) {
            ExpressionList<Job> query = Job.find.where();
            String lot = form().bindFromRequest().get("lot");
            if (lot != null && !lot.equals("")) {
                query.or(Expr.like("lot", lot + "%"), Expr.like("id", lot + "%"));
            }
            String subdivision = form().bindFromRequest().get("subdivision");
            if (subdivision != null && !subdivision.equals("")) {
                query.eq("subdivision.id",Long.parseLong(subdivision));
            }
            String customer = form().bindFromRequest().get("customer");
            if (customer != null && !customer.equals("")) {
                query.eq("subdivision.customer.id",Long.parseLong(customer));
            }
            List<Job> jobs = query.orderBy("lot").findList();
            return ok(toJson(jobs));
        } else {
            return forbidden();
        }
    }

    public static Result getSaleitems() {
        if (Secured.hasGuestAccess()) {
            List<Item> items = Item.find.where().eq("itemType.name", "sale").findList();
            return ok(toJson(items));
        } else {
            return forbidden();
        }
    }



    public static Result reorderLineItems() {
        if (Secured.hasGuestAccess()) {

            // zemi array od ajax
            String lineitemsis = form().bindFromRequest().get("lineitemsid");
            if (lineitemsis != null && lineitemsis !=""){
                String[] linitemsids = lineitemsis.split(" ");
                for(int i=0; i<linitemsids.length; i++)
                {
                    Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                    if (lm!= null)
                    {
                        lm.position = i;// Integer.toString(i+1);
                        lm.update();
                    }
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result verifyLineItems() {
        if (Secured.hasGuestAccess()) {
            // zemi array od ajax
            String verifylineitemid = form().bindFromRequest().get("verifylineitemid");

            // tuka go imame lineitem
            if (verifylineitemid != null && verifylineitemid !=""){
                    Lineitem lm = Lineitem.find.byId(Long.parseLong(verifylineitemid));
                    if (lm!= null)
                    {
                        lm.verify = 1;// Integer.toString(i+1);
                        lm.update();
                    }
            }
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result unverifyLineItems() {
        if (Secured.hasGuestAccess()) {
            // zemi array od ajax
            String verifylineitemid = form().bindFromRequest().get("verifylineitemid");
            if (verifylineitemid != null && verifylineitemid !=""){
                Lineitem lm = Lineitem.find.byId(Long.parseLong(verifylineitemid));
                if (lm!= null)
                {
                    lm.verify = 0;// Integer.toString(i+1);
                    lm.update();
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result verifyAllLineItems() {
        if (Secured.hasGuestAccess()) {
            // zemi array od ajax
            String jobid = form().bindFromRequest().get("jobid");
            if (jobid != null && jobid !=""){
                List<Lineitem> litem = Lineitem.find.where().eq("job.id", jobid).findList();
                //    litem = Lineitem.findActualLineitemsByJob(id);
                for (Lineitem lm : litem)
                {
                    if (lm!= null)
                    {
                        lm.verify = 1;// Integer.toString(i+1);
                        lm.update();
                    }
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result reorderLineItemDates() {
        if (Secured.hasGuestAccess()) {
            // zemi array od ajax
            String lineitemsis = form().bindFromRequest().get("lineitemsid");
            String datumot = form().bindFromRequest().get("datesel");

            Date datumjob = new Date();
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                if (datumot!=null&&datumot!="") {
                    datumjob = format.parse(datumot);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            Long jobid = 0l;

            // se sto treba da se napravi e da se izbrisat stari assignemnts dates - ne planned
            // toa znaci deka treba da se updatiraat taskovite i assignments ako postojat...
            // a ako ne postojat znaci treba da se kreiraat novi tasks i novi assignments
            // za selektiranite itemi se zemaat taskovite i se gleda za sekoj task po task
            // dali postojat drugi lineitemi nadvor od selektirnite
            // vo slicaj da postojat - se ostava toj task i se otvora nov task za negovite selektirani itemi i se mesti datum
            // 1 lineitem samo - togas ne se pipa za drugite taskovi tuku se otvora nov

            if (lineitemsis != null && lineitemsis !="" && datumjob != null){
                String[] linitemsids = lineitemsis.split(" ");
                for(int i=0; i<linitemsids.length; i++)
                {
                    Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                    if (lm!= null)
                    {
                        lm.daysdate  = datumjob;// Integer.toString(i+1);
                        lm.update();
                        jobid = lm.job.id;
                    }
                }
            }

            DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String reportDate = df.format(datumjob);
            CheckDeleteTasksAssignemts(jobid, reportDate);

            return ok(
                 /*  views.html.plan_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Plan.find.byId(planid),
                            PlanItem.find.all()
                    )*/
            );
        } else {
            return forbidden();
        }
    }

    public static Result getPlanSelect() {
        if (Secured.hasGuestAccess()) {
            List<Plan> plans = Plan.find.where().isNull("customer").eq("active",1).findList();
            String customer = form().bindFromRequest().get("customer");
            if (customer != null && !customer.equals("")) {
                plans.addAll(Plan.find.where().eq("customer.id",Long.parseLong(customer)).eq("active",1).findList());
            }
            return ok(views.html.planselect_rd.render(plans));
        } else {
            return forbidden();
        }
    }

    public static Result searchJobs() {
        if (Secured.hasGuestAccess()) {
            String search = form().bindFromRequest().get("search");
            List<Job> jobs = Job.find.setMaxRows(24).where().or(Expr.like("lot","%"+search+"%"), Expr.like("id",search+"%")).findList();
            ExpressionList<Job> query = Job.find.setMaxRows(24).where()
                    .or(Expr.like("subdivision.customer.name","%"+search+"%"), Expr.like("subdivision.name","%"+search+"%"));
            jobs.addAll(query.findList());
            return ok(toJson(jobs));
        } else {
            return forbidden();
        }
    }


    public static Result applyTemplatePercentage(Long jobid , Long planid ) {
        if (Secured.hasManagerAccess()) {
            Job job = Job.find.byId(jobid);
            if (jobid!=null && planid != null ) {
                for (Lineitem li : job.plan.lineitems) {
                    // najdi go istiot lineitem sto e od jobot
                    Lineitem odjobot = null;
                    if (li.planItem != null && li.planItem.id != null)
                        odjobot = Lineitem.find.where().ne("id", li.id).eq("job_id", job.id).eq("plan_item_id", li.planItem.id).isNull("plan_id").eq("item_id", li.item.id).eq("item_type_id", li.itemType.id).eq("rate", li.rate).eq("quantity", li.quantity).findUnique();
                    else
                        odjobot = Lineitem.find.where().ne("id", li.id).eq("job_id", job.id).isNull("plan_id").eq("item_id", li.item.id).eq("item_type_id", li.itemType.id).eq("rate", li.rate).eq("quantity", li.quantity).findUnique();

                    // zemi gi lineitem_percentage po planot
                    List<LineitemPercentage> lip = LineitemPercentage.find.where().eq("lineitem_id",  li.id).findList();
                    if (odjobot != null){
                        for (LineitemPercentage lipa : lip) {
                            LineitemPercentage newline = new LineitemPercentage();
                            // najdi go istiot lineitem sto e od jobot
                            newline.lineitem = odjobot;
                            newline.percentage = lipa.percentage;
                            newline.taskType = lipa.taskType;
                            newline.save();
                        }
                    }
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result applyTemplate() {
        if (Secured.hasManagerAccess()) {
            Job job = Job.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            String plan = form().bindFromRequest().get("template");
            if (plan!=null&&!plan.equals("")) {
                job.plan = Plan.find.ref(Long.parseLong(plan));
                job.lnft = job.plan.lnft;
                job.sqft = job.plan.sqft;
                job.cuyds = job.plan.cuyds;
                job.price_per_sqft = job.plan.price_per_sqft;
                job.saleprice = job.plan.saleprice;
                job.cost = job.plan.cost;

                for (Saleitem si : job.saleitems) {
                    si.delete();
                }
                for (Dimension d : job.dimensions) {
                    d.delete();
                }
                for (Lineitem l : job.lineitems) {
                    if (l.taskType==null) {
                        l.delete();
                    }
                }

                for (Saleitem si : job.plan.saleitems) {
                    Saleitem jsi = Saleitem.addBlank(null,null);
                    jsi.job = job;
                    jsi.name = si.name;
                    jsi.rate = si.rate;
                    jsi.units = si.units;
                    jsi.quantity = si.quantity;
                    jsi.saleprice = si.saleprice;
                    jsi.notes = si.notes;
                    jsi.update();
                }
                for (Dimension d : job.plan.dimensions) {
                    String planItem = d.planItem.id.toString();
                    String deduction = (d.deduction)?"true":"false";
                    Dimension jd = Dimension.addBlank(null,null,planItem,deduction);
                    jd.job = job;
                    jd.length_feet = d.length_feet;
                    jd.length_inches = d.length_inches;
                    jd.width_feet = d.width_feet;
                    jd.width_inches = d.width_inches;
                    jd.depth_feet = d.depth_feet;
                    jd.depth_inches = d.depth_inches;
                    jd.notes = d.notes;
                    jd.update();
                }
                for (Lineitem l : job.plan.lineitems) {
                    Lineitem jl = Lineitem.addLineitem(null,null,null,null,null,null);
                    jl.job = job;
                    jl.planItem = l.planItem;
                    jl.taskType = l.taskType;
                    jl.itemType = l.itemType;
                    jl.vendor = l.vendor;
                    jl.item = l.item;
                    jl.rate = l.rate;
                    jl.units = l.units;
                    jl.quantity = l.quantity;
                    jl.saleprice = l.saleprice;
                    jl.multiplier = l.multiplier;
                    jl.markup = l.markup;
                    jl.update();
                }
                for (Attachment a : job.plan.attachments) {
                    Attachment ja = Attachment.addAttachment(null,null,a.attachment_path);
                    ja.job = job;
                    ja.update();
                }

                job.update();
            }
            return ok();
        } else {
            return forbidden();
        }
    }




    public static Result applyTemplateNewJob() {

        if (Secured.hasManagerAccess()) {
            Job job = Job.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            String plan = form().bindFromRequest().get("template");
            if (plan!=null&&!plan.equals("")) {
                job.plan = Plan.find.ref(Long.parseLong(plan));
                job.lnft = job.plan.lnft;
                job.sqft = job.plan.sqft;
                job.cuyds = job.plan.cuyds;
                job.price_per_sqft = job.plan.price_per_sqft;
                job.saleprice = job.plan.saleprice;
                job.cost = job.plan.cost;

                for (Saleitem si : job.saleitems) {
                    si.delete();
                }
                for (Dimension d : job.dimensions) {
                    d.delete();
                }



                for (Saleitem si : job.plan.saleitems) {
                    Saleitem jsi = Saleitem.addBlank(null,null);
                    jsi.job = job;
                    jsi.name = si.name;
                    jsi.rate = si.rate;
                    jsi.units = si.units;
                    jsi.quantity = si.quantity;
                    jsi.saleprice = si.saleprice;
                    jsi.notes = si.notes;
                    jsi.update();
                }
                for (Dimension d : job.plan.dimensions) {
                    String planItem = d.planItem.id.toString();
                    String deduction = (d.deduction)?"true":"false";
                    Dimension jd = Dimension.addBlank(null,null,planItem,deduction);
                    jd.job = job;
                    jd.length_feet = d.length_feet;
                    jd.length_inches = d.length_inches;
                    jd.width_feet = d.width_feet;
                    jd.width_inches = d.width_inches;
                    jd.depth_feet = d.depth_feet;
                    jd.depth_inches = d.depth_inches;
                    jd.notes = d.notes;
                    jd.update();
                }

                // treba da gi gledame starite i ako imame isti da se zemat od template planot
                // ako ima nuli ako se od ist vendor... vidi dali se site uslovi isti...
               /* for (Lineitem l : job.lineitems) {
                    if (l.taskType==null) {
                        l.delete();
                    }
                }*/

                /*  da se vrti  po sekoj od veke postoeckite lineitemi kade sme na null - znaci od planot - ne gi briseme actuals voopsto  LIP
                i da se baraat 0 - tie so NULA quantity
                da se vrti po sekoj lineitem od template-ot LIT
                i da se pobara dali ima ist lineitem kako toj od planot - po item_type_id, vendor_id, item_id, (uslov ima vendor == null ili ne razlicni prebaruvanja)

                koga ke se najde LIT treba da se pravi update na LIP so
                LIP.quantity = LIT.quantity
                LIP.saleprice = LIP.saleprice
                LIP.rate = LIT.rate
                LIP.units = LIT.units
                LIP.multiplier = LIP.multiplier
                LIP.markup = LIP.markup*/



                for (Lineitem LIP : job.lineitems) {
                    if (LIP.taskType==null && LIP.quantity==0) {
                            Lineitem LITemp = null;
                        for (Lineitem LIT : job.plan.lineitems) {
                            if (LIT.item.id.equals(LIP.item.id) && LIT.itemType.id.equals(LIP.itemType.id) && LIT.quantity!=0)
                            /*{
                                if (LIP.vendor != null && LIT.vendor!=null)
                                {
                                    if (LIP.vendor.id.equals(LIT.vendor.id))
                                        LITemp = LIT;
                                }
                                else*/
                                    LITemp = LIT;
                            /*}*/
                        }
                        if (LITemp != null)
                        {
                            LIP.quantity = LITemp.quantity;
                            LIP.saleprice = LITemp.saleprice;
                            LIP.rate = LITemp.rate;
                            LIP.units = LITemp.units;
                            LIP.multiplier = LITemp.multiplier;
                            LIP.markup = LITemp.markup;
                            LIP.update();
                        }
                    }
                }


                for (Lineitem l : job.plan.lineitems) {
                    boolean goima = false;
                    for (Lineitem LIP : job.lineitems) {
                        if (LIP.item.id.equals(l.item.id) && LIP.itemType.id.equals(l.itemType.id))
                                if ((LIP.vendor!= null && l.vendor!=null && LIP.vendor.equals(l.vendor))|| (LIP.vendor==null && l.vendor==null))
                                {
                                    goima = true;
                                    break;
                                }
                        }
                        if (!goima)
                        {
                            Lineitem jl = Lineitem.addLineitem(null,null,null,null,null,null);
                            jl.job = job;
                            jl.planItem = l.planItem;
                            jl.taskType = l.taskType;
                            jl.itemType = l.itemType;
                            jl.vendor = l.vendor;
                            jl.item = l.item;
                            jl.rate = l.rate;
                            jl.units = l.units;
                            jl.quantity = l.quantity;
                            jl.saleprice = l.saleprice;
                            jl.multiplier = l.multiplier;
                            jl.markup = l.markup;
                            jl.update();
                        }

                }
                for (Attachment a : job.plan.attachments) {
                    Attachment ja = Attachment.addAttachment(null,null,a.attachment_path);
                    ja.job = job;
                    ja.update();
                }

                job.update();
            }
            return ok();
        } else {
            return forbidden();
        }
    }

  //  @(user: User,  markets: List[Market], itemTypes: List[ItemType],  formJob: Form[models.Job])
    public static Result addJob_rd() {
        if (Secured.hasGuestAccess()) {
            play.data.Form<Job> userJob = play.data.Form.form(Job.class);
            return ok(views.html.jobs.addjob.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    ItemType.find.all(),
                    userJob
            ));
        } else {
            return forbidden();
        }
    }

    public static Result listJobs() {
        if (Secured.hasAdministratorAccess()) {
            List<Market> listimarkets = Market.find.all();
            List<Job> listjobs = Job.find.all();
            play.data.Form<Job> userJob = play.data.Form.form(Job.class);
          //  @(user: User, jobs: List[Job], markets: List[Market], formJob: Form[models.Job])
          //  @(user: User, jobs: List[Job], markets: List[Market], itemTypes: List[ItemType], formJob: Form[models.Job])
            return ok(
                    views.html.jobs.joblist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            listjobs,
                            listimarkets,
                            ItemType.find.all(),
                            userJob
                    )
            );
        } else {
            return forbidden();
        }
    }

   /* <option value="0"@(if(u.authority.toString=="0") " selected")>Inactive</option>
    <option value="1"@(if(u.authority.toString=="1") " selected")>Data Input</option>
    <option value="2"@(if(u.authority.toString=="2") " selected")>Data Processor</option>
    <option value="3"@(if(u.authority.toString=="3") " selected")>Field Manager</option>
    <option value="4"@(if(u.authority.toString=="4") " selected")>Production Manager</option>
    <option value="5"@(if(u.authority.toString=="5") " selected")>Accounting Manager</option>
    <option value="6"@(if(u.authority.toString=="6") " selected")>Operations Manager</option>
    <option value="7"@(if(u.authority.toString=="7") " selected")>Company Manager</option>*/

    public static Result actualJobs() {
        if (Secured.hasAdministratorAccess()) {
          /*  if (Secured.getuserAuthority() > 4)
            {*/
              /*  List<Market> listimarkets = Market.find.all();
                List<Job> listjobs = Job.find.all();*/
                play.data.Form<Job> userJob = play.data.Form.form(Job.class);

                String date = request().getQueryString("date");
                String market = request().getQueryString("market");
                String manager = request().getQueryString("manager");

                java.util.Calendar cal = java.util.Calendar.getInstance();
                if (date != null) {
                    String[] splitDate = date.split("-");
                    cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
                }

                String d1 =cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
                String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

                List<Task> tasks = new ArrayList<Task>();
                // tasks = Task.findWithinDates(d1,d2);


                if (market!=null && !market.equals("")) {
                    tasks = Task.findWithinDatesForMarket(d1,d2,market);
                } else {
                    tasks = Task.findWithinDates(d1,d2);
                }


                return ok(
                       /* views.html.jobs.actualjoblist.render(
                                User.find.byId(Long.parseLong(request().username())),
                                Market.find.all(),
                                User.find.all(),
                                tasks,
                                d1,
                                market,
                                manager

                        )*/
                        views.html.jobs.actualjoblabor.render(
                                User.find.byId(Long.parseLong(request().username())),
                                Market.find.all(),
                                User.find.where().lt("authority",2).findList(),
                                tasks,
                                d1,
                                market,
                                manager
                        )
                );
           /* }
            else if (Secured.getuserAuthority() == 3)
            {
                // PRIJAVEN KAKO FIELD MANAGER
              *//*  List<Market> listimarkets = Market.find.all();
                List<Job> listjobs = Job.find.all();*//*
                play.data.Form<Job> userJob = play.data.Form.form(Job.class);

                String date = request().getQueryString("date");
                String market = request().getQueryString("market");
                String manager = request().getQueryString("manager");

                java.util.Calendar cal = java.util.Calendar.getInstance();
                if (date != null) {
                    String[] splitDate = date.split("-");
                    cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
                }


                String d1 =cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
                String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

                List<Task> tasks = new ArrayList<Task>();

                // tasks = Task.findWithinDates(d1,d2);


                if (market!=null && !market.equals("")) {
                    tasks = Task.findWithinDatesForMarket(d1,d2,market);
                } else {
                    tasks = Task.findWithinDates(d1,d2);
                }

                // mora tasks da se filtriraat i po userot sto e najaven
                User fieldmanager = Application.getLocalUser(session());
                List<Task> tasksAssigned = new ArrayList<Task>();

                List<Assigns> assignedTasks = Assigns.find.where().eq("fieldmanagerid", fieldmanager.id ).findList();

                for (Task ts : tasks)
                {
                    boolean flagAssignField = false;
                    for (Assigns ass : assignedTasks)
                    {
                        if (ts.job.id == ass.jobid && ts.id == ass.taskid)
                            flagAssignField = true;
                    }
                    if (flagAssignField)
                        tasksAssigned.add(ts);
                }

                tasks = tasksAssigned;

                return ok(
                        views.html.jobs.actualjoblistfieldmanager.render(
                                fieldmanager,
                                Market.find.all(),
                                User.find.all(),
                                tasks,
                                d1,
                                market,
                                manager

                        )
                );
            }
            else {
                return forbidden();
            }*/
        } else {
            return forbidden();
        }
    }

    public static Result listJobsActualsAjax() {
        if (Secured.hasAdministratorAccess()) {

            Map<String, String[]> params = request().queryString();

            Integer iTotalRecords = Job.find.findRowCount();
            String filter = params.get("sSearch")[0];
            Integer pageSize = Integer.valueOf(params.get("iDisplayLength")[0]);
            Integer page = Integer.valueOf(params.get("iDisplayStart")[0]) / pageSize;

            /**
             * Get sorting order and column
             */
            String sortBy = "id";
            String order = params.get("sSortDir_0")[0];

            switch(Integer.valueOf(params.get("iSortCol_0")[0])) {
                case 1 : sortBy = "id"; break;
                case 2 : sortBy = "market.city"; break;
                case 3 : sortBy = "jobCategory.name"; break;
                case 4 : sortBy = "subdivision.name"; break;
                case 5 : sortBy = "lot"; break;
                case 6 : sortBy = "date"; break;

            }

            Page<Job> jobPage = Job.find.where(
                    Expr.or(
                            Expr.ilike("id", "%"+filter+"%"),
                            Expr.or(
                                    Expr.ilike("lot", "%"+filter+"%"),
                                    Expr.or(
                                            Expr.ilike("date", "%"+filter+"%"),
                                            Expr.or(
                                                    Expr.ilike("jobCategory.name", "%"+filter+"%"),
                                                    Expr.or(
                                                            Expr.ilike("subdivision.name", "%"+filter+"%"),
                                                            Expr.ilike("market.city", "%"+filter+"%")
                                                    )
                                            )
                                    )
                            )
                    )
            )
                    .orderBy(sortBy + " " + order )
                    .findPagingList(pageSize).setFetchAhead(false)
                    .getPage(page);

            Integer iTotalDisplayRecords = jobPage.getTotalRowCount();

            /**
             * Construct the JSON to return
             */
            ObjectNode result = Json.newObject();

            result.put("sEcho", Integer.valueOf(params.get("sEcho")[0]));
            result.put("iTotalRecords", iTotalRecords);
            result.put("iTotalDisplayRecords", iTotalDisplayRecords);

            ArrayNode an = result.putArray("aaData");

            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

            for(Job c : jobPage.getList()) {
                ObjectNode row = Json.newObject();
                ObjectNode rowDTrow = Json.newObject();
                if (c.id == null)
                {
                    row.put ("DT_RowId","0");
                    row.put("0", "no job id");
                }
                else
                {
                    Market m;
                    Subdivision s;
                    JobCategory jc;
                    //     Customer cust;

                    row.put ("DT_RowId",c.id);

                    row.put("0","<a href=\"#\" class=\"clicka\">" + c.id + "</a>");



                    if (c.market != null)
                    {
                        m = c.market;
                        row.put("1", m.city );
                    }
                    if (c.jobCategory.id != null)
                    {
                        jc = c.jobCategory;
                        row.put("2", jc.name );
                    }
                    if (c.subdivision != null)
                    {
                        s = c.subdivision;
                        row.put("3", s.name );
                    }
                    if (c.lot != null)
                    {
                        row.put("4", c.lot );
                    }

                    if (c.date != null)
                    {
                        row.put("5",df.format(c.date));
                    }
                }

                if (c.market == null || c.market.id == null)
                {
                    row.put("1", "no market");
                }
                if (c.subdivision == null || c.subdivision.id == null)
                {
                    row.put("3", "no subdivision");
                }
                if (c.lot == null)
                {
                    row.put("4", "no lot");
                }

                DateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
                Date d = new Date();
                Date m = new Date();
                try{
                    d = formatter.parse("12/31/1969");
                    m = formatter.parse("12/31/1970");
                }
                catch(Exception ex){}

                SimpleDateFormat fmt = new SimpleDateFormat("yyyy");

                if (c.date == null ||  fmt.format(c.date).equals(fmt.format(d)) || fmt.format(c.date).equals(fmt.format(m)))
                {
                    row.put("5", " - ");
                }

                //   row.put("2", "c.customer.name");
                an.add(row);
            }
            return ok(result);
        } else {
            return forbidden();
        }
    }

    public static Result listJobsAjax() {
        if (Secured.hasAdministratorAccess()) {

            Map<String, String[]> params = request().queryString();

            Integer iTotalRecords = Job.find.findRowCount();
            String filter = params.get("sSearch")[0];
            Integer pageSize = Integer.valueOf(params.get("iDisplayLength")[0]);
            Integer page = Integer.valueOf(params.get("iDisplayStart")[0]) / pageSize;

            /**
             * Get sorting order and column
             */
            String sortBy = "id";
            String order = params.get("sSortDir_0")[0];

            switch(Integer.valueOf(params.get("iSortCol_0")[0])) {
                case 1 : sortBy = "id"; break;
                case 2 : sortBy = "market.city"; break;
                case 3 : sortBy = "jobCategory.name"; break;
                case 4 : sortBy = "subdivision.name"; break;
                case 5 : sortBy = "lot"; break;
                case 6 : sortBy = "date"; break;

            }

            Page<Job> jobPage = Job.find.where(
                    Expr.or(
                            Expr.ilike("id", "%"+filter+"%"),
                            Expr.or(
                                    Expr.ilike("lot", "%"+filter+"%"),
                                    Expr.or(
                                            Expr.ilike("date", "%"+filter+"%"),
                                            Expr.or(
                                                    Expr.ilike("jobCategory.name", "%"+filter+"%"),
                                                    Expr.or(
                                                            Expr.ilike("subdivision.name", "%"+filter+"%"),
                                                            Expr.ilike("market.city", "%"+filter+"%")
                                                        )
                                                    )
                                    )
                            )
                    )
            )
                    .orderBy(sortBy + " " + order )
                    .findPagingList(pageSize).setFetchAhead(false)
                    .getPage(page);

            Integer iTotalDisplayRecords = jobPage.getTotalRowCount();

            /**
             * Construct the JSON to return
             */
            ObjectNode result = Json.newObject();

            result.put("sEcho", Integer.valueOf(params.get("sEcho")[0]));
            result.put("iTotalRecords", iTotalRecords);
            result.put("iTotalDisplayRecords", iTotalDisplayRecords);

            ArrayNode an = result.putArray("aaData");

            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

            for(Job c : jobPage.getList()) {
                ObjectNode row = Json.newObject();
                ObjectNode rowDTrow = Json.newObject();
                if (c.id == null)
                {
                    row.put ("DT_RowId","0");
                    row.put("0", "<a class=\"deleteUser\"><i class=\"fa fa-trash-o\"></i></a>");
                    row.put("1", "no job id");
                }
                else
                {
                    Market m;
                    Subdivision s;
                    JobCategory jc;
                    //     Customer cust;

                    row.put ("DT_RowId",c.id);
                    row.put("0", "<a class=\"deleteUser\"><i class=\"fa fa-trash-o\"></i></a>");
                    row.put("1","<a href=\"#\" class=\"clicka\">" + c.id + "</a>");



                    if (c.market != null)
                    {
                        m = c.market;
                        row.put("2", m.city );
                    }
                    if (c.jobCategory.id != null)
                    {
                        jc = c.jobCategory;
                        row.put("3", jc.name );
                    }
                    if (c.subdivision != null)
                    {
                        s = c.subdivision;
                        row.put("4", s.name );
                    }
                    if (c.lot != null)
                    {
                        row.put("5", c.lot );
                    }

                    if (c.date != null)
                    {
                        row.put("6",df.format(c.date));
                    }
                }

                if (c.market == null || c.market.id == null)
                {
                    row.put("2", "no market");
                }
                if (c.subdivision == null || c.subdivision.id == null)
                {
                    row.put("4", "no subdivision");
                }
                if (c.lot == null)
                {
                    row.put("5", "no lot");
                }

                DateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
                Date d = new Date();
                Date m = new Date();
                try{
                 d = formatter.parse("12/31/1969");
                    m = formatter.parse("12/31/1970");
                }
                catch(Exception ex){}

                SimpleDateFormat fmt = new SimpleDateFormat("yyyy");

                if (c.date == null ||  fmt.format(c.date).equals(fmt.format(d)) || fmt.format(c.date).equals(fmt.format(m)))
                {
                    row.put("6", " - ");
                }

                //   row.put("2", "c.customer.name");
                an.add(row);
            }
            return ok(result);
        } else {
            return forbidden();
        }
    }


    public static Result copyToPlans() {
        if (Secured.hasManagerAccess()) {
            Job job = Job.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            Plan plan = new Plan();
            String name = form().bindFromRequest().get("name");
            if (name==null || name.equals("")) {
                name = "NO NAME";
            }
            plan.name = name;
            plan.customer = job.subdivision.customer;
            plan.lnft = job.lnft;
            plan.sqft = job.sqft;
            plan.cuyds = job.cuyds;
            plan.price_per_sqft = job.price_per_sqft;
            plan.saleprice = job.saleprice;
            plan.cost = job.cost;

            plan.save();

            for (Saleitem si : job.saleitems) {
                Saleitem psi = Saleitem.addBlank(null,null);
                psi.plan = plan;
                psi.name = si.name;
                psi.rate = si.rate;
                psi.units = si.units;
                psi.quantity = si.quantity;
                psi.saleprice = si.saleprice;
                psi.notes = si.notes;
                psi.update();
            }
            for (Dimension d : job.dimensions) {
                String planItem = d.planItem.id.toString();
                String deduction = (d.deduction)?"true":"false";
                Dimension pd = Dimension.addBlank(null,null,planItem,deduction);
                pd.plan = plan;
                pd.length_feet = d.length_feet;
                pd.length_inches = d.length_inches;
                pd.width_feet = d.width_feet;
                pd.width_inches = d.width_inches;
                pd.depth_feet = d.depth_feet;
                pd.depth_inches = d.depth_inches;
                pd.notes = d.notes;

                pd.update();
            }
            for (Lineitem l : job.lineitems) {
                if(l.taskType==null){
                Lineitem pl = Lineitem.addLineitem(null,null,null,null,null,null);
                pl.plan = plan;
                pl.planItem = l.planItem;
                pl.taskType = l.taskType;
                pl.itemType = l.itemType;
                pl.vendor = l.vendor;
                pl.item = l.item;
                pl.rate = l.rate;
                pl.units = l.units;
                pl.quantity = l.quantity;
                pl.saleprice = l.saleprice;
                pl.multiplier = l.multiplier;
                pl.markup = l.markup;
                pl.position = l.position;
                pl.daysdate = l.daysdate;

                pl.update();
                }
            }
            for (Attachment a : job.attachments) {
                Attachment pa = Attachment.addAttachment(null,null,a.attachment_path);
                pa.plan = plan;
                pa.update();
            }

            return ok();
        } else {
            return forbidden();
        }
    }





    public static Result printjobcard() {
        if (Secured.hasGuestAccess()) {
            String blocks = request().getQueryString("blocks");
            String font = request().getQueryString("font");
            String jobid = request().getQueryString("jobid");

            Long id = Long.parseLong(jobid);
            Job job = Job.find.byId(id);

            List<Assigns> asslist = new ArrayList<Assigns>();
            asslist = Assigns.find.where().eq("jobid", jobid).findList(); //.isNull("tasktypeid")
            List<Task> tasks = Task.findByJob(id);


            List<Integer> blck = new ArrayList<Integer>();
            if (blocks != null && blocks != "-")
            {
                String[] blokovi = blocks.split("-");
                for(int i=0; i<blokovi.length; i++)
                {
                    blck.add(Integer.parseInt(blokovi[i]));
                }
            }


          /* return PDF.ok(
                    views.html.print.job_rd_new_print.render(
                            User.find.byId(Long.parseLong(request().username())),
                            job,
                            JobCategory.find.all(),
                            PlanItem.find.all(),
                            Lineitem.findBudgetLineitemsByJob(id),
                            Lineitem.findActualLineitemsByJob(id),
                            tasks,
                            User.find.all(),
                            asslist
                    )
            );*/

             return ok(
                    views.html.print.job_rd_new_print.render(
                            User.find.byId(Long.parseLong(request().username())),
                            job,
                         //   JobCategory.find.all(),
                            JobCategory.find.where().eq("Active", 1).findList(),
                            PlanItem.find.all(),
                            Lineitem.findBudgetLineitemsByJob(id),
                            Lineitem.findActualLineitemsByJob(id),
                            tasks,
                            User.find.all(),
                            asslist,
                            blck
                    )
            );
        } else {
            return forbidden();
        }
    }



    public static Result emailjobcard() {
        if (Secured.hasGuestAccess()) {

            String blocks = request().getQueryString("blocks");
            String font = request().getQueryString("font");
            String jobid = request().getQueryString("jobid");


            String messagehtml = request().getQueryString("message");

            String to = form().bindFromRequest().get("to");
            User fr = User.find.byId(Long.parseLong(request().username())); // zemi od userot najaven

            String from = "";
            if (fr!=null && fr.name != "")
            {
                from = fr.name;
                if (fr.email!=null && fr.email != "")
                   from+= " " + fr.email;
            }

            String subjecton = "e-job card " + jobid;

            final Mailer defaultMailer = Mailer.getDefaultMailer();

            Long id = Long.parseLong(jobid);
            Job job = Job.find.byId(id);

            List<Assigns> asslist = new ArrayList<Assigns>();
            asslist = Assigns.find.where().eq("jobid", jobid).findList(); //.isNull("tasktypeid")
            List<Task> tasks = Task.findByJob(id);


            List<Integer> blck = new ArrayList<Integer>();
            if (blocks != null && blocks != "-")
            {
                String[] blokovi = blocks.split("-");
                for(int i=0; i<blokovi.length; i++)
                {
                    blck.add(Integer.parseInt(blokovi[i]));
                }
            }

            Body body = new Body("", "from : " + from + "<br> <br>  " + "Message: "+ "<br> <br>  " + messagehtml  + "<br> <br>  " +  views.html.print.job_rd_new_print.render(
                    User.find.byId(Long.parseLong(request().username())),
                    job,
                 //   JobCategory.find.all(),
                    JobCategory.find.where().eq("Active", 1).findList(),
                    PlanItem.find.all(),
                    Lineitem.findBudgetLineitemsByJob(id),
                    Lineitem.findActualLineitemsByJob(id),
                    tasks,
                    User.find.all(),
                    asslist,
                    blck
            ));

            if (fr!=null && fr.email != null && fr.email != "")
            {
                final Mailer.Mail csutomemail = new Mailer.Mail(subjecton, body, new String[] {to, fr.email});
                defaultMailer.sendMail(csutomemail);
            }
            else
            {
                final Mailer.Mail csutomemail = new Mailer.Mail(subjecton, body, new String[] {to});
                defaultMailer.sendMail(csutomemail);
            }

            return ok();
        } else {
            return forbidden();
        }
    }



}
