package controllers;

import com.intuit.sb.cdm.Vendors;
import models.*;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


import static play.data.Form.form;
import static play.libs.Json.toJson;





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

public class Expenses extends Controller {

    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok();
        } else {
            return forbidden();
        }
    }

        public static Result getExpensesView() {
        if (Secured.hasAdministratorAccess()) {

            List<AccountType> acctype = AccountType.find.all();
            List<Market> markets = Market.find.all();
            List<Vendor> vendors = Vendor.find.all();

            return ok(views.html.expenses.expenses.render(
                    User.find.byId(Long.parseLong(request().username())),
                    markets,
                    acctype,
                    vendors
            ));
        } else {
            return forbidden();
        }
    }



    public static Result expenseslist() {
        if (Secured.hasGuestAccess()) {

            List<AccountType> acctype = AccountType.find.all();
            List<Market> markets = Market.find.all();
            List<Vendor> vendors = Vendor.find.all();


            return ok(views.html.expenses.expenseslist.render(
                    User.find.byId(Long.parseLong(request().username())),
                    markets,
                    acctype,
                    vendors
            ));
        } else {
            return forbidden();
        }
    }


    public static Result editExpensesView(Long id) {
        if (Secured.hasAdministratorAccess()) {

        /*    String expid = form().bindFromRequest().get("exp_id");*/
            Expense ex = Expense.find.byId(id);

            List<AccountType> acctype = AccountType.find.all();
            List<Market> markets = Market.find.all();
            List<Vendor> vendors = Vendor.find.all();

            return ok(views.html.expenses.editexpenses.render(
                    User.find.byId(Long.parseLong(request().username())),
                    markets,
                    acctype,
                    vendors,
                    ex
            ));
        } else {
            return forbidden();
        }
    }


    public static Result addExpence() {
        if (Secured.hasManagerAccess()) {
            String accountTypeid = form().bindFromRequest().get("accountTypeid");
            String marketid = form().bindFromRequest().get("marketid");
            String vendorid = form().bindFromRequest().get("vendorid");
            String  datebill = form().bindFromRequest().get("datebill");
            String discountdate = form().bindFromRequest().get("discountdate");
            String  qbdatebill = form().bindFromRequest().get("qbdatebill");
            String  billnumber = form().bindFromRequest().get("billnumber");
            String  amount = form().bindFromRequest().get("amount");
            String  note = form().bindFromRequest().get("note");
            Date dateent = new Date();

       //      (String accountTypeid, String marketis, String vendorid, Double amount,String note, Date datebill) {
            Expense exp;

            if(!datebill.equals(""))
            {
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                try {
                    if (datebill!=null) {
                        dateent = format.parse(datebill);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            Date qbdateent = new Date();
            if(!qbdatebill.equals(""))
            {
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                try {
                    if (qbdatebill!=null) {
                        qbdateent = format.parse(qbdatebill);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            Date dicsdate = new Date();
            if(!discountdate.equals(""))
            {
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                try {
                    if (discountdate!=null) {
                        dicsdate = format.parse(discountdate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            if (note == null)
                note = "";

            if (accountTypeid!=null&&!accountTypeid.equals("") && marketid!=null&&!marketid.equals("")&& vendorid!=null&&!vendorid.equals("") && billnumber!=null&&!billnumber.equals("")) {
                 exp = Expense.addExpense(accountTypeid, marketid, vendorid, Double.parseDouble(amount), note, dateent, qbdateent, dicsdate, billnumber);
                    return ok(toJson(exp));
            }
             else
            {
                   return null;
            }
        }
        else{
            return forbidden();
        }
    }



    public static Result UpdateExpence() {
        if (Secured.hasManagerAccess()) {

            String idto = form().bindFromRequest().get("expid");
            Expense oldexp = Expense.find.byId(Long.parseLong(idto));

                String accountTypeid = form().bindFromRequest().get("accountTypeid");
                String marketid = form().bindFromRequest().get("marketid");
                String vendorid = form().bindFromRequest().get("vendorid");
                String  datebill = form().bindFromRequest().get("datebill");
                String discountdate = form().bindFromRequest().get("discountdate");
                String  qbdatebill = form().bindFromRequest().get("qbdatebill");
                String  billnumber = form().bindFromRequest().get("billnumber");
                String  amount = form().bindFromRequest().get("amount");
                String  note = form().bindFromRequest().get("note");
                Date dateent = new Date();

                //      (String accountTypeid, String marketis, String vendorid, Double amount,String note, Date datebill) {
                Expense exp;

                if(!datebill.equals(""))
                {
                    DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                    try {
                        if (datebill!=null) {
                            dateent = format.parse(datebill);
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }

                Date qbdateent = new Date();
                if(!qbdatebill.equals(""))
                {
                    DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                    try {
                        if (qbdatebill!=null) {
                            qbdateent = format.parse(qbdatebill);
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }

            Date dicsdate = new Date();
            if(!discountdate.equals(""))
            {
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                try {
                    if (discountdate!=null) {
                        dicsdate = format.parse(discountdate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

                if (note == null)
                    note = "";

                if (accountTypeid!=null&&!accountTypeid.equals("") && marketid!=null&&!marketid.equals("")&& vendorid!=null&&!vendorid.equals("") && billnumber!=null&&!billnumber.equals("")) {
                    exp = Expense.addExpense(accountTypeid, marketid, vendorid, Double.parseDouble(amount), note, dateent, qbdateent,dicsdate, billnumber);
                    oldexp.delete();

                    List<AccountType> acctype = AccountType.find.all();
                    List<Market> markets = Market.find.all();
                    List<Vendor> vendors = Vendor.find.all();

                    return ok(views.html.expenses.expenses.render(
                            User.find.byId(Long.parseLong(request().username())),
                            markets,
                            acctype,
                            vendors
                    ));
                }
                else
                {
                    return null;
                }
            }
        
        else{
            return forbidden();
        }
    }

    public static Result deleteExpence() {
        if (Secured.hasAdministratorAccess()) {
            Expense exp = Expense.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
                exp.delete();
          //  return redirect(routes.Home_rd.index());
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result  listExpenses(){
        if (Secured.hasAdministratorAccess()) {
            // START
            String vendorid =  form().bindFromRequest().get("vendorid");
            String marketid =  form().bindFromRequest().get("marketid");
            String accountTypeid =  form().bindFromRequest().get("accountTypeid");
            String startdate =  form().bindFromRequest().get("startdate");
            String enddate =  form().bindFromRequest().get("enddate");


            List<Expense> lexp =  new ArrayList<Expense>();


            String sqlstr =    "SELECT `id` FROM expense WHERE 1 =1  ";

            // za market
            if (marketid!= null && !marketid.equals(""))
            {
                sqlstr +=" and market_id ="+ marketid +" ";

            }
            if (vendorid!= null && !vendorid.equals(""))
            {
                sqlstr +=" and vendor_id  = "+vendorid+" ";
            }
            if (accountTypeid!= null && !accountTypeid.equals(""))
            {
                sqlstr +=" and account_type_id  = "+accountTypeid+" ";
            }

            sqlstr+=" and billdate between '" + startdate + "' and '" + enddate + "'";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();

            for (SqlRow row : list)
                lexp.add(Expense.find.byId(row.getLong("id")));

            Map<String, Object> mapObject = new HashMap<String, Object>();
            List<Map> listexpenses = new ArrayList<Map>();

            for(Expense e : lexp)
            {
                Map<String, Object> mapObj = new HashMap<String, Object>();
                mapObj.put("0",   "<a href=\"#\" class=\"clicka\">" + e.id.toString()  + "</a>");
                mapObj.put("1", e.vendor.name);
                mapObj.put("2", e.market.city + " " + e.market.state);
                mapObj.put("3", e.amount);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.billdate);
                mapObj.put("4", formattedDate);

                String discountDate = sdf.format(e.discountdate);
                mapObj.put("5", discountDate);

                String qbbilldate = sdf.format(e.qbbilldate);
                mapObj.put("6", qbbilldate);

                mapObj.put("7", e.accountType.account);
                mapObj.put("8", e.note);
                listexpenses.add(mapObj);
            }

            if (listexpenses!= null)
            {
                //Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listexpenses);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }

            // END
        } else {
            return forbidden();
        }

    }




    public static Result  selectExpenses(){
        if (Secured.hasAdministratorAccess()) {
          // START
            String vendorid =  form().bindFromRequest().get("vendorid");
            String marketid =  form().bindFromRequest().get("marketid");
            String accountTypeid =  form().bindFromRequest().get("accountTypeid");
            String datebill =  form().bindFromRequest().get("datebill");


            List<Expense> lexp =  new ArrayList<Expense>();

            if (vendorid != null && !vendorid.equals("") && marketid != null && !marketid.equals(""))
                lexp = Expense.find.where().eq("vendor_id", vendorid).eq("market_id", marketid).eq("billdate", datebill).findList();
           else
               lexp = Expense.find.where().eq("billdate", datebill).findList();

            Map<String, Object> mapObject = new HashMap<String, Object>();

            List<Map> listexpenses = new ArrayList<Map>();

            for(Expense e : lexp)
            {
                Map<String, Object> mapObj = new HashMap<String, Object>();
               /* mapObj.put("0", e.id.toString());
                mapObj.put("1", e.vendor.name);
                mapObj.put("2", e.market.city + " " + e.market.state);
                mapObj.put("3", e.amount);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.billdate);
                mapObj.put("4", formattedDate);

                // mapObj.put("4", e.billdate);
                mapObj.put("5", e.accountType.account);
                mapObj.put("6", e.note);*/
                mapObj.put("0",   "<a href=\"#\" class=\"clicka\">" + e.id.toString()  + "</a>");
                mapObj.put("1", e.vendor.name);
                mapObj.put("2", e.market.city + " " + e.market.state);
                mapObj.put("3", e.amount);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.billdate);
                mapObj.put("4", formattedDate);

                String discountDate = sdf.format(e.discountdate);
                mapObj.put("5", discountDate);

                String qbbilldate = sdf.format(e.qbbilldate);
                mapObj.put("6", qbbilldate);

                mapObj.put("7", e.accountType.account);
                mapObj.put("8", e.note);
                listexpenses.add(mapObj);
            }

            if (listexpenses!= null)
            {
                //Map<String, Object> mapObject = new HashMap<String, Object>();
                mapObject.put("data",  listexpenses);
                return ok(toJson(mapObject));
            }
            else {
                return ok();
            }

            // END
        } else {
            return forbidden();
        }

    }


}
