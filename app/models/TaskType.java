package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:44 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class TaskType extends Model {
    @Id
    public Long id;

    @Constraints.Required
    public String name;

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "taskType")
    @JsonIgnore
    public List<Task> tasks = new ArrayList<Task>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "taskType")
    @JsonIgnore
    public List<BudgetItem> budgetItems = new ArrayList<BudgetItem>();
    @OneToMany(cascade = CascadeType.ALL)
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();

    public static Model.Finder<Long,TaskType> find = new Model.Finder(Long.class, TaskType.class);
}
