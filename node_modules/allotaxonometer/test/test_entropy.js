// 'use strict'

// var assert = require('chai').assert;
// import { 
//     get_entropy_scores as entropy,
//     get_jsd_scores as jsd
// } from "../src/entropy.js";
// import mixedElems from '../src/combine_distributions.js';
// import { test_elem_1, test_elem_2 } from './test_data.js'
// const d3 = require('d3-array')

// describe('suite of utility functions inside rank turbulence divergence', function () {
//   describe('calculating rank turbulence divergence', function () {
//     const me_class_test = new mixedElems(test_elem_1, test_elem_2);
//     const mixed_elem_test = me_class_test.combElems();
    
//     // not real test, we should get the right values from Shifterator
//     it('should return the following sum of divergence_elements (base=2; alpha=1)', function () {
//         const ent1 = entropy(mixed_elem_test, 2, 1)
//         const div0 = +d3.sum(Object.values(ent1["type2score_1"])).toFixed(4)
//         const div1 = +d3.sum(Object.values(ent1["type2score_2"])).toFixed(4)
//         assert.deepEqual([3165.304, 3353.5343], [div0, div1]); 
//     });   
    
//     // not real test, we should get the right values from Shifterator
//     it('should return the following sum of divergence_elements (weight_1=0.5, weight_2=0.5; base=2; alpha=1)', function () {
//         const m = 0.5 * mixed_elem_test[0]['probs'][1] + 0.5 * mixed_elem_test[1]['probs'][1]
//         const jsd1 = jsd(mixed_elem_test, m, 0.5, 0.5, 2, 1)
//         const div0 = +d3.sum(Object.values(jsd1[0])).toFixed(4)
//         const div1 = +d3.sum(Object.values(jsd1[1])).toFixed(4)
//         const div2 = +d3.sum(Object.values(jsd1[2])).toFixed(4)
//         assert.deepEqual([0.581, -8.9234, -47.9011], [div0, div1, div2]); 
//     });   
      
//   });
// })

