package quickbooks;

import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 8/6/13
 * Time: 4:16 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
@Table(name = "quickbooks_queue", uniqueConstraints = {
        @UniqueConstraint(name = "quickbooks_ticket_id", columnNames = {"quickbooks_ticket_id"}),
        @UniqueConstraint(name = "priority", columnNames = {"priority"}),
        @UniqueConstraint(name = "qb_username", columnNames = {"qb_username", "qb_action", "ident", "qb_status"}),
        @UniqueConstraint(name = "qb_status", columnNames = {"qb_status"})
})
public class Queue extends Model {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "quickbooks_queue_id", columnDefinition = "int(10) UNSIGNED")
    public Integer id;

    @ManyToOne
    @JoinColumn(name = "quickbooks_ticket_id", referencedColumnName = "quickbooks_ticket_id", columnDefinition = "int(10) UNSIGNED DEFAULT NULL")
    public Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "qb_username", referencedColumnName = "qb_username", columnDefinition = "varchar(40) NOT NULL")
    public User username;

    @Column(name = "qb_action", nullable = false, length = 32)
    public String action;

    @Column(nullable = false, length = 40)
    public String ident;

    @Column(columnDefinition = "text")
    public String extra;

    @Column(columnDefinition = "text")
    public String qbxml;

    @Column(columnDefinition = "int(10) UNSIGNED DEFAULT '0'")
    public Integer priority;

    @Column(name = "qb_status", columnDefinition = "char(1) NOT NULL")
    public Character status;

    @Column(columnDefinition = "text")
    public String msg;

    @Column(nullable = false)
    public Date enqueueDatetime;

    @Column(columnDefinition = "datetime DEFAULT NULL")
    public Date dequeueDatetime;
}
