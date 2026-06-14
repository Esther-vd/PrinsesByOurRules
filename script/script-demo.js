/* ── Card data ─────────────────────────────────────────────────── */
var CARDS = [
  { design: "queen", rot: -18, yOff: 24 },
  { design: "queen", rot: -9, yOff: 9 },
  { design: "queen", rot: 0, yOff: 0 },
  { design: "queen", rot: 9, yOff: 9 },
  { design: "queen", rot: 18, yOff: 24 },
];
var BASE_Z = [3, 4, 5, 4, 3];
var opened = false;
var flipped = [false, false, false, false, false];

/* ── Hint ──────────────────────────────────────────────────────── */
gsap.to("#hint", { opacity: 1, duration: 0.7, delay: 1.3, ease: "power2.out" });

/* ── Float idle animation ──────────────────────────────────────── */
// var floatAnim = gsap.to("#box-wrapper", {
//   y: -14,
//   duration: 3,
//   ease: "sine.inOut",
//   yoyo: true,
//   repeat: -1,
// });

/* ── Mouse parallax ────────────────────────────────────────────── */
// var pushRotY = gsap.quickTo("#box-wrapper", "rotateY", {
//   duration: 0.55,
//   ease: "power2.out",
// });
// var pushRotX = gsap.quickTo("#box-wrapper", "rotateX", {
//   duration: 0.55,
//   ease: "power2.out",
// });

// window.addEventListener("mousemove", function (e) {
//   if (opened) return;
//   var nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
//   var ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
//   pushRotY(nx * 14);
//   pushRotX(-ny * 11);
// });

//gsap card effect
const cardTilt = (e, card) => {
  const movingcard = `.${card}`;
  const xPos = e.clientX / window.innerWidth - 0.5;
  const yPos = e.clientY / window.innerHeight - 0.5;

  gsap.to(movingcard, 0.6, {
    rotationY: 35 * xPos,
    rotationX: 35 * yPos,
    ease: Power1.easeOut,
  });
};

const cardsSetup = () => {
  const $boxWrapper = document.querySelector("box-wrapper");
  document.addEventListener("mousemove", (e) => {
    cardTilt(e, $boxWrapper.classList);
  });
  // const $box = document.querySelector("box");
  // document.addEventListener("mousemove", (e) => {
  //   cardTilt(e, $box.classList);
  // });
};

/* ── Build card DOM ────────────────────────────────────────────── */
var cardsScene = document.getElementById("cards-scene");

CARDS.forEach((card, i) => {
  var col = card.red ? "#c41e3a" : "#111827";

  var wrapper = document.createElement("div");
  wrapper.className = "card-wrapper";
  wrapper.style.zIndex = BASE_Z[i];

  var cardEl = document.createElement("div");
  cardEl.className = "card";

  var inner = document.createElement("div");
  inner.className = "card-inner";

  /* front */
  var face = document.createElement("div");
  face.className = "card-face";
  face.innerHTML =
    '<div class="card-inner-border"></div>' +
    '<div class="card-corner tl" style="color:' +
    col +
    '">' +
    '<div class="card-rank">' +
    card.rank +
    "</div>" +
    '<div class="card-suit-sm">' +
    card.suit +
    "</div>" +
    "</div>" +
    '<div class="card-corner br" style="color:' +
    col +
    '">' +
    '<div class="card-rank">' +
    card.rank +
    "</div>" +
    '<div class="card-suit-sm">' +
    card.suit +
    "</div>" +
    "</div>" +
    '<div class="card-center" style="color:' +
    col +
    '">' +
    card.suit +
    "</div>";

  /* back */
  var back = document.createElement("div");
  back.className = "card-back";
  back.innerHTML =
    '<div class="card-back-pattern"></div>' +
    '<div class="card-back-b1"></div>' +
    '<div class="card-back-b2"></div>';

  inner.appendChild(face);
  inner.appendChild(back);
  cardEl.appendChild(inner);
  wrapper.appendChild(cardEl);
  cardsScene.appendChild(wrapper);

  /* fix arc rotation (never changes) */
  gsap.set(wrapper, { rotation: card.rot });

  /* hover — float up */
  cardEl.addEventListener("mouseenter", function () {
    wrapper.style.zIndex = 20;
    gsap.to(wrapper, {
      y: card.yOff - 26,
      duration: 0.32,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
  cardEl.addEventListener("mouseleave", function () {
    wrapper.style.zIndex = BASE_Z[i];
    gsap.to(wrapper, {
      y: card.yOff,
      duration: 0.42,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  });

  /* click — flip */
  (function (idx, innerEl) {
    cardEl.addEventListener("click", function () {
      flipped[idx] = !flipped[idx];
      gsap.to(innerEl, {
        rotateY: flipped[idx] ? 180 : 0,
        duration: 0.55,
        ease: "power2.inOut",
      });
    });
  })(i, inner);
});

/* ── Box open sequence ─────────────────────────────────────────── */
document.getElementById("box-wrapper").addEventListener("click", function () {
  if (opened) return;
  opened = true;

  // floatAnim.kill();

  var tl = gsap.timeline();

  /* 1 — neutralise tilt */
  tl.to("#box-wrapper", {
    rotateX: 0,
    rotateY: 0,
    y: 0,
    duration: 0.32,
    ease: "power2.out",
  });

  /* 2 — swing lid open */
  tl.to(
    "#box-lid",
    { rotateX: -155, duration: 0.78, ease: "power2.inOut" },
    0.18,
  );

  /* 3 — glow burst */
  tl.to(
    "#glow-burst",
    { opacity: 1, scale: 1.4, duration: 0.22, ease: "power2.out" },
    0.72,
  );
  tl.to("#glow-burst", {
    opacity: 0,
    scale: 2.6,
    duration: 0.48,
    ease: "power2.in",
  });

  /* 4 — exit box */
  tl.to(
    "#box-scene",
    {
      opacity: 0,
      scale: 0.52,
      y: -60,
      filter: "blur(18px)",
      duration: 0.46,
      ease: "power2.inOut",
    },
    0.86,
  );

  /* 5 — card entrance */
  tl.call(
    function () {
      document.getElementById("box-scene").style.display = "none";
      cardsScene.style.display = "flex";

      var wrappers = cardsScene.querySelectorAll(".card-wrapper");
      wrappers.forEach(function (w, i) {
        gsap.fromTo(
          w,
          { y: 170, opacity: 0, scale: 0.72 },
          {
            y: CARDS[i].yOff,
            opacity: 1,
            scale: 1,
            duration: 0.68,
            delay: i * 0.09,
            ease: "back.out(1.5)",
          },
        );
      });

      var hint = document.getElementById("hint");
      gsap.to(hint, { opacity: 0, duration: 0.3 });
      gsap.delayedCall(0.4, function () {
        hint.textContent = "Click a card to flip it";
        gsap.to(hint, { opacity: 1, duration: 0.6 });
      });
    },
    null,
    1.22,
  );
});
