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
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Subdivision extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Customer customer;

    @Constraints.Required
    public String name;
    public String address1;
    public String address2;
    public String city;
    public String state;
    public String zip;
    public String contact_name;
    public String contact_number1;
    public String contact_number2;
    public String contact_fax;
    public String contact_email1;
    public String contact_email2;
    public String contact_email3;
    public String url;

    public String qb_listid;

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "subdivision")
    @JsonIgnore
    public List<Job> jobs = new ArrayList<Job>();

    public static Model.Finder<Long,Subdivision> find = new Model.Finder(Long.class, Subdivision.class);

    public Subdivision(Customer customer, String name){
        this.customer = customer;
        this.name = name;
        this.url = "";
    }

    public static void delete(Long id) {
        Subdivision subdivision = find.ref(id);
        for (Job job : subdivision.jobs) {
            job.delete();
        }
        subdivision.delete();
    }


}
