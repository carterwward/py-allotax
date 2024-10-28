import { max, descending } from "d3-array";

import { tiedrank } from "./utils_helpers.js";
import rank_turbulence_divergence from "./rank_turbulence_divergence.js";
import diamond from './diamond_count.js'


// Main class to (i) combine distribution, and (ii) transform 
// data in the form we might need for the different
// allotaxonometer plots.
export default class mixedElems {
  
  constructor(elem1, elem2) {
    this.elem1 = elem1;
    this.elem2 = elem2;
    this.me = this.combElems()
  }

  // Takes arrays, returns a Set object
  getUnions(x,y) {
    let a = new Set(x);
    let b = new Set(y);
    return new Set([...a, ...b]);
  }
  
  // Takes arrays, returns a Set object
  setdiff(x,y) {
    let a = new Set(x);
    let b = new Set(y);
    return new Set(
      [...a].filter(x => !b.has(x)));
  } 

  buildMixedElems() {
    const mixedelem = [[], []]
    const x = this.elem1.map(d=>d.types)
    const y = this.elem2.map(d=>d.types)
    const union = Array.from(this.getUnions(x,y))
    mixedelem[0]['types'] = union; 
    mixedelem[1]['types'] = union;
    return mixedelem
  }
  
  combElems() {
    const mixedelem = this.buildMixedElems() 
    const enum_list = [this.elem1, this.elem2]

    for (let j=0; j < enum_list.length; j++) {
      const enumlist_types = enum_list[j].map(d => d.types)
      const counts = new Array(mixedelem[j]['types'].length)
      const probs = new Array(mixedelem[j]['types'].length)

      // for each index in mixed elem[j], which is the union of both systems
      for (let i=0; i < mixedelem[j]['types'].length; i++) {
        // find the index of type mixedelem[j]['types'][i] in system 1 or 2
        let idx_type_enumlist_in_elem = enumlist_types.indexOf(mixedelem[j]['types'][i])
        // if it exists, grabs counts and probs information else put a 0.
        counts[i] = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["counts"]
        probs[i]  = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["probs"]
      }
      
      mixedelem[j]['counts']      = counts
      mixedelem[j]['ranks']       = tiedrank(mixedelem[j]['counts'])
      mixedelem[j]['probs']       = probs
      mixedelem[j]['totalunique'] = this.getUnions().length
 
    }

    return mixedelem
  }

  // Add all the different wordshift metrics here.
  RTD(alpha) { return rank_turbulence_divergence(this.me, alpha) }
 
  // the wordshift argument is a metric like rank_turbulence_divergence  
  Diamond(wordshift) { return diamond(this.me, wordshift) }
  
  wordShift(dat) { 
      const out = []
      for (let i=0; i < this.me[0]['types'].length; i++) {
        const rank_diff = this.me[0]['ranks'][i]-this.me[1]['ranks'][i]
        out.push({
          'type': `${ this.me[0]['types'][i]} (${ this.me[0]['ranks'][i]} ⇋ ${this.me[1]['ranks'][i] })` ,
          'rank_diff': rank_diff,
          'metric': rank_diff < 0 ? -dat.deltas[i] : dat.deltas[i], 
        })
      }
  
      return {
        'dat': out.slice().sort((a, b) => descending(Math.abs(a.metric), Math.abs(b.metric))),
        'max_shift': max(out, d => Math.abs(d.metric))
        }
      }
  
  balanceDat() {
      const types_1 = this['elem1'].map(d => d.types)
      const types_2 = this['elem2'].map(d => d.types)
      
      const union_types = this.getUnions(types_1, types_2)
      const tot_types = types_1.length+types_2.length
      
      return [ 
        { y_coord: "total count",     frequency: +(types_2.length / tot_types).toFixed(3) },
        { y_coord: "total count",     frequency: -(types_1.length / tot_types).toFixed(3) },
        { y_coord: "all names",       frequency: +(types_2.length / union_types.size).toFixed(3) },
        { y_coord: "all names",       frequency: -(types_1.length / union_types.size).toFixed(3) },
        { y_coord: "exclusive names", frequency: +(this.setdiff(types_2, types_1).size / types_2.length).toFixed(3) },
        { y_coord: "exclusive names", frequency: -(this.setdiff(types_1, types_2).size / types_1.length).toFixed(3) } 
      ]
  }

}  
