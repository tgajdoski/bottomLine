package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Bill extends Model {
    @Id
    public Long id;


    @ManyToOne
    @Constraints.Required
    public Market market;

    @ManyToOne
    @Constraints.Required
    public Vendor vendor;



    public String billnumber;
    public Date billdate;

    public Double amount;
    public Long job_id;
    public String note;

    public String termsfullname;
    public Date duedate;
    public Date incurreddate;
    public Date enterdate;
    @ManyToOne
    @Constraints.Required
    public AccountType accountType;
    public String accountfullname;

    public Bill(Market market, Vendor vendor, Double amount, String note, Date billdate, String billnumber,  Long job_id, Date duedate, String termsfullname,  AccountType accountType, String accountfullname, Date incurreddate, Date enterdate) {


        if (vendor != null) {
            this.vendor = vendor;
        }
        if (market != null) {
            this.market = market;
        }
        this.note = note;
        this.amount = amount;
        this.billdate = billdate;
        this.incurreddate = incurreddate;
        this.job_id = job_id;

        this.billnumber = billnumber;


        this.duedate = duedate;


        if (accountType != null) {
            this.accountType = accountType;
        }
        this.termsfullname = termsfullname;
        this.accountfullname = accountfullname;

        this.enterdate = enterdate;

    }


    public static Bill addBill(String marketis, String vendorid, Double amount, String note, Date datebill, String billnumber, String jobnumber,  Date duedate, String termsfullname,  Long accountType, String accountfullname, Date incurreddate) {

        Bill bill = new Bill(null,null,0.0d,"",new Date(),null, null, new Date(), "",null,"", new Date(), new Date());


        if (marketis!=null&&!marketis.equals("")) {
            bill.market = Market.find.byId(Long.parseLong(marketis));
        }
        if (vendorid!=null&&!vendorid.equals("")) {
            bill.vendor = Vendor.find.byId(Long.parseLong(vendorid));
       }


        bill.amount = amount;
        bill.note = note;
        bill.billdate = datebill;
        bill.incurreddate = incurreddate;

        bill.billnumber = billnumber;

        if (jobnumber!="")
            bill.job_id = Long.parseLong(jobnumber);


        bill.duedate = duedate;
        bill.termsfullname = termsfullname;
        bill.accountfullname =accountfullname;
        if (accountType!=null&&!accountType.equals("")) {
            bill.accountType = AccountType.find.byId(accountType);
        }


        bill.save();
        return bill;
    }



    public static Model.Finder<Long, Bill> find = new Model.Finder<Long, Bill>(
            Long.class, Bill.class);
}
