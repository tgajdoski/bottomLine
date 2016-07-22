package models;

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
 * Time: 4:40 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class PlanItem extends Model {
    @Id
    public Long id;

    public String name;

    @OneToMany(mappedBy = "planItem")
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();
    @OneToMany(mappedBy = "planItem")
    public List<Dimension> dimensions = new ArrayList<Dimension>();

    public static Finder<Long,PlanItem> find = new Finder<Long,PlanItem>(
            Long.class, PlanItem.class
    );
}
