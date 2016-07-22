package controllers;

import models.*;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.Results;
import play.mvc.Security;

import java.util.ArrayList;
import java.util.List;

import static play.data.Form.form;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/13/13
 * Time: 1:11 PM
 * To change this template use File | Settings | File Templates.
 */
@Security.Authenticated(Secured.class)
public class Employees extends Controller {

    public static Result index() {
        if (Secured.hasGuestAccess()) {
            return TODO;
        } else {
            return forbidden();
        }
    }

}
