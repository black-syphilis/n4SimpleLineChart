/**
 * History Data Model for an HTML5 Chart.
 *
 * @module nmodule/simpleLineChart/rc/simpleLineChartWidget/modelHistory
 * @private
 */
define([
    'baja!',
    'Promise'], function (baja, Promise) {
        'use strict';

        return {

            /**
             * Asynchronously resolve an object that contains all the data necessary for rendering a gauge.
             *
             * @param  widget The Widget used to create the data.
             * @param  historyBql The History BQL.
             * @returns {Promise} A promise that resolves to an object that contains all of the
             * data used to render a gauge.
             */
            resolveData: function resolveData(widget) {

                var value = typeof widget.$value !== 'undefined' ? widget.$value : widget.value(),
                    yValues = [],
                    xValues = [],
                    promises = [],
                    dataArray = {};

                //"history:^AHU2|bql:select timestamp,value as 'Kw' order by timestamp DESC "
                // If using value ord binding
                if ((value !== undefined && value !== null) || widget.$historyId) {      

                    var ord = 'history:' + widget.$historyId + widget.$historyBql;
                    promises.push(baja.Ord.make(ord).get({
                        ok: function (result) {
                            // Iterate through all of the Columns
                            baja.iterate(result.getColumns(), function (col) {

                                if (col.getType().is('baja:Integer') || col.getType().is('baja:Double')) {
                                    dataArray['valueText'] = col.getDisplayName();
                                }

                            });
                        },
                        cursor: {

                            each: function () {

                                yValues.push(this.get('value').toFixed(2));
                                xValues.push(this.get('timestamp').getJsDate());
                            },
                            limit: widget.$limit, 
                            offset: widget.$offset
                        }
                    }));

                }

                return Promise.all(promises)
                    .then(function () {


                        dataArray['yValues'] = yValues.reverse();
                        dataArray['xValues'] = xValues.reverse();

                        return {
                            chartValues: dataArray,
                        };


                    });
            }
        };

    });
