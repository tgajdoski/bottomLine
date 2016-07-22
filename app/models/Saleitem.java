package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class
        Saleitem extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Job job;
    @ManyToOne
    public Plan plan;

    public String name;
    public Double rate;
    public String units;
    public Double quantity;
    public Double saleprice;
    @Column(columnDefinition = "BLOB")
    public String notes;

    public String qb_refnumber;
    public String qb_txnid;
    public String qb_editsequence;
    public String qb_txnlineid;

    public Date saleitemdate;

    @Version
    @Column(name = "update_timestamp")
    public Date updateTimestamp;

    @PreUpdate
    @PrePersist
    void updateTimestamp(){
        this.updateTimestamp = new Date();
    }
    public Saleitem(Job job, Plan plan, String name, Double rate, String units, Double quantity,
                    Double saleprice, String notes){
        if (job != null) {
            this.job = job;
        }
        if (plan != null) {
            this.plan = plan;
        }
        this.name = name;
        this.rate = rate;
        this.units = units;
        this.quantity = quantity;
        this.saleprice = saleprice;
        this.notes = notes;
        this.qb_txnlineid = "-1";
      //  this.saleitemdate = new Date(0L);
    }

    public static Model.Finder<Long,Saleitem> find = new Model.Finder(Long.class, Saleitem.class);

    public static List<Saleitem> findByJob(Long id) {
        return find.fetch("job")
                .where()
                .eq("job.id", id)
                .findList();
    }

    public static Saleitem addBlank(String job, String plan) {
        Saleitem saleitem = new Saleitem(null,null,
                "",0.0d,"",0.0d,0.0d,"");
        if (job!=null) {
            saleitem.job = Job.find.byId(Long.parseLong(job));
        }
        if (plan!=null) {
            saleitem.plan = Plan.find.byId(Long.parseLong(plan));
        }
        saleitem.save();
        return saleitem;
    }

    public static String update(Long id, Map<String,String> values) {
        Saleitem saleitem = find.ref(id);
        if (values.containsKey("name")) {
            saleitem.name = values.get("name");
        }
        if (values.containsKey("rate")) {
            saleitem.rate = Double.parseDouble(values.get("rate"));
        }
        if (values.containsKey("units")) {
            saleitem.units = values.get("units");
        }
        if (values.containsKey("quantity")) {
            saleitem.quantity = Double.parseDouble(values.get("quantity"));
        }
        if (values.containsKey("saleprice")) {
            saleitem.saleprice = Double.parseDouble(values.get("saleprice"));
        }

        // datum na saleitem
        if (values.containsKey("saleitemdate")) {
            DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
            String datesaleitem = values.get("saleitemdate");
            try {
                if (datesaleitem!=null&&saleitem.saleitemdate!=format.parse(datesaleitem)) {
                    saleitem.saleitemdate = format.parse(datesaleitem);
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }

        saleitem.update();
        return "OK";
    }

    public static List<Saleitem> findWithinDatesForMarket(String d1, String d2, String market) {
        return find.where()
                .isNotNull("job")
                .eq("job.market.id",market)
                .ge("saleitemdate",d1)
                .le("saleitemdate",d2)
                .findList();
    }


    public static List<Saleitem> findWithinDatesForMarketandCategory(String d1, String d2, String market, String category) {
        return find.where()
                .isNotNull("job")
                .eq("job.market.id",market)
                .eq("job.jobCategory.id",category)
                .ge("saleitemdate",d1)
                .le("saleitemdate",d2)
                .findList();
    }


    public static List<Saleitem> findWithinDatesForCategory(String d1, String d2, String category) {
        return find.where()
                .isNotNull("job")
                .eq("job.jobCategory.id",category)
                .ge("saleitemdate",d1)
                .le("saleitemdate",d2)
                .findList();
    }

    public static List<Saleitem> findWithinDates(String d1, String d2) {
        return find.where()
                .isNotNull("job")
                .ge("saleitemdate",d1)
                .le("saleitemdate",d2)
                .findList();
    }


}
