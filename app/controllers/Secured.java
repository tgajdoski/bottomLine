package controllers;

import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.providers.AuthProvider;
import com.feth.play.module.pa.providers.oauth2.OAuth2AuthInfo;
import com.feth.play.module.pa.providers.oauth2.OAuth2AuthProvider;
import com.feth.play.module.pa.providers.oauth2.google.GoogleAuthInfo;
import com.feth.play.module.pa.providers.oauth2.google.GoogleAuthProvider;
import com.feth.play.module.pa.providers.oauth2.google.GoogleAuthUser;
import com.feth.play.module.pa.user.AuthUser;
import models.Login;
import models.TokenAction;
import models.User;
import oauth.signpost.OAuth;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.message.BasicNameValuePair;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ObjectNode;
import play.Configuration;
import play.Logger;
import play.Play;
import play.libs.WS;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Security;
import views.html.account.signup.password_reset;

import javax.persistence.OptimisticLockException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 6/13/13
 * Time: 9:28 AM
 * To change this template use File | Settings | File Templates.
 */
public class Secured extends Security.Authenticator {
    public static Integer ADMINISTRATOR = 3;
    public static Integer MANAGER = 2;
    public static Integer GUEST = 1;


    public static Integer DATAINPUT = 1;
    public static Integer DATAPROCESSOR = 2;
    public static Integer FIELDMANGER = 3;
    public static Integer PRODUCTIONMANAGER = 4;
    public static Integer ACCOUNTINGMANGER = 5;
    public static Integer OPERATIONSMANAGER = 6;
    public static Integer COMPANYGMANGER = 7;


    @Override
    public String getUsername(Http.Context ctx) {
        String loginId = ctx.session().get("username");
        if (loginId == null) {
            return null;
        } else {
            Login login = Login.find.byId(Long.parseLong(loginId));
            Date present = new Date();
            AuthUser authUser = PlayAuthenticate.getUser(ctx);
            if (!PlayAuthenticate.isLoggedIn(ctx.session())
                    && authUser != null
                    && PlayAuthenticate.getProvider(authUser.getProvider()) instanceof GoogleAuthProvider) {
                Logger.debug("Time to refresh our access token!");
                if (login != null && login.info != null) {
                    try {
                        Logger.debug("Login info from DB: "+login.info);
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode loginInfo = mapper.readTree(login.info);
                        ((ObjectNode)loginInfo).put(OAuth2AuthProvider.Constants.ACCESS_TOKEN, loginInfo.path("accessToken").getTextValue());
                        ((ObjectNode)loginInfo).remove("accessToken");
                        ((ObjectNode)loginInfo).put(OAuth2AuthProvider.Constants.REFRESH_TOKEN, loginInfo.path("refreshToken").getTextValue());
                        ((ObjectNode)loginInfo).remove("refreshToken");
                        ((ObjectNode)loginInfo).put(OAuth2AuthProvider.Constants.TOKEN_TYPE, loginInfo.path("bearer").getTextValue());
                        ((ObjectNode)loginInfo).remove("bearer");
                        ((ObjectNode)loginInfo).put(OAuth2AuthProvider.Constants.EXPIRES_IN, loginInfo.path("expiration").getLongValue());
                        ((ObjectNode)loginInfo).remove("expiration");
                        ((ObjectNode)loginInfo).put("id_token", loginInfo.path("idToken").getTextValue());
                        ((ObjectNode)loginInfo).remove("idToken");
                        Logger.debug("Login info from JSON: "+loginInfo.toString());
                        GoogleAuthInfo googleAuthInfo = new GoogleAuthInfo(loginInfo);
                        String refreshToken = googleAuthInfo.getRefreshToken();
                        Configuration c = PlayAuthenticate.getConfiguration().getConfig(authUser.getProvider());
                        final List<NameValuePair> params = new ArrayList<NameValuePair>();
                        params.add(new BasicNameValuePair(OAuth2AuthProvider.Constants.CLIENT_ID, c
                                .getString(OAuth2AuthProvider.SettingKeys.CLIENT_ID)));
                        params.add(new BasicNameValuePair(OAuth2AuthProvider.Constants.CLIENT_SECRET, c
                                .getString(OAuth2AuthProvider.SettingKeys.CLIENT_SECRET)));
                        params.add(new BasicNameValuePair(OAuth2AuthProvider.Constants.REFRESH_TOKEN,
                                refreshToken));
                        params.add(new BasicNameValuePair(OAuth2AuthProvider.Constants.GRANT_TYPE,
                                OAuth2AuthProvider.Constants.REFRESH_TOKEN));
                        final WS.Response r = WS.url(c.getString(OAuth2AuthProvider.SettingKeys.ACCESS_TOKEN_URL))
                                .setHeader("Content-Type", "application/x-www-form-urlencoded")
                                .post(URLEncodedUtils.format(params, "UTF-8")).get(PlayAuthenticate.TIMEOUT);

                        JsonNode node = r.asJson();
                        if (refreshToken != null) {
                            ((ObjectNode)node).put(OAuth2AuthProvider.Constants.REFRESH_TOKEN, refreshToken);
                        }

                        googleAuthInfo = new GoogleAuthInfo(node);

                        authUser = new GoogleAuthUser(WS
                                .url(c.getString("userInfoUrl"))
                                .setQueryParameter(OAuth2AuthProvider.Constants.ACCESS_TOKEN,
                                        googleAuthInfo.getAccessToken()).get()
                                .get(PlayAuthenticate.TIMEOUT).asJson(),googleAuthInfo,null);

                        PlayAuthenticate.storeUser(ctx.session(), authUser);
                        login.updateTimestamp = present;
                    } catch (IOException e) {
                        Logger.error("Aw, snap! We gots an error while updating our token for login with id "+loginId+": "+e.toString());
                        e.printStackTrace();
                    } catch (NullPointerException e) {
                        Logger.error("Aw, snap! We gots an error while updating our token for login with id "+loginId+": "+e.toString());
                        e.printStackTrace();
                    }
                } else {
                    Logger.debug("Uh oh! The login with id "+loginId+" has NULL info :-/");
                }
            } else if (authUser == null) {
                Logger.debug("AuthUser is null!");
            }

            if (login == null) {
                return null;
            } else {
                Long diff = present.getTime()-login.updateTimestamp.getTime();
                if ((login.user.authority == GUEST && diff > 300000L)
                        || (login.user.authority == MANAGER && diff > 3600000L)
                        || (login.user.authority == ADMINISTRATOR && diff > 86400000L)) {
                    PlayAuthenticate.logout(ctx.session());
                    return null;
                } else {
                    try {
                        login.updateTimestamp = present;
                        login.update();
                    }
                    catch (OptimisticLockException ex) {
                        ex.printStackTrace();
                    }
                    return login.user.id.toString();
                }
            }
        }
    }

    @Override
    public Result onUnauthorized(Http.Context ctx) {
        return redirect(routes.Application.login());
        // return redirect(AuthProvider.Registry.get("google").getUrl());
    }

    public static boolean hasAdministratorAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= ADMINISTRATOR) {
            return true;
        } else {
            return false;
        }
    }


    public static int getuserAuthority() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        return user.authority;
    }

    public static boolean hasManagerAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= MANAGER) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasGuestAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= GUEST) {
            return true;
        } else {
            return false;
        }
    }

// novite rolji

    public static boolean hasOperationManagerAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= OPERATIONSMANAGER) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasCompanyManagerAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= COMPANYGMANGER) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasAccountingManagerAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= ACCOUNTINGMANGER) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasOProductionManagerAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= PRODUCTIONMANAGER) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasFieldManagerAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= FIELDMANGER) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasDataProcessorAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= DATAPROCESSOR) {
            return true;
        } else {
            return false;
        }
    }

    public static boolean hasDataInputAccess() {
        User user = User.find.byId(Long.parseLong(Http.Context.current().request().username()));
        if (user != null && user.authority >= DATAINPUT) {
            return true;
        } else {
            return false;
        }
    }







}
