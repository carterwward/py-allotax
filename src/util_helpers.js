import FileSaver from 'file-saver';
import * as d3 from "d3";

function which(x) {
    // Which indices are TRUE?
    // Description:
    //   Give the ‘TRUE’ indices of a logical object, allowing for array indices.
    // Arguments:
    //   x: a ‘logical’ vector or array.
    return x.reduce(
        (out, bool, index) => bool ? out.concat(index) : out,
        []
    )
}

function matlab_sort(A, rev) {
    // Inspired by matlab, this functions keep track of the original indices of an array after sorting.
    // Returns both the sorted vector `v` and the original indices.
    //
    // examples
    // A = [5, 4, 1, 2, 3]
    // ([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 2, 1])

    let sorted = rev ? A.slice().sort((a, b) => b - a) : A.slice().sort((a, b) => a - b)

    const A_cp = A.slice()
    const orig_idx = []
    for (let i = 0; i < A.length; ++i) {
        orig_idx.push(A_cp.indexOf(sorted[i]))
        delete A_cp[A_cp.indexOf(sorted[i])]
    }

    return { 'value': sorted, 'orig_idx': orig_idx }
}

function tiedrank(arr) {
    // tiedrank(X) computes the ranks of the values in the vector X. If any X values are tied, tiedrank computes their average rank. Same as in matlab.
    function getIndex(arr, val) {
        var indexes = [], i;
        for (i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i + 1);
        return indexes.reduce((a, b) => a + b) / indexes.length;
    }

    const sorted = arr.slice().sort((a, b) => b - a)
    return arr.map(e => getIndex(sorted, e))
}

function rank_maxlog10(mixedelements) {
    // Get maximum of log10 ranks from both systems, then round up
    let logged_max = [
        Math.max(...mixedelements[[0]].ranks), Math.max(...mixedelements[[1]].ranks)
    ].map(Math.log10)
    return Math.ceil(Math.max(...[logged_max[0], logged_max[1]]))
}

function rin(arr1, arr2) {
    // Find element arr1 presents in arr2, i.e. arr1 %in% arr2
    //
    // examples
    // A = ["bob", "george", "jesus"]
    // B = ["bob", "jesus", "terrence"]
    // rin(A, B)
    // [true, false, true]
    return Array.from(arr1, (x) => {
        return arr2.indexOf(x) == -1 ? false : true
    })
}

function zeros(length) {
    // Create array of all zeros. Similar to matlab.
    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;
        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }
        return arr;
    }
    let empty_mat = createArray(length, length)
    return Array.from(empty_mat, arr => arr.fill(0))
}

async function downloadChart() {
    var chart = document.getElementById('mysvg')

    const svgString = new XMLSerializer().serializeToString(chart);

    const canvas = document.createElement("canvas"); // create <canvas> element

    canvas.width = chart.getAttribute('width');
    canvas.height = chart.getAttribute('height');
    // The 2D Context provides objects, methods, and properties to draw
    // and manipulate graphics on a canvas drawing surface.
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const data = new Blob([svgString], { type: "image/svg+xml" });

    const url = URL.createObjectURL(data);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function (blob) { FileSaver.saveAs(blob, "output.svg"); });
    };
    img.src = url;
}

function get_relevant_types(diamond_dat) {
    const ncells = 60;
    const bin_size = 1.5;
    const cummulative_bin = d3.range(0, ncells, bin_size)
    const relevant_types = []

    for (let sys of ["right", "left"]) {

        for (let i = 1; i < cummulative_bin.length; i++) {

            const filtered_dat = diamond_dat.filter(d => d.value > 0 && d.which_sys == sys)
                .filter(d => d.coord_on_diag >= cummulative_bin[i - 1] &&
                    d.coord_on_diag < cummulative_bin[i])

            if (filtered_dat.length > 0) {
                const cos_dists = filtered_dat.map(d => d.cos_dist)
                const max_dist = cos_dists.reduce((a, b) => { return Math.max(a, b) })
                const max_dist_idx = cos_dists.indexOf(max_dist)
                const name = d3.shuffle(filtered_dat[max_dist_idx]['types'].split(","))[0]
                relevant_types.push(name)
            }
        }
    }
    return relevant_types
}
export { matlab_sort, rin, rank_maxlog10, tiedrank, which, zeros, downloadChart, get_relevant_types };
