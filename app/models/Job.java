package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Job extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public JobCategory jobCategory;
    @ManyToOne
    @Constraints.Required
    public Market market;
    @ManyToOne
    @Constraints.Required
    public Subdivision subdivision;
    @ManyToOne
    public Budget budget;
    @ManyToOne
    @JoinColumn(name="plan_id", nullable=true)
    public Plan plan;

    @ManyToOne
    public Item item;

    public Date date;
    @Constraints.Required
    public String lot;
    public String description;

    public Double lnft;
    public Double sqft;
    public Double cuyds;
    public Double price_per_sqft;
    public Double saleprice;
    public Double cost;
    public Double op_multiplier;
    public Double bfc_multiplier;
    public Double op;
    public Double bfc;

    public String qb_txnid;
    public String qb_txnlineid;
    public String qb_editsequence;
    public String qb_listid;

    @Column(columnDefinition = "BLOB")
    public String notes;

    @Version
    @Column(name = "update_timestamp")
    public Date updateTimestamp;

    @PreUpdate
    @PrePersist
    void updateTimestamp(){
        this.updateTimestamp = new Date();
    }

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "job")
    @JsonIgnore
    public List<Manager> managers = new ArrayList<Manager>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "job")
    @JsonIgnore
    public List<Saleitem> saleitems = new ArrayList<Saleitem>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "job")
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "job")
    @JsonIgnore
    public List<Attachment> attachments = new ArrayList<Attachment>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "job")
    @JsonIgnore
    public List<Dimension> dimensions = new ArrayList<Dimension>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "job")
    @JsonIgnore
    public List<Task> tasks = new ArrayList<Task>();

    public Job() {
        this.date = new Date(0L);
        this.lot = "";
        this.description = "";
        this.lnft = 0.0d;
        this.sqft = 0.0d;
        this.cuyds = 0.0d;
        this.price_per_sqft = 0.0d;
        this.saleprice = 0.0d;
        this.cost = 0.0d;
        this.op = 0.0d;
        this.bfc = 0.0d;
    }

    public static Job addJob(Map<String,String> values) {
        Job job = new Job();
        job.lot = values.get("lot");
        String saleitem = values.get("saleitem");
        if (saleitem!=null&&!saleitem.equals("")) {
            job.item = Item.find.ref(Long.parseLong(saleitem));
        }
        String market = values.get("market");
        if (market!=null&&!market.equals("")) {
            job.market = Market.find.ref(Long.parseLong(market));
        }
        String subdivision = values.get("subdivision");
        if (subdivision!=null&&!subdivision.equals("")) {
            job.subdivision = Subdivision.find.ref(Long.parseLong(subdivision));
            if (job.market==null) {
                job.market = job.subdivision.customer.market;
            }
        }
        String plan = values.get("plan");
        if (plan!=null&&!plan.equals("")) {
            job.plan = Plan.find.ref(Long.parseLong(plan));
            job.lnft = job.plan.lnft;
            job.sqft = job.plan.sqft;
            job.cuyds = job.plan.cuyds;
            job.price_per_sqft = job.plan.price_per_sqft;
            job.saleprice = job.plan.saleprice;
            job.cost = job.plan.cost;


        }
        job.budget = Budget.find.ref(1L);
        job.op_multiplier = job.budget.op_multiplier;
        job.bfc_multiplier = job.budget.bfc_multiplier;

        job.jobCategory = JobCategory.find.ref(11L);

        job.save();

        if (job.plan!=null) {
            for (Saleitem si : job.plan.saleitems) {
                Saleitem jsi = Saleitem.addBlank(null,null);
                jsi.job = job;
                jsi.name = si.name;
                jsi.rate = si.rate;
                jsi.units = si.units;
                jsi.quantity = si.quantity;
                jsi.saleprice = si.saleprice;
                jsi.notes = si.notes;
                jsi.update();
            }
            for (Dimension d : job.plan.dimensions) {
                String planItem = d.planItem.id.toString();
                String deduction = (d.deduction)?"true":"false";
                Dimension jd = Dimension.addBlank(null,null,planItem,deduction);
                jd.job = job;
                jd.length_feet = d.length_feet;
                jd.length_inches = d.length_inches;
                jd.width_feet = d.width_feet;
                jd.width_inches = d.width_inches;
                jd.depth_feet = d.depth_feet;
                jd.depth_inches = d.depth_inches;
                jd.notes = d.notes;
                jd.update();
            }
            for (Lineitem l : job.plan.lineitems) {
                Lineitem jl = Lineitem.addLineitem(null,null,null,null,null,null);
                jl.job = job;
                jl.planItem = l.planItem;
                jl.taskType = l.taskType;
                jl.itemType = l.itemType;
                jl.vendor = l.vendor;



                jl.item = l.item;
                // PROVERI CENI
                if (l.vendor!=null)
                {
                     try{
                        // ako ima vendor
                        VendorItem vi = VendorItem.find.where().eq("item_id",l.item.id).eq("vendor_id", l.vendor.id).findUnique();
                        if (vi!=null)
                        {
                            // ako ima vendoritem
                            if (l.rate != vi.default_rate)
                            {
                                // ako ima razlicna cena zemi ja taa
                                jl.rate = vi.default_rate;
                                jl.saleprice = l.quantity * vi.default_rate;
                            }
                            else
                            {
                                // ako nema razlicna cena
                                jl.rate = l.rate;
                                jl.saleprice = l.saleprice;
                            }
                        }
                        else
                        {
                            // ako nema vendoritem
                            jl.rate = l.rate;
                            jl.saleprice = l.saleprice;
                        }
                     }
                    catch (Exception ex){}
                }
                else
                {
                    // ako nema vendor
                    jl.rate = l.rate;
                    jl.saleprice = l.saleprice;
                }

                jl.units = l.units;
                jl.quantity = l.quantity;
                jl.multiplier = l.multiplier;
                jl.markup = l.markup;
                jl.position = l.position;
                // za datumite - logika: ako se namesti prv datum denesniot pa da se dodadat vo razlikite
                jl.update();
            }
            for (Attachment a : job.plan.attachments) {
                Attachment ja = Attachment.addAttachment(null,null,a.attachment_path);
                ja.job = job;
                ja.update();
            }

            // za datumite - logika: ako se namesti prv datum denesniot pa da se dodadat vo razlikite

        }

        return job;
    }

    public static Model.Finder<Long, Job> find = new Model.Finder<Long, Job>(
            Long.class, Job.class);
}
