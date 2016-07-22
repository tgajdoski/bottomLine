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
 * Time: 4:29 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Rate extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Item item;

    @Constraints.Required
    public Double rate;
    @Constraints.Required
    public String units;

    public Rate(){
        rate = (double) 0;
    }
}
