package models;

import play.db.ebean.Model;

import javax.persistence.*;

/**
 * Created by Jonathan on 4/1/14.
 */
@Entity
public class LineitemPercentage extends Model {
    @Id
    public Long id;
    @ManyToOne
    public Lineitem lineitem;
    @ManyToOne
    public TaskType taskType;

    public Double percentage;

    public static Model.Finder<Long,LineitemPercentage> find = new Model.Finder(Long.class, LineitemPercentage.class);

}
