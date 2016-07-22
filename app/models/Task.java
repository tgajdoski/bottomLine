package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 4:30 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Task extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public Job job;
    @ManyToOne
    @Constraints.Required
    public TaskType taskType;

    @Constraints.Required
    public Date date;
    @Constraints.Required
    public int crew;
    @Constraints.Required
    public int cardOrder;
    @Column(columnDefinition = "BLOB")
    public String notes;
    @Constraints.Required
    public boolean completed;
    @Version
    @Column(name = "update_timestamp")
    public Date updateTimestamp;

    @PreUpdate
    @PrePersist
    void updateTimestamp(){
        this.updateTimestamp = new Date();
    }

    @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "task")
    @JsonIgnore
    public List<Manager> managers = new ArrayList<Manager>();
    @OneToMany(mappedBy = "task")
    @JsonIgnore
    public List<Lineitem> lineitems = new ArrayList<Lineitem>();

    public Task(){
        crew = 1;
        cardOrder = 1;
        notes = "";
        completed = false;

        Calendar calendar = Calendar.getInstance();
        calendar.set(calendar.get(Calendar.YEAR),calendar.get(Calendar.MONTH),calendar.get(Calendar.DATE),0,0,0);

        date = calendar.getTime();
    }

    public static Task addTask(String job, String taskType, String crew, Date date) {
        Task task = new Task();
        if (crew!=null&&!crew.equals("")) {
            task.crew = Integer.parseInt(crew);
        }
        if (date!=null) {
            task.date = date;
        }
        List<Task> tasks = find.where().eq("date", task.date).eq("crew",task.crew).orderBy("cardOrder asc").findList();

        task.job = Job.find.byId(Long.parseLong(job));
        task.taskType = TaskType.find.byId(Long.parseLong(taskType));
        task.cardOrder = (tasks.size()>0)?tasks.get(tasks.size()-1).cardOrder+1:1;

        task.save();
        return task;
    }


    public static Task addTaskLabor(String job, String taskType, String crew, Date date, String note) {
        Task task = new Task();
        if (crew!=null&&!crew.equals("")) {
            task.crew = Integer.parseInt(crew);
        }
        if (date!=null) {
            task.date = date;
        }
        List<Task> tasks = find.where().eq("date", task.date).eq("crew",task.crew).orderBy("cardOrder asc").findList();

        task.job = Job.find.byId(Long.parseLong(job));
        task.taskType = TaskType.find.byId(Long.parseLong(taskType));
        task.cardOrder = (tasks.size()>0)?tasks.get(tasks.size()-1).cardOrder+1:1;
        task.notes = note;

        task.save();
        return task;
    }


    public static List<Task> update(Long id, Map<String,String> values) {
        Task task = find.ref(id);
        List<Task> tasks = new ArrayList<Task>();
        List<Task> oldTasks = new ArrayList<Task>();
        DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String date = values.get("date");
        if (values.containsKey("cardOrder")) {
            int order = Integer.parseInt(values.get("cardOrder"));
            try {
                if ((values.containsKey("crew")&&task.crew!=Integer.parseInt(values.get("crew")))
                        ||(date!=null&&format.format(task.date)!=date)) {
                    oldTasks = find.where().eq("date", task.date).eq("crew",task.crew).ne("id",id).orderBy("cardOrder asc").findList();
                    int o = 1;
                    for (Task t: oldTasks) {
                        t.cardOrder = o;
                        t.update();
                        o++;
                    }
                    if (date!=null&&task.date!=format.parse(date)) {
                        task.date = format.parse(date);
                    }
                    task.crew = Integer.parseInt(values.get("crew"));
                }
            }
            catch(ParseException pe) {
                System.out.println("ERROR: Cannot parse \"" + values.get("date") + "\"");
            }
            tasks = find.where().eq("date", task.date).eq("crew",task.crew).ne("id",id).orderBy("cardOrder asc").findList();
            int o = 1;
            for (Task t: tasks) {
                if (o==order) {
                    o++;
                }
                t.cardOrder = o;
                t.update();
                o++;
            }
            task.cardOrder = (tasks.size()<order)?o:order;
        }
        else
        {
            if (date!=null) {
                try {
                    task.date = format.parse(date);
                }
                catch(ParseException pe) {
                    System.out.println("ERROR: Cannot parse \"" + date + "\"");
                }
            }
            if (values.containsKey("crew")) {
                task.crew = Integer.parseInt(values.get("crew"));
            }
        }
        if (values.containsKey("manager")) {
            String userId = values.get("manager");
            User user;
            Manager manager;
            if (userId!=null&&!userId.equals("")) {
                user = User.find.byId(Long.parseLong(userId));
                if (task.managers.isEmpty()) {
                    manager = new Manager();
                    manager.job = task.job;
                    manager.task = task;
                    manager.user = user;
                    manager.save();
                } else {
                    manager = task.managers.get(0);
                    manager.user = user;
                    manager.update();
                }
            } else if (!task.managers.isEmpty()) {
                manager = task.managers.get(0);
                manager.delete();
            }
        }
        if (values.containsKey("notes")) {
            task.notes = values.get("notes");
        }
        if (values.containsKey("completed")) {
            task.completed = Boolean.parseBoolean(values.get("completed"));
        }
        task.update();

        oldTasks.addAll(tasks);
        return oldTasks;
    }

    public static Model.Finder<Long,Task> find = new Model.Finder(Long.class, Task.class);

    public static List<Task> findByJob(Long id) {
        return find.fetch("job")
                .where()
                .eq("job.id", id)
                .findList();
    }

    public static List<Task> findWithinDatesForMarket(String d1, String d2, String market) {
        return find.where()
                .isNotNull("job")
                .eq("job.market.id",market)
                .ge("date",d1)
                .le("date",d2)
                .findList();
    }


    public static List<Task> findWithinDatesForMarketandCategory(String d1, String d2, String market, String category) {
        return find.where()
                .isNotNull("job")
                .eq("job.market.id",market)
                .eq("job.jobCategory.id",category)
                .ge("date",d1)
                .le("date",d2)
                .findList();
    }


    public static List<Task> findWithinDatesForCategory(String d1, String d2, String category) {
        return find.where()
                .isNotNull("job")
                .eq("job.jobCategory.id",category)
                .ge("date",d1)
                .le("date",d2)
                .findList();
    }

    public static List<Task> findWithinDates(String d1, String d2) {
       /* return find.where()
                .isNotNull("job")
                .ge("date",d1)
                .lt("date",d2)
                .findList();*/
        return find.where()
                .isNotNull("job")
                .between("date", d1, d2).setOrderBy("cardOrder").findList();
    }
}
