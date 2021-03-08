sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (Controller, JSONModel, MessageToast, MessageBox, Fragment) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		onInit: function () {
			this.getView().setModel(new JSONModel({}));

			this.refreshData(false);
		},

		refreshData: function (bShowMessage) {
			var oModel = this.getView().getModel();

			jQuery.get("/suggestions").done(function (aSuggestions) {
				oModel.setProperty("/suggestions", aSuggestions);
				if (bShowMessage) {
					MessageToast.show("Data refreshed");
				}
			});
		},

		onRefreshData: function () {
			this.refreshData(true);
		},

		onDeleteSuggestion: function (oControlEvent) {
			var oListItem = oControlEvent.getParameter("listItem").getBindingContext();

			MessageBox.confirm(`Are you sure you want to delete this suggestion?`, {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						jQuery.ajax({ url: `/suggestion/${oListItem.getProperty("suggestionId")}`, type: "DELETE" }).done(function () {
							MessageBox.success("Deleted suggestion");
							this.refreshData(false);
						}.bind(this)).fail(function () {
							MessageBox.error("Failed to delete suggestion");
						});
					}
				}.bind(this)
			});
		},

		onCreateSuggestion: function (oEvent) {
			var oModel = this.getView().getModel();

			oModel.setProperty("/newSuggestion", {
				suggestionTitle: "This is a new suggestion"
			});

			var oContext = oModel.createBindingContext("/newSuggestion");

			this._bIsCreate = true;

			this.openEditDialog(oContext);
		},

		onEditSuggestion: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();

			this._bIsCreate = false;

			this.openEditDialog(oContext);
		},

		openEditDialog: function (oContext) {
			var oView = this.getView();

			if (!this._oSuggestionDialog) {
				this._oSuggestionDialog = Fragment.load({
					id: oView.getId(),
					name: "sap.ui.demo.basicTemplate.fragment.SuggestionDetail",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._oSuggestionDialog.then(function (oDialog) {
				oDialog.setBindingContext(oContext);
				oDialog.open();
			});
		},

		createSuggestion: function (oContext) {
			return jQuery.ajax({
				type: "POST",
				url: "/suggestion",
				data: JSON.stringify(oContext.getObject()),
				contentType: 'application/json',
				dataType: "json"
			}).done(function () {
				MessageToast.show("Suggestion created");
			});
		},

		updateSuggestion: function (oContext) {
			return jQuery.ajax({
				type: "PUT",
				url: `/suggestion/${oContext.getProperty("suggestionId")}`,
				data: JSON.stringify(oContext.getObject()),
				contentType: 'application/json',
				dataType: "json"
			}).done(function () {
				MessageToast.show("Suggestion updated");
			});
		},

		onSaveSuggestion: function () {
			this._oSuggestionDialog.then(function (oDialog) {
				var oContext = oDialog.getBindingContext();

				var oSavePromise;

				if (this._bIsCreate) {
					oSavePromise = this.createSuggestion(oContext);
				} else {
					oSavePromise = this.updateSuggestion(oContext);
				}

				oSavePromise.done(function () {
					oDialog.close();
					this.refreshData(false);
				}.bind(this)).fail(function (o) {
					MessageBox.error(o.responseJSON.message);
				});
			}.bind(this));
		},

		onCancelEdit: function () {
			this._oSuggestionDialog.then(function (oDialog) {
				oDialog.close();
				this.refreshData(false);
			}.bind(this));
		}
	});
});