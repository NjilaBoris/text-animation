"use client";
// App.jsx — Scroll-synced title reveal using GSAP + ScrollTrigger + SplitText and smooth scrolling via Lenis.
// This file now uses a reusable AnimatedTitles component.

import {useEffect, useRef} from "react";
import gsap from "gsap";

// Lenis provides smooth scrolling; the React wrapper exposes a ref
import {ReactLenis} from "lenis/react";
import AnimatedTitles from "./components/AnimatedTitles.jsx";

export default function Home() {
    // Ref to control Lenis instance
    const lenisRef = useRef(null);

    // Wire Lenis to GSAP's ticker so both share the same RAF clock.
    // We multiply by 1000 because Lenis expects time in ms.
    useEffect(() => {
        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);

        // Clean up the ticker on unmount
        return () => gsap.ticker.remove(update);
    }, []);

    // Markup: intro/outro surrounding the reusable animated titles.
    return (<>
        {/* Lenis root enables smooth scrolling; autoRaf disabled because GSAP ticker drives it */}
        <ReactLenis root options={{autoRaf: false}} ref={lenisRef}/>

        <section className="intro">
            <h1>Scroll begins</h1>
        </section>

        <AnimatedTitles titles={["Subtle Phase", "Hidden Flow", "Calm Glide"]} />

        <section className="outro">
            <h1>End of motion</h1>
        </section>
    </>);
}
