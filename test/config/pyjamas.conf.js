/**
 * Test Configuration for Pyjamas-JS
 */
module.exports = function(config){
    'use strict';

    config.set({
        // The project root path. All file paths are relative to this path
        basePath        : '../../',
        files           : [
            'src/*.js',
            'test/specs/*.spec.js'
        ],
        plugins         : [
            'karma-jasmine',
            'karma-coverage',
            'karma-nested-reporter',
            'karma-phantomjs-launcher'
        ],
        browsers        : ['PhantomJS'],
        reporters       : [
            'coverage',
            'progress'
        ],
        coverageReporter: {
            dir: 'build/reports/coverage',
            reporters: [
                { type : 'text' },
                { type : 'lcov', subdir : '.', file : 'lcov.info'},
                { type : 'html', subdir : '.'}
            ]
        },
        frameworks      : ['jasmine'],
        port            : 9876,
        singleRun       : true,
        preprocessors   : { 'src/*.js': 'coverage'}
    });
};
