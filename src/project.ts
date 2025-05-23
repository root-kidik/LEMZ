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

// import base from './scenes/cmake/base?scene';
// import executable from './scenes/cmake/executable?scene';
// import executable_v2 from './scenes/cmake/executable_v2?scene';
// import shared_lib from './scenes/cmake/shared_lib?scene';
// import cpp_standard from './scenes/cmake/cpp_standard?scene';
// import cmake_presets from './scenes/cmake/cmake_presets?scene';
// import makefile from './scenes/cmake/makefile?scene';

// export default makeProject({
//   scenes: [base, executable, executable_v2, shared_lib, cpp_standard, cmake_presets, makefile],
// });

//////////////////////////////////////////////////////////////////////////////////////////

// import heap_buffer_overflow from './scenes/sanitizers/heap_buffer_overflow?scene';
// import leak_memory from './scenes/sanitizers/leak_memory?scene';
// import undefined_sanitizer from './scenes/sanitizers/undefined_sanitizer?scene';
// import stack_use_after_scope from './scenes/sanitizers/stack_use_after_scope?scene';
// import memory_sanitizer from './scenes/sanitizers/memory_sanitizer?scene';
// import tsan_sanitizer from './scenes/sanitizers/tsan_sanitizer?scene';
// import project_cmake from './scenes/sanitizers/project_cmake?scene';

// export default makeProject({
//   scenes: [heap_buffer_overflow, leak_memory, undefined_sanitizer, stack_use_after_scope, memory_sanitizer, tsan_sanitizer, project_cmake],
// });

//////////////////////////////////////////////////////////////////////////////////////////

// import service from './scenes/integration/service?scene';
// import code from './scenes/integration/code?scene';
// import cmake from './scenes/integration/cmake?scene';

// export default makeProject({
//   scenes: [service, code, cmake],
// });

//////////////////////////////////////////////////////////////////////////////////////////

// import fpga_router from './scenes/devcontainer/fpga_router?scene';
// import vscode from './scenes/devcontainer/vscode?scene';
// import histograma from './scenes/devcontainer/histograma?scene';

// export default makeProject({
//   scenes: [fpga_router, vscode, histograma],
// });

//////////////////////////////////////////////////////////////////////////////////////////

// import deadcode from './scenes/clangtidy/deadcode?scene';
// import ctorcopy from './scenes/clangtidy/ctorcopy?scene';
// import ctorinit from './scenes/clangtidy/ctorinit?scene';
// import magic from './scenes/clangtidy/magic?scene';
// import deadcode2 from './scenes/clangtidy/deadcode2?scene';
// import dtor from './scenes/clangtidy/dtor?scene';
// import repo from './scenes/clangtidy/repo?scene';

// export default makeProject({
//   scenes: [deadcode, ctorcopy, ctorinit, magic, deadcode2, dtor, repo],
// });

//////////////////////////////////////////////////////////////////////////////////////////

// import begin from './scenes/clangformat/begin?scene';

// export default makeProject({
//   scenes: [begin],
// });

//////////////////////////////////////////////////////////////////////////////////////////

import thread from './scenes/threadfastpimpl/thread?scene';
import thread_code from './scenes/threadfastpimpl/thread_code?scene';
import impl from './scenes/threadfastpimpl/impl?scene';
import impl_histogramm from './scenes/threadfastpimpl/impl_histogramm?scene';

export default makeProject({
  scenes: [thread, thread_code, impl, impl_histogramm],
});
