package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:38 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Manager extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public Job job;
    @ManyToOne
    public Task task;
    @ManyToOne
    @Constraints.Required
    public User user;
}
