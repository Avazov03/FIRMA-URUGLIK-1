
(function ($) {
    "use strict";

    /*======================================
        Preloader activation
    ========================================*/


    $(".cp-primary-btn .btn-text").each(function () {
        const $el = $(this);
        const text = $el.data("text");

        $el.empty();

        text.split("").forEach((char) => {
            const $span = $("<span>");

            if (char === " ") {
                $span.addClass("space");
                $span.html("&nbsp;");
            } else {
                $span.text(char);
            }

            $el.append($span);
        });

        const $letters = $el.find("span");
        let index = 0;
        let interval;

        function animate() {
            clearInterval(interval);

            $letters.removeClass("active");
            index = 0;

            interval = setInterval(function () {
                if (index < $letters.length) {
                    $letters.eq(index).addClass("active");
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 30);
        }

        function reset() {
            clearInterval(interval);
            $letters.removeClass("active");
        }

        $el.closest(".cp-primary-btn")
            .on("mouseenter", animate)
            .on("mouseleave", reset);
    });

    var $grid = $(".masonry-layout");
    var iso;

    function initMasonry() {
        if ($grid.length) {
            $grid.imagesLoaded(function () {
                iso = $grid.isotope({
                    itemSelector: ".masonry-item",
                    percentPosition: true,
                    masonry: {
                        columnWidth: ".grid-sizer",
                        gutter: 0
                    }
                });
            });
        }
    }

    function destroyMasonry() {
        if (iso) {
            $grid.isotope("destroy");
            iso = null;
        }
    }

    function handleMasonry() {
        if (window.innerWidth >= 1200) {
            if (!iso) {
                initMasonry();
            }
        } else {
            destroyMasonry();
        }
    }

    // Run on load
    $(window).on("load", function () {
        handleMasonry();
    });

    // Run on resize
    $(window).on("resize", function () {
        handleMasonry();
    });

    if ($.fn.DataTable && $("#myTable").length) $("#myTable").DataTable();

    $(".favorite").on("click", function () {
    $(this).find("i")
        .toggleClass("fa-regular fa-solid");
});

    // Preloader: starts on DOM ready (not window load, which waits for every image),
    // and is skipped for the rest of the session once it has played.
    var innerBars = document.querySelectorAll(".inner-bar");
    var PRELOADED_KEY = "aeg-preloaded";

    function removePreloader() {
        $(".preloader").remove();
    }

    function animateBars() {
        if (!innerBars.length) return removePreloader();

        var increment = 0;

        function step() {
            for (var i = 0; i < 2 && innerBars[i + increment]; i++) {
                gsap.to(innerBars[i + increment], { width: Math.floor(Math.random() * 101) + "%", duration: 0.2, ease: "none" });
            }

            setTimeout(function () {
                for (var j = 0; j < 2 && innerBars[j + increment]; j++) {
                    gsap.to(innerBars[j + increment], { width: "100%", duration: 0.2, ease: "none" });
                }
                increment += 2;

                if (increment < innerBars.length) {
                    step();
                } else {
                    gsap.timeline()
                        .to(".preloader", { "--preloader-clip": "100%", duration: 0.45, ease: "none", delay: 0.15 })
                        .add(removePreloader);
                }
            }, 90);
        }

        step();
    }

    var preloadedThisSession = false;
    try {
        preloadedThisSession = sessionStorage.getItem(PRELOADED_KEY) === "1";
        sessionStorage.setItem(PRELOADED_KEY, "1");
    } catch (e) {}

    if (preloadedThisSession || document.documentElement.classList.contains("aeg-no-preloader")) {
        removePreloader();
    } else {
        $(function () {
            animateBars();
            setTimeout(removePreloader, 1600);
        });
    }


    // Zoom Effect
    document.addEventListener("DOMContentLoaded", () => {
        const container = document.querySelector(".zoom-container");
        const img = document.querySelector("#product-image");

        if (!container || !img) return; // exit if elements not found
        if (typeof Drift === "undefined") {
            console.error("Drift library is not loaded.");
            return;
        }

        // Initialize Drift and custom zoom
        new Drift(img, {
            paneContainer: container,
            inlinePane: true,
            inlineOffsetY: 0,
            containInline: true,
            hoverBoundingBox: true
        });

        const handleMouseMove = (e) => {
            const rect = img.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
        };

        const handleMouseEnter = () => img.style.transform = "scale(1.5)";
        const handleMouseLeave = () => img.style.transform = "scale(1)";

        img.addEventListener("mousemove", handleMouseMove);
        img.addEventListener("mouseenter", handleMouseEnter);
        img.addEventListener("mouseleave", handleMouseLeave);
    });


    $(document).ready(function () {

        if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
            $('body').addClass('firefox');
        }

        var header = $(".header"),
            stickyHeader = $(".primary-header");

        function menuSticky(w) {
            /**
             * A function to make the menu sticky when the window matches the media query.
             * @param {MediaQueryList} w - The media query list.
             * @example
             * menuSticky(window.matchMedia("(min-width: 768px)"));
             */
            if (w.matches) {

                $(window).on("scroll", function () {
                    var scroll = $(window).scrollTop();
                    if (scroll >= 110) {
                        stickyHeader.addClass("fixed");
                    } else {
                        stickyHeader.removeClass("fixed");
                    }
                });
                if ($(".header").length > 0) {
                    var headerHeight = document.querySelector(".header"),
                        setHeaderHeight = headerHeight.offsetHeight;
                    header.each(function () {
                        $(this).css({
                            'height': setHeaderHeight + 'px'
                        });
                    });
                }
            }
        }

        var minWidth = window.matchMedia("(min-width: 992px)");
        if (header.hasClass("sticky-active")) {
            menuSticky(minWidth);
        }

        // Active nav item for current page
        function setActiveNav() {
            var path = (window.location.pathname || "").split("/").pop() || "index.html";
            path = path.split("?")[0].split("#")[0];
            if (!path) {
                path = "index.html";
            }

            var related = {
                "blog-details.html": "blog-grid.html",
                "portfolio-details.html": "portfolio.html",
                "shop-details.html": "shop.html",
                "service-details.html": "service.html",
                "team-details.html": "team.html",
            };

            var $scopes = $(".header-menu-wrap, .side-menu-wrap, .mean-nav, .mobile-side-menu");
            $scopes.find("li").removeClass("active");

            function markMatch(fileName) {
                var found = false;
                $scopes.find("a[href]").each(function () {
                    var href = ($(this).attr("href") || "").split("?")[0].split("#")[0];
                    if (!href || href === "#" || href.indexOf("javascript:") === 0) {
                        return;
                    }
                    var file = href.split("/").pop();
                    var isHome =
                        fileName === "index.html" &&
                        (file === "index.html" || file === "" || file === "./");
                    if (file === fileName || isHome) {
                        found = true;
                        var $li = $(this).closest("li");
                        $li.addClass("active");
                        $li.parents("li").each(function () {
                            if ($(this).children("ul").length) {
                                $(this).addClass("active");
                            }
                        });
                    }
                });
                return found;
            }

            // Exact page first; fall back to related parent section
            if (!markMatch(path) && related[path]) {
                markMatch(related[path]);
            }
        }

        setActiveNav();

        //Mobile Menu Js
        $(".mobile-menu-items").meanmenu({
            meanMenuContainer: ".side-menu-wrap",
            meanScreenWidth: "9999",
            meanMenuCloseSize: "30px",
            meanRemoveAttrs: true,
            meanExpand: ['<i class="fa-solid fa-caret-down"></i>'],
        });

        // Re-apply after MeanMenu clones the menu (attrs stripped)
        setActiveNav();

        // Mobile Sidemenu
        $(".mobile-side-menu-toggle").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").toggleClass("is-open");
        });

        $(".mobile-side-menu-close, .mobile-side-menu-overlay").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass("is-open");
        });


        // Popup Search Box
        $(function () {
            $("#popup-search-box").removeClass("toggled");

            $(".dl-search-icon").on("click", function (e) {
                e.stopPropagation();
                $("#popup-search-box").toggleClass("toggled");
                $("#popup-search").focus();
            });

            $("#popup-search-box").on("click", function (e) {
                /* Forma / taklif ichida — yopilmasin (navigatsiya ishlasin) */
                if ($(e.target).closest(".aeg-smart-form, .aeg-smart-suggest, #popup-search, form").length) {
                    e.stopPropagation();
                    return;
                }
                $("#popup-search-box").removeClass("toggled");
            });

            $(document).on("click", function (e) {
                if ($(e.target).closest("#popup-search-box, .dl-search-icon").length) return;
                $("#popup-search-box").removeClass("toggled");
            });
        });


        // Popup Sidebox
        function sideBox() {
            $("body").removeClass("open-sidebar");
            $(document).on("click", ".sidebar-trigger", function (e) {
                e.preventDefault();
                $("body").toggleClass("open-sidebar");
            });
            $(document).on("click", ".sidebar-trigger.close, #sidebar-overlay", function (e) {
                e.preventDefault();
                $("body.open-sidebar").removeClass("open-sidebar");
            });
        }

        sideBox();

        // Popular Causes Progress Bar
        if ($(".count-bar").length) {
            $(".count-bar").appear(
                function () {
                    var el = $(this);
                    var percent = el.data("percent");
                    $(el).css("width", percent).addClass("counted");
                }, {
                accY: -50
            }
            );
        }


        //Fact Counter + Text Count
        if ($(".count-box").length) {
            $(".count-box").appear(
                function () {
                    var $t = $(this),
                        n = $t.find(".count-text").attr("data-stop"),
                        r = parseInt($t.find(".count-text").attr("data-speed"), 10);

                    if (!$t.hasClass("counted")) {
                        $t.addClass("counted");
                        $({
                            countNum: $t.find(".count-text").text()
                        }).animate({
                            countNum: n
                        }, {
                            duration: r,
                            easing: "linear",
                            step: function () {
                                $t.find(".count-text").text(Math.floor(this.countNum));
                            },
                            complete: function () {
                                $t.find(".count-text").text(this.countNum);
                            }
                        });
                    }
                }, {
                accY: 0
            }
            );
        }


        // Venobox Video
        if (typeof VenoBox !== "undefined" && document.querySelector(".video-popup, .img-popup")) {
            new VenoBox({
                selector: ".video-popup, .img-popup",
                bgcolor: "transparent",
                numeration: true,
                infinigall: true,
                spinner: "plane",
            });
        }

        // Data Background — below-the-fold backgrounds load only when they get close to the viewport
        function setBackground(el) {
            el.style.backgroundImage = "url(" + el.getAttribute("data-background") + ")";
        }
        var bgEls = document.querySelectorAll("[data-background]");
        if ("IntersectionObserver" in window) {
            var bgObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    setBackground(entry.target);
                    bgObserver.unobserve(entry.target);
                });
            }, { rootMargin: "600px 0px" });
            Array.prototype.forEach.call(bgEls, function (el) {
                if (el.getBoundingClientRect().top < window.innerHeight * 1.5) setBackground(el);
                else bgObserver.observe(el);
            });
        } else {
            Array.prototype.forEach.call(bgEls, setBackground);
        }

        /* Odometer */
        $(".odometer").waypoint(
            function () {
                var odo = $(".odometer");
                odo.each(function () {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            },
            {
                offset: "80%",
                triggerOnce: true,
            }
        );

        // Nice Select Js
        $("select").niceSelect();



        $(document).on("click", ".review-star i", function () {
            let index = $(this).index();

            $(this).parent().children("i").each(function (i) {
                if (i <= index) {
                    $(this).removeClass("fa-regular").addClass("fa-solid");
                } else {
                    $(this).removeClass("fa-solid").addClass("fa-regular");
                }
            });
        });

        $('.quantity-box').each(function () {
            var $box = $(this);
            var $input = $box.find('input');
            var $add = $box.find('.add');
            var $sub = $box.find('.sub');

            // Increment
            $add.on('click', function () {
                var currentVal = parseInt($input.val()) || 0;
                $input.val(currentVal + 1);
            });

            // Decrement
            $sub.on('click', function () {
                var currentVal = parseInt($input.val()) || 0;
                if (currentVal > 1) { // minimum value = 1
                    $input.val(currentVal - 1);
                }
            });

            // Allow only numbers
            $input.on('input', function () {
                var val = $input.val().replace(/[^0-9]/g, '');
                $input.val(val === '' ? 1 : val);
            });
        });

        // Service Carousel
        var swiperService = new Swiper(".service-carousel", {
            slidesPerView: 5,
            spaceBetween: 24,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: '.swiper-arrow .swiper-prev',
                prevEl: '.swiper-arrow .swiper-next',
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                467: {
                    slidesPerView: 1.2,
                },
                767: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 2.3,
                },
                1199: {
                    slidesPerView: 3,
                },
                1399: {
                    slidesPerView: 3,
                },
                1499: {
                    slidesPerView: 3.6,
                },
                1599: {
                    slidesPerView: 4.1,
                },
                1699: {
                    slidesPerView: 5.1,
                },
            },
        });


        // testi Carousel
        var swiperService = new Swiper(".testimonial-carousel", {
            slidesPerView: 5,
            spaceBetween: 24,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: '.swiper-arrow .swiper-prev',
                prevEl: '.swiper-arrow .swiper-next',
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                467: {
                    slidesPerView: 1,
                },
                767: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 2,
                },
                1199: {
                    slidesPerView: 3,
                },
            },
        });

        var swiperTesti = new Swiper(".testi-carousel-2", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: '.swiper-prev',
                prevEl: '.swiper-next',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 1.1,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 1.5,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 2.8,
                    slidesPerGroup: 1,
                },
                1300: {
                    slidesPerView: 2.2,
                    slidesPerGroup: 1,
                },
            },
        });

        // Testi Carousel
        var swiperTesti = new Swiper(".testi-carousel-3", {
            slidesPerView: 3,
            spaceBetween: 24,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            pagination: {
                el: ".AGRO-dot-swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                767: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 1.5,
                    slidesPerGroup: 1,
                },
                1200: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
                1300: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                },
            },
        });

        // Shop Carousel
        var swiperProject4 = new Swiper(".shop-carousel", {
            slidesPerView: 1,
            spaceBetween: 24,
            loop: true,
            autoplay: true,
            speed: 600,
            navigation: {
                nextEl: '.swiper-arrow .swiper-next',
                prevEl: '.swiper-arrow .swiper-prev',
            },
            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                },
                768: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                },
                1200: {
                    slidesPerView: 4,
                }
            },
        });


        //>> Brand Slider Start <<//
        const brandSlider = new Swiper(".brand-carousel", {
            spaceBetween: 16,
            loop: true,
            autoplay: true,
            speed: 2000,
            autoplay: {
                delay: 0,
            },
            breakpoints: {
                0: {
                    slidesPerView: 2
                },
                475: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 5,
                },
                992: {
                    slidesPerView: 6,
                },
                1199: {
                    slidesPerView: 7,
                },
                1299: {
                    slidesPerView: 8,
                },
            },
        });



        // portfolio Carousel
        var swiperPortfolio = new Swiper(".portfolio-carousel", {
            slidesPerView: 3,
            spaceBetween: 24,
            loop: true,
            autoplay: true,
            speed: 4000,
            autoplay: {
                delay: 0,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                467: {
                    slidesPerView: 1,
                },
                767: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 2,
                },
                1199: {
                    slidesPerView: 3,
                },
            },
        });

        // portfolio Carousel
        var swiperPortfolio = new Swiper(".portfolio-carousel-2", {
            slidesPerView: 3,
            spaceBetween: 40,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            pagination: {
                el: ".AGRO-dot-swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                467: {
                    slidesPerView: 1,
                },
                767: {
                    slidesPerView: 1.5,
                },
                1024: {
                    slidesPerView: 1.9,
                },
                1199: {
                    slidesPerView: 2.4,
                },
                1299: {
                    slidesPerView: 2.5,
                },
                1399: {
                    slidesPerView: 3,
                },
                1499: {
                    slidesPerView: 3,
                },
                1599: {
                    slidesPerView: 3.8,
                },
            },
        });

        // portfolio Carousel
        var swiperPortfolio = new Swiper(".portfolio-carousel-3", {
            slidesPerView: 3,
            spaceBetween: 40,
            loop: true,
            autoplay: true,
            grabcursor: true,
            speed: 600,
            navigation: {
                nextEl: '.swiper-arrow .swiper-prev',
                prevEl: '.swiper-arrow .swiper-next',
            },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                467: {
                    slidesPerView: 1,
                },
                767: {
                    slidesPerView: 1,
                },
                1024: {
                    slidesPerView: 2,
                },
                1199: {
                    slidesPerView: 2,
                },
                1299: {
                    slidesPerView: 3,
                },
            },
        });
        // carouselTicker initail 
        $('.carouselTicker-nav').carouselTicker({
        });
        $(".carouselTicker-start").carouselTicker({
            direction: "prev",
        });

        //Running Animated Text
        const scrollers = document.querySelectorAll(".scroller");

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            addAnimation();
        }

        function addAnimation() {
            scrollers.forEach((scroller) => {
                scroller.setAttribute("data-animated", true);

                const scrollerInner = scroller.querySelector(".scroller__inner");
                const scrollerContent = Array.from(scrollerInner.children);

                scrollerContent.forEach((item) => {
                    const duplicatedItem = item.cloneNode(true);
                    duplicatedItem.setAttribute("aria-hidden", true);
                    scrollerInner.appendChild(duplicatedItem);
                });
            });
        }

        // Page Scroll Percentage
        function scrollTopPercentage() {
            const scrollPercentage = () => {
                const scrollTopPos = document.documentElement.scrollTop;
                const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
                const scrollElementWrap = $("#scroll-percentage");

                scrollElementWrap.css("background", `conic-gradient( var(--cp-color-theme-primary) ${scrollValue}%, var(--cp-color-bg-2) ${scrollValue}%)`);

                // ScrollProgress
                if (scrollTopPos > 100) {
                    scrollElementWrap.addClass("active");
                } else {
                    scrollElementWrap.removeClass("active");
                }

                if (scrollValue < 96) {
                    $("#scroll-percentage-value").text(`${scrollValue}%`);
                } else {
                    $("#scroll-percentage-value").html('<i class="fa-sharp fa-regular fa-arrow-up-long"></i>');
                }
            }
            window.onscroll = scrollPercentage;
            window.onload = scrollPercentage;

            // Back to Top
            function scrollToTop() {
                document.documentElement.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            $("#scroll-percentage").on("click", scrollToTop);
        }

        scrollTopPercentage();
    });

    document.querySelectorAll(".scroll-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            var sectionTarget = btn.getAttribute("data-target");
            gsap.to(window, { duration: 1, scrollTo: { y: sectionTarget, offsetY: 70 } });
        });
    });

})(jQuery);
