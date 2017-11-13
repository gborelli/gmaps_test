/*global window, document, jQuery, gmap3, google*/
(function ($) {
    "use strict";

    if ((typeof window.gmap_app) === 'undefined') {
        window.gmap_app = {};
    }

    var App = window.gmap_app;

    App.MapWidget = function (trigger, settings) {
        var self = this;


        self.map = $('.map', trigger);
        self.gmap = self.map;

        self.markers = {};
        self.markers_wrapper = $('.markers', trigger);
        self.markers_identifier = '.slide';
        self.active_marker = null;
        self.active_class = 'active';
        self.default_icon = "./img/marker.png";
        self.active_icon = './img/active_marker.png';

        self.center = [44.494887, 11.3426163];
        self.zoom = 5;
        self.slides = $(self.markers_identifier, self.markers_wrapper);
        $.extend(true, self, settings);

        self.init_map();
        self.init_slider();
    };

    App.MapWidget.prototype = {
        init_map: function () {
            var self = this,
                options = {
                    center: new google.maps.LatLng(self.center[0], self.center[1]),
                    zoom: self.zoom,
                    panControl: true,
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.SMALL
                    },
                    mapTypeControl: true,
                    scaleControl: true,
                    streetViewControl: true,
                    overviewMapControl: true
                };

            self.gmap = new google.maps.Map(self.map.get(0), options);
            self.setup_markers();
        },

        init_slider: function () {
            var self = this;

            self.slider = self.markers_wrapper.bxSlider({
                slideSelector: self.slides,
                slideWidth: 450,
                minSlides: 2,
                maxSlides: 3,
                slideMargin: 10,
                moveSlides: 1,
                startSlide: self.get_active_slide_idx(),
                onSliderLoad: function (idx) {
                    // set active class to slide and activate marker
                    var current = $(self.slides[idx]);
                    self.on_change_slide(current);
                },
                onSlideBefore: function (slide) {
                    // set active class to slide and activate marker
                    self.on_change_slide(slide);
                }
            });

            // self.markers_wrapper.on('click', '.slide', function () {
            //     self.change_slide($(this).data('slideIdx'));
            // });
        },

        on_change_slide: function (slide) {
            var self = this,
                slide_idx = slide.data('slideIdx'),
                slide_active = $(self.slides.get(slide_idx)).next(),
                marker = self.markers[slide_active.data('slideIdx')];

            self.reset_active_marker();
            self.set_active_marker(marker);
            self.set_active_class(slide_active);
        },

        set_active_class: function (slide) {
            var self = this;

            $(self.markers_identifier, self.markers_wrapper).removeClass(self.active_class);
            slide.addClass(self.active_class);
        },

        setup_markers: function () {
            var self = this,
                markers = $(self.markers_identifier);

            markers.each(function () {
                self.add_marker($(this));
            });
        },

        add_marker: function (obj) {
            var self = this,
                slide_id = obj.data('slideIdx'),
                gmarker;

            gmarker = new google.maps.Marker({
                position: new google.maps.LatLng(
                    obj.data('mapLatitude'),
                    obj.data('mapLongitude')
                ),
                map: self.gmap,
                title: $('.marker-title', obj).text(),
                icon: self.default_icon
            });

            gmarker.metadata = {
                id: slide_id
            };

            self.markers[slide_id] = gmarker;
            google.maps.event.addListener(gmarker, 'click', function () {
                self.change_slide(slide_id);
            });
        },

        get_active_slide_idx: function () {
            var self = this,
                active = $('.' + self.active_class, self.slides.parent()),
                idx = self.slides.length - 1,
                active_idx = null;
            if (active.length > 0) {
                active_idx = $(active).data('slideIdx') - 1;
                if (active_idx >= 0) {
                    idx = active_idx;
                }
            }

            return idx;
        },

        change_slide: function (idx) {
            // Vado alla slide precedente quella del marker selezionato
            var self = this;
            if (idx === 0) {
                idx = self.slides.length;
            }
            // Vado alla slide precedente quella del marker selezionato
            self.slider.goToSlide(idx - 1);
        },

        set_active_marker: function (marker) {
            var self = this;
            self.active_marker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            marker.setIcon(self.active_icon);
            self.gmap.panTo(marker.position);
        },

        reset_active_marker: function () {
            var self = this;
            if (self.active_marker) {
                self.active_marker.setAnimation(null);
                self.active_marker.setIcon(self.default_icon);
            }
        }
    };

    $.fn.extend({
        carouselmapwidget: function (options) {
            return this.each(function () {

                var settings = $.extend(true, {}, options),
                    $this = $(this),
                    data = $this.data('carouselmapwidget'),
                    mapwidget;

                // If the plugin hasn't been initialized yet
                if (!data) {
                    mapwidget = new App.MapWidget(this, settings);
                    $(this).data('carouselmapwidget', mapwidget);
                }
            });
        }
    });

    $(document).ready(function () {
        var random_start = Math.round(Math.random() * (7));
        $($('.slide')[random_start]).addClass('active');

        $('.mapwidget').carouselmapwidget();
    });

}(jQuery));
