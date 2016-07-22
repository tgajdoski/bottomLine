package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/3/13
 * Time: 10:13 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Dimension extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Job job;
    @ManyToOne
    public Plan plan;
    @ManyToOne
    @Constraints.Required
    public PlanItem planItem;

    public boolean deduction;
    public Double length_feet;
    public Double length_inches;
    public Double width_feet;
    public Double width_inches;
    public Double depth_feet;
    public Double depth_inches;

    @Column(columnDefinition = "BLOB")
    public String notes;

    public Dimension(Job job, Plan plan, PlanItem planItem, boolean deduction, Double length_feet, Double length_inches,
                        Double width_feet, Double width_inches,
                        Double depth_feet, Double depth_inches, String notes) {
        if (job != null) {
            this.job = job;
        }
        if (plan != null) {
            this.plan = plan;
        }
        this.planItem = planItem;
        this.deduction = deduction;
        this.length_feet = length_feet;
        this.length_inches = length_inches;
        this.width_feet = width_feet;
        this.width_inches = width_inches;
        this.depth_feet = depth_feet;
        this.depth_inches = depth_inches;
        this.notes = notes;
    }

    public static Dimension addBlank(String job, String plan, String planItem, String deduction) {
        Dimension dimension = new Dimension(null,null,
                PlanItem.find.byId(Long.parseLong(planItem)),
                Boolean.parseBoolean(deduction),0.0d,0.0d,0.0d,0.0d,0.0d,0.0d,"");
        if (job!=null) {
            dimension.job = Job.find.byId(Long.parseLong(job));
        }
        if (plan!=null) {
            dimension.plan = Plan.find.byId(Long.parseLong(plan));
        }
        dimension.save();
        return dimension;
    }

    public static String update(Long id, Map<String,String> values) {
        Dimension dimension = find.ref(id);
        if (values.containsKey("notes")) {
            dimension.notes = values.get("notes");
        } else if (values.containsKey("length_feet")) {
            dimension.length_feet = Double.parseDouble(values.get("length_feet"));
        } else if (values.containsKey("length_inches")) {
            dimension.length_inches = Double.parseDouble(values.get("length_inches"));
        } else if (values.containsKey("width_feet")) {
            dimension.width_feet = Double.parseDouble(values.get("width_feet"));
        } else if (values.containsKey("width_inches")) {
            dimension.width_inches = Double.parseDouble(values.get("width_inches"));
        } else if (values.containsKey("depth_feet")) {
            dimension.depth_feet = Double.parseDouble(values.get("depth_feet"));
        } else if (values.containsKey("depth_inches")) {
            dimension.depth_inches = Double.parseDouble(values.get("depth_inches"));
        }
        dimension.update();
        return "OK";
    }

    public static Model.Finder<Long,Dimension> find = new Model.Finder(Long.class, Dimension.class);

    public static List<Dimension> findByJob(Long id) {
        return find.fetch("job")
                .where()
                .eq("job.id", id)
                .findList();
    }

    public static List<Dimension> findByPlan(Long id) {
        return find.fetch("plan")
                .where()
                .eq("plan.id", id)
                .findList();
    }
}
