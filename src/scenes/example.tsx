import { Code, makeScene2D } from '@motion-canvas/2d';
import { FilebarEntry, Filebar } from '../components/Filebar';
import { Vscode } from '../components/Vscode';
import { beginSlide, createRef } from '@motion-canvas/core';

const entries: FilebarEntry[] = [
  {
    name: "include", childrens: [
      { name: "math", childrens: [
          { name: "Hello.hpp" }
        ] 
      },
    ]
  },
  {
    name: "src", childrens: [
      { name: "math", childrens: [
          { name: "Hello.cpp" },
          { name: "CMakeLists.txt" },
        ] 
      },
    ]
  },
  { name: "CMakeLists.txt" },
];

export default makeScene2D(function* (view) {
  const filebar = createRef<Filebar>();
  const code = createRef<Code>();

  view.add(
      <Vscode code_ref={code} filebar_ref={filebar} filebar_props={{entries: entries}} />
  );

  yield* beginSlide('1');
  yield* filebar().setFolderOpenByPath('src', false, 0.5);

  yield* beginSlide('3');
  yield* filebar().setFolderOpenByPath('src', true, 0.5);

  yield* beginSlide('4');
  yield* filebar().highlightEntryByPath("src/math/CMakeLists.txt", 1);

  yield* beginSlide('5');
  yield* filebar().highlightEntryByPath("CMakeLists.txt", 1);

  yield* beginSlide('6');
  yield* filebar().resetHighlight(1);

});

// 
