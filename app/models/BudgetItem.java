package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:50 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class BudgetItem extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public Budget budget;
    @ManyToOne
    public TaskType taskType;
    @ManyToOne
    @Constraints.Required
    public ItemType itemType;

    public Double sqft_multiplier;
    public Double price_multiplier;

    public BudgetItem(){
        sqft_multiplier = (double) 0;
        price_multiplier = (double) 0;
    }
}
