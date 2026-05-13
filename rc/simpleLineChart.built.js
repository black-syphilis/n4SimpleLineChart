define("nmodule/simpleLineChart/rc/SimpleLineChartWidget", [
  "bajaux/Widget",
  "bajaux/events",
  "bajaux/mixin/subscriberMixIn",
  "nmodule/simpleLineChart/rc/d3/d3.v3.min",
  "nmodule/simpleLineChart/rc/c3/c3.min",
  "jquery",
  "baja!",
  "nmodule/simpleLineChart/rc/modelHistory",
  "nmodule/simpleLineChart/rc/dateUtil",
  "css!nmodule/simpleLineChart/rc/c3/c3.min",
  "css!nmodule/simpleLineChart/rc/simpleLineChartWidget"
], function (
  Widget,
  events,
  subscriberMixIn,
  d3,
  c3,
  $,
  baja,
  modelHistory,
  dateUtil
) {
  "use strict";

  var currentData;
  var isLicensed = true;
  var refreshTimer = null;

  var DEFAULTS = {
    defaultBackgroundColor: "#3D3D3D",
    defaultBorderColor: "#727272",
    defaultBorderThickness: 4,
    defaultDateFormat: "d/M/yy",
    defaultTitle: "Chart 1",
    legendLocation: "100,120",
    lineColor: "#1f77b4",
    limit: 10,
    offset: 0,
    padding: "60,80,60,80",
    titleXOffset: 50,
    titleYOffset: 40,
    titleFontSize: "16px",
    titleFontColor: "#808080",
    titleFontWeight: "bold"
  };

  function SimpleLineChartWidget() {
    Widget.apply(this, arguments);

    this.properties()
      .add("backgroundColor", "#3D3D3D")
      .add("borderColor", "#727272")
      .add("borderThickness", 4)
      .add("dateFormat", "d/M/yy")
      .add("historyBql", "|bql:select timestamp, value order by timestamp DESC")
      .add("legendLocation", "100,120")
      .add("limit", 10)
      .add("lineColor", "#1f77b4")
      .add("offset", 0)
      .add("padding", "60,80,60,80")
      .add("refreshInterval", 60000)
      .add("titleFontColor", "#fff")
      .add("titleFontWeight", "bold")
      .add("titleXOffset", 50)
      .add("titleYOffset", 40)
      .add("title", "Chart 1")
      .add("titleFontSize", "16px");

    subscriberMixIn(this);
  }

  SimpleLineChartWidget.prototype = Object.create(Widget.prototype);
  SimpleLineChartWidget.prototype.constructor = SimpleLineChartWidget;

  SimpleLineChartWidget.prototype.setOrdValue = function (ord) {
    this.$ord = ord;
  };

  SimpleLineChartWidget.prototype.setHistoryBql = function (historyBql) {
    this.$historyBql = historyBql;
  };

  SimpleLineChartWidget.prototype.setBackgroundColor = function (color) {
    this.$backgroundColor = color;
  };

  SimpleLineChartWidget.prototype.setBorderColor = function (color) {
    this.$borderColor = color;
  };

  SimpleLineChartWidget.prototype.setBorderThickness = function (thickness) {
    this.$borderThickness = thickness;
  };

  SimpleLineChartWidget.prototype.setDateFormat = function (format) {
    this.$dateFormat = format;
  };

  SimpleLineChartWidget.prototype.setLegendLocation = function (location) {
    this.$legendLocation = location;
  };

  SimpleLineChartWidget.prototype.setLimit = function (limit) {
    this.$limit = limit;
  };

  SimpleLineChartWidget.prototype.setOffset = function (offset) {
    this.$offset = offset;
  };

  SimpleLineChartWidget.prototype.setRefreshPeriod = function (period) {
    this.$refreshPeriod = period;
  };

  SimpleLineChartWidget.prototype.setLineColor = function (color) {
    this.$lineColor = color;
  };

  SimpleLineChartWidget.prototype.setPadding = function (padding) {
    this.$padding = padding;
  };

  SimpleLineChartWidget.prototype.setTitleFontSize = function (size) {
    this.$titleFontSize = size;
  };

  SimpleLineChartWidget.prototype.setTitleFontColor = function (color) {
    this.$titleFontColor = color;
  };

  SimpleLineChartWidget.prototype.setTitleFontWeight = function (weight) {
    this.$titleFontWeight = weight;
  };

  SimpleLineChartWidget.prototype.setTitleXOffset = function (offset) {
    this.$titleXOffset = offset;
  };

  SimpleLineChartWidget.prototype.setTitleYOffset = function (offset) {
    this.$titleYOffset = offset;
  };

  SimpleLineChartWidget.prototype.setTitle = function (title) {
    this.$title = title;
  };

  function getWidgetSize(widget) {
    var jq = widget.jq();

    return {
      width: jq.width(),
      height: jq.height()
    };
  }

  function randomId(length) {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";

    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    return result;
  }

  function checkLicense() {
    return baja.rpc({
      typeSpec: "simpleLineChart:SimpleLineChartWidget",
      method: "checkLicense"
    });
  }

  function showLicenseError(dom, error) {
    dom.html("Your station is not licensed for this widget: " + error.message);
    console.log("Unlicensed");
  }

  function renderChart(widget, historyData) {
    var size = getWidgetSize(widget);
    var chartValues = historyData.chartValues;

    var yValues = chartValues.yValues
      ? [chartValues.valueText].concat(chartValues.yValues)
      : [];

    var xValues = chartValues.xValues
      ? ["x"].concat(chartValues.xValues)
      : [];

    historyData.width = size.width || 400;
    historyData.height = size.height || 400;

    var legendLocation = widget.$legendLocation.split(",");

    historyData.legendx = historyData.width / 2 - parseInt(legendLocation[0]);
    historyData.legendy = historyData.height - parseInt(legendLocation[1]);

    var padding = widget.$padding.split(",");

    if (widget.$chart !== null) {
      widget.$chart.load({
        columns: [xValues, yValues]
      });
      return;
    }

    widget.$chart = c3.generate({
      bindto: widget.$dom,

      size: {
        height: historyData.height,
        width: historyData.width
      },

      data: {
        x: "x",
        columns: [xValues, yValues]
      },

      axis: {
        x: {
          type: "category",
          tick: {
            format: function (index) {
              return dateUtil.formatDate(
                this.api.categories()[index],
                widget.$dateFormat,
                null
              );
            }
          }
        }
      },

      color: {
        pattern: [widget.$lineColor]
      },

      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
      },

      tooltip: {},

      padding: {
        top: parseInt(padding[0]),
        right: parseInt(padding[1]),
        bottom: parseInt(padding[2]),
        left: parseInt(padding[3])
      },

      transition: {
        duration: 750
      },

      legend: {
        show: true,
        position: "inset",
        inset: {
          anchor: "top-right",
          x: historyData.legendx,
          y: historyData.legendy,
          step: 1
        }
      }
    });

    d3.select("svg")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "none")
      .attr("stroke-width", widget.$borderThickness)
      .attr("stroke", widget.$borderColor);

    d3.select("svg")
      .append("text")
      .attr("x", widget.$titleXOffset)
      .attr("y", widget.$titleYOffset)
      .style("text-anchor", "middle")
      .style("font-size", widget.$titleFontSize)
      .style("font-weight", widget.$titleFontWeight)
      .text(widget.$title)
      .style("fill", widget.$titleFontColor);

    $(".SimpleLineChartWidgetOuter").css(
      "background-color",
      widget.$backgroundColor
    );
  }

  function refreshChart(widget) {
    if (isLicensed === false) {
      console.log("License Exception");
      return;
    }

    modelHistory.resolveData(widget).then(function (historyData) {
      renderChart(widget, historyData);
    });
  }

  SimpleLineChartWidget.prototype.doInitialize = function (dom) {
    dom.css("overflow", "hidden");
    window.d3 = d3;

    var widget = this;
    var jq = widget.jq();

    dom.addClass("SimpleLineChartWidgetOuter");

    widget.$dom = dom[0];
    widget.$chart = null;

    checkLicense()
      .then(function () {})
      .catch(function (error) {
        showLicenseError(widget.jq(), error);
        isLicensed = false;
      });

    if (jq.parent().parent()) {
      jq.parent().parent()[0].id = randomId(8);

      if (jq.parent()[0].style) {
        jq.parent()[0].style.overflow = "hidden";
      }
    }

    widget.$backgroundColor =
      widget.$backgroundColor ||
      widget.properties().getValue("backgroundColor") ||
      DEFAULTS.defaultBackgroundColor;

    widget.$borderColor =
      widget.$borderColor ||
      widget.properties().getValue("borderColor") ||
      DEFAULTS.defaultBorderColor;

    widget.$borderThickness =
      widget.$borderThickness ||
      widget.properties().getValue("borderThickness") ||
      DEFAULTS.defaultBorderThickness;

    widget.$dateFormat =
      widget.$dateFormat ||
      widget.properties().getValue("dateFormat") ||
      DEFAULTS.defaultDateFormat;

    widget.$legendLocation =
      widget.$legendLocation ||
      widget.properties().getValue("legendLocation") ||
      DEFAULTS.legendLocation;

    widget.$lineColor =
      widget.$lineColor ||
      widget.properties().getValue("lineColor") ||
      DEFAULTS.lineColor;

    widget.$padding =
      widget.$padding ||
      widget.properties().getValue("padding") ||
      DEFAULTS.padding;

    widget.$refreshInterval =
      widget.$refreshInterval ||
      widget.properties().getValue("refreshInterval") ||
      60000;

    widget.$titleFontSize =
      widget.$titleFontSize ||
      widget.properties().getValue("titleFontSize") ||
      DEFAULTS.titleFontSize;

    widget.$titleFontColor =
      widget.$titleFontColor ||
      widget.properties().getValue("titleFontColor") ||
      DEFAULTS.titleFontColor;

    widget.$titleFontWeight =
      widget.$titleFontWeight ||
      widget.properties().getValue("titleFontWeight") ||
      DEFAULTS.titleFontWeight;

    widget.$titleXOffset =
      widget.$titleXOffset ||
      widget.properties().getValue("titleXOffset") ||
      DEFAULTS.titleXOffset;

    widget.$titleYOffset =
      widget.$titleYOffset ||
      widget.properties().getValue("titleYOffset") ||
      DEFAULTS.titleYOffset;

    widget.$title =
      widget.$title ||
      widget.properties().getValue("title") ||
      DEFAULTS.defaultTitle;

    widget.$historyBql =
      widget.$historyBql ||
      widget.properties().getValue("historyBql") ||
      "";

    widget.$limit =
      widget.$limit ||
      widget.properties().getValue("limit") ||
      DEFAULTS.limit;

    widget.$offset =
      widget.$offset ||
      widget.properties().getValue("offset") ||
      DEFAULTS.offset;

    refreshTimer = setInterval(function () {
      refreshChart(widget);
    }, widget.$refreshInterval);
  };

  SimpleLineChartWidget.prototype.doLayout = function () {};

  SimpleLineChartWidget.prototype.doChanged = function () {
    refreshChart(this);
  };

  SimpleLineChartWidget.prototype.doDestroy = function () {
    this.jq().removeClass("SimpleLineChartWidgetOuter");

    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
  };

  SimpleLineChartWidget.prototype.doLoad = function () {
    var widget = this;

    if (widget.value().$tableData) {
      var historyReq = widget.value().$tableData.req.o;

      widget.$historyId = historyReq.replace("history:", "");
      refreshChart(widget);
      return;
    }

    var ord = widget.value()
      ? widget.value().getNavOrd().relativizeToSession().toString()
      : widget.$ord;

    baja.Ord.make(ord)
      .get({
        lease: true
      })
      .then(function (component) {
        component
          .getSlots()
          .is("history:NumericIntervalHistoryExt")
          .each(function (slot) {
            var historyExt = component.get(slot);
            var historyExtOrd = historyExt.getNavOrd().toString();

            baja.Ord.make(historyExtOrd)
              .resolve({
                lease: true
              })
              .then(function (resolvedHistoryExt) {
                var historyConfigOrd = resolvedHistoryExt
                  .getComponent()
                  .getHistoryConfig()
                  .getNavOrd()
                  .toString();

                baja.Ord.make(historyConfigOrd)
                  .resolve({
                    lease: true
                  })
                  .then(function (resolvedHistoryConfig) {
                    widget.$historyId = resolvedHistoryConfig
                      .getComponent()
                      .getId()
                      .toString();

                    refreshChart(widget);
                  })
                  .catch(function (error) {
                    baja.error(
                      "ORD Error getting history historyConfigOrd: " + error
                    );
                  });
              })
              .catch(function (error) {
                baja.error("ORD Error getting history ext component: " + error);
              });
          });
      })
      .catch(function (error) {
        baja.error("ORD Error getting component: " + error);
      });
  };

  return SimpleLineChartWidget;
});