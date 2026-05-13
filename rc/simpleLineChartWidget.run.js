define(['baja!',
    'bajaux/events',
    'jquery',
    'Promise',
    'nmodule/simpleLineChart/rc/SimpleLineChartWidget'], function (
        baja,
        events,
        $,
        Promise,
        simpleLineChartWidget,
        template) {

        'use strict';

        return {
            initialiseSimpleChart: function (config) {

                Promise.config({
                    // Enable warnings
                    warnings: false,
                    // Enable long stack traces
                    longStackTraces: false,
                    // Enable cancellation
                    cancellation: false,
                    // Enable monitoring
                    monitoring: false
                });

                var widget = new simpleLineChartWidget('simpleLineChart', 'simpleLineChart', 'mini');

                // Config                
                widget.setOrdValue(config.ord);
                widget.setHistoryBql(config.historyBql);
                widget.setBackgroundColor(config.backgroundColor);
                widget.setBorderColor(config.borderColor);
                widget.setBorderThickness(config.borderThickness);
                widget.setDateFormat(config.dateFormat);
                widget.setLegendLocation(config.legendLocation);
                widget.setLimit(config.limit);
                widget.setOffset(config.offset);
                widget.setLineColor(config.lineColor);
                widget.setPadding(config.padding);
                widget.setTitleFontSize(config.titleFontSize);
                widget.setTitleFontColor(config.titleFontColor);
                widget.setTitleFontWeight(config.titleFontWeight);
                widget.setTitleXOffset(config.titleXOffset);
                widget.setTitleYOffset(config.titleYOffset);
                widget.setTitle(config.title);

                var widgetDiv = $(config.divId);

                widget.initialize(widgetDiv)
                    .then(function () {

                        return widget.load();

                    });
            }
        };

    });