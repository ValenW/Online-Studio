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
            var viewsPathReg = /src\/views\//;
            if (!viewsPathReg.test(srcpath)) {
              return content;
            }
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
        cwd: 'src',
        src: '**',
        dest: 'bin'
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
        files: [{
          expand: true,
          cwd: './bin/public/javascripts',
          src: '**/*.js',
          dest: './bin/public/javascripts'
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
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('build', ['clean', 'copy:main', 'concat:lib']);
  grunt.registerTask('deploy', ['clean', 'copy:deploy', 'concat:lib']);
  grunt.registerTask('default', ['clean','copy:main','concat:lib','express', 'watch']);
}
