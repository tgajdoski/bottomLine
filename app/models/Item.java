package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Item extends Model {
    @Id
    public Long id;

    @ManyToOne
    public ItemType itemType;

    @Constraints.Required
    public String name;

    public String qb_listid;
    public Integer active;

    @OneToMany(mappedBy = "item")
    @JsonIgnore
    public List<Job> jobs = new ArrayList<Job>();
    @OneToMany(mappedBy = "item")
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "item")
    @JsonIgnore
    public List<VendorItem> vendorItems = new ArrayList<VendorItem>();

    public static Model.Finder<Long,Item> find = new Model.Finder(Long.class, Item.class);
}
