
async function createAllotaxChart(data_1, data_2, alpha, passed_svg) {
    // Dynamically import the allotaxonometer module
    const d3 = await import('d3');

    const { combElems, RTD, myDiamond, wordShift_dat, DiamondChart, WordShiftChart, BalanceChart, LegendChart, balanceDat } = await import('allotaxonometer');
    
    // Combining both systems in mixedElems class
    function logspace(a, b, n = 50) {
        const start = Math.pow(10, a);
        const step = (b - a) / (n - 1);
        const result = [];
      
        for (let i = 0; i < n; i++) {
            result.push(Math.pow(10, a + i * step));
        }
      
        return result;
    }
    
    const me = combElems(data_1, data_2);
    const rtd = RTD(me, alpha);
    
    // Create Data req for charts
    const dat = myDiamond(me, rtd);
    const diamond_dat = dat.counts;
    const barData = wordShift_dat(me, dat).slice(0, 30);

    const max_shift = d3.max(barData, d => Math.abs(d.metric))
    const maxlog10 = Math.ceil(d3.max([Math.log10(d3.max(me[0].ranks)), Math.log10(d3.max(me[1].ranks))]))
    
    const Ninset = Math.pow(10, 3)
    const tmpr1 = logspace(0, maxlog10, Ninset);
    const tmpr2 = logspace(0, maxlog10, Ninset);
    const x1 = tmpr1.map(val => Array(tmpr1.length).fill(Math.pow(val, -1)));
    const x2 = Array(tmpr1.length).fill(tmpr2.map(val => Math.pow(val, -1)));
    
    const  deltamatrix =  alphaNormType2(x1, x2, alpha).map(row => row.map(val => val / rtd.normalization));

    function alphaNormType2(x1, x2, alpha) {
        if (alpha < 0) {
            throw new Error('alpha must be >= 0');
        } else if (alpha === Infinity) {
            // Handle alpha = Inf by finding the element-wise max
            return x1.map((row, i) => row.map((val, j) => {
                const maxVal = Math.max(val, x2[i][j]);
                return val === x2[i][j] ? 0 : maxVal;
            }));
        } else if (alpha === 0) {
            // Handle alpha = 0 by computing log divergence element-wise
            return x1.map((row, i) => row.map((val, j) => Math.abs(Math.log(val / x2[i][j]))));
        } else {
            // General case for alpha > 0
            const prefactor = (alpha + 1) / alpha;
            const power = 1 / (alpha + 1);
            return x1.map((row, i) => row.map((val, j) =>
                prefactor * Math.abs(Math.pow(val, alpha) - Math.pow(x2[i][j], alpha)) ** power
            ));
        }
      }

    // Plot
    DiamondChart(diamond_dat, deltamatrix, alpha, maxlog10, passed_svg.diamond_svg);

    WordShiftChart(barData, {  
        x: d => d.metric,
        y: d => d.type,
        xFormat: "%",
        xDomain: [-max_shift*1.5, max_shift*1.5], // [xmin, xmax]
        width: 300,
        yPadding: 0.2,
        height: 680,
        xLabel: "← System 1 · Divergence contribution · System 2 →",
        colors: ["lightgrey", "lightblue"] }, passed_svg.wordshift_svg)
    
    BalanceChart(balanceDat(data_1, data_2), {
        x: d => d.frequency,
        y: d => d.y_coord,
        xFormat: "%",
        xDomain: [-1, 1], // [xmin, xmax]
        xLabel: "",
        width: 300,
        yPadding: 0.5,
        colors: ["lightgrey", "lightblue"]
    }, passed_svg.balance_svg);

    const N_CATEGO = 20
    const ramp = d3.range(N_CATEGO).map(i => d3.rgb(d3.interpolateInferno(i / (N_CATEGO - 1))).hex())
    color = d3.scaleOrdinal(d3.range(N_CATEGO), ramp)
    
    LegendChart(color, {
        tickSize: 0,
        max_count_log: Math.ceil(Math.log10(d3.max(diamond_dat, d => d.value)))+1,
        marginTop:11,
        width: 370
      }, passed_svg.legend_svg);
}

module.exports = { createAllotaxChart };
