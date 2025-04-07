import { makeProject } from '@motion-canvas/core';

// for loop vs formula

import not_optimized_histogram from './scenes/sapr/loop_vs_formula/histograms/not_optimized?scene';
import optimized_histogram from './scenes/sapr/loop_vs_formula/histograms/optimized?scene';

import preview from './scenes/sapr/loop_vs_formula/code/preview?scene';
import benchmark from './scenes/sapr/loop_vs_formula/code/benchmark?scene';

//

import scalar_evolution from "./scenes/sapr/scalar_evolution?scene";
import second_two_function from './scenes/sapr/second_two_function?scene';
import second_benchmark_code from './scenes/sapr/second_benchmark_code?scene';
import second_benchmark from './scenes/sapr/second_benchmark?scene';

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/cpp";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

import "./global.css";

Code.defaultHighlighter = new LezerHighlighter(
  parser,
  (tokyoNight as any)[1][2].value,
);

export default makeProject({
  scenes: [preview, benchmark, not_optimized_histogram, scalar_evolution, optimized_histogram, second_two_function, second_benchmark_code, second_benchmark],
});
