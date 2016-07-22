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
public class AccountType extends Model {

    @Id
    public Long id;
    @Constraints.Required
    public String account;
    public String tpe;
    public Integer active;

    public static Model.Finder<Long, AccountType> find = new Model.Finder(Long.class, AccountType.class);
}
