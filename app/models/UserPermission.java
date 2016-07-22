package models;

import be.objectify.deadbolt.core.models.Permission;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 8/1/13
 * Time: 10:54 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class UserPermission extends Model implements Permission {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    public Long id;

    public String value;

    public static final Model.Finder<Long, UserPermission> find = new Model.Finder<Long, UserPermission>(
            Long.class, UserPermission.class);

    public String getValue() {
        return value;
    }

    public static UserPermission findByValue(String value) {
        return find.where().eq("value", value).findUnique();
    }
}
