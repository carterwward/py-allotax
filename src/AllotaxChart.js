
async function createAllotaxChart(data_1, data_2, alpha, passed_svg) {
    // Dynamically import the allotaxonometer module
    const d3 = await import('d3');
    const { combElems, RTD, myDiamond, wordShift_dat, DiamondChart, WordShiftChart, BalanceChart, LegendChart, balanceDat } = await import('allotaxonometer');
    
    // Combining both systems in mixedElems class
    
    const me = combElems(data_1, data_2);
    const rtd = RTD(me, alpha);
    
    // Create Data req for charts
    const dat = myDiamond(me, rtd);
    const diamond_dat_raw = dat.counts;
    const diamond_dat = diamond_dat_raw.filter(d => d.types !== "")

    const barData = wordShift_dat(me, dat).slice(0, 30);

    max_shift = d3.max(barData, d => Math.abs(d.metric))

    // Plot
    DiamondChart(diamond_dat, alpha, passed_svg.diamond_svg);
    
    WordShiftChart(barData, {  
      x: d => d.metric,
      y: d => d.type,
      xFormat: "%",
      xDomain: [-max_shift*1.5, max_shift*1.5], // [xmin, xmax]
      width: 300,
      yPadding: 0.2,
      height: 740,
      xLabel: "← System 1 · Divergence contribution · System 2 →",
      colors: ["lightgrey", "lightblue"] }, passed_svg.wordshift_svg);
    
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
