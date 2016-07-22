package controllers;

import org.apache.commons.lang.StringUtils;
import play.Play;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;

/**
 * Created with IntelliJ IDEA.
 * User: JCiak
 * Date: 7/29/13
 * Time: 12:25 PM
 * To change this template use File | Settings | File Templates.
 */
public class ForceHttps extends Action.Simple {

    private static String SSL_HEADER_CLOUD_FOUNDRY = "x-forwarded-proto";

    @Override
    public Result call(Http.Context ctx) throws Throwable {

        if (!isHttpsRequest(ctx.request())) {
            return redirect("https://" + ctx.request().host()
                    + ctx.request().uri());
        }

        return delegate.call(ctx);
    }

    private boolean isHttpsRequest(Http.Request request) {

        if (Play.isDev()) {
            return true;
        }

        if (request.getHeader(SSL_HEADER_CLOUD_FOUNDRY) != null
                && StringUtils.contains(
                request.getHeader(SSL_HEADER_CLOUD_FOUNDRY), "https")) {
            return true;
        }

        return false;
    }
}
