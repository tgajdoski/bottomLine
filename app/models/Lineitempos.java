package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Lineitempos extends Model {
    @Id
    public Long id;


    @Constraints.Required
    public Long lineitemid;
    public Long taskid;
    public Long fromwhere;
    public Date datepurchase;
    public Long purchaseby;
    public Long historyflag;
    public String notes;

    public static Model.Finder<Long, Lineitempos> find = new Model.Finder(Long.class, Lineitempos.class);
}
