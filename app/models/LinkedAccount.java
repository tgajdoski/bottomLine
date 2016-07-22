package models;

import com.feth.play.module.pa.user.AuthUser;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 8/1/13
 * Time: 10:27 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class LinkedAccount extends Model {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    public Long id;

    @ManyToOne
    public User user;

    public String providerUserId;
    public String providerKey;

    public static final Finder<Long, LinkedAccount> find = new Finder<Long, LinkedAccount>(
            Long.class, LinkedAccount.class);

    public static LinkedAccount findByProviderKey(final User user, String key) {
        return find.where().eq("user", user).eq("providerKey", key)
                .findUnique();
    }

    public static LinkedAccount create(final AuthUser authUser) {
        final LinkedAccount ret = new LinkedAccount();
        ret.update(authUser);
        return ret;
    }

    public void update(final AuthUser authUser) {
        this.providerKey = authUser.getProvider();
        this.providerUserId = authUser.getId();
    }

    public static LinkedAccount create(final LinkedAccount acc) {
        final LinkedAccount ret = new LinkedAccount();
        ret.providerKey = acc.providerKey;
        ret.providerUserId = acc.providerUserId;

        return ret;
    }
}
