package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:59 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class JobBudgetItem extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    @JsonIgnore
    public Job job;
    @ManyToOne
    public TaskType taskType;
    @ManyToOne
    @Constraints.Required
    public ItemType itemType;

    public Double sqft_multiplier;
    public Double price_multiplier;
    public Double total;
    public Double add_on_sale;
    @Constraints.Required
    public boolean completed;

    public JobBudgetItem(){
        sqft_multiplier = (double) 0;
        price_multiplier = (double) 0;
        total = (double) 0;
        add_on_sale = (double) 0;
        completed = false;
    }

    public static JobBudgetItem addJobBudgetItem(Job job, TaskType taskType, ItemType itemType, Double sqft_multiplier,
                                                 Double price_multiplier) {
        JobBudgetItem jobBudgetItem = new JobBudgetItem();
        jobBudgetItem.job = job;
        jobBudgetItem.taskType = taskType;
        jobBudgetItem.itemType = itemType;
        jobBudgetItem.sqft_multiplier = sqft_multiplier;
        jobBudgetItem.price_multiplier = price_multiplier;
        jobBudgetItem.save();
        return jobBudgetItem;
    }

    public static Model.Finder<Long,JobBudgetItem> find = new Model.Finder(Long.class, JobBudgetItem.class);

    public static List<JobBudgetItem> findByJob(Long id) {
        return find.fetch("job")
                .where()
                .eq("job.id", id)
                .findList();
    }

    public static String update(Long id, Map<String,String> values) {
        JobBudgetItem budgetItem = find.ref(id);
        if (values.containsKey("total")) {
            budgetItem.total = Double.parseDouble(values.get("total"));
        }
        if (values.containsKey("completed")) {
            budgetItem.completed = Boolean.parseBoolean(values.get("completed"));
        }
        budgetItem.update();
        return "OK";
    }
}
