package controllers;
import views.*;
import models.*;
import org.apache.commons.codec.digest.DigestUtils;
import play.data.Form;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Security;
import providers.MyUsernamePasswordAuthUser;
import views.html.helper.form;

import static play.data.Form.form;
import static play.libs.Json.toJson;


/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/25/13
 * Time: 10:10 AM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Users_rd extends Controller {
    public static Result index() {
        if (Secured.hasAdministratorAccess()) {
            return ok(
                    views.html.users.index_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            User.find.all()
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result addUser() {
        if (Secured.hasGuestAccess()) {
            Form<User> userForm = play.data.Form.form(User.class);
return ok(views.html.users.adduser.render( User.find.byId(Long.parseLong(request().username())),userForm));
        } else {
            return forbidden();
        }

    }

    public static Result saveUser(){
            if (Secured.hasAdministratorAccess()) {
            User user = new User();
            user.authority = 0;
            user.username = form().bindFromRequest().get("username");
            user.name = form().bindFromRequest().get("username");
            user.password = DigestUtils.md5Hex(form().bindFromRequest().get("password"));
             /*   String password = form().bindFromRequest().get("password");
                if (password != null && !password.equals("")) {
                    user.changePassword(new MyUsernamePasswordAuthUser(password),
                            true);
                }*/


            user.save();
            return ok(
                   /* views.html.users.user_rd.render(
                            user*/
                    views.html.users.index_rd.render(
                            User.find.byId(Long.parseLong(request().username())),
                            User.find.all()
                    )
            );
        } else {
            return forbidden();
        }
    }

    public static Result deleteUser() {
        if (Secured.hasAdministratorAccess()) {
            User user = User.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            user.delete();
            return ok();
        } else {
            return forbidden();
        }
    }



    public static Result updateActive() {

        if (Secured.hasGuestAccess()) {
            String userid = form().bindFromRequest().get("userid");
            String active = form().bindFromRequest().get("active");

            // zemi array od ajax
            if (userid != null && userid != "")
            {
                User p = User.find.byId(Long.parseLong(userid));
                if (p!=null){
                    if (active.equals("true"))
                        p.active = true;
                    else
                        p.active = false;
                    p.update();
                }
                return ok();
            }
            else
                return forbidden();
        } else {
            return forbidden();
        }


    }

    public static Result updateUser() {
        if (Secured.hasAdministratorAccess()) {
            User user = User.find.byId(Long.parseLong(form().bindFromRequest().get("id")));
            if (!user.active)
                user.active = true;
            if (!user.emailValidated)
                user.emailValidated = true;
            String authority = form().bindFromRequest().get("authority");
            if (authority != null && !authority.equals("")) {
                user.authority = Integer.parseInt(form().bindFromRequest().get("authority"));
            }
            String password = form().bindFromRequest().get("password");
            if (password != null && !password.equals("")) {
                user.changePassword(new MyUsernamePasswordAuthUser(password),
                        true);
            }
            user.update();
            return ok();
        } else {
            return forbidden();
        }
    }
}
