package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.db.ebean.Model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class JobCategory extends Model {
    @Id
    public Long id;

    public String name;
    public String abbr;

    public Integer active;

    @OneToMany(mappedBy = "jobCategory")
    @JsonIgnore
    public List<Job> jobs = new ArrayList<Job>();

    public static Finder<Long,JobCategory> find = new Finder<Long,JobCategory>(
            Long.class, JobCategory.class
    );
}
