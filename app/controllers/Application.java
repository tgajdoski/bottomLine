package controllers;

import be.objectify.deadbolt.java.actions.Group;
import be.objectify.deadbolt.java.actions.Restrict;
import com.avaje.ebean.*;
import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.providers.password.UsernamePasswordAuthProvider;
import com.feth.play.module.pa.user.AuthUser;
import models.*;
import org.apache.commons.codec.digest.DigestUtils;
import play.*;
import play.data.Form;
import play.db.ebean.Model;
import play.mvc.*;
import play.mvc.Http.Session;

import providers.MyUsernamePasswordAuthProvider;
import views.html.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static play.data.Form.form;
import static play.libs.Json.toJson;

public class Application extends Controller {
    // -- Authentication
    public static final String FLASH_MESSAGE_KEY = "message";
    public static final String FLASH_ERROR_KEY = "error";
    public static final String USER_ROLE = "user";

    public static class Login {

        public String username;
        public String password;
        public Long id;

        public String validate() {
            User user = User.authenticate(username, DigestUtils.md5Hex(password));
            if(user == null) {
                return "Invalid user or password";
            }
            this.id = user.id;

            return null;
        }

    }



    public static User getLocalUser(final Session session) {
        final AuthUser currentAuthUser = PlayAuthenticate.getUser(session);
        final User localUser = User.findByAuthUserIdentity(currentAuthUser);
        return localUser;
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result restricted() {
        final User localUser = getLocalUser(session());
        return ok(restricted_rd.render(localUser));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result profile() {
        final User localUser = getLocalUser(session());
        return ok(profile_rd.render(localUser));
    }

    @Restrict(@Group(Application.USER_ROLE))
    public static Result profile_rd() {
        final User localUser = getLocalUser(session());
        return ok(profile_rd.render(localUser));
    }

    public static Result signup() {
        return ok(signup.render(MyUsernamePasswordAuthProvider.SIGNUP_FORM));
    }

    /**
     * Login page.
     */
    public static Result login() {
        return ok(
                login.render(MyUsernamePasswordAuthProvider.LOGIN_FORM)
        );
    }

    public static Result doLogin() {
        com.feth.play.module.pa.controllers.Authenticate.noCache(response());
        final Form<MyUsernamePasswordAuthProvider.MyLogin> filledForm = MyUsernamePasswordAuthProvider.LOGIN_FORM
                .bindFromRequest();
        if (filledForm.hasErrors()) {
            // User did not fill everything properly
            return badRequest(login.render(filledForm));
        } else {
            // Everything was filled
            return UsernamePasswordAuthProvider.handleLogin(ctx());
        }
    }

    /**
     * Handle login form submission.
     */
    public static Result authenticate() {
        Form<Login> loginForm = form(Login.class).bindFromRequest();
        if(loginForm.hasErrors()) {
            return badRequest(login.render(loginForm));
        } else {
            session("username", models.Login.loginUser(User.find.byId(loginForm.get().id), request()));
            return redirect(
                routes.Home_rd.index()
            );
        }
    }

    /**
     * Logout and clean the session.
     */
    public static Result logout() {
        String loginId = session().get("username");
        if (loginId != null) {
            models.Login login = models.Login.find.byId(Long.parseLong(loginId));
            if (login != null) {
                login.info = null;
                login.save();
            }
        }
        session().clear();
        flash("success", "You've been logged out");
        return redirect(
                routes.Application.login()
        );
    }

    public static Result oAuthDenied(final String providerKey) {
        flash(FLASH_ERROR_KEY,
                "You need to accept the OAuth connection in order to use this website!");
        return redirect(routes.Home_rd.index());
    }

    public static Result doSignup() {
        com.feth.play.module.pa.controllers.Authenticate.noCache(response());
        final Form<MyUsernamePasswordAuthProvider.MySignup> filledForm = MyUsernamePasswordAuthProvider.SIGNUP_FORM
                .bindFromRequest();
        if (filledForm.hasErrors()) {
            // User did not fill everything properly
            return badRequest(signup.render(filledForm));
        } else {
            // Everything was filled
            // do something with your part of the form before handling the user
            // signup
             return UsernamePasswordAuthProvider.handleSignup(ctx());
            // return redirect(routes.Users_rd.index());
        }
    }

    public static Result emptyok(){
        return  ok();
    }

    public static String formatTimestamp(final long t) {
        return new SimpleDateFormat("yyyy-dd-MM HH:mm:ss").format(new Date(t));
    }

    // -- Javascript routing

    public static Result javascriptRoutes() {
        response().setContentType("text/javascript");
        return ok(
                Routes.javascriptRouter("jsRoutes",
                        controllers.routes.javascript.Application.doSignup(),
                        controllers.routes.javascript.weather.getWeather(),
                        controllers.routes.javascript.Plans_rd.upload(),
                        controllers.routes.javascript.Signup.forgotPassword(),


                        controllers.routes.javascript.Home_rd.getUserSelect(),
                        controllers.routes.javascript.Home_rd.getCrewLeader(),


                        controllers.routes.javascript.Home_rd.sendemail(),


                        controllers.routes.javascript.Users_rd.addUser(),
                        controllers.routes.javascript.Users_rd.deleteUser(),
                        controllers.routes.javascript.Users_rd.updateUser(),
                        controllers.routes.javascript.Users_rd.saveUser(),
                        controllers.routes.javascript.Users_rd.index(),
                        controllers.routes.javascript.Users_rd.updateActive(),



                        controllers.routes.javascript.Labors.getWeekLabor(),
                        controllers.routes.javascript.Labors.getLaborperiod(),
                        controllers.routes.javascript.Labors.getTableWeekLabor(),
                        controllers.routes.javascript.Labors.addLabor(),

                        controllers.routes.javascript.Reports_rd.index_profit(),
                        controllers.routes.javascript.Reports_rd.index_job(),
                        controllers.routes.javascript.Reports_rd.index_item(),
                        controllers.routes.javascript.Reports_rd.getItemsReport(),
                        controllers.routes.javascript.Reports_rd.getItemsReportRedesigned(),
                        controllers.routes.javascript.Reports_rd.getPurchaseReportRedesigned(),
                        controllers.routes.javascript.Reports_rd.getPurchaseReportActivityRedesigned(),
                        controllers.routes.javascript.Reports_rd.getJobsReport(),
                        controllers.routes.javascript.Reports_rd.getJobsReportRedesigned(),
                        controllers.routes.javascript.Reports_rd.getProfitReport(),
                        controllers.routes.javascript.Reports_rd.getProfitReportRedesigned(),
                        controllers.routes.javascript.Reports_rd.excelExport(),
                        controllers.routes.javascript.Reports_rd.printCalendarJobCrew(),
                        controllers.routes.javascript.Reports_rd.printPDFCalendarJobCrew(),
                        controllers.routes.javascript.Reports_rd.calendarjobcrewfront(),
                        controllers.routes.javascript.Reports_rd.printCalendarCrewJobNew(),
                        controllers.routes.javascript.Reports_rd.getLaborperiodreport(),
                        controllers.routes.javascript.Reports_rd.getLaborperiod(),


                        controllers.routes.javascript.Vendors_rd.vendorQBexcelExport(),
                        controllers.routes.javascript.Labors.laborQBexcelExport(),
                        controllers.routes.javascript.Bills.billQBexcelExport(),
                        controllers.routes.javascript.Bills.deletebill(),
                        controllers.routes.javascript.Bills.getBillbyID(),
                        controllers.routes.javascript.Bills.listaccounttypes(),
                        controllers.routes.javascript.Bills.updateaccounttypeActive(),
                        controllers.routes.javascript.Bills.updateaccountType(),
                        controllers.routes.javascript.Bills.checkBillnum(),
                        controllers.routes.javascript.Vendors_rd.itemQBexcelExport(),
                        controllers.routes.javascript.Customers_rd.customerQBexcelExport(),


                        controllers.routes.javascript.Reports_rd.getnew1frontdata(),
                        controllers.routes.javascript.Reports_rd.getnew2frontdata(),
                        controllers.routes.javascript.Reports_rd.getnew3frontdata(),
                        controllers.routes.javascript.Reports_rd.getnew4frontdata(),

                        controllers.routes.javascript.Reports_rd.getnew2frontdataTotals(),

                        controllers.routes.javascript.Jobs_rd.getMarketSelect(),
                        controllers.routes.javascript.Jobs_rd.getCustomerSelect(),
                        controllers.routes.javascript.Jobs_rd.getSubdivisionSelect(),
                        controllers.routes.javascript.Jobs_rd.getJobsByLot(),
                        controllers.routes.javascript.Jobs_rd.getSaleitems(),
                        controllers.routes.javascript.Jobs_rd.getPlanSelect(),
                        controllers.routes.javascript.Jobs_rd.searchJobs(),
                        controllers.routes.javascript.Jobs_rd.applyTemplate(),
                        controllers.routes.javascript.Jobs_rd.applyTemplateNewJob(),
                        controllers.routes.javascript.Jobs_rd.copyToPlans(),
                        controllers.routes.javascript.Jobs_rd.listJobsAjax(),
                        controllers.routes.javascript.Jobs_rd.rescheduleTasks(),
                        controllers.routes.javascript.Jobs_rd.rescheduleCalendarTasks(),
                        controllers.routes.javascript.Jobs_rd.actualJobs(),
                        controllers.routes.javascript.Jobs_rd.getTaskNotesPerDay(),

                        controllers.routes.javascript.Jobs_rd.loadNewJob(),
                        controllers.routes.javascript.Jobs_rd.loadOldJob(),


                        controllers.routes.javascript.Jobs_rd.getJobforActuals(),
                        controllers.routes.javascript.Jobs_rd.getselectedJoblineitems(),
                        controllers.routes.javascript.Jobs_rd.getselectedJobActuallineitems(),
                        controllers.routes.javascript.Jobs_rd.getselectedJobActuallineitemsLaborUser(),
                        controllers.routes.javascript.Jobs_rd.getselectedJobActuallineitemsbyLineItem(),
                        controllers.routes.javascript.Jobs_rd.getselectedJobActuallineitemsLaborPerLineitemORG(),
                        controllers.routes.javascript.Jobs_rd.getsinglelineitem(),
                        controllers.routes.javascript.Jobs_rd.getsinglelineitempersentage(),
                        controllers.routes.javascript.Assignes_rd.saveAssign(),



                        controllers.routes.javascript.Expenses.addExpence(),

                        controllers.routes.javascript.Expenses.selectExpenses(),
                        controllers.routes.javascript.Expenses.UpdateExpence(),

                        controllers.routes.javascript.Bills.selectBills(),
                        controllers.routes.javascript.Bills.Updatebill(),
/*                        controllers.routes.javascript.Bills.getBillView(),*/
                        controllers.routes.javascript.Bills.addBill(),


                        controllers.routes.javascript.Assignes_rd.updateAssign(),



                        // Routes for Plans
                        controllers.routes.javascript.Plans_rd.addPlan(),
                        controllers.routes.javascript.Plans_rd.addPlanNewPrice(),
                        controllers.routes.javascript.Plans_rd.deletePlan(),

                        controllers.routes.javascript.Plans_rd.updatePlan(),
                        controllers.routes.javascript.Plans_rd.listPlansAjax(),

                        controllers.routes.javascript.Plans_rd.updateActive(),
                        controllers.routes.javascript.Customers_rd.updateActive(),
                        controllers.routes.javascript.Vendors_rd.updateActive(),
                        controllers.routes.javascript.Vendors_rd.updateEmployee(),

                        controllers.routes.javascript.Vendors_rd.updateInvoice(),
                        controllers.routes.javascript.Vendors_rd.update1099(),
                        controllers.routes.javascript.Vendors_rd.updateItemActive(),

                        controllers.routes.javascript.Plans_rd.addPlanItem(),
                        controllers.routes.javascript.Plans_rd.addAttachment(),
                        controllers.routes.javascript.Plans_rd.deleteAttachment(),
                        controllers.routes.javascript.Plans_rd.addDimension(),
                        controllers.routes.javascript.Plans_rd.deleteDimension(),
                        controllers.routes.javascript.Plans_rd.updateDimension(),
                        controllers.routes.javascript.Plans_rd.checkPrices(),
                        controllers.routes.javascript.Plans_rd.reorderLineItems(),

                        controllers.routes.javascript.Plans_rd.reorderLineItemDates(),
                        controllers.routes.javascript.Plans_rd.reorderLineItemRefresh(),

                        controllers.routes.javascript.Jobs_rd.reorderLineItemRefresh(),
                        controllers.routes.javascript.Jobs_rd.reorderLineItemActualRefresh(),
                        controllers.routes.javascript.Jobs_rd.reorderLineItems(),
                        controllers.routes.javascript.Jobs_rd.reorderLineItemDates(),

                        controllers.routes.javascript.Jobs_rd.verifyLineItems(),

                        controllers.routes.javascript.Jobs_rd.unverifyLineItems(),

                        controllers.routes.javascript.Jobs_rd.verifyAllLineItems(),
                        controllers.routes.javascript.Jobs_rd.printjobcard(),
                        controllers.routes.javascript.Jobs_rd.emailjobcard(),

                        controllers.routes.javascript.Plans_rd.getPlanListformCustomerid(),

                        // Routes for Jobs
                        controllers.routes.javascript.Jobs_rd.addJobTask(),
                        controllers.routes.javascript.Jobs_rd.deleteJob(),
                        controllers.routes.javascript.Jobs_rd.updateJob(),
                        controllers.routes.javascript.Jobs_rd.appendCommentJob(),
                        controllers.routes.javascript.Jobs_rd.reorderLineItems(),

                        // Routes for Saleitems
                        controllers.routes.javascript.Saleitems_rd.addSaleitem(),
                        controllers.routes.javascript.Saleitems_rd.deleteSaleitem(),
                        controllers.routes.javascript.Saleitems_rd.updateSaleitem(),

                        // Routes for Lineitems
                        controllers.routes.javascript.Lineitems_rd.addBudgetLineitem(),
                        controllers.routes.javascript.Lineitems_rd.addActualLineitem(),
                        controllers.routes.javascript.Lineitems_rd.addActualNewLineitem(),
                        controllers.routes.javascript.Lineitems_rd.addLineCalendarLabor(),
                        controllers.routes.javascript.Lineitems_rd.addNewActualLineitem(),
                        controllers.routes.javascript.Lineitems_rd.deleteLineitem(),
                        controllers.routes.javascript.Lineitems_rd.deleteLineitemNewJob(),
                        controllers.routes.javascript.Lineitems_rd.AddEditNewLineitem(),
                        controllers.routes.javascript.Lineitems_rd.EditNoteLineitem(),
                        controllers.routes.javascript.Lineitems_rd.GetNoteLineitem(),
                        controllers.routes.javascript.Lineitems_rd.AddEditNegativeLineitem(),
                        controllers.routes.javascript.Lineitems_rd.updateLineitem(),
                        controllers.routes.javascript.Lineitems_rd.updateNewLineitem(),
                        controllers.routes.javascript.Lineitems_rd.updateNewLineitemNeww(),
                        controllers.routes.javascript.Lineitems_rd.getVendorSelect(),
                        controllers.routes.javascript.Lineitems_rd.getItemSelect(),
                        controllers.routes.javascript.Lineitems_rd.updateLineItemforNewJob(),
                        controllers.routes.javascript.Lineitems_rd.addToQuickbooks(),
                        controllers.routes.javascript.Lineitems_rd.CheckExistAssignedLineItemsTaskidsNewJob(),
                        controllers.routes.javascript.Lineitems_rd.CheckExistAssignedLineItemsNewJob(),
                        controllers.routes.javascript.Lineitems_rd.deleteActualLinefromPO(),
                        controllers.routes.javascript.Lineitems_rd.addActualLinefromPO(),

                        controllers.routes.javascript.Lineitems_rd.deleteTaskNotAllActuals(),




                        controllers.routes.javascript.Lineitems_rd.CheckExistTaskperDateJob(),
                        controllers.routes.javascript.Lineitems_rd.deleteTaskActualsAssignsResetPlanItems(),
                        controllers.routes.javascript.Lineitems_rd.DeleteTasksWithoutLineitems(),


                        controllers.routes.javascript.Lineitems_rd.EditBudgetLineItemfromPO(),
                        controllers.routes.javascript.Lineitems_rd.updateTaskNoteLineItem(),
                        controllers.routes.javascript.Lineitems_rd.CheckDailyTasks(),
                        controllers.routes.javascript.Lineitems_rd.getLineItemCount(),
                        controllers.routes.javascript.Lineitems_rd.deleteTaskActuals(),
                        controllers.routes.javascript.Lineitems_rd.checkTaskActuals(),


                        // routes for POs
                        controllers.routes.javascript.Lineitem_POs_rd.updatePo(),
                        controllers.routes.javascript.Lineitem_POs_rd.savePo(),



                        // Routes for Tasks
                        controllers.routes.javascript.Tasks_rd.addTask(),
                        controllers.routes.javascript.Tasks_rd.addNewTaskLabor(),
                        controllers.routes.javascript.Tasks_rd.addTaskNewPlans(),
                        controllers.routes.javascript.Tasks_rd.CheckUnAssingedTask(),
                        controllers.routes.javascript.Tasks_rd.addTaskActual(),
                        controllers.routes.javascript.Tasks_rd.getTasksbyJob(),
                        controllers.routes.javascript.Tasks_rd.deleteTask(),
                        controllers.routes.javascript.Tasks_rd.updateTask(),
                        controllers.routes.javascript.Tasks_rd.getDailyTasksHome(),
                        controllers.routes.javascript.Tasks_rd.getDailyTasksActuals(),
                        controllers.routes.javascript.Tasks_rd.getDailyTasksLaborActuals(),
                        controllers.routes.javascript.Tasks_rd.getAcualTasksperJobperType(),
                        controllers.routes.javascript.Tasks_rd.getMoveJobs(),


                        controllers.routes.javascript.Customers_rd.getCustomer(),
                        controllers.routes.javascript.Customers_rd.addCustomer(),
                        controllers.routes.javascript.Customers_rd.updateCustomer(),
                        controllers.routes.javascript.Customers_rd.deleteCustomer(),
                        controllers.routes.javascript.Customers_rd.getSubdivision(),
                        controllers.routes.javascript.Customers_rd.getSubdivisionsList(),
                        controllers.routes.javascript.Customers_rd.addSubdivision(),
                        controllers.routes.javascript.Customers_rd.updateSubdivision(),
                        controllers.routes.javascript.Customers_rd.deleteSubdivision(),
                        controllers.routes.javascript.Customers_rd.deleteCustomerSubdivision(),
                        controllers.routes.javascript.Customers_rd.updateCustomerMarket(),
                        controllers.routes.javascript.Customers_rd.getMarketwoeid(),
                        controllers.routes.javascript.Customers_rd.getMarketByid(),
                        controllers.routes.javascript.Customers_rd.getMarket(),
                        controllers.routes.javascript.Customers_rd.addMarket(),
                        controllers.routes.javascript.Customers_rd.updateMarket(),
                        controllers.routes.javascript.Customers_rd.deleteMarket(),

                        controllers.routes.javascript.Customers_rd.getCustomerList(),
                        controllers.routes.javascript.Customers_rd.getCustomerpermarket(),
                        controllers.routes.javascript.Customers_rd.getCustomerpermarketS(),

                        controllers.routes.javascript.Customers_rd.saveCustomer(),
                        controllers.routes.javascript.Customers_rd.addCustomer_rd(),
                       /* controllers.routes.javascript.Customers_rd.addMarket_rd(),*/
                        controllers.routes.javascript.Customers_rd.getCustomerbyID(),


                        controllers.routes.javascript.Vendors_rd.getVendor(),
                        controllers.routes.javascript.Vendors_rd.updateVendorMarket(),
                        controllers.routes.javascript.Vendors_rd.addVendor(),
                        controllers.routes.javascript.Vendors_rd.updateVendor(),
                        controllers.routes.javascript.Vendors_rd.deleteVendor(),
                        controllers.routes.javascript.Vendors_rd.getItem(),
                        controllers.routes.javascript.Vendors_rd.getItemByid(),
                        controllers.routes.javascript.Vendors_rd.addItem(),
                        controllers.routes.javascript.Vendors_rd.updateItem(),
                        controllers.routes.javascript.Vendors_rd.deleteItem(),
                        controllers.routes.javascript.Vendors_rd.getVendorItem(),
                        controllers.routes.javascript.Vendors_rd.getVendorItems(),
                        controllers.routes.javascript.Vendors_rd.getVendorActualItem(),
                        controllers.routes.javascript.Vendors_rd.getVendorActualItems(),
                        controllers.routes.javascript.Vendors_rd.getonlyItem(),
                        controllers.routes.javascript.Vendors_rd.addVendorItem(),
                        controllers.routes.javascript.Vendors_rd.updateVendorItem(),
                        controllers.routes.javascript.Vendors_rd.deleteVendorItem(),
                        controllers.routes.javascript.Vendors_rd.getactualVendors(),
                        controllers.routes.javascript.Vendors_rd.getVendorsperMarketCat(),
                        controllers.routes.javascript.Vendors_rd.getactualVendorsMinimized(),
                        controllers.routes.javascript.Vendors_rd.addItem_rd(),

                        controllers.routes.javascript.Vendors_rd.addVendor_rd(),
                        controllers.routes.javascript.Vendors_rd.getVendorbyID(),

                        controllers.routes.javascript.Todos.index()
                )
        );
    }
}
