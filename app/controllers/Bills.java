package controllers;

import com.avaje.ebean.*;
import models.*;
import models.User;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import quickbooks.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Queue;

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

public class Bills extends Controller {

    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result getBillView() {
        if (Secured.hasAdministratorAccess()) {
            List<Market> markets = Market.find.all();
       //     List<Vendor> vendors = Vendor.find.all();

            Date datenow = new Date();

            List<Vendor> vendors = Vendor.find.where().gt("insurance_date", datenow).eq("invoice", 1).findList();

            List<AccountType> acctype = AccountType.find.where().eq("active", 1).findList();
            return ok(views.html.bills.bills.render(
                    User.find.byId(Long.parseLong(request().username())),
                    markets,
                    vendors,
                    acctype
            ));
        } else {
            return forbidden();
        }
    }

    public static Result getBillbyID(Long id)
    {
        if (Secured.hasGuestAccess()) {
            Bill cust = Bill.find.byId(id);
            return ok(toJson(cust));
        } else {
            return forbidden();
        }
    }


    public static Result addBill() {
        if (Secured.hasManagerAccess()) {

            String marketid = form().bindFromRequest().get("marketid");
            String vendorid = form().bindFromRequest().get("vendorid");
            String  datebill = form().bindFromRequest().get("datebill");

            String  billnumber = form().bindFromRequest().get("billnumber");
            String  amount = form().bindFromRequest().get("amount");
            String  note = form().bindFromRequest().get("note");
            String jobid = form().bindFromRequest().get("jobid");

            String  duedate = form().bindFromRequest().get("duedate");
            String  incurreddate = form().bindFromRequest().get("incurreddate");
            String  termsfullname = form().bindFromRequest().get("termsfullname");
            String  accountfullname = form().bindFromRequest().get("accountfullname");
            String accountType = form().bindFromRequest().get("accountType");


            Date dateent = new Date();

       //      (String accountTypeid, String marketis, String vendorid, Double amount,String note, Date datebill) {
            Bill exp;
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            if(!datebill.equals(""))
            {
                 try {
                    if (datebill!=null) {
                        dateent = format.parse(datebill);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            Date datedueent = new Date();
            if(!duedate.equals(""))
            {
                try {
                    if (duedate!=null) {
                        datedueent = format.parse(duedate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }


            Date Incurreddate = new Date();
            if(!incurreddate.equals("")) {
                try {
                    if (incurreddate != null) {
                        Incurreddate = format.parse(incurreddate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            if (jobid == null)
                jobid = "";

            if (note == null)
                note = "";

            if ( marketid!=null&&!marketid.equals("")&& vendorid!=null&&!vendorid.equals("") && billnumber!=null&&!billnumber.equals("")) {
                 exp = Bill.addBill(marketid, vendorid, Double.parseDouble(amount), note, dateent, billnumber, jobid, datedueent,termsfullname, Long.parseLong(accountType), accountfullname, Incurreddate);
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


    public static Result Updatebill() {

        if (Secured.hasManagerAccess()) {



        //    expid=15&datebill=2016-04-30&incurreddate=2016-04-22&marketid=9&vendorid=117&jobid=54545&billnumber=3
          //          &amount=121&duedate=2016-04-22&termsfullname=Due+on+Date+Specified&accountfullname=sdafafasf&accountType
            //        =267&note=asdasd


            String idto = form().bindFromRequest().get("expid");
            Bill oldexp = Bill.find.byId(Long.parseLong(idto));

                String marketid = form().bindFromRequest().get("marketid");
                String vendorid = form().bindFromRequest().get("vendorid");
                String datebill = form().bindFromRequest().get("datebill");

                String  billnumber = form().bindFromRequest().get("billnumber");
                String  amount = form().bindFromRequest().get("amount");
                String  note = form().bindFromRequest().get("note");
               String jobid = form().bindFromRequest().get("jobid");

            String  duedate = form().bindFromRequest().get("duedate");
            String  termsfullname = form().bindFromRequest().get("termsfullname");
            String  accountfullname = form().bindFromRequest().get("accountfullname");
            String accountType = form().bindFromRequest().get("accountType");

            String  incurreddate = form().bindFromRequest().get("incurreddate");

            Date dateent = new Date();

                //      (String accountTypeid, String marketis, String vendorid, Double amount,String note, Date datebill) {
                Bill exp;

            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                if(!datebill.equals(""))
                {


                    try {
                        if (datebill!=null) {
                            dateent = format.parse(datebill);
                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }

            Date datedueent = new Date();
            if(!duedate.equals(""))
            {


                try {
                    if (duedate!=null) {
                        datedueent = format.parse(duedate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }


            Date Incurreddate = new Date();
            if(!incurreddate.equals("")) {
                try {
                    if (incurreddate != null) {
                        Incurreddate = format.parse(incurreddate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            if (jobid == null)
                jobid = "";

            if (note == null)
                note = "";

                // if ( marketid!=null&&!marketid.equals("")&& vendorid!=null&&!vendorid.equals("") && billnumber!=null&&!billnumber.equals("")) {
            if ( marketid!=null&&!marketid.equals("")&& vendorid!=null&&!vendorid.equals("") && billnumber!=null&&!billnumber.equals("")  ) {
                  // exp = Bill.addExpense( marketid, vendorid, Double.parseDouble(amount), note, dateent,billnumber);
                   // exp = Bill.addBill(marketid, vendorid, Double.parseDouble(amount), note, dateent, billnumber, jobid);
              //  exp = Bill.addBill(marketid, vendorid, Double.parseDouble(amount), note, dateent, billnumber, jobid, datedueent,termsfullname, Long.parseLong(accountType), accountfullname, Incurreddate);
                    oldexp.market = Market.find.byId(Long.parseLong(marketid));
                oldexp.vendor = Vendor.find.byId(Long.parseLong(vendorid));
                oldexp.amount = Double.parseDouble(amount);
                oldexp.note = note;
                oldexp.enterdate = dateent;
                oldexp.billnumber = billnumber;

                if (jobid!="")
                    oldexp.job_id = Long.parseLong(jobid);
                else
                    oldexp.job_id = null;
                oldexp.duedate = datedueent;
                oldexp.incurreddate = Incurreddate;
                oldexp.billdate = dateent;
                oldexp.termsfullname = termsfullname;

                // Long.parseLong(accountType), accountfullname, Incurreddate
                oldexp.accountType = AccountType.find.byId(Long.parseLong(accountType));

                oldexp.accountfullname = accountfullname;
                oldexp.incurreddate = Incurreddate;
                oldexp.save();

                return ok();

                /*
                    List<Market> markets = Market.find.all();
                    List<Vendor> vendors = Vendor.find.all();
                List<AccountType> acctype = AccountType.find.all();

                    return ok(views.html.bills.bills.render(
                            User.find.byId(Long.parseLong(request().username())),
                            markets,
                            vendors,
                            acctype
                    ));*/
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


    public static Result deletebill() {
        if (Secured.hasAdministratorAccess()) {
            Bill exp = Bill.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
                exp.delete();
          //  return redirect(routes.Home_rd.index());
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result checkBillnum() {
        if (Secured.hasManagerAccess()) {
            String billnum = form().bindFromRequest().get("billnumber");

            List<Bill> billwithnumber = Bill.find.where().eq("billnumber", billnum).findList();

            return ok(toJson(billwithnumber.size()));
        } else {
            return forbidden();
        }
    }




    public static Result billlist() {
        if (Secured.hasGuestAccess()) {

             List<Market> markets = Market.find.all();
            List<Vendor> vendors = Vendor.find.all();
            List<AccountType> acctype = AccountType.find.where().eq("active", 1).findList();

            return ok(views.html.bills.billlist.render(
                    User.find.byId(Long.parseLong(request().username())),
                    markets,
                    vendors,
                    acctype
            ));
        } else {
            return forbidden();
        }
    }



    public static Result editBillView(Long id) {
        if (Secured.hasAdministratorAccess()) {

        /*    String expid = form().bindFromRequest().get("exp_id");*/
            Bill ex = Bill.find.byId(id);
            List<Market> markets = Market.find.all();
            List<Vendor> vendors = Vendor.find.all();
            List<AccountType> acctype = AccountType.find.where().eq("active", 1).findList();

            return ok(views.html.bills.editbill.render(
                    User.find.byId(Long.parseLong(request().username())),
                    markets,
                    vendors,
                    ex,
                    acctype
            ));
        } else {
            return forbidden();
        }
    }



    public static Result listBills(){
        if (Secured.hasAdministratorAccess()) {
            // START
            String vendorid =  form().bindFromRequest().get("vendorid");
            String marketid =  form().bindFromRequest().get("marketid");
            String startdate =  form().bindFromRequest().get("startdate");
            String enddate =  form().bindFromRequest().get("enddate");
            String startenterdate =  form().bindFromRequest().get("startenterdate");
            String endenterdate =  form().bindFromRequest().get("endenterdate");

            String bybilldate =  form().bindFromRequest().get("bybilldate");
            String byenterdate =  form().bindFromRequest().get("byenterdate");

            List<Bill> lexp =  new ArrayList<Bill>();


            String sqlstr =    "SELECT `id` FROM bill WHERE 1 =1  ";

            // za market
            if (marketid!= null && !marketid.equals("") && !marketid.equals("0"))
            {
                sqlstr +=" and market_id ="+ marketid +" ";

            }
            if (vendorid!= null && !vendorid.equals(""))
            {
                sqlstr +=" and vendor_id  = "+vendorid+" ";
            }

            if (bybilldate.equals("true"))
                sqlstr+=" and billdate between '" + startdate + "' and '" + enddate + "'";

            if (byenterdate.equals("true"))
                sqlstr+=" and enterdate between '" + startenterdate + " 00:00:00' and '" + endenterdate + " 23:59:59'";
//between '2016-01-31 00:00:00' and '2016-01-31 23:59:59'

            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();

            for (SqlRow row : list)
                lexp.add(Bill.find.byId(row.getLong("id")));

            Map<String, Object> mapObject = new HashMap<String, Object>();
            List<Map> listexpenses = new ArrayList<Map>();

            for(Bill e : lexp)
            {
                Map<String, Object> mapObj = new HashMap<String, Object>();

                mapObj.put("0",   "<a href=\"#\" class=\"clicka\">" + e.id.toString()  + "</a>");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.billdate);



                mapObj.put("1",   "<a href=\"#\" class=\"clickdel\" value = '"+e.id.toString()+"'>x</a>");

                mapObj.put("2", formattedDate);


                mapObj.put("3", e.billnumber);

                if (e.market!=null)
                    mapObj.put("4", e.market.city + " " + e.market.state);
                else
                    mapObj.put("4", "");

                if (e.vendor!=null)
                    mapObj.put("5", e.vendor.name);
                else
                    mapObj.put("5", "");

                mapObj.put("6", e.amount);
                mapObj.put("7", e.job_id);




                String formatteddueDate = sdf.format(e.duedate);
                mapObj.put("8", formatteddueDate);

                String formattedIncurredDate = sdf.format(e.incurreddate);
                mapObj.put("9", formattedIncurredDate);

                String formattedEnteredDate = sdf.format(e.enterdate);
                mapObj.put("10", formattedEnteredDate);

                mapObj.put("11", e.termsfullname);
                mapObj.put("12", e.accountfullname);

                if (e.accountType !=null)
                    mapObj.put("13", e.accountType.account);
                else
                    mapObj.put("13", "");

                mapObj.put("14", e.note);



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


    public static Result selectBills(){
        if (Secured.hasAdministratorAccess()) {
          // START
            String vendorid =  form().bindFromRequest().get("vendorid");
            String marketid =  form().bindFromRequest().get("marketid");
            String datebill =  form().bindFromRequest().get("datebill");


            List<Bill> lexp =  new ArrayList<Bill>();

          /*  <th>id#</th>
            <th>Bill date (effective)</th>
            <th>Bill number</th>
            <th>Market</th>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Job number</th>
            <th>Due date</th>
            <th>Incurred date</th>
            <th>Enter date</th>
            <th>Terms full name</th>
            <th>Account full name</th>
            <th>Class code</th>
            <th>Note</th>*/

          /* if (vendorid != null && !vendorid.equals("") && marketid != null && !marketid.equals(""))
                lexp = Bill.find.where().eq("vendor_id", vendorid).eq("market_id", marketid).eq("billdate", datebill).findList();
           else*/
                lexp = Bill.find.where().eq("billdate", datebill).findList();

            Map<String, Object> mapObject = new HashMap<String, Object>();

            List<Map> listexpenses = new ArrayList<Map>();

            for(Bill e : lexp)
            {
                Map<String, Object> mapObj = new HashMap<String, Object>();

                mapObj.put("0",   "<a href=\"#\" class=\"clicka\">" + e.id.toString()  + "</a>");
                 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.billdate);
                mapObj.put("1", formattedDate);
                mapObj.put("2", e.billnumber);

                if (e.market !=null)
                    mapObj.put("3", e.market.city + " " + e.market.state);
                else
                    mapObj.put("3", "");

                if (e.vendor !=null)
                    mapObj.put("4", e.vendor.name);
                else
                    mapObj.put("4", "");

                mapObj.put("5", e.amount);
                mapObj.put("6", e.job_id);


                String formatteddueDate = sdf.format(e.duedate);
                mapObj.put("7", formatteddueDate);

                String formattedIncurredDate = sdf.format(e.incurreddate);
                mapObj.put("8", formattedIncurredDate);

                String formattedEnteredDate = sdf.format(e.enterdate);
                mapObj.put("9", formattedEnteredDate);

                mapObj.put("10", e.termsfullname);
                mapObj.put("11", e.accountfullname);

                if (e.accountType !=null)
                    mapObj.put("12", e.accountType.account);
                else
                    mapObj.put("12", "");

                mapObj.put("13", e.note);




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

        } else {
            return forbidden();
        }

    }


    public static boolean isNumeric(String str)
    {
        try
        {
            double d = Double.parseDouble(str);
        }
        catch(NumberFormatException nfe)
        {
            return false;
        }
        return true;
    }

    public static Result billQBexcelExport( ) {
        ArrayList headers = new ArrayList();



        headers.add("Bill Date effective"); // 0
        headers.add("Bill number"); // 1
        headers.add("Market"); // 2
        headers.add("Vendor"); // 3
        headers.add("Amount");  // 4
        headers.add("Job"); //5

        headers.add("Due date"); //6
        headers.add("Incurred date"); //7
        headers.add("Enter date"); //8
        headers.add("Terms fullname"); // 9
        headers.add("Account fullname"); //10
        headers.add("Class code"); // 11

        headers.add("Note"); // 12



        String vendorid =  form().bindFromRequest().get("vendorid");
        String marketid =  form().bindFromRequest().get("marketid");
        String startdate =  form().bindFromRequest().get("startdate");
        String enddate =  form().bindFromRequest().get("enddate");


        String startenterdate =  form().bindFromRequest().get("startenterdate");
        String endenterdate =  form().bindFromRequest().get("endenterdate");


        String bybilldate =  form().bindFromRequest().get("bybilldate");
        String byenterdate =  form().bindFromRequest().get("byenterdate");






        File file;
        try {
            file = new File("Bill_QB.xlsx");

            FileOutputStream fileOut = new FileOutputStream(file);
            XSSFWorkbook wb = new XSSFWorkbook();
            Sheet sheet = wb.createSheet("Bills");

            Row rowx = sheet.createRow(0);
            for (int m =0; m<headers.size();m++){
                Cell cell = rowx.createCell(m);
                cell.setCellValue(String.valueOf(headers.get(m)));
            }

            List<Bill> bills= new ArrayList<Bill>();


            String sqlstr =    "SELECT `id` FROM bill WHERE 1 =1  ";

            // za market
            if (marketid!= null && !marketid.equals("") && !marketid.equals("0"))
            {
                sqlstr +=" and market_id ="+ marketid +" ";

            }
            if (vendorid!= null && !vendorid.equals(""))
            {
                sqlstr +=" and vendor_id  = "+vendorid+" ";
            }

            if (bybilldate.equals("true"))
                sqlstr+=" and billdate between '" + startdate + "' and '" + enddate + "'";

            if (byenterdate.equals("true"))
                sqlstr+=" and enterdate between '" + startenterdate + " 00:00:00' and '" + endenterdate + " 23:59:59'";
//between '2016-01-31 00:00:00' and '2016-01-31 23:59:59'



            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();

            for (SqlRow row : list)
                bills.add(Bill.find.byId(row.getLong("id")));

            Map<String, Object> mapObject = new HashMap<String, Object>();
            List<Map> listexpenses = new ArrayList<Map>();


            for (int i =0; i<bills.size() ;i++){
                Row row = sheet.createRow(i + 1);

                Cell cell0 = row.createCell(0);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(bills.get(i).billdate);
                cell0.setCellValue(formattedDate);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(bills.get(i).billnumber);

                Cell cell2 = row.createCell(2);
                if (bills.get(i).market!=null)
                    cell2.setCellValue(bills.get(i).market.city + ", " + bills.get(i).market.state);
                else
                    cell2.setCellValue("");
// od tuka

                if (bills.get(i).vendor.name != null && bills.get(i).vendor.name != "") {
                    // dali e company ili labor
                    String[] names = bills.get(i).vendor.name.split(" ");
                    if (names.length > 0) {
                        Cell cell3 = row.createCell(3);
                        // ako prviot e pogolem od 1000 e company
                        if (isNumeric(names[0]))
                            cell3.setCellValue(bills.get(i).vendor.name.replace(names[0] + " ", ""));
                        else
                            cell3.setCellValue(bills.get(i).vendor.name);
                        // ako ne e labor
                    } else {
                        Cell cell3 = row.createCell(3);
                        cell3.setCellValue(bills.get(i).vendor.name);
                        // ako nema poveke slogovi vo imeto polnam prazni za prefix num, first last
                    }
                }
                else
                {
                    Cell cell3 = row.createCell(3);
                    cell3.setCellValue("");
                }
  // do tuka

                 /*   Cell cell3 = row.createCell(3);
                if (bills.get(i).vendor!=null)
                    cell3.setCellValue(bills.get(i).vendor.name);
                else
                    cell3.setCellValue("NA");*/


                    Cell cell4 = row.createCell(4);
                    cell4.setCellValue(bills.get(i).amount);


                    Cell cell5 = row.createCell(5);
                if (bills.get(i).job_id!=null)
                    cell5.setCellValue(bills.get(i).job_id);
                else
                    cell5.setCellValue("");


                Cell cell6 = row.createCell(6);
                String formatteddueDate = sdf.format(bills.get(i).duedate);
                cell6.setCellValue(formatteddueDate);


                Cell cell7 = row.createCell(7);
                String formattedincurredDate = sdf.format(bills.get(i).incurreddate);
                cell7.setCellValue(formattedincurredDate);


                Cell cell8 = row.createCell(8);
                String formattedenterDate = sdf.format(bills.get(i).enterdate);
                cell8.setCellValue(formattedenterDate);

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(bills.get(i).termsfullname);
                Cell cell10 = row.createCell(10);
                cell10.setCellValue(bills.get(i).accountfullname);

                Cell cell11 = row.createCell(11);
                if (bills.get(i).accountType!=null)
                    cell11.setCellValue(bills.get(i).accountType.account);
                else
                    cell11.setCellValue("");



                    Cell cell12 = row.createCell(12);
                    cell12.setCellValue(bills.get(i).note);

                }

            wb.write(fileOut);
            fileOut.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        response().setContentType("application/x-download");
        response().setHeader("Content-disposition","attachment; filename=Bill_QB.xlsx");
        return ok(new File("Bill_QB.xlsx"));

    }


    // account_type manage


    public static Result listaccounttypes() {
        if (Secured.hasAdministratorAccess()) {
            List<AccountType> listacounttypes = AccountType.find.all();
            return ok(
                    views.html.account_types.accounttypeslist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            listacounttypes
                    )
            );
        } else {
            return forbidden();
        }
    }





    public static Result updateaccounttypeActive(){

        if (Secured.hasGuestAccess()) {
            String acctypeid = form().bindFromRequest().get("accounttypeid");
            String active = form().bindFromRequest().get("active");

            // zemi array od ajax
            if (acctypeid != null && acctypeid != "")
            {
                AccountType p = AccountType.find.byId(Long.parseLong(acctypeid));
                if (p!=null){
                    if (active.equals("true"))
                        p.active = 1;
                    else
                        p.active = 0;
                    p.update();
                }
                return ok();
            }
            else
                return forbidden();
        } else {
            return forbidden();
        }
    }



    public static Result updateaccountType() {
            if (Secured.hasManagerAccess()) {

                String id = form().bindFromRequest().get("id");
                String s = form().bindFromRequest().get("name");
                String t = form().bindFromRequest().get("type");


                AccountType at = AccountType.find.byId(Long.parseLong(id));
                //  vendorItem.item = Item.find.byId(Long.parseLong(s));
                at.account = s;
                at.tpe = t;

                at.update();

                return ok(toJson(at));

            } else {
                return forbidden();
            }
        }




}
