/*global window, document, jQuery, gmap3, google*/
(function ($) {
    "use strict";

    if ((typeof window.gmap_app) === 'undefined') {
        window.gmap_app = {};
    }

    var App = window.gmap_app;

    App.Marker = function (map, marker) {
        var self = this,
            marker_id = marker.attr('id');
        self.map = map;
        self.marker_id = 'marker_' + marker_id;
        self.overlay_id = 'overlay_' + marker_id;
        self.lat = marker.data('mapLatitude');
        self.lng = marker.data('mapLongitude');
        self.title = $('.marker-title', marker).text();

        self.overlay_content = "<div id='" + self.overlay_id +
                                 "' class='marker_overlay'><p>" +
                                 self.title + "</p></div>";
    };

    App.MapWidget = function (trigger, settings) {
        var self = this;


        self.map = $(trigger);
        self.is_draggable = true;
        self.markers_wrapper = $('#markers_wrapper');
        self.draggable_div = self.markers_wrapper;
        self.active_marker = null;
        self.default_icon = "../images/green_marker.png";
        self.active_icon = '../images/orange_marker.png';
        self.markers_identifier = '#markers .marker';
        $.extend(true, self, settings);

        self.init_map();
        self.init_slider();
        self.setup_markers();

        if (self.is_draggable && self.draggable_div.length > 0) {
            self.draggable_div.draggable();
            self.draggable_div.draggable('option', 'cancel', '.thumbnail');
            self.draggable_div.draggable('option', 'cancel', '.overview');
        }

    };

    App.MapWidget.prototype = {
        init_map: function () {
            var self = this;

            self.map.gmap3({
                map: {
                    options: {
                        center: [28.764060233517, -81.47733406250012],
                        zoom: 3,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: true,
                        mapTypeControlOptions: {
                            position : google.maps.ControlPosition.LEFT_CENTER,
                            style : google.maps.MapTypeControlStyle.DROPDOWN_MENU
                        },
                        streetViewControlOptions: {
                            position: google.maps.ControlPosition.LEFT_CENTER
                        },
                        navigationControl: false,
                        scrollwheel: true,
                        streetViewControl: true,
                        zoomControl: false
                    }
                }
            });
        },

        init_slider: function () {
            var self = this;

            self.markers_wrapper.flexslider({
                selector: self.markers_identifier,
                controlNav: false,
                before: function (slider) {
                    // set specific marker active
                    self.on_slide_change(slider);
                }
            });
        },

        on_slide_change: function (slider) {
            var self = this,
                $current_slide = $(slider.slides[slider.currentSlide]),
                current_slide_id = $current_slide.attr('id');

            google.maps.event.trigger(
                self.map.gmap3({
                    get: {id: "marker_" + current_slide_id}
                }),
                'click'
            );
        },
        setup_markers: function () {
            var self = this;

            $(self.markers_identifier).each(function () {
                self.add_marker(new App.Marker(self.map, $(this)));
            });
        },

        add_marker: function (marker_obj) {
            var self = this,
                position = [marker_obj.lat, marker_obj.lng],
                marker_id = marker_obj.marker_id,
                overlay_id = marker_obj.overlay_id;

            self.map.gmap3({
                marker: {
                    id: marker_id,
                    latLng: position,
                    options: {
                        icon: self.default_icon
                    },
                    events: {
                        click: function(marker) {
                            self.reset_active_marker();
                            self.set_active_marker(marker);
                            // change slide
                        },

                        mouseover: function(marker) {
                            $('#' + overlay_id).css({
                                'display': 'block',
                                'opacity': 0
                            }).stop(true, true).animate({
                                bottom: '15px',
                                opacity: 1
                            }, 500);
                        },
                        mouseout: function (marker) {
                            $('#' + overlay_id).stop(true, true).animate({
                                bottom: '50px',
                                opacity: 0
                            }, 500, function() {
                                $(this).css({ 'display' : 'none' });
                            });
                        }
                    }
                },
                overlay: {
                    latLng: position,
                    options: {
                        content: marker_obj.overlay_content,
                        offset: {
                            y: -42,
                            x: -122
                        }
                    }
                }
            });
        },

        set_active_marker: function (marker) {
            var self = this;
            self.active_marker = marker;
            marker.setAnimation(google.maps.Animation.BOUNCE);
            marker.setIcon(self.active_icon);
            self.map.gmap3("get").panTo(marker.position);
        },

        reset_active_marker: function () {
            var self = this;
            if (self.active_marker) {
                self.active_marker.setAnimation(null);
                self.active_marker.setIcon(self.default_icon);
            }
        }
    };

    $(document).ready(function () {
        var map = $('#map'),
            app = new App.MapWidget(map);
        map.data('mapwidget', app);
    });

}(jQuery));

