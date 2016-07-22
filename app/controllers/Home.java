package controllers;

import models.ItemType;
import models.JobCategory;
import models.Market;
import models.User;
import play.Logger;
import play.Play;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
/*import views.html.restricted;*/

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/3/13
 * Time: 9:39 AM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Home extends Controller {
    public static Result test() {
        if (Play.isDev()) {
            return ok(
                  /*  views.html.test.render(
                            User.find.byId(Long.parseLong(request().username())),
                            Market.find.all(),
                            User.find.all(),
                            ItemType.find.all(),
                            JobCategory.find.all())*/
            );
        } else {
            return forbidden(/*restricted.render(Application.getLocalUser(session()))*/);
        }
    }



    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return ok(/*views.html.index_rd.render(
                    User.find.byId(Long.parseLong(request().username())),
                    Market.find.all(),
                    User.find.all(),
                    ItemType.find.all(),
                    JobCategory.find.all())*/
            );
        } else {
            return forbidden(/*restricted.render(Application.getLocalUser(session()))*/);
        }
    }


    public static Result getUserSelect() {
        if (Secured.hasAdministratorAccess()) {
            return ok(views.html.userselect.render(User.find.all()));
        } else {
            return forbidden();
        }
    }
}
