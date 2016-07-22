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
public class Assigns extends Model {
    @Id
    public Long id;


    @Constraints.Required
    public Long jobid;
    public Long taskid;
    public Date datetask;
    public Long fieldmanagerid;
    public Date dateassign;
    public Long assigneby;

    public static Model.Finder<Long, Assigns> find = new Model.Finder(Long.class, Assigns.class);
}
