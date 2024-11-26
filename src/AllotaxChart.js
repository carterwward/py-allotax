import DiamondChart from './components/diamond_plot.js';
import WordShiftChart from './components/wordshift_plot.js';
import BalanceChart from './components/balance_plot.js';
import LegendChart from './components/legend_plot.js';
import * as d3 from 'd3';
import { combElems, RTD, myDiamond, wordShift_dat, balanceDat } from 'allotaxonometer';

export default async function createAllotaxChart(data_1, data_2, alpha, title1, title2, passed_svg) {
    const me = combElems(data_1, data_2);
    const rtd = RTD(me, alpha);

    // Create Data required for charts
    const dat = myDiamond(me, rtd);
    const diamond_dat = dat.counts;
    const barData = wordShift_dat(me, dat).slice(0, 30);

    const max_shift = d3.max(barData, d => Math.abs(d.metric));
    const maxlog10 = Math.ceil(
        d3.max([
            Math.log10(d3.max(me[0].ranks)),
            Math.log10(d3.max(me[1].ranks)),
        ])
    );

    // Plot
    DiamondChart(
        diamond_dat,
        alpha,
        title1,
        title2,
        maxlog10,
        rtd.normalization,
        {passed_svg: passed_svg.diamond_svg}
    );

    WordShiftChart(
        barData,
        {
            x: d => d.metric,
            y: d => d.type,
            xDomain: [-max_shift * 1.5, max_shift * 1.5],
            passed_svg: passed_svg.wordshift_svg
        }
    );

    BalanceChart(
        balanceDat(data_1, data_2),
        {
            x: d => d.frequency,
            y: d => d.y_coord,
            passed_svg: passed_svg.balance_svg
        }
    );

    const N_CATEGO = 20;
    const ramp = d3.range(N_CATEGO).map(i =>
        d3.rgb(d3.interpolateInferno(i / (N_CATEGO - 1))).hex()
    );
    const color = d3.scaleOrdinal(d3.range(N_CATEGO), ramp);

    LegendChart(
        color,
        {
            max_count_log: Math.ceil(
                Math.log10(d3.max(diamond_dat, d => d.value))
            ) + 1,
            passed_svg: passed_svg.legend_svg
        }
    );
}
