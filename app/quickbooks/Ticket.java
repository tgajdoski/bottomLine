package quickbooks;

import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 8/6/13
 * Time: 4:22 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name="quickbooks_ticket", uniqueConstraints = {
        @UniqueConstraint(name = "ticket", columnNames = {"ticket"})
})
public class Ticket extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "quickbooks_ticket_id", columnDefinition = "int(10) UNSIGNED")
    public Integer id;

    @ManyToOne
    @JoinColumn(name = "qb_username", referencedColumnName = "qb_username", columnDefinition = "varchar(40) NOT NULL")
    public User username;

    @Column(columnDefinition = "char(36) NOT NULL")
    public Character ticket;

    @Column(columnDefinition = "int(10) UNSIGNED DEFAULT '0'")
    public Integer processed;

    @Column(columnDefinition = "varchar(32) DEFAULT NULL")
    public String lasterrorNum;

    @Column(columnDefinition = "varchar(255) DEFAULT NULL")
    public String lasterrorMsg;

    @Column(columnDefinition = "char(15) NOT NULL")
    public Character ipaddr;

    @Column(nullable = false)
    public Date writeDatetime;

    @Column(nullable = false)
    public Date touchDatetime;
}
