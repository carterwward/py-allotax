'use strict'

var assert = require('chai').assert;
import { 
  tiedrank as rank, 
  rin as rin, 
  matlab_sort as sort,
 } from "../src/utils_helpers.js";


describe('suite of utility functions inside tiedrank', function () {
  describe('rank values from large to smaller, taking average when ties', function () {
    it('should return rank with average when tied', function () {
        let myNums = [5, 4, 4, 3, 3, 2, 2, 1, 1, 1,];
        assert.deepEqual([1, 2.5, 2.5, 4.5, 4.5, 6.5, 6.5, 9, 9, 9], rank(myNums));
      });
  });
})

describe('suite of utility functions inside rin', function () {
  describe('Find element arr1 presents in arr2, i.e. arr1 %in% arr2', function () {
    it('should return boolean when found', function () {
        let myNames = ['John', 'Williams', 'James', 'Jesus'];
        assert.deepEqual([true, true], rin(['John', 'Williams'], myNames));
      });
  });
})

describe('suite of utility functions inside matlab_sort', function () {
  describe('Keep track of the original indices of an array after sorting', function () {
    it('should return ordered list', function () {
        let myNums = [5, 4, 1, 2, 3];
        assert.deepEqual([1,2,3,4,5], sort(myNums, false)['value']);
      });
    it('should return original index', function () {
        let myNums = [5, 4, 1, 2, 3];
        assert.deepEqual([2,3,4,1,0], sort(myNums, false)['orig_idx']);
      });
  });
})

