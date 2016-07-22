package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Vendor extends Model {
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
    public Date insurance_date;

    public String expense_account;
    public Integer active;
    public Integer employee;
    public Integer type_1099;
    public Integer invoice;


    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "vendor")
    @JsonIgnore
    public List<VendorItem> vendorItems = new ArrayList<VendorItem>();
    @OneToMany(mappedBy = "vendor")
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();

    public static Model.Finder<Long,Vendor> find = new Model.Finder(Long.class, Vendor.class);
}
