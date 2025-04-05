import {makeProject} from '@motion-canvas/core';

import base from './scenes/base?scene';
import usage from './scenes/usage?scene';

import { Code, LezerHighlighter } from "@motion-canvas/2d";
import { parser } from "@lezer/cpp";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

import "./global.css";

Code.defaultHighlighter = new LezerHighlighter(
  parser,
  (tokyoNight as any)[1][2].value,
);

export default makeProject({
  scenes: [base, usage],
});
