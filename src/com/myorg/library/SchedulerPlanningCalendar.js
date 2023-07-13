sap.ui.define([
    "jquery.sap.global",
    "sap/m/PlanningCalendar",
    "sap/m/PlanningCalendarRenderer",
    "sap/ui/unified/Calendar",
    "sap/ui/core/format/DateFormat"
], function (jQuery, PlanningCalendar, PlanningCalendarRenderer, Calendar, DateFormat) {
    "use strict";

	var SchedulerPlanningCalendar = PlanningCalendar.extend("com.myorg.library.SchedulerPlanningCalendar", {

        _bRendered: false,

        _aScheduledEvents: [],

        metadata : {
			properties : {
                selectedInterval: {
                    type : "object"
                },
                maxAppointmentBadgesPerDay: {
                    type: "int",
                    defaultValue: 2
                }
            }
        },

        utilities: {
            _iWeekInMilliseconds: (7 * 24 * 60 * 60 * 1000) - 1,

            resetHours: function(oDate) {
                return new Date(new Date(oDate).setHours(0, 0, 0, 0));
            },

            addWeek: function(oDate, iWeeks) {
                return new Date(oDate.getTime() + (this._iWeekInMilliseconds * (iWeeks ? iWeeks : 1)));
            },
            addMonth: function(oDate) {
                return new Date(new Date(new Date(oDate).setMonth(oDate.getMonth() + 1)).setDate(1));
            }
        },

        renderer: PlanningCalendarRenderer.render

    });

    SchedulerPlanningCalendar.prototype.init = function() {
        PlanningCalendar.prototype.init.apply(this, arguments);
    };

    SchedulerPlanningCalendar.prototype.onBeforeRendering = function(oEvent) {
        PlanningCalendar.prototype.onBeforeRendering.apply(this, arguments);
        if (!this._bRendered) {
            this.addStyleClass("zagCalendar");
            this._setRowsStartDate(new Date());
            this.attachEvent("startDateChange", this.onStartDateChanged.bind(this));
            this.attachEvent("intervalSelect", this._onIntervalSelected.bind(this));
        }
        this.onStartDateChanged();
        this._bRendered = true;
    };

    SchedulerPlanningCalendar.prototype.onAfterRendering = function() {
        PlanningCalendar.prototype.onAfterRendering.apply(this, arguments);
    };

    SchedulerPlanningCalendar.prototype.exit = function() {
        PlanningCalendar.prototype.exit.apply(this, arguments);
        this.detachEvent("startDateChange", this.onStartDateChanged.bind(this));
    };

    SchedulerPlanningCalendar.prototype.addRow = function(oRow) {
        var oListItem = this._createPlanningCalendarListItem(oRow);
        this.addAggregation("rows", oRow, true);
        this.getAggregation("table").addItem(oListItem);
        this._applySchedulerPlanningCalendarListItemStyles(oListItem);
        return this;
    };

    SchedulerPlanningCalendar.prototype.insertRow = function(oRow, iIndex) {
        var oListItem = this._createPlanningCalendarListItem(oRow);
        this.insertAggregation("rows", oRow, iIndex);
        this.getAggregation("table").insertItem(oListItem, iIndex, true);
        this._applySchedulerPlanningCalendarListItemStyles(oListItem);
        return this;
    };

    /**
	 * Applies Custom Styling on PlanningCalendarRowListItem.
	 *
	 * @param {sap.m.internal.PlanningCalendarRowListItem} oListItem the planning calendar row
	 * @private
	 */
	SchedulerPlanningCalendar.prototype._applySchedulerPlanningCalendarListItemStyles = function(oListItem) {
        var oRowTimeline = this._getCalendarRowTimeline(oListItem);
        oRowTimeline._getPlanningCalendar = SchedulerPlanningCalendar.prototype._getPlanningCalendar;
        oRowTimeline.addStyleClass("zagUiCalendarRowAppointment");
        oRowTimeline.addEventDelegate({
            onAfterRendering: function(jqEvent) {
                var oRow = jqEvent.srcControl;
                oRow.getAppointments().forEach(function(oControl) {
                    oControl.$().addClass("zagSmallAppointment");
                });
            }
        });
    };

    SchedulerPlanningCalendar.prototype._getCalendarRowTimeline = function(oListItem) {
        if (oListItem && oListItem.getCells()) {
            return oListItem.getCells()[1];
        }
        return undefined;
    };


    /**
	* Checks if there's a PlanningCalendar or not
	* returns {team.zag.library.scheduling.controls.SchedulerPlanningCalendar}
    * @private
    * @returns {team.zag.library.scheduling.controls.SchedulerPlanningCalendar} the scheduler planning calendar
    */
    SchedulerPlanningCalendar.prototype._getPlanningCalendar = function() {
        /* eslint-disable consistent-this */
        if (!this._oPlanningCalendar) {
            var oParent = this;
            while (oParent.getParent() !== null) {
                if (oParent.getMetadata().getName() === "team.zag.library.scheduling.controls.SchedulerPlanningCalendar") {
                    this._oPlanningCalendar = oParent;
                    break;
                }
                oParent = oParent.getParent();
            }
        }
        /* eslint-enable consistent-this */
        return this._oPlanningCalendar;
    };

    SchedulerPlanningCalendar.prototype.getFilterStartDate = function() {
        return this.utilities.resetHours(this.getStartDate());
    };

    SchedulerPlanningCalendar.prototype.getFilterEndDate = function() {
        var sViewKey = this.getViewKey();
        var oStartDate = this.getFilterStartDate();
        var oEndDate;
        switch (sViewKey) {
            case "Day":
                oEndDate = this.utilities.addWeek(oStartDate, 2);
                break;
            case "Week":
                oEndDate = this.utilities.addWeek(oStartDate);
                break;
            case "One Month":
                oEndDate = this.utilities.addMonth(oStartDate);
                break;
            default:
                oEndDate = this.utilities.addWeek(oStartDate);
                break;
        }
        return oEndDate;
    };

    SchedulerPlanningCalendar.prototype.onStartDateChanged = function() {
        var sViewKey = this.getViewKey();
        var oStartDate = this.getFilterStartDate();
        var oEndDate = this.getFilterEndDate();
        var oDateRange = {
            startDate: oStartDate,
            endDate: oEndDate
        };
        this.setProperty("selectedInterval", oDateRange, true);
        this.fireIntervalSelect(oDateRange);
        if (oStartDate && oEndDate) {
            if (sViewKey === "One Month" && this._oOneMonthInterval !== undefined) {
                this._oOneMonthInterval.removeAllSelectedDates();
                this._oOneMonthInterval.addSelectedDate(null);
                this._oOneMonthInterval._iSelectedWeekNumber = undefined;
            }
        }
    };

    SchedulerPlanningCalendar.prototype._getAppointmentsBadges = function(aScheduledEvents) {
        var oAppointmentBadges = {};
        var iMaxAppointmentsPerDay = this.getMaxAppointmentBadgesPerDay();
        var oStartDate = this.getFilterStartDate();
        var oEndDate = this.getFilterEndDate();
        aScheduledEvents.forEach(function(oScheduledEvent) {
            if (oScheduledEvent.StartDate >= oStartDate && oScheduledEvent.StartDate <= oEndDate) {
                var sDate = this._formatCalendarDayAttribute(oScheduledEvent.StartDate);
                if (!oAppointmentBadges[sDate]) {
                    oAppointmentBadges[sDate] = [];
                }
                if (oAppointmentBadges[sDate].length < iMaxAppointmentsPerDay) {
                    oAppointmentBadges[sDate].push(oScheduledEvent);
                }

            }
        }.bind(this));
        return oAppointmentBadges;
    };

    SchedulerPlanningCalendar.prototype._renderMonthAppointmentBadges = function(oAppointmentBadges) {
        this.$().find(".zagOneMonthDayWithAppointment").remove();
        Object.keys(oAppointmentBadges).forEach(function(sDate) {
            var sAppend = [];
            sAppend.push("<div class=\"zagOneMonthDayWithAppointment\">");
            oAppointmentBadges[sDate].forEach(function(oScheduledEvent) {
                sAppend.push("<div class=\"zagOneMonthAppointment zagOneMonthAppointment" + oScheduledEvent.EventCode.Code + "\"></div>");
            });
            sAppend.push("</div>");
            this.$().find(".sapUiCalItem[data-sap-day='" + sDate + "']").not(".sapUiCalItemOtherMonth").append(sAppend.join(""));
        }.bind(this));
    };

    SchedulerPlanningCalendar.prototype._formatCalendarDayAttribute = function(oDate) {
        return DateFormat.getDateInstance({pattern: "yyyyMMdd"}).format(oDate);
    };

    SchedulerPlanningCalendar.prototype._onMonthIntervalAfterRendering = function(oEvent) {
        this.renderSmallAppointments();
    };

    SchedulerPlanningCalendar.prototype.renderSmallAppointments = function(aScheduledEvents) {
        if (aScheduledEvents) {
            this._aScheduledEvents = aScheduledEvents;
        }
        var oAppointmentBadges = this._getAppointmentsBadges(this._aScheduledEvents);
        this._renderMonthAppointmentBadges(oAppointmentBadges);
    };

    SchedulerPlanningCalendar.prototype._setupCalendarInterval = function() {
        var that = this;
        if (this._oOneMonthInterval && !this._bIsOneMonthFixed) {
            this._oOneMonthInterval.onclick = this._onOneMonthCalendarClick.bind(this._oOneMonthInterval);
            this._oOneMonthInterval._handleWeekSelection = function (oEventTarget) {
                Calendar.prototype._handleWeekSelection.apply(this, arguments);
                var oFormatter = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyyMMdd"});
                var sStartDate = jQuery(oEventTarget.parentElement).attr("data-sap-day");
                var oStartDate = oFormatter.parse(sStartDate);
                var oEndDate = new Date(oStartDate.getFullYear(), oStartDate.getMonth(), oStartDate.getDate() + 7);
                var iSelectedWeekNumber = parseInt(oEventTarget.innerText, 10);
                this._iSelectedWeekNumber = (this._iSelectedWeekNumber === iSelectedWeekNumber ? undefined : iSelectedWeekNumber);
                var oDateRange = (this._iSelectedWeekNumber ? {startDate: new Date(oStartDate), endDate: new Date(oEndDate), subInterval: false, row: undefined} : undefined);
                that.setProperty("selectedInterval", oDateRange, true);
                that.fireIntervalSelect(oDateRange);
            };
            var oMonth = (this._oOneMonthInterval.getAggregation("month") && this._oOneMonthInterval.getAggregation("month")[0]);
            if (oMonth) {
               oMonth.addEventDelegate({
                    onAfterRendering: this._onMonthIntervalAfterRendering.bind(this)
                });
                this._bIsOneMonthFixed = true;
            }
        }
    };

    /**
    * Checks if there's a selected "Week" in the Planning Calendar.
    *
	* returns {team.zag.components.scheduling.SchedulingApp.controls.SchedulerPlanningCalendar}
    * @private
    * @returns {sap.ui.unified.DateRange} the selected range or null if none is selected
    */
    SchedulerPlanningCalendar.prototype.getSelectedDates = function() {
        if (this._oOneMonthInterval) {
            var oMonth = (this._oOneMonthInterval.getAggregation("month") && this._oOneMonthInterval.getAggregation("month")[0]);
            if (oMonth) {
                var aSelectedDates = oMonth.getSelectedDates();
                if (aSelectedDates.length === 1) {
                    return aSelectedDates[0];
                }
            }
        }
        return null;
    };

	SchedulerPlanningCalendar.prototype.setViewKey = function(sKey) {
        if (sKey && sKey !== "") {
            PlanningCalendar.prototype.setViewKey.apply(this, arguments);
            this._setupCalendarInterval();
        }
    };

    SchedulerPlanningCalendar.prototype._findAppointmentLeft = function(oStartDate, iRowStartDate, iRowSize) {
        var iStartDate = new Date(oStartDate.getTime()).setHours(1, 0, 0, 0);
        var iRowStartTime = new Date(iRowStartDate).setHours(0, 0, 0, 0);
        var iBegin = (100 * ((iStartDate - iRowStartTime) / iRowSize));
        return (Math.round(iBegin * 100000) / 100000) + 0.1;
    };

    SchedulerPlanningCalendar.prototype._findAppointmentRight = function(oEndDate, iRowStartDate, iRowSize) {
        var iEndDate = new Date(oEndDate.getTime()).setHours(23, 0, 0, 0);
        var iRowStartTime = new Date(iRowStartDate).setHours(0, 0, 0, 0);
        var iEnd = (100 - (100 * (iEndDate - iRowStartTime) / iRowSize));
        return (Math.round(iEnd * 100000) / 100000) + 0.1;
    };

	SchedulerPlanningCalendar.prototype._onOneMonthCalendarClick = function(oEvent) {
		var oEventTarget = oEvent.target, bTargetClassList = oEventTarget.classList.contains("sapUiCalWeekNum");
		if (this.getPrimaryCalendarType() === sap.ui.core.CalendarType.Gregorian && bTargetClassList) {
			this._handleWeekSelection(oEventTarget);
		}
		if (oEvent.isMarked("delayedMouseEvent") ) {
			return;
		}
		if (oEventTarget.id == this.getId() + "-cancel") {
			this.onsapescape(oEvent);
		}
    };

    SchedulerPlanningCalendar.prototype._onIntervalSelected = function(oEvent) {
        var oStartDate = oEvent.getParameter("startDate");
        var oEndDate = oEvent.getParameter("endDate");
        var oSelectedDate = new sap.ui.unified.DateRange(undefined, {startDate: oStartDate, endDate: oEndDate});
		var sViewKey = this.getViewKey();
        if (this._oOneMonthInterval) {
            this._oOneMonthInterval.destroySelectedDates();
        }
        if (this._oWeekInterval) {
            this._oWeekInterval.destroySelectedDates();
        }
        if (this._oDateInterval) {
            this._oDateInterval.destroySelectedDates();
        }
        jQuery.sap.delayedCall(0, this, function() {
            if (sViewKey === "One Month" && this._oOneMonthInterval) {
                this._oOneMonthInterval.addSelectedDate(oSelectedDate);
            }
            if (sViewKey === "Week" && this._oWeekInterval) {
                this._oWeekInterval.addSelectedDate(oSelectedDate);
            }
            if (sViewKey === "Day" && this._oDateInterval) {
                this._oDateInterval.addSelectedDate(oSelectedDate);
            }
        }.bind(this));
    };

	return SchedulerPlanningCalendar;

});