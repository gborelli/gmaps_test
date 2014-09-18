/*global module, grunt */
module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        includereplace: {
            templates: {
                src: '*.html',
                dest: 'templates/'
            }
        },

        less: {
            layout: {
                options: {
                    rootpath: "styles/",
                    compress: true,
                    paths: ["styles"],
                    sourceMap: true,
                    sourceMapBasepath: "styles/"
                },
                files: [{
                    expand: true,
                    cwd: 'styles/',
                    src: ['**/*.less'],
                    dest: 'styles/',
                    ext: '.css'
                }]
            }
        },
        concat: {
            all: {
                files: {
                    'scripts/requirements.js': [
                        'bower_components/jquery/jquery.js',
                        'bower_components/jquery-ui/ui/jquery.ui.core.js',
                        'bower_components/jquery-ui/ui/jquery.ui.widget.js',
                        'bower_components/jquery-ui/ui/jquery.ui.mouse.js',
                        'bower_components/jquery-ui/ui/jquery.ui.draggable.js',
                        'bower_components/gmap3/dist/gmap3.min.js',
                        'bower_components/flexslider/jquery.flexslider-min.js'
                    ]
                }
            }
        },
        watch: {
            styles: {
                files: [
                    'styles/**/*.less',
                    '**/*.html',
                    'snippets/**/*.html'],
                tasks: ['concat', 'less', 'includereplace'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['less']);

};
