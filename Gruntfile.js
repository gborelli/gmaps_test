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
                        'bower_components/bxslider-4/jquery.bxslider.min.js'
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
        },

        browserSync: {
            html: {
                bsFiles: {
                    src : ['styles/*.css']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    server: {
                        baseDir: "."
                    }
                }
            },
            plone: {
                bsFiles: {
                    src : ['styles/*.css']
                },
                options: {
                    watchTask: true,
                    debugInfo: true,
                    proxy: "localhost:8080"
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).
    grunt.registerTask('default', ['less']);
    grunt.registerTask('bsync', ["browserSync:html", "watch"]);

};
