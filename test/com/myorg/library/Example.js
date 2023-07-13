// eslint-disable-next-line no-undef
sap.ui.define([
	"com/myorg/library/library",
	"com/myorg/library/Example",
	"com/myorg/library/FunkyInput"
], function(library, Example,FunkyInput) {
	"use strict";

	// refer to library types
	var ExampleColor = library.ExampleColor;
	let _demoInput = new FunkyInput({
		value:"{ path: 'City', type:'sap.ui.model.type.String',constraints: { } }",
		tooltip: "Information",
		endPress:"onInformationButtonPressed"

	});

	// create a new instance of the Example control and
	// place it into the DOM element with the id "content"
	new Example({
			text: "Example",
			color: ExampleColor.Highlight
	}).placeAt("content");

});
