package com.wse.simpleLineChart;

import javax.baja.naming.BOrd;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.js.BJsBuild;

public class BSimpleLineChartJsBuild extends BJsBuild {
   public static final BSimpleLineChartJsBuild INSTANCE = new BSimpleLineChartJsBuild("simpleLineChart", new BOrd[]{BOrd.make("module://simpleLineChart/rc/simpleLineChart.built.min.js")});
   public static final Type TYPE = Sys.loadType(BSimpleLineChartJsBuild.class);

   public Type getType() {
      return TYPE;
   }

   private BSimpleLineChartJsBuild(String id, BOrd[] builtFiles) {
      super(id, builtFiles);
   }
}