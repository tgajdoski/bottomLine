package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;
import play.mvc.Http;

import javax.persistence.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/21/13
 * Time: 11:52 AM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Login extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public User user;

    public String ip;

    @Column(columnDefinition = "BLOB")
    public String agent;

    @Column(columnDefinition = "BLOB")
    public String info;

    @Column(name = "ts")
    public Date updateTimestamp;

    public static Model.Finder<Long,Login> find = new Model.Finder(Long.class, Login.class);

    public static String loginUser(User user, Http.Request request) {
        Login login = new Login();
        login.user = user;
        login.ip = request.remoteAddress();
        login.agent = request.getHeader("User-Agent");
        login.updateTimestamp = new Date();
        login.save();
        login.refresh();

        return login.id.toString();
    }
}
