sap.ui.define([
    'sap/m/InputBase',
    'sap/m/InputBaseRenderer',
    'sap/ui/core/Icon',
    'sap/ui/core/IconPool',
], function (InputBase, InputBaseRenderer, Icon, IconPool) {
    'use strict';

    let _control = InputBase.extend("com.myorg.library.FunkyInput", {
        metadata: {
            properties: {
                comments: { type: "string", group: "Misc", defaultValue: null },
                tooltip: { type: "string", group: "Misc", defaultValue: "Information" }
            },//end properties
            events: {
                endPress: {},
            },
            aggregations: {
                icon: { type: "sap.ui.core.Icon", multiple: false, visibility: "public" }
            },
        },

        //init
        init: function () {
            debugger;
            InputBase.prototype.init.call(this);

            //set the required field
            //this.setRequired(true);


            //add the icon
            this.addEndIcon({
                noTabStop: true,
                tooltip: "Information",
                src: IconPool.getIconURI("sys-help"),
                press: this.onEndPress.bind(this)
            });

        },
        onBeforeRendering: function () {
            debugger;
            //get the tooltip
            let _toolTip = this.getTooltip();
            // if(_toolTip){
            //     this.setToolTip(_toolTip);
            // }
            //get the comments
            let _comments = this.getComments();
            //set the placeholder
            this.setValue(_comments);

        },

        onAfterRendering: function () {
            debugger;
        },
        //handler here

        onEndPress: function (oEvent) {
            //now here we need to fire the other event
            debugger;
            if (this.getEnabled()) {
                this.fireEndPress({});
            }
        },

        renderer: InputBaseRenderer//The same renderer


    });

    return _control;



});