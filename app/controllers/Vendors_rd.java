package controllers;

import com.avaje.ebean.*;
// import com.sun.org.apache.xpath.internal.operations.Bool;
import models.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import quickbooks.Queue;

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

import org.codehaus.jackson.JsonNode;
import play.mvc.BodyParser;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/19/13
 * Time: 3:22 PM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Vendors_rd extends Controller {
    public static Result index() {
        if (Secured.hasManagerAccess()) {
            return ok(views.html.vendor_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Lineitem.find.where().eq("qb_refnumber","ERR").findList()
            ));
        } else {
            return forbidden();
        }
    }



    public static Result itemQBexcelExport( ) {
        ArrayList headers = new ArrayList();
        headers.add("NAME");
        headers.add("TYPE");
        headers.add("IS INACTIVE");
        headers.add("NOTE");
        headers.add("VENDOR");
        headers.add("DEFAULT RATE");
        headers.add("DEFAULT UNITS");

        File file;
        try {
            file = new File("Item_QB.xlsx");

            FileOutputStream fileOut = new FileOutputStream(file);
            XSSFWorkbook wb = new XSSFWorkbook();
            Sheet sheet = wb.createSheet("Items");

            Row rowx = sheet.createRow(0);
            for (int m =0; m<headers.size();m++){
                Cell cell = rowx.createCell(m);
                cell.setCellValue(String.valueOf(headers.get(m)));
            }

            List<Item> items = new ArrayList<Item>();


            //  vendors = Vendor.find.where().isNotNull("qb_listid").findList();
            items = Item.find.where().eq("Active", 1).findList();

            for (int i =0; i<items.size() ;i++){
                Row row = sheet.createRow(i+1);

                Cell cell = row.createCell(0);
                cell.setCellValue(items.get(i).name);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(items.get(i).itemType.name);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(items.get(i).active);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue("");

                Cell cell4 = row.createCell(4);
                Cell cell5 = row.createCell(5);
                Cell cell6 = row.createCell(6);
                if (items.get(i).vendorItems.size() >0 && items.get(i).vendorItems.get(0).vendor!= null && items.get(i).vendorItems.get(0).default_rate != null && items.get(i).vendorItems.get(0).default_units!=null)
                {
                    cell4.setCellValue(items.get(i).vendorItems.get(0).vendor.name);
                    cell5.setCellValue(items.get(i).vendorItems.get(0).default_rate);
                    cell6.setCellValue(items.get(i).vendorItems.get(0).default_units);
                }
                else
                {
                    cell4.setCellValue("");
                    cell5.setCellValue("");
                    cell6.setCellValue("");
                }

/*

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(vendors.get(i).contact_number1);
                Cell cell10 = row.createCell(10);
                cell10.setCellValue(vendors.get(i).contact_fax);
                Cell cell11 = row.createCell(11);
                cell11.setCellValue(vendors.get(i).contact_number2);


                Cell cell12 = row.createCell(12);
                cell12.setCellValue(vendors.get(i).contact_email1);
                Cell cell13 = row.createCell(13);
                cell13.setCellValue(vendors.get(i).contact_email2);
                Cell cell14 = row.createCell(14);
                cell14.setCellValue(vendors.get(i).active);
                Cell cell15 = row.createCell(15);
                cell15.setCellValue("");*/


            }
            wb.write(fileOut);
            fileOut.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        response().setContentType("application/x-download");
        response().setHeader("Content-disposition","attachment; filename=Item_QB.xlsx");
        return ok(new File("Item_QB.xlsx"));

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

    public static Result vendorQBexcelExport( ) {
        ArrayList headers = new ArrayList();

        headers.add("VENDOR ID"); // 0
        headers.add("COMPANY NAME"); // 0
        headers.add("CODE"); // 1

     //   headers.add("FIRST NAME"); // 2
     //   headers.add("LAST NAME");   // 3

        headers.add("CONTACT NAME");  // 2
        headers.add("ADDRESS LINE 1"); //3
        headers.add("ADDRESS LINE 2"); // 4
        headers.add("CITY"); // 5
        headers.add("STATE");
        headers.add("ZIP");
        headers.add("CONTACT NUMBER1");
        headers.add("FAX");
        headers.add("CONTACT NUMBER2");
        headers.add("EMAIL1");
        headers.add("EMAIL2");
        headers.add("IS INACTIVE");
        headers.add("NOTE");
        headers.add("EMPLOYEE");
        headers.add("1099");
        headers.add("INVOICE");
        headers.add("ACCOUNT_TYPE");


        File file;
        try {
            file = new File("Vendor_QB.xlsx");

            FileOutputStream fileOut = new FileOutputStream(file);
            XSSFWorkbook wb = new XSSFWorkbook();
            Sheet sheet = wb.createSheet("Vendors");

            Row rowx = sheet.createRow(0);
            for (int m =0; m<headers.size();m++){
                Cell cell = rowx.createCell(m);
                cell.setCellValue(String.valueOf(headers.get(m)));
            }

            List<Vendor> vendors = new ArrayList<Vendor>();


          //  vendors = Vendor.find.where().isNotNull("qb_listid").findList();
             vendors = Vendor.find.where().eq("Active", 1).findList();

            for (int i =0; i<vendors.size() ;i++){
                Row row = sheet.createRow(i + 1);

                Cell cella = row.createCell(0);
                cella.setCellValue(vendors.get(i).id);

                if (vendors.get(i).name != null && vendors.get(i).name != "") {

                    // dali e company ili labor
                    String[] names = vendors.get(i).name.split(" ");



                    if (names.length > 0)
                    {
                        Cell cell0 = row.createCell(1);
                        Cell cell1 = row.createCell(2);

                        cell1.setCellValue(names[0]);
                        // ako prviot e pogolem od 1000 e company
                        if (isNumeric(names[0]))
                        {
                          
                            cell0.setCellValue(vendors.get(i).name.replace(names[0] + " ", ""));
                            /*if (Integer.parseInt(names[0]) > 999) {

                                Cell cell0 = row.createCell(0);
                                cell0.setCellValue(vendors.get(i).name.replace(names[0] + " ", ""));

                            } else {

                                Cell cell0 = row.createCell(0);
                                cell0.setCellValue(vendors.get(i).name);

                            }*/
                        }
                        else
                        {

                            cell0.setCellValue(vendors.get(i).name);
                        }


                        // ako ne e labor
                    }
                    else
                    {
                        Cell cell0 = row.createCell(1);
                        cell0.setCellValue(vendors.get(i).name);

                        Cell cell1 = row.createCell(2);
                        cell1.setCellValue(names[0]);
                        // ako nema poveke slogovi vo imeto polnam prazni za prefix num, first last

                    }



                    //  if (vendors.get(i).contact_name != null && vendors.get(i).contact_name != "")
                    //     names = vendors.get(i).contact_name.split(" ");

                    Cell cell2 = row.createCell(3);
                    cell2.setCellValue(vendors.get(i).contact_name);


                    Cell cell3 = row.createCell(4);
                    cell3.setCellValue(vendors.get(i).address1);
                    Cell cell4 = row.createCell(5);
                    cell4.setCellValue(vendors.get(i).address2);


                    Cell cell5 = row.createCell(6);
                    cell5.setCellValue(vendors.get(i).city);

                    Cell cell6 = row.createCell(7);
                    cell6.setCellValue(vendors.get(i).state);


                    Cell cell7 = row.createCell(8);
                    cell7.setCellValue(vendors.get(i).zip);

                    Cell cell8 = row.createCell(9);
                    cell8.setCellValue(vendors.get(i).contact_number1);

                    Cell cell9 = row.createCell(10);
                    cell9.setCellValue(vendors.get(i).contact_fax);


                    Cell cell10 = row.createCell(11);
                    cell10.setCellValue(vendors.get(i).contact_number2);

                    Cell cell11 = row.createCell(12);
                    cell11.setCellValue(vendors.get(i).contact_email1);

                    Cell cell12 = row.createCell(13);
                    cell12.setCellValue(vendors.get(i).contact_email2);

                    Cell cell13 = row.createCell(14);
                    cell13.setCellValue(vendors.get(i).active);

                    Cell cell14 = row.createCell(15);
                    cell14.setCellValue("");

                    Cell cell15 = row.createCell(16);
                    if (vendors.get(i).employee != null && vendors.get(i).employee.toString() != "")
                        cell15.setCellValue(vendors.get(i).employee);
                    else
                        cell15.setCellValue(0);

                    Cell cell16 = row.createCell(17);
                    if (vendors.get(i).type_1099 != null && vendors.get(i).type_1099.toString() != "")
                        cell16.setCellValue(vendors.get(i).type_1099);
                    else
                        cell16.setCellValue(0);


                    Cell cell17 = row.createCell(18);
                    if (vendors.get(i).invoice != null && vendors.get(i).invoice.toString() != "")
                        cell17.setCellValue(vendors.get(i).invoice);
                    else
                        cell17.setCellValue(0);

                    Cell cell18 = row.createCell(19);
                    if (vendors.get(i).expense_account != null && vendors.get(i).expense_account.toString()!= "") {

                        try {
                            AccountType acc = AccountType.find.byId(Long.parseLong(vendors.get(i).expense_account));
                            if (acc!=null)
                                cell18.setCellValue(acc.account);
                        }
                        catch (Exception ex){
                            String greska = ex.toString();
                        }

                    }
                    else
                        cell18.setCellValue("");







                }

            }
            wb.write(fileOut);
            fileOut.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        response().setContentType("application/x-download");
        response().setHeader("Content-disposition","attachment; filename=Vendor_QB.xlsx");
        return ok(new File("Vendor_QB.xlsx"));

    }



    public static Result update1099(){
        if (Secured.hasGuestAccess()) {
            String vendid = form().bindFromRequest().get("vendorid");
            String type_1099 = form().bindFromRequest().get("type_1099");

            // zemi array od ajax
            if (vendid != null && vendid != "")
            {
                Vendor p = Vendor.find.byId(Long.parseLong(vendid));
                if (p!=null){
                    if (type_1099.equals("true"))
                    {
                        p.type_1099 = 1;
                        p.employee = 0;
                        p.invoice = 0;
                    }
                    else
                    {
                        p.type_1099 = 0;
                    }
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


    public static Result updateEmployee(){
        if (Secured.hasGuestAccess()) {
            String vendid = form().bindFromRequest().get("vendorid");
            String employee = form().bindFromRequest().get("employee");

            // zemi array od ajax
            if (vendid != null && vendid != "")
            {
                Vendor p = Vendor.find.byId(Long.parseLong(vendid));
                if (p!=null){
                    if (employee.equals("true"))
                    {
                        p.employee = 1;
                        p.type_1099 = 0;
                        p.invoice = 0;
                    }
                    else
                        p.employee = 0;
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



    public static Result updateInvoice(){
        if (Secured.hasGuestAccess()) {
            String vendid = form().bindFromRequest().get("vendorid");
            String invoice = form().bindFromRequest().get("invoice");

            // zemi array od ajax
            if (vendid != null && vendid != "")
            {
                Vendor p = Vendor.find.byId(Long.parseLong(vendid));
                if (p!=null){
                    if (invoice.equals("true"))
                    {
                        p.invoice = 1;
                        p.type_1099 = 0;
                        p.employee = 0;
                    }
                    else
                        p.invoice = 0;
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



    public static Result updateActive(){
        if (Secured.hasGuestAccess()) {
            String vendid = form().bindFromRequest().get("vendorid");
            String active = form().bindFromRequest().get("active");

            // zemi array od ajax
            if (vendid != null && vendid != "")
            {
                Vendor p = Vendor.find.byId(Long.parseLong(vendid));
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


    public static Result updateItemActive(){
        if (Secured.hasGuestAccess()) {
            String itemid = form().bindFromRequest().get("itemid");
            String active = form().bindFromRequest().get("active");

            // zemi array od ajax
            if (itemid != null && itemid != "")
            {
                Item p = Item.find.byId(Long.parseLong(itemid));
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



    public static Result getVendor(Long id) {
        if (Secured.hasGuestAccess()) {
            Form<Vendor> vendorForm = form(Vendor.class).fill(Vendor.find.byId(id));
            return ok(views.html.vendors.vendor.render(
                    User.find.byId(Long.parseLong(request().username())),
                    vendorForm,
                    Vendor.find.byId(id)
            ));
        } else {
            return forbidden();
        }
    }



    public static Result getVendorbyID(Long id) {
        if (Secured.hasGuestAccess()) {
        Vendor ven = Vendor.find.byId(id);
        return ok(toJson(ven));
    } else {
        return forbidden();
    }
    }


    public static Result getactualVendors() {
        if (Secured.hasGuestAccess()) {
          /*  List<VendorItem> vendorItems;
            if (form().bindFromRequest().data().containsKey("itemType")
                    && !form().bindFromRequest().get("itemType").equals("")
                    && !form().bindFromRequest().get("itemType").equals("0")) {
                vendorItems = VendorItem.find.fetch("item").where().eq("item.itemType.id", Long.parseLong(form().bindFromRequest().get("itemType"))).isNotNull("vendor").orderBy("vendor.name").findList();
            } else {
                vendorItems = VendorItem.find.where().isNotNull("vendor").orderBy("vendor.name").findList();
            }

            List<VendorItem> tuniquevendoritem = new ArrayList<VendorItem>();;

            for (VendorItem vi : vendorItems) {
                boolean flag = false;
                for (VendorItem viUnique : tuniquevendoritem) {
                    if (vi.vendor.id == viUnique.vendor.id) {
                        flag = true;
                    }
                }
                if(!flag)
                    tuniquevendoritem.add(vi);
            }


            Long market = null;
            if (form().bindFromRequest().data().containsKey("market")
                    && !form().bindFromRequest().get("market").equals("")) {
                market = Long.parseLong(form().bindFromRequest().get("market"));
                List<VendorItem> tempvendoritem = new ArrayList<VendorItem>();
                for (VendorItem li : tuniquevendoritem)
                {
                    if (li.vendor.market.id == market)
                    {
                        tempvendoritem.add(li);
                    }
                }
                vendorItems.clear();
                vendorItems = tempvendoritem;
            }*/


         /*   2 obid
            List<Vendor> vendors;
            if (form().bindFromRequest().data().containsKey("marketid")
                    && !form().bindFromRequest().get("marketid").equals("")
                    && !form().bindFromRequest().get("marketid").equals("0")) {
                vendors = Vendor.find.where().eq("market.id", Long.parseLong(form().bindFromRequest().get("marketid"))).orderBy("name").findList();
            } else {
                vendors = Vendor.find.where().orderBy("name").findList();
            }
*/


            List<Vendor> vendors;
            String mrketid =   form().bindFromRequest().get("marketid");
            String itemtype =   form().bindFromRequest().get("itemType");
            String sqlstr =  "SELECT `id`, `name` FROM `vendor` WHERE 1 =1  ";
            // komentiraj gi dolnive 2 reda za da go trgnime marketot od selekcija na vendori
          /*  if (mrketid!= null && mrketid!="")
                 sqlstr += " and market_id = " + mrketid;*/
            if (itemtype!= null && itemtype!="")
                sqlstr +=" and id in (select vendor_id from vendor_item where item_id in (select id from item where item_type_id = "+itemtype+") and active =1)  order by name asc";


           /* Map<String, String> map = new HashMap<String, String>();
            map.put("dog", "type of animal");*/
            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            // execute the query returning a List of MapBean objects
            List<SqlRow> list = sqlQuery.findList();

            return ok(toJson(list));
        } else {
            return forbidden();
        }
    }







    public static Result getVendorsperMarketCat() {
        if (Secured.hasGuestAccess()) {
            List<Vendor> vendors;
            String mrketid =   form().bindFromRequest().get("marketid");
            String itemtype =   form().bindFromRequest().get("itemType");

            String insurence =   form().bindFromRequest().get("insurence");
            String employee =   form().bindFromRequest().get("employee");

            String invoice =   form().bindFromRequest().get("invoice");

            Date datenow = new Date();
            //DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            DateFormat dateFormatNeeded = new SimpleDateFormat("yyyy-mm-dd");

            String sqlstr =  "SELECT `id`, `name` FROM `vendor` WHERE active=1  ";
            // komentiraj gi dolnive 2 reda za da go trgnime marketot od selekcija na vendori
            if (mrketid!= null && !mrketid.equals("") && !mrketid.equals("0"))
                 sqlstr += " and market_id = " + mrketid;

            if (insurence!= null && !insurence.equals(""))
                sqlstr += " and insurance_date >= " + dateFormatNeeded.format(datenow);


            if (employee!= null && !employee.equals(""))
                sqlstr += " and (employee =1 or type_1099 =1)";

            if (invoice!= null && !invoice.equals(""))
                sqlstr += " and invoice =1";


            if (itemtype!= null && !itemtype.equals(""))
                sqlstr +=" and id in (select vendor_id from vendor_item where item_id in (select id from item where item_type_id = "+itemtype+") and active = 1)  order by name asc";



            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

            List<SqlRow> list = sqlQuery.findList();

            return ok(toJson(list));
        } else {
            return forbidden();
        }
    }


    public static List<Vendor> getVendorsperMarket(String mrketid) {

            List<Vendor> vendors = new ArrayList<Vendor>();
            String sqlstr =  "SELECT `id`, `name` FROM `vendor` WHERE 1 =1  ";
            // komentiraj gi dolnive 2 reda za da go trgnime marketot od selekcija na vendori
            if (mrketid!= null && !mrketid.equals(""))
                sqlstr += " and market_id = " + mrketid;

            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

            List<SqlRow> list = sqlQuery.findList();

            for (SqlRow row : list)
            {
                vendors.add(Vendor.find.byId(row.getLong("id")));
            }

           List<Vendor> tasksnq =  new ArrayList(new HashSet(vendors));
            return tasksnq;



    }


    public static List<Vendor> getVendorsByMarketCat(String mrketid, String itemtype) {


        String searchinIN = " ";
        String[] itemcatids = itemtype.split("-");
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


        List<Vendor> vendors = new ArrayList<Vendor>();

            String sqlstr =  "SELECT distinct(`id`)  FROM `vendor` WHERE 1 =1  ";
            // komentiraj gi dolnive 2 reda za da go trgnime marketot od selekcija na vendori
            if (mrketid!= null && !mrketid.equals(""))
                sqlstr += " and market_id = " + mrketid;
            if (itemtype!= null && !itemtype.equals("")  && !itemtype.equals("-"))
                sqlstr +=" and id in (select vendor_id from vendor_item where item_id in (select id from item where item_type_id in ("+searchinIN+")) and active = 1) and  active = 1  order by name asc";



            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);

            List<SqlRow> list = sqlQuery.findList();
            for (SqlRow row : list)
            {
                vendors.add(Vendor.find.byId(row.getLong("id")));
            }

            List<Vendor> tasksnq =  new ArrayList(new HashSet(vendors));
            return tasksnq;
    }


    public static Result getactualVendorsMinimized() {
        if (Secured.hasGuestAccess()) {

            List<Vendor> vendors;
            String jobid =   form().bindFromRequest().get("jobid");
            String mrketid =   form().bindFromRequest().get("marketid");
            String itemtype =   form().bindFromRequest().get("itemType");
            String sqlstr =  "SELECT `id`, `name` FROM `vendor` WHERE 1 =1  ";
            // mora da gi vidime vendorid -njata od jobot

            String vendorids = "";
            if (jobid !="" &&  !itemtype.equals("") && !itemtype.equals("1"))
            {
                List<Lineitem> ljj = Lineitem.find.where().eq("job_id", jobid).findList();
                // int count = 0;
                List<String> vendoridnja= new ArrayList<String>();
                // new ArrayList(new HashSet(jsTmPs));
                for (Lineitem l : ljj)
                {
                    if (l!=null && l.vendor!=null && l.vendor.id!=null)
                    {
                        vendoridnja.add(l.vendor.id.toString());
                        // vendorids+= l.vendor.id;

                        // if (count <ljj.size()-1)
                     //       vendoridnja += ", ";
                    }
                    // count++;
                }


                //remove duplicates
                List<String> strg =  new ArrayList(new HashSet(vendoridnja));
                int i = 0;
                for (String t : strg)
                {
                    vendorids+= t;
                    if (i<strg.size()-1)
                        vendorids+=",";
                    i++;
                }
            }

            if (vendorids!="")
                sqlstr +=" and id in (" + vendorids + ") ";

            if (itemtype!= null && itemtype!="")
                 sqlstr +=" and id in (select vendor_id from vendor_item where item_id in (select id from item where item_type_id = "+itemtype+") and active =1) ";
                // sqlstr +=" and id in (select vendor_id from vendor_item where item_id in (select id from item where active = 1) and active =1) ";



            sqlstr += "  order by name asc";
            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();

            return ok(toJson(list));
        } else {
            return forbidden();
        }
    }




    public static Result getVendorFront(Long id) {
        if (Secured.hasGuestAccess()) {
            Vendor vendor = Vendor.find.byId(id);
            Form<Vendor> vendorForm = form(Vendor.class).fill(Vendor.find.byId(id));
           // List<VendorItem> listvenitems = VendorItem.findItemsbyVendid(vendor.id);
            List<VendorItem> listvenitems =    VendorItem.find.where().eq("vendor_id", vendor.id).findList();
            List<Item> listitems = Item.find.all();
            return ok(views.html.vendors.index_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    vendor,
                    listvenitems,
                    listitems
            ));
        } else {
            return forbidden();
        }
    }

    public static Result addVendor() {
        if (Secured.hasManagerAccess()) {
            Vendor vendor = new Vendor();
            vendor.market = Market.find.byId(Long.parseLong(form().bindFromRequest().get("market")));
            vendor.name = form().bindFromRequest().get("name");
            String  insurance_date = form().bindFromRequest().get("insurance_date");
            vendor.expense_account = form().bindFromRequest().get("expense_account");

            Date dateent = new Date();



            if(insurance_date!=null && !insurance_date.equals(""))
            {
                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");

                try {
                    if (insurance_date!=null) {
                        dateent = format.parse(insurance_date);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
            vendor.insurance_date = dateent;
            vendor.save();
            vendor.refresh();


            VendorItem vendorItem = new VendorItem();
            vendorItem.vendor = vendor;

            vendorItem.save();

            String type = "vendor";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            Item item = Item.find.where().eq("name","Hourly Per Man").findUnique();
            List<VendorItem> vendorItems = VendorItem.find.where().eq("vendor",vendor).eq("item",item).findList();
            if (!vendorItems.isEmpty()) {
                queue.action = "EmployeeQuery";
            } else {
                queue.action = "VendorQuery";
            }
            queue.ident = vendor.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            session("vendorAdded", vendor.id.toString());

            return ok(toJson(vendor));
        } else {
            return forbidden();
        }
    }





    public static Result updateVendor() {
        if (Secured.hasManagerAccess()) {
            Form<Vendor> vendorForm = form(Vendor.class).bindFromRequest();

            if (vendorForm.hasErrors()) {
                Form<Vendor> userVendor = play.data.Form.form(Vendor.class);
                return badRequest(views.html.vendors.addvendor.render(
                        User.find.byId(Long.parseLong(request().username())),
                        Market.find.all(),
                        userVendor));
            } else {
                Vendor vendor = vendorForm.get();
                vendor.name = vendor.name.trim();
                vendor.active = 1;
                vendor.update();

                String type = "vendor";
                Queue queue = new Queue();
                queue.username = quickbooks.User.find.byId("qbffi");
                Item item = Item.find.where().eq("name","Hourly Per Man").findUnique();
                List<VendorItem> vendorItems = VendorItem.find.where().eq("vendor",vendor).eq("item",item).findList();
                if (!vendorItems.isEmpty()) {
                    queue.action = "EmployeeQuery";
                } else {
                    queue.action = "VendorQuery";
                }
                queue.ident = vendor.id.toString();
                queue.extra = "s:" + type.length() + ":\"" + type + "\";";
                queue.qbxml = "";
                queue.priority = 2;
                queue.status = Character.forDigit(26,36);
                queue.enqueueDatetime = new Date();
                queue.save("quickbooks");
                return ok();
            }
        } else {
            return forbidden();
        }
    }




    public static Result deleteVendor() {
        if (Secured.hasManagerAccess()) {
            Vendor vendor = Vendor.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            for (Lineitem lineitem : vendor.lineitems) {
                lineitem.vendor = null;
                lineitem.update();
            }
            vendor.delete();
            return redirect(routes.Home_rd.index());
        } else {
            return forbidden();
        }
    }

    public static Result getItem(Long id) {
        if (Secured.hasGuestAccess()) {
            Form<Item> itemForm = form(Item.class).fill(Item.find.byId(id));
            Item i = Item.find.byId(id);
            return ok(views.html.vendors.item_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    itemForm,
                    i
            ));
        } else {
            return forbidden();
        }
    }

    public static Result getItemByid(Long id) {
        if (Secured.hasGuestAccess()) {
        Item i = Item.find.byId(id);
        return ok(toJson(i));
        } else {
            return forbidden();
        }
    }



    public static Result addVendor_rd(){
        if (Secured.hasGuestAccess()) {
            Form<Vendor> userVendor = play.data.Form.form(Vendor.class);
            return ok(views.html.vendors.addvendor.render(User.find.byId(Long.parseLong(request().username())), Market.find.all(), userVendor));
        } else {
            return forbidden();
        }
    }


    public static Result listItems() {
        if (Secured.hasAdministratorAccess()) {
            List<ItemType> listitemtypes = ItemType.find.all();
            return ok(
                    views.html.vendors.itemlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Item.find.all(),
                            listitemtypes
                    )
            );
        } else {
            return forbidden();
        }
    }


    public static Result listVendors() {
        if (Secured.hasAdministratorAccess()) {
            List<Item> listitems = Item.find.all();
            List<Market> listmarkets = Market.find.all();
            List<AccountType> acctype = AccountType.find.all();
            return ok(
                    views.html.vendors.vendlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Vendor.find.all(),
                         //   Vendor.find.where().eq("active", 1).findList(),
                            listitems,
                            listmarkets,
                            acctype
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result addItem_rd() {
        if (Secured.hasGuestAccess()) {
            Form<Item> userItem = play.data.Form.form(Item.class);
            return ok(views.html.vendors.additem.render(User.find.byId(Long.parseLong(request().username())), userItem, ItemType.find.all()));
        } else {
            return forbidden();
        }

    }

    public static Result addItem() {
        if (Secured.hasManagerAccess()) {
            Item item = new Item();
            item.itemType = ItemType.find.byId(Long.parseLong(form().bindFromRequest().get("itemType")));
            item.name = form().bindFromRequest().get("name");
            item.active = 1;
            item.save();
            item.refresh();

            String type = "item";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "ItemServiceQuery";
            queue.ident = item.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            VendorItem vendorItem = new VendorItem();
            vendorItem.item = item;
            vendorItem.save();
            List<ItemType> listitemtypes = ItemType.find.all();
            return ok(
                    views.html.vendors.itemlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Item.find.all(),
                            listitemtypes
                    )
            );

        } else {
            return forbidden();
        }
    }

    public static Result updateItem() {
        if (Secured.hasManagerAccess()) {
           Item itm =  new Item();


            itm.id = Long.parseLong(form().bindFromRequest().get("id"));
            itm.name = form().bindFromRequest().get("name");
            itm.itemType =   ItemType.find.byId(Long.parseLong(form().bindFromRequest().get("itemType")));
            itm.update();
            String type = "item";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "ItemServiceQuery";
            queue.ident = itm.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");
            List<ItemType> listitemtypes = ItemType.find.all();
            return ok(
                    views.html.vendors.itemlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Item.find.all(),
                            listitemtypes
                    )
            );
        }
         else {
            return forbidden();
        }
    }

    public static Result deleteItem() {
        if (Secured.hasManagerAccess()) {
            Item item = Item.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            for (Lineitem lineitem : item.lineitems) {
                lineitem.item = null;
                lineitem.update();
            }
            for (Job job : item.jobs) {
                job.item = null;
                job.update();
            }
            item.delete();
            return ok();
        } else {
            return forbidden();
        }
    }




    public static Result getVendorItem(Long id) {
        if (Secured.hasGuestAccess()) {
             VendorItem vi = VendorItem.find.byId(id);
            return ok(toJson(vi));
        } else {
            return forbidden();
        }

        /*if (Secured.hasGuestAccess()) {
            Form<VendorItem> vendorItemForm = form(VendorItem.class).fill(VendorItem.find.byId(id));
            return ok(views.html.vendors.vendorItem.render(
                    vendorItemForm
            ));
        } else {
            return forbidden();
        }*/
    }



    public static Result getVendorItems(Long id) {
        if (Secured.hasGuestAccess()) {
            List<VendorItem> listvenitemsTemp = VendorItem.find.where().eq("vendor_id", id).findList();
            List<VendorItem> listvenitems = new ArrayList<VendorItem>();

            for(VendorItem vi: listvenitemsTemp)
            {
                if (vi.item!=null)
                    if (vi.item.active ==1)
                        listvenitems.add(vi);
            }

            return ok(toJson(listvenitems));
        } else {
            return forbidden();
        }
    }






    public static Result getVendorActualItem() {
        if (Secured.hasGuestAccess()) {
            String vendorid =  form().bindFromRequest().get("vendorid");
            String itemid = form().bindFromRequest().get("itemid");
            VendorItem vi =  VendorItem.find.where().eq("vendor_id", vendorid).eq("item_id",itemid).findUnique();
            return ok(toJson(vi));
        } else {
            return forbidden();
        }
    }


    private static HashMap sortByValues(HashMap map) {
        List list = new LinkedList(map.entrySet());
        // Defined Custom Comparator here
        Collections.sort(list, new Comparator() {
            public int compare(Object o1, Object o2) {
                return ((Comparable) ((Map.Entry) (o1)).getValue())
                        .compareTo(((Map.Entry) (o2)).getValue());
            }
        });

        HashMap sortedHashMap = new LinkedHashMap();
        for (Iterator it = list.iterator(); it.hasNext();) {
            Map.Entry entry = (Map.Entry) it.next();
            sortedHashMap.put(entry.getKey(), entry.getValue());
        }
        return sortedHashMap;
    }

    public static Result getVendorActualItems(Long id) {
        if (Secured.hasGuestAccess()) {
            List<VendorItem> listvenitems = VendorItem.find.where().eq("vendor_id", id).findList();

           java.util.HashMap<String, String> hm = new java.util.HashMap<String, String>();
            //    litem = Lineitem.findActualLineitemsByJob(id);
            for (VendorItem vi : listvenitems)
            {
                if (vi.item != null && vi.item.active ==1)
                    hm.put(Long.toString(vi.item.id), vi.item.name);
            }

        //    Map<String, String> map = sortByValues(hm);
            return ok(toJson(hm));
        } else {
            return forbidden();
        }
    }

    public static Result getonlyItem(Long id) {
        if (Secured.hasGuestAccess()) {
            Item itemot = Item.find.where().eq("id", id).findUnique();
            if (itemot!= null)
                return ok(toJson(itemot));
            else
                return ok();
        } else {
            return forbidden();
        }
    }


    public static Result addVendorItem() {
        if (Secured.hasManagerAccess()) {
            VendorItem vendorItem = new VendorItem();

            vendorItem.vendor = Vendor.find.byId(Long.parseLong(form().bindFromRequest().get("vendor")));
            vendorItem.item =   Item.find.byId(Long.parseLong(form().bindFromRequest().get("item")));
            vendorItem.save();
            vendorItem.refresh();

            String type = "vendor_item";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "ItemServiceQuery";
            queue.ident = vendorItem.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            return ok(toJson(vendorItem));
        } else {
            return forbidden();
        }
    }

    public static Result updateVendorItem() {
        if (Secured.hasManagerAccess()) {

                String s = form().bindFromRequest().get("item");
                String t = form().bindFromRequest().get("vendor");
                String o = form().bindFromRequest().get("default_rate");
                String p = form().bindFromRequest().get("default_units");

                VendorItem vendorItem = VendorItem.find.byId(Long.parseLong(s));
              //  vendorItem.item = Item.find.byId(Long.parseLong(s));
                vendorItem.vendor = Vendor.find.byId(Long.parseLong(form().bindFromRequest().get("vendor")));
                vendorItem.default_rate =  Double.parseDouble(form().bindFromRequest().get("default_rate"));
                vendorItem.default_units =   form().bindFromRequest().get("default_units");

                vendorItem.update();
                vendorItem.refresh();

                String type = "vendor_item";
                Queue queue = new Queue();
                queue.username = quickbooks.User.find.byId("qbffi");
                queue.action = "ItemServiceQuery";
                queue.ident = vendorItem.id.toString();
                queue.extra = "s:" + type.length() + ":\"" + type + "\";";
                queue.qbxml = "";
                queue.priority = 2;
                queue.status = Character.forDigit(26,36);
                queue.enqueueDatetime = new Date();
                queue.save("quickbooks");

                List<Lineitem> lineitems = Lineitem.find
                        .where().eq("task.completed",false).eq("taskType.id",1L).eq("itemType.id",1L).findList();
                for (Lineitem li : lineitems) {
                    if (((li.vendor == null && vendorItem.vendor == null) || (li.vendor != null && vendorItem.vendor != null && li.vendor.equals(vendorItem.vendor))) &&
                            ((li.item == null && vendorItem.item == null) || (li.item != null && vendorItem.item != null && li.item.equals(vendorItem.item)))) {
                        li.rate = vendorItem.default_rate;
                        if (li.taskType != null) {
                            li.units = vendorItem.default_units;
                        }
                        li.update();
                    }
                }
                return ok(toJson(vendorItem));

        } else {
            return forbidden();
        }
    }

    public static Result deleteVendorItem() {
        if (Secured.hasManagerAccess()) {
            VendorItem vendorItem = VendorItem.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            vendorItem.delete();
            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result updateVendorMarket() {
        if (Secured.hasAdministratorAccess()) {
            Vendor vend = Vendor.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            vend.market = Market.find.byId(Long.parseLong(form().bindFromRequest().get("market")));
            vend.save();
            vend.refresh();
            return ok();
        } else {
            return forbidden();
        }
    }

}
