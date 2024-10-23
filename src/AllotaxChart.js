async function createAllotaxChart(data_1, data_2, alpha, passed_svg) {
    // Dynamically import the allotaxonometer module
    const { mixedElems, DiamondChart, WordShiftChart, BalanceChart, LegendChart } = await import('allotaxonometer');

    // Combining both systems in mixedElems class
    const me_class = new mixedElems(data_1, data_2);
    const rtd = me_class.RTD(alpha);
    // Create Data req for charts
    const dat = me_class.Diamond(rtd);
    const diamond_dat = dat.counts;
    const wordshift = me_class.wordShift(dat);
    const balance_dat = me_class.balanceDat();

    // Am I missing some canvas settings here?
      // ADDED
    // Define dimensions and margins
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Create the <g> element for the charts
    const g = passed_svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Plot
    DiamondChart(diamond_dat, g);
    WordShiftChart(wordshift, { }, g);
    BalanceChart(balance_dat, { }, g);
    LegendChart(diamond_dat, { }, g);
}

module.exports = { createAllotaxChart };