// eslint-disable-next-line no-undef
sap.ui.define([
	"com/myorg/library/library",
	"com/myorg/library/Example",
	"com/myorg/library/FunkyInput",
	"com/myorg/library/SchedulerPlanningCalendar"
], function (library, Example, FunkyInput, SchedulerPlanningCalendar) {
	"use strict";

	// refer to library types
	var ExampleColor = library.ExampleColor;
	let _demoInput = new FunkyInput({
		value: "{ path: 'City', type:'sap.ui.model.type.String',constraints: { } }",
		tooltip: "Information",
		endPress: "onInformationButtonPressed"

	});
	// create a new instance of the Example control and
	// place it into the DOM element with the id "content"
	let _example = new Example({
		text: "Example",
		color: ExampleColor.Highlight
	});
	_example.placeAt("content");

// 	<zag:SchedulerPlanningCalendar id="mCalendar" busyIndicatorDelay="0" class="sapMPlanCalSuppressAlternatingRowColors" showWeekNumbers="true" showRowHeaders="true" showDayNamesLine="true" viewKey="{parts: ['device>/', 'ViewType', 'vm>/selectedCalendarViewType'], formatter: '.Formatter.formatCalendarViewType'}" appointmentsVisualization="Filled" showEmptyIntervalHeaders="false" rows="{path: 'EnrolmentSet', events: {dataRequested: '.onPlanningCalendarRowDataRequested', dataReceived: '.onPlanningCalendarRowDataReceived'}, parameters: {expand: 'Employee'}, templateShareable: 'true'}" startDateChange="onPlanningCalendarStartDateChanged" intervalSelect="onIntervalSelected" rowHeaderClick="onEmployeeSelected" appointmentSelect="onAppointmentSelected">
// 	<zag:rows>
// 		<PlanningCalendarRow id="mCalendarRow" title="{Employee/Name/FormattedName}" text="{Employee/JobTitle}" appointments="{path: '/EventSet', parameters: {expand: 'EventCode'}, events: {dataRequested: '.onPlanningCalendarAppointmentsDataRequested'}, templateShareable: 'true'}">
// 			<appointments>
// 				<unified:CalendarAppointment startDate="{parts: ['StartDate'], formatter: '.Formatter.formatEventStartDate'}" endDate="{parts: ['StartDate'], formatter: '.Formatter.formatEventEndDate'}" title="{parts: ['device>/', 'Title'], formatter: '.Formatter.formatScheduledEventTitle'}" text="{parts: ['device>/', 'Title', 'Description'], formatter: '.Formatter.formatScheduledEventDescription'}" type="{parts: ['EventCode/Code'], formatter: '.Formatter.formatEventCode'}" tentative="{IsRequested}"/>
// 			</appointments>
// 		</PlanningCalendarRow>
// 	</zag:rows>
// </zag:SchedulerPlanningCalendar>
	//Add the SchedulerPlanningCalendar
	let _SchedulerPlanningCalendar = new SchedulerPlanningCalendar({

	});


});
