import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { MyCode } from "../../components/My/MyCode";
import { Vscode } from "../../components/Vscode";
import { createFile } from "../../components/Utils";
import { Console } from "../../components/Console";
import { animationTime } from "../../theme/Theme";

const cmakepPresetsCode = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        {
            "name": "debug",
            "inherits": [ "common-flags" ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Debug" }
        },
        {
            "name": "release",
            "inherits": [ "common-flags" ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Release" }
        },
    ]
}`;

const cmakepPresetsCodeDebugAsanUbsan = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        {"name": "debug" ...},
        {"name": "release" ...},
        {
            "name": "debug-asan-ubsan",
            "displayName": "Debug Asan UBsan",
            "inherits": [ "common-flags", "asan-ubsan-flags" ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Debug" }
        },
        {
            "name": "release-asan-ubsan",
            "displayName": "Release Asan UBsan",
            "inherits": [ "common-flags", "asan-ubsan-flags" ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Release" }
        },
    ]
}`;

const cmakepPresetsCodeDebugAsanUbsanFlags = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        {"name": "debug" ...},
        {"name": "release" ...},
        {"name": "debug-asan-ubsan" ...},
        {"name": "release-asan-ubsan" ...},
        {
            "name": "asan-ubsan-flags",
            "hidden": true,
            "cacheVariables": {
                "CMAKE_CXX_FLAGS": "-fsanitize=address 
                                    -fsanitize=undefined 
                                    -fno-omit-frame-pointer 
                                    -D_GLIBCXX_ASSERTIONS"
            }
        },
    ]
}`;

const cmakepPresetsCodeDebugTsan = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        {"name": "debug" ...},
        {"name": "release" ...},
        {"name": "debug-asan-ubsan" ...},
        {"name": "release-asan-ubsan" ...},
        {"name": "asan-ubsan-flags" ...},
        {
            "name": "debug-tsan",
            "displayName": "Debug Tsan",
            "inherits": [ "common-flags", "tsan-flags" ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Debug" }
        },
        {
            "name": "release-tsan",
            "displayName": "Release Tsan",
            "inherits": [ "common-flags", "tsan-flags" ],
            "binaryDir": "\${sourceDir}/build-\${presetName}",
            "cacheVariables": { "CMAKE_BUILD_TYPE": "Release" }
        },
    ]
}`;

const cmakepPresetsCodeDebugTsanFlags = CODE`\
{
    ..."cmakeMinimumRequired",
    "configurePresets": [
        {"name": "debug" ...},
        {"name": "release" ...},
        {"name": "debug-asan-ubsan" ...},
        {"name": "release-asan-ubsan" ...},
        {"name": "asan-ubsan-flags" ...},
        {"name": "debug-tsan" ...},
        {"name": "release-tsan" ...},
        {
            "name": "tsan-flags",
            "hidden": true,
            "cacheVariables": {
                "CMAKE_CXX_FLAGS": "-fsanitize=thread 
                                    -fno-omit-frame-pointer 
                                    -D_GLIBCXX_ASSERTIONS"
            }
        },
    ]
}`;

const MakefileCode = CODE`\
PRESETS ?= debug release

.PHONY: $(addprefix cmake-, $(PRESETS))
$(addprefix cmake-, $(PRESETS)): cmake-%:
    cmake --preset $*

.PHONY: $(addprefix build-, $(PRESETS))
$(addprefix build-, $(PRESETS)): build-%: cmake-%
    cmake --build --preset $*

.PHONY: $(addprefix test-, $(PRESETS))
$(addprefix test-, $(PRESETS)): test-%: build-%
    ctest --preset $* --output-junit junit.xml -T test --test-dir build-$*

.PHONY: clear
clear:
    rm -rf build*`;

const MakefileCodeNew = CODE`\
PRESETS ?= debug release
           debug-asan-ubsan release-asan-ubsan
           debug-tsan release-tsan

.PHONY: $(addprefix cmake-, $(PRESETS))
$(addprefix cmake-, $(PRESETS)): cmake-%:
    cmake --preset $*

.PHONY: $(addprefix build-, $(PRESETS))
$(addprefix build-, $(PRESETS)): build-%: cmake-%
    cmake --build --preset $*

.PHONY: $(addprefix test-, $(PRESETS))
$(addprefix test-, $(PRESETS)): test-%: build-%
    ctest --preset $* --output-junit junit.xml -T test --test-dir build-$*

.PHONY: clear
clear:
    rm -rf build*`;

const MakefileCodeNewTestAll = CODE`\
PRESETS ?= debug release
           debug-asan-ubsan release-asan-ubsan
           debug-tsan release-tsan

.PHONY: $(addprefix cmake-, $(PRESETS))
$(addprefix cmake-, $(PRESETS)): cmake-%:
    cmake --preset $*

.PHONY: $(addprefix build-, $(PRESETS))
$(addprefix build-, $(PRESETS)): build-%: cmake-%
    cmake --build --preset $*

.PHONY: $(addprefix test-, $(PRESETS))
$(addprefix test-, $(PRESETS)): test-%: build-%
    ctest --preset $* --output-junit junit.xml -T test --test-dir build-$*

.PHONY: test-all
test-all: $(addprefix test-, $(PRESETS))

.PHONY: clear
clear:
    rm -rf build*`;

const JenkinsfileCodeAxes = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {
                        name "build_type"
                        values "debug", "release" 
                    }
                    axis {
                        name "os"
                        values "astra-1.5se", "astra-1.7se" 
                    }
                }
            }
        }
    }
}`;

const JenkinsfileCodeAxesNew = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {
                        name "build_type"
                        values "debug", "release", 
                               "debug-asan-ubsan", "release-asan-ubsan"
                               "debug-tsan", "release-tsan"
                    }
                    axis {
                        name "os"
                        values "astra-1.5se", "astra-1.7se" 
                    }
                }
            }
        }
    }
}`;

export default makeScene2D(function* (view) {
    const main_cpp = createFile("Main.cpp");
    const cmake_root = createFile("CMakeLists.txt");
    const root_cmake_presets = createFile("CMakePresets.json");
    const makefile = createFile("Makefile");
    const jenkinsfile = createFile("Jenkinsfile");

    const root = createFile("");

    root().add(main_cpp());
    root().add(cmake_root());
    root().add(root_cmake_presets());
    root().add(makefile());
    root().add(jenkinsfile());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, 0),
        root().highlight(cmake_root(), 0),
        code().code(cmakepPresetsCode, 0)
    );

    yield* root().highlight(root_cmake_presets(), 0);

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Debug | Release");

    yield* code().selection(lines(3, 14), animationTime);

    yield* beginSlide("Asan Ubsan");

    yield* all(
        code().code(cmakepPresetsCodeDebugAsanUbsan, animationTime),
        code().selection(lines(5, 18), animationTime)
    );

    yield* beginSlide("Asan Ubsan inherit");

    yield* code().selection(word(8, 42, 18), animationTime);
    yield* waitFor(1);
    yield* code().selection(word(15, 42, 18), animationTime);

    yield* beginSlide("Asan Ubsan Flags");

    yield* all(
        code().code(cmakepPresetsCodeDebugAsanUbsanFlags, animationTime),
        code().selection(lines(7, 16), animationTime)
    );

    yield* beginSlide("Tsan");

    yield* all(
        code().code(cmakepPresetsCodeDebugTsan, animationTime),
        code().selection(lines(8, 21), animationTime)
    );

    yield* beginSlide("Tsan inherit");

    yield* code().selection(word(11, 42, 12), animationTime);
    yield* waitFor(1);
    yield* code().selection(word(18, 42, 12), animationTime);

    yield* beginSlide("Tsan Flags");

    yield* all(
        code().code(cmakepPresetsCodeDebugTsanFlags, animationTime),
        code().selection(lines(10, 18), animationTime)
    );

    yield* beginSlide("Makefile");

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(MakefileCode, animationTime),
        root().highlight(makefile())
    );

    yield* beginSlide("New Makefile");

    yield* all(
        code().code(MakefileCodeNew, animationTime),
        code().selection(lines(0, 2), animationTime)
    );

    yield* beginSlide("New Makefile Test All");

    yield* all(
        code().code(MakefileCodeNewTestAll, animationTime),
        code().selection(lines(15, 17), animationTime)
    );

    yield* beginSlide("Jenkinsfile");
    
    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(JenkinsfileCodeAxes, animationTime),
        root().highlight(jenkinsfile())
    );

    yield* beginSlide("New Jenkinsfile");

    yield* all(
        code().code(JenkinsfileCodeAxesNew, animationTime),
        code().selection(lines(8, 13), animationTime)
    );

    yield* beginSlide("Конец");
});
