package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/3/13
 * Time: 4:04 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Attachment extends Model {
    @Id
    public Long id;

    @ManyToOne
    public Job job;
    @ManyToOne
    public Plan plan;

    @Constraints.Required
    public String attachment_path;

    public Attachment(Job job, Plan plan, String attachment_path) {
        if (job != null) {
            this.job = job;
        }
        if (plan != null) {
            this.plan = plan;
        }
        this.attachment_path = attachment_path;
    }

    public static Attachment addAttachment(String job, String plan, String attachment_path) {
        Attachment attachment = new Attachment(null,null,
                attachment_path);
        if (job!=null&&job!="") {
            attachment.job = Job.find.byId(Long.parseLong(job));
        }
        if (plan!=null&&plan!="") {
            attachment.plan = Plan.find.byId(Long.parseLong(plan));
        }
        attachment.save();
        return attachment;
    }

    public static Model.Finder<Long,Attachment> find = new Model.Finder(Long.class, Attachment.class);
}
