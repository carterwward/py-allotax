'use strict'

var assert = require('chai').assert;
import mixedElems from '../src/combine_distributions.js';
import { test_elem_1, test_elem_2 } from './test_data.js'

describe('suite of utility functions inside combine distributions', function () {
  describe('combining two systems', function () {
    it('types in elem1 should be the exact same than elem2', function () {
        const me_class_test = new mixedElems(test_elem_1, test_elem_2)
        const mixed_elem_test = me_class_test.me
        assert.deepEqual(mixed_elem_test[1]['types'], mixed_elem_test[0]['types']);
      });
  });
})
