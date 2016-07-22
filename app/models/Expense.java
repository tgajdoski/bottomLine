package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Expense extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public AccountType accountType;

    public Date billdate;
    public Date qbbilldate;
    public Date discountdate;
    public String note;
    public String billnumber;
    @ManyToOne
    @Constraints.Required
    public Market market;
    @ManyToOne
    @Constraints.Required
    public Vendor vendor;
    public Double amount;





    public Expense( Market market, AccountType accountType, Vendor vendor,Double amount, String note, Date billdate, Date qbbilldate,  Date dicsdate, String billnumber) {
        if (accountType != null) {
            this.accountType = accountType;
        }
        if (vendor != null) {
            this.vendor = vendor;
        }
        if (market != null) {
            this.market = market;
        }
        this.note = note;
        this.amount = amount;
        this.billdate = billdate;
        this.qbbilldate = qbbilldate;
        this.discountdate = discountdate;
        this.billnumber = billnumber;
    }


    public static Expense addExpense(String accountTypeid, String marketis, String vendorid, Double amount, String note, Date datebill, Date qbbilldate, Date dicsdate, String billnumber) {

        Expense expense = new Expense(null,null,null,0.0d,"",new Date(),new Date(),new Date(),null);

        if (accountTypeid!=null&&!accountTypeid.equals("")) {
            expense.accountType = AccountType.find.byId(Long.parseLong(accountTypeid));
        }
        if (marketis!=null&&!marketis.equals("")) {
            expense.market = Market.find.byId(Long.parseLong(marketis));
        }
        if (vendorid!=null&&!vendorid.equals("")) {
            expense.vendor = Vendor.find.byId(Long.parseLong(vendorid));
       }
        expense.amount = amount;
        expense.note = note;
        expense.billdate = datebill;
        expense.discountdate = dicsdate;

        expense.qbbilldate = qbbilldate;
        expense.billnumber = billnumber;

        expense.save();
        return expense;
    }





    public static Model.Finder<Long, Expense> find = new Model.Finder<Long, Expense>(
            Long.class, Expense.class);
}
