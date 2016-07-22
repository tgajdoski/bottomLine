package models;

import org.codehaus.jackson.annotate.JsonIgnore;
import play.db.ebean.Model;

import javax.persistence.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/3/13
 * Time: 12:03 PM
 * To change this template use File | Settings | File Templates.
 */
@Entity
public class LineitemTotals extends Model implements Comparable<LineitemTotals>{

    public String market;
    public String subdivision;
    public String vendor;
    public String item;
    public Long  itemid;
    public Double rate;
    public Double quantity;
    public Double saleprice;
    public Date taskDate;
    public Integer crew;



    public int compareTo(LineitemTotals compareFruit) {

        int compareQuantity =  compareFruit.crew;

        //ascending order
        return this.crew - compareQuantity;

        //descending order
        //return compareQuantity - this.quantity;

    }

    public static Comparator<LineitemTotals> FruitNameComparator
            = new Comparator<LineitemTotals>() {

        public int compare(LineitemTotals fruit1, LineitemTotals fruit2) {

            int fruitName1 = fruit1.crew;
            int fruitName2 = fruit2.crew;

            //ascending order
            return fruit1.compareTo(fruit2);

            //descending order
            //return fruitName2.compareTo(fruitName1);
        }

    };

}
