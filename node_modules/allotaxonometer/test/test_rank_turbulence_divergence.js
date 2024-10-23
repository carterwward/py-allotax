// 'use strict'

// var assert = require('chai').assert;
// import rank_turbulence_divergence from "../src/rank_turbulence_divergence.js";
// import mixedElems from '../src/combine_distributions.js';
// import {test_elem_1, test_elem_2} from './test_data.js'
// const d3 = require('d3-array')

// describe('suite of utility functions inside rank turbulence divergence', function () {
//   describe('calculating rank turbulence divergence', function () {
//     const me_class_test = new mixedElems(test_elem_1, test_elem_2);
//     const mixed_elem_test = me_class_test.combElems();
    
//     it('should return the following normalization value (alpha=0)', function () {
//         const rtd0 = rank_turbulence_divergence(mixed_elem_test, 0)  
//         assert.deepEqual(3019.1957, (+rtd0.normalization.toFixed(4)));
//     });
//     it('should return the following normalization value (alpha=1)', function () {
//         const rtd1 = rank_turbulence_divergence(mixed_elem_test, 1)
//         assert.deepEqual(223.5865, (+rtd1.normalization.toFixed(4)));  
//     });
//     it('should return the following normalization value (alpha=Inf)', function () {
//       const rtdInf = rank_turbulence_divergence(mixed_elem_test, Infinity)
//       assert.deepEqual(15.1183, (+rtdInf.normalization.toFixed(4))); 
//     }); 
//     // Weird. this tests works when divergence values are .toFixed(4) 
//     // We should test all our examples.
//     it('should return the following sum of divergence_elements (alpha=Inf)', function () {
//       const rtdInf = rank_turbulence_divergence(mixed_elem_test, Infinity)
//       const rounded_val = rtdInf.divergence_elements.map(i => +i.toFixed(4))
//       assert.deepEqual(0.3822, (+d3.sum(rounded_val).toFixed(4)));
//     });      
//   });
// })

