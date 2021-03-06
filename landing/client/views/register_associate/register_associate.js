var pageSession = new ReactiveDict();

Template.RegisterAssociate.rendered = function() {
	
};

Template.RegisterAssociate.events({
	
});

Template.RegisterAssociate.helpers({
	
});

Template.RegisterAssociateIntroAssociate.rendered = function() {
	
};

Template.RegisterAssociateIntroAssociate.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}
	
});

Template.RegisterAssociateIntroAssociate.helpers({
	
});

Template.RegisterAssociateAskForHelp.rendered = function() {
	

	pageSession.set("registerAssociateAskForHelpInfoMessage", "");
	pageSession.set("registerAssociateAskForHelpErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.RegisterAssociateAskForHelp.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("registerAssociateAskForHelpInfoMessage", "");
		pageSession.set("registerAssociateAskForHelpErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var registerAssociateAskForHelpMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(registerAssociateAskForHelpMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("registerAssociateAskForHelpInfoMessage", message);
					}; break;
				}
			}

			Router.go("thanks_associate", {});
		}

		function errorAction(msg) {
			var message = msg || "Error.";
			pageSession.set("registerAssociateAskForHelpErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Associates.insert(values, function(e) { if(e) errorAction(e.message); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("dashboard", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.RegisterAssociateAskForHelp.helpers({
	"infoMessage": function() {
		return pageSession.get("registerAssociateAskForHelpInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("registerAssociateAskForHelpErrorMessage");
	}
	
});
