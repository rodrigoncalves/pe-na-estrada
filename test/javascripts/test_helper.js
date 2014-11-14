// Teaspoon includes some support files, but you can use anything from your own support path too.
// require support/sinon
// require support/your-support-file
//
// PhantomJS (Teaspoons default driver) doesn't have support for Function.prototype.bind, which has caused confusion.
// Use this polyfill to avoid the confusion.
//= require support/bind-poly
//
// Deferring execution
// If you're using CommonJS, RequireJS or some other asynchronous library you can defer execution. Call
// Teaspoon.execute() after everything has been loaded. Simple example of a timeout:
//
// Teaspoon.defer = true
// setTimeout(Teaspoon.execute, 1000)
//
// Matching files
// By default Teaspoon will look for files that match _test.{js,js.coffee,.coffee}. Add a filename_test.js file in your
// test path and it'll be included in the default suite automatically. If you want to customize suites, check out the
// configuration in config/initializers/teaspoon.rb
//
// Manifest
// If you'd rather require your test files manually (to control order for instance) you can disable the suite matcher in
// the configuration and use this file as a manifest.
//
// For more information: http://github.com/modeset/teaspoon
//
// You can require your own javascript files here. By default this will include everything in application, however you
// may get better load performance if you require the specific files that are being used in the test that tests them.
//= require application

module('google_maps_api');

// Silly test for testing
test("Truth is always true", function() {

   ok(true);
});

test("Testing if function 'calculateRouteTotalDistance' exists", function(){

    ok(calculateRouteTotalDistance, 'This function exists');
});

/*
test("Testing if function 'calculateRouteTotalDistance' should not pass", function(){

    equal(calculateRouteTotalDistance(2), 2,'The method dont right');
});*/


test("Testing if function 'calculateRemainingSteps' exists", function(){

    ok(calculateRemainingSteps, 'This function exists');
});

test("Testing if function 'calculateRemainingSteps' should pass if 10 steps as total and 8 much as patchs  ", function(){

    equal(calculateRemainingSteps(10, 8), 2,'The method works through 10 steps as total and 8 much as patchs');
});

test("Testing if function 'calculateRemainingSteps' should pass if 10 steps as total and 2 much as patchs  ", function(){

    equal(calculateRemainingSteps(10, 2), 0,'The method works through 10 steps as total and 2 much as patchs');
});

test("Testing if function 'calculateRemainingSteps' should pass if 10 steps as total and 3 much as patchs  ", function(){

    equal(calculateRemainingSteps(10, 3), 1,'The method works through 10 steps as total and 3 much as patchs');
});

test("Testing if function 'calculateRemainingSteps' should pass with the second number being more", function(){

    equal(calculateRemainingSteps(10, 11), 10,'The method works through 10 steps as total and 11 much as patchs');
});


test("Testing if function 'calculateRemainingSteps' should pass with a  negative number ", function(){

    equal(calculateRemainingSteps(-5, 2), -1,'The method works through -5 steps as total and 2 much as patchs');
});

test("Testing if function 'calculateRemainingSteps' should pass with a two negative number ", function(){

    equal(calculateRemainingSteps(-5, -2), -1,'The method works through -5 steps as total and 2 much as patchs');
});


test("Testing if function 'calculateRemainingSteps' should pass if 18649575 steps as total and 2 much as patchs  ", function(){

    equal(calculateRemainingSteps(18649575, 2), 1,'The method works through 18649575 steps as total and 2 much as patchs');
});
