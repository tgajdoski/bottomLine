package controllers;

import akka.util.Convert;
import com.avaje.ebean.ExpressionList;
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

import play.mvc.Http;
import play.mvc.Http.Session;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

import static play.data.Form.form;
import static play.libs.Json.toJson;

import com.avaje.ebean.*;
import com.avaje.ebean.Expr;

import com.avaje.ebean.Page;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/11/13
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Customers_rd extends Controller {
    public static Result index() {
        if (Secured.hasManagerAccess()) {
            return ok(views.html.customer_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Saleitem.find.where().eq("qb_refnumber","ERR").findList()
            ));
        } else {
            return forbidden();
        }
    }



    public static Result getMarket(Long id) {
        if (Secured.hasGuestAccess()) {
            Form<Market> marketForm = form(Market.class).fill(Market.find.byId(id));
            return ok(views.html.customers.market_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    marketForm,
                    Market.find.byId(id)
            ));
        } else {
            return forbidden();
        }
    }




    public static Result getMarketByid(Long id) {
        if (Secured.hasGuestAccess()) {
            Market m = Market.find.byId(id);
            return ok(toJson(m));
        } else {
            return forbidden();
        }
    }


    public static Result getMarketwoeid(Long Marketid) {
        Market ma = Market.find.byId(Marketid);
        if (ma!=null)
            return ok(ma.woeid.toString());
        else
            return ok("0");
    }
/*
    public static Result addMarket_rd() {
        if (Secured.hasGuestAccess()) {
            Form<Market> marketForm = play.data.Form.form(Market.class);
            return ok(views.html.customers.addmarket.render(User.find.byId(Long.parseLong(request().username())), marketForm));
        } else {
            return forbidden();
        }
    }
*/

    public static Result getCustomerList(Long marketid) {
        if (Secured.hasManagerAccess()) {
               List<Customer>   lscust = Customer.find.where().eq("market_id",marketid).eq("active", 1).findList();
           return ok(toJson(lscust));
        } else {
            return forbidden();
        }
    }



    public static Result getCustomerpermarket() {
        if (Secured.hasManagerAccess()) {
            List<Customer> lscust = new ArrayList<Customer>();
            String mrketid =   form().bindFromRequest().get("marketid");
            if (!mrketid.equals(""))
                lscust = Customer.find.where().eq("market_id",mrketid).eq("active", 1).findList();
            else
                lscust = Customer.find.where().eq("active", 1).findList();
            return ok(toJson(lscust));
        } else {
            return forbidden();
        }
    }




    public static Result customerQBexcelExport( ) {
        ArrayList headers = new ArrayList();

        headers.add("NAME");
        headers.add("MARKET");
        headers.add("ADDRESS LINE 1");
        headers.add("ADDRESS LINE 2");
        headers.add("CITY");
        headers.add("STATE");
        headers.add("ZIP");
        headers.add("CONTACT NAME");
        headers.add("CONTACT NUMBER1");
        headers.add("CONTACT NUMBER2");
        headers.add("FAX");
        headers.add("EMAIL1");
        headers.add("EMAIL2");
        headers.add("EMAIL3");
        headers.add("IS INACTIVE");
        headers.add("NOTE");

        File file;
        try {
            file = new File("Customer_QB.xlsx");

            FileOutputStream fileOut = new FileOutputStream(file);
            XSSFWorkbook wb = new XSSFWorkbook();
            Sheet sheet = wb.createSheet("Customers");

            Row rowx = sheet.createRow(0);
            for (int m =0; m<headers.size();m++){
                Cell cell = rowx.createCell(m);
                cell.setCellValue(String.valueOf(headers.get(m)));
            }

            List<Customer> customers = new ArrayList<Customer>();

          //  customers = Customer.find.where().isNotNull("qb_listid").findList();
            customers = Customer.find.where().eq("Active", 1).findList();

            for (int i =0; i<customers.size() ;i++){
                Row row = sheet.createRow(i+1);
                Cell cell = row.createCell(0);
                cell.setCellValue(customers.get(i).name);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(customers.get(i).market.city + ", " + customers.get(i).market.state);


                Cell cell2 = row.createCell(2);
                cell2.setCellValue(customers.get(i).address1);
                Cell cell3 = row.createCell(3);
                cell3.setCellValue(customers.get(i).address2);
                Cell cell4 = row.createCell(4);
                cell4.setCellValue(customers.get(i).city);
                Cell cell5 = row.createCell(5);
                cell5.setCellValue(customers.get(i).state);
                Cell cell6 = row.createCell(6);
                cell6.setCellValue(customers.get(i).zip);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(customers.get(i).contact_name);

                Cell cell8 = row.createCell(8);
                cell8.setCellValue(customers.get(i).contact_number1);
                Cell cell9 = row.createCell(9);
                cell9.setCellValue(customers.get(i).contact_number2);

                Cell cell10 = row.createCell(10);
                cell10.setCellValue(customers.get(i).contact_fax);

                Cell cell11 = row.createCell(11);
                cell11.setCellValue(customers.get(i).contact_email1);


                Cell cell12 = row.createCell(12);
                cell12.setCellValue(customers.get(i).contact_email2);
                Cell cell13 = row.createCell(13);
                cell13.setCellValue(customers.get(i).contact_email3);
                Cell cell14 = row.createCell(14);
                cell14.setCellValue(customers.get(i).active);
                Cell cell15 = row.createCell(15);
                cell15.setCellValue("");


            }
            wb.write(fileOut);
            fileOut.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        response().setContentType("application/x-download");
        response().setHeader("Content-disposition","attachment; filename=Customer_QB.xlsx");
        return ok(new File("Customer_QB.xlsx"));

    }




    public static Result getCustomerpermarketS() {
        if (Secured.hasManagerAccess()) {
            String markets = form().bindFromRequest().get("markets");
            List<Customer> lscust = new ArrayList<Customer>();
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

            String sqlstr =  "SELECT `id` FROM customer WHERE 1 =1  ";

            // za market
            if (marketSelect!= null && !marketSelect.equals(""))
                sqlstr +=" and market_id in ("+marketSelect+") ";


            SqlQuery sqlQuery = Ebean.createSqlQuery(sqlstr);
            List<SqlRow> list = sqlQuery.findList();
            for (SqlRow row : list)
            {
                lscust.add(Customer.find.byId(row.getLong("id")));
            }
            // List<Customer> lscust = Customer.find.where().eq("active", 1).idIn(marketSelect).findList();
            return ok(toJson(lscust));

        } else {
            return forbidden();
        }
    }


    public static Result addMarket() {
        if (Secured.hasAdministratorAccess()) {
            Market market = new Market();
            market.city = form().bindFromRequest().get("city");
            market.state = form().bindFromRequest().get("state");
            market.woeid = form().bindFromRequest().get("woeid");
            market.save();
            market.refresh();
            return ok(
                    views.html.customers.marketlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all()
                    )
            );
        } else {
            return forbidden();
        }






    }

    public static Result updateMarket() {

            if (Secured.hasAdministratorAccess()) {

                Market mark = new Market();
                mark.id = Long.parseLong(form().bindFromRequest().get("id"));
                mark.city = form().bindFromRequest().get("city");
                mark.state = form().bindFromRequest().get("state");
                mark.woeid = form().bindFromRequest().get("woeid");

                mark.update();
                    return ok(views.html.customers.marketlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all()
                    ));
            }
        else {
            return forbidden();
        }
    }

    public static Result deleteMarket() {
        if (Secured.hasAdministratorAccess()) {
            Market market = Market.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            market.delete();
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result updateActive(){

        if (Secured.hasGuestAccess()) {
            String custid = form().bindFromRequest().get("customerid");
            String active = form().bindFromRequest().get("active");

            // zemi array od ajax
            if (custid != null && custid != "")
            {
                Customer p = Customer.find.byId(Long.parseLong(custid));
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



    public static Result listCustomer() {
        if (Secured.hasAdministratorAccess()) {
            List<Market> listmarkets = Market.find.all();
            return ok(
                    views.html.customers.custlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Customer.find.all(),
                            //  Customer.find.where().eq("active", 1).findList(),
                            listmarkets
                    )
            );
        } else {
            return forbidden();
        }
    }



    public static Result listMarket() {
        if (Secured.hasAdministratorAccess()) {
            return ok(
                    views.html.customers.marketlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all()
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result getCustomer(Long id) {
        if (Secured.hasGuestAccess()) {
            Form<Customer> customerForm = form(Customer.class).fill(Customer.find.byId(id));
            return ok(views.html.customers.customer.render(
                    User.find.byId(Long.parseLong(request().username())),
                    customerForm, Customer.find.byId(id)
            ));
        } else {
            return forbidden();
        }
    }


    public static Result getCustomerbyID(Long id) {
        if (Secured.hasGuestAccess()) {
            Customer cust = Customer.find.byId(id);
            return ok(toJson(cust));
        } else {
            return forbidden();
        }
    }



    public static Result addCustomer() {
        if (Secured.hasAdministratorAccess()) {

            Customer customer = new Customer(form().bindFromRequest().get("name"));
            customer.market = Market.find.byId(Long.parseLong(form().bindFromRequest().get("market")));

            customer.save();
            customer.refresh();


            String type = "customer";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "CustomerQuery";
            queue.ident = customer.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            session("customerAdded", customer.id.toString());

            return ok(toJson(customer));
        } else {
            return forbidden();
        }
    }

    public static Result addSubdivision() {
        if (Secured.hasAdministratorAccess()) {

            String sa = form().bindFromRequest().get("customer");
            // Customer customer =  Customer.find.byId(Long.parseLong(form().bindFromRequest().get("customer")));
            Customer customer =  Customer.find.where().eq( "name" , form().bindFromRequest().get("customer")).findUnique();
            String sss = form().bindFromRequest().get("name");

            Subdivision subdivision = new Subdivision(customer,sss);
            subdivision.save();
            subdivision.refresh();

            String type = "subdivision";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "CustomerQuery";
            queue.ident = subdivision.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            return ok(toJson(subdivision));
        } else {
            return forbidden();
        }
    }
/*
    public static Result addSubdiv() {
        if (Secured.hasAdministratorAccess()) {

            // Customer customer =  Customer.find.byId(Long.parseLong(form().bindFromRequest().get("customer")));
            Customer customer =  Customer.find.where().eq( "name" , form().bindFromRequest().get("customer")).findUnique();
            String sss = form().bindFromRequest().get("name");

            Subdivision subdivision = new Subdivision(customer,sss);
            subdivision.save();
            subdivision.refresh();

            String type = "subdivision";
            Queue queue = new Queue();
            queue.username = quickbooks.User.find.byId("qbffi");
            queue.action = "CustomerQuery";
            queue.ident = subdivision.id.toString();
            queue.extra = "s:" + type.length() + ":\"" + type + "\";";
            queue.qbxml = "";
            queue.priority = 2;
            queue.status = Character.forDigit(26,36);
            queue.enqueueDatetime = new Date();
            queue.save("quickbooks");

            return ok(toJson(subdivision));
        } else {
            return forbidden();
        }
    }*/


    public static Result addCustomer_rd(){
        if (Secured.hasGuestAccess()) {
            Form<Customer> userCustomer = play.data.Form.form(Customer.class);
            return ok(views.html.customers.addcustomer.render(User.find.byId(Long.parseLong(request().username())), Market.find.all(), userCustomer));
        } else {
            return forbidden();
        }
    }

    public static Result saveCustomer() {
        if (Secured.hasAdministratorAccess()) {
            return TODO;
        } else {
            return forbidden();
        }
    }

    public static Result updateCustomer() {
        if (Secured.hasAdministratorAccess()) {
            Form<Customer> customerForm = form(Customer.class).bindFromRequest();
            if(customerForm.hasErrors()) {
            /*    return badRequest(views.html.customers.addcustomer.render(
                        User.find.byId(Long.parseLong(request().username())),
                        customerForm
                ));*/
                Form<Customer> userCustomer = play.data.Form.form(Customer.class);
             //   return ok(views.html.customers.addcustomer.render(User.find.byId(Long.parseLong(request().username())), Market.find.all(), userCustomer));
				return ok();

            } else {
                Customer customer = customerForm.get();
                customer.name = customer.name.trim();
                customer.update();

                String type = "customer";
                Queue queue = new Queue();
                queue.username = quickbooks.User.find.byId("qbffi");
                queue.action = "CustomerQuery";
                queue.ident = customer.id.toString();
                queue.extra = "s:" + type.length() + ":\"" + type + "\";";
                queue.qbxml = "";
                queue.priority = 2;
                queue.status = Character.forDigit(26,36);
                queue.enqueueDatetime = new Date();
                queue.save("quickbooks");

               /*  return ok();*/
              /*  Form<Subdivision> subCustomer = play.data.Form.form(Subdivision.class);*/
        //        List<Subdivision> listsub = Subdivision.findSubbyCustID(customer.id);
                List<Subdivision> listsub = Subdivision.find.where().eq("customer_id", customer.id).findList();
                return ok(toJson(customer));
             /*  return ok(views.html.customers.index_rd.render(
                        User.find.byId(Long.parseLong(request().username())),customer ,listsub));*/

            }
        } else {
            return forbidden();
        }
    }

    public static Result deleteCustomer() {
        if (Secured.hasAdministratorAccess()) {
            Customer cust = Customer.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            cust.delete(cust.id);
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result getSubdivisionsList(Long id) {
        if (Secured.hasGuestAccess()) {
            List<Subdivision> listvensubs = Subdivision.find.where().eq("customer_id", id).findList();

            return ok(toJson(listvensubs));
        } else {
            return forbidden();
        }
    }


    public static Result getSubdivision(Long id) {
            if (Secured.hasGuestAccess()) {
                Subdivision subs = Subdivision.find.byId(id);

                return ok(toJson(subs));
           /* Form<Subdivision> subdivisionForm = form(Subdivision.class).fill(Subdivision.find.byId(id));
            Customer cusetm =  Subdivision.find.byId(id).customer;

            return ok(views.html.customers.subdivision_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    subdivisionForm,
                    cusetm,
                    id
            ));*/
        } else {
            return forbidden();
        }
    }


    public static Result updateSubdivision(Long subdivid) {
        if (Secured.hasAdministratorAccess()) {
           //  Subdivision sub = Subdivision.find.byId(subdivid);
            Customer cust = Subdivision.find.byId(subdivid).customer;
            Form<Subdivision> subdivisionForm = form(Subdivision.class).bindFromRequest();
            if(subdivisionForm.hasErrors()) {
                return badRequest("badrequest");
            } else {
                Subdivision sub = subdivisionForm.get();
                sub.name = sub.name.trim();
                sub.customer = cust;
                sub.id = subdivid;
                sub.update();


                String type = "subdivision";
                Queue queue = new Queue();
                queue.username = quickbooks.User.find.byId("qbffi");
                queue.action = "CustomerQuery";
                queue.ident = sub.id.toString();
                queue.extra = "s:" + type.length() + ":\"" + type + "\";";
                queue.qbxml = "";
                queue.priority = 2;
                queue.status = Character.forDigit(26,36);
                queue.enqueueDatetime = new Date();
                queue.save("quickbooks");

                return ok();
                /*return ok(views.html.customers.index_rd.render(
                        User.find.byId(Long.parseLong(request().username())),
                        Customer.find.byId(custid),
                        listsub));*/
            }
        } else {
            return forbidden();
        }
    }

    public static Result deleteSubdivision() {
        if (Secured.hasAdministratorAccess()) {
            Subdivision.delete(Long.parseLong(form().bindFromRequest().get("id")));
            return redirect(routes.Home_rd.index());
        } else {
            return forbidden();
        }
    }




    public static Result deleteCustomerSubdivision(Long id) {
        if (Secured.hasAdministratorAccess()) {

            Subdivision.delete(id);
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result updateCustomerMarket() {
        if (Secured.hasAdministratorAccess()) {
            Customer cust = Customer.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            cust.market = Market.find.byId(Long.parseLong(form().bindFromRequest().get("market")));
            cust.save();
            cust.refresh();
            return ok();
        } else {
            return forbidden();
        }
    }

}
