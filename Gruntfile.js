module.exports = function (grunt) {
  var path = require('path');
  grunt.initConfig({
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: '**',
        dest: 'bin/'
      },
      deploy: {
        options: {
          process: function(content, srcpath) {
            var jsReg = /javascripts\/(?:(?:\w+)\/)*(\w+)\.js/g
            var cssReg = /stylesheets\/(?:(?:\w+)\/)*(\w+)\.css/g
            var jsMatchResult = content.match(jsReg);
            var cssMatchResult =  content.match(cssReg);
            if (jsMatchResult !== null) {
              jsMatchResult.forEach(function(jsString) {
                var targetJsString = jsString.replace('.js', '.min.js');
                content = content.replace(jsString, targetJsString);
              });
            }
            if (cssMatchResult !== null) {
              cssMatchResult.forEach(function(cssString) {
                var targetCssString = cssString.replace('.css', '.min.css');
                content = content.replace(cssString, targetCssString);
              });
            }
            return content;
          }
        },
        expand: true,
        cwd: 'bin/views/',
        src: '**',
        dest: 'bin/views/'
      }
    },
    clean: {
      build: {
        src: ["bin/bin/**", "bin/controllers/**", "bin/data/**", "bin/middlewares/**", "bin/models/**",
        "bin/public/javascripts/**", "bin/public/libs/**", "bin/public/resources/**", "bin/public/stylesheets/**",
        "bin/routes/**", "bin/views/**", "bin/app.js"]
      }
    },
    concat: {
      options: {
        separator: ";"
      },
      lib: {
        src: ['./src/public/libs/jquery/jquery-1.12.3.min.js', './src/public/libs/semantic-ui/semantic.min.js'],
        dest: 'bin/public/libs/lib.min.js'
      }
    },
    uglify: {
      target: {
        files: {
          "./bin/public/javascripts/editor/canvas.min.js": "./bin/public/javascripts/editor/canvas.js",
          "./bin/public/javascripts/editor/data.min.js": "./bin/public/javascripts/editor/data.js",
          "./bin/public/javascripts/editor/menu.min.js": "./bin/public/javascripts/editor/menu.js",
          "./bin/public/javascripts/editor/music.min.js": "./bin/public/javascripts/editor/music.js",
          "./bin/public/javascripts/analyze.min.js": "./bin/public/javascripts/analyze.js",
          "./bin/public/javascripts/category.min.js": "./bin/public/javascripts/category.js",
          "./bin/public/javascripts/form.min.js": "./bin/public/javascripts/form.js",
          "./bin/public/javascripts/home.min.js": "./bin/public/javascripts/home.js",
          "./bin/public/javascripts/individual.min.js": "./bin/public/javascripts/individual.js",
          "./bin/public/javascripts/JZZ.min.js": "./bin/public/javascripts/JZZ.js",
          "./bin/public/javascripts/midi.min.js": "./bin/public/javascripts/midi.js",
          "./bin/public/javascripts/music_detail.min.js": "./bin/public/javascripts/music_detail.js",
          "./bin/public/javascripts/music_detail_play.min.js": "./bin/public/javascripts/music_detail_play.js",
          "./bin/public/javascripts/music_info.min.js": "./bin/public/javascripts/music_info.js",
          "./bin/public/javascripts/OneNote.min.js": "./bin/public/javascripts/OneNote.js",
          "./bin/public/javascripts/top_button.min.js": "./bin/public/javascripts/top_button.js",
          "./bin/public/javascripts/user_update.min.js": "./bin/public/javascripts/user_update.js",
          "./bin/public/javascripts/wait.min.js": "./bin/public/javascripts/wait.js",
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: "./bin/public/stylesheets",
          src: "*.css",
          dest: "./bin/public/stylesheets",
          ext: ".min.css"
        }]
      }
    },
    express: {
      options: {
        port: 3000
      },
      dev: {
        options: {
          script: 'bin/bin/www'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      copy: {
        files: ['src/**/*.*'],
        tasks: ['copy:main']
      },
      express: {
        files: ['src/**/*.*'],
        tasks: ['express:dev'],
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('build', ['clean', 'copy:main', 'concat:lib']);
  grunt.registerTask('deploy', ['clean', 'copy:main', 'copy:deploy', 'concat:lib', 'uglify', 'cssmin']);
  grunt.registerTask('default', ['clean','copy:main','concat:lib','express', 'watch']);
}
