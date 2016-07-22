package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:45 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class VendorItem extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Vendor vendor;
    @ManyToOne
    public Item item;

    public Double default_rate;
    public String default_units;

    public String qb_listid;
    public int qb_editsequence;

    public VendorItem(){
        default_rate = (double) 0;
    }

    public static Model.Finder<Long,VendorItem> find = new Model.Finder(Long.class, VendorItem.class);


}
