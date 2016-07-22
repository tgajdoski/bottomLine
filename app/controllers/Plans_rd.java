package controllers;

import models.*;
import play.api.Play;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;

import java.io.*;
import java.lang.reflect.Array;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import static play.data.Form.form;
import static play.libs.Json.toJson;
import play.libs.Json;
import java.util.*;

import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;
import com.avaje.ebean.Expr;
import com.avaje.ebean.Page;


/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/3/13
 * Time: 11:27 AM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Plans_rd extends Controller {

    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result loadPlan(Long id) {
        if (Secured.hasGuestAccess()) {
            Plan p = Plan.find.byId(id);
            /*if (!ChecknewPlan(p))
            {
            return ok(
                    views.html.plan_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            p ,
                            PlanItem.find.all()
                    )
            );
            }
            else
            {*/
                return ok(
                        views.html.plan_rd_new.render(
                                User.find.byId(Long.parseLong(request().username())),
                                p ,
                                PlanItem.find.all(),
                                ChecknewPlan(p)
                        )
                );
           /* }*/
        } else {
            return forbidden();
        }
    }


    public static Result reorderLineItems() {
        if (Secured.hasGuestAccess()) {
           // String rowid = form().bindFromRequest().get("id");
           // String fromPosition = form().bindFromRequest().get("fromPosition");
           // String toPosition = form().bindFromRequest().get("toPosition");

            // zemi array od ajax
            String lineitemsis = form().bindFromRequest().get("lineitemsid");
            if (lineitemsis != null && !lineitemsis.equals("")){
                String[] linitemsids = lineitemsis.split(" ");
                for(int i=0; i<linitemsids.length; i++)
                {
                    if (!linitemsids[i].equals(""))
                    {
                        Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                        if (lm!= null)
                        {
                            lm.position = i;// Integer.toString(i+1);
                            lm.update();
                        }
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

            Date datumplan = new Date();
            DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            try {
                if (datumot!=null&&!datumot.equals("")) {
                    datumplan = format.parse(datumot);
                }
            } catch (ParseException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

           Long planid = 0l;

            if (lineitemsis != null && !lineitemsis.equals("") && datumplan != null){
                String[] linitemsids = lineitemsis.split(" ");
                for(int i=0; i<linitemsids.length; i++)
                {
                    Lineitem lm = Lineitem.find.byId(Long.parseLong(linitemsids[i]));
                    if (lm!= null)
                    {
                        lm.daysdate  = datumplan;// Integer.toString(i+1);
                        lm.update();
                        planid = lm.plan.id;
                    }
                }
            }

          //  return ok();
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



    public static Result reorderLineItemRefresh(){
        if (Secured.hasGuestAccess()) {

            String planid = form().bindFromRequest().get("planid");
            List<Lineitem> lip = null;
            if (planid != null && !planid.equals("")){
                lip=  Lineitem.find.where().eq("plan_id" , planid).setOrderBy("position").findList();
            }
            return ok(views.html.budgets.index_rd_new.render(
                            User.find.byId(Long.parseLong(request().username())),
                            lip
                    ));
        } else {
            return forbidden();
        }
    }

/*    <section id="budget" style="margin-right:50px;margin-bottom:30px;float:left;">
    @views.html.budgets.index_rd_new(user,plan.lineitems.sortBy(_.position))
    </section>*/

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        long factor = (long) Math.pow(10, places);
        value = value * factor;
        long tmp = Math.round(value);
        return (double) tmp / factor;
    }


    public static Result updateActive(){

        if (Secured.hasGuestAccess()) {
            String planid = form().bindFromRequest().get("planid");
             String active = form().bindFromRequest().get("active");

            // zemi array od ajax
            if (planid != null && planid != "")
            {
                Plan p = Plan.find.byId(Long.parseLong(planid));
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


    public static boolean CheckVendorItemPrice(Long lineitemitemidid, Long lineitemvendoridid, Double tempitemPrice){
        boolean isti = true;
        VendorItem vi = VendorItem.find.where().eq("vendor_id", lineitemvendoridid).eq( "item_id" , lineitemitemidid).findUnique();
        if (vi !=null){
            if (Double.compare(round(vi.default_rate, 2) , tempitemPrice) != 0)
            {
                isti = false;
            }
        }
        return (isti);
    }


    public static boolean ChecknewPlan (Plan p){
        boolean b = true;
        int counter = 0;
        if (p != null)
        {
            for (Lineitem l : p.lineitems) {
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

    public static Result checkPrices(){
        // List<String> vidifferentrate = new ArrayList<String>();
        if (Secured.hasManagerAccess()) {
            String template = form().bindFromRequest().get("template");
            ObjectNode result = Json.newObject();


            ArrayNode an = result.putArray("priceChanges");

            if (template!=null&&!template.equals(""))
            {
                Plan templatePlan = Plan.find.byId(Long.parseLong(template));


                for (Lineitem l : templatePlan.lineitems) {
                    ObjectNode row = Json.newObject();
                    if (l.item != null && l.vendor != null && l.rate != null)
                    {
                       if (!CheckVendorItemPrice(l.item.id , l.vendor.id , l.rate))
                        {
                         //  vidifferentrate.add(Item.find.byId(l.item.id).name);
                            row.put("itemname", Item.find.byId(l.item.id).name);
                            row.put("venorname", Vendor.find.byId(l.vendor.id).name);
                            row.put("templateprice", l.rate.toString());
                            VendorItem vi = VendorItem.find.where().eq("vendor_id", l.vendor.id).eq( "item_id" , l.item.id).findUnique();
                            row.put("itemnewprice", vi.default_rate.toString());
                            an.add(row);
                        }
                    }
                }
            }
            return ok(result);
        }
        else
        {
            return forbidden();
        }
    }




    public static Result addPlan_rd() {
         if (Secured.hasGuestAccess()) {
             play.data.Form<Plan> userPlan = play.data.Form.form(Plan.class);
            return ok(views.html.plans.addplan.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Customer.find.all(),
                    Plan.find.all(),
                    userPlan
            ));
        } else {
            return forbidden();
        }
    }



    public static Result addPlanNewPrice() {
        if (Secured.hasManagerAccess()) {
            Plan plan = Plan.addPlanNewPrice(
                    form().bindFromRequest().data()
            );
            return ok(toJson(plan));
        } else {
            return forbidden();
        }
    }



    public static Result getPlanListformCustomerid(Long id) {
        if (Secured.hasGuestAccess()) {
            List<Plan> listplans = Plan.find.where().isNull("customer").eq("active", 1).findList();
            listplans.addAll(Plan.find.where().eq("customer_id", id).eq("active", 1).findList());

            Collections.sort(listplans, new Comparator<Plan>() {
                public int compare(Plan one, Plan other) {
                    return one.name.compareTo(other.name);
                }
            });


            return ok(toJson(listplans));
        } else {
            return forbidden();
        }
    }




    public static Result addPlan() {
            if (Secured.hasManagerAccess()) {
                Plan plan = Plan.addPlan(
                        form().bindFromRequest().data()
                );
                return ok(toJson(plan));
            } else {
                return forbidden();
            }
    }

    public static Result deletePlan() {
        if (Secured.hasAdministratorAccess()) {
            Plan plan = Plan.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            for (Job j : plan.jobs) {
                j.plan = null;
                j.update();
            }
            plan.delete();
            return redirect(routes.Home_rd.index());
        } else {
            return forbidden();
        }
    }

    public static Result updatePlan() {
        if (Secured.hasManagerAccess()) {
            Plan plan = Plan.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            String name = form().bindFromRequest().get("name");
            if (name!=null) {
                plan.name = name.trim();
            }
            plan.update();
            return ok();
        } else {
            return forbidden();
        }
    }


    public static Result addPlanItem() {
        if (Secured.hasManagerAccess()) {
            Long planItemId = Long.parseLong(form().bindFromRequest().get("id"));
            PlanItem newPlanItem = PlanItem.find.byId(planItemId);
            List<Dimension> dimensions = new ArrayList<Dimension>();
            return ok(views.html.plans.item_rd.render(User.find.byId(Long.parseLong(request().username())), newPlanItem, dimensions));
        } else {
            return forbidden();
        }
    }

    public static Result addDimension() {
        if (Secured.hasManagerAccess()) {
            Dimension newDimension = Dimension.addBlank(
                    form().bindFromRequest().get("job"),
                    form().bindFromRequest().get("plan"),
                    form().bindFromRequest().get("planItem"),
                    form().bindFromRequest().get("deduction")
            );
            return ok(views.html.plans.dimension.render(User.find.byId(Long.parseLong(request().username())), newDimension));
        } else {
            return forbidden();
        }
    }

    public static Result deleteDimension(Long dimension) {
        if (Secured.hasManagerAccess()) {
            Dimension.find.ref(dimension).delete();
            return ok();
        } else {
            return forbidden();
        }
    }

    public static Result updateDimension(Long dimension) {
        if (Secured.hasManagerAccess()) {
            return ok(
                    Dimension.update(
                            dimension,
                            form().bindFromRequest().data()
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result getAttachment(String name) {
        if (Secured.hasGuestAccess()) {
            String adjustedName = null;
            try {
                adjustedName = new URI(name).getPath();
            } catch (URISyntaxException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
            if (adjustedName != null) {
                return ok(new File(Play.current().path()+"/../vhosts/default/htdocs/uploads/"+adjustedName));
            } else {
                return notFound();
            }
        } else {
            return forbidden();
        }
    }

    /*@(user: User, plans: List[Plan], customers: List[Customer], formPlan: Form[models.Plan])*/
    public static Result listPlans() {
        if (Secured.hasAdministratorAccess()) {
            List<Customer> listicust = Customer.find.all();
            List<Plan> listplans = Plan.find.all();
            play.data.Form<Plan> userPlan = play.data.Form.form(Plan.class);
            return ok(
                    views.html.plans.planlist.render(
                            User.find.byId(Long.parseLong(request().username())),
                            listplans,
                            listicust,
                            userPlan
                    )
            );
        } else {
            return forbidden();
        }
    }



    public static Result listPlansAjax() {
        if (Secured.hasAdministratorAccess()) {

            Map<String, String[]> params = request().queryString();

            Integer iTotalRecords = Plan.find.findRowCount();
            String filter = params.get("sSearch")[0];
            Integer pageSize = Integer.valueOf(params.get("iDisplayLength")[0]);
            Integer page = Integer.valueOf(params.get("iDisplayStart")[0]) / pageSize;

            /**
             * Get sorting order and column
             */
            String sortBy = "name";
            String order = params.get("sSortDir_0")[0];

            switch(Integer.valueOf(params.get("iSortCol_0")[0])) {
                case 1 : sortBy = "name"; break;
                case 2 : sortBy = "customer.name"; break;
            }

          Page<Plan> planPage = Plan.find.where(
                    Expr.or(
                            Expr.ilike("name", "%"+filter+"%"),
                            Expr.or(
                                    Expr.ilike("name", "%"+filter+"%"),
                                    Expr.ilike("customer.name", "%"+filter+"%")
                            )
                    )
            )
                    .orderBy(sortBy + " " + order + ", id " + order)
                    .findPagingList(pageSize).setFetchAhead(false)
                    .getPage(page);

            Integer iTotalDisplayRecords = planPage.getTotalRowCount();

            /**
             * Construct the JSON to return
             */
            ObjectNode result = Json.newObject();

            result.put("sEcho", Integer.valueOf(params.get("sEcho")[0]));
            result.put("iTotalRecords", iTotalRecords);
            result.put("iTotalDisplayRecords", iTotalDisplayRecords);

            ArrayNode an = result.putArray("aaData");

            for(Plan c : planPage.getList()) {
                ObjectNode row = Json.newObject();
                ObjectNode rowDTrow = Json.newObject();
                if (c.id == null || c.name == null || c.name == "")
                {


                    row.put ("DT_RowId","0");
                    row.put("0", "<a class=\"deleteUser\"><i class=\"fa fa-trash-o\"></i></a>");
                    row.put("1", "no plan name");
                    row.put("2", "NA");
                    row.put("3", "NA");
                }
                else
                {
                   // rowDTrow.put("data-order" ,   c.id.toString() );// c.id);
                  // row.put ("DT_RowData", rowDTrow );
                    row.put ("DT_RowId",c.id);
                    row.put("0", "<a class=\"deleteUser\"><i class=\"fa fa-trash-o\"></i></a>");
                    row.put("1","<a href=\"#\" class=\"clicka\">" + c.name + "</a>");
                    if (c.active == 0)
                        row.put("3","<input type=\"checkbox\" class=\"actinact\" value=\"" + c.id + "\"> <br>");
                    else
                        row.put("3","<input type=\"checkbox\" checked class=\"actinact\" value=\"" + c.id + "\"  > <br>");
                }
        //        <input type="checkbox" name="coffee" value="cream">With cream<br>
                if (c.customer == null || c.customer.id == null)
                {
                    row.put("2", "no customer");
                }
                else
                {
                   Customer sss =  Customer.find.byId(c.customer.id);
                    if (sss == null || sss.name == ""){
                        row.put("2", "no customer");
                    }
                    else
                    {
                        row.put("2",sss.name);
                    }
                }
             //   row.put("2", "c.customer.name");
                an.add(row);
            }
            return ok(result);
        } else {
            return forbidden();
        }
    }



    public static Result upload() {
        if (Secured.hasManagerAccess()) {
        File file = request().body().asRaw().asFile();
        Path temp = file.toPath();

        String fname   =  form().bindFromRequest().get("filename");
     //   DateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
     //   String fileExtension = df.format(new Date(System.currentTimeMillis()));

     //   Path newFile = new File("../vhosts/default/htdocs/uploads",fileExtension + "_" + fname).toPath();
            Path newFile = new File("../vhosts/default/htdocs/uploads", fname).toPath();
        try{
            Files.move(temp, newFile);
            Files.delete(temp);
        }
        catch(IOException e){
            e.printStackTrace();
        }
        Attachment newAttachment = Attachment.addAttachment(
                form().bindFromRequest().get("jobid"),
                form().bindFromRequest().get("planid"),
            //    fileExtension + "_" + fname
                fname
        );
        return ok(views.html.plans.attachment_rd.render(
                User.find.byId(Long.parseLong(request().username())),
                newAttachment));
    } else {
        return forbidden();
    }
    }



    public static Result addAttachment() {
        if (Secured.hasManagerAccess()) {
            Http.MultipartFormData body = request().body().asMultipartFormData();
            Http.MultipartFormData.FilePart attachment = body.getFile("Filedata");
            File file = attachment.getFile();
            File newFile = new File(Play.current().path()+"/../vhosts/default/htdocs/uploads/"+attachment.getFilename());
            try {
                moveFile(file,newFile);
            } catch (IOException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }

            Attachment newAttachment = Attachment.addAttachment(
                    form().bindFromRequest().get("job"),
                    form().bindFromRequest().get("plan"),
                    attachment.getFilename()
            );
            return ok(views.html.plans.attachment_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    newAttachment));
        } else {
            return forbidden();
        }
    }

    public static Result deleteAttachment(Long id) {
        if (Secured.hasManagerAccess()) {
            Attachment attachment = Attachment.find.ref(id);
            File file = new File(Play.current().path()+"/../vhosts/default/htdocs/uploads/"+attachment.attachment_path);
            file.delete();
            attachment.delete();
            return ok();
        } else {
            return forbidden();
        }
    }

    public static void moveFile(File sourceFile, File destFile) throws IOException {
        if (!destFile.exists()) {
            destFile.createNewFile();
        }

        FileChannel source = null;
        FileChannel destination = null;
        try {
            source = new FileInputStream(sourceFile).getChannel();
            destination = new FileOutputStream(destFile).getChannel();

            // previous code: destination.transferFrom(source, 0, source.size());
            // to avoid infinite loops, should be:
            long count = 0;
            long size = source.size();
            while((count += destination.transferFrom(source, count, size-count))<size);
        }
        finally {
            if(source != null) {
                source.close();
                sourceFile.delete();
            }
            if(destination != null) {
                destination.close();
            }
        }
    }

}
