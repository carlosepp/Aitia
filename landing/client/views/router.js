Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = [
	"home_public",
	"login",
	"register",
	"verify_email",
	"forgot_password",
	"reset_password",
	"contact"
];

var privateRoutes = [
	"dashboard",
	"register_associate",
	"post_need",
	"where",
	"thanks_associate",
	"admin",
	"admin.users",
	"admin.users.details",
	"admin.users.insert",
	"admin.users.edit",
	"admin.associates",
	"admin.associates.details",
	"admin.associates.insert",
	"admin.associates.edit",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"logout"
];

var freeRoutes = [
	
];

var roleMap = [
	{ route: "admin",	roles: ["admin"] },
	{ route: "admin.users",	roles: ["admin"] },
	{ route: "admin.users.details",	roles: ["admin"] },
	{ route: "admin.users.insert",	roles: ["admin"] },
	{ route: "admin.users.edit",	roles: ["admin"] },
	{ route: "admin.associates",	roles: ["admin"] },
	{ route: "admin.associates.details",	roles: ["admin"] },
	{ route: "admin.associates.insert",	roles: ["admin"] },
	{ route: "admin.associates.edit",	roles: ["admin"] },
	{ route: "user_settings",	roles: ["user","admin"] },
	{ route: "user_settings.profile",	roles: ["user","admin"] },
	{ route: "user_settings.change_pass",	roles: ["user","admin"] }
];

this.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		var redirectRoute = firstGrantedRoute("home_public");
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute = firstGrantedRoute("");
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		return;
	}

	if(!routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Meteor.subscribe("current_user_data");

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles

Router.map(function () {
	
	this.route("home_public", {path: "/", controller: "HomePublicController"});
	this.route("login", {path: "/login", controller: "LoginController"});
	this.route("register", {path: "/register", controller: "RegisterController"});
	this.route("verify_email", {path: "/verify_email/:verifyEmailToken", controller: "VerifyEmailController"});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController"});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController"});
	this.route("contact", {path: "/contact", controller: "ContactController"});
	this.route("dashboard", {path: "/dashboard", controller: "DashboardController"});
	this.route("register_associate", {path: "/register_associate", controller: "RegisterAssociateController"});
	this.route("post_need", {path: "/post_need", controller: "PostNeedController"});
	this.route("where", {path: "/where", controller: "WhereController"});
	this.route("thanks_associate", {path: "/thanks_associate", controller: "ThanksAssociateController"});
	this.route("admin", {path: "/admin", controller: "AdminController"});
	this.route("admin.users", {path: "/admin/users", controller: "AdminUsersController"});
	this.route("admin.users.details", {path: "/admin/users/details/:userId", controller: "AdminUsersDetailsController"});
	this.route("admin.users.insert", {path: "/admin/users/insert", controller: "AdminUsersInsertController"});
	this.route("admin.users.edit", {path: "/admin/users/edit/:userId", controller: "AdminUsersEditController"});
	this.route("admin.associates", {path: "/admin/associates", controller: "AdminAssociatesController"});
	this.route("admin.associates.details", {path: "/admin/associates/details/:userId", controller: "AdminAssociatesDetailsController"});
	this.route("admin.associates.insert", {path: "/admin/associates/insert", controller: "AdminAssociatesInsertController"});
	this.route("admin.associates.edit", {path: "/admin/associates/edit/:userId", controller: "AdminAssociatesEditController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
