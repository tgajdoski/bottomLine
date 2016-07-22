package models;

import play.db.ebean.Model;
import be.objectify.deadbolt.core.models.Role;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 8/1/13
 * Time: 10:28 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class SecurityRole extends Model implements Role {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    public Long id;

    public String roleName;

    public static final Finder<Long, SecurityRole> find = new Finder<Long, SecurityRole>(
            Long.class, SecurityRole.class);

    @Override
    public String getName() {
        return roleName;
    }

    public static SecurityRole findByRoleName(String roleName) {
        return find.where().eq("roleName", roleName).findUnique();
    }
}
