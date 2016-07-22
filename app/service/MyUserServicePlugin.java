package service;

import com.feth.play.module.pa.PlayAuthenticate;
import com.feth.play.module.pa.providers.oauth2.BasicOAuth2AuthUser;
import com.feth.play.module.pa.providers.oauth2.OAuth2AuthInfo;
import com.feth.play.module.pa.providers.oauth2.OAuth2AuthUser;
import com.feth.play.module.pa.providers.oauth2.google.GoogleAuthUser;
import controllers.Secured;
import models.Login;
import models.TokenAction;
import models.User;
import org.codehaus.jackson.map.ObjectMapper;
import play.Application;

import com.feth.play.module.pa.user.AuthUser;
import com.feth.play.module.pa.user.AuthUserIdentity;
import com.feth.play.module.pa.service.UserServicePlugin;
import play.Logger;
import play.mvc.Http;

import java.io.IOException;
import java.util.List;

public class MyUserServicePlugin extends UserServicePlugin {

	public MyUserServicePlugin(final Application app) {
		super(app);
	}

	@Override
	public Object save(final AuthUser authUser) {
		final boolean isLinked = User.existsByAuthUserIdentity(authUser);
		if (!isLinked) {
			return User.create(authUser).id;
		} else {
			// we have this user already, so return null
			return null;
		}
	}

	@Override
	public Object getLocalIdentity(final AuthUserIdentity identity) {
		// For production: Caching might be a good idea here...
		// ...and dont forget to sync the cache when users get deactivated/deleted
		final User u = User.findByAuthUserIdentity(identity);
		if(u != null) {
			return u.id;
		} else {
			return null;
		}
	}

	@Override
	public AuthUser merge(final AuthUser newUser, final AuthUser oldUser) {
		if (!oldUser.equals(newUser)) {
			User.merge(oldUser, newUser);
		}
		return oldUser;
	}

	@Override
	public AuthUser link(final AuthUser oldUser, final AuthUser newUser) {
		User.addLinkedAccount(oldUser, newUser);
        if (newUser instanceof GoogleAuthUser) {
            User user = User.findByAuthUserIdentity(oldUser);
            user.email = ((GoogleAuthUser) newUser).getEmail();
            user.firstName = ((GoogleAuthUser) newUser).getFirstName();
            user.lastName = ((GoogleAuthUser) newUser).getLastName();
            user.save();
        }
		return newUser;
	}
	
	@Override
	public AuthUser update(final AuthUser knownUser) {
        if (Http.Context.current().session().get("username") == null) {
            Http.Context.current().session().put("username", Login.loginUser(User.findByAuthUserIdentity(knownUser), Http.Context.current().request()));
        }
		// User logged in again, bump last login date
		User.setLastLoginDate(knownUser);
        if (knownUser instanceof OAuth2AuthUser) {
            User user = User.findByAuthUserIdentity(knownUser);
            Login login = Login.find.byId(Long.parseLong(Http.Context.current().session().get("username")));
            Logger.debug(knownUser.getClass().getName()+" is an OAuth2User! Time to do stuff...");
            OAuth2AuthInfo oAuth2AuthInfo = ((OAuth2AuthUser) knownUser).getOAuth2AuthInfo();
            try {
                login.info = (new ObjectMapper()).writeValueAsString(oAuth2AuthInfo);
                login.save();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
		return knownUser;
	}

}
