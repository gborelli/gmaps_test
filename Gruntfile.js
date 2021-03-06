/*global module, grunt */
module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        includereplace: {
            templates: {
                src: 'index.tmpl',
                dest: 'dist/index.html'
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
                    src: ['**/[^_]*.less'],
                    dest: 'dist/styles/',
                    ext: '.css'
                }]
            }
        },
        concat: {
            all: {
                files: {
                    'dist/scripts/app.js': [
                        'bower_components/jquery/jquery.js',
                        'bower_components/bxslider-4/jquery.bxslider.min.js',
                        'scripts/map.js'
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
            bsFiles: {
                src : ['styles/*.css']
            },
            options: {
                server: {
                    baseDir: "./"
                }
            }
        }
        // browserSync: {
        //     html: {
        //         bsFiles: {
        //             src : ['styles/*.css']
        //         },
        //         options: {
        //             watchTask: true,
        //             debugInfo: true,
        //             server: {
        //                 baseDir: "."
        //             }
        //         }
        //     },
        //     plone: {
        //         bsFiles: {
        //             src : ['styles/*.css']
        //         },
        //         options: {
        //             watchTask: true,
        //             debugInfo: true,
        //             proxy: "localhost:8080"
        //         }
        //     }
        // }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'less', 'includereplace']);
    grunt.registerTask('bsync', ["browserSync", "watch"]);

};
