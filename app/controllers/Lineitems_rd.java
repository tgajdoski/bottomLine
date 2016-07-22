package controllers;

import com.lowagie.text.ListItem;
import models.*;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import quickbooks.Queue;
import com.avaje.ebean.*;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static play.data.Form.form;
import static play.libs.Json.toJson;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/4/13
 * Time: 9:22 AM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Lineitems_rd extends Controller {
    public static Result addBudgetLineitem() {
        if (Secured.hasManagerAccess()) {
            Lineitem newLineitem = Lineitem.addLineitem(
                    form().bindFromRequest().get("job"),
                    form().bindFromRequest().get("plan"),
                    "",
                    "",
                    "",
                    User.find.byId(Long.parseLong(request().username()))
            );
            return ok(views.html.budgets.lineitem.render(
                    User.find.byId(Long.parseLong(request().username())),
                    newLineitem));
        } else {
            return forbidden();
        }
    }

    public static Date removeTime(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    public static Result addActualLineitem() {
        if (Secured.hasManagerAccess()) {

            Lineitem newLineitem = Lineitem.addLineitem(
                    form().bindFromRequest().get("id"),
                    "",
                    form().bindFromRequest().get("taskType"),
                    form().bindFromRequest().get("itemType"),
                    form().bindFromRequest().get("task"),
                    User.find.byId(Long.parseLong(request().username()))
            );


            return ok(views.html.actuals.lineitem.render(
                    User.find.byId(Long.parseLong(request().username())),
                    newLineitem
            ));
        } else {
            return forbidden();
        }
    }

    public static Result addActualNewLineitem() {
        // @(user: User, lineitem: Lineitem,  jobassigns: List[Assigns], users: List[User])
        if (Secured.hasManagerAccess()) {


            List<Assigns> ssa = null;

            Lineitem newLineitem = Lineitem.addLineitem(
                    form().bindFromRequest().get("id"),
                    "",
                    form().bindFromRequest().get("taskType"),
                    form().bindFromRequest().get("itemType"),
                    form().bindFromRequest().get("task"),
                    User.find.byId(Long.parseLong(request().username()))
            );

            // zemi prvo jobid of actualline-ot
            ssa = Assigns.find.where().eq("jobid" , newLineitem.job.id).findList();


            return ok(views.html.actuals.lineitem_new.render(
                    User.find.byId(Long.parseLong(request().username())),
                    newLineitem,
                    ssa,
                    User.find.all()
            ));
        } else {
            return forbidden();
        }
    }




    public static Result updateTaskNoteLineItem() {
        // @(user: User, lineitem: Lineitem,  jobassigns: List[Assigns], users: List[User])
        if (Secured.hasManagerAccess()) {

            String lineitemid = form().bindFromRequest().get("lineitemid");
            String note = form().bindFromRequest().get("note");

            Lineitem lineitem = Lineitem.find.byId(Long.parseLong(lineitemid));
             if (lineitem!=null && lineitem.task!=null && !note.equals(""))
             {
                 Task tmptsk = lineitem.task;
                 tmptsk.notes = note;
                 tmptsk.update();
             }
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result addNewActualLineitem() {
        if (Secured.hasManagerAccess()) {
            Lineitem newLineitem = Lineitem.addLineitem(
                    form().bindFromRequest().get("id"),
                    "",
                    form().bindFromRequest().get("taskType"),
                    form().bindFromRequest().get("itemType"),
                    form().bindFromRequest().get("task"),
                    User.find.byId(Long.parseLong(request().username()))
            );
            return ok(toJson(newLineitem));
        } else {
            return forbidden();
        }
    }


    public static Result CheckExistAssignedLineItemsTaskidsNewJob(String lineitemsselected) {
        if (Secured.hasManagerAccess()) {
           String oviegiima = "";
            if (!lineitemsselected.equals(""))
            {
                String[] linitemsids = null;
                try{
                 linitemsids = lineitemsselected.split("-");
                }
                catch(Exception ex)
                {
                    String a = "asdasd";
                }

                    Lineitem litest = null;
                    for(int i=0; i<linitemsids.length; i++)
                    {
                        Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                        if (lm!= null && lm.task != null && lm.task.id != null )
                            oviegiima+=lm.task.id+ "-";
                    }
            }
            return ok(toJson(oviegiima));
        } else {
            return forbidden();
        }
    }


    public static Result deletelaborassignstaskandlineitems(String lineitemslaborid)
    {
        if (!lineitemslaborid.equals(""))
        {
            String[] linitemsids = lineitemslaborid.split("-");
            for(int i=0; i<linitemsids.length; i++)
            {
                Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                if (lm!= null && lm.task != null && lm.task.id != null )
                {
                    try
                    {

                        // brisam drugi lineitemi so toj task id

                        // brisam assignes
                        Assigns ass = Assigns.find.where().eq("jobid", lm.job.id).eq("taskid", lm.task.id).findUnique();

                        if (ass!=null)
                        {
                                    Task tsk = Task.find.byId(ass.taskid);
                                    if (tsk != null)
                                    {
                                        // izbrisi gi site lineitemi sto se po toj osnov na labor stavani vo toj task
                                        List<Lineitem> lizabrisenje = Lineitem.find.where().eq("task_id", tsk.id).eq("task_type_id", 4).findList();
                                        // ovie brisi gi
                                        String ids = "";
                                        for(Lineitem LiDel: lizabrisenje)
                                        {
                                            ids += LiDel.id +"-";
                                        }
                                        if (!ids.equals(""))
                                        {
                                            String[] liidsstring = null;
                                            try{
                                                liidsstring = ids.split("-");
                                            }
                                            catch(Exception ex)
                                            {

                                            }

                                            for(int j=0; j<liidsstring.length; j++)
                                            {
                                                Lineitem lmbris = Lineitem.find.byId(Long.parseLong(liidsstring[j]));
                                                if (lmbris != null)
                                                    lmbris.delete();
                                            }
                                        }

                                        // a ovie updatiraj gi - ovie idaat od planot i se obicnite nabroeni na koj mora da im se smeni taskid-to kako nealocirani voopsto
                                        List<Lineitem> listazaupdatenataskid = Lineitem.find.where().eq("task_id", tsk.id).isNull("task_type_id").findList();
                                        for(Lineitem LiUPA: listazaupdatenataskid)
                                        {
                                            LiUPA.task = null;
                                       //     LiUPA.daysdate = null;
                                            LiUPA.update();
                                        }

                                        // brisi go taskot
                                        tsk.delete();

                                    }
                                    ass.delete();
                        }
                    }
                    catch (Exception ex)
                    {}

                }
            }
        }
            return ok();

    }


    public static boolean haveVerified(Task t)
    {
        boolean imaverified = false;
        List<Lineitem> listverify = Lineitem.find.where().eq("task_id", t.id).eq("verify", 1).findList();
        if (!listverify.isEmpty())
            imaverified = true;
        return imaverified;
    }



    public static Result deletealreadyassignedtaskandassigns(String lineitemsselected)
{
    if (!lineitemsselected.equals(""))
    {
        String[] linitemsids = lineitemsselected.split("-");
        Lineitem litest = null;
        for(int i=0; i<linitemsids.length; i++)
        {
            Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
            if (lm!= null && lm.task != null && lm.task.id != null )
            {
              try
              {
                  // brisam assignes
                Assigns ass = Assigns.find.where().eq("jobid", lm.job.id).eq("taskid", lm.task.id).findUnique();
                if (ass!=null)
                {
                    // proveri kolku lineitemi ima toj ass i dali e ista brojka i dali se istite kako i lineitemsselected
                    // ako se togas

                    List<Lineitem> lineitemsodAss = Lineitem.find.where().eq("job_id", ass.jobid).eq("task_id", lm.task.id).eq("task_type_id", 4).findList();
                    if (lineitemsodAss.size() <= linitemsids.length)
                    {
                        boolean razlicni = false;
                        for(Lineitem LiA: lineitemsodAss)
                        {

                            if (!lineitemsselected.toLowerCase().contains(LiA.id.toString().toLowerCase()))
                                razlicni = true;
                        }
                        if (!razlicni)
                        {
                            // brisam tasks i assign
                            Task tsk = Task.find.byId(ass.taskid);
                            if (tsk != null)
                                tsk.delete();

                            ass.delete();
                        }
                    }
               }

              }
              catch (Exception ex)
              {}

            }
        }
    }
    return ok();

}



    public static Result deleteifSingleTaskandPlanUpdate(String lineitemid)
    {
        if (!lineitemid.equals(""))
        {
                Lineitem lm = Lineitem.find.byId(Long.parseLong(lineitemid));
                if (lm!= null)
                {
                        if (lm.job != null && lm.job.id != null && lm.task != null && lm.task.id != null )
                        {
                            try
                            {
                                List<Lineitem> lineitemsodAss = Lineitem.find.where().eq("job_id", lm.job.id).eq("task_id", lm.task.id).isNotNull("task_type_id").findList();
                                if (lineitemsodAss.size() > 1)
                                {
                                    // ima i drugi i nema sto da se brise
                                }
                                    else
                                {
                                    // brisam tasks i assign
                                    Task tsk = Task.find.byId(lm.task.id);
                                    if (tsk != null)
                                        tsk.delete();
                                    Assigns ass = Assigns.find.where().eq("jobid", lm.job.id).eq("taskid", lm.task.id).findUnique();
                                    if (ass!=null)
                                    {
                                    ass.delete();
                                    }
                                }
                            }
                            catch (Exception ex)
                            {}
                        }
                    // ako nema task
                   // nema sto da se brise osven da se setiraat planitemite na null task - kako ne alocirani
                }
        }
        return ok();
    }



    public static Result deleteTaskNotAllActuals(String Lineitemids)
    {
        // brisime samo lineitemite po spisok... tie sto se fateni
        if (Secured.hasManagerAccess()) {

            String[] lineids = Lineitemids.split("-");

            for (int i=0; i < lineids.length; i++)
            {
                if (lineids[i] != null && lineids[i] != "")
                {
                        Lineitem fatenlineitem = Lineitem.find.byId(Long.parseLong(lineids[i]));

                    List<Lineitem> litem = new ArrayList<Lineitem>();

                    if (fatenlineitem != null && fatenlineitem.job!=null && fatenlineitem.task!=null)
                    {
                        if (fatenlineitem.itemType.id == 1L ) // labor
                            litem = Lineitem.find.where().eq("job.id", fatenlineitem.job.id).eq("task.id",fatenlineitem.task.id).eq("position", fatenlineitem.id).eq("item_type_id", 1).isNotNull("taskType").findList();
                        else
                            litem = Lineitem.find.where().eq("job.id", fatenlineitem.job.id).eq("task.id",fatenlineitem.task.id).eq("item_type_id", fatenlineitem.itemType.id).eq("vendor.id", fatenlineitem.vendor.id).eq("item.id", fatenlineitem.item.id).isNotNull("taskType").findList();
                    }

                    if (litem !=null)
                    {
                        for(Lineitem LiA: litem)
                        {
                            LiA.delete();
                        }
                    }

                }
            }

            return ok();
        } else {
            return forbidden();
        }



    }


    public static Result deleteTaskActuals()
    {
        if (Secured.hasManagerAccess()) {

            String taskid = form().bindFromRequest().get("taskid");
            String jobid = form().bindFromRequest().get("jobid");

            Task tsk = Task.find.byId(Long.parseLong(taskid));

            // gi brisime site so type 4 - actuals
            List<Lineitem> lineitemsodAss = Lineitem.find.where().eq("job_id", jobid).eq("task_id", taskid).eq("task_type_id", 4).findList();
            for(Lineitem LiA: lineitemsodAss)
            {
                LiA.delete();
            }
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result checkTaskActuals()
    {
        if (Secured.hasManagerAccess()) {

            String taskid = form().bindFromRequest().get("taskid");
            String jobid = form().bindFromRequest().get("jobid");

            Task tsk = Task.find.byId(Long.parseLong(taskid));

            // gi brisime site so type 4 - actuals
            List<Lineitem> lineitemsodAss = Lineitem.find.where().eq("job_id", jobid).eq("task_id", taskid).eq("task_type_id", 4).findList();

            return ok(toJson(lineitemsodAss.size()));
        } else {
            return forbidden();
        }
    }




    public static Result DeleteTasksWithoutLineitems()
    {
        if (Secured.hasManagerAccess()) {
            String jobid = form().bindFromRequest().get("jobid");
            String s = "delete from task where job_id = :jobid and task_type_id =4 and id is not null and id not in (select distinct(task_id) from lineitem where job_id = :jobid and task_id is not null)";
            SqlUpdate delete = Ebean.createSqlUpdate(s);
            delete.setParameter("jobid", jobid);

            int modifiedCount = Ebean.execute(delete);

            return ok();

        } else {
            return forbidden();
        }
    }



    public static Result deleteTaskActualsAssignsResetPlanItems()
    {
        if (Secured.hasManagerAccess()) {

            String taskid = form().bindFromRequest().get("taskid");
            String jobid = form().bindFromRequest().get("jobid");

            Task tsk = Task.find.byId(Long.parseLong(taskid));

            // gi brisime site so type 4 - actuals
            List<Lineitem> lineitemsodAss = Lineitem.find.where().eq("job_id", jobid).eq("task_id", taskid).eq("task_type_id", 4).findList();
            for(Lineitem LiA: lineitemsodAss)
            {
                LiA.delete();
            }

            // gi setirame ostanatite task lineitemi na null - od planot - ZA DA MOZE PAK DA SE SETIRAAT
            List<Lineitem> lineitemsodPlan = Lineitem.find.where().eq("job_id", jobid).eq("task_id", taskid).isNull("task_type_id").findList();
            for (Lineitem lineitem :lineitemsodPlan) {
                lineitem.task = null;
                lineitem.update();
            }
            // brisam tasks i
            //
            // naogjame taskot
            Map<String,String> cardOrder = new HashMap<String,String>();
            cardOrder.put("cardOrder", "99");
            List<Task> tasks = Task.update(Long.parseLong(taskid),cardOrder);

            // go pomestuvame da e posleden vo denot i posle gi brisime assigns
            tsk = Task.find.byId(Long.parseLong(taskid));
            if (tsk != null)
                tsk.delete();
            // BRISAM ASSIGNS ako ima
            Assigns ass = Assigns.find.where().eq("jobid", jobid).eq("taskid",taskid).findUnique();
            if (ass!=null)
            {
                ass.delete();
            }
            return ok();

        } else {
            return forbidden();
        }
    }



    public static Result deleteassignstaskandsetplanlineitems(String lineitemslaborid)
    {
        if (!lineitemslaborid.equals(""))
        {
            String[] linitemsids = lineitemslaborid.split("-");
            for(int i=0; i<linitemsids.length; i++)
            {
                Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                if (lm!= null && lm.task != null && lm.task.id != null )
                {
                    try
                    {

                        // brisam drugi lineitemi so toj task id

                        // brisam tasks
                            Task tsk = Task.find.byId(lm.task.id);
                            if (tsk != null)
                            {
                                // izbrisi gi site lineitemi sto se po toj osnov na labor stavani vo toj task
                                List<Lineitem> lizabrisenje = Lineitem.find.where().eq("task_id", tsk.id).eq("task_type_id", 4).findList();
                                // ovie brisi gi
                                String ids = "";
                                for(Lineitem LiDel: lizabrisenje)
                                {
                                    ids += LiDel.id +"-";
                                }
                                if (!ids.equals(""))
                                {
                                    String[] liidsstring = null;
                                    try{
                                        liidsstring = ids.split("-");
                                    }
                                    catch(Exception ex)
                                    {

                                    }

                                    for(int j=0; j<liidsstring.length; j++)
                                    {
                                        Lineitem lmbris = Lineitem.find.byId(Long.parseLong(liidsstring[j]));
                                        if (lmbris != null && lmbris.verify !=1)
                                            lmbris.delete();
                                    }
                                }

                                // a ovie updatiraj gi - ovie idaat od planot i se obicnite nabroeni na koj mora da im se smeni taskid-to kako nealocirani voopsto
                                List<Lineitem> listazaupdatenataskid = Lineitem.find.where().eq("task_id", tsk.id).isNull("task_type_id").findList();
                                for(Lineitem LiUPA: listazaupdatenataskid)
                                {
                                    if (LiUPA.verify!=1)
                                    {
                                        LiUPA.task = null;
                                        //     LiUPA.daysdate = null;
                                        LiUPA.update();
                                    }
                                }

                                // brisi go taskot ako nema verify lineitem
                                if (!haveVerified(tsk))
                                    tsk.delete();

                            }

                        // brisam assignmenti ako ima
                        if (!haveVerified(tsk))
                        {
                            Assigns ass = Assigns.find.where().eq("jobid", lm.job.id).eq("taskid", lm.task.id).findUnique();
                            if (ass!=null)
                                ass.delete();
                        }
                    }
                    catch (Exception ex)
                    {}
                }
            }
        }
        return ok();
    }




    public static Result addLineCalendarLabor(){
        if (Secured.hasManagerAccess()) {
            String jobid = form().bindFromRequest().get("selectedJob");
            String item = form().bindFromRequest().get("item");
            String itemtype = form().bindFromRequest().get("itemtype");
            String quantity = form().bindFromRequest().get("quantity");
            String rate = form().bindFromRequest().get("rate");
            String taskid = form().bindFromRequest().get("taskidno");
            String dateactual = form().bindFromRequest().get("dateactual");

              // add new item
                    Lineitem lineitem = Lineitem.addLineitem(jobid,
                        "",
                        null,
                        itemtype,
                        taskid.toString(),
                        null
                );
                // update lineitems
                if (lineitem != null)
                {
                    //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                    lineitem.vendor = null;
                    lineitem.item  = Item.find.byId(Long.parseLong(item));
                    lineitem.quantity +=  Double.parseDouble(quantity);
                    lineitem.rate = Double.parseDouble(rate);


                    int iInt = 100;
                    Integer iInteger = new Integer(iInt);
                    lineitem.position =   iInteger;
                    lineitem.saleprice = Double.parseDouble(quantity) * Double.parseDouble(rate);
                    lineitem.task = Task.find.byId(Long.parseLong(taskid));
                    lineitem.user = null;

                    if(!dateactual.equals(""))
                    {
                        DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                        Date dateent = new Date();
                        try {
                            if (dateactual!=null) {
                                dateent = format.parse(dateactual);
                                lineitem.daysdate = dateent;
                            }
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                    }

                    lineitem.update();
                }
            return ok(toJson(lineitem));
        }
        else
        {
            return forbidden();
        }
    }


public static Result addActualLinefromPO(){
    if (Secured.hasManagerAccess()) {
        String jobid = form().bindFromRequest().get("selectedJob");
        String vendor = form().bindFromRequest().get("vendor");
        String item = form().bindFromRequest().get("item");
        String itemtype = form().bindFromRequest().get("itemtype");
        String units = form().bindFromRequest().get("units");
        String quantity = form().bindFromRequest().get("quantity");
        String rate = form().bindFromRequest().get("rate");
        String saleprice = form().bindFromRequest().get("saleprice");
        saleprice = saleprice.replace(",","");
        String tasktype = form().bindFromRequest().get("tasktype");
        String taskid = form().bindFromRequest().get("taskidno");
        String dateactual = form().bindFromRequest().get("dateactual");

        Long itemidto = CheckItemExist(jobid, vendor, item, taskid, tasktype);

    if ( itemidto == 0l)
    {
        // add new item
        Lineitem lineitem = Lineitem.addLineitem(jobid,
                "",
                tasktype,
                itemtype,
                taskid.toString(),
                User.find.byId(Long.parseLong(request().username()))
        );


        // update lineitems
        if (lineitem != null)
        {
            //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
            lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
            lineitem.item  = Item.find.byId(Long.parseLong(item));
            lineitem.units = units;
            lineitem.quantity +=  Double.parseDouble(quantity);
            lineitem.rate = Double.parseDouble(rate);
            lineitem.saleprice +=  Double.parseDouble(saleprice);
            lineitem.task = Task.find.byId(Long.parseLong(taskid));

            lineitem.user =  User.find.byId(Long.parseLong(request().username()));
           // lineitem.daysdate = new Date();


            if(!dateactual.equals(""))
            {
                DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
                Date dateent = new Date();
                try {
                    if (dateactual!=null) {
                        dateent = format.parse(dateactual);
                        lineitem.daysdate = dateent;
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }


            lineitem.update();

            String po = form().bindFromRequest().get("po");
            if (po!=null&&!po.equals("null")) {
                if (po.equals("")&&lineitem.qb_refnumber!=null) {
                    lineitem.qb_refnumber = null;
                    lineitem.qb_txnid = null;
                    lineitem.qb_editsequence = null;
                    lineitem.qb_txnlineid = "-1";
                    lineitem.update();
                } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                    if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                        if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                        }

                        if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                            lineitem.qb_refnumber = po;
                            lineitem.update();
                        }
                    }

                    if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                    {
                        if (!po.equals("...")) {
                            lineitem.qb_refnumber = "...";
                            lineitem.update();
                        }

                        Queue queue = new Queue();
                        queue.username = quickbooks.User.find.byId("qbffi");
                        if (lineitem.itemType.name.equals("labor")) {
                            queue.action = "TimeTrackingAdd";
                        } else {
                            queue.action = "PurchaseOrderMod";
                        }
                        queue.ident = lineitem.id.toString();
                        queue.extra = "";
                        queue.qbxml = "";
                        queue.priority = 1;
                        queue.status = Character.forDigit(26,36);
                        queue.enqueueDatetime = new Date();
                        queue.save("quickbooks");
                    }
                }

            }
        }

    }
    else
    {
        // edit item so itemidto

        Lineitem lineitem = Lineitem.find.byId(itemidto);
        // update lineitems
        if (lineitem != null)
        {
            //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
            lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
            lineitem.item  = Item.find.byId(Long.parseLong(item));
            lineitem.units = units;
            lineitem.quantity +=  Double.parseDouble(quantity);
            lineitem.rate = Double.parseDouble(rate);
            lineitem.saleprice +=  Double.parseDouble(saleprice);
            lineitem.task = Task.find.byId(Long.parseLong(taskid));

            lineitem.user =  User.find.byId(Long.parseLong(request().username()));
            lineitem.daysdate = new Date();
            lineitem.update();

            String po = form().bindFromRequest().get("po");
            if (po!=null&&!po.equals("null")) {
                if (po.equals("")&&lineitem.qb_refnumber!=null) {
                    lineitem.qb_refnumber = null;
                    lineitem.qb_txnid = null;
                    lineitem.qb_editsequence = null;
                    lineitem.qb_txnlineid = "-1";
                    lineitem.update();
                } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                    if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                        if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                        }

                        if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                            lineitem.qb_refnumber = po;
                            lineitem.update();
                        }
                    }

                    if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                    {
                        if (!po.equals("...")) {
                            lineitem.qb_refnumber = "...";
                            lineitem.update();
                        }

                        Queue queue = new Queue();
                        queue.username = quickbooks.User.find.byId("qbffi");
                        if (lineitem.itemType.name.equals("labor")) {
                            queue.action = "TimeTrackingAdd";
                        } else {
                            queue.action = "PurchaseOrderMod";
                        }
                        queue.ident = lineitem.id.toString();
                        queue.extra = "";
                        queue.qbxml = "";
                        queue.priority = 1;
                        queue.status = Character.forDigit(26,36);
                        queue.enqueueDatetime = new Date();
                        queue.save("quickbooks");
                    }
                }
            }
        }
    }
    return ok();
    }
    else
    {
        return forbidden();
    }
}

public static Result deleteActualLinefromPO()
{
    String lineitemid = form().bindFromRequest().get("lineitemid");
     String taskid = form().bindFromRequest().get("taskid");
   /* String itemid = form().bindFromRequest().get("item");
   String jobid = form().bindFromRequest().get("jobid");
    String itemid = form().bindFromRequest().get("itemid");*/

    Lineitem libudget = Lineitem.find.byId(Long.parseLong(lineitemid));
    if (libudget!= null)
    {
        try{
        Lineitem li = Lineitem.find.where().eq("job_id", libudget.job.id).eq("item_id",libudget.item.id).eq("vendor_id",libudget.vendor.id).isNotNull("task_id").isNotNull("task_type_id").eq("task_id",taskid).findUnique();
        if (li!= null)
            li.delete();
        }
        catch(Exception ex){}

    }
    return ok();

}



    public static Result CheckExistTaskperDateJob(String lineitemsselected)
    {
        if (Secured.hasManagerAccess()) {
            List<String> oviegiima = new ArrayList<String>();
            List<Task> taskovistopostojat = new ArrayList<Task>();

            if (!lineitemsselected.equals(""))
            {
                String[] linitemsids = lineitemsselected.split("-");
                // soberi gi task od ovie selektiranive i vrati gi
                for (String liid: linitemsids)
                {
                    if (!liid.equals(""))
                    {
                        try
                        {
                            Lineitem lmodselektiranine = Lineitem.find.byId(Long.parseLong(liid));


                            if (lmodselektiranine.task!=null)
                                taskovistopostojat.add(lmodselektiranine.task);
                        }
                        catch(Exception ex)
                        {}
                    }
                }
            }
            // iscisti od duplikati
            List<Task> tasksnq =  new ArrayList(new HashSet(taskovistopostojat));
            return ok(toJson(tasksnq));
        } else {
            return forbidden();
        }
    }


    public static Result CheckExistAssignedLineItemsNewJob(String lineitemsselected) {
        if (Secured.hasManagerAccess()) {
            List<String> oviegiima = new ArrayList<String>();


            if (!lineitemsselected.equals(""))
            {
                String[] linitemsids = lineitemsselected.split("-");
                Lineitem lmjobselect = Lineitem.find.byId(Long.parseLong(linitemsids[0])); // ova e kolku d ase zeme job id-to

                // soberi gi taskid od ovie selektiranive
                // izbrisi gi site lineitemi sto imaat toj taskid i tasktype = 4

                for (String liid: linitemsids)
                {
                    if (!liid.equals(""))
                    {
                        try
                        {
                            Lineitem lmodselektiranine = Lineitem.find.byId(Long.parseLong(liid));
                            List<Lineitem> lizabrisenje = Lineitem.find.where().eq("task_id", lmodselektiranine.task.id).isNotNull("task_type_id").findList();

                            String ids = "";
                            for(Lineitem LiDel: lizabrisenje)
                            {
                                ids += LiDel.id +"-";
                            }
                            if (!ids.equals(""))
                            {
                                String[] liidsstring = null;
                                try{
                                    liidsstring = ids.split("-");
                                }
                                catch(Exception ex)
                                {

                                }

                                for(int j=0; j<liidsstring.length; j++)
                                {
                                    Lineitem lmbris = Lineitem.find.byId(Long.parseLong(liidsstring[j]));
                                    if (lmbris != null && lmbris.verify != 1)
                                        lmbris.delete();
                                }
                            }


                        }
                        catch(Exception ex)
                        {}
                    }
                }
            }

            // izbrisi gi site  taskid od selektiranive linitemi - setirani na nula  + assignment +
            deleteassignstaskandsetplanlineitems(lineitemsselected);

            /*
            if (!lineitemsselected.equals(""))
            {
            String[] linitemsids = lineitemsselected.split("-");
            Lineitem lmjobselect = Lineitem.find.byId(Long.parseLong(linitemsids[0])); // ova e kolku d ase zeme job id-to
            List<Lineitem> lit =  Lineitem.findBudgetLineitemsByJob(lmjobselect.job.id);
            List<Lineitem> lia =  Lineitem.findActualLineitemsByJob(lmjobselect.job.id);
                // od tuka dodavame logika za ako nema actuallinitem- nisto ne alocirano so task 4 - ili labor ili od new job direktno
                if (!lia.isEmpty()){ // ne e dovolno samo ova moze da ima lia od drugi datumi i da pomine bez fateni tie sto treba da se smenat
                for (Lineitem li : lit)
                {
                  //  Lineitem litest = null;
                    for (Lineitem lm : lia)
                    {
                        try{
                            if (lm!= null && lm.job != null && lm.item != null  && lm.job.id != null && lm.item.id != null  && lm.quantity != null&& li.job != null && li.item != null  && li.job.id != null && li.item.id != null  && li.quantity != null )
                            {
                                if ((lm.job.id).equals(li.job.id) && (lm.item.id).equals(li.item.id) && (li.quantity).equals(lm.quantity) && (li.rate).equals(lm.rate) )
                                {
                                    if (lineitemsselected.contains(li.id.toString()))
                                    {
                                        li.task=null; // prvo brisime taskid od plan lineitemite za da se gleda deka ne e alociran
                                        li.update();
                                        oviegiima.add(lm.id.toString()); // dodeluvame na listata na lineitemi sto treba da se brisat
                                    }
                                }
                            }
                        }
                        catch(Exception ex)
                        {}
                    }
                }


                // brisime od lista konecno


                String totString = "";
                for (String loga: oviegiima)
                {
                    if (!loga.equals(""))
                    {
                        try
                        {
                            totString += loga +"-";
                           *//* Lineitem limax = Lineitem.find.byId(Long.parseLong(loga));
                            if (limax!=null)
                                limax.delete();*//*
                        }
                        catch(Exception ex){}
                    }
                }

                // brisime i assign i task

                // ako e labor treba da se brise odma taskot i assignmentot - direktno od selektiraniot lineitem (ne da se baraat alocirani drugi bugdet lineitemi  -zosto za labor nema takvi - ne zapisuvame



                deletealreadyassignedtaskandassigns(totString);  // (lineitemsselected);

                // ova e dodadeno samo za labor da se vidi
               if (totString =="")
               {
                    if (!lineitemsselected.equals(""))
                    {
                        String[] litemslablor = lineitemsselected.split("-");
                        for (String loga: litemslablor)
                        {
                            if (!loga.equals(""))
                            {
                                try
                                {
                                    Lineitem limax = Lineitem.find.byId(Long.parseLong(loga));
                                    if (limax!=null && limax.itemType.id == 1l )
                                        totString+= limax.id;
                                }
                                catch(Exception ex){}
                            }
                        }
                        deletelaborassignstaskandlineitems(totString);
                         // gi briseme tasks i assigns od normalniot lineitem sto e labor
                    }
               }

                for (String loga: oviegiima)
                {
                    if (!loga.equals(""))
                    {
                        try
                        {
                          //  totString += loga +"-";
                            Lineitem limax = Lineitem.find.byId(Long.parseLong(loga));
                            if (limax!=null)
                                limax.delete();
                        }
                        catch(Exception ex){}
                    }

                }
                }
                else
                {
                    // TREBA DA SE IZBRISAT TASKOVITE STO SE NA SELEKTIRANITE LINEITEMI - IMAME ID NA LINEITEMI I BRISI IM GI TASK_ID = NULL I SAMITE TASKOVI
                    deleteassignstaskandsetplanlineitems(lineitemsselected);
                }


            }*/
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result CheckDailyTasks() {
        if (Secured.hasGuestAccess()) {
            String date = request().getQueryString("date");
            String jobid = request().getQueryString("jobid");

            List<Task> tasks = new ArrayList<Task>();

            date += " 00:00:00";
            tasks = Task.find.where().eq("job_id", jobid).eq("date", date).findList();

                return ok(toJson(tasks));

        } else {
            return forbidden();
        }
    }

    public static Result updateNewLineitemNeww(Long id) {
        if (Secured.hasManagerAccess()) {
            Lineitem lineitem = Lineitem.find.byId(id);
            String po = form().bindFromRequest().get("po");
            if (po!=null&&!po.equals("null")) {
                if (po.equals("")&&lineitem.qb_refnumber!=null) {
                    lineitem.qb_refnumber = null;
                    lineitem.qb_txnid = null;
                    lineitem.qb_editsequence = null;
                    lineitem.qb_txnlineid = "-1";
                    lineitem.update();
                } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                    if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                        if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                        }

                        if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                            lineitem.qb_refnumber = po;
                            lineitem.update();
                        }
                    }

                    if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                    {
                        if (!po.equals("...")) {
                            lineitem.qb_refnumber = "...";
                            lineitem.update();
                        }

                        Queue queue = new Queue();
                        queue.username = quickbooks.User.find.byId("qbffi");
                        if (lineitem.itemType.name.equals("labor")) {
                            queue.action = "TimeTrackingAdd";
                        } else {
                            queue.action = "PurchaseOrderMod";
                        }
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

            // zemi prvo jobid of actualline-ot
            List<Assigns> ssa = null;
            Lineitem lim =  Lineitem.update(
                    User.find.byId(Long.parseLong(request().username())),
                    id,
                    form().bindFromRequest().data()
            );

            ssa = Assigns.find.where().eq("jobid" , lim.job.id).findList();

            return ok(views.html.actuals.lineitem_new.render(
                    User.find.byId(Long.parseLong(request().username())),
                    lim,
                    ssa,
                    User.find.all()
            ));
        } else {
            return forbidden();
        }
    }


    public static Result EditNoteLineitem(Long id) {
        if (Secured.hasManagerAccess()) {
            Lineitem lineitem = Lineitem.find.byId(id);
            String note = form().bindFromRequest().get("note");
            if (lineitem!=null && !note.equals("null")) {
                lineitem.notes = note;
                lineitem.update();
            }
            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result GetNoteLineitem(Long id) {
        if (Secured.hasManagerAccess()) {
            Lineitem lineitem = Lineitem.find.byId(id);
            String note = "";
            if (lineitem!=null && lineitem.notes!= null && !lineitem.notes.equals(""))
                note = lineitem.notes;
            return ok(toJson(note));
        } else {
            return forbidden();
        }
    }


    public static Result updateLineitem(Long id) {
        if (Secured.hasManagerAccess()) {
            Lineitem lineitem = Lineitem.find.byId(id);
            String po = form().bindFromRequest().get("po");
            if (po!=null&&!po.equals("null")) {
                if (po.equals("")&&lineitem.qb_refnumber!=null) {
                    lineitem.qb_refnumber = null;
                    lineitem.qb_txnid = null;
                    lineitem.qb_editsequence = null;
                    lineitem.qb_txnlineid = "-1";
                    lineitem.update();
                } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                    if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                        if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                        }

                        if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                            lineitem.qb_refnumber = po;
                            lineitem.update();
                        }
                    }

                    if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                    {
                        if (!po.equals("...")) {
                            lineitem.qb_refnumber = "...";
                            lineitem.update();
                        }

                        Queue queue = new Queue();
                        queue.username = quickbooks.User.find.byId("qbffi");
                        if (lineitem.itemType.name.equals("labor")) {
                            queue.action = "TimeTrackingAdd";
                        } else {
                            queue.action = "PurchaseOrderMod";
                        }
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
            return ok(views.html.actuals.lineitem.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Lineitem.update(
                            User.find.byId(Long.parseLong(request().username())),
                            id,
                            form().bindFromRequest().data()
                    )
            ));
        } else {
            return forbidden();
        }
    }


    public static Result updateLineItemforNewJob(String Lineitemids)
    {
        // lineitemite gi stavame vo nov task...
        if (Secured.hasManagerAccess()) {

            String[] lineids = Lineitemids.split("-");

            // String lineid =   form().bindFromRequest().get("lineid");
            String taskid =   form().bindFromRequest().get("taskid");

            for (int i=0; i < lineids.length; i++)
            {
                if (lineids[i] != null && lineids[i] != "")
                {
                    Lineitem newLineitem = Lineitem.find.byId(Long.parseLong(lineids[i]));

                    if (newLineitem != null )
                    {
                        if (taskid != null && taskid != ""){
                            Task newtask = Task.find.byId(Long.parseLong(taskid));
                            if (newtask!= null){
                                newLineitem.task = newtask;
                                newLineitem.update();
                            }
                        }
                    }
                }
            }

        return ok();
    } else {
        return forbidden();
    }
}




    public static Result getLineItemCount()
    {
        // lineitemite gi stavame vo nov task...
        if (Secured.hasManagerAccess()) {
            String taskid =   form().bindFromRequest().get("taskid");
            List<Lineitem> lmbytask = new ArrayList<Lineitem>();
            lmbytask = Lineitem.find.where().eq("task_id", taskid).isNull("task_type_id").findList();
            return ok(toJson(lmbytask.size()));
        } else {
            return forbidden();
        }
    }







    // OVA E AKO SE MENUVA VO PURCHASE IZVESTAJOT DA SE SMENUVAAT DIREKTNO VO BUDGET LINEITEMS - na JOBCARD
    public static Result EditBudgetLineItemfromPO()
    {
        //putlink = lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"
// &quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
        if (Secured.hasManagerAccess()) {
            String lineitemid = form().bindFromRequest().get("lineitemid");
            String vendor = form().bindFromRequest().get("vendor");
            String item = form().bindFromRequest().get("item");

            String quantity = form().bindFromRequest().get("quantity");
            String rate = form().bindFromRequest().get("rate");
            String saleprice = form().bindFromRequest().get("saleprice");
         //   String dateactual = form().bindFromRequest().get("dateactual");

            saleprice = saleprice.replace(",","");

            Lineitem lineitem = Lineitem.find.byId(Long.parseLong(lineitemid));

                // update lineitem
                if (lineitem != null)
                {
                    lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
                    lineitem.item  = Item.find.byId(Long.parseLong(item));
                    lineitem.quantity =  Double.parseDouble(quantity);
                    lineitem.rate = Double.parseDouble(rate);
                    if (!saleprice.equals(""))
                        lineitem.saleprice =  Double.parseDouble(saleprice);



/*
                    if(!dateactual.equals(""))
                    {
                        DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
                        Date dateent = new Date();
                        try {
                            if (dateactual!=null) {
                                dateent = format.parse(dateactual);
                                lineitem.daysdate = dateent;
                            }
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                    }*/

                    lineitem.user =  User.find.byId(Long.parseLong(request().username()));
   //                 lineitem.save();
                    lineitem.update();
                }

            return ok();
        } else {
            return forbidden();
        }
    }







    public static Result AddEditNewLineitem()
    {
    //putlink = lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"
    // &quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
        if (Secured.hasManagerAccess()) {

            String dateentry = form().bindFromRequest().get("date");
            String jobid = form().bindFromRequest().get("jobid");
            String vendor = form().bindFromRequest().get("vendor");
            String item = form().bindFromRequest().get("item");
            String itemtype = form().bindFromRequest().get("itemtype");
            String units = form().bindFromRequest().get("units");
            String quantity = form().bindFromRequest().get("quantity");
            String rate = form().bindFromRequest().get("rate");
            String saleprice = form().bindFromRequest().get("saleprice");

            String tasktype = form().bindFromRequest().get("tasktype");
            String notes = form().bindFromRequest().get("notes");
			String taskidselected  = form().bindFromRequest().get("taskidno");

            String insertactual  = form().bindFromRequest().get("insertactual");

            String lineitemidORG  = form().bindFromRequest().get("lineitemidORG");
            Integer i = 0;
            if (lineitemidORG != null && lineitemidORG !="")
                i = Integer.parseInt(lineitemidORG);        //theLong != null ? theLong.intValue() : null;

            Long taskidto =0l;
            if (insertactual!= null && insertactual.equals("true"))
                taskidto = Long.parseLong(taskidselected);
            else
                taskidto = CheckTaskExist(jobid, dateentry, tasktype, taskidselected);

            if (taskidto == 0l)
            {
                ///jobs/tasksactual?id='+selectedJob+"&taskType=1&date="+$('#labdatepicker').val(),
                // open new
                Date dateent = new Date();
                try {
                    dateent = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S").parse(dateentry);
                }
                catch (ParseException e) {
                    e.printStackTrace();
                }

                dateent = removeTime(dateent);

                // vidi dali e jobot od novite ili od starite
                // ako e od novite stavi "4"
                Task newTask = null;
                Job jobon = Job.find.byId(Long.parseLong(jobid));

                if (Jobs_rd.ChecknewJob(jobon))
                    newTask = Task.addTask(jobid, tasktype,"4", dateent);
                else
                    newTask = Task.addTask(jobid, tasktype,"1", dateent);

                Lineitem lineitem = Lineitem.addLineitem(jobid,
                        "",
                        tasktype,
                        itemtype,
                        newTask.id.toString(),
                        User.find.byId(Long.parseLong(request().username()))
                );


                // update lineitems
                if (lineitem != null)
                {
                    //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                    lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
                    lineitem.item  = Item.find.byId(Long.parseLong(item));
                    lineitem.units = units;
                    lineitem.quantity =  Double.parseDouble(quantity);
                    lineitem.rate = Double.parseDouble(rate);
                    if (!saleprice.equals(""))
                        lineitem.saleprice =  Double.parseDouble(saleprice);
                    lineitem.task = Task.find.byId(newTask.id);
                    if (notes != null && notes != "")
                        lineitem.notes = notes;
                    lineitem.user =  User.find.byId(Long.parseLong(request().username()));
                    lineitem.daysdate = dateent;

                    if (lineitem.itemType.id == 1)
                        lineitem.position = i;

                    lineitem.update();

                    String po = form().bindFromRequest().get("po");
                    if (po!=null&&!po.equals("null")) {
                        if (po.equals("")&&lineitem.qb_refnumber!=null) {
                            lineitem.qb_refnumber = null;
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                            lineitem.update();
                        } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                            if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                                if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                                    lineitem.qb_txnid = null;
                                    lineitem.qb_editsequence = null;
                                    lineitem.qb_txnlineid = "-1";
                                }

                                if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                                    lineitem.qb_refnumber = po;
                                    lineitem.update();
                                }
                            }

                            if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                            {
                                if (!po.equals("...")) {
                                    lineitem.qb_refnumber = "...";
                                    lineitem.update();
                                }

                                Queue queue = new Queue();
                                queue.username = quickbooks.User.find.byId("qbffi");
                                if (lineitem.itemType.name.equals("labor")) {
                                    queue.action = "TimeTrackingAdd";
                                } else {
                                    queue.action = "PurchaseOrderMod";
                                }
                                queue.ident = lineitem.id.toString();
                                queue.extra = "";
                                queue.qbxml = "";
                                queue.priority = 1;
                                queue.status = Character.forDigit(26,36);
                                queue.enqueueDatetime = new Date();
                                queue.save("quickbooks");
                            }
                        }

                    }
                }
            }
            else
            {
                // vidi dali e nov item ili star
                // potrebni se vendorid, itemid, taskid, tasktypeid

                Date dateent = new Date();
                try {
                    dateent = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S").parse(dateentry);
                }
                catch (ParseException e) {
                    e.printStackTrace();
                }
                dateent = removeTime(dateent);

                Long itemidto = CheckItemExist(jobid, vendor, item, taskidto.toString(), tasktype);
                if ( itemidto == 0l)
                {


                    // add new item
                    Lineitem lineitem = Lineitem.addLineitem(jobid,
                            "",
                            tasktype,
                            itemtype,
                            taskidto.toString(),
                            User.find.byId(Long.parseLong(request().username()))
                    );


                    // update lineitems
                    if (lineitem != null)
                    {
                        //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                        if (!vendor.equals(""))
                            lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));

                        if (!item.equals(""))
                            lineitem.item  = Item.find.byId(Long.parseLong(item));

                        lineitem.units = units;
                        lineitem.quantity =  Double.parseDouble(quantity);
                        if (rate.contains(","))
                            rate = rate.replace(",","");
                        lineitem.rate = Double.parseDouble(rate);
                        if (!saleprice.equals(""))
                            lineitem.saleprice =  Double.parseDouble(saleprice);
                        lineitem.task = Task.find.byId(taskidto);
                        if (notes != null && notes != "")
                            lineitem.notes = notes;
                        lineitem.user =  User.find.byId(Long.parseLong(request().username()));
                        lineitem.daysdate = dateent;

                        if (lineitem.itemType.id == 1)
                            lineitem.position = i;

                        lineitem.update();

                        String po = form().bindFromRequest().get("po");
                        if (po!=null&&!po.equals("null")) {
                            if (po.equals("")&&lineitem.qb_refnumber!=null) {
                                lineitem.qb_refnumber = null;
                                lineitem.qb_txnid = null;
                                lineitem.qb_editsequence = null;
                                lineitem.qb_txnlineid = "-1";
                                lineitem.update();
                            } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                                if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                                    if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                                        lineitem.qb_txnid = null;
                                        lineitem.qb_editsequence = null;
                                        lineitem.qb_txnlineid = "-1";
                                    }

                                    if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                                        lineitem.qb_refnumber = po;
                                        lineitem.update();
                                    }
                                }

                                if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                                {
                                    if (!po.equals("...")) {
                                        lineitem.qb_refnumber = "...";
                                        lineitem.update();
                                    }

                                    Queue queue = new Queue();
                                    queue.username = quickbooks.User.find.byId("qbffi");
                                    if (lineitem.itemType.name.equals("labor")) {
                                        queue.action = "TimeTrackingAdd";
                                    } else {
                                        queue.action = "PurchaseOrderMod";
                                    }
                                    queue.ident = lineitem.id.toString();
                                    queue.extra = "";
                                    queue.qbxml = "";
                                    queue.priority = 1;
                                    queue.status = Character.forDigit(26,36);
                                    queue.enqueueDatetime = new Date();
                                    queue.save("quickbooks");
                                }
                            }

                        }
                    }

                }
                else
                {
                    // edit item so itemidto

                    Lineitem lineitem = Lineitem.find.byId(itemidto);
                    // update lineitems
                    if (lineitem != null)
                    {
                        //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                        lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
                        lineitem.item  = Item.find.byId(Long.parseLong(item));
                        lineitem.units = units;
                        lineitem.quantity =  Double.parseDouble(quantity);
                        lineitem.rate = Double.parseDouble(rate);
                        if (!saleprice.equals(""))
                            lineitem.saleprice =  Double.parseDouble(saleprice);
                        lineitem.task = Task.find.byId(taskidto);
                        if (notes != null && notes != "")
                            lineitem.notes = notes;
                        lineitem.user =  User.find.byId(Long.parseLong(request().username()));
                        lineitem.daysdate = dateent;

                        if (lineitem.itemType.id == 1)
                            lineitem.position = i;


                        lineitem.update();

                        String po = form().bindFromRequest().get("po");
                        if (po!=null&&!po.equals("null")) {
                            if (po.equals("")&&lineitem.qb_refnumber!=null) {
                                lineitem.qb_refnumber = null;
                                lineitem.qb_txnid = null;
                                lineitem.qb_editsequence = null;
                                lineitem.qb_txnlineid = "-1";
                                lineitem.update();
                            } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                                if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                                    if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                                        lineitem.qb_txnid = null;
                                        lineitem.qb_editsequence = null;
                                        lineitem.qb_txnlineid = "-1";
                                    }

                                    if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                                        lineitem.qb_refnumber = po;
                                        lineitem.update();
                                    }
                                }

                                if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                                {
                                    if (!po.equals("...")) {
                                        lineitem.qb_refnumber = "...";
                                        lineitem.update();
                                    }

                                    Queue queue = new Queue();
                                    queue.username = quickbooks.User.find.byId("qbffi");
                                    if (lineitem.itemType.name.equals("labor")) {
                                        queue.action = "TimeTrackingAdd";
                                    } else {
                                        queue.action = "PurchaseOrderMod";
                                    }
                                    queue.ident = lineitem.id.toString();
                                    queue.extra = "";
                                    queue.qbxml = "";
                                    queue.priority = 1;
                                    queue.status = Character.forDigit(26,36);
                                    queue.enqueueDatetime = new Date();
                                    queue.save("quickbooks");
                                }
                            }
                        }
                    }
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result AddEditNegativeLineitem()
    {
        if (Secured.hasManagerAccess()) {

            String dateentry = form().bindFromRequest().get("date");
            String jobid = form().bindFromRequest().get("jobid");
            String vendor = form().bindFromRequest().get("vendor");
            String item = form().bindFromRequest().get("item");
            String itemtype = form().bindFromRequest().get("itemtype");
            String units = form().bindFromRequest().get("units");
            String quantity = form().bindFromRequest().get("quantity");
            String rate = form().bindFromRequest().get("rate");
            String saleprice = form().bindFromRequest().get("saleprice");
            String tasktype = form().bindFromRequest().get("tasktype");
            String notes = form().bindFromRequest().get("notes");

			String taskidselected  = form().bindFromRequest().get("taskidno");

            String insertactual  = form().bindFromRequest().get("insertactual");


            String lineitemidORG  = form().bindFromRequest().get("lineitemidORG");
            Integer i = 0;
            if (lineitemidORG != null && lineitemidORG !="")
                i = Integer.parseInt(lineitemidORG);        //theLong != null ? theLong.intValue() : null;


            Long taskidto =0l;

            if (insertactual!= null && insertactual.equals("true"))
                taskidto = Long.parseLong(taskidselected);
            else
                taskidto = CheckTaskExist(jobid, dateentry, tasktype, taskidselected);

           // Long taskidto = CheckTaskExist(jobid, dateentry, tasktype, taskidselected);
            if (taskidto == 0l)
            {
                ///jobs/tasksactual?id='+selectedJob+"&taskType=1&date="+$('#labdatepicker').val(),

                    // open new
                Date dateent = new Date();
                  try {
                    dateent = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S").parse(dateentry);
                }
                catch (ParseException e) {
                    e.printStackTrace();
                }
                dateent = removeTime(dateent);

                Task newTask = Task.addTask(jobid, tasktype,"1", dateent);
                Lineitem lineitem = Lineitem.addLineitem(jobid,
                        "",
                        tasktype,
                        itemtype,
                        newTask.id.toString(),
                        User.find.byId(Long.parseLong(request().username()))
                );


                // update lineitems
                if (lineitem != null)
                {
                    //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                    if (vendor!=null && !vendor.equals(""))
                        lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
                    lineitem.item  = Item.find.byId(Long.parseLong(item));
                    lineitem.units = units;
                    lineitem.quantity +=  Double.parseDouble(quantity);
                    lineitem.rate = Double.parseDouble(rate);
                    lineitem.saleprice +=  Double.parseDouble(saleprice);
                    lineitem.task = Task.find.byId(newTask.id);
                    if (notes != null && notes != "")
                        lineitem.notes = notes;

                    lineitem.user =  User.find.byId(Long.parseLong(request().username()));
                    lineitem.daysdate = dateent;

                    if (lineitem.itemType.id == 1)
                        lineitem.position = i;


                    lineitem.update();

                    String po = form().bindFromRequest().get("po");
                    if (po!=null&&!po.equals("null")) {
                        if (po.equals("")&&lineitem.qb_refnumber!=null) {
                            lineitem.qb_refnumber = null;
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                            lineitem.update();
                        } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                            if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                                if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                                    lineitem.qb_txnid = null;
                                    lineitem.qb_editsequence = null;
                                    lineitem.qb_txnlineid = "-1";
                                }

                                if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                                    lineitem.qb_refnumber = po;
                                    lineitem.update();
                                }
                            }

                            if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                            {
                                if (!po.equals("...")) {
                                    lineitem.qb_refnumber = "...";
                                    lineitem.update();
                                }

                                Queue queue = new Queue();
                                queue.username = quickbooks.User.find.byId("qbffi");
                                if (lineitem.itemType.name.equals("labor")) {
                                    queue.action = "TimeTrackingAdd";
                                } else {
                                    queue.action = "PurchaseOrderMod";
                                }
                                queue.ident = lineitem.id.toString();
                                queue.extra = "";
                                queue.qbxml = "";
                                queue.priority = 1;
                                queue.status = Character.forDigit(26,36);
                                queue.enqueueDatetime = new Date();
                                queue.save("quickbooks");
                            }
                        }

                    }
                }
            }
            else
            {

                Date dateent = new Date();
              //  String datestring = dateentry + " 12:00:00.0";
                try {
                    dateent = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S").parse(dateentry);
                }
                catch (ParseException e) {
                    e.printStackTrace();
                }

                dateent = removeTime(dateent);

                // vidi dali e nov item ili star
                // potrebni se vendorid, itemid, taskid, tasktypeid
                Long itemidto = CheckItemExist(jobid, vendor, item, taskidto.toString(), tasktype);
                if ( itemidto == 0l)
                {
                    // add new item
                    Lineitem lineitem = Lineitem.addLineitem(jobid,
                            "",
                            tasktype,
                            itemtype,
                            taskidto.toString(),
                            User.find.byId(Long.parseLong(request().username()))
                    );


                    // update lineitems
                    if (lineitem != null)
                    {
                        //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                        if (vendor!=null && !vendor.equals(""))
                            lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
                        lineitem.item  = Item.find.byId(Long.parseLong(item));
                        lineitem.units = units;
                        lineitem.quantity +=  Double.parseDouble(quantity);
                        lineitem.rate = Double.parseDouble(rate);
                        lineitem.saleprice +=  Double.parseDouble(saleprice);
                        lineitem.task = Task.find.byId(taskidto);
                        if (notes != null && notes != "")
                            lineitem.notes = notes;
                        lineitem.user =  User.find.byId(Long.parseLong(request().username()));
                        lineitem.daysdate = dateent;

                        if (lineitem.itemType.id == 1)
                            lineitem.position = i;

                        lineitem.update();

                        String po = form().bindFromRequest().get("po");
                        if (po!=null&&!po.equals("null")) {
                            if (po.equals("")&&lineitem.qb_refnumber!=null) {
                                lineitem.qb_refnumber = null;
                                lineitem.qb_txnid = null;
                                lineitem.qb_editsequence = null;
                                lineitem.qb_txnlineid = "-1";
                                lineitem.update();
                            } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                                if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                                    if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                                        lineitem.qb_txnid = null;
                                        lineitem.qb_editsequence = null;
                                        lineitem.qb_txnlineid = "-1";
                                    }

                                    if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                                        lineitem.qb_refnumber = po;
                                        lineitem.update();
                                    }
                                }

                                if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                                {
                                    if (!po.equals("...")) {
                                        lineitem.qb_refnumber = "...";
                                        lineitem.update();
                                    }

                                    Queue queue = new Queue();
                                    queue.username = quickbooks.User.find.byId("qbffi");
                                    if (lineitem.itemType.name.equals("labor")) {
                                        queue.action = "TimeTrackingAdd";
                                    } else {
                                        queue.action = "PurchaseOrderMod";
                                    }
                                    queue.ident = lineitem.id.toString();
                                    queue.extra = "";
                                    queue.qbxml = "";
                                    queue.priority = 1;
                                    queue.status = Character.forDigit(26,36);
                                    queue.enqueueDatetime = new Date();
                                    queue.save("quickbooks");
                                }
                            }

                        }
                    }

                }
                else
                {
                    // edit item so itemidto

                    Lineitem lineitem = Lineitem.find.byId(itemidto);
                    // update lineitems
                    if (lineitem != null)
                    {
                        //   putlink = "/jobs/lineitems/Actual/"+lineitemid+"?vendor="+vendorid+"&item="+itemid+"&units="+units+"&quantity="+quantity+"&rate="+rate+"&saleprice="+saleprice+"&task="+Taskid +"&notes="+notes +"&po="+po;
                        if (vendor!=null && !vendor.equals(""))
                            lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
                        lineitem.item  = Item.find.byId(Long.parseLong(item));
                        lineitem.units = units;
                        lineitem.quantity +=  Double.parseDouble(quantity);
                        lineitem.rate = Double.parseDouble(rate);
                        lineitem.saleprice +=  Double.parseDouble(saleprice);
                        lineitem.task = Task.find.byId(taskidto);
                        if (notes != null && notes != "")
                            lineitem.notes = notes;
                        lineitem.user =  User.find.byId(Long.parseLong(request().username()));
                        lineitem.daysdate = dateent;

                        if (lineitem.itemType.id == 1)
                            lineitem.position = i;


                        lineitem.update();

                        String po = form().bindFromRequest().get("po");
                        if (po!=null&&!po.equals("null")) {
                            if (po.equals("")&&lineitem.qb_refnumber!=null) {
                                lineitem.qb_refnumber = null;
                                lineitem.qb_txnid = null;
                                lineitem.qb_editsequence = null;
                                lineitem.qb_txnlineid = "-1";
                                lineitem.update();
                            } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                                if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                                    if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                                        lineitem.qb_txnid = null;
                                        lineitem.qb_editsequence = null;
                                        lineitem.qb_txnlineid = "-1";
                                    }

                                    if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                                        lineitem.qb_refnumber = po;
                                        lineitem.update();
                                    }
                                }

                                if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                                {
                                    if (!po.equals("...")) {
                                        lineitem.qb_refnumber = "...";
                                        lineitem.update();
                                    }

                                    Queue queue = new Queue();
                                    queue.username = quickbooks.User.find.byId("qbffi");
                                    if (lineitem.itemType.name.equals("labor")) {
                                        queue.action = "TimeTrackingAdd";
                                    } else {
                                        queue.action = "PurchaseOrderMod";
                                    }
                                    queue.ident = lineitem.id.toString();
                                    queue.extra = "";
                                    queue.qbxml = "";
                                    queue.priority = 1;
                                    queue.status = Character.forDigit(26,36);
                                    queue.enqueueDatetime = new Date();
                                    queue.save("quickbooks");
                                }
                            }
                        }
                    }
                }
            }
            return ok();
        } else {
            return forbidden();
        }
    }


    public static Long CheckTaskExist(String jobid, String datetask, String tasktype, String taskidselected)
    {
       Long taskid = 0L;

    //  String ala =   datetask.substring(0,10);
        if (!jobid.equals("") && !datetask.equals("") && !tasktype.equals(""))
        {
            Task t = null;
            try
            {
                t = Task.find.where().eq("job_id", jobid).eq("task_type_id", tasktype).eq("date", datetask.substring(0,10)+" 00:00:00").findUnique();
            }
            catch(Exception ex){
                if (taskidselected != "")
                    taskid = Long.parseLong(taskidselected);
            }
            if (t!= null){
                taskid = t.id;
            }
        }

        return taskid;
    }



    public static Long CheckItemExist(String jobid, String vendor, String item, String taskidto, String tasktype)
    {
        Long itemdi = 0L;

        if (vendor.equals(""))
        {
            if (!jobid.equals("")  && !taskidto.equals("") && !item.equals("") && !tasktype.equals(""))
            {
                Lineitem li = Lineitem.find.where().eq("job_id", jobid).eq("task_type_id", tasktype).eq("item_id",item).eq("task_id",taskidto).findUnique();
                if (li!= null)
                    itemdi = li.id;
            }
        }
        else
        {
            if (!jobid.equals("")  && !vendor.equals("") && !taskidto.equals("") && !item.equals("") && !tasktype.equals(""))
            {
                Lineitem li = Lineitem.find.where().eq("job_id", jobid).eq("task_type_id", tasktype).eq("item_id",item).eq("task_id",taskidto).eq("vendor_id",vendor).findUnique();
                if (li!= null)
                    itemdi = li.id;
            }
        }
        return itemdi;
    }

    public static Result updateNewLineitem(Long id) {
        if (Secured.hasManagerAccess()) {
            Lineitem lineitem = Lineitem.find.byId(id);



            String vendor = form().bindFromRequest().get("vendor");
            String item = form().bindFromRequest().get("item");
            String units = form().bindFromRequest().get("units");
            String quantity = form().bindFromRequest().get("quantity");
            String rate = form().bindFromRequest().get("rate");
            String saleprice = form().bindFromRequest().get("saleprice");
            String task = form().bindFromRequest().get("task");
            String notes = form().bindFromRequest().get("notes");

            lineitem.vendor =  Vendor.find.byId(Long.parseLong(vendor));
            lineitem.item  = Item.find.byId(Long.parseLong(item));
            lineitem.units = units;
            lineitem.quantity =  Double.parseDouble(quantity);
            lineitem.rate = Double.parseDouble(rate);
            lineitem.saleprice =  Double.parseDouble(saleprice);
            lineitem.task = Task.find.byId(Long.parseLong(task));
            lineitem.notes = notes;
            lineitem.update();

            String po = form().bindFromRequest().get("po");
            if (po!=null&&!po.equals("null")) {
                if (po.equals("")&&lineitem.qb_refnumber!=null) {
                    lineitem.qb_refnumber = null;
                    lineitem.qb_txnid = null;
                    lineitem.qb_editsequence = null;
                    lineitem.qb_txnlineid = "-1";
                    lineitem.update();
                } else if (!po.equals("") && lineitem.vendor!=null&&lineitem.item!=null) {
                    if (lineitem.qb_refnumber==null||!lineitem.qb_refnumber.equals(po)) {
                        if (!po.equals("...") && lineitem.itemType!=null && !lineitem.itemType.name.equals("labor")) {
                            lineitem.qb_txnid = null;
                            lineitem.qb_editsequence = null;
                            lineitem.qb_txnlineid = "-1";
                        }

                        if (po.equals("...") || (lineitem.itemType!=null && !lineitem.itemType.name.equals("labor"))) {
                            lineitem.qb_refnumber = po;
                            lineitem.update();
                        }
                    }

                    if (po.equals("...")||(lineitem.qb_txnid!=null&&lineitem.qb_editsequence!=null&&lineitem.qb_txnlineid!="-1"))
                    {
                        if (!po.equals("...")) {
                            lineitem.qb_refnumber = "...";
                            lineitem.update();
                        }

                        Queue queue = new Queue();
                        queue.username = quickbooks.User.find.byId("qbffi");
                        if (lineitem.itemType.name.equals("labor")) {
                            queue.action = "TimeTrackingAdd";
                        } else {
                            queue.action = "PurchaseOrderMod";
                        }
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
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result getVendorSelect() {
        if (Secured.hasGuestAccess()) {
            List<VendorItem> vendorItems;
            if (form().bindFromRequest().data().containsKey("itemType")
                    && !form().bindFromRequest().get("itemType").equals("")
                    && !form().bindFromRequest().get("itemType").equals("0")) {
                vendorItems = VendorItem.find.fetch("item").where().eq("item.itemType.id",Long.parseLong(form().bindFromRequest().get("itemType"))).isNotNull("vendor").eq("vendor.active", 1).findList();
            } else {
                vendorItems = VendorItem.find.where().isNotNull("vendor").eq("vendor.active", 1).findList();
            }
            Long market = null;
            if (form().bindFromRequest().data().containsKey("market")
                    && !form().bindFromRequest().get("market").equals("")) {
                market = Long.parseLong(form().bindFromRequest().get("market"));
            }
            return ok(views.html.budgets.vendors.render(vendorItems,market));
        } else {
            return forbidden();
        }
    }




    public static Result getItemSelect() {
        if (Secured.hasGuestAccess()) {
            List<VendorItem> vendorItems = new ArrayList<VendorItem>();
            if (form().bindFromRequest().data().containsKey("id")
                    && !form().bindFromRequest().get("id").equals("")
                    && !form().bindFromRequest().get("id").equals("0")) {
                Vendor vendor = Vendor.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
                for (VendorItem vi: vendor.vendorItems)
                {
                    if (vi.item!=null)
                    if (vi.item.active == 1)
                        vendorItems.add(vi);
                }

            } else {
                List<VendorItem> vendorItemsTemp = VendorItem.find.where().isNull("vendor").findList();
    //            vendorItems = VendorItem.find.all();
                for (VendorItem vi: vendorItemsTemp)
                {
                    if (vi.item!=null)
                    if (vi.item.active == 1)
                        vendorItems.add(vi);
                }
            }
            Long itemType = null;
            if (form().bindFromRequest().data().containsKey("itemType")
                && !form().bindFromRequest().get("itemType").equals("")) {
                itemType = Long.parseLong(form().bindFromRequest().get("itemType"));
            }
            return ok(views.html.budgets.items.render(vendorItems,itemType));
        } else {
            return forbidden();
        }
    }

    public static Result deleteLineitemNewJob(Long lineitem) {
        if (Secured.hasManagerAccess()) {
            Lineitem lmd = Lineitem.find.ref(lineitem);
                try{
                    if (lmd!=null)
                    {
                        List<Lineitem> litems;
                        int count_actuals = 0;
                        if (lmd.task!= null && lmd.task.id!= null)
                        {
                            if (lmd.itemType.id.equals(1L))
                            {
                                litems = Lineitem.find.where().eq("job.id",lmd.job.id).eq("task_id",lmd.task.id).eq("position", lmd.id).isNotNull("taskType").findList();
                                // labor - mora da se zbira count na poinakov nacin
                                // actuals staveni po toj osnov imaat position kolona so id-to kako originalniot lineitemid
                            }
                            else
                            {
                                // ne e labor - count na takvi itemi i actuals moze da se najdat samo kako
                                if (lmd.vendor!= null && lmd.vendor.id != null)
                                    // ako postoi vendorid :
                                     litems = Lineitem.find.where().eq("job.id",lmd.job.id).eq("task_id",lmd.task.id).eq("vendor.id",lmd.vendor.id).eq("item.id",lmd.item.id).isNotNull("taskType").findList();
                                else
                                // ako ne postoi vendorid :
                                     litems = Lineitem.find.where().eq("job.id",lmd.job.id).eq("task_id",lmd.task.id).eq("item_type_id",lmd.itemType.id).eq("item.id",lmd.item.id).isNotNull("taskType").findList();
                            }

                            // site litemi vo litems se pamtat ZA BRISENJE

                            // gi naogjame site lineitemi so takov task - so se se - null not null
                            List<Lineitem> lineitemperTask = Lineitem.find.where().eq("job.id",lmd.job.id).eq("task_id",lmd.task.id).findList();
                            // ako count
                            if (lineitemperTask.size() > (litems.size() + 1))
                            {
                                // znaci deka imame poveke lineitemi so toj task
                                // imame i drugi bdugetlineitemit vo toj taks i ne go briseme
                            }
                            else
                            {
                                // znaci deka nemame drugi bdugetlineitemit vo toj taks i treba da se brise
                                // briseme task, briseme assign za toj task

                                Task tsk = Task.find.byId(lmd.task.id);
                                if (tsk != null)
                                    tsk.delete();
                                Assigns ass = Assigns.find.where().eq("jobid", lmd.job.id).eq("taskid", lmd.task.id).findUnique();
                                if (ass!=null)
                                    ass.delete();
                            }

                            // konecno briseme se - site sto se markirani za brisenje
                            String ids = "";
                            for(Lineitem LiDel: litems)
                            {
                                ids += LiDel.id +"-";
                            }
                            if (!ids.equals(""))
                            {
                                String[] liidsstring = null;
                                try{
                                    liidsstring = ids.split("-");
                                }
                                catch(Exception ex)
                                {}
                                for(int j=0; j<liidsstring.length; j++)
                                {
                                    Lineitem lmbris = Lineitem.find.byId(Long.parseLong(liidsstring[j]));
                                    if (lmbris != null)
                                        lmbris.delete();
                                }
                            }
                            // i briseme toj lineitem sto ni treba za brisenje
                            lmd.delete();
                        }
                        // ako nemame taskid sto treba da se napravi
                        // brisi samo toj lmd
                        lmd.delete();
                    }
                }
                catch(Exception ex)
                {
                }
            return ok();
        } else {
            return forbidden();
        }


    }


    public static Result deleteLineitem(Long lineitem) {
        if (Secured.hasManagerAccess()) {
            Lineitem.find.ref(lineitem).delete();
            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result addToQuickbooks() {
        if (Secured.hasManagerAccess()) {
            String id = form().bindFromRequest().get("id");
            String type = form().bindFromRequest().get("type");
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            if (type.equals("customer")||type.equals("subdivision")||type.equals("job")) {
                queue.action = "CustomerAdd";
            } else if (type.equals("item")||type.equals("vendor_item")) {
                queue.action = "ItemServiceAdd";
            } else if (type.equals("vendor")) {
                Vendor vendor = Vendor.find.byId(Long.parseLong(id));
                Item item = Item.find.where().eq("name","Hourly Per Man").findUnique();
                List<VendorItem> vendorItems = VendorItem.find.where().eq("vendor",vendor).eq("item",item).findList();
                if (!vendorItems.isEmpty()) {
                    type = "employee";
                    queue.action = "EmployeeQuery";
                } else {
                    queue.action = "VendorAdd";
                }
            }
            queue.ident = id;
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





}
