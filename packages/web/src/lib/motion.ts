/**
 * Site-wide GSAP motion system, driven by data attributes so components stay
 * declarative:
 *
 * - `data-header`          — gets `data-scrolled` toggled past the fold edge
 * - `data-hero`            — content wrapper for the orchestrated load timeline
 * - `data-hero-title`      — SplitText line-mask reveal inside the hero
 * - `data-hero-item`       — staggered fade-ups inside the hero, DOM order
 * - `data-hero-img`        — hero artwork fade-in
 * - `data-split`           — scroll-triggered SplitText line-mask headline
 * - `data-reveal`          — single fade-up on scroll enter
 * - `data-reveal-group`    — staggers its direct children on scroll enter
 * - `data-img-reveal`      — artwork opacity/scale settle (one-shot, no parallax)
 *
 * Elements that start hidden do so via the `js:motion-safe:opacity-0` utility,
 * so no-JS visitors and reduced-motion users always see the final state.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: "power3.out" });

/* Header scroll state — UI state, not motion, so it runs unconditionally. */
const header = document.querySelector<HTMLElement>("[data-header]");
if (header) {
  ScrollTrigger.create({
    start: 24,
    onEnter: () => header.setAttribute("data-scrolled", ""),
    onLeaveBack: () => header.removeAttribute("data-scrolled"),
  });
}

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  /* Scroll reveals — one-shot entrances, never scroll-scrubbed. fromTo with
     explicit end values, since some targets start utility-hidden. */
  for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
    gsap.fromTo(
      el,
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: Number(el.dataset.revealDelay ?? 0),
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
  }

  for (const group of document.querySelectorAll<HTMLElement>(
    "[data-reveal-group]"
  )) {
    gsap.fromTo(
      [...group.children],
      { y: 26, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.09,
        clearProps: "transform",
        scrollTrigger: { trigger: group, start: "top 85%", once: true },
      }
    );
  }

  for (const img of document.querySelectorAll<HTMLElement>(
    "[data-img-reveal]"
  )) {
    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.04 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: img.closest("section") ?? img,
          start: "top 70%",
          once: true,
        },
      }
    );
  }

  /* Type reveals wait for webfonts so SplitText measures real line breaks. */
  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();

    for (const el of document.querySelectorAll<HTMLElement>("[data-split]")) {
      const split = SplitText.create(el, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onComplete: () => split.revert(),
      });
    }
  });
});

/* Reduced motion: undo utility-hidden states; everything renders in place. */
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.set("[data-hero], [data-hero-item], [data-reveal], [data-hero-img]", {
    opacity: 1,
  });
});
