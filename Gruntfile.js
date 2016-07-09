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
            console.log(content.match(jsReg));
            console.log(content.match(cssReg));
            // var jsResult = "javascripts/"+content.match(jsReg)[1]+"min"+".js";
            // console.log(jsResult);
            // content.replace(jsReg, jsResult);
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
        src: ["bin/bin/**", "bin/controllers/**", "bin/data/**",
        "bin/middlewares/**", "bin/models/**", "bin/public/**",
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
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('build', ['clean', 'copy:main', 'concat:lib']);
  grunt.registerTask('deploy', ['clean', 'copy:deploy', 'concat:lib']);
  grunt.registerTask('default', ['clean','copy:main','concat:lib','express', 'watch']);
}
