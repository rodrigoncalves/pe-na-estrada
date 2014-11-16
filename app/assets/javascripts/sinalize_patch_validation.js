
// (function() {
//   var assertScript = document.createElement('script');
//   assertScript.type = 'text/javascript';
//   assertScript.src = 'assert.js';

//   document.getElementsByTagName('head')[0].appendChild(assertScript);
// })();

const DEFAULT_QUANTITY_OF_PATCHES = 10;

// Error constants
const QUANTITY_OF_PATCHES_IS_ZERO = "quantityOfPatches cannot be 0";
const QUANTITY_OF_PATCHES_IS_NEGATIVE = "quantityOfPatches cannot be negative";
const ALL_STEPS_IS_LOWER_THAN_QUANTITY_OF_PATCHES = "totalOfSteps must be greater than quantityOfPatches";

/*
    Validate the quantity of steps following the rules:
      The quantity of patches cannot be 0;
      The quantity of patches cannot ne negative:
      The quantity of patches cannot be greater than the total of steps;
    param quantityOfPatches - Quantity of patches in a route
    param totalOfSteps - Quantity of steps in a route
    return The quantity of steps validated
 */
function validateQuantityOfPatches(quantityOfPatches, totalOfSteps){

   try{
      assert(quantityOfPatches !== 0, QUANTITY_OF_PATCHES_IS_ZERO);
      assert(quantityOfPatches > 0, QUANTITY_OF_PATCHES_IS_NEGATIVE);
      assertNot(totalOfSteps < quantityOfPatches, ALL_STEPS_IS_LOWER_THAN_QUANTITY_OF_PATCHES);
   }
   catch(thrownError){

      switch(thrownError.message){

         case QUANTITY_OF_PATCHES_IS_ZERO:
            if(totalOfSteps >= DEFAULT_QUANTITY_OF_PATCHES){
              quantityOfPatches = DEFAULT_QUANTITY_OF_PATCHES;
            }
            else{
              quantityOfPatches = totalOfSteps;
            }
            break;

         case QUANTITY_OF_PATCHES_IS_NEGATIVE:
            // Do the treatment for negative numbers here
            // Setted to DEFAULT_QUANTITY_OF_PATCHES as default
            if(totalOfSteps >= DEFAULT_QUANTITY_OF_PATCHES){
              quantityOfPatches = DEFAULT_QUANTITY_OF_PATCHES;
            }
            else{
              quantityOfPatches = totalOfSteps;
            }
            break;

         case ALL_STEPS_IS_LOWER_THAN_QUANTITY_OF_PATCHES:
            // This way the quantityOfStepsPerPatch will be equals to 1
            quantityOfPatches = totalOfSteps;
            break;

         default:
            // Nothing to do
            // quantityOfPatches = DEFAULT_QUANTITY_OF_PATCHES;
      }

   }
   finally{
      return quantityOfPatches;
   }

}