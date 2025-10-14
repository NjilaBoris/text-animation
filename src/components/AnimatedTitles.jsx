"use client";
// AnimatedTitles.jsx — Reusable GSAP SplitText + ScrollTrigger titles component.
// Renders a stack of title sections and animates them on scroll.
// Usage:
//   <AnimatedTitles titles={["Subtle Phase", "Hidden Flow", "Calm Glide"]} />
// Notes:
// - This component scopes all GSAP selectors to itself via a ref.
// - It does NOT require Lenis; if you use Lenis, wire it up in your page (e.g., App.jsx).

import {useRef} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {SplitText} from "gsap/SplitText";
import {useGSAP} from "@gsap/react";

export default function AnimatedTitles({
  titles = [],
  start = "top bottom",
  end = "top -25%",
  scrub = 1,
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      // Split each h1 into characters and preset Y offsets
      const titleHeadings = gsap.utils.toArray(".title h1");
      const splits = [];

      titleHeadings.forEach((heading) => {
        const split = SplitText.create(heading, {
          type: "chars",
          charsClass: "char",
        });
        splits.push(split);

        split.chars.forEach((char, i) => {
          const charInitialY = i % 2 === 0 ? -150 : 150;
          gsap.set(char, { y: charInitialY });
        });
      });

      const titlesEls = gsap.utils.toArray(".title");

      titlesEls.forEach((titleEl, index) => {
        const titleContainer = titleEl.querySelector(".title-container");
        // Default behavior: if there are at least 3 titles, slide middle one from left, others from right
        const titleContainerInitialX = index === 1 && titlesEls.length >= 3 ? -100 : 100;
        const split = splits[index];
        const charCount = split?.chars?.length ?? 0;

        ScrollTrigger.create({
          trigger: titleEl,
          start,
          end,
          scrub,
          onUpdate: (self) => {
            const titleContainerX = titleContainerInitialX - self.progress * titleContainerInitialX;
            gsap.set(titleContainer, { x: `${titleContainerX}%` });

            if (!split || !charCount) return;

            split.chars.forEach((char, i) => {
              const staggerIndex = index === 1 && titlesEls.length >= 3 ? charCount - 1 - i : i;

              const charStartDelay = 0.1;
              const charTimelineSpan = 1 - charStartDelay;
              const staggerFactor = Math.min(0.75, charTimelineSpan * 0.75);
              const delay = charStartDelay + (staggerIndex / charCount) * staggerFactor;
              const duration = charTimelineSpan - (staggerFactor * (charCount - 1)) / charCount;
              const startPoint = delay;

              let charProgress = 0;
              if (self.progress >= startPoint) {
                charProgress = Math.min(1, (self.progress - startPoint) / duration);
              }

              const charInitialY = i % 2 === 0 ? -150 : 150;
              const charY = charInitialY - charProgress * charInitialY;
              gsap.set(char, { y: charY });
            });
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section className="animated-titles" ref={containerRef}>
      {titles.map((t, i) => (
        <div className="title" key={i}>
          <div className="title-container">
            <h1>{t}</h1>
          </div>
        </div>
      ))}
    </section>
  );
}
