/* ── Card data ─────────────────────────────────────────────────── */
let CARDS = [
  { colour: "", design: "", rot: -16, yOff: 65 },
  { colour: "", design: "", rot: -9, yOff: 24 },
  { colour: "", design: "", rot: 0, yOff: 0 },
  { colour: "", design: "", rot: 9, yOff: 24 },
  { colour: "", design: "", rot: 16, yOff: 65 },
];
const BASE_Z = [3, 4, 5, 4, 3];
let opened = false;
let flipped = [false, false, false, false, false];
let boxParallexEffect;

/* ── Hint ──────────────────────────────────────────────────────── */
const hintAppear = () => {
  gsap.to("#hint", {
    opacity: 1,
    duration: 0.7,
    delay: 1.3,
    ease: "power2.out",
  });
};

/* ── Mouse parallax for box ────────────────────────────────────────────── */
//gsap card effect
const cardTilt = (e, card) => {
  const movingcard = `.${card}`;
  const xPos = e.clientX / window.innerWidth - 0.5;
  const yPos = e.clientY / window.innerHeight - 0.5;

  boxParallexEffect = gsap.to(movingcard, 0.6, {
    rotationY: 105 * xPos,
    rotationX: -105 * yPos,
    ease: Power1.easeOut,
  });
};

const handleMouseMoveBox = (e) => {
  const $boxWrapper = document.querySelector(".box-wrapper");
  cardTilt(e, $boxWrapper.classList);
};

const parallaxEffect = () => {
  document.addEventListener("mousemove", handleMouseMoveBox);
};

/* ── Box open sequence ─────────────────────────────────────────── */
const OpenBox = () => {
  document
    .getElementById("box-wrapper")
    .addEventListener("click", handleOpenBox);
};

const handleOpenBox = () => {
  if (opened) return;
  opened = true;

  const tl = gsap.timeline();

  /* 1 — neutralise tilt */
  document.removeEventListener("mousemove", handleMouseMoveBox);

  boxParallexEffect.kill();

  tl.to(".box-wrapper", {
    rotateX: 0,
    rotateY: 0,
    y: 0,
    duration: 0.32,
    ease: "power2.out",
  });

  /* 2 — swing lid open */
  tl.to(
    "#box-lid",
    {
      rotateX: -45,
      duration: 0.78,
      ease: "power2.inOut",
      transformOrigin: "bottom center",
    },
    0.18,
  );

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
};

/* ── Build card DOM ────────────────────────────────────────────── */
const cardsScene = document.getElementById("cards-scene");

const BuildCardDeck = () => {
  for (let i = 0; i < CARDS.length; i++) {
    const RndColourNbr = Math.round(Math.random());
    if (RndColourNbr === 0) {
      CARDS[i].colour = "red";
    } else {
      CARDS[i].colour = "blue";
    }

    const RndDesignNbr = Math.ceil(Math.random() * 10);
    switch (RndDesignNbr) {
      case 1:
        CARDS[i].design = "baron";
        break;
      case 2:
        CARDS[i].design = "butler";
        break;
      case 3:
        CARDS[i].design = "gravin";
        break;
      case 4:
        CARDS[i].design = "joker";
        break;
      case 5:
        CARDS[i].design = "kamermeisje";
        break;
      case 6:
        CARDS[i].design = "koning";
        break;
      case 7:
        CARDS[i].design = "priester";
        break;
      case 8:
        CARDS[i].design = "prins";
        break;
      case 9:
        CARDS[i].design = "prinses";
        break;
      case 10:
        CARDS[i].design = "wachter";
        break;
      default:
        break;
    }
  }
  console.log(CARDS);
  BuildCardDOM();
};

const BuildCardDOM = () => {
 CARDS.forEach((card, i) => {
   const wrapper = document.createElement("div");
   wrapper.className = "card-wrapper";
   wrapper.style.zIndex = BASE_Z[i];

   var cardEl = document.createElement("div");
   cardEl.className = "card";

   var inner = document.createElement("div");
   inner.className = "card-inner";

   /* front */
   var face = document.createElement("div");
   face.className = "card-face";
   face.style.backgroundImage =`url(./../assets/cards/${card.colour}/${card.design}.svg)`;

   /* back */
   var back = document.createElement("div");
   back.className = "card-back";
   back.innerHTML = '<div class="card-back-pattern"></div>';

   inner.appendChild(face);
   inner.appendChild(back);
   cardEl.appendChild(inner);
   wrapper.appendChild(cardEl);
   cardsScene.appendChild(wrapper);

   /* fix arc rotation (never changes) */
   gsap.set(wrapper, { rotation: card.rot });

   /* hover — float up */
   cardEl.addEventListener("mouseenter", function () {
     gsap.to(wrapper, {
       y: card.yOff - 26,
       duration: 0.32,
       ease: "power2.out",
       overwrite: "auto",
     });
   });
   cardEl.addEventListener("mouseleave", function () {
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
}



/* ── run sequence ─────────────────────────────────────────── */
const init = () => {
  hintAppear();
  parallaxEffect();
  OpenBox();
  BuildCardDeck();
};

init();
