package controllers;

import models.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import util.pdf.PDF;

import java.io.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static play.data.Form.form;
import static play.libs.Json.toJson;

import java.io.File;
import java.io.FileOutputStream;
import org.apache.poi.xssf.usermodel.*;

import views.html.job_rd;


/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/21/13
 * Time: 9:14 AM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Tasks_rd extends Controller {


    public static Result getDailyTasks() {
        if (Secured.hasGuestAccess()) {
            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            /*else
            {
                cal.set(java.util.Calendar.Today);
            }*/

        //    cal.add(java.util.Calendar.DATE,0);
            //   cal.add(1,1);

            String d1 =cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();
            // tasks = Task.findWithinDates(d1,d2);


            if (market!=null && !market.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1,d2,market);
            } else {
                tasks = Task.findWithinDates(d1,d2);
            }

            Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
            // najdi gi site assigns od site ovie taskovi
            List<Assigns> assigns = new ArrayList<Assigns>();
            for(Task tskTemp: tasks)
            {
                try
                {
                    Assigns ass = Assigns.find.where().eq("jobid", tskTemp.job.id).eq("taskid", tskTemp.id).findUnique();
                    if (ass!=null)
                        assigns.add(ass);

                    porderedconcret.put(tskTemp.id, isAllOrdered(tskTemp, 3l));
                    porderedmaterial.put(tskTemp.id, isAllOrdered(tskTemp, 2l));
                    porderedlabor.put(tskTemp.id, isAllOrderedLabor(tskTemp));

                }
                catch(Exception ex){}
            }
            // i dodaj mu gi vo view-to




            return ok(
                    views.html.calendardaily_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            User.find.all(),
                            tasks,
                            d1,
                            market,
                            manager,
                            assigns,
                            porderedconcret,
                            porderedmaterial,
                            porderedlabor
                    )
            );
        } else {
            return forbidden();
        }
    }



    public static Result getMoveJobs() {
        if (Secured.hasGuestAccess()) {
            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            /*else
            {
                cal.set(java.util.Calendar.Today);
            }*/

            //    cal.add(java.util.Calendar.DATE,0);
            //   cal.add(1,1);

            String d1 =cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();
            // tasks = Task.findWithinDates(d1,d2);


            if (market!=null && !market.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1,d2,market);
            } else {
                tasks = Task.findWithinDates(d1,d2);
            }

            Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
            // najdi gi site assigns od site ovie taskovi
            List<Assigns> assigns = new ArrayList<Assigns>();
            for(Task tskTemp: tasks)
            {
                try
                {
                    Assigns ass = Assigns.find.where().eq("jobid", tskTemp.job.id).eq("taskid", tskTemp.id).findUnique();
                    if (ass!=null)
                        assigns.add(ass);

                    porderedconcret.put(tskTemp.id, isAllOrdered(tskTemp, 3l));
                    porderedmaterial.put(tskTemp.id, isAllOrdered(tskTemp, 2l));
                    porderedlabor.put(tskTemp.id, isAllOrderedLabor(tskTemp));

                }
                catch(Exception ex){}
            }
            // i dodaj mu gi vo view-to




            return ok(
                    views.html.calendarmovejobs.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            User.find.all(),
                            tasks,
                            d1,
                            market,
                            manager,
                            assigns,
                            porderedconcret,
                            porderedmaterial,
                            porderedlabor
                    )
            );
        } else {
            return forbidden();
        }
    }






    public static Result getAcualTasksperJobperType() {
        if (Secured.hasGuestAccess()) {
            String tasktype = request().getQueryString("tasktype");
            String jobid = request().getQueryString("jobid");
            List<Task> tasks = new ArrayList<Task>();
            if (tasktype!=null && !tasktype.equals("")) {
                tasks = Task.findByJob(Long.parseLong(jobid));
            } else {
                tasks = Task.find.where().eq("job_id", jobid).eq("task_type_id", tasktype).findList();
            }
          return ok(toJson(tasks));
        } else {
            return forbidden();
        }
    }

    public static Result getTasksbyJob(Long jobid){
        if (Secured.hasGuestAccess()) {
            List<Task> tasks = new ArrayList<Task>();
            tasks = Task.findByJob(jobid);
            return ok(toJson(tasks));
        } else {
            return forbidden();
        }
    }


    public static Result getDailyTasksActuals() {
        if (Secured.hasGuestAccess()) {
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

            List<Task> tasksAssigned = new ArrayList<Task>();
            User fieldmanager = Application.getLocalUser(session());

            if (Secured.getuserAuthority() == 3)
            {

                Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
                Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();
                Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
                // mora tasks da se filtriraat i po userot sto e najaven
                List<Assigns> assignedTasks = Assigns.find.where().eq("fieldmanagerid", fieldmanager.id ).findList();
                for (Task ts : tasks)
                {

                        boolean flagAssignField = false;
                        for (Assigns ass : assignedTasks)
                        {
                            if ((long)ts.job.id == (long)ass.jobid && (long)ts.id == (long)ass.taskid)
                                flagAssignField = true;
                        }
                        if (flagAssignField)
                            tasksAssigned.add(ts);



                            porderedconcret.put(ts.id, isAllOrdered(ts, 3l));
                            porderedmaterial.put(ts.id, isAllOrdered(ts, 2l));
                            porderedlabor.put(ts.id, isAllOrderedLabor(ts));

                }
                tasks = tasksAssigned;

                return ok(
                        views.html.calendardailyactualsfield.render(
                                User.find.byId(Long.parseLong(request().username())),
                                Market.find.all(),
                                User.find.all(),
                                tasks,
                                d1,
                                market,
                                manager

                        )
                );
            }
            else
            {
                return ok(
                        views.html.calendardailyactuals.render(
                                User.find.byId(Long.parseLong(request().username())),
                                Market.find.all(),
                                User.find.all(),
                                tasks,
                                d1,
                                market,
                                manager
                        )
                );
            }
        } else {
            return forbidden();
        }
    }


    public static boolean hasLabor(Task t)
    {
        boolean imaLabor = false;
        List<Lineitem> lilabor = new ArrayList<Lineitem>();
        lilabor = Lineitem.find.where().eq("task_id", t.id).eq("item_type_id", 1).isNull("task_type_id").findList();
        if (lilabor.size() > 0)
            imaLabor = true;

        return imaLabor;
    }


    public static Result getDailyTasksLaborActuals() {
        if (Secured.hasGuestAccess()) {
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

            List<Task> tasksAssigned = new ArrayList<Task>();
            User fieldmanager = Application.getLocalUser(session());
            List<Task> tsLabor = new ArrayList<Task>();
            for (Task ts : tasks)
            {
                if (hasLabor(ts))
                    tsLabor.add(ts);
            }


            if (Secured.getuserAuthority() == 3)
            {

                Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
                Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();
                Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
                // mora tasks da se filtriraat i po userot sto e najaven
                List<Assigns> assignedTasks = Assigns.find.where().eq("fieldmanagerid", fieldmanager.id ).findList();


                for (Task ts : tasks)
                {

                    boolean flagAssignField = false;
                    for (Assigns ass : assignedTasks)
                    {
                        if ((long)ts.job.id == (long)ass.jobid && (long)ts.id == (long)ass.taskid)
                            flagAssignField = true;
                    }
                    if (flagAssignField)
                        tasksAssigned.add(ts);


                    porderedconcret.put(ts.id, isAllOrdered(ts, 3l));
                    porderedmaterial.put(ts.id, isAllOrdered(ts, 2l));
                    porderedlabor.put(ts.id, isAllOrderedLabor(ts));

                }
                tsLabor = tasksAssigned;

                return ok(
                        views.html.calendardailyactualsfield.render(
                                User.find.byId(Long.parseLong(request().username())),
                                Market.find.all(),
                                User.find.all(),
                                tsLabor,
                                d1,
                                market,
                                manager

                        )
                );
            }
            else
            {
                return ok(
                        views.html.calendardailyactuals.render(
                                User.find.byId(Long.parseLong(request().username())),
                                Market.find.all(),
                                User.find.all(),
                                tsLabor,
                                d1,
                                market,
                                manager
                        )
                );
            }
        } else {
            return forbidden();
        }
    }






    public static Result getDailyTasksHome() {
        if (Secured.hasGuestAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");

            java.util.Calendar cal = java.util.Calendar.getInstance();

            String d1 =cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();

            if (market!=null && !market.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1, d2, market);
                }
            else
                {
                tasks = Task.findWithinDates(d1,d2);
                }


            // najdi gi site assigns od site ovie taskovi
            List<Assigns> assigns = new ArrayList<Assigns>();
            Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
            for(Task tskTemp: tasks)
            {
                try
                {
                    Assigns ass = Assigns.find.where().eq("jobid", tskTemp.job.id).eq("taskid", tskTemp.id).findUnique();
                    if (ass!=null)
                        assigns.add(ass);



                    porderedconcret.put(tskTemp.id, isAllOrdered(tskTemp, 3l));
                    porderedmaterial.put(tskTemp.id, isAllOrdered(tskTemp, 2l));
                    porderedlabor.put(tskTemp.id, isAllOrderedLabor(tskTemp));
                }
                catch(Exception ex){}
            }
            // i dodaj mu gi vo view-to

            return ok(
                    views.html.calendardaily_home.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            User.find.all(),
                            tasks,
                            d1,
                            market,
                            manager,
                            assigns,
                            porderedconcret,
                            porderedmaterial,
                            porderedlabor
                    )
            );
        } else {
            return forbidden();
        }
    }


    public static Integer isAllOrdered(Task t, Long itemtype)
    {
      // vidi gi site od lineitem kade ne se labor broj na ACTUALS-so task_type_id != null and item_type>1
        List<Lineitem> limactuals = new ArrayList<Lineitem>();
        limactuals = Lineitem.find.where().eq("job_id", t.job.id).eq("task_id", t.id).isNull("task_type_id").eq("item_type_id", itemtype).findList();

        // treba da se isti so lineitempos za toj taskid kade history =0
        List<Lineitempos> limpos = new ArrayList<Lineitempos>();
        List<Lineitempos> limposTemp = new ArrayList<Lineitempos>();
        limposTemp = Lineitempos.find.where().eq("taskid", t.id).eq("historyflag", 0).findList();

        // isfiltriraj po
        for (Lineitempos lips : limposTemp)
        {
            if (lips!=null && lips.lineitemid!=null)
            {
            Lineitem limt = Lineitem.find.byId(lips.lineitemid);
                   if (limt!= null && limt.itemType!=null && limt.itemType.id!=null && limt.itemType.id == itemtype)
                    limpos.add(lips);
            }
        }

        // 0 nisto ne e naracano, 1 delumno naracano, 2 celosno naracano
        Integer status = 0;
        if (limpos.size() == 0)
            status =  0;
        else if (limactuals.size()!=0 && limpos.size() < limactuals.size())
            status =  1;
        else if (limactuals.size()!=0 && limpos.size() == limactuals.size())
            status = 2;

        return status;
    }



    public static Integer isAllOrderedLabor(Task t)
    {

        // vidi kolku imame planirano labor - sto ne se actuals
        List<Lineitem> lilabplanned = new ArrayList<Lineitem>();
        lilabplanned = Lineitem.find.where().eq("job_id", t.job.id).eq("task_id", t.id).isNull("task_type_id").eq("item_type_id", 1).findList();
        // tuka ni se planiranite


        // vidi sega dali po planiranite imame stavano actuals
        // ako imame poveke
        List<Lineitem> lilabactuals = new ArrayList<Lineitem>();
        // isfiltriraj po


        boolean ovojima = true;
        Integer status = 0;
        for (Lineitem lip : lilabplanned)
        {
          //  ovojima = true;
            if (lip!=null && lip.id!=null)
            {
                List<Lineitem> lilconretenlabor = new ArrayList<Lineitem>();
                lilconretenlabor = Lineitem.find.where().eq("job_id", t.job.id).eq("task_id", lip.task.id).eq("task_type_id", 4).eq("item_type_id", 1).eq("position", lip.id).findList();
                if ( lilconretenlabor.size()==0)
                    ovojima = false;
                else
                    status =1;
            }
        }

        // 0 nieden labor po nikoj osnov ne e popolnet, 1 samo nekoj od labor ne e popolnet, 2  site labor po sekoj osnov se popolneti

        if (ovojima && status ==1)
            status =  2;
        return status;
    }




    public static Result getWeekTasks() {
        if (Secured.hasGuestAccess()) {
            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");
            String jobcategory = request().getQueryString("category");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.add(java.util.Calendar.DATE,2-cal.get(java.util.Calendar.DAY_OF_WEEK));
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            cal.add(java.util.Calendar.DATE,5);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();
            if (market!=null && !market.equals("")) {
                    if (jobcategory!=null && !jobcategory.equals("")) {
                        tasks = Task.findWithinDatesForMarketandCategory(d1, d2, market, jobcategory);
                    }
                    else
                    {
                        tasks = Task.findWithinDatesForMarket(d1,d2,market);
                    }
                }
             else {
                    if (jobcategory!=null && !jobcategory.equals("")) {
                        tasks = Task.findWithinDatesForCategory(d1, d2,  jobcategory);
                    }
                    else
                    {
                        tasks = Task.findWithinDates(d1,d2);
                    }
            }

            // najdi gi site assigns od site ovie taskovi
            List<Assigns> assigns = new ArrayList<Assigns>();
            Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();

            for(Task tskTemp: tasks)
            {
                porderedconcret.put(tskTemp.id, isAllOrdered(tskTemp, 3l));
                porderedmaterial.put(tskTemp.id, isAllOrdered(tskTemp, 2l));
                porderedlabor.put(tskTemp.id, isAllOrderedLabor(tskTemp));

                try
                {
                    Assigns ass = Assigns.find.where().eq("jobid", tskTemp.job.id).eq("taskid", tskTemp.id).findUnique();
                    if (ass!=null)
                        assigns.add(ass);
                   /* if (isAllOrdered(tskTemp))
                        pordered.put(tskTemp.id, true);
                    else
                        pordered.put(tskTemp.id, false);
                   */
                }
                    catch(Exception ex){}
            }
            // i dodaj mu gi vo view-to


            return ok(
                    views.html.calendar_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                           User.find.all(),
                           /* User.find.where().lt("authority",2).findList(),*/
                            JobCategory.find.all(),
                            tasks,
                            d1,
                            market,
                            manager,
                            jobcategory,
                            assigns,
                            porderedconcret,
                            porderedmaterial,
                            porderedlabor
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result printWeekTasks() {
        if (Secured.hasGuestAccess()) {
            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");
            String jobcategory = request().getQueryString("category");
            String font = request().getQueryString("font");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.add(java.util.Calendar.DATE,2-cal.get(java.util.Calendar.DAY_OF_WEEK));
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            cal.add(java.util.Calendar.DATE,5);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();

            if (market!=null && !market.equals("")) {
                if (jobcategory!=null && !jobcategory.equals("")) {
                    tasks = Task.findWithinDatesForMarketandCategory(d1, d2, market, jobcategory);
                }
                else
                {
                    tasks = Task.findWithinDatesForMarket(d1,d2,market);
                }
            }
            else {
                if (jobcategory!=null && !jobcategory.equals("")) {
                    tasks = Task.findWithinDatesForCategory(d1, d2,  jobcategory);
                }
                else
                {
                    tasks = Task.findWithinDates(d1,d2);
                }
            }

            // najdi gi site assigns od site ovie taskovi
            List<Assigns> assigns = new ArrayList<Assigns>();
            Map<Long, Integer> porderedconcret = new HashMap<Long, Integer>();
            Map<Long, Integer> porderedmaterial = new HashMap<Long, Integer>();

            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
            for(Task tskTemp: tasks)
            {
                try
                {
                    Assigns ass = Assigns.find.where().eq("jobid", tskTemp.job.id).eq("taskid", tskTemp.id).findUnique();
                    if (ass!=null)
                        assigns.add(ass);

                    porderedconcret.put(tskTemp.id, isAllOrdered(tskTemp, 3l));
                    porderedmaterial.put(tskTemp.id, isAllOrdered(tskTemp, 2l));
                    porderedlabor.put(tskTemp.id, isAllOrderedLabor(tskTemp));
                   /* if (isAllOrdered(tskTemp))
                        pordered.put(tskTemp.id, true);
                    else
                        pordered.put(tskTemp.id, false);*/
                }
                catch(Exception ex){}
            }
            // i dodaj mu gi vo view-to

            return PDF.ok(
                    views.html.print.calendar_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            User.find.all(),
                            JobCategory.find.all(),
                            tasks,
                            d1,
                            market,
                            manager,
                            jobcategory,
                            font,
                            assigns,
                            porderedconcret,
                            porderedmaterial,
                            porderedlabor
                    )
            );
        } else {
            return forbidden();
        }
    }

    // GET           /calendar/malendar/print                         controllers.Tasks_rd.testPdf()
    public static Result testPdf(){

        return PDF.ok(views.html.document.render("jhvhjgchgchch"));
    }




    public static Result initPdf(){

        String date = request().getQueryString("date");
        String market = request().getQueryString("market");
        String manager = request().getQueryString("manager");

        java.util.Calendar cal = java.util.Calendar.getInstance();
        if (date != null) {
            String[] splitDate = date.split("-");
            cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
        }
        cal.add(java.util.Calendar.DATE,2-cal.get(java.util.Calendar.DAY_OF_WEEK));
        String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
        cal.add(java.util.Calendar.DATE,5);
        String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

        List<Task> tasks = new ArrayList<Task>();

        // _______________________________________________________________________________

        File file;
        try {
        file = new File("mydata.xlsx");

        FileOutputStream fileOut = new FileOutputStream(file);
        XSSFWorkbook wb = new XSSFWorkbook();
        //Workbook wb = new XSSFWorkbook(); Doesn't work either
        Sheet sheet = wb.createSheet("Sheet1");
        int rNum = 0;
        Row row = sheet.createRow(rNum);
        int cNum = 0;
        Cell cell = row.createCell(cNum);
        cell.setCellValue("My Cell Value");
        wb.write(fileOut);
        fileOut.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        response().setContentType("application/x-download");
        response().setHeader("Content-disposition","attachment; filename=mydata.xlsx");
        return ok(new File("mydata.xlsx"));
       // return ok(file);
      //  return ok(views.html.indexPDF.render("sd sd sd as"));

    }

    public static Result printDayTasks() {
        if (Secured.hasGuestAccess()) {
            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");
            String showRates = "false";
            if (Secured.hasAdministratorAccess()) {
                showRates = request().getQueryString("withrates");
            }

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();
            if (market!=null && !market.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1,d1,market);
            } else {
                tasks = Task.findWithinDates(d1,d1);
            }



            return PDF.ok(
                    views.html.print.dayJobCards.render(
                            User.find.byId(Long.parseLong(request().username())),
                            JobCategory.find.all(),
                            PlanItem.find.all(),
                            tasks,
                            manager,
                            Boolean.parseBoolean(showRates)
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result addTask() {
        if (Secured.hasManagerAccess()) {
            Calendar calendar = Calendar.getInstance();
            calendar.set(calendar.get(Calendar.YEAR),calendar.get(Calendar.MONTH),calendar.get(Calendar.DATE),0,0,0);

            Date date = calendar.getTime();
            Task newTask = Task.addTask(
                    form().bindFromRequest().get("id"),
                    form().bindFromRequest().get("taskType"),
                    "",
                    date
            );
            return ok(views.html.actuals.task.render(newTask));
        } else {
            return forbidden();
        }
    }


    public static Result CheckUnAssingedTask() {
        if (Secured.hasManagerAccess()) {

            String datumotstr =   form().bindFromRequest().get("datumot");
            String jobid =   form().bindFromRequest().get("jobid");
            DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
            // DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            Date startdatelineitem = new Date();
            String datefinal = "";
            try {
                if (datumotstr!=null) {
                    //startdatelineitem = format.parse(datumotstr);
                 //   datumotstr = datumotstr + " 00:00:00";
                    startdatelineitem = format.parse(datumotstr);
                    datefinal = df.format(startdatelineitem);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            Task newTask = null;
            try{
                newTask = Task.find.where().eq("job_id", jobid).eq("date" ,datefinal).findUnique();
                Assigns ass = Assigns.find.where().eq("taskid", newTask.id).findUnique();
                if (ass!=null)
                    newTask = null;
            }
            catch (Exception ex){}
            if (newTask==null)
                return ok(toJson(""));
            else
                return ok(toJson(newTask));
        } else {
            return forbidden();
        }
    }








    public static Result addTaskNewPlans() {
        if (Secured.hasManagerAccess()) {

            String datumotstr =   form().bindFromRequest().get("datumot");
            DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
            Date startdatelineitem = new Date();
            try {
                if (datumotstr!=null) {
                    startdatelineitem = format.parse(datumotstr);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            Task newTask = Task.addTask(
                    form().bindFromRequest().get("jobid"),
                    form().bindFromRequest().get("taskType"),
                    form().bindFromRequest().get("crew"),
                    startdatelineitem
            );
            return ok(toJson(newTask));
        } else {
            return forbidden();
        }
    }


    public static Result addTaskActual() {
        if (Secured.hasManagerAccess()) {
            String dateno = request().getQueryString("date");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (dateno != null) {
                String[] splitDate = dateno.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            Date date = cal.getTime();
            Task newTask = Task.addTask(
                    form().bindFromRequest().get("id"),
                    form().bindFromRequest().get("taskType"),
                    "1",
                    date
            );
            return ok(toJson(newTask));
        } else {
            return forbidden();
        }
    }

    public static Result addNewTaskLabor(){
        // Task addTask(String job, String taskType, String crew, Date date, String note) {
        if (Secured.hasManagerAccess()) {

            String dateno = request().getQueryString("taskdate");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (dateno != null) {
                String[] splitDate = dateno.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.set( Calendar.HOUR_OF_DAY, 0 );
            cal.set( Calendar.MINUTE, 0 );
            cal.set( Calendar.SECOND, 0 );
            cal.set( Calendar.MILLISECOND, 0 );
            Date date = cal.getTime();


            Task newTask = Task.addTaskLabor(
                    form().bindFromRequest().get("jobid"),
                    "4",
                    "",
                    date,
                    form().bindFromRequest().get("note")
            );
            return ok(toJson(newTask));
        } else {
            return forbidden();
        }
    }


    public static Result deleteTask(Long id) {
        if (Secured.hasManagerAccess()) {
            Map<String,String> cardOrder = new HashMap<String,String>();
            cardOrder.put("cardOrder", "99");
            List<Task> tasks = Task.update(id,cardOrder);
            Task task = Task.find.byId(id);
            for (Lineitem lineitem : task.lineitems) {
                lineitem.task = null;
                lineitem.update();
            }
            task.delete();
            return ok(toJson(tasks));
        } else {
            return forbidden();
        }
    }





    public static Result updateTask(Long id) {
        if (Secured.hasManagerAccess()) {
            List<Task> tasks = Task.update(
                id,
                form().bindFromRequest().data()
            );

            return ok(toJson(tasks));
        } else {
            return forbidden();
        }
    }
}
