package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:33 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class ItemType extends Model {
    @Id
    public Long id;

    @Constraints.Required
    public String name;
    public Double markup;

    @OneToMany(mappedBy = "itemType")
    @JsonIgnore
    public List<Item> items = new ArrayList<Item>();
    @OneToMany(mappedBy = "itemType")
    @JsonIgnore
    public List<BudgetItem> budgetItems = new ArrayList<BudgetItem>();
    @OneToMany(mappedBy = "itemType")
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();

    public ItemType(){
        markup = (double) 0;
    }

    public static Model.Finder<Long,ItemType> find = new Model.Finder(Long.class, ItemType.class);

    public static Map<String,String> options() {
        Map<String,String> optionsMap = new HashMap<String,String>();
        for (ItemType itemType : find.all()) {
            optionsMap.put(itemType.id.toString(),itemType.name);
        }
        return optionsMap;
    }
}
