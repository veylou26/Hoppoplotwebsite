/* HippoPlot homepage feature reel. Vanilla JS, no dependencies.
   Auto-advances every 4.5s; pauses on hover/focus, when off-screen or the tab is hidden,
   and never autoplays for people who prefer reduced motion. Tap/click, swipe, the
   feature tabs and the arrow keys all change slides. */
(function () {
  "use strict";
  var root = document.getElementById("reel");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".reel-slide"));
  var tabs = Array.prototype.slice.call(root.querySelectorAll(".reel-tab"));
  var progress = root.querySelector(".reel-progress");
  var status = document.getElementById("reel-status");
  var screen = root.querySelector(".phone-screen");
  if (!slides.length || !progress || !screen) return;

  var DURATION = 4500;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;
  var timer = null;
  var hovering = false;
  var visible = true;

  root.style.setProperty("--reel-duration", DURATION + "ms");
  if (reduceMotion) root.classList.add("reel-static");

  var bars = slides.map(function () {
    var bar = document.createElement("span");
    bar.className = "reel-bar";
    bar.appendChild(document.createElement("i"));
    progress.appendChild(bar);
    return bar;
  });

  function label(i) {
    var t = tabs[i];
    return t ? t.textContent : "Feature " + (i + 1);
  }

  function render(dir) {
    slides.forEach(function (s, i) {
      s.classList.toggle("is-active", i === index);
      s.classList.toggle("is-prev", dir > 0 && i === (index - 1 + slides.length) % slides.length);
      s.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    bars.forEach(function (b, i) {
      b.classList.toggle("is-done", i < index);
      b.classList.remove("is-active");
      if (i === index) {
        void b.offsetWidth; // restart the fill animation
        b.classList.add("is-active");
      }
    });
    tabs.forEach(function (t, i) {
      t.classList.toggle("is-active", i === index);
      t.setAttribute("aria-pressed", i === index ? "true" : "false");
    });
  }

  function go(i, announce) {
    var next = (i + slides.length) % slides.length;
    var dir = next === (index + 1) % slides.length ? 1 : -1;
    index = next;
    render(dir);
    if (announce && status) status.textContent = label(index) + ", " + (index + 1) + " of " + slides.length;
    schedule();
  }

  function running() { return !reduceMotion && !hovering && visible && !document.hidden; }

  function schedule() {
    clearTimeout(timer);
    root.classList.toggle("is-paused", !running());
    if (running()) {
      // Resuming restarts the current slide's timer, so the bar and the timer stay in step.
      var bar = bars[index];
      bar.classList.remove("is-active"); void bar.offsetWidth; bar.classList.add("is-active");
      timer = setTimeout(function () { go(index + 1, false); }, DURATION);
    }
  }

  // Controls
  tabs.forEach(function (t, i) { t.addEventListener("click", function () { go(i, true); }); });
  var prev = root.querySelector(".reel-prev");
  var nextBtn = root.querySelector(".reel-next");
  if (prev) prev.addEventListener("click", function () { go(index - 1, true); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1, true); });
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(index + 1, true); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { go(index - 1, true); e.preventDefault(); }
  });

  // Swipe (horizontal or vertical) on the phone screen
  var sx = 0, sy = 0, tracking = false;
  screen.addEventListener("touchstart", function (e) {
    var t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true;
  }, { passive: true });
  screen.addEventListener("touchend", function (e) {
    if (!tracking) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
    var forward = Math.abs(dx) > Math.abs(dy) ? dx < 0 : dy < 0;
    go(forward ? index + 1 : index - 1, true);
  }, { passive: true });

  // Pause rules
  root.addEventListener("mouseenter", function () { hovering = true; schedule(); });
  root.addEventListener("mouseleave", function () { hovering = false; schedule(); });
  root.addEventListener("focusin", function () { hovering = true; schedule(); });
  root.addEventListener("focusout", function () { hovering = false; schedule(); });
  document.addEventListener("visibilitychange", schedule);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.25 }).observe(root);
  }

  render(1);
  schedule();
})();
