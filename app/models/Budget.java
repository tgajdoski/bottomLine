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
 * Time: 4:50 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Budget extends Model {
    @Id
    public Long id;

    @Constraints.Required
    public String name;

    public Double op_multiplier;
    public Double bfc_multiplier;

    @OneToMany(mappedBy = "budget")
    @JsonIgnore
    public List<BudgetItem> budgetItems = new ArrayList<BudgetItem>();

    public Budget(){
        op_multiplier = (double) 0;
        bfc_multiplier = (double) 0;
    }

    public static Model.Finder<Long, Budget> find = new Model.Finder<Long, Budget>(
            Long.class, Budget.class);
}
