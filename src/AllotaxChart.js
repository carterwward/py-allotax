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

    // Plot
    DiamondChart(diamond_dat, passed_svg.diamond_svg);
    WordShiftChart(wordshift, { height: 670 }, passed_svg.wordshift_svg);
    BalanceChart(balance_dat, { }, passed_svg.balance_svg);
    LegendChart(diamond_dat, { }, passed_svg.legend_svg);
}

module.exports = { createAllotaxChart };
