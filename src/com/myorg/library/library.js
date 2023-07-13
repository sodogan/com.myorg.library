/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library com.myorg.library.
 */
sap.ui.define([
	"sap/ui/core/library"
], function () {
	"use strict";

	// delegate further initialization of this library to the Core
	// Hint: sap.ui.getCore() must still be used to support preload with sync bootstrap!
	sap.ui.getCore().initLibrary({
		name: "com.myorg.library",
		version: "${version}",
		dependencies: [ // keep in sync with the ui5.yaml and .library files
			"sap.ui.core",
			"sap.m"
		],
		types: [
			"com.myorg.library.ExampleColor"
		],
		interfaces: [],
		controls: [
			"com.myorg.library.Example",
			"com.myorg.library.FunkyInput"
		],
		elements: [],
		noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
	});

	/**
	 * Some description about <code>library</code>
	 *
	 * @namespace
	 * @name com.myorg.library
	 * @author Fiori tools
	 * @version ${version}
	 * @public
	 */
	var thisLib = com.myorg.library;

	/**
	 * Semantic Colors of the <code>com.myorg.library.Example</code>.
	 *
	 * @enum {string}
	 * @public
	 */
	thisLib.ExampleColor = {

		/**
		 * Default color (brand color)
		 * @public
		 */
		Default : "Default",

		/**
		 * Highlight color
		 * @public
		 */
		Highlight : "Highlight"

	};

	return thisLib;

});
