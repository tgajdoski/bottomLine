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
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Market extends Model {
    @Id
    public Long id;

    @Constraints.Required
    public String city;
    public String state;
    public String url;
    public String woeid;
    public Double taxrate;

    @OneToMany(mappedBy = "market")
    @JsonIgnore
    public List<Job> jobs = new ArrayList<Job>();
    @OneToMany(mappedBy = "market")
    @JsonIgnore
    public List<Customer> customers = new ArrayList<Customer>();
    @OneToMany(mappedBy = "market")
    @JsonIgnore
    public List<Vendor> vendors = new ArrayList<Vendor>();

    public Market(){
        taxrate = (double) 0;
        url = "";
        woeid = "2357024";
    }

    public static Model.Finder<Long,Market> find = new Model.Finder(Long.class, Market.class);

}
