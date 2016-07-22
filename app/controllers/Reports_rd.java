package controllers;

import com.avaje.ebean.*;
import com.avaje.ebean.Expr;

import com.avaje.ebean.Page;
import models.*;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import play.data.Form;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import views.html.main;
import util.pdf.PDF;

import java.beans.Expression;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.text.DecimalFormat;
import static play.data.Form.form;
import static play.libs.Json.toJson;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/13/13
 * Time: 1:11 PM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Reports_rd extends Controller {

     public static Result getItemsReportRedesigned() {
        if (Secured.hasAdministratorAccess()) {
            String marketsId = form().bindFromRequest().get("market");
            String userId = form().bindFromRequest().get("user");
            String itemTypeId = form().bindFromRequest().get("itemType");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            User user;
            if (userId != null && !userId.equals("")) {
                user = User.find.ref(Long.parseLong(userId));
            }
            else {
                user = null;
            }

            ItemType itemType;
            if (itemTypeId != null && !itemTypeId.equals("")) {
                itemType = ItemType.find.byId(Long.parseLong(itemTypeId));
            }
            else {
                itemType = null;
            }

            List<Task> tasks = new ArrayList<Task>();
            List<Task> totaltasks = new ArrayList<Task>();

            if (marketsId != null && !marketsId.equals("")) {
                //  Selection.find().where().in("markets",markets).findList();
                String[] marids = marketsId.split("-");
                if (marids.length >0 )
                {
                    for (int i=0; i< marids.length;i++)
                    {
                        tasks = Task.findWithinDatesForMarket(d1, d2, marids[i]);
                        totaltasks.addAll(tasks);
                    }
                }
                else
                {
                    totaltasks = Task.findWithinDates(d1, d2);
                }
            } else {
                totaltasks = Task.findWithinDates(d1, d2);
            }


       /*     List<Task> tasks = new ArrayList<Task>();
            if (marketId != null && !marketId.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1, d2, marketId);
            } else {
                tasks = Task.findWithinDates(d1, d2);
            }*/

            List<Task> totaltasksTEMP = new ArrayList<Task>();


            // za crew leader - select crew leader
            if (user!=null)
            {
                for(Task t: totaltasks)
                {
                    if (t!=null && t.managers!= null && t.managers.size() > 0 && t.managers.get(0).user !=  null &&  t.managers.get(0).user.id.equals(user.id))
                        totaltasksTEMP.add(t);
                }
                totaltasks = totaltasksTEMP;
            }


            return ok(views.html.reports.index_rd_redesigned.render(
                    User.find.byId(Long.parseLong(request().username())),
                    totaltasks,
                    itemType,
                    user
            ));
        } else {
            return forbidden();
        }
    }



    public static List<Lineitem> GetLineitemsonlyontaskdatesActivity( String market, String manager, String customer, String d1, String d2, String itemCategory, String vendor)
    {
        List<Lineitem> lineitems = new ArrayList<Lineitem>();
        List<Job> jsTmP = new ArrayList<Job>();

        String sqlstr = "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";
        sqlstr += "SELECT `id` FROM job WHERE 1 =1  ";

        // za market - JOB
        if (market != null && !market.equals(""))
            sqlstr += " and market_id = " + market + " ";

        // za manager vo assigns - - JOB
        if (manager != null && !manager.equals("")) //
            sqlstr += " and id in (select distinct(jobid) from assigns where fieldmanagerid = " + manager + ")";

        // po custoemr - JOB
        if (customer != null && !customer.equals(""))
            sqlstr += " and subdivision_id in (select id from subdivision where customer_id = " + customer + ")";

        String finalstring = "";

        // probaj za - TASKOVI VO LINEITEM
                   /* if (!d1.equals(d2))
                    {*/
        List<Task> tasks = new ArrayList<Task>();
        tasks = Task.findWithinDates(d1, d2);

        List<String> jsTmPs = new ArrayList<String>();
        for (Task t : tasks)
            jsTmPs.add(t.id.toString());


        List<String> strg = new ArrayList(new HashSet(jsTmPs));
        int i = 0;
        for (String t : strg) {
            finalstring += t;
            if (i < strg.size() - 1)
                finalstring += ",";
            i++;
        }

        sqlstr += " ) and task_type_id is null and task_id is not null ";

        if (!finalstring.equals(""))
            sqlstr += " and task_id in (" + finalstring + ") ";
        else
            sqlstr += " and task_id in (0) ";

        List<String> itemcatids = new ArrayList<String>();
        String searchinIN = "";
        if (itemCategory != null && !itemCategory.equals("")) {
            itemcatids = Arrays.asList(itemCategory.split("-"));
            for (int ic = 0; ic < itemcatids.size(); ic++) {
                searchinIN += itemcatids.get(ic);
                if (ic < itemcatids.size() - 1)
                    searchinIN += ",";
            }
        }

        // za itemkategirija  - LINEITEM
        if (searchinIN != null && !searchinIN.equals(""))
            //sqlstr +=" and item_type_id = "+itemCategory+" ";
            sqlstr += " and item_type_id in ( " + searchinIN + " )";


        if (vendor != null && !vendor.equals(""))
            sqlstr += " and vendor_id = " + vendor + " ";

        sqlstr += " order by job_id desc";

        SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

        List<SqlRow> list = sqlQuery.findList();
        for (SqlRow row : list) {
            Lineitem basic = Lineitem.find.byId(row.getLong("id"));
                if(hasNoActuals(basic))
                    lineitems.add(basic);
        }
        return lineitems;
    }

    public static boolean hasNoActuals(Lineitem lm){
        List<Lineitem> litem;
        boolean postojat = true;

        if (lm.itemType.id == 1) // .eq("position", lzs.id).eq("item_type_id", lzs.itemType.id)
            litem = Lineitem.find.where().eq("job.id", lm.job.id).eq("task.id",lm.task.id).eq("position", lm.id).eq("item_type_id", 1).isNotNull("taskType").findList();
        else
            litem = Lineitem.find.where().eq("job.id", lm.job.id).eq("task.id",lm.task.id).eq("item_type_id", lm.itemType.id).eq("item.id", lm.item.id).isNotNull("taskType").findList();
//eq("vendor.id", lm.vendor.id).


        //    if (lm.itemType.id !=1)
      //      litem = Lineitem.find.where().eq("job.id", lm.job.id).eq("task.id",lm.task.id).eq("itemType.id", lm.itemType.id).eq("item.id", lm.item.id).isNotNull("taskType").findList();
       // else
         //   litem = Lineitem.find.where().eq("job.id", lm.job.id).eq("task.id",lm.task.id).eq("itemType.id", lm.itemType.id).eq("item.id", lm.item.id).findList();
        if (litem.size()>0)
            postojat = false;
        return postojat;
    }


    public static List<Lineitem> GetLineitemsonlyontaskdates( String market, String manager, String customer, String d1, String d2, String itemCategory, String vendor)
    {
        List<Lineitem> lineitems = new ArrayList<Lineitem>();
        List<Job> jsTmP = new ArrayList<Job>();

        String sqlstr = "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";


        sqlstr += "SELECT `id` FROM job WHERE 1 =1  ";

        // za market - JOB
        if (market != null && !market.equals(""))
            sqlstr += " and market_id = " + market + " ";

        // za manager vo assigns - - JOB
        if (manager != null && !manager.equals("")) //
            sqlstr += " and id in (select distinct(jobid) from assigns where fieldmanagerid = " + manager + ")";

        // po custoemr - JOB
        if (customer != null && !customer.equals(""))
            sqlstr += " and subdivision_id in (select id from subdivision where customer_id = " + customer + ")";

        String finalstring = "";

        // probaj za - TASKOVI VO LINEITEM
                   /* if (!d1.equals(d2))
                    {*/
        List<Task> tasks = new ArrayList<Task>();
        tasks = Task.findWithinDates(d1, d2);

        List<String> jsTmPs = new ArrayList<String>();
        for (Task t : tasks)
            jsTmPs.add(t.id.toString());


        List<String> strg = new ArrayList(new HashSet(jsTmPs));
        int i = 0;
        for (String t : strg) {
            finalstring += t;
            if (i < strg.size() - 1)
                finalstring += ",";
            i++;
        }


        // }


        sqlstr += " ) and task_type_id is null and task_id is not null ";

        if (!finalstring.equals(""))
            sqlstr += " and task_id in (" + finalstring + ") ";
        else
            sqlstr += " and task_id in (0) ";

        List<String> itemcatids = new ArrayList<String>();
        String searchinIN = "";
        if (itemCategory != null && !itemCategory.equals("")) {
            itemcatids = Arrays.asList(itemCategory.split("-"));
            for (int ic = 0; ic < itemcatids.size(); ic++) {
                searchinIN += itemcatids.get(ic);
                if (ic < itemcatids.size() - 1)
                    searchinIN += ",";
            }
        }

        // za itemkategirija  - LINEITEM
        if (searchinIN != null && !searchinIN.equals(""))
            //sqlstr +=" and item_type_id = "+itemCategory+" ";
            sqlstr += " and item_type_id in ( " + searchinIN + " )";


        if (vendor != null && !vendor.equals(""))
            sqlstr += " and vendor_id = " + vendor + " ";


        sqlstr += " order by job_id desc";


        SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

        List<SqlRow> list = sqlQuery.findList();
        for (SqlRow row : list) {
            lineitems.add(Lineitem.find.byId(row.getLong("id")));
        }
        return lineitems;
    }

    public static List<Lineitem> GetLineitemsFromAlldates( String market, String manager, String customer, String d1, String d2, String itemCategory, String vendor)
    {
        List<Lineitem> lineitems = new ArrayList<Lineitem>();
        List<Job> jsTmP = new ArrayList<Job>();


        String sqlstr =  "SELECT `id` FROM lineitem WHERE job_id in ( ";
        sqlstr +=  "SELECT `id` FROM job WHERE id in ( ";
        sqlstr +=  "select distinct(job_id) from task where 1 = 1 ";



        String finalstring = "";

        List<Task> tasks = new ArrayList<Task>();
        tasks = Task.findWithinDates(d1, d1);

        List<String> jsTmPs = new ArrayList<String>();
        for (Task t : tasks)
            jsTmPs.add(t.id.toString());


        List<String> strg =  new ArrayList(new HashSet(jsTmPs));
        int i = 0;
        for (String t : strg)
        {
            finalstring+= t;
            if (i<strg.size()-1)
                finalstring+=",";
            i++;
        }


        if (!finalstring.equals(""))
            sqlstr +=" and id in ("+finalstring+") ";
        else
            sqlstr +=" and id in (0) ";

        sqlstr +=" )";
        // za market - JOB
        if (market!= null && !market.equals(""))
            sqlstr +=" and market_id = "+market+" ";

        // za manager vo assigns - - JOB
        if (manager!= null && !manager.equals("")) //
            sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";





        sqlstr +=" order by id desc";

        sqlstr +=" )";

        // zemi vo obzir samo lineitem tipovite i vendorite
        List<String> itemcatids = new ArrayList<String>();
        String searchinIN = "";
        if (itemCategory != null && !itemCategory.equals("")) {
            itemcatids = Arrays.asList(itemCategory.split("-"));
            for (int ic = 0; ic < itemcatids.size(); ic++) {
                searchinIN += itemcatids.get(ic);
                if (ic < itemcatids.size() - 1)
                    searchinIN += ",";
            }
        }

        // za itemkategirija  - LINEITEM
        if (searchinIN != null && !searchinIN.equals(""))
            //sqlstr +=" and item_type_id = "+itemCategory+" ";
            sqlstr += " and item_type_id in ( " + searchinIN + " )";


        if (vendor != null && !vendor.equals(""))
            sqlstr += " and vendor_id = " + vendor + " ";



        SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
        List<SqlRow> list = sqlQuery.findList();


        for (SqlRow row : list) {
            Lineitem lmt = Lineitem.find.byId(row.getLong("id"));
            if(lmt!=null && lmt.job !=null && lmt.task!=null && lmt.task.crew!=0)
                lineitems.add(lmt);
        }


        return lineitems;
    }


    public static List<Lineitem> GetNewOrderLineitemsbyAllDates( String market, String manager, String customer, String d1, String d2, String itemCategory, String vendor)
    {
        List<Lineitem> lineitems = new ArrayList<Lineitem>();
        List<Job> jsTmP = new ArrayList<Job>();


      //  String sqlstr =  "SELECT `id` FROM lineitem WHERE job_id in ( ";
        //sqlstr +=  "SELECT `id` FROM job WHERE id in ( ";

        String sqlstr =  "select job_id from task where 1 = 1 ";
        String finalstring = "";

        List<Task> tasks = new ArrayList<Task>();
        tasks = Task.findWithinDates(d1, d1);

        List<String> jsTmPs = new ArrayList<String>();
        for (Task t : tasks)
            jsTmPs.add(t.id.toString());


        List<String> strg =  new ArrayList(new HashSet(jsTmPs));
        int i = 0;
        for (String t : strg)
        {
            finalstring+= t;
            if (i<strg.size()-1)
                finalstring+=",";
            i++;
        }


        if (!finalstring.equals(""))
            sqlstr +=" and id in ("+finalstring+") ";
        else
            sqlstr +=" and id in (0) ";

        sqlstr +=" order by crew, card_order";




        SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
        List<SqlRow> list = sqlQuery.findList();



      //  Expression exp = Job.getExpressionFactory().in("market_id", market);
      //  q.where().not(exp).findList();

        for (SqlRow row : list) {
            Job jo = Job.find.byId(row.getLong("job_id"));
                if (jo.market != null && checkinMarket(jo.market.id, market) && checkinManager(jo.id, manager))
                    jsTmP.add(jo);
        }



        // zemi vo obzir samo lineitem tipovite i vendorite
        List<String> itemcatids = new ArrayList<String>();
        String searchinIN = "";
        if (itemCategory != null && !itemCategory.equals("")) {
            itemcatids = Arrays.asList(itemCategory.split("-"));
            for (int ic = 0; ic < itemcatids.size(); ic++) {
                searchinIN += itemcatids.get(ic);
                if (ic < itemcatids.size() - 1)
                    searchinIN += ",";
            }
        }

        // za itemkategirija  - LINEITEM
        if (searchinIN != null && !searchinIN.equals(""))
            //sqlstr +=" and item_type_id = "+itemCategory+" ";
            sqlstr += " and item_type_id in ( " + searchinIN + " )";


        if (vendor != null && !vendor.equals(""))
            sqlstr += " and vendor_id = " + vendor + " ";



        for (Job jo : jsTmP) {

                //.not(Lineitem.getExpressionFactory().in("item_type_id", searchinIN))
                List<Lineitem> lmlist = new ArrayList<Lineitem>();
                lmlist = Lineitem.find.where().eq("job_id", jo.id).isNotNull("task_id").isNull("task_type_id").findList();
                if (!lmlist.isEmpty())
                    for (Lineitem lmt : lmlist)
                        if (lmt != null && lmt.job != null && lmt.task != null && lmt.task.crew != 0)
                            lineitems.add(lmt);

        }


        return lineitems;
    }

    public static Boolean checkinMarket(Long marketid, String marketite)
    {
        if (marketite.equals("") || marketite.equals("-"))
            return true;
        else
            return  marketite.contains(marketid.toString());
    }
    public static Boolean checkinManager(Long jobid, String manager)
    {
        Boolean imamanager = true;
        if (!manager.equals("")) {
            List<Assigns> assgmng = Assigns.find.where().eq("jobid", jobid).findList();
            if (assgmng.size() == 0)
                imamanager = false;
        }
        return  imamanager;
    }


    public static Result getPurchaseReportRedesigned() {
        if (Secured.hasAdministratorAccess()) {

            //   itemCategory	Date Range	Market	Manager	Vendor	Customer

            String market = form().bindFromRequest().get("market");
            String itemCategory = form().bindFromRequest().get("itemCategory");
            String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String vendor = form().bindFromRequest().get("vendor");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            String viewmode = form().bindFromRequest().get("vendorview");
            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            if (!viewmode.equals("2"))
            {
                lineitems = GetLineitemsonlyontaskdates(market, manager, customer, d1, d2, itemCategory, vendor);
            }
            else
            {
                // ako se baraat site lineitemi a ne samo tie na datumot
               //  lineitems = GetLineitemsFromAlldates(market, manager, customer, d1, d2, itemCategory, vendor);

                 lineitems = GetLineitemsonlyontaskdates(market, manager, customer, d1, d2, itemCategory, vendor);
                //podredeni lineitems samo neznam kako da gi ispisam
                //  lineitems = GetNewOrderLineitemsbyAllDates(market, manager, customer, d1, d2, itemCategory, vendor);
            }


            List<Lineitempos> lineitemspos = new ArrayList<Lineitempos>();
            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
            Map<Long, Integer> inrange = new HashMap<Long, Integer>();
            Map<Long, String> vendorMatrix = new HashMap<Long, String>();

            List<Vendor> allvendors = Vendors_rd.getVendorsByMarketCat(market, itemCategory);
            for(Vendor v : allvendors) {
                vendorMatrix.put(v.id, Gettypesofvendoritems(v.id));
            }
            for (Lineitem li: lineitems ){
                try
                {
                    if (viewmode.equals("2"))
                    {
                        porderedlabor.put(li.id, isAllOrderedLabor(li));
                        inrange.put(li.id, islineitemtaskinrange(li.task, d1, d2));
                    }
                Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", li.id).eq("historyflag",0).findUnique();
                    if (lmp!=null)
                        lineitemspos.add(lmp);
                }
                catch(Exception ex){}
            }

            if (viewmode.equals("1"))
            {
                return ok(views.html.reports.purchase_rd_vend.render(
                    User.find.byId(Long.parseLong(request().username())),
                    lineitems,
                    Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                    Customer.find.all(),
                    lineitemspos
                ));
            }
            else if (viewmode.equals("0"))
            {
                return ok(views.html.reports.purchase_rd_cust.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));
            }
            else
            {
                return ok(views.html.reports.purchase_rd_jobs.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all()
                        lineitemspos,
                        inrange,
                        porderedlabor//,
                       // vendorMatrix
                ));
            }



        } else {
            return forbidden();
        }
    }

    public static Result getPurchaseReportActivityRedesigned() {
        if (Secured.hasAdministratorAccess()) {

            //   itemCategory	Date Range	Market	Manager	Vendor	Customer

            String market = form().bindFromRequest().get("market");
            String itemCategory = form().bindFromRequest().get("itemCategory");
            String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String vendor = form().bindFromRequest().get("vendor");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            String viewmode = form().bindFromRequest().get("vendorview");
            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            if (!viewmode.equals("2"))
            {
                lineitems = GetLineitemsonlyontaskdatesActivity(market, manager, customer, d1, d2, itemCategory, vendor);
            }
            else
            {
                // ako se baraat site lineitemi a ne samo tie na datumot
                //  lineitems = GetLineitemsFromAlldates(market, manager, customer, d1, d2, itemCategory, vendor);

                lineitems = GetLineitemsonlyontaskdatesActivity(market, manager, customer, d1, d2, itemCategory, vendor);
                //podredeni lineitems samo neznam kako da gi ispisam
                //  lineitems = GetNewOrderLineitemsbyAllDates(market, manager, customer, d1, d2, itemCategory, vendor);
            }


            List<Lineitempos> lineitemspos = new ArrayList<Lineitempos>();
            Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
            Map<Long, Integer> inrange = new HashMap<Long, Integer>();
            Map<Long, String> vendorMatrix = new HashMap<Long, String>();

            List<Vendor> allvendors = Vendors_rd.getVendorsByMarketCat(market, itemCategory);
            for(Vendor v : allvendors) {
                vendorMatrix.put(v.id, Gettypesofvendoritems(v.id));
            }
            for (Lineitem li: lineitems ){
                try
                {
                    if (viewmode.equals("2"))
                    {
                        porderedlabor.put(li.id, isAllOrderedLabor(li));
                        inrange.put(li.id, islineitemtaskinrange(li.task, d1, d2));
                    }
                    Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", li.id).eq("historyflag",0).findUnique();
                    if (lmp!=null)
                        lineitemspos.add(lmp);
                }
                catch(Exception ex){}
            }

            if (viewmode.equals("1"))
            {
                return ok(views.html.reports.purchase_rd_vend.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));
            }
            else if (viewmode.equals("0"))
            {
                return ok(views.html.reports.purchase_rd_cust.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));
            }
            else
            {
                return ok(views.html.reports.purchase_rd_jobs.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all()
                        lineitemspos,
                        inrange,
                        porderedlabor//,
                        // vendorMatrix
                ));
            }



        } else {
            return forbidden();
        }
    }




    public static Integer isAllOrderedLabor(Lineitem lip)
    {
        Integer status = 0;
        if (lip!=null && lip.id!=null)
        {
            List<Lineitem> lilconretenlabor = new ArrayList<Lineitem>();
            lilconretenlabor = Lineitem.find.where().eq("job_id", lip.job.id).eq("task_id", lip.task.id).eq("task_type_id", 4).eq("item_type_id", 1).eq("position", lip.id).findList();
            if ( lilconretenlabor.size()!=0)
                status =1;
        }
        // 0 nieden labor po nikoj osnov ne e popolnet, 1 samo nekoj od labor ne e popolnet, 2  site labor po sekoj osnov se popolneti
        return status;
    }

    public static String Gettypesofvendoritems(Long vid)
    {
        String sqlstr = "select distinct(item_type_id) from item where id in(select item_id from vendor_item where vendor_id = " + vid.toString() +")";
        SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

        List<SqlRow> list = sqlQuery.findList();
        String totalString = "";
        for (SqlRow row : list)
        {
            totalString+=row.getString("item_type_id");
        }


        return totalString;
    }

    public static Integer islineitemtaskinrange(Task t, String d1, String d2)
    {
        Integer vnatre = 0;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {

            Date startDate = formatter.parse(d1);
            Date endDate = formatter.parse(d2);
            if (!(t.date.before(startDate) || t.date.after(endDate)))
                vnatre = 1;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return vnatre;
    }



    public static Map getLineItemsdetails( Lineitem l)
    {
        Map<String, Object> mapObject = new HashMap<String, Object>();

                if (l.job!=null)
                {
                        mapObject.put("0","<a href=\"#\" class=\"clicka\">" + l.job.id + "</a>");
                        if (l.job.subdivision!=null && l.job.subdivision.customer !=null && l.job.lot !=null)
                            mapObject.put("1", l.job.subdivision.customer.name + " " + l.job.subdivision.name + " " + l.job.lot);
                        else
                            mapObject.put("1", "NA");
                }
                else
                {
                    mapObject.put("0", "NA");
                    mapObject.put("1", "NA");
                }
        //    DecimalFormat df = new DecimalFormat("###,###,##0.00");
             //   DecimalFormat dft = new DecimalFormat("##0");

                if (l.task !=null && l.task.date!=null)
                {
                    SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yyyy");
                    String formattedDate = sdf.format(l.task.date);
                    mapObject.put("2", formattedDate);
                }
                else
                    mapObject.put("2", "NA");

                if (l.task !=null)
                    mapObject.put("3", l.task.crew);
                else
                    mapObject.put("3", "NA");

                if (l.item !=null && !l.item.name.equals(""))
                    mapObject.put("4", l.item.name);
                else
                    mapObject.put("4", "NA");

                if (l.quantity !=null && !l.quantity.equals(""))
                    mapObject.put("5", l.quantity);
                else
                    mapObject.put("5", "NA");

                if (l.rate !=null && !l.rate.equals(""))
                    mapObject.put("6", l.rate);
                else
                    mapObject.put("6", "NA");

                  DecimalFormat df = new DecimalFormat("###,###,##0.00");

                if (l.saleprice !=null && !l.saleprice.equals(""))
                    mapObject.put("7",  df.format(l.saleprice) );
                else
                    mapObject.put("7", "NA");

                if (l.task!= null && !l.task.notes.equals(""))
                    mapObject.put("8", l.task.notes);
                else
                    mapObject.put("8", "NA");


                // from
                if (l!= null && l.task!=null)
                {

                    // List<Job> jsTmP = new ArrayList<Job>();
                    List<Lineitempos> lpmset = Lineitempos.find.where().eq("lineitemid", l.id).eq("taskid", l.task.id).findList();
                    if (lpmset.size() > 0)
                    {
                        Lineitempos lpm = lpmset.get(0);
                            if (lpm!= null && !lpm.fromwhere.equals(""))
                                {
                                   if (lpm.fromwhere == 1l)
                                            mapObject.put("9", "From the yard");
                                    else if (lpm.fromwhere == 2l)
                                        mapObject.put("9", "Drop shipped");
                                    else if (lpm.fromwhere == 3l)
                                        mapObject.put("9", "Builder material");
                                    else if (lpm.fromwhere == 4l)
                                        mapObject.put("9", "Check notes");
                                    else
                                       mapObject.put("9", "NA");
                                }
                            else
                                mapObject.put("9", "NA");
                    }
                    else
                        mapObject.put("9", "NA");
                }
                else
                    mapObject.put("9", "NA");

                if (l.verify!= null && !l.verify.equals(""))
                    mapObject.put("10", l.verify);
                else
                    mapObject.put("10", "NA");

        return mapObject;
    }





    public static Result calendarjobcrewfront() {
        if (Secured.hasGuestAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");


            return ok(views.html.print.main_calendar_rd_jobcrew.render(
                    User.find.byId(Long.parseLong(request().username()))
            ));
        } else {
            return forbidden();
        }
    }



    public static Result printCalendarJobCrew() {


        if (Secured.hasAdministratorAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");



            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);



            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            List<Job> jsTmP = new ArrayList<Job>();


            String sqlstr =  "SELECT `id` FROM job WHERE id in ( ";
            sqlstr +=  "select distinct(job_id) from task where 1 = 1 ";



            String finalstring = "";

            // probaj za - TASKOVI VO LINEITEM
         /*   if (!d1.equals(d2))
            {*/
            List<Task> tasks = new ArrayList<Task>();
            tasks = Task.findWithinDates(d1, d1);

            List<String> jsTmPs = new ArrayList<String>();
            for (Task t : tasks)
                jsTmPs.add(t.id.toString());


            List<String> strg =  new ArrayList(new HashSet(jsTmPs));
            int i = 0;
            for (String t : strg)
            {
                finalstring+= t;
                if (i<strg.size()-1)
                    finalstring+=",";
                i++;
            }


            if (!finalstring.equals(""))
                sqlstr +=" and id in ("+finalstring+") ";
            else
                sqlstr +=" and id in (0) ";

            sqlstr +=" )";
            // za market - JOB
            if (market!= null && !market.equals(""))
                sqlstr +=" and market_id = "+market+" ";

            // za manager vo assigns - - JOB
            if (manager!= null && !manager.equals("")) //
                sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

            sqlstr +=" order by id desc";



            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();
            List<Job> jobscaldate = new ArrayList<Job>();

            for (SqlRow row : list)
                jobscaldate.add(Job.find.byId(row.getLong("id")));


            List<Map> listjobs = new ArrayList<Map>();
            for (Job j : jobscaldate)
            {
                if (j != null && j.id !=null)
                {
                   // List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").findList();
                    List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).findList();
                        for(Lineitem l : lmact)
                        {
                            listjobs.add(getLineItemsdetails(l));
                        }
                }
            }

            if (listjobs!= null)
            {
                Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listjobs);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }
        }
        else {
            return forbidden();
        }



    }


    public static Result printPDFCalendarJobCrew() {


        if (Secured.hasAdministratorAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String manager = request().getQueryString("manager");



            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);



            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            String sqlstr =  "SELECT `id` FROM lineitem WHERE job_id in ( ";


             sqlstr +=  "SELECT `id` FROM job WHERE id in ( ";
            sqlstr +=  "select distinct(job_id) from task where 1 = 1 ";



            String finalstring = "";

            // probaj za - TASKOVI VO LINEITEM
         /*   if (!d1.equals(d2))
            {*/
            List<Task> tasks = new ArrayList<Task>();
            tasks = Task.findWithinDates(d1, d1);

            List<String> jsTmPs = new ArrayList<String>();
            for (Task t : tasks)
                jsTmPs.add(t.id.toString());


            List<String> strg =  new ArrayList(new HashSet(jsTmPs));
            int i = 0;
            for (String t : strg)
            {
                finalstring+= t;
                if (i<strg.size()-1)
                    finalstring+=",";
                i++;
            }


            if (!finalstring.equals(""))
                sqlstr +=" and id in ("+finalstring+") ";
            else
                sqlstr +=" and id in (0) ";

            sqlstr +=" )";
            // za market - JOB
            if (market!= null && !market.equals(""))
                sqlstr +=" and market_id = "+market+" ";

            // za manager vo assigns - - JOB
            if (manager!= null && !manager.equals("")) //
                sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

            sqlstr +=" order by id desc";


            sqlstr +=") and task_id is not null and task_type_id is null";



            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();
            List<Lineitem> lineitemcaldate = new ArrayList<Lineitem>();

            for (SqlRow row : list)
                lineitemcaldate.add(Lineitem.find.byId(row.getLong("id")));


            // za fromwhere i verified kolonite
            List<Lineitempos> lineitemspos = new ArrayList<Lineitempos>();
            for (Lineitem li: lineitemcaldate ){
                try
                {
                    Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", li.id).eq("historyflag",0).findUnique();
                    if (lmp!=null)
                        lineitemspos.add(lmp);
                }
                catch(Exception ex){}
            }


            if (lineitemcaldate!= null)
            {
                return PDF.ok(views.html.print.purchase_rd_calendar_perjob.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitemcaldate,
                        Vendor.find.all(), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));
               /* return PDF.ok(views.html.print.purchase_rd_perjob.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitemcaldate,
                        Vendor.find.all(), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));*/
            }
            else {
                return ok();
            }
        }
        else {
            return forbidden();
        }



    }

    public static Result printTotal() {
        if (Secured.hasAdministratorAccess()) {

            //   itemCategory	Date Range	Market	Manager	Vendor	Customer

            String market = form().bindFromRequest().get("market");
            String itemCategory = form().bindFromRequest().get("itemCategory");
            String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String vendor = form().bindFromRequest().get("vendor");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            String viewmode = form().bindFromRequest().get("vendorview");
            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            List<Job> jsTmP = new ArrayList<Job>();

            String sqlstr =  "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";


            sqlstr +=  "SELECT `id` FROM job WHERE 1 =1  ";

            // za market - JOB
            if (market!= null && !market.equals(""))
                sqlstr +=" and market_id = "+market+" ";

            // za manager vo assigns - - JOB
            if (manager!= null && !manager.equals("")) //
                sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

            // po custoemr - JOB
            if (customer!= null && !customer.equals(""))
                sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";

            String finalstring = "";

            // probaj za - TASKOVI VO LINEITEM
           /* if (!d1.equals(d2))
            {*/
                List<Task> tasks = new ArrayList<Task>();
                tasks = Task.findWithinDates(d1, d2);

                List<String> jsTmPs = new ArrayList<String>();
                for (Task t : tasks)
                    jsTmPs.add(t.id.toString());


                List<String> strg =  new ArrayList(new HashSet(jsTmPs));
                int i = 0;
                for (String t : strg)
                {
                    finalstring+= t;
                    if (i<strg.size()-1)
                        finalstring+=",";
                    i++;
                }

            //}


            sqlstr += " ) and task_type_id is null and task_id is not null ";

            if (!finalstring.equals(""))
                sqlstr +=" and task_id in ("+finalstring+") ";
            else
                sqlstr +=" and task_id in (0) ";

            String searchinIN = " ";
            String[] itemcatids = itemCategory.split("-");
            if (itemcatids.length >0 )
            {
                int counter = 0;
                for(String s : itemcatids)
                {
                    if (counter == 0)
                        searchinIN+= s;
                    else
                        searchinIN+=", " + s;

                    counter++;
                }
            }

            // za itemkategirija  - LINEITEM
            if (itemCategory!= null && !itemCategory.equals(""))
                //sqlstr +=" and item_type_id = "+itemCategory+" ";
                sqlstr +=" and item_type_id in ( "+searchinIN+" )";


            if (vendor!= null && !vendor.equals(""))
                sqlstr +=" and vendor_id = "+vendor+" ";



            sqlstr +=" order by job_id desc";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

            List<SqlRow> list = sqlQuery.findList();
            for (SqlRow row : list)
            {
                lineitems.add(Lineitem.find.byId(row.getLong("id")));
            }



            List<Lineitempos> lineitemspos = new ArrayList<Lineitempos>();
            for (Lineitem li: lineitems ){
                try
                {
                    Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", li.id).eq("historyflag",0).findUnique();
                    if (lmp!=null)
                        lineitemspos.add(lmp);
                }
                catch(Exception ex){}
            }

            if (viewmode.equals("1"))
            {
                return PDF.ok(views.html.print.purchase_rd_pvend.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));
            }
            else
            {
                return PDF.ok(views.html.print.purchase_rd_pcust.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));
            }



        } else {
            return forbidden();
        }
    }


    public static Result printTotalsMerge() {
        if (Secured.hasAdministratorAccess()) {

            //   itemCategory	Date Range	Market	Manager	Vendor	Customer

            String market = form().bindFromRequest().get("market");
            String itemCategory = form().bindFromRequest().get("itemCategory");
            String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String vendor = form().bindFromRequest().get("vendor");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            String viewmode = form().bindFromRequest().get("vendorview");
            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            List<Job> jsTmP = new ArrayList<Job>();

            String sqlstr =  "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";


            sqlstr +=  "SELECT `id` FROM job WHERE 1 =1  ";

            // za market - JOB
            if (market!= null && !market.equals(""))
                sqlstr +=" and market_id = "+market+" ";

            // za manager vo assigns - - JOB
            if (manager!= null && !manager.equals("")) //
                sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

            // po custoemr - JOB
            if (customer!= null && !customer.equals(""))
                sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";

            String finalstring = "";

            // probaj za - TASKOVI VO LINEITEM
           /* if (!d1.equals(d2))
            {*/
            List<Task> tasks = new ArrayList<Task>();
            tasks = Task.findWithinDates(d1, d2);

            List<String> jsTmPs = new ArrayList<String>();
            for (Task t : tasks)
                jsTmPs.add(t.id.toString());


            List<String> strg =  new ArrayList(new HashSet(jsTmPs));
            int i = 0;
            for (String t : strg)
            {
                finalstring+= t;
                if (i<strg.size()-1)
                    finalstring+=",";
                i++;
            }

            //}


            sqlstr += " ) and task_type_id is null and task_id is not null ";

            if (!finalstring.equals(""))
                sqlstr +=" and task_id in ("+finalstring+") ";
            else
                sqlstr +=" and task_id in (0) ";

            String searchinIN = " ";
            String[] itemcatids = itemCategory.split("-");
            if (itemcatids.length >0 )
            {
                int counter = 0;
                for(String s : itemcatids)
                {
                    if (counter == 0)
                        searchinIN+= s;
                    else
                        searchinIN+=", " + s;

                    counter++;
                }
            }

            // za itemkategirija  - LINEITEM
            if (itemCategory!= null && !itemCategory.equals(""))
                //sqlstr +=" and item_type_id = "+itemCategory+" ";
                sqlstr +=" and item_type_id in ( "+searchinIN+" )";


            if (vendor!= null && !vendor.equals(""))
                sqlstr +=" and vendor_id = "+vendor+" ";



            sqlstr +=" order by job_id desc";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

            List<SqlRow> list = sqlQuery.findList();
            for (SqlRow row : list)
            {
                lineitems.add(Lineitem.find.byId(row.getLong("id")));
            }


            List<LineitemTotals> listitemsmarketvendortotal = new ArrayList<LineitemTotals>();

            for (Lineitem lit: lineitems ){
                try
                {
                    listitemsmarketvendortotal =  checkExistandAdd(listitemsmarketvendortotal, getOveralperLineitem(lit));
                    // listitemsmarketvendortotal.add(getOveralperLineitem(lit));
                }
                catch(Exception ex){}
            }





            return PDF.ok(views.html.print.purchase_total_pvend.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                    listitemsmarketvendortotal
            ));


        } else {
            return forbidden();
        }
    }




    public static Result printCalendarCrewJobNew() {
        if (Secured.hasAdministratorAccess()) {


            String market = form().bindFromRequest().get("market");
            String itemCategory = form().bindFromRequest().get("itemCategory");
            String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String vendor = form().bindFromRequest().get("vendor");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            String viewmode = form().bindFromRequest().get("vendorview");
            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();




            lineitems = GetLineitemsonlyontaskdates(market, manager, customer, d1, d2, itemCategory, vendor);
            //podredeni lineitems samo neznam kako da gi ispisam
            //  lineitems = GetNewOrderLineitemsbyAllDates(market, manager, customer, d1, d2, itemCategory, vendor);}


        List<Lineitempos> lineitemspos = new ArrayList<Lineitempos>();
        Map<Long, Integer> porderedlabor = new HashMap<Long, Integer>();
        Map<Long, Integer> inrange = new HashMap<Long, Integer>();
        Map<Long, String> vendorMatrix = new HashMap<Long, String>();

        List<Vendor> allvendors = Vendors_rd.getVendorsByMarketCat(market, itemCategory);
        for(Vendor v : allvendors) {
            vendorMatrix.put(v.id, Gettypesofvendoritems(v.id));
        }
        for (Lineitem li: lineitems ){
            try
            {
                if (viewmode.equals("2"))
                {
                    porderedlabor.put(li.id, isAllOrderedLabor(li));
                    inrange.put(li.id, islineitemtaskinrange(li.task, d1, d2));
                }
                Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", li.id).eq("historyflag",0).findUnique();
                if (lmp!=null)
                    lineitemspos.add(lmp);
            }
            catch(Exception ex){}
        }




            return PDF.ok(views.html.print.purchase_rd_jobs.render(
                    User.find.byId(Long.parseLong(request().username())),
                    lineitems,
                    Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all()
                    lineitemspos,
                    inrange,
                    porderedlabor//,
            ));


        } else {
            return forbidden();
        }
    }


    public static Result printTotalsMergeOrder() {
        if (Secured.hasAdministratorAccess()) {

            //   itemCategory	Date Range	Market	Manager	Vendor	Customer

            String market = form().bindFromRequest().get("market");
            String itemCategory = form().bindFromRequest().get("itemCategory");
            String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String vendor = form().bindFromRequest().get("vendor");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            String viewmode = form().bindFromRequest().get("vendorview");
            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Lineitem> lineitems = new ArrayList<Lineitem>();


            List<Job> jsTmP = new ArrayList<Job>();

            String sqlstr =  "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";


            sqlstr +=  "SELECT `id` FROM job WHERE 1 =1  ";

            // za market - JOB
            if (market!= null && !market.equals(""))
                sqlstr +=" and market_id = "+market+" ";

            // za manager vo assigns - - JOB
            if (manager!= null && !manager.equals("")) //
                sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

            // po custoemr - JOB
            if (customer!= null && !customer.equals(""))
                sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";

            String finalstring = "";

            // probaj za - TASKOVI VO LINEITEM
           /* if (!d1.equals(d2))
            {*/
            List<Task> tasks = new ArrayList<Task>();
            tasks = Task.findWithinDates(d1, d2);

            List<String> jsTmPs = new ArrayList<String>();
            for (Task t : tasks)
                jsTmPs.add(t.id.toString());


            List<String> strg =  new ArrayList(new HashSet(jsTmPs));
            int i = 0;
            for (String t : strg)
            {
                finalstring+= t;
                if (i<strg.size()-1)
                    finalstring+=",";
                i++;
            }

            //}


            sqlstr += " ) and task_type_id is null and task_id is not null ";

            if (!finalstring.equals(""))
                sqlstr +=" and task_id in ("+finalstring+") ";
            else
                sqlstr +=" and task_id in (0) ";

            String searchinIN = " ";
            String[] itemcatids = itemCategory.split("-");
            if (itemcatids.length >0 )
            {
                int counter = 0;
                for(String s : itemcatids)
                {
                    if (counter == 0)
                        searchinIN+= s;
                    else
                        searchinIN+=", " + s;

                    counter++;
                }
            }

            // za itemkategirija  - LINEITEM
            if (itemCategory!= null && !itemCategory.equals(""))
                //sqlstr +=" and item_type_id = "+itemCategory+" ";
                sqlstr +=" and item_type_id in ( "+searchinIN+" )";


            if (vendor!= null && !vendor.equals(""))
                sqlstr +=" and vendor_id = "+vendor+" ";



            sqlstr +=" order by job_id desc";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

            List<SqlRow> list = sqlQuery.findList();
            for (SqlRow row : list)
            {
                lineitems.add(Lineitem.find.byId(row.getLong("id")));
            }


            List<LineitemTotals> listitemsmarketvendortotal = new ArrayList<LineitemTotals>();

            for (Lineitem lit: lineitems ){
                try
                {
                    listitemsmarketvendortotal =  checkExistandAdd(listitemsmarketvendortotal, getOveralperLineitem(lit));




                    // listitemsmarketvendortotal.add(getOveralperLineitem(lit));
                }
                catch(Exception ex){}
            }

            // tuka imame poedinecni - trebad ad se vrti po sekoj od niv i da se sobira quantity
            List<LineitemTotals> listitmetemp = new ArrayList<LineitemTotals>();
            for (LineitemTotals lotORG: listitemsmarketvendortotal ){
                listitmetemp =  checkExistsameItemandAddSum(listitmetemp, lotORG);
            }


             Collections.sort(listitmetemp, LineitemTotals.FruitNameComparator);

         //   Collections.sort(listitmetemp);
           /* if (listitmetemp.size() > 0)
            Collections.sort(listitmetemp, new Comparator<LineitemTotals>() {
                @Override
                public int compare(final LineitemTotals object1, final LineitemTotals object2) {
                    return object1.crew.compareTo(object2.crew);
                }
            } );*/



            return PDF.ok(views.html.print.purchase_total_order_shcedule.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                    listitmetemp
            ));


        } else {
            return forbidden();
        }
    }



    public static List<LineitemTotals> checkExistsameItemandAddSum(List<LineitemTotals> litots, LineitemTotals lt)
    {
        if (lt.item!=null)
        {
            boolean goima = false;
            for (LineitemTotals lodLista: litots)
            {
                if (lt.item.equals(lodLista.item) &&  lt.crew.equals(lodLista.crew) &&  lt.taskDate.equals(lodLista.taskDate))
                {
                    goima = true;
                    lodLista.quantity += lt.quantity;
                }
            }
            if (!goima)
            {
             //   if(lt.quantity !=0)
                    litots.add((lt));
            }
        }
        return  litots;
    }


    public static List<LineitemTotals> checkExistandAdd(List<LineitemTotals> litots, LineitemTotals lt)
    {
        if (lt.vendor!=null &&  lt.item!=null &&  lt.market!=null && lt.subdivision!=null)
        {
            boolean goima = false;
            for (LineitemTotals lodLista: litots)
            {
                if (lt.vendor.equals(lodLista.vendor) && lt.item.equals(lodLista.item) && lt.market.equals(lodLista.market) && lt.subdivision.equals(lodLista.subdivision))
                {
                    goima = true;
                    lodLista.quantity += lt.quantity;
                    lodLista.saleprice+= lt.saleprice;
                }
            }
            if (!goima)
            {
           //  if(lt.quantity !=0)
                litots.add((lt));
            }
        }
        return  litots;
    }

        public static Result printPerJob() {
            if (Secured.hasAdministratorAccess()) {

                //   itemCategory	Date Range	Market	Manager	Vendor	Customer

                String market = form().bindFromRequest().get("market");


                String itemCategory = form().bindFromRequest().get("itemCategory");
                String manager = form().bindFromRequest().get("manager");
                String customer = form().bindFromRequest().get("customer");
                String vendor = form().bindFromRequest().get("vendor");
                String d1 = form().bindFromRequest().get("startDate");
                String d2 = form().bindFromRequest().get("endDate");

                String viewmode = form().bindFromRequest().get("vendorview");
                // Map<String, Object> listjobs = new HashMap<String, Object>();
                List<Lineitem> lineitems = new ArrayList<Lineitem>();


                List<Job> jsTmP = new ArrayList<Job>();

                String sqlstr =  "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";


                sqlstr +=  "SELECT `id` FROM job WHERE 1 =1  ";

                // za market - JOB
                if (market!= null && !market.equals(""))
                    sqlstr +=" and market_id = "+market+" ";

                // za manager vo assigns - - JOB
                if (manager!= null && !manager.equals("")) //
                    sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

                // po custoemr - JOB
                if (customer!= null && !customer.equals(""))
                    sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";

                String finalstring = "";

                // probaj za - TASKOVI VO LINEITEM
             /*   if (!d1.equals(d2))
                {*/
                    List<Task> tasks = new ArrayList<Task>();
                    tasks = Task.findWithinDates(d1, d2);

                    List<String> jsTmPs = new ArrayList<String>();
                    for (Task t : tasks)
                        jsTmPs.add(t.id.toString());


                    List<String> strg =  new ArrayList(new HashSet(jsTmPs));
                    int i = 0;
                    for (String t : strg)
                    {
                        finalstring+= t;
                        if (i<strg.size()-1)
                            finalstring+=",";
                        i++;
                    }

              //  }


                sqlstr += " ) and task_type_id is null and task_id is not null ";

                if (!finalstring.equals(""))
                    sqlstr +=" and task_id in ("+finalstring+") ";
                else
                    sqlstr +=" and task_id in (0) ";


                String searchinIN = " ";
                String[] itemcatids = itemCategory.split("-");
                if (itemcatids.length >0 )
                {
                    int counter = 0;
                    for(String s : itemcatids)
                    {
                        if (counter == 0)
                            searchinIN+= s;
                        else
                            searchinIN+=", " + s;

                        counter++;
                    }
                }

                // za itemkategirija  - LINEITEM
                if (itemCategory!= null && !itemCategory.equals(""))
                    //sqlstr +=" and item_type_id = "+itemCategory+" ";
                    sqlstr +=" and item_type_id in ( "+searchinIN+" )";


                if (vendor!= null && !vendor.equals(""))
                    sqlstr +=" and vendor_id = "+vendor+" ";



                sqlstr +=" order by job_id desc";


                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

                List<SqlRow> list = sqlQuery.findList();
                for (SqlRow row : list)
                {
                    lineitems.add(Lineitem.find.byId(row.getLong("id")));
                }



                List<Lineitempos> lineitemspos = new ArrayList<Lineitempos>();
                for (Lineitem li: lineitems ){
                    try
                    {
                        Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", li.id).eq("historyflag",0).findUnique();
                        if (lmp!=null)
                            lineitemspos.add(lmp);
                    }
                    catch(Exception ex){}
                }

               // TUKA SMISLI STO SAKAME
                return PDF.ok(views.html.print.purchase_rd_perjob.render(
                        User.find.byId(Long.parseLong(request().username())),
                        lineitems,
                        Vendors_rd.getVendorsByMarketCat(market, itemCategory), // Vendor.find.all(),
                        Customer.find.all(),
                        lineitemspos
                ));



            } else {
                return forbidden();
            }
        }



    public static Result getItemsReport() {
        if (Secured.hasAdministratorAccess()) {
            String marketId = form().bindFromRequest().get("market");
            String userId = form().bindFromRequest().get("user");
            String itemTypeId = form().bindFromRequest().get("itemType");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            User user;
            if (userId != null && !userId.equals("")) {
                user = User.find.ref(Long.parseLong(userId));
            }
            else {
                user = null;
            }

            ItemType itemType;
            if (itemTypeId != null && !itemTypeId.equals("")) {
                itemType = ItemType.find.byId(Long.parseLong(itemTypeId));
            }
            else {
                itemType = null;
            }

            List<Task> tasks = new ArrayList<Task>();
            if (marketId != null && !marketId.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1, d2, marketId);
            } else {
                tasks = Task.findWithinDates(d1, d2);
            }
            return ok(views.html.reports.index_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    tasks,
                    itemType,
                    user
            ));
        } else {
            return forbidden();
        }
    }

    public static Result getWeeklyItems() {
        if (Secured.hasManagerAccess()) {
            String marketId = form().bindFromRequest().get("market");
            String date = form().bindFromRequest().get("date");


            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.add(java.util.Calendar.DATE,1-cal.get(java.util.Calendar.DAY_OF_WEEK));
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            cal.add(java.util.Calendar.DATE,7);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);

            List<Task> tasks = new ArrayList<Task>();
            if (marketId != null && !marketId.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1, d2, marketId);
            } else {
                tasks = Task.findWithinDates(d1, d2);
            }
            return ok(views.html.reports.weeklyItems_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    tasks,
                    d1
            ));
        } else {
            return forbidden();
        }
    }


    public static Result getLaborperiod()
    {
        return ok(
                views.html.reports.laborlistreport.render(
                        User.find.byId(Long.parseLong(request().username())),
                        Market.find.all(),
                        Vendor.find.all()
                )
        );
    }
    public static Result getLaborperiodreport()
    {
        // soberi gi site
        if (Secured.hasAdministratorAccess()) {
            // START
            String vendorid =  form().bindFromRequest().get("vendorid");
            String marketid =  form().bindFromRequest().get("marketid");
            String startdate =  form().bindFromRequest().get("startdate");
            String enddate =  form().bindFromRequest().get("enddate");

            List<Labor> lexp =  new ArrayList<Labor>();

            String sqlstr =    "SELECT `id` FROM labor WHERE 1 =1  ";

            // za market
            if (marketid!= null && !marketid.equals("") && !marketid.equals("0"))
            {
                sqlstr +=" and market_id ="+ marketid +" ";

            }
            if (vendorid!= null && !vendorid.equals(""))
            {
                sqlstr +=" and vendor_id  = "+vendorid+" ";
            }
            sqlstr+=" and labordate between '" + startdate + "' and '" + enddate + "'";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();
            for (SqlRow row : list)
            {
                lexp.add(Labor.find.byId(row.getLong("id")));
            }

            //  sumi po market
            String sqlstrtot =    "SELECT market_id as id, sum(payrate*amounthours) as tot FROM labor WHERE 1 =1  ";
            // za market
            if (marketid!= null && !marketid.equals("") && !marketid.equals("0"))
            {
                sqlstrtot+=" and market_id ="+ marketid +" ";
            }
            if (vendorid!= null && !vendorid.equals(""))
            {
                sqlstr +=" and vendor_id  = "+vendorid+" ";
            }
            sqlstrtot+=" and labordate between '" + startdate + "' and '" + enddate + "'  group by market_id";

            SqlQuery sqlQuerytot = Ebean.createSqlQuery(sqlstrtot);
            List<SqlRow> listot = sqlQuerytot.findList();
            Map<Long, Double> totalsperMartket = new HashMap<Long, Double>();
            for (SqlRow row : listot)
            {
                totalsperMartket.put(row.getLong("id"),row.getDouble("tot") );
            }


            // sumi po vendor
            sqlstrtot =    "SELECT vendor_id as id, sum(payrate*amounthours) as tot FROM labor WHERE 1 =1  ";
            // za market
            if (marketid!= null && !marketid.equals("") && !marketid.equals("0"))
            {
                sqlstrtot+=" and market_id ="+ marketid +" ";
            }
            if (vendorid!= null && !vendorid.equals(""))
            {
                sqlstr +=" and vendor_id  = "+vendorid+" ";
            }
            sqlstrtot+=" and labordate between '" + startdate + "' and '" + enddate + "'  group by vendor_id";

            SqlQuery sqlQuerytotv = Ebean.createSqlQuery(sqlstrtot);
            List<SqlRow> listotv = sqlQuerytotv.findList();
            Map<Long, Double> totalsperVendor = new HashMap<Long, Double>();

            for (SqlRow row : listotv)
            {
                    totalsperVendor.put(row.getLong("id") ,row.getDouble("tot") );
            }
            return ok(views.html.reports.LaborItems.render(lexp , totalsperMartket , totalsperVendor));

         }
         else {
                return forbidden();
         }
    }




    public static Result getJobsReportRedesigned() {
        if (Secured.hasAdministratorAccess()) {
            String marketsId = form().bindFromRequest().get("market");
            String jobCategorysId = form().bindFromRequest().get("jobCategory");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");




            List<Task> tasks = new ArrayList<Task>();
            List<Task> totaltasks = new ArrayList<Task>();
            List<Task> totaltasksfinal = new ArrayList<Task>();


            if (marketsId != null && !marketsId.equals("")) {
                    //  Selection.find().where().in("markets",markets).findList();
                    String[] marids = marketsId.split("-");
                    if (marids.length >0 )
                    {
                        for (int i=0; i< marids.length;i++)
                        {
                            tasks = Task.findWithinDatesForMarket(d1, d2, marids[i]);
                            totaltasks.addAll(tasks);
                        }
                    }
                    else
                    {
                        totaltasks = Task.findWithinDates(d1, d2);
                    }
            } else {
                totaltasks = Task.findWithinDates(d1, d2);
            }





            if (jobCategorysId != null && !jobCategorysId.equals("")) {
                // jobCategory = JobCategory.find.byId(Long.parseLong(jobCategoryId));
                String[] jobcatids = jobCategorysId.split("-");
                if (jobcatids.length >0 )
                {
                    int a=0;
                    for (Task t : totaltasks){
                        a++;
                        for (int i=0; i< jobcatids.length;i++)
                        {
                            if (t.job.jobCategory.id == Long.parseLong(jobcatids[i]))
                            {
                                totaltasksfinal.add(t);
                            }
                        }
                    }
                    totaltasks = totaltasksfinal;
                }

            }


            // ovde se totaltasks nezavisno dali ima task sto pagja nadvor od toj period
            // ni treba filtriranje na job-ovite i taskovite so toj job - ako jobot ima barem eden task nadvor od periodot

            List<Task> totaltasksfilteredbyDate = new ArrayList<Task>();
            List<Task> alljobTasks = new ArrayList<Task>();

            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
             Date reperdate = new Date();

            try {
                if (d2!=null) {
                    reperdate = format.parse(d2);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

                for (Task t : totaltasks){
                        alljobTasks = Task.findByJob(t.job.id);
                        boolean flagNadvor = false;

                        for (Task all : alljobTasks){
                            if (all.date.after(reperdate))
                            {
                                flagNadvor = true;
                            }
                        }
                        if (!flagNadvor)
                            totaltasksfilteredbyDate.add(t);
                }
                totaltasks = totaltasksfilteredbyDate;



            //  vidi kade ima saleitemdate - od saleitem tabelata
            //  fati gi site jobid
            //  i posle fati gi site taskid za toj job id
            if (jobCategorysId != null && !jobCategorysId.equals("")) {
                // jobCategory = JobCategory.find.byId(Long.parseLong(jobCategoryId));
                String[] jobcatids = jobCategorysId.split("-");
                if (jobcatids.length >0 )
                {
                    for (int i=0; i< jobcatids.length;i++)
                    {
                        if (jobcatids[i].equals("8")){
                            List<Saleitem> sij = Saleitem.findWithinDates(d1, d2);
                            List<Task> tsktmp = new ArrayList<Task>();
                            List<Task> tskSitem = new ArrayList<Task>();
                            for (Saleitem s : sij){
                                tsktmp = Task.find.where().eq("job.id", s.job.id).findList();
                                for (Task n : tsktmp){
                                    totaltasks.add(n);
                                }
                            }
                        }
                    }

                }
            }

            // do tuka so menuvanjeto logika na invoiced  cat - da gi zema po saleitem...


            return ok(views.html.reports.jobs_rd_redesigned.render(
                    User.find.byId(Long.parseLong(request().username())),
                    totaltasks
            ));
        } else {
            return forbidden();
        }
    }

    public static Result getJobsReport() {
        if (Secured.hasAdministratorAccess()) {
            String marketId = form().bindFromRequest().get("market");
            String jobCategoryId = form().bindFromRequest().get("jobCategory");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            JobCategory jobCategory;
            if (jobCategoryId != null && !jobCategoryId.equals("")) {
                jobCategory = JobCategory.find.byId(Long.parseLong(jobCategoryId));
            }
            else {
                jobCategory = null;
            }

            List<Task> tasks = new ArrayList<Task>();
            if (marketId != null && !marketId.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1, d2, marketId);
            } else {
                tasks = Task.findWithinDates(d1, d2);
            }
            return ok(views.html.reports.jobs_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    tasks,
                    jobCategory
            ));
        } else {
            return forbidden();
        }
    }

    public static Result excelExport( ) {

      
            String marketId = form().bindFromRequest().get("market");
            String jobCategoryId = form().bindFromRequest().get("jobCategory");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            JobCategory jobCategory;
            if (jobCategoryId != null && !jobCategoryId.equals("")) {
                jobCategory = JobCategory.find.byId(Long.parseLong(jobCategoryId));
            }
            else {
                jobCategory = null;
            }

            List<Task> tasks = new ArrayList<Task>();
            if (marketId != null && !marketId.equals("")) {
                tasks = Task.findWithinDatesForMarket(d1, d2, marketId);
            } else {
                tasks = Task.findWithinDates(d1, d2);
            }

        ArrayList headers = new ArrayList();
        headers.add("Job Name");
        headers.add("Total");
        headers.add("Invoiced");
        headers.add("Not Invoiced");
        headers.add("Spent");
        headers.add("Difference");

            File file;
            try {
                file = new File("mydata.xlsx");

                FileOutputStream fileOut = new FileOutputStream(file);
                XSSFWorkbook wb = new XSSFWorkbook();
                Sheet sheet = wb.createSheet("Sheet1");

                Row rowx = sheet.createRow(0);
                for (int m =0; m<headers.size();m++){
                    Cell cell = rowx.createCell(m);
                    cell.setCellValue(String.valueOf(headers.get(m)));
                }

                for (int i =0; i<tasks.size() ;i++){
                    Row row = sheet.createRow(i+1);

                    /*headers.add("Job Name");
                    headers.add("State");
                    headers.add("Total");
                    headers.add("Invoiced");
                    headers.add("Not Invoiced");
                    headers.add("Spent");
                    headers.add("Difference");*/

                       Cell cell = row.createCell(0);
                       cell.setCellValue(tasks.get(i).job.subdivision.customer.name +  tasks.get(i).job.subdivision.name +  tasks.get(i).job.lot);

                    Cell cell1 = row.createCell(1);
                    cell1.setCellValue(1);

                    Cell cell2 = row.createCell(2);
                    cell2.setCellValue(tasks.get(i).job.subdivision.customer.name +  tasks.get(i).job.subdivision.name +  tasks.get(i).job.lot);

                    Cell cell3 = row.createCell(3);
                    cell3.setCellValue(3);

                    Cell cell4 = row.createCell(4);
                    cell4.setCellValue(4);

                }
                wb.write(fileOut);
                fileOut.close();

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }


     //   tasks[0].job.subdivision.customer.name +  tasks[0].job.subdivision.name +  tasks[0].job.lot
     //   tasks[0].saleitems..name
     //   tasks[0].job.subdivision.customer.name
            response().setContentType("application/x-download");
            response().setHeader("Content-disposition","attachment; filename=mydata.xlsx");
            return ok(new File("mydata.xlsx"));

    }

    public static Result getProfitReport() {
        if (Secured.hasAdministratorAccess()) {
            String marketId = form().bindFromRequest().get("market");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            List<Job> jobs = new ArrayList<Job>();
            if (marketId != null && !marketId.equals("")) {
                jobs = Job.find.where().eq("market.id",marketId)
                        .eq("jobCategory.name","invoiced")
                        .ge("date",d1)
                        .le("date",d2)
                        .findList();
            } else {
                jobs = Job.find.where().eq("jobCategory.name","invoiced")
                        .ge("date",d1)
                        .le("date",d2)
                        .findList();
            }
            return ok(views.html.reports.profit_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    jobs
            ));
        } else {
            return forbidden();
        }
    }


    public static boolean isJobVerified(Long jj)
    {
        boolean ver = true;
        Job j = Job.find.byId(jj);
        if (j != null && j.id !=null)
        {
            List<Lineitem> lmbudz = Lineitem.find.where().eq("job_id", j.id).isNull("task_type_id").findList();
            for(Lineitem l : lmbudz)
            {
                if (l!=null)
                    if (l.verify==0)
                        ver = false;
            }
        }
        return ver;
    }



    public static LineitemTotals getOveralperLineitem(Lineitem l)
    {

        SimpleDateFormat format1 = new SimpleDateFormat("MM-dd-yyyy");
        LineitemTotals mapObject = new LineitemTotals();
        if (l != null && l.id !=null)
        {
            // zemi market od jobot
                if (l.job!=null && l.job.market!=null)
                    mapObject.market =  l.job.market.city + ' ' + l.job.market.state;
            // zemi vendor
            if (l.vendor!=null && l.vendor.name!=null)
                mapObject.vendor =  l.vendor.name;
            // zemi subdivision
            if (l.job!=null && l.job.subdivision!=null)
                mapObject.subdivision = l.job.subdivision.name;
            // zemi itemname
            if (l.item!=null && l.item.name!=null)
                mapObject.item = l.item.name;
            // zemi itemid
            if (l.item!=null && l.item.id!=null)
                mapObject.itemid = l.item.id;
            // zemi suma od quantity
            if (l.quantity!=null)
                mapObject.quantity =  l.quantity;
            // zemi rate
            if (l.rate!=null)
                mapObject.rate = l.rate;
            // zemi suma od saleprices
            if (l.saleprice!=null)
                mapObject.saleprice = l.saleprice;

            // ako ne se bara po task datum togas po lineitempos treba
/*
            Lineitempos lmp = Lineitempos.find.where().eq("lineitemid", l.id).eq("historyflag",0).findUnique();
            if(lmp!= null && lmp.datepurchase!=null)
                mapObject.taskDate = lmp.datepurchase;
            else
                mapObject.taskDate = null;*/

            // zemi datum od taskot za koga e toj lineitem
           if (l.task!=null && l.task.date!=null)
                mapObject.taskDate = l.task.date;

            if (l.task!=null )
           {
                    try {
                        mapObject.crew = l.task.crew;
                    } catch (Exception e) {
                        mapObject.crew = 999999;
                    }

           }


        }
        return mapObject;
    }





    public static Map getOveralperJob(Long jj)
    {
        Map<String, Object> mapObject = new HashMap<String, Object>();
        Job j = Job.find.byId(jj);
        if (j != null && j.id !=null)
        {
           // PROVERI DALI E VERIFIKUVAN JOBOT

                    double sale = 0;
                    for(Saleitem s : j.saleitems)
                    {
                        if (s!=null && s.saleprice!=null)
                            sale+=s.saleprice;
                    }

                    double actual = 0;
                    List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").eq("task_type_id", "4").findList();
                    for(Lineitem l : lmact)
                    {
                        if (l!=null && l.saleprice!=null)
                            actual+=l.saleprice;
                    }

                    double budegeted = 0;
                    List<Lineitem> lmbudz = Lineitem.find.where().eq("job_id", j.id).isNull("taskType").findList();
                    for(Lineitem l : lmbudz)
                    {
/*
                        if (l!=null && l.rate!=null)
                            budegeted+=l.rate;
*/
                        if (l!=null && l.rate!=null && l.quantity!=null)
                            budegeted+=l.rate *  l.quantity;
                    }

                    double profit  = sale -actual ;
                    double profitmargin = 0;
                    if (sale >0)
                        profitmargin = profit / sale * 100;
                    double overbudget = actual -budegeted ;


                    //mapObject.put("0", j.id.toString());

                    mapObject.put("0","<a href=\"#\" class=\"clicka\">" + j.id + "</a>");
                    if (j.subdivision!=null && j.subdivision.customer !=null && j.lot !=null)
                        mapObject.put("1", j.subdivision.customer.name + " " + j.subdivision.name + " " + j.lot);
                    else
                        mapObject.put("1", "NA");

                  /*  mapObject.put("2", Double.toString(sale));
                    mapObject.put("3", Double.toString(actual));
                    mapObject.put("4", Double.toString(budegeted));
                    mapObject.put("5", Double.toString(profit));
                    mapObject.put("6", Double.toString(profitmargin));
                    mapObject.put("7", Double.toString(overbudget));*/

                    DecimalFormat df = new DecimalFormat("###,###,##0.00");
            DecimalFormat dft = new DecimalFormat("##0");

                    mapObject.put("2",  df.format(sale) );
                    mapObject.put("3",  df.format(actual));
                    mapObject.put("4", df.format(budegeted) );
                    mapObject.put("5", df.format(profit) );
                    mapObject.put("6", dft.format(profitmargin) + " %" );
                    mapObject.put("7",  df.format(overbudget));

        }
        return mapObject;
    }

    public static Result getnew1frontdata(){
        if (Secured.hasAdministratorAccess()) {

            String jobid = "";
            jobid = form().bindFromRequest().get("jobid");
            String markets = form().bindFromRequest().get("markets");
            String jobCategories = form().bindFromRequest().get("jobCategories");
       //     String crewleader = form().bindFromRequest().get("crewleader");
       //     String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String subdivision = form().bindFromRequest().get("subdivision");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");



            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Map> listjobs = new ArrayList<Map>();

            if (!jobid.equals(""))
            {
                //  report samo po job_id
                Job j = Job.find.where().eq("id", jobid).findUnique();
                if (j != null)
                    if(isJobVerified(j.id))
                        listjobs.add(getOveralperJob(j.id));
            }
            else
            {
                List<Job> jsTmP = new ArrayList<Job>();
                List<String> jobCatids = new ArrayList<String>();
                List<String> marids = new ArrayList<String>();

                String jobCategoriesSelect = "";
                if (jobCategories != null && !jobCategories.equals(""))
                {
                    jobCatids = Arrays.asList(jobCategories.split("-"));
                    for (int i=0; i< jobCatids.size();i++)
                    {
                        jobCategoriesSelect+= jobCatids.get(i);
                        if (i<jobCatids.size()-1)
                            jobCategoriesSelect+=",";
                    }
                }

                String marketSelect = "";
                if (markets != null && !markets.equals(""))
                {
                    marids = Arrays.asList(markets.split("-"));
                    for (int i=0; i< marids.size();i++)
                    {
                        marketSelect+= marids.get(i);
                        if (i<marids.size()-1)
                            marketSelect+=",";
                    }
                }

                String sqlstr =  "SELECT `id` FROM job WHERE 1 =1  ";

                // za market
                if (marketSelect!= null && !marketSelect.equals(""))
                    sqlstr +=" and market_id in ("+marketSelect+") ";

                // za katewgiruh
                if (jobCategoriesSelect!= null && !jobCategoriesSelect.equals(""))
                    sqlstr +=" and job_category_id in ("+jobCategoriesSelect+") ";

           /*     // za crewleader vo manager
                if (crewleader!= null && !crewleader.equals("")) ///
                    sqlstr +=" and id in (select distinct(job_id) from manager  where user_id  = "+crewleader+")";

                // za manager vo assigns
                if (manager!= null && !manager.equals("")) //
                    sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";*/

                // za sutomer preku subdivision
                // ako ima izbrano subdivision (prvo se bira customer) togas odi po toj subdivision direktno
                if (subdivision!= null && !subdivision.equals(""))
                        sqlstr +=" and subdivision_id  = "+subdivision+" ";
                else
                // ako nema subdivision direktno togas se biraat site subdivision od izbraniot customer
                    if (customer!= null && !customer.equals(""))
                        sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";

               /* if (!d1.equals(d2))
                {*/
                    List<Task> tasks = new ArrayList<Task>();
                    tasks = Task.findWithinDates(d1, d2);

                    List<String> jsTmPs = new ArrayList<String>();
                    for (Task t : tasks)
                        jsTmPs.add(t.job.id.toString());

                    String finalstring = "";
                    //remove duplicates
                    List<String> strg =  new ArrayList(new HashSet(jsTmPs));
                    int i = 0;
                    for (String t : strg)
                    {
                        finalstring+= t;
                        if (i<strg.size()-1)
                            finalstring+=",";
                        i++;
                    }
                if (!finalstring.equals(""))
                {
                    sqlstr +=" and id in ("+finalstring+") ";
                }

                //}

                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                List<SqlRow> list = sqlQuery.findList();
                for (SqlRow row : list)
                {
                    if(isJobVerified(row.getLong("id")))
                        listjobs.add(getOveralperJob(row.getLong("id")));
                }

            }
            if (listjobs!= null)
            {
                Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listjobs);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }
   /*       ObjectNode result = Json.newObject();
            result.put("sEcho", Integer.valueOf(params.get("sEcho")[0]));
            result.put("iTotalRecords", iTotalRecords);
            result.put("iTotalDisplayRecords", iTotalDisplayRecords);
            ArrayNode an = result.putArray("aaData");
    */
        }
        else {
            return forbidden();
        }
    }

    public static Map getCategoryperJob(Long jj)
    {
        Map<String, Object> mapObject = new HashMap<String, Object>();
        Job j = Job.find.byId(jj);
        if (j != null && j.id !=null)
        {

          //  mapObject.put("0", j.id.toString());

            mapObject.put("0","<a href=\"#\" class=\"clicka\">" + j.id + "</a>");
            if (j.subdivision!=null && j.subdivision.customer !=null && j.lot !=null)
                mapObject.put("1", j.subdivision.customer.name + " " + j.subdivision.name + " " + j.lot);
            else
                mapObject.put("1", "NA");


            if (j.jobCategory!=null && j.jobCategory.name !=null )
                mapObject.put("2", j.jobCategory.name);
            else
                mapObject.put("2", "NA");



            if (j.notes!=null  )
                mapObject.put("3", j.notes);
            else
                mapObject.put("3", "-");

        }
        return mapObject;
    }


    public static Map getSaleActualperJob(Long jj, String d1, String d2)
    {
        Map<String, Object> mapObject = new HashMap<String, Object>();
        Job j = Job.find.byId(jj);
        if (j != null && j.id !=null)
        {

            // ZEMI saleitemi samo vo OPSEG d1 i d2
            double sale = 0;
            List<Saleitem> jsale = Saleitem.find.where().eq("job_id", j.id).ge("saleitemdate",d1).le("saleitemdate",d2).findList();
            for(Saleitem s : jsale)
            {
                if (s!=null && s.saleprice!=null)
                    sale+=s.saleprice;
            }
            // ZEMI actuals samo vo OPSEG d1 i d2
            double actual = 0;
            List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").ge("daysdate", d1).le("daysdate", d2).findList();
            for(Lineitem l : lmact)
            {
                if (l!=null && l.saleprice!=null)
                    actual+=l.saleprice;
            }

       /*     double budegeted = 0;
            List<Lineitem> lmbudz = Lineitem.find.where().eq("job_id", j.id).isNull("taskType").findList();
            for(Lineitem l : lmbudz)
            {
                if (l!=null && l.rate!=null && l.quantity!=null)
                    budegeted+=l.rate *  l.quantity;
            }*/

            double profit  = sale -actual ;
            double profitmargin = 0;
            if (sale >0)
                profitmargin = profit / sale * 100;
            // double overbudget = actual -budegeted ;


           // mapObject.put("0", j.id.toString());
            mapObject.put("0","<a href=\"#\" class=\"clicka\">" + j.id + "</a>");
            if (j.subdivision!=null && j.subdivision.customer !=null && j.lot !=null)
                mapObject.put("1", j.subdivision.customer.name + " " + j.subdivision.name + " " + j.lot);
            else
                mapObject.put("1", "NA");

            if (j.jobCategory !=null && !j.jobCategory.name.equals(""))
                mapObject.put("2", j.jobCategory.abbr);
            else
                mapObject.put("2", "NA");

            DecimalFormat df = new DecimalFormat("###,###,##0.00");
            DecimalFormat dft = new DecimalFormat("##0");

            mapObject.put("3",  df.format(sale) );
            mapObject.put("4",  df.format(actual));
         /*   mapObject.put("4", df.format(budegeted) );*/
            mapObject.put("5", df.format(profit) );
            mapObject.put("6", dft.format(profitmargin) + " %" );
         /*   mapObject.put("7",  df.format(overbudget));*/

        }
        return mapObject;
    }




    public static Result getnew2frontdata(){
        if (Secured.hasAdministratorAccess()) {

            String saleOrActual = form().bindFromRequest().get("saleOrActual");
            String markets = form().bindFromRequest().get("markets");

            String customer = form().bindFromRequest().get("customer");
            String subdivision = form().bindFromRequest().get("subdivision");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            // treba da gi fatime jobovite sto imaat sale vo toj period pod tie uslovi
            // ispisot treba da gi fati samo sale vo toj period
            // ili
            // treba da gi fatime jobovite sto imaat sale vo toj period pod tie uslovi
            // ispisot treba da gi fati samo actuals vo toj period



            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Map> listjobs = new ArrayList<Map>();

            List<Job> jsTmP = new ArrayList<Job>();

            List<String> marids = new ArrayList<String>();
                String marketSelect = "";
                if (markets != null && !markets.equals(""))
                {
                    marids = Arrays.asList(markets.split("-"));
                    for (int i=0; i< marids.size();i++)
                    {
                        marketSelect+= marids.get(i);
                        if (i<marids.size()-1)
                            marketSelect+=",";
                    }
                }
                String sqlstr =  "";
                String sqlstrsale =  "SELECT `id` FROM job WHERE 1 =1  ";
                String sqlstractual =  "SELECT `id` FROM job WHERE 1 =1  ";
                // za market
                if (marketSelect!= null && !marketSelect.equals(""))
                {
                    sqlstrsale +=" and market_id in ("+marketSelect+") ";
                    sqlstractual +=" and market_id in ("+marketSelect+") ";
                /*//biraat site subdivision od izbraniot customer
                if (customer!= null && !customer.equals(""))
                    sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";
*/
                }
                if (subdivision!= null && !subdivision.equals(""))
                {
                    sqlstrsale +=" and subdivision_id  = "+subdivision+" ";
                    sqlstractual +=" and subdivision_id  = "+subdivision+" ";
                }
                else
                // ako nema subdivision direktno togas se biraat site subdivision od izbraniot customer
                if (customer!= null && !customer.equals(""))
                {
                    sqlstrsale +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";
                    sqlstractual +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";
                }

                sqlstrsale+=" and id in (select distinct(job_id) from saleitem where saleitemdate between '" + d1 + "' and '" + d2 + "') ";
                sqlstractual+=" and id in (select distinct(job_id) from lineitem where task_type_id is not null and daysdate between '" + d1 + "' and '" + d2 + "') ";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstrsale);
            List<SqlRow> list = sqlQuery.findList();
            List<Job> jobssaleact = new ArrayList<Job>();

            for (SqlRow row : list)
                jobssaleact.add(Job.find.byId(row.getLong("id")));




              //  listjobs.add(getSaleActualperJob(row.getLong("id"), d1, d2));

            SqlQuery sqlQueryactuals = Ebean.createSqlQuery(sqlstractual);
            List<SqlRow> listact = sqlQueryactuals.findList();
            for (SqlRow row : listact)
                jobssaleact.add(Job.find.byId(row.getLong("id")));

            List<Job> jobsovi =  new ArrayList(new HashSet(jobssaleact));

            for (Job j : jobsovi)
                listjobs.add(getSaleActualperJob(j.id, d1, d2));




            /*
                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                List<SqlRow> list = sqlQuery.findList();
                for (SqlRow row : list)
                        listjobs.add(getSaleActualperJob(row.getLong("id"), d1, d2));
*/


                if (listjobs!= null)
                {
                    Map<String, Object> mapObject = new HashMap<String, Object>();
                    mapObject.put("data",  listjobs);
                    return ok(toJson(mapObject));
                }
                else {
                    return ok();
                }
        }
        else {
            return forbidden();
        }
    }

    public static Result getnew2frontdataTotals(){
        if (Secured.hasAdministratorAccess()) {

            String markets = form().bindFromRequest().get("markets");
            String customer = form().bindFromRequest().get("customer");
            String subdivision = form().bindFromRequest().get("subdivision");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            List<String> marids = new ArrayList<String>();
            String marketSelect = "";
            if (markets != null && !markets.equals(""))
            {
                marids = Arrays.asList(markets.split("-"));
                for (int i=0; i< marids.size();i++)
                {
                    marketSelect+= marids.get(i);
                    if (i<marids.size()-1)
                        marketSelect+=",";
                }
            }
            String sqlstrsale =  "SELECT `id` FROM job WHERE 1 =1  ";
            String sqlstractual =  "SELECT `id` FROM job WHERE 1 =1  ";
            // za market
            if (marketSelect!= null && !marketSelect.equals(""))
            {
                sqlstrsale +=" and market_id in ("+marketSelect+") ";
                sqlstractual +=" and market_id in ("+marketSelect+") ";
            }
            if (subdivision!= null && !subdivision.equals(""))
            {
                sqlstrsale +=" and subdivision_id  = "+subdivision+" ";
                sqlstractual +=" and subdivision_id  = "+subdivision+" ";
            }
            else
                if (customer!= null && !customer.equals(""))
                {
                    sqlstrsale +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";
                    sqlstractual +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";
                }

            sqlstrsale+=" and id in (select distinct(job_id) from saleitem where saleitemdate between '" + d1 + "' and '" + d2 + "') ";
            sqlstractual+=" and id in (select distinct(job_id) from lineitem where task_type_id is not null and daysdate between '" + d1 + "' and '" + d2 + "') ";

            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstrsale);
            List<SqlRow> list = sqlQuery.findList();
            List<Job> jobssaleact = new ArrayList<Job>();

            for (SqlRow row : list)
                jobssaleact.add(Job.find.byId(row.getLong("id")));




            //  listjobs.add(getSaleActualperJob(row.getLong("id"), d1, d2));

            SqlQuery sqlQueryactuals = Ebean.createSqlQuery(sqlstractual);
            List<SqlRow> listact = sqlQueryactuals.findList();
            for (SqlRow row : listact)
                jobssaleact.add(Job.find.byId(row.getLong("id")));

            List<Job> jobsovi =  new ArrayList(new HashSet(jobssaleact));


            double saleTot = 0;
            double actualTot = 0;
            for (Job j : jobsovi){
                if (j != null && j.id !=null)
                {
                    // ZEMI saleitemi samo vo OPSEG d1 i d2
                    List<Saleitem> jsale = Saleitem.find.where().eq("job_id", j.id).ge("saleitemdate",d1).le("saleitemdate",d2).findList();
                    for(Saleitem s : jsale)
                    {
                        if (s!=null && s.saleprice!=null)
                            saleTot+=s.saleprice;
                    }


                    List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").ge("daysdate", d1).le("daysdate", d2).findList();
                    for(Lineitem l : lmact)
                    {
                        if (l!=null && l.saleprice!=null)
                            actualTot+=l.saleprice;
                    }
                }
            }

/*

            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstrsale);
            List<SqlRow> listsale = sqlQuery.findList();
            double saleTot = 0;
            for (SqlRow row : listsale){
                Job j = Job.find.byId(row.getLong("id"));
                if (j != null && j.id !=null)
                {
                    // ZEMI saleitemi samo vo OPSEG d1 i d2
                    List<Saleitem> jsale = Saleitem.find.where().eq("job_id", j.id).ge("saleitemdate",d1).le("saleitemdate",d2).findList();
                    for(Saleitem s : jsale)
                    {
                        if (s!=null && s.saleprice!=null)
                            saleTot+=s.saleprice;
                    }
                }
            }

            SqlQuery sqlQueryact = Ebean.createSqlQuery(sqlstractual);
            List<SqlRow> listactuals = sqlQueryact.findList();
            double actualTot = 0;
            for (SqlRow row : listactuals){
                Job j = Job.find.byId(row.getLong("id"));
                if (j != null && j.id !=null)
                {
                    List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").ge("daysdate", d1).le("daysdate", d2).findList();
                    for(Lineitem l : lmact)
                    {
                        if (l!=null && l.saleprice!=null)
                            actualTot+=l.saleprice;
                    }
                }
            }
*/

            Map<String, Double> totals = new HashMap<String, Double>();

            totals.put("sale" , saleTot);
            totals.put("cost" , actualTot);

            double profit  = saleTot -actualTot ;
            double profitmargin = 0;
            if (saleTot >0)
                profitmargin = profit / saleTot * 100;

            totals.put("profit" , profit);
            totals.put("profitmargin" , profitmargin);

            Map<String, Object> mapObject = new HashMap<String, Object>();
            mapObject.put("data",  totals);
            return ok(toJson(mapObject));
        }
        else {
            return forbidden();
        }
   }





    public static Result getnew6frontdata(){
        if (Secured.hasAdministratorAccess()) {
            String jobCategories = form().bindFromRequest().get("jobCategories");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");
            String markets = form().bindFromRequest().get("markets");
            String customer = form().bindFromRequest().get("customer");


            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Map> listjobs = new ArrayList<Map>();

            List<String> marids = new ArrayList<String>();

            String marketSelect = "";
            if (markets != null && !markets.equals(""))
            {
                marids = Arrays.asList(markets.split("-"));
                for (int i=0; i< marids.size();i++)
                {
                    marketSelect+= marids.get(i);
                    if (i<marids.size()-1)
                        marketSelect+=",";
                }
            }

            List<String> jobCatids = new ArrayList<String>();

            String jobCategoriesSelect = "";
                if (jobCategories != null && !jobCategories.equals(""))
                {
                    jobCatids = Arrays.asList(jobCategories.split("-"));
                    for (int i=0; i< jobCatids.size();i++)
                    {
                        jobCategoriesSelect+= jobCatids.get(i);
                        if (i<jobCatids.size()-1)
                            jobCategoriesSelect+=",";
                    }
                }
                String sqlstr =  "SELECT `id` FROM job WHERE 1 =1  ";

                // za marketi
                if (marketSelect!= null && !marketSelect.equals(""))
                    sqlstr +=" and market_id in ("+marketSelect+") ";

                // za kategorii
                if (jobCategoriesSelect!= null && !jobCategoriesSelect.equals(""))
                    sqlstr +=" and job_category_id in ("+jobCategoriesSelect+") ";

                // startdate enddate
                /*if (!d1.equals(d2))
                {*/
                    List<Task> tasks = new ArrayList<Task>();
                    tasks = Task.findWithinDates(d1, d2);


                    List<String> jsTmP = new ArrayList<String>();
                    for (Task t : tasks)
                    {
                        // najdi dali e posleden task-ot vo job ili ima i posle nego
                        List<Task> ponovitaskovi = Task.find.where().eq("job_id", t.job.id).gt("date", t.date).findList();
                    //    List<Task> postarttaskovi = Task.find.where().eq("job_id", t.job.id).lt("date", t.date).findList();
                        if (ponovitaskovi.size()==0 ) // &&  postarttaskovi.size() == 0
                            //komentiraj gi gornive 2 za da ne gi ogranicis na posledni taskovi od jobot
                            jsTmP.add(t.job.id.toString());
                    }

                    String finalstring = "";
                    List<String> strg =  new ArrayList(new HashSet(jsTmP));
                    int i = 0;
                    for (String t : strg)
                    {
                        finalstring+= t;
                        if (i<strg.size()-1)
                            finalstring+=",";
                        i++;
                    }

               // }

            if (!finalstring.equals(""))
            {
                sqlstr +=" and id in ("+finalstring+") ";
            }

                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                List<SqlRow> list = sqlQuery.findList();

                for (SqlRow row : list)
                    listjobs.add(getCategoryperJob(row.getLong("id")));

            if (listjobs!= null)
            {
                Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listjobs);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }
        }
        else {
            return forbidden();
        }
}


    public static Result getnew3frontdata(){
        if (Secured.hasAdministratorAccess()) {
            String jobCategories = form().bindFromRequest().get("jobCategories");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");
            String markets = form().bindFromRequest().get("markets");
            String customer = form().bindFromRequest().get("customer");


            // Map<String, Object> listjobs = new HashMap<String, Object>();
            List<Map> listjobs = new ArrayList<Map>();

            List<String> marids = new ArrayList<String>();

            String marketSelect = "";
            if (markets != null && !markets.equals(""))
            {
                marids = Arrays.asList(markets.split("-"));
                for (int i=0; i< marids.size();i++)
                {
                    marketSelect+= marids.get(i);
                    if (i<marids.size()-1)
                        marketSelect+=",";
                }
            }

            List<String> jobCatids = new ArrayList<String>();

            String jobCategoriesSelect = "";
            if (jobCategories != null && !jobCategories.equals(""))
            {
                jobCatids = Arrays.asList(jobCategories.split("-"));
                for (int i=0; i< jobCatids.size();i++)
                {
                    jobCategoriesSelect+= jobCatids.get(i);
                    if (i<jobCatids.size()-1)
                        jobCategoriesSelect+=",";
                }
            }
            String sqlstr =  "SELECT `id` FROM job WHERE 1 =1  ";

            // za marketi
            if (marketSelect!= null && !marketSelect.equals(""))
                sqlstr +=" and market_id in ("+marketSelect+") ";

            // za kategorii
            if (jobCategoriesSelect!= null && !jobCategoriesSelect.equals(""))
                sqlstr +=" and job_category_id in ("+jobCategoriesSelect+") ";

            // startdate enddate
                /*if (!d1.equals(d2))
                {*/
            List<Task> tasks = new ArrayList<Task>();
            tasks = Task.findWithinDates(d1, d2);


            List<String> jsTmP = new ArrayList<String>();
            for (Task t : tasks)
            {
             /*   // najdi dali e posleden task-ot vo job ili ima i posle nego
                List<Task> ponovitaskovi = Task.find.where().eq("job_id", t.job.id).gt("date", t.date).findList();
                if (ponovitaskovi.size()==0)
                    //komentiraj gi gornive 2 za da ne gi ogranicis na posledni taskovi od jobot*/
                    jsTmP.add(t.job.id.toString());
            }

            String finalstring = "";
            List<String> strg =  new ArrayList(new HashSet(jsTmP));
            int i = 0;
            for (String t : strg)
            {
                finalstring+= t;
                if (i<strg.size()-1)
                    finalstring+=",";
                i++;
            }

            // }

            if (!finalstring.equals(""))
            {
                sqlstr +=" and id in ("+finalstring+") ";
            }

            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();

            for (SqlRow row : list)
                listjobs.add(getCategoryperJob(row.getLong("id")));

            if (listjobs!= null)
            {
                Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listjobs);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }
        }
        else {
            return forbidden();
        }
    }




    public static Map getPurchasperLineitem(Long jj)
    {
        Map<String, Object> mapObject = new HashMap<String, Object>();
        Lineitem li = Lineitem.find.byId(jj);
        if (li != null && li.id !=null)
        {
            if (li.job!=null)
                mapObject.put("0","<a href=\"#\" class=\"clicka\">" + li.job.id + "</a>");
            else
                mapObject.put("0", "-");

            if (li.job.subdivision!=null)
                mapObject.put("1", li.job.subdivision.name);
            else
                mapObject.put("1", "-");

            if (li.job.subdivision.customer!=null)
                mapObject.put("2", li.job.subdivision.customer.name);
            else
                mapObject.put("2", "-");

             if (li.job.lot !=null)
                mapObject.put("3", li.job.lot);
            else
                mapObject.put("3", "-");


            if (li.vendor !=null)
                mapObject.put("4", li.vendor.name);
            else
                mapObject.put("4", "-");

            if (li.item !=null)
                mapObject.put("5", li.item.name);
            else
                mapObject.put("5", "-");

            if (li.quantity !=null)
                mapObject.put("6", li.quantity);
            else
                mapObject.put("6", "-");


            if (li.task !=null && li.task.date!=null)
            {/*
                long unixSeconds = Long.parseLong(li.daysdate.toString());
                Date date = new Date(unixSeconds*1000L); // *1000 is to convert seconds to milliseconds
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss z"); // the format of your date
              //  sdf.setTimeZone(TimeZone.getTimeZone("GMT-4")); // give a timezone reference for formating (see comment at the bottom
                String formattedDate = sdf.format(date);


                mapObject.put("7", formattedDate);*/

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(li.task.date);
                mapObject.put("7", formattedDate);
            }
           else
                mapObject.put("7", "-");


            mapObject.put("8", "____");
            if (li.notes !=null)
                mapObject.put("9", li.notes);
            else
                mapObject.put("9", "____");

        }
        return mapObject;
    }


    public static Result getnew4frontdata(){
            if (Secured.hasAdministratorAccess()) {

             //   itemCategory	Date Range	Market	Manager	Vendor	Customer

                String market = form().bindFromRequest().get("market");
                String itemCategory = form().bindFromRequest().get("itemCategory");
                String manager = form().bindFromRequest().get("manager");
                String customer = form().bindFromRequest().get("customer");
                String vendor = form().bindFromRequest().get("vendor");
                String d1 = form().bindFromRequest().get("startDate");
                String d2 = form().bindFromRequest().get("endDate");



                // Map<String, Object> listjobs = new HashMap<String, Object>();
                    List<Map> listjobs = new ArrayList<Map>();


                    List<Job> jsTmP = new ArrayList<Job>();

                String sqlstr =  "SELECT `id` FROM lineitem WHERE 1 =1  and job_id in ( ";


                     sqlstr +=  "SELECT `id` FROM job WHERE 1 =1  ";

                    // za market - JOB
                    if (market!= null && !market.equals(""))
                        sqlstr +=" and market_id = "+market+" ";

                // za manager vo assigns - - JOB
                    if (manager!= null && !manager.equals("")) //
                    sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";

                    // po custoemr - JOB
                    if (customer!= null && !customer.equals(""))
                        sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";


                String finalstring = "";

                // probaj za - TASK
                  /*  if (!d1.equals(d2))
                    {*/
                        List<Task> tasks = new ArrayList<Task>();
                        tasks = Task.findWithinDates(d1, d2);

                        List<String> jsTmPs = new ArrayList<String>();
                        for (Task t : tasks)
                            jsTmPs.add(t.id.toString());


                        List<String> strg =  new ArrayList(new HashSet(jsTmPs));
                        int i = 0;
                        for (String t : strg)
                        {
                            finalstring+= t;
                            if (i<strg.size()-1)
                                finalstring+=",";
                            i++;
                        }

                   // }


                    sqlstr += " ) and task_type_id is null and task_id is not null ";

                if (!finalstring.equals(""))
                    sqlstr +=" and task_id in ("+finalstring+") ";
                else
                    sqlstr +=" and task_id in (0) ";

                    // za itemkategirija  - LINEITEM
                    if (itemCategory!= null && !itemCategory.equals(""))
                    sqlstr +=" and item_type_id = "+itemCategory+" ";

                if (vendor!= null && !vendor.equals(""))
                    sqlstr +=" and vendor_id = "+vendor+" ";



                    sqlstr +=" order by job_id desc";


                    SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                    List<SqlRow> list = sqlQuery.findList();
                    for (SqlRow row : list)
                    {
                            listjobs.add(getPurchasperLineitem(row.getLong("id")));
                    }


                if (listjobs!= null)
                {
                    Map<String, Object> mapObject = new HashMap<String, Object>();
                    mapObject.put("data",  listjobs);
                    return ok(toJson(mapObject));
                }
                else {
                    return ok();
                }
            }
            else {
                return forbidden();
            }
        }

    public static Result getProfitReportRedesigned() {
        if (Secured.hasAdministratorAccess()) {
            String marketsId = form().bindFromRequest().get("market");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            List<Job> jobs = new ArrayList<Job>();
            List<Job> jobstotal = new ArrayList<Job>();
            if (marketsId != null && !marketsId.equals("")) {
              //  Selection.find().where().in("markets",markets).findList();
                String[] marids = marketsId.split("-");
                if (marids.length >0 )
                {
                    for (int i=0; i< marids.length;i++)
                    {
                        jobs = Job.find.where().eq("market.id", marids[i])
                                .eq("jobCategory.name", "invoiced").between("date", d1, d2).findList();
                                /*.ge("date", d1)
                                .le("date", d2)
                                .findList();*/
                        jobstotal.addAll(jobs);
                    }
                }
                else
                {
                    jobstotal = Job.find.where().eq("jobCategory.name", "invoiced").between("date", d1, d2).findList();
                            /*.ge("date",d1)
                            .le("date",d2)
                            .findList();*/
                }
            } else {
                jobstotal = Job.find.where().eq("jobCategory.name", "invoiced").between("date", d1, d2).findList();
                        /*.ge("date",d1)
                        .le("date",d2)
                        .findList();*/
            }
            return ok(views.html.reports.profit_rd_redesigned.render(
                    User.find.byId(Long.parseLong(request().username())),
                    jobstotal
            ));
        } else {
            return forbidden();
        }
    }



    public static Result getnew5frontdataTotals(){


        if (Secured.hasAdministratorAccess()) {
            String jobid = "";
            jobid = form().bindFromRequest().get("jobid");
            String verifiedSelect =  form().bindFromRequest().get("verifiedSelect");
            String markets = form().bindFromRequest().get("markets");
            String jobCategories = form().bindFromRequest().get("jobCategories");
            String customer = form().bindFromRequest().get("customer");
            String subdivision = form().bindFromRequest().get("subdivision");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            // Map<String, Object> listjobs = new HashMap<String, Object>();
            Map<String, Double> totals = new HashMap<String, Double>();

            Map<String, Object> mapObject = new HashMap<String, Object>();

            if (!jobid.equals(""))
            {
                //  report samo po job_id
                Job j = Job.find.where().eq("id", jobid).findUnique();

                       // if(isJobVerified(j.id))

                        double saleTot = 0;
                        double actualTot = 0;
                        double budgetTot = 0;

                        if (j != null && j.id !=null)
                        {

                            for(Saleitem s : j.saleitems)
                            {
                                if (s!=null && s.saleprice!=null)
                                    saleTot+=s.saleprice;
                            }


                            List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").findList();
                            for(Lineitem l : lmact)
                            {
                                if (l!=null && l.saleprice!=null)
                                    actualTot+=l.saleprice;
                            }


                            List<Lineitem> lmbudz = Lineitem.find.where().eq("job_id", j.id).isNull("taskType").findList();
                            for(Lineitem l : lmbudz)
                            {
                                if (l!=null && l.rate!=null && l.quantity!=null)
                                    budgetTot+=l.rate *  l.quantity;
                            }
                        }

                    double profitTot  = saleTot -actualTot ;
                    double profitmargin = 0;
                    if (saleTot >0)
                        profitmargin = profitTot / saleTot * 100;
                    double overbudget = actualTot -budgetTot ;


                    totals.put("sale" , saleTot);
                    totals.put("cost" , actualTot);
                    totals.put("budget" , budgetTot);


                    totals.put("profit" , profitTot);
                    totals.put("profitmargin" , profitmargin);
                    totals.put("overbud" , overbudget);


                    mapObject.put("data",  totals);
            }
            else
            {

                List<Job> jsTmP = new ArrayList<Job>();
                List<String> jobCatids = new ArrayList<String>();
                List<String> marids = new ArrayList<String>();

                String jobCategoriesSelect = "";
                if (jobCategories != null && !jobCategories.equals(""))
                {
                    jobCatids = Arrays.asList(jobCategories.split("-"));
                    for (int i=0; i< jobCatids.size();i++)
                    {
                        jobCategoriesSelect+= jobCatids.get(i);
                        if (i<jobCatids.size()-1)
                            jobCategoriesSelect+=",";
                    }
                }

                String marketSelect = "";
                if (markets != null && !markets.equals(""))
                {
                    marids = Arrays.asList(markets.split("-"));
                    for (int i=0; i< marids.size();i++)
                    {
                        marketSelect+= marids.get(i);
                        if (i<marids.size()-1)
                            marketSelect+=",";
                    }
                }

                String sqlstr =  "SELECT `id` FROM job WHERE 1 =1  ";

                // za market
                if (marketSelect!= null && !marketSelect.equals(""))
                    sqlstr +=" and market_id in ("+marketSelect+") ";

                // za katewgiruh
                if (jobCategoriesSelect!= null && !jobCategoriesSelect.equals(""))
                    sqlstr +=" and job_category_id in ("+jobCategoriesSelect+") ";



                // za sutomer preku subdivision
                // ako ima izbrano subdivision (prvo se bira customer) togas odi po toj subdivision direktno
                if (subdivision!= null && !subdivision.equals(""))
                    sqlstr +=" and subdivision_id  = "+subdivision+" ";
                else
                    // ako nema subdivision direktno togas se biraat site subdivision od izbraniot customer
                    if (customer!= null && !customer.equals(""))
                        sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";


                List<Task> tasks = new ArrayList<Task>();
                tasks = Task.findWithinDates(d1, d2);

                List<String> jsTmPs = new ArrayList<String>();
                for (Task t : tasks)
                    jsTmPs.add(t.job.id.toString());

                String finalstring = "";
                //remove duplicates
                List<String> strg =  new ArrayList(new HashSet(jsTmPs));
                int i = 0;
                for (String t : strg)
                {
                    finalstring+= t;
                    if (i<strg.size()-1)
                        finalstring+=",";
                    i++;
                }
                if (!finalstring.equals(""))
                {
                    sqlstr +=" and id in ("+finalstring+") ";
                }



                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                List<SqlRow> list = sqlQuery.findList();

                List<Job> jobss = new ArrayList<Job>();
               /* for (SqlRow row : list)
                    jobss.add(Job.find.byId(row.getLong("id")));*/
                for (SqlRow row : list)
                {
                    if(!verifiedSelect.equals(""))
                        if(verifiedSelect.equals("1"))
                        {
                            if(isJobVerified(row.getLong("id")))
                            {
                                // listjobs.add(getOveralperJob(row.getLong("id")));
                                jobss.add(Job.find.byId(row.getLong("id")));
                            }
                        }
                        else
                        {
                            if(!isJobVerified(row.getLong("id")))
                            {
                                //  listjobs.add(getOveralperJob(row.getLong("id")));
                                jobss.add(Job.find.byId(row.getLong("id")));
                            }
                        }
                    else
                        //listjobs.add(getOveralperJob(row.getLong("id")));
                        jobss.add(Job.find.byId(row.getLong("id")));
                }

                List<Job> jobsovi =  new ArrayList(new HashSet(jobss));


                double saleTot = 0;
                double actualTot = 0;
                double budgetTot = 0;
                for (Job j : jobsovi){
                    if (j != null && j.id !=null)
                    {

                        for(Saleitem s : j.saleitems)
                        {
                            if (s!=null && s.saleprice!=null)
                                saleTot+=s.saleprice;
                        }


                        List<Lineitem> lmact = Lineitem.find.where().eq("job_id", j.id).isNotNull("taskType").findList();
                        for(Lineitem l : lmact)
                        {
                            if (l!=null && l.saleprice!=null)
                                actualTot+=l.saleprice;
                        }


                        List<Lineitem> lmbudz = Lineitem.find.where().eq("job_id", j.id).isNull("taskType").findList();
                        for(Lineitem l : lmbudz)
                        {
    /*
                            if (l!=null && l.rate!=null)
                                budegeted+=l.rate;
    */
                            if (l!=null && l.rate!=null && l.quantity!=null)
                                budgetTot+=l.rate *  l.quantity;
                        }
                    }
                }
                double profitTot  = saleTot -actualTot ;
                double profitmargin = 0;
                if (saleTot >0)
                    profitmargin = profitTot / saleTot * 100;
                double overbudget = actualTot -budgetTot ;




                totals.put("sale" , saleTot);
                totals.put("cost" , actualTot);
                totals.put("budget" , budgetTot);


                totals.put("profit" , profitTot);
                totals.put("profitmargin" , profitmargin);
                totals.put("overbud" , overbudget);


                mapObject.put("data",  totals);
            }
            return ok(toJson(mapObject));
        }
        else {
            return forbidden();
        }

    }


    public static Result getnew5frontdata(){
        if (Secured.hasAdministratorAccess()) {

            String jobid = "";
            jobid = form().bindFromRequest().get("jobid");
            String verifiedSelect =  form().bindFromRequest().get("verifiedSelect");
            String markets = form().bindFromRequest().get("markets");
            String jobCategories = form().bindFromRequest().get("jobCategories");
            //      String crewleader = form().bindFromRequest().get("crewleader");
            //     String manager = form().bindFromRequest().get("manager");
            String customer = form().bindFromRequest().get("customer");
            String subdivision = form().bindFromRequest().get("subdivision");
            String d1 = form().bindFromRequest().get("startDate");
            String d2 = form().bindFromRequest().get("endDate");

            List<Map> listjobs = new ArrayList<Map>();

            if (!jobid.equals(""))
            {
                //  report samo po job_id
                Job j = Job.find.where().eq("id", jobid).findUnique();
                if (j != null)
                //    if(isJobVerified(j.id))
                        listjobs.add(getOveralperJob(j.id));
            }
            else
            {
            // Map<String, Object> listjobs = new HashMap<String, Object>();



                List<Job> jsTmP = new ArrayList<Job>();
                List<String> jobCatids = new ArrayList<String>();
                List<String> marids = new ArrayList<String>();

                String jobCategoriesSelect = "";
                if (jobCategories != null && !jobCategories.equals(""))
                {
                    jobCatids = Arrays.asList(jobCategories.split("-"));
                    for (int i=0; i< jobCatids.size();i++)
                    {
                        jobCategoriesSelect+= jobCatids.get(i);
                        if (i<jobCatids.size()-1)
                            jobCategoriesSelect+=",";
                    }
                }

                String marketSelect = "";
                if (markets != null && !markets.equals(""))
                {
                    marids = Arrays.asList(markets.split("-"));
                    for (int i=0; i< marids.size();i++)
                    {
                        marketSelect+= marids.get(i);
                        if (i<marids.size()-1)
                            marketSelect+=",";
                    }
                }

                String sqlstr =  "SELECT `id` FROM job WHERE 1 =1  ";

                // za market
                if (marketSelect!= null && !marketSelect.equals(""))
                    sqlstr +=" and market_id in ("+marketSelect+") ";

                // za katewgiruh
                if (jobCategoriesSelect!= null && !jobCategoriesSelect.equals(""))
                    sqlstr +=" and job_category_id in ("+jobCategoriesSelect+") ";

           /*     // za crewleader vo manager
                if (crewleader!= null && !crewleader.equals("")) ///
                    sqlstr +=" and id in (select distinct(job_id) from manager  where user_id  = "+crewleader+")";

                // za manager vo assigns
                if (manager!= null && !manager.equals("")) //
                    sqlstr +=" and id in (select distinct(jobid) from assigns where fieldmanagerid = "+manager+")";*/

                // za sutomer preku subdivision
                // ako ima izbrano subdivision (prvo se bira customer) togas odi po toj subdivision direktno
                if (subdivision!= null && !subdivision.equals(""))
                    sqlstr +=" and subdivision_id  = "+subdivision+" ";
                else
                    // ako nema subdivision direktno togas se biraat site subdivision od izbraniot customer
                    if (customer!= null && !customer.equals(""))
                        sqlstr +=" and subdivision_id in (select id from subdivision where customer_id = "+customer+")";

                /*if (M2xEB*2HHH
                )
                {*/
                    List<Task> tasks = new ArrayList<Task>();
                    tasks = Task.findWithinDates(d1, d2);

                    List<String> jsTmPs = new ArrayList<String>();
                    for (Task t : tasks)
                        jsTmPs.add(t.job.id.toString());

                    String finalstring = "";
                    //remove duplicates
                    List<String> strg =  new ArrayList(new HashSet(jsTmPs));
                    int i = 0;
                    for (String t : strg)
                    {
                        finalstring+= t;
                        if (i<strg.size()-1)
                            finalstring+=",";
                        i++;
                    }
                    if (!finalstring.equals(""))
                    {
                        sqlstr +=" and id in ("+finalstring+") ";
                    }
               // }
                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                List<SqlRow> list = sqlQuery.findList();
                for (SqlRow row : list)
                {
                    if(!verifiedSelect.equals(""))
                        if(verifiedSelect.equals("1"))
                        {
                            if(isJobVerified(row.getLong("id")))
                            {
                                listjobs.add(getOveralperJob(row.getLong("id")));
                            }
                        }
                        else
                        {
                            if(!isJobVerified(row.getLong("id")))
                            {
                                listjobs.add(getOveralperJob(row.getLong("id")));
                            }
                        }
                    else
                         listjobs.add(getOveralperJob(row.getLong("id")));
                }
            }

            if (listjobs!= null)
            {
                Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listjobs);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }
        }
        else {
            return forbidden();
        }
    }



    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok();
        } else {
            return TODO;
        }
    }




    public static Result index_item() {
        if (Secured.hasGuestAccess()) {
          //  Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.itemfront.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                  /*  User.find.all(),*/
                    User.find.where().lt("authority",2).findList(),
                    ItemType.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }


    public static Result purchase() {

        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.purchase.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all(),
                    Vendor.find.all(),
                    ItemType.find.all()
            ));
        } else {
            return forbidden();
        }
    }




    public static Result index_job() {
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.jobfront.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    ItemType.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }



    public static Result index_profit() {
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.profitfront.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    ItemType.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }




    public static Result new1front() {
        if (Secured.hasGuestAccess()) {

            return ok(views.html.reports.new1front.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }


    public static Result new2front() {
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.new2front.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }






    public static Result new6front() {
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.new6front.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }

    public static Result new3front() {
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.new3front.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }

    public static Result new4front() {
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);

            return ok(views.html.reports.new4front.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all(),
                    Vendor.find.all(),
                    ItemType.find.all()
            ));
        } else {
            return forbidden();
        }
    }


    public static Result new5front() {
        if (Secured.hasGuestAccess()) {

            return ok(views.html.reports.new5front.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    Customer.find.all(),
                    JobCategory.find.all()
            ));
        } else {
            return forbidden();
        }
    }


}
