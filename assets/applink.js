/* HippoPlot app-link helper (vanilla JS).
   - /open-in-app (served for /business/*, /user/*, /feed, /settings, /map, /reset-password
     via _redirects): points the "Open in HippoPlot" button at hippoplot://<same path, query
     and #fragment>, which the app routes exactly like the https link.
   - Homepage: email-confirmation links from the app (/?code=... or #access_token=...)
     are sent to the open-in-app page so the person can finish in the app. */
(function () {
  "use strict";
  var loc = window.location;
  var path = loc.pathname.replace(/\/+$/, "") || "/";
  var hasAuth = /[?&](code|token_hash|error_description)=/.test(loc.search) || /access_token=|error_description=/.test(loc.hash);

  if (path === "/" || path === "/index.html") {
    if (hasAuth) loc.replace("/open-in-app" + loc.search + loc.hash);
    return;
  }

  var btn = document.getElementById("oia-open");
  if (!btn) return;
  // /open-in-app itself (or with a trailing slash) means "the app's home screen".
  var appPath = /^\/open-in-app(\/|$)/.test(path) ? "" : path.replace(/^\//, "");
  btn.setAttribute("href", "hippoplot://" + appPath + loc.search + loc.hash);

  var title = document.getElementById("oia-title");
  var text = document.getElementById("oia-text");
  var set = function (t, d) { if (title) title.textContent = t; if (text) text.textContent = d; };
  if (path === "/reset-password") {
    set("Reset your password", "Tap the button below on the phone where HippoPlot is installed to choose a new password in the app.");
    btn.textContent = "Continue in HippoPlot";
  } else if (hasAuth) {
    set("Your email is confirmed", "Tap the button below to continue in the HippoPlot app. You can also open the app and sign in.");
    btn.textContent = "Continue in HippoPlot";
  } else if (/^\/business\//.test(path)) {
    set("View this business in HippoPlot", "This business profile opens in the HippoPlot app. Tap the button below on the phone where HippoPlot is installed.");
  } else if (/^\/user\//.test(path)) {
    set("View this profile in HippoPlot", "This profile opens in the HippoPlot app. Tap the button below on the phone where HippoPlot is installed.");
  } else if (/^\/feed/.test(path)) {
    set("View this post in HippoPlot", "This post opens in the HippoPlot app. Tap the button below on the phone where HippoPlot is installed.");
  }
})();
