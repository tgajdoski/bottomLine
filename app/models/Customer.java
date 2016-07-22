package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Customer extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Market market;

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

    public String qb_listid;
    public int qb_editsequence;

    public Integer active;

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "customer")
    @JsonIgnore
    public List<Subdivision> subdivisions = new ArrayList<Subdivision>();
    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "customer")
    @JsonIgnore
    public List<Plan> plans = new ArrayList<Plan>();

    public static Model.Finder<Long,Customer> find = new Model.Finder(Long.class, Customer.class);

    public Customer(String name){
        this.name = name;
        this.qb_editsequence = 0;
    }

    public static void delete(Long id) {
        Customer customer = find.ref(id);
        for (Subdivision subdivision : customer.subdivisions) {
            Subdivision.delete(subdivision.id);
        }
        customer.delete();
    }
}
