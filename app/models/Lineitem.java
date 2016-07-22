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
 * Date: 6/3/13
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Lineitem extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Job job;
    @ManyToOne
    public Plan plan;
    @ManyToOne
    @JsonIgnore
    public PlanItem planItem;
    @ManyToOne
    public TaskType taskType;
    @ManyToOne
    public ItemType itemType;
    @ManyToOne
    public Vendor vendor;
    @ManyToOne
    public Item item;

    public Double rate;
    public String units;
    public Double quantity;
    public Double saleprice;
    public Double multiplier;
    public Double markup;
    @Column(columnDefinition = "BLOB")
    public String notes;
    public String qb_refnumber;
    public String qb_txnid;
    public String qb_editsequence;
    public String qb_txnlineid;
    public Integer position;
    public Integer verify;

    public Date daysdate;

    @Version
    @Column(name = "update_timestamp")
    public Date updateTimestamp;

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "lineitem")
    @JsonIgnore
    public List<LineitemPercentage> percentages = new ArrayList<LineitemPercentage>();

    @PreUpdate
    @PrePersist
    void updateTimestamp(){
        this.updateTimestamp = new Date();
    }

    @ManyToOne
    @JsonIgnore
    public User user;
    @ManyToOne
    public Task task;

    public Lineitem(Job job, Plan plan, PlanItem planItem, TaskType taskType, ItemType itemType, Vendor vendor,
                     Item item, Double rate, String units, Double quantity, Double saleprice, Double markup,
                     Double multiplier, String notes, Date updateTimestamp) {
        if (job != null) {
            this.job = job;
        }
        if (plan != null) {
            this.plan = plan;
        }
        this.planItem = planItem;
        this.taskType = taskType;
        this.itemType = itemType;
        this.vendor = vendor;
        this.item = item;
        this.rate = rate;
        this.units = units;
        this.quantity = quantity;
        this.saleprice = saleprice;
        this.markup = markup;
        this.multiplier = multiplier;
        this.notes = notes;
        this.qb_txnlineid = "-1";
        this.updateTimestamp = updateTimestamp;
        this.position = 0;
        this.verify = 0;

    }

    public static Lineitem addLineitem(String job, String plan, String taskType, String itemType, String task, User user) {
        Lineitem lineitem = new Lineitem(null,null,null,null,null,null,null,
                0.0d,"",0.0d,0.0d,0.0d,0.0d,"",new Date());
        if (job!=null&&!job.equals("")) {
            lineitem.job = Job.find.byId(Long.parseLong(job));
        }
        if (plan!=null&&!plan.equals("")) {
            lineitem.plan = Plan.find.byId(Long.parseLong(plan));
        }
        if (taskType!=null&&!taskType.equals("")) {
            lineitem.taskType = TaskType.find.byId(Long.parseLong(taskType));
        }
        if (itemType!=null&&!itemType.equals("")) {
            lineitem.itemType = ItemType.find.byId(Long.parseLong(itemType));
        }
        if (task!=null&&!task.equals("")) {
            lineitem.task = Task.find.byId(Long.parseLong(task));
        }

       /* if (position!=null&&!position.equals("")) {
            lineitem.position = Integer.valueOf(values.get("position"));
        }*/

        if (user!=null) {
            lineitem.user = user;
        }

        lineitem.save();
        return lineitem;
    }

    public static Lineitem update(User user, Long id, Map<String,String> values) {
        Lineitem lineitem = Lineitem.find.ref(id);
        if (values.containsKey("planItem")) {
            String planItem = values.get("planItem");
            if (planItem!=null&&!planItem.equals("")) {
                lineitem.planItem = PlanItem.find.byId(Long.parseLong(planItem));
            } else {
                lineitem.planItem = null;
            }
        }
        if (values.containsKey("itemType")) {
            String itemType = values.get("itemType");
            if (itemType!=null&&!itemType.equals("")) {
                lineitem.itemType = ItemType.find.byId(Long.parseLong(itemType));
            } else {
                lineitem.itemType = null;
            }
        }
        if (values.containsKey("vendor")) {
            String vendor = values.get("vendor");
            if (vendor!=null&&!vendor.equals("")) {
                lineitem.vendor = Vendor.find.byId(Long.parseLong(vendor));
            } else {
                lineitem.vendor = null;
            }
        }
        if (values.containsKey("item")) {
            String item = values.get("item");
            if (item!=null&&!item.equals("")) {
                lineitem.item = Item.find.byId(Long.parseLong(item));
            } else {
                lineitem.item = null;
            }
        }
        if (values.containsKey("task")) {
            String task = values.get("task");
            if (task!=null&&!task.equals("")) {
                lineitem.task = Task.find.byId(Long.parseLong(task));
            } else {
                lineitem.task = null;
            }
        }

        if (values.containsKey("daysdate")) {
            DateFormat format = new SimpleDateFormat("MM-dd-yyyy");
            String datelaleitem = values.get("daysdate");
            try {
                if (datelaleitem!=null&&lineitem.daysdate!=format.parse(datelaleitem)) {
                    lineitem.daysdate = format.parse(datelaleitem);
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }



        if (user!=null) {
            lineitem.user = user;
        }
        if (values.containsKey("quantity")) {
            lineitem.quantity = Double.parseDouble(values.get("quantity"));
        }
        if (values.containsKey("rate")) {
            lineitem.rate = Double.parseDouble(values.get("rate"));
        }
        if (values.containsKey("units")) {
            lineitem.units = values.get("units");
        }
        if (values.containsKey("saleprice")) {
            lineitem.saleprice = Double.parseDouble(values.get("saleprice"));
        }
        if (values.containsKey("markup")) {
            lineitem.markup = Double.parseDouble(values.get("markup"));
        }
        if (values.containsKey("multiplier")) {
            lineitem.multiplier = Double.parseDouble(values.get("multiplier"));
        }
        if (values.containsKey("notes")) {
            lineitem.notes = values.get("notes");
        }
        if (values.containsKey("task1Percentage")) {
            lineitem.updatePercentage(TaskType.find.byId(1L),Double.parseDouble(values.get("task1Percentage")));
        }
        if (values.containsKey("task2Percentage")) {
            lineitem.updatePercentage(TaskType.find.byId(2L),Double.parseDouble(values.get("task2Percentage")));
        }
        if (values.containsKey("task3Percentage")) {
            lineitem.updatePercentage(TaskType.find.byId(3L),Double.parseDouble(values.get("task3Percentage")));
        }
        if (values.containsKey("position")) {
            lineitem.position = Integer.valueOf(values.get("position"));
        }
        if (values.containsKey("verify")) {
            lineitem.verify = Integer.valueOf(values.get("verify"));
        }

        lineitem.update();
        lineitem.refresh();
        return lineitem;
    }

    public static Model.Finder<Long,Lineitem> find = new Model.Finder(Long.class, Lineitem.class);

    public static List<Lineitem> findBudgetLineitemsByJob(Long id) {
        return find.fetch("job")
                .where()
                .eq("job.id", id)
                .isNull("taskType")
                .findList();
    }

    public static List<Lineitem> findActualLineitemsByJob(Long id) {
        return find.fetch("job")
                .where()
                .eq("job.id", id)
                .isNotNull("taskType")
                .findList();
    }

    public static List<Lineitem> findByPlan(Long id) {
        return find.fetch("plan")
                .where()
                .eq("plan.id", id)
                .findList();
    }

    public void updatePercentage(TaskType taskType, Double pct) {
        for (LineitemPercentage lineitemPercentage : percentages) {
            if (lineitemPercentage.taskType.equals(taskType)) {
                lineitemPercentage.percentage = pct;
                lineitemPercentage.update();

                return;
            }
        }

        LineitemPercentage lineitemPercentage = new LineitemPercentage();
        lineitemPercentage.lineitem = this;
        lineitemPercentage.taskType = taskType;
        lineitemPercentage.percentage = pct;
        lineitemPercentage.save();
    }
}
