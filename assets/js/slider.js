(function ($) {
    "use strict";

    $(document).ready(function () {

        /* ===============================
           Animation Function
        =============================== */
        function sliderAnimations(elements) {
            var animationEndEvents =
                "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

            elements.each(function () {
                var $this = $(this);
                var delay = $this.data("delay");
                var duration = $this.data("duration");
                var animationType = "agrigo-animation " + $this.data("animation");

                $this.css({
                    "animation-delay": delay,
                    "-webkit-animation-delay": delay,
                    "animation-duration": duration,
                });

                $this.addClass(animationType).one(animationEndEvents, function () {
                    $this.removeClass(animationType);
                });
            });
        }

        /* ===============================
           SLIDER OPTIONS
        =============================== */

        var sliderOptions = {
            speed: 1000,
            loop: true,
            effect: "fade",
            grabCursor: true,

            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },

            pagination: {
                el: ".agrigo-dot-pagination",
                clickable: true,
            },

            navigation: {
                nextEl: ".agrigo-next",
                prevEl: ".agrigo-prev",
            },

            on: {

                /* Slider Init */
                init: function () {

                    var anim = $(this.slides[this.activeIndex]).find("[data-animation]");
                    sliderAnimations(anim);
                },

                /* Animation Start */
                slideChangeTransitionStart: function () {
                    var anim = $(this.slides[this.activeIndex]).find("[data-animation]");
                    sliderAnimations(anim);
                }
            }
        };

        /* ===============================
           INIT SWIPER
        =============================== */

        var swiper = new Swiper(".agrigo-slider", sliderOptions);

    });

})(jQuery);