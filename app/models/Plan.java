package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Plan extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Customer customer;

    @Constraints.Required
    public String name;
    public boolean template;
    public Double lnft;
    public Double sqft;
    public Double cuyds;
    public Double price_per_sqft;
    public Double saleprice;
    public Double cost;

    public String qb_listid;
    public int qb_editsequence;

    public Integer active;

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "plan")
    @JsonIgnore
    public List<Saleitem> saleitems = new ArrayList<Saleitem>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "plan")
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "plan")
    @JsonIgnore
    public List<Dimension> dimensions = new ArrayList<Dimension>();
    @OneToMany(mappedBy = "plan")
    @JsonIgnore
    public List<Job> jobs = new ArrayList<Job>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "plan")
    @JsonIgnore
    public List<Attachment> attachments = new ArrayList<Attachment>();

    public Plan(){
        lnft = 0.0d;
        sqft = 0.0d;
        cuyds = 0.0d;
        price_per_sqft = 0.0d;
        saleprice = 0.0d;
        cost = 0.0d;
        template = false;
        active = 1;
    }

    public static Model.Finder<Long, Plan> find = new Model.Finder<Long, Plan>(
            Long.class, Plan.class);

    public static Plan addPlan(Map<String,String> values) {
        Plan plan = new Plan();
        String name = values.get("name");
        if (name==null || name.equals("")) {
            name = "NO NAME";
        }
        plan.name = name;
        String customer = values.get("customer");
        if (customer!=null&&!customer.equals("")) {
            plan.customer = Customer.find.byId(Long.parseLong(customer));
        }
        plan.save();
        String template = values.get("template");
        if (template!=null&&!template.equals("")) {
            Plan templatePlan = Plan.find.byId(Long.parseLong(template));
            plan.lnft = templatePlan.lnft;
            plan.sqft = templatePlan.sqft;
            plan.cuyds = templatePlan.cuyds;
            plan.price_per_sqft = templatePlan.price_per_sqft;
            plan.saleprice = templatePlan.saleprice;
            plan.cost = templatePlan.cost;
            for (Saleitem si : templatePlan.saleitems) {
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
            for (Dimension d : templatePlan.dimensions) {
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
            for (Lineitem l : templatePlan.lineitems) {
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
                pl.daysdate = l.daysdate;
                pl.position = l.position;
                pl.update();
            }
            for (Attachment a : templatePlan.attachments) {
                Attachment pa = Attachment.addAttachment(null,null,a.attachment_path);
                pa.plan = plan;
                pa.update();
            }
            plan.update();
        }
        plan.refresh();

        return plan;
    }


    public static Plan addPlanNewPrice(Map<String,String> values) {
        Plan plan = new Plan();
        String name = values.get("name");
        if (name==null || name.equals("")) {
            name = "NO NAME";
        }
        plan.name = name;
        String customer = values.get("customer");
        if (customer!=null&&!customer.equals("")) {
            plan.customer = Customer.find.byId(Long.parseLong(customer));
        }
        plan.save();
        String template = values.get("template");
        if (template!=null&&!template.equals("")) {
            Plan templatePlan = Plan.find.byId(Long.parseLong(template));
            plan.lnft = templatePlan.lnft;
            plan.sqft = templatePlan.sqft;
            plan.cuyds = templatePlan.cuyds;
            plan.price_per_sqft = templatePlan.price_per_sqft;
            plan.saleprice = templatePlan.saleprice;
            plan.cost = templatePlan.cost;
            for (Saleitem si : templatePlan.saleitems) {
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
            for (Dimension d : templatePlan.dimensions) {
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
            for (Lineitem l : templatePlan.lineitems) {
                Lineitem pl = Lineitem.addLineitem(null,null,null,null,null,null);
                pl.plan = plan;
                pl.planItem = l.planItem;
                pl.taskType = l.taskType;
                pl.itemType = l.itemType;
                pl.vendor = l.vendor;
                pl.item = l.item;
            /*    pl.rate = l.rate;*/
                VendorItem vi = null;
                if (l!=null && l.vendor != null && l.item !=null) {
                  vi = VendorItem.find.where().eq("vendor_id", l.vendor.id).eq("item_id", l.item.id).findUnique();
                }
                pl.rate = l.rate;
                if (vi!=null){
                 pl.rate = vi.default_rate;
                }

                pl.units = l.units;
                pl.quantity = l.quantity;
             /*   pl.saleprice =   l.saleprice;*/
                pl.saleprice = pl.rate *  l.quantity;
                pl.multiplier = l.multiplier;
                pl.markup = l.markup;
                pl.daysdate = l.daysdate;
                pl.position = l.position;
                pl.update();
            }
            for (Attachment a : templatePlan.attachments) {
                Attachment pa = Attachment.addAttachment(null,null,a.attachment_path);
                pa.plan = plan;
                pa.update();
            }
            plan.update();
        }
        plan.refresh();

        return plan;
    }

}
