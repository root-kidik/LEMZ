import { makeProject } from '@motion-canvas/core';

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/cpp";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

import "./global.css";

Code.defaultHighlighter = new LezerHighlighter(
  parser,
  (tokyoNight as any)[1][2].value,
);

// // for loop vs formula

// import not_optimized_histogram from './scenes/sapr/loop_vs_formula/histograms/not_optimized?scene';
// import optimized_histogram from './scenes/sapr/loop_vs_formula/histograms/optimized?scene';

// import preview from './scenes/sapr/loop_vs_formula/code/preview?scene';
// import benchmark from './scenes/sapr/loop_vs_formula/code/benchmark?scene';
// import assembler from './scenes/sapr/loop_vs_formula/code/assembler?scene';

// // sleep if vs not if

// import preview_sleep from './scenes/sapr/sleep_if_vs_sleep_not_if/code/preview?scene';
// import benchmark_sleep from './scenes/sapr/sleep_if_vs_sleep_not_if/code/benchmark?scene';
// import optimized_sleep from './scenes/sapr/sleep_if_vs_sleep_not_if/histograms/optimized?scene';

// // if vs not if

// import preview_if_not_if from './scenes/sapr/if_vs_not_if/code/preview?scene';
// import benchmark_if_not_if from './scenes/sapr/if_vs_not_if/code/benchmark?scene';
// import optimized_if_not_if from './scenes/sapr/if_vs_not_if/histograms/optimized?scene';

// export default makeProject({
//   scenes: [preview, benchmark, not_optimized_histogram, assembler, optimized_histogram,
//     preview_sleep, benchmark_sleep, optimized_sleep,
//     preview_if_not_if, benchmark_if_not_if, optimized_if_not_if],
// });

//////////////////////////////////////////////////////////////////////////////////////////

import base from './scenes/cmake/base?scene';
import executable from './scenes/cmake/executable?scene';
import executable_v2 from './scenes/cmake/executable_v2?scene';
import shared_lib from './scenes/cmake/shared_lib?scene';
import cpp_standard from './scenes/cmake/cpp_standard?scene';

export default makeProject({
  scenes: [base, executable, executable_v2, shared_lib, cpp_standard],
});