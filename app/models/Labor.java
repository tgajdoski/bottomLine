package models;

import play.data.validation.Constraints;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;
import java.util.*;




import org.codehaus.jackson.annotate.JsonIgnore;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;


/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 5/20/13
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class Labor extends Model {
    @Id
    public Long id;

    @ManyToOne
    @Constraints.Required
    public Market market;

    @ManyToOne
    @Constraints.Required
    public Vendor vendor;

    public Date labordate;
    public Date billdate;
    public Double amounthours;
    public Double payrate;
    public String note;

    public Labor(Market market, Vendor vendor, Date labordate, Date billdate, Double amounthours, Double payrate, String note) {

        if (vendor != null) {
            this.vendor = vendor;
        }
        if (market != null) {
            this.market = market;
        }

        this.labordate = labordate;
        this.billdate = billdate;
        this.amounthours = amounthours;
        this.payrate = payrate;
        this.note = note;

    }


    public static Labor addLabor(String marketis, String vendorid, Date labordate,Date billdate, Double amounthours, Double payrate, String note) {

        Labor lab = new Labor(null,null,new Date(),new Date(),null, null,"");


        if (marketis!=null&&!marketis.equals("")) {
            lab.market = Market.find.byId(Long.parseLong(marketis));
        }
        if (vendorid!=null&&!vendorid.equals("")) {
            lab.vendor = Vendor.find.byId(Long.parseLong(vendorid));
       }


        lab.labordate = labordate;
        lab.billdate = billdate;
        lab.amounthours = amounthours;

        lab.payrate = payrate;
        lab.note = note;

        lab.save();
        return lab;
    }


    public static Model.Finder<Long,Labor> find = new Model.Finder(Long.class, Labor.class);




    public static List<Labor> findWithinDatesForMarket(String d1, String d2, String market) {
        return find.where()
                .eq("market.id", market)
                .ge("labordate",d1)
                .le("labordate",d2)
                .findList();
    }


    public static List<Labor> findWithinDatesForMarketandVendor(String d1, String d2, String market, String vendor) {
        return find.where()
                .eq("market.id", market)
                .eq("vendor.id",vendor)
                .ge("labordate",d1)
                .le("labordate",d2)
                .findList();
    }


    public static List<Labor> findWithinDatesForVendor(String d1, String d2, String vendor) {
        return find.where()
                .eq("vendor.id",vendor)
                .ge("labordate",d1)
                .le("labordate",d2)
                .findList();
    }

    public static List<Labor> findWithinDates(String d1, String d2) {
        return find.where()
                .between("labordate", d1, d2).setOrderBy("labordate").findList();
      //  return Labor.find.all();

}

}
