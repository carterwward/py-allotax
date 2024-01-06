import { max, descending } from "d3";
import rank_turbulence_divergence from "./rank_turbulence_divergence.js";
import diamond from './diamond_count.js'
import { tiedrank } from "./util_helpers.js";

// Main module to (i) combine distribution, and (ii) transform
// data in the form we might need for the different
// allotaxonometer plots.


// Takes arrays, returns a Set object containing the union of both arrays
function getUnions(x, y) {
    let a = new Set(x); // convert array x to a Set object
    let b = new Set(y); // convert array y to a Set object
    return new Set([...a, ...b]); // return a new Set object containing the union of a and b
}

// Takes arrays, returns a Set object
function setdiff(x, y) {
    let a = new Set(x); // convert array x to a Set object
    let b = new Set(y); // convert array y to a Set object
    // return a new Set object containing elements in a that are not present in b
    return new Set(
        [...a].filter(x => !b.has(x)));
}

// Builds a mixed element array containing the union of types in elem1 and elem2
function buildMixedElems(elem1, elem2) {
    const mixedelem = [[], []]
    const x = elem1.map(d => d.types)  // extract types from elem1
    const y = elem2.map(d => d.types) // extract types from elem
    const union = Array.from(getUnions(x, y)) // get the union of x and y
    mixedelem[0]['types'] = union; // store union in mixedelem array for elem1
    mixedelem[1]['types'] = union; // store union in mixedelem array for elem2
    return mixedelem // return mixedelem array
}

// Combine elements and return a combined array containing counts, ranks, probs, and totalunique
function combElems(elem1, elem2) {
    const mixedelem = buildMixedElems(elem1, elem2)  // build mixed elements array
    const enum_list = [elem1, elem2] // list containing elem1 and elem2

    for (let j = 0; j < enum_list.length; j++) {
        const enumlist_types = enum_list[j].map(d => d.types) // extract types from enum_list[j]
        const counts = new Array(mixedelem[j]['types'].length) // initialize counts array
        const probs = new Array(mixedelem[j]['types'].length)  // initialize probs array


        // for each index in mixed elem[j], which is the union of both systems
        for (let i = 0; i < mixedelem[j]['types'].length; i++) {  // find the index of type mixedelem[j]['types'][i] in system 1 or 2
            // find the index of type mixedelem[j]['types'][i] in system 1 or 2
            let idx_type_enumlist_in_elem = enumlist_types.indexOf(mixedelem[j]['types'][i])
            // if it exists, grabs counts and probs information else put a 0.
            counts[i] = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["counts"]
            probs[i] = idx_type_enumlist_in_elem === -1 ? 0 : enum_list[j][idx_type_enumlist_in_elem]["probs"]
        }


        // store counts, ranks, probs, and totalunique in mixedelem array for elem1 or elem2
        mixedelem[j]['counts'] = counts
        mixedelem[j]['ranks'] = tiedrank(mixedelem[j]['counts'])
        mixedelem[j]['probs'] = probs
        mixedelem[j]['totalunique'] = getUnions().length

    }

    return mixedelem  // return mixedelem array
}

// Add all the different wordshift metrics here.
function RTD(me, alpha) { return rank_turbulence_divergence(me, alpha) }

// the wordshift argument is a metric like rank_turbulence_divergence
function myDiamond(me, wordshift) { return diamond(me, wordshift) }

function wordShift_dat(me, dat) {
    const out = []
    for (let i = 0; i < me[0]['types'].length; i++) {
        const rank_diff = me[0]['ranks'][i] - me[1]['ranks'][i]
        out.push({
            'type': `${me[0]['types'][i]} (${me[0]['ranks'][i]} ⇋ ${me[1]['ranks'][i]})`,
            'rank_diff': rank_diff,
            'metric': rank_diff < 0 ? -dat.deltas[i] : dat.deltas[i],
        })
    }

    return out.slice().sort((a, b) => descending(Math.abs(a.metric), Math.abs(b.metric)))
}

function balanceDat() {
    const types_1 = this['elem1'].map(d => d.types)
    const types_2 = this['elem2'].map(d => d.types)

    const union_types = getUnions(types_1, types_2)
    const tot_types = types_1.length + types_2.length

    return [
        { y_coord: "total count", frequency: +(types_2.length / tot_types).toFixed(3) },
        { y_coord: "total count", frequency: -(types_1.length / tot_types).toFixed(3) },
        { y_coord: "all names", frequency: +(types_2.length / union_types.size).toFixed(3) },
        { y_coord: "all names", frequency: -(types_1.length / union_types.size).toFixed(3) },
        { y_coord: "exclusive names", frequency: +(setdiff(types_2, types_1).size / types_2.length).toFixed(3) },
        { y_coord: "exclusive names", frequency: -(setdiff(types_1, types_2).size / types_1.length).toFixed(3) }
    ]
}

export { combElems, RTD, myDiamond, wordShift_dat, balanceDat}