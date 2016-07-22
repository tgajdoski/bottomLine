package controllers;

import com.avaje.ebean.*;
import models.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import util.pdf.PDF;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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

public class Labors extends Controller {

    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok();
        } else {
            return forbidden();
        }
    }




    public static Result listperiodLabors(){
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
                lexp.add(Labor.find.byId(row.getLong("id")));

            Map<String, Object> mapObject = new HashMap<String, Object>();
            List<Map> listexpenses = new ArrayList<Map>();

            for(Labor e : lexp)
            {
                Map<String, Object> mapObj = new HashMap<String, Object>();

               // mapObj.put("0",   "<a href=\"#\" class=\"clicka\">" + e.id.toString()  + "</a>");
                mapObj.put("0",   "<a href=\"#\" class=\"clicka\" data-id=" + e.id.toString() + ">x</a>");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.labordate);
                mapObj.put("1", formattedDate);


                if (e.market!=null)
                    mapObj.put("2", e.market.city + " " + e.market.state);
                else
                    mapObj.put("2", "");

                if (e.vendor!=null)
                    mapObj.put("3", e.vendor.name);
                else
                    mapObj.put("3", "");

                mapObj.put("4", e.vendor.id);
                mapObj.put("5", e.amounthours);

                mapObj.put("6",  Math.round( e.payrate * e.amounthours * 100.0) / 100.0);


                String formattedBillDate = "NA";
                if (e.billdate!=null)
                    formattedBillDate = sdf.format(e.billdate);

                mapObj.put("7", formattedBillDate);
                mapObj.put("8", e.note );

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




    public static Result listLabors(){
        if (Secured.hasAdministratorAccess()) {
            // START
            String vendorid =  form().bindFromRequest().get("vendorid");
            String marketid =  form().bindFromRequest().get("marketid");
       //     String startdate =  form().bindFromRequest().get("startdate");
        //    String enddate =  form().bindFromRequest().get("enddate");

            String date =  form().bindFromRequest().get("date");


            Date startdate = new Date();
            Date enddate = new Date();

            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            if(!date.equals(""))
            {
                try {
                    if (date!=null) {
                        startdate = format.parse(date);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
            enddate =  addDays(startdate, 7);

            SimpleDateFormat ft =  new SimpleDateFormat ("yyyy-MM-dd");

            String stdate = ft.format(startdate);

            String etdate = ft.format(enddate);

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


                sqlstr+=" and labordate between '" + stdate + "' and '" + etdate + "'";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();

            for (SqlRow row : list)
                lexp.add(Labor.find.byId(row.getLong("id")));

            Map<String, Object> mapObject = new HashMap<String, Object>();
            List<Map> listexpenses = new ArrayList<Map>();

            for(Labor e : lexp)
            {
                Map<String, Object> mapObj = new HashMap<String, Object>();

                mapObj.put("0",   "<a href=\"#\" class=\"clicka\" data-id=" + e.id.toString() + ">x</a>");
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(e.labordate);
                mapObj.put("1", formattedDate);


                if (e.market!=null)
                    mapObj.put("2", e.market.city + " " + e.market.state);
                else
                    mapObj.put("2", "");

                if (e.vendor!=null)
                    mapObj.put("3", e.vendor.name);
                else
                    mapObj.put("3", "");

                mapObj.put("4", e.vendor.id);
                mapObj.put("5", e.amounthours);

                mapObj.put("6",  Math.round( e.payrate * e.amounthours * 100.0) / 100.0);


                String formattedBillDate = sdf.format(e.billdate);
                mapObj.put("7", formattedBillDate);
                mapObj.put("8", e.note );

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


/*


    public static Result deleteLabor() {
        if (Secured.hasManagerAccess()) {

            String laborid =  form().bindFromRequest().get("id");

                for (SqlRow row : list)
                    lexp.add(Labor.find.byId(Long.parseLong(laborid)));

                for(Labor e : lexp)
                    e.delete();
                    return ok();


        }
        else{
            return forbidden();
        }
    }
*/



    public static Result addLabor() {
        if (Secured.hasManagerAccess()) {

            String marketid = form().bindFromRequest().get("marketid");
            String vendorid = form().bindFromRequest().get("vendorid");
            String billdate = form().bindFromRequest().get("billdate");
            String datelabor = form().bindFromRequest().get("datelabor");
            String amounthours = form().bindFromRequest().get("amounthours");
            String payrate = form().bindFromRequest().get("payrate");
            String note = form().bindFromRequest().get("note");


            Date labordate = new Date();

            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

            if(!datelabor.equals(""))
            {
                try {
                    if (datelabor!=null) {
                        labordate = format.parse(datelabor);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }


            Date billDdate = new Date();
            if(!datelabor.equals(""))
            {
                try {
                    if (billdate!=null) {
                        billDdate = format.parse(billdate);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }

            Labor lab;




            if ( marketid!=null&&!marketid.equals("")&& vendorid!=null&&!vendorid.equals("") && labordate!=null&&!labordate.equals("")  && amounthours!=null&&!amounthours.equals("") && payrate!=null&&!payrate.equals("")  && billDdate!=null&&!billDdate.equals("")  ) {

              //  String sqlstr ="delete from labor where labordate = '" + labordate + "' and market_id = " + marketid + " and vendor_id = "+vendorid;



            /*    String sqlstr =  "SELECT `id` FROM labor WHERE 1 =1  and market_id ="+ marketid +" and vendor_id  = "+vendorid+"  and labordate = '" + datelabor +"'";
                SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
                List<SqlRow> list = sqlQuery.findList();

                List<Labor> lexp =  new ArrayList<Labor>();

                for (SqlRow row : list)
                    lexp.add(Labor.find.byId(row.getLong("id")));

                for(Labor e : lexp)
                    e.delete();*/


                if (Double.parseDouble(amounthours)>0) {
                    lab = Labor.addLabor(marketid, vendorid, labordate,billDdate, Double.parseDouble(amounthours), Double.parseDouble(payrate), note);
                    return ok(toJson(lab));
                }
                else
                    return ok();

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



    public static Result deleteLabor() {
        if (Secured.hasAdministratorAccess()) {
            Labor lab = Labor.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            lab.delete();
          //  return redirect(routes.Home_rd.index());
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result getTableWeekLabor() {
        if (Secured.hasGuestAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String vendor = request().getQueryString("vendor");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.add(java.util.Calendar.DATE,2-cal.get(java.util.Calendar.DAY_OF_WEEK));
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            cal.add(java.util.Calendar.DATE,5);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);


            // show labors
            List<Labor> labors = new ArrayList<Labor>();
            if (market!=null && !market.equals("")) {
                if (vendor!=null && !vendor.equals("")) {
                    labors = Labor.findWithinDatesForMarketandVendor(d1, d2, market, vendor);
                }
                else
                {
                    labors = Labor.findWithinDatesForMarket(d1,d2,market);
                }
            }
            else {
                if (vendor!=null && !vendor.equals("")) {
                    labors = Labor.findWithinDatesForVendor(d1, d2, vendor);
                }
                else
                {
                    labors = Labor.findWithinDates(d1,d2);
                    //  labors =  Labor.find.all();
                }
            }
            // labvendors da se najdat distinct vendori od labors
            List<Vendor> labvendors = new ArrayList<Vendor>();
            for (Labor l: labors) {
                if(l.vendor!=null && !labvendors.contains(l.vendor))
                    labvendors.add(l.vendor);
            }



            return ok(
                    views.html.labor.tablelabor.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            Vendor.find.all(),
                            d1,
                            labors,
                            labvendors,
                            market,
                            vendor
                    )
            );
        } else {
            return forbidden();
        }
    }






    public static Result getVendorHourrate() {
        if (Secured.hasGuestAccess()) {

            String vendor = request().getQueryString("vendor");

            String vendorhours = "";
            if (vendor!=null &&  !vendor.isEmpty())
            {
                Vendor v = Vendor.find.byId(Long.parseLong(vendor));
                for (VendorItem vi : v.vendorItems) {
                    if(vi.item!=null &&  vi.item.id==106)
                        vendorhours = vi.default_rate.toString();
                }
            }
            return ok(vendorhours);

        } else {
            return forbidden();
        }
    }


    public static Result getWeekLabor() {
        if (Secured.hasGuestAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String vendor = request().getQueryString("vendor");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.add(java.util.Calendar.DATE,2-cal.get(java.util.Calendar.DAY_OF_WEEK));
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            cal.add(java.util.Calendar.DATE,5);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);


            // show labors
            List<Labor> labors = new ArrayList<Labor>();
            if (market!=null && !market.equals("")) {
                if (vendor!=null && !vendor.equals("")) {
                    labors = Labor.findWithinDatesForMarketandVendor(d1, d2, market, vendor);
                }
                else
                {
                    labors = Labor.findWithinDatesForMarket(d1,d2,market);
                }
            }
            else {
                if (vendor!=null && !vendor.equals("")) {
                    labors = Labor.findWithinDatesForVendor(d1, d2, vendor);
                }
                else
                {
                    labors = Labor.findWithinDates(d1,d2);
                    //  labors =  Labor.find.all();
                }
            }
            // labvendors da se najdat distinct vendori od labors
            List<Vendor> labvendors = new ArrayList<Vendor>();
            for (Labor l: labors) {
                if(l.vendor!=null && !labvendors.contains(l.vendor))
                    labvendors.add(l.vendor);
            }


            List<Vendor> vendors = new ArrayList<Vendor>();


            if(market!=null &&  !market.isEmpty())
            {
                vendors =Vendor.find.where().eq("market.id", Long.parseLong(market)).findList();
                     //  eq("market_id",Long.parseLong(market));
            }
            else
                vendors =Vendor.find.all();


            String vendorhours = "";
            if (vendor!=null && !vendor.isEmpty())
            {
                Vendor v = Vendor.find.byId(Long.parseLong(vendor));
                for (VendorItem vi : v.vendorItems) {
                    if(vi.item!=null &&  vi.item.id==106)
                        vendorhours = vi.default_rate.toString();
                }
            }


            return ok(
                    views.html.labor.addlabor.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            vendors,
                            d1,
                            labors,
                            labvendors,
                            market,
                            vendor,
                            vendorhours
                    )
            );
        } else {
            return forbidden();
        }
    }


    public static Result getLaborperiod()
    {
   return ok(
                views.html.labor.laborlist.render(
                        User.find.byId(Long.parseLong(request().username())),
                        Market.find.all(),
                        Vendor.find.all()
                )
        );
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



    public static Result laborQBexcelExport( ) {
        ArrayList headers = new ArrayList();



        headers.add("Reference Number"); // 0
        headers.add("Account"); // 1
        headers.add("Market"); // 1
        headers.add("Vendor_id"); // 2
        headers.add("Vendor"); // 3
        headers.add("Hours");  // 4
        headers.add("Payrate"); //5
        headers.add("Total"); //5
        headers.add("Bill date"); //5
        headers.add("Note"); // 6


        String vendorid =  form().bindFromRequest().get("vendorid");
        String marketid =  form().bindFromRequest().get("marketid");
        String startdate =  form().bindFromRequest().get("startdate");
        String enddate =  form().bindFromRequest().get("enddate");

        File file;
        try {
            file = new File("Labor_QB.xlsx");

            FileOutputStream fileOut = new FileOutputStream(file);
            XSSFWorkbook wb = new XSSFWorkbook();
            Sheet sheet = wb.createSheet("Bills");

            Row rowx = sheet.createRow(0);
            for (int m =0; m<headers.size();m++){
                Cell cell = rowx.createCell(m);
                cell.setCellValue(String.valueOf(headers.get(m)));
            }

            List<Labor> labors= new ArrayList<Labor>();





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
                labors.add(Labor.find.byId(row.getLong("id")));

            Map<String, Object> mapObject = new HashMap<String, Object>();
            List<Map> listlabors = new ArrayList<Map>();


            for (int i =0; i<labors.size() ;i++){
                Row row = sheet.createRow(i + 1);

                Cell cell0 = row.createCell(0);

                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = sdf.format(labors.get(i).labordate);

                String fomrattedDateNoLine = formattedDate.replace("-", "");
                cell0.setCellValue(fomrattedDateNoLine);


                // da se otvori nova kolona so account
                Cell cell1 = row.createCell(1);
                Labor l = (Labor) labors.get(i);
                if (l!= null && l.vendor!=null && l.vendor.expense_account != null && !l.vendor.expense_account.equals("") )
                {
                    AccountType ac = AccountType.find.byId(Long.parseLong(l.vendor.expense_account));
                    cell1.setCellValue(ac.account);
                }
                else
                    cell1.setCellValue("");

                // do tuka
                Cell cell2 = row.createCell(2);
                if (labors.get(i).market!=null)
                    cell2.setCellValue(labors.get(i).market.city + ", " + labors.get(i).market.state);
                else
                    cell2.setCellValue("NA");
// od tuka



                Cell cell3 = row.createCell(3);
                if (labors.get(i).vendor != null)
                    cell3.setCellValue(labors.get(i).vendor.id);
                else
                    cell3.setCellValue("NA");



                if (labors.get(i).vendor.name != null && labors.get(i).vendor.name != "") {
                    // dali e company ili labor
                    String[] names = labors.get(i).vendor.name.split(" ");
                    if (names.length > 0) {
                        Cell cell4 = row.createCell(4);
                        // ako prviot e pogolem od 1000 e company
                        if (isNumeric(names[0]))
                            cell4.setCellValue(labors.get(i).vendor.name.replace(names[0] + " ", ""));
                        else
                            cell4.setCellValue(labors.get(i).vendor.name);
                        // ako ne e labor
                    } else {
                        Cell cell4 = row.createCell(4);
                        cell3.setCellValue(labors.get(i).vendor.name);
                        // ako nema poveke slogovi vo imeto polnam prazni za prefix num, first last
                    }
                }
                else
                {
                    Cell cell4 = row.createCell(4);
                    cell4.setCellValue("NA");
                }
                // do tuka

                 /*   Cell cell3 = row.createCell(3);
                if (bills.get(i).vendor!=null)
                    cell3.setCellValue(bills.get(i).vendor.name);
                else
                    cell3.setCellValue("NA");*/

                Cell cell5 = row.createCell(5);
                cell5.setCellValue(labors.get(i).amounthours);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(labors.get(i).payrate);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(labors.get(i).amounthours *labors.get(i).payrate );

                Cell cell8 = row.createCell(8);

                String formattedbillDate = "NA";
                if (labors.get(i).billdate!=null)
                    formattedbillDate = sdf.format(labors.get(i).billdate);
                cell8.setCellValue(formattedbillDate);


                Cell cell9 = row.createCell(9);
                cell9.setCellValue(labors.get(i).note);
            }

            wb.write(fileOut);
            fileOut.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        response().setContentType("application/x-download");
        response().setHeader("Content-disposition","attachment; filename=Labor_QB.xlsx");
        return ok(new File("Labor_QB.xlsx"));

    }




    public static Result printWeekLabor() {
        if (Secured.hasGuestAccess()) {

            String date = request().getQueryString("date");
            String market = request().getQueryString("market");
            String vendor = request().getQueryString("vendor");

            java.util.Calendar cal = java.util.Calendar.getInstance();
            if (date != null) {
                String[] splitDate = date.split("-");
                cal.set(Integer.parseInt(splitDate[0]),Integer.parseInt(splitDate[1])-1,Integer.parseInt(splitDate[2]));
            }
            cal.add(java.util.Calendar.DATE,2-cal.get(java.util.Calendar.DAY_OF_WEEK));
            String d1 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);
            cal.add(java.util.Calendar.DATE,5);
            String d2 = cal.get(java.util.Calendar.YEAR)+"-"+(cal.get(java.util.Calendar.MONTH)+1)+"-"+cal.get(java.util.Calendar.DATE);


            // show labors
            List<Labor> labors = new ArrayList<Labor>();
            if (market!=null && !market.equals("")) {
                if (vendor!=null && !vendor.equals("")) {
                    labors = Labor.findWithinDatesForMarketandVendor(d1, d2, market, vendor);
                }
                else
                {
                    labors = Labor.findWithinDatesForMarket(d1,d2,market);
                }
            }
            else {
                if (vendor!=null && !vendor.equals("")) {
                    labors = Labor.findWithinDatesForVendor(d1, d2, vendor);
                }
                else
                {
                    labors = Labor.findWithinDates(d1,d2);
                    //  labors =  Labor.find.all();
                }
            }
            // labvendors da se najdat distinct vendori od labors
            List<Vendor> labvendors = new ArrayList<Vendor>();
            for (Labor l: labors) {
                if(l.vendor!=null && !labvendors.contains(l.vendor))
                    labvendors.add(l.vendor);
            }



            return PDF.ok(
                    views.html.labor.printlabor.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            Vendor.find.all(),
                            d1,
                            labors,
                            labvendors,
                            market,
                            vendor
                    )
            );
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

}
