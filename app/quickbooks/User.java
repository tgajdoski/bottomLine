package quickbooks;

import play.db.ebean.Model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 8/6/13
 * Time: 4:27 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="quickbooks_user")
public class User extends Model {
    @Id
    @Column(name = "qb_username", nullable = false, length = 40)
    public String username;

    @Column(name = "qb_password", nullable = false, length = 255)
    public String password;

    @Column(name = "qb_company_file", columnDefinition = "varchar(255) DEFAULT NULL")
    public String companyFile;

    @Column(name = "qbwc_wait_before_next_update", columnDefinition = "int(10) UNSIGNED")
    public Integer qbwcWaitBeforeNextUpdate;

    @Column(name = "qbwc_min_run_every_n_seconds", columnDefinition = "int(10) UNSIGNED")
    public Integer qbwcMinRunEveryNSeconds;

    @Column(columnDefinition = "char(1) NOT NULL")
    public Character status;

    @Column(nullable = false)
    public Date writeDatetime;

    @Column(nullable = false)
    public Date touchDatetime;

    public static Model.Finder<String, User> find = new Model.Finder<String, User>(
            "quickbooks", String.class, User.class);
}
