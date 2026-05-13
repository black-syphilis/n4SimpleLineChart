/* Decompiler 25ms, total 141ms, lines 53 */
package com.wse.simpleLineChart;

import javax.baja.license.LicenseManager;
import javax.baja.naming.BOrd;
import javax.baja.rpc.NiagaraRpc;
import javax.baja.rpc.Transport;
import javax.baja.rpc.TransportType;
import javax.baja.sys.BSingleton;
import javax.baja.sys.BajaRuntimeException;
import javax.baja.sys.Context;
import javax.baja.sys.Sys;
import javax.baja.sys.Type;
import javax.baja.web.BIFormFactorMax;
import javax.baja.web.BIOffline;
import javax.baja.web.js.BIJavaScript;
import javax.baja.web.js.JsInfo;

public final class BSimpleLineChartWidget extends BSingleton implements BIJavaScript, BIFormFactorMax, BIOffline {
   public static final BSimpleLineChartWidget INSTANCE = new BSimpleLineChartWidget();
   public static final Type TYPE = Sys.loadType(BSimpleLineChartWidget.class);
   private static final JsInfo jsInfo;

   private BSimpleLineChartWidget() {
   }

   @NiagaraRpc(
      permissions = "unrestricted",
      transports = {@Transport(
   type = TransportType.box
)}
   )
   public static void checkLicense(Context cx) {
      try {
         LicenseManager licenseManager = Sys.getLicenseManager();
         licenseManager.checkFeature("WSE", "simpleLineChart").check();
      } catch (Exception var2) {
         throw new BajaRuntimeException(var2);
      }
   }

   public Type getType() {
      return TYPE;
   }

   public JsInfo getJsInfo(Context cx) {
      return jsInfo;
   }

   static {
      jsInfo = JsInfo.make(BOrd.make("module://simpleLineChart/rc/SimpleLineChartWidget.js"), BSimpleLineChartJsBuild.TYPE);
   }
}