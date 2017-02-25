// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  let configuration = {
    basePath: '',
    frameworks: ['jasmine', 'angular-cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('angular-cli/plugins/karma'),
      require('karma-spec-reporter')
    ],
    files: [
      { pattern: './src/test.ts', watched: false },
      // don't watch the Vim junk files
      { pattern: '**/*.swp', watched: false }
    ],
    exclude: [
      // exclude the Vim junk files
      '**/*.swp'
    ],
    preprocessors: {
      './src/test.ts': ['angular-cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    customLaunchers: {
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      config: './.angular-cli.json',
      environment: 'dev'
    },
    /*
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'karma-coverage-istanbul-reporter']
              : ['progress'],
    */
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
