(function($) {
    "use strict";
    var MOMB = {};
    $.fn.exists = function() {
        return this.length > 0;
    };

    /* ---------------------------------------------- /*
     * Pre load
    /* ---------------------------------------------- */
    MOMB.PreLoad = function() {
      if (document.getElementById("loading"))
        document.getElementById("loading").style.display = "none";
    }

    /*--------------------
      * Menu toogle header
    ----------------------*/
    MOMB.MenuToggleClass = function() {
        $('.navbar-toggler').on('click', function() {
            var toggle = $('.navbar-toggler').is(':visible');
            if (toggle) {
                $('header').toggleClass('header-toggle');
            }
        })
    }

    /* ---------------------------------------------- /*
     * Header Fixed
    /* ---------------------------------------------- */
    MOMB.HeaderFixd = function() {
        var HscrollTop = $(window).scrollTop();
        if (HscrollTop >= 100) {
            $(".navbar-dark").addClass("navbar-light");
            $(".navbar-dark").addClass("navbar-dark-top");
            $(".navbar-dark-top").removeClass("navbar-dark");
            $(".header-main").addClass("fixed-header");
        } else {
            $(".navbar-dark-top").removeClass("navbar-light");
            $(".navbar-dark-top").addClass("navbar-dark");
            $(".navbar-dark").removeClass("navbar-dark-top");
            $(".header-main").removeClass("fixed-header");
        }
    }

    /* ---------------------------------------------- /*
     * Header height
    /* ---------------------------------------------- */
    MOMB.HeaderHeight = function() {
        var HHeight = $('.navbar').outerHeight()
        $('.header-height').css("min-height", HHeight);
    }

    /*--------------------
    * Counter
    ----------------------*/
    MOMB.Counter = function() {
        //var counter = jQuery(".counter");
        var $counter = $('.counter');
        if ($counter.length > 0) {
            $counter.each(function() {
                var $elem = $(this);
                $elem.appear(function() {
                    $elem.find('.count').countTo({
                        speed: 2000,
                        refreshInterval: 10
                    });
                });
            });
        }
    }

    /*--------------------
    * Typed
    ----------------------*/
    MOMB.typedbox = function() {
        var typedjs = $('.typed');
        if (typedjs.length > 0) {
            typedjs.each(function() {
                var $this = $(this);
                $this.typed({
                    strings: $this.attr('data-elements').split(','),
                    typeSpeed: 150, // typing speed
                    backDelay: 500 // pause before backspacing
                });
            });
        }
    }

    /*--------------------
    * Owl Corousel
    ----------------------*/
    MOMB.Owl = function() {
        var owlslider = $("div.owl-carousel");
        if (owlslider.length > 0) {
            owlslider.each(function() {
                var $this = $(this),
                    $items = ($this.data('items')) ? $this.data('items') : 1,
                    $loop = ($this.attr('data-loop')) ? $this.data('loop') : true,
                    $navdots = ($this.data('nav-dots')) ? $this.data('nav-dots') : false,
                    $navarrow = ($this.data('nav-arrow')) ? $this.data('nav-arrow') : false,
                    $autoplay = ($this.attr('data-autoplay')) ? $this.data('autoplay') : true,
                    $autospeed = ($this.attr('data-autospeed')) ? $this.data('autospeed') : 5000,
                    $smartspeed = ($this.attr('data-smartspeed')) ? $this.data('smartspeed') : 1000,
                    $autohgt = ($this.data('autoheight')) ? $this.data('autoheight') : false,
                    $CenterSlider = ($this.data('center')) ? $this.data('center') : false,
                    $stage = ($this.attr('data-stage')) ? $this.data('stage') : 0,
                    $space = ($this.attr('data-space')) ? $this.data('space') : 30;

                $(this).owlCarousel({
                    loop: $loop,
                    items: $items,
                    responsive: {
                        0: {
                            items: $this.data('xs-items') ? $this.data('xs-items') : 1
                        },
                        576: {
                            items: $this.data('sm-items') ? $this.data('sm-items') : 1
                        },
                        768: {
                            items: $this.data('md-items') ? $this.data('md-items') : 1
                        },
                        992: {
                            items: $this.data('lg-items') ? $this.data('lg-items') : 1
                        },
                        1200: {
                            items: $items
                        }
                    },
                    dots: $navdots,
                    autoplayTimeout: $autospeed,
                    smartSpeed: $smartspeed,
                    autoHeight: $autohgt,
                    center: $CenterSlider,
                    margin: $space,
                    stagePadding: $stage,
                    nav: $navarrow,
                    navText: ["<i class='ti-angle-left'></i>", "<i class='ti-angle-right'></i>"],
                    autoplay: $autoplay,
                    autoplayHoverPause: true
                });
            });
        }
    }

    /* ---------------------------------------------- /*
     * lightbox gallery
    /* ---------------------------------------------- */
    MOMB.Gallery = function() {
        var GalleryPopup = $('.lightbox-gallery');
        if (GalleryPopup.length > 0) {
            $('.lightbox-gallery').magnificPopup({
                delegate: '.gallery-link',
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                mainClass: 'mfp-fade',
                fixedContentPos: true,
                closeBtnInside: false,
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1] // Will preload 0 - before current, and 1 after CRE current image
                }
            });
        }
        var VideoPopup = $('.video-btn');
        if (VideoPopup.length > 0) {
            $('.video-btn').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        }
    }

    /*--------------------
    * Masonry
    ----------------------*/
    MOMB.masonry = function() {
        var portfolioWork = $('.portfolio-content');
        if (portfolioWork.length > 0) {
            $(portfolioWork).isotope({
                resizable: false,
                itemSelector: '.grid-item',
                layoutMode: 'masonry',
                filter: '*'
            });
            //Filtering items on portfolio.html
            var portfolioFilter = $('.filter li');
            // filter items on button click
            $(portfolioFilter).on('click', function() {
                var filterValue = $(this).attr('data-filter');
                portfolioWork.isotope({
                    filter: filterValue
                });
            });
            //Add/remove class on filter list
            $(portfolioFilter).on('click', function() {
                $(this).addClass('active').siblings().removeClass('active');
            });
        }
    }

    /*--------------------
        * Progress Bar
    ----------------------*/
    MOMB.ProgressBar = function() {
        $(".skill-bar .skill-bar-in").each(function() {
            var bottom_object = $(this).offset().top + $(this).outerHeight();
            var bottom_window = $(window).scrollTop() + $(window).height();
            var progressWidth = $(this).attr('aria-valuenow') + '%';
            if (bottom_window > bottom_object) {
                $(this).css({
                    width: progressWidth
                });
            }
        });
    }
    /*--------------------
        * Parallax
    ----------------------*/
    MOMB.parallax = function() {
        var Parallax = $('.parallax');
        if (Parallax.length > 0) {
            jarallax(document.querySelectorAll('.parallax'));
        }
    }

     /*--------------------
        * pieChart
    ----------------------*/
    MOMB.pieChart = function () {
        var $Pie_Chart = $('.pie_chart_in');
        if ($Pie_Chart.length > 0) {
            $Pie_Chart.each(function () {
                var $elem = $(this),
                    pie_chart_size = $elem.attr('data-size') || "160",
                    pie_chart_animate = $elem.attr('data-animate') || "2000",
                    pie_chart_width = $elem.attr('data-width') || "6",
                    pie_chart_color = $elem.attr('data-color') || "#84ba3f",
                    pie_chart_track_color = $elem.attr('data-trackcolor') || "rgba(0,0,0,0.10)",
                    pie_chart_line_Cap = $elem.attr('data-lineCap') || "round",
                    pie_chart_scale_Color = $elem.attr('data-scaleColor') || "true";
                $elem.find('span, i').css({
                    'width': pie_chart_size + 'px',
                    'height': pie_chart_size + 'px',
                    'line-height': pie_chart_size + 'px',
                    'position': 'absolute'
                });
                $elem.appear(function () {
                    $elem.easyPieChart({
                        size: Number(pie_chart_size),
                        animate: Number(pie_chart_animate),
                        trackColor: pie_chart_track_color,
                        lineWidth: Number(pie_chart_width),
                        barColor: pie_chart_color,
                        scaleColor: false,
                        lineCap: pie_chart_line_Cap,
                        onStep: function (from, to, percent) {
                            $elem.find('span.middle').text(Math.round(percent));
                        }
                    });
               });
            });
        }
    }

    /*--------------------
        * Countdown
    ----------------------*/
    MOMB.CountTimer = function() {
        var $count_timer = $('.count-down');
        if ($count_timer.length > 0) {
            $('#clock_time').countdown('2021/10/11', function(event) {
              var $this = $(this).html(event.strftime(''
                + '<div class="date-box-1 bg-white py-3 px-4 rounded shadow m-2"><div class="h3 w-100 m-0">%D</div><label>days</label></div>'
                + '<div class="date-box-1 bg-white py-3 px-4 rounded shadow m-2"><div class="h3 w-100 m-0">%H</div><label>hr</label></div>'
                + '<div class="date-box-1 bg-white py-3 px-4 rounded shadow m-2"><div class="h3 w-100 m-0">%M</div><label>min</label></div>'
                + '<div class="date-box-1 bg-white py-3 px-4 rounded shadow m-2"><div class="h3 w-100 m-0">%S</div><label>sec</label></div>'));
            });
        }
    }
    /*--------------------
        * Wow
    ----------------------*/
    MOMB.wowAni = function() {
        new WOW({
            boxClass: "wow",
            animateClass: "animated",
            offset: 100,
            mobile: !1,
            live: !0
        }).init();
    }

    // Window on Load
    $(window).on("load", function() {
        MOMB.masonry(),
        MOMB.PreLoad();
    });
    // Document on Ready
    $(document).ready(function() {
        MOMB.HeaderFixd(),
        MOMB.Counter(),
        MOMB.MenuToggleClass(),
        MOMB.CountTimer(),
        MOMB.Gallery(),
        MOMB.HeaderHeight(),
        MOMB.ProgressBar(),
        MOMB.parallax(),
        MOMB.typedbox(),
        MOMB.pieChart(),
        MOMB.wowAni(),
        MOMB.Owl();
    });

    // Document on Scrool
    $(window).scroll(function() {
        MOMB.ProgressBar(),
        MOMB.HeaderFixd();
    });

    // Window on Resize
    $(window).resize(function() {
        MOMB.HeaderHeight();
    });

})(jQuery);
