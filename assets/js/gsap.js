(function ($) {
    "use strict";

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // Touch screens keep native scrolling: normalizeScroll there blocks swiping inside
    // scrollable panels (cart drawer, side menu, search suggestions).
    let smoother = ScrollSmoother.create({
        smooth: 2,
        smoothTouch: false,
        normalizeScroll: ScrollTrigger.isTouch === 1 ? false : { debounce: true, allowNestedScroll: true },
        ignoreMobileResize: true,
    });


    if ($(".text-animation-effect").length) {
        let splitText = new SplitType(".text-animation-effect", { types: 'chars' });

        if ($(".text-animation-effect .char").length) {
            gsap.from(".text-animation-effect .char", {
                duration: 1,
                x: 50,
                autoAlpha: 0,
                stagger: 0.1
            });
        }
    }

    if (typeof gsap !== "undefined" && typeof SplitText !== "undefined") {

        gsap.registerPlugin(ScrollTrigger, SplitText);

        // ===== tz-sub-tilte =====
        $(".tz-sub-tilte").each(function (index, el) {
            if (!el || !$(el).length) return;

            let split = new SplitText(el, {
                type: "lines,words,chars",
                linesClass: "split-line"
            });

            if (split && split.chars && split.chars.length) {
                gsap.set(split.chars, { x: 20, opacity: 0 }); // prevent null animation

                gsap.to(split.chars, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        end: "top 60%",
                        scrub: 1
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.2
                });
            }
        });

        // ===== tz-itm-title =====
        $('.tz-itm-title').each(function (index, el) {

            if (!el || !$(el).length) return;

            let split = new SplitText(el, {
                type: "lines,words,chars",
                linesClass: "split-line"
            });

            if (split && split.chars && split.chars.length) {

                gsap.set(split.chars, {
                    opacity: 0.3,
                    x: -7
                });

                gsap.to(split.chars, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 92%",
                        end: "top 60%",
                        scrub: 1
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.2
                });
            }
        });

        ScrollTrigger.refresh();
    }

    // Prallax Img
    if ($('.tp-full-img-wrap').length > 0) {
        ScrollTrigger.create({
            trigger: ".tp-full-img-wrap",
            start: "top 65",
            end: "bottom 0%",
            pin: ".tp-full-img",
            pinSpacing: false,
        });
    }

    window.addEventListener("load", () => {
        gsap.registerPlugin(ScrollTrigger);

        const stickyEl = document.querySelector(".about-sticky-wrap");

        if (!stickyEl) return;

        ScrollTrigger.create({
            trigger: ".about-content-3",
            start: "top 90px",
            end: () => "+=" + stickyEl.offsetHeight * 1.2,
            pin: stickyEl,
            pinSpacing: false,
            anticipatePin: 1
        });
    });

    // Image Reveal
    let revealContainers = gsap.utils.toArray(".reveal");

    revealContainers.forEach(container => {

        if (!container) return;

        let image = container.querySelector("img");
        if (!image) return;

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                toggleActions: "restart none none reset"
            }
        });

        tl.set(container, { autoAlpha: 1 })
            .from(container, {
                xPercent: -100,
                duration: 1.5,
                ease: "power2.out"
            })
            .from(image, {
                xPercent: 100,
                scale: 1.3,
                duration: 1.5,
                delay: -1.5,
                ease: "power2.out"
            });
    });


    // ================= SIMPLE IMAGE SCALE REVEAL =================

    const images = document.querySelectorAll(".img-reveal");

    images.forEach(image => {

        if (!image) return;

        const img = image.querySelector("img");
        if (!img) return;

        gsap.set(image, { visibility: "visible" });

        const tl = gsap.timeline({ paused: true });

        // ✅ ONLY SCALE ANIMATION
        tl.from(img, {
            duration: 1.4,
            scale: 1.4,
            ease: "power2.inOut"
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tl.play();
                } else {
                    tl.progress(0).pause();
                }
            });
        }, { threshold: 0 });

        io.observe(image);
    });

    // Scroll Animation

    let typeSplit = new SplitType("[data-text-animation]", {
        types: "lines,words, chars",
        className: "line",
    });
    var text_animations = document.querySelectorAll(
        "[data-text-animation]"
    );

    function createScrollTrigger(triggerElement, timeline) {
        // Play tl when scrolled into view (60% from top of screen)
        ScrollTrigger.create({
            trigger: triggerElement,
            start: "top 80%",
            onEnter: () => timeline.play(),
            toggleClass: { targets: triggerElement, className: "active" }
        });
    }

    text_animations.forEach((animation) => {
        let type = "slide-up",
            duration = 0.75,
            offset = 80,
            stagger = 0.6,
            delay = 0,
            scroll = 1,
            split = "line",
            ease = "power2.out";
        // Set attribute
        if (animation.getAttribute("data-stagger")) {
            stagger = animation.getAttribute("data-stagger");
        }
        if (animation.getAttribute("data-duration")) {
            duration = animation.getAttribute("data-duration");
        }
        if (animation.getAttribute("data-text-animation")) {
            type = animation.getAttribute("data-text-animation");
        }
        if (animation.getAttribute("data-delay")) {
            delay = animation.getAttribute("data-delay");
        }
        if (animation.getAttribute("data-ease")) {
            ease = animation.getAttribute("data-ease");
        }
        if (animation.getAttribute("data-scroll")) {
            scroll = animation.getAttribute("data-scroll");
        }
        if (animation.getAttribute("data-offset")) {
            offset = animation.getAttribute("data-offset");
        }
        if (animation.getAttribute("data-split")) {
            split = animation.getAttribute("data-split");
        }
        if (scroll == 1) {
            if (type == "slide-up") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    yPercent: offset,
                    duration,
                    ease,
                    opacity: 0,
                    stagger: { amount: stagger },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "slide-down") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    yPercent: -offset,
                    duration,
                    ease,
                    opacity: 0,
                    stagger: { amount: stagger },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "rotate-in") {
                let tl = gsap.timeline({ paused: true });
                tl.set(animation.querySelectorAll(`.${split}`), {
                    transformPerspective: 400,
                });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    rotationX: -offset,
                    duration,
                    ease,
                    force3D: true,
                    opacity: 0,
                    transformOrigin: "top center -50",
                    stagger: { amount: stagger },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "slide-from-left") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    xPercent: -offset,
                    duration,
                    opacity: 0,
                    ease,
                    stagger: { amount: stagger },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "slide-from-right") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    xPercent: offset,
                    duration,
                    opacity: 0,
                    ease,
                    stagger: { amount: stagger },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "fade-in") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    duration,
                    ease,
                    opacity: 0,
                    stagger: { amount: stagger },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "fade-in-right") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    x: 100,
                    autoAlpha: 0,
                    duration,
                    stagger: stagger,
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "fade-in-bottom-line") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    autoAlpha: 0,
                    rotationX: -80,
                    force3D: true,
                    transformOrigin: "top center -50",
                    delay: 0.3,
                    duration,
                    stagger: stagger,
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "fade-in-random") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    duration,
                    ease,
                    opacity: 0,
                    stagger: { amount: stagger, from: "random" },
                });
                createScrollTrigger(animation, tl);
            }
            if (type == "scrub") {
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: animation,
                        start: "top 90%",
                        end: "top center",
                        scrub: true,
                    },
                });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0.2,
                    duration,
                    ease,
                    stagger: { amount: stagger },
                });
            }

            // Avoid flash of unstyled content
            gsap.set("[data-text-animation]", { opacity: 1 });
        } else {
            if (type == "slide-up") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    yPercent: offset,
                    duration,
                    ease,
                    opacity: 0,
                });
            }
            if (type == "slide-down") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    yPercent: -offset,
                    duration,
                    ease,
                    opacity: 0,
                });
            }
            if (type == "rotate-in") {
                let tl = gsap.timeline({ paused: true });
                tl.set(animation.querySelectorAll(`.${split}`), {
                    transformPerspective: 400,
                });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    rotationX: -offset,
                    duration,
                    ease,
                    force3D: true,
                    opacity: 0,
                    transformOrigin: "top center -50",
                });
            }
            if (type == "slide-from-right") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    xPercent: offset,
                    duration,
                    opacity: 0,
                    ease,
                });
            }
            if (type == "fade-in") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    duration,
                    ease,
                    opacity: 0,
                });
            }
            if (type == "fade-in-random") {
                let tl = gsap.timeline({ paused: true });
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0,
                    duration,
                    ease,
                    opacity: 0,
                    stagger: { amount: stagger, from: "random" },
                });
            }
            if (type == "scrub") {
                tl.from(animation.querySelectorAll(`.${split}`), {
                    opacity: 0.2,
                    duration,
                    ease,
                });
            }
        }
    });


    if ($(".fade-wrapper").length > 0) {
        $(".fade-wrapper").each(function () {
            var section = $(this);
            var fadeItems = section.find(".fade-top");

            fadeItems.each(function (index, element) {
                var delay = index * 0.10;

                gsap.set(element, {
                    opacity: 0,
                    y: 100,
                });

                ScrollTrigger.create({
                    trigger: element,
                    start: "top 100%",
                    end: "bottom 20%",
                    scrub: 0.5,
                    onEnter: function () {
                        gsap.to(element, {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            delay: delay,
                        });
                    },
                    once: true,
                });
            });
        });
    }

    let fadeArray_items = document.querySelectorAll(".slide-anim");
    if (fadeArray_items.length > 0) {
        const fadeArray = gsap.utils.toArray(".slide-anim")
        fadeArray.forEach((item, i) => {
            var fade_direction = "bottom"
            var onscroll_value = 1
            var duration_value = 1.15
            var fade_offset = 50
            var delay_value = 0.15
            var ease_value = "power2.out"
            if (item.getAttribute("data-offset")) {
                fade_offset = item.getAttribute("data-offset");
            }
            if (item.getAttribute("data-duration")) {
                duration_value = item.getAttribute("data-duration");
            }
            if (item.getAttribute("data-direction")) {
                fade_direction = item.getAttribute("data-direction");
            }
            if (item.getAttribute("data-on-scroll")) {
                onscroll_value = item.getAttribute("data-on-scroll");
            }
            if (item.getAttribute("data-delay")) {
                delay_value = item.getAttribute("data-delay");
            }
            if (item.getAttribute("data-ease")) {
                ease_value = item.getAttribute("data-ease");
            }
            let animation_settings = {
                opacity: 0,
                ease: ease_value,
                duration: duration_value,
                delay: delay_value,
            }
            if (fade_direction == "top") {
                animation_settings['y'] = -fade_offset
            }
            if (fade_direction == "left") {
                animation_settings['x'] = -fade_offset;
            }
            if (fade_direction == "bottom") {
                animation_settings['y'] = fade_offset;
            }
            if (fade_direction == "right") {
                animation_settings['x'] = fade_offset;
            }
            if (onscroll_value == 1) {
                animation_settings['scrollTrigger'] = {
                    trigger: item,
                    start: 'top 85%',
                }
            }
            gsap.from(item, animation_settings);
        })
    }


    // scale animation 
    var scale = document.querySelectorAll(".scale");
    var image = document.querySelectorAll(".scale img");
    scale.forEach((item) => {
        gsap.to(item, {
            scale: 1,
            duration: 1,
            ease: "power1.out",
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: "bottom top",
                toggleActions: 'play reverse play reverse'
            }
        });
    });
    image.forEach((image) => {
        gsap.set(image, {
            scale: 1.3,
        });
        gsap.to(image, {
            scale: 1,
            duration: 1,
            scrollTrigger: {
                trigger: image,
                start: 'top bottom',
                end: "bottom top",
                toggleActions: 'play reverse play reverse'
            }
        });
    })



    // 19 portfolio panel animation //
    let ca = gsap.matchMedia();
    ca.add("(min-width: 1199px)", () => {
        let tl = gsap.timeline();
        let portfoliopanels = document.querySelectorAll('.tp-portfolio-panel');
        let baseOffset = 180;
        let offsetIncrement = 0;
        portfoliopanels.forEach((section, index) => {
            let topOffset = baseOffset + (index * offsetIncrement);
            tl.to(section, {
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: `top ${topOffset}px`,
                    end: "bottom 75%",
                    endTrigger: '.tp-portfolio-pin',
                    pinSpacing: false,
                    markers: false,
                },
            });
        });
    });

    //20 service panel animation //
    let se = gsap.matchMedia();
    se.add("(min-width: 992px)", () => {
        let tl = gsap.timeline();
        let servicepanels = document.querySelectorAll('.tp-service-panel');
        let baseOffset = 180;
        let offsetIncrement = 0;
        servicepanels.forEach((section, index) => {
            let topOffset = baseOffset + (index * offsetIncrement);
            tl.to(section, {
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: `top ${topOffset}px`,
                    end: "bottom 68%",
                    endTrigger: '.tp-service-pin',
                    pinSpacing: false,
                    markers: false,
                },
            });
        });
    });

    //>> Mouse Cursor Start <<//


    // ✅ RTL check function (FIXED ERROR)
    function is_rtl() {
        return document.documentElement.getAttribute("dir") === "rtl";
    }

    if (
        !document.body.classList.contains("is-mobile") &&
        document.querySelector("#custom-cursor-wrapper.tp-cursor")
    ) {

        $(".tp-magnetic-item").wrap('<div class="tp-magnetic-wrap"></div>');

        if ($("a.tp-magnetic-item").length) {
            $("a.tp-magnetic-item").addClass("not-hide-cursor");
        }

        let mouse = { x: 0, y: 0 };
        let pos = { x: 0, y: 0 };
        let ratio = 0.15;
        let active = false;

        let $cursorDot = $("#cursorDot");

        let cursorDotWidth = 14;
        let cursorDotHeight = 14;
        let cursorDotScale = 1;
        let cursorDotOpacity = 1;
        let cursorDotBorderWidth = 1;

        gsap.set($cursorDot, {
            xPercent: -50,
            yPercent: -50,
            width: cursorDotWidth,
            height: cursorDotHeight,
            borderWidth: cursorDotBorderWidth,
            opacity: cursorDotOpacity
        });

        // Mouse move
        document.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Smooth follow
        gsap.ticker.add(() => {
            if (!active) {
                pos.x += (mouse.x - pos.x) * ratio;
                pos.y += (mouse.y - pos.y) * ratio;

                gsap.set($cursorDot, { x: pos.x, y: pos.y });
            }
        });

        // Magnetic movement
        $(".tp-magnetic-wrap").on("mousemove", function (e) {
            parallaxCursor(e, this, 2);
            parallaxIt(e, this, this.querySelector(".tp-magnetic-item"), 25);
        });

        function parallaxIt(e, parent, target, movement) {
            if (!target) return;

            let rect = parent.getBoundingClientRect();
            let relX = e.clientX - rect.left;
            let relY = e.clientY - rect.top;

            gsap.to(target, {
                duration: 0.3,
                x: ((relX - rect.width / 2) / rect.width) * movement,
                y: ((relY - rect.height / 2) / rect.height) * movement,
                ease: "power2.out"
            });
        }

        function parallaxCursor(e, parent, movement) {
            let rect = parent.getBoundingClientRect();
            let relX = e.clientX - rect.left;
            let relY = e.clientY - rect.top;

            pos.x = rect.left + rect.width / 2 + (relX - rect.width / 2) / movement;
            pos.y = rect.top + rect.height / 2 + (relY - rect.height / 2) / movement;

            gsap.to($cursorDot, { duration: 0.3, x: pos.x, y: pos.y });
        }

        // Hover effect
        $(".tp-magnetic-wrap")
            .on("mouseenter", function () {
                gsap.to($cursorDot, { duration: 0.3, scale: 2, opacity: cursorDotOpacity });
                active = true;
            })
            .on("mouseleave", function () {
                gsap.to($cursorDot, {
                    duration: 0.3,
                    scale: cursorDotScale,
                    opacity: cursorDotOpacity
                });

                gsap.to(this.querySelector(".tp-magnetic-item"), {
                    duration: 0.3,
                    x: 0,
                    y: 0,
                    clearProps: "all"
                });

                active = false;
            });

        // Cursor content (data-cursor)
        $("[data-cursor]").each(function () {
            $(this)
                .on("mouseenter", function () {
                    $cursorDot.addClass("with-blur");

                    if (!$cursorDot.find(".cursorDot-view").length) {
                        $cursorDot.append('<div class="cursorDot-view"></div>');
                    }

                    $(".cursorDot-view").html($(this).attr("data-cursor"));

                    gsap.to($cursorDot, {
                        duration: 0.3,
                        xPercent: is_rtl() ? 50 : -50,
                        yPercent: -60,
                        width: 120,
                        height: 120,
                        opacity: 1,
                        borderWidth: 0,
                        zIndex: 1,
                        backdropFilter: "blur(0px)",
                        backgroundColor: "#65CB3B"
                    });

                    gsap.to(".cursorDot-view", {
                        duration: 0.3,
                        scale: 1,
                        autoAlpha: 1
                    });
                })
                .on("mouseleave", function () {
                    gsap.to($cursorDot, {
                        duration: 0.3,
                        yPercent: -50,
                        width: cursorDotWidth,
                        height: cursorDotHeight,
                        opacity: cursorDotOpacity,
                        borderWidth: cursorDotBorderWidth,
                        backgroundColor: "#000"
                    });

                    gsap.to(".cursorDot-view", {
                        duration: 0.3,
                        scale: 0,
                        autoAlpha: 0
                    });

                    $cursorDot.find(".cursorDot-view").remove();
                });

            $(this).addClass("not-hide-cursor");
        });

        // Hide on hover links/buttons
        $("a, button")
            .not(".cursor-hide")
            .on("mouseenter", () => {
                gsap.to($cursorDot, { duration: 0.3, scale: 0, opacity: 0 });
            })
            .on("mouseleave", () => {
                gsap.to($cursorDot, { duration: 0.3, scale: cursorDotScale, opacity: cursorDotOpacity });
            });

        // Click effect
        $("a")
            .not('[target="_blank"], .cursor-hide, [href^="#"], [href^="mailto"], [href^="tel"], .lg-trigger, .tp-btn-disabled a')
            .on("click", () => {
                gsap.to($cursorDot, { duration: 0.3, scale: 1.3, autoAlpha: 0 });
            });

        // Hide when leaving window
        $(document)
            .on("mouseleave", () => {
                gsap.to("#cursor-outer", { duration: 0.3, autoAlpha: 0 });
            })
            .on("mouseenter", () => {
                gsap.to("#cursor-outer", { duration: 0.3, autoAlpha: 1 });
            });

        // Show on move
        $(document).on("mousemove", () => {
            gsap.to("#cursor-outer", { duration: 0.3, autoAlpha: 1 });
        });
    }



})(jQuery);