package models;

import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/21/13
 * Time: 12:29 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Link extends Model {
    @Id
    public Long id;

    @ManyToOne
    public User user;

    public String name;
    public String url;
}
