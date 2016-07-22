package models;

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
 * Time: 4:45 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Company extends Model {
    @Id
    public Long id;

    @Constraints.Required
    public String name;

    @OneToMany(mappedBy = "company")
    public List<User> users = new ArrayList<User>();
}
