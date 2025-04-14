import { CODE, lines, lineTo, makeScene2D } from "@motion-canvas/2d";
import { createFile } from "../../components/Utils";
import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { MyRect } from "../../components/My/MyRect";
import { MyCode } from "../../components/My/MyCode";
import { Vscode } from "../../components/Vscode";
import { animationTime } from "../../theme/Theme";

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

const JenkinsfileCodeOptionsAgent = CODE`\
pipeline {
    agent none
    options {
        gitLabConnection("GitLab API")
    }
}`;

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

const JenkinsfileCodeAgent = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {...}
                    axis {...}
                }
                agent {
                    dockerfile {
                        label "docker-native"
                        filename "\${os}.Dockerfile"
                        dir "docker"
                        args "-u root"
                    }
                }
            }
        }
    }
}`;

const JenkinsfileCodeStagesConfigure = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {...}
                    axis {...}
                }
                agent {...}
                stages {
                    stage("configure") {
                        steps {
                            sh "make cmake-\${build_type}"
                        }
                    }
                }
            }
        }
    }
}`;

const JenkinsfileCodeStagesBuild = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {...}
                    axis {...}
                }
                agent {...}
                stages {
                    stage("configure") {...}
                    stage("build") {
                        steps {
                            sh "make build-\${build_type}"
                        }
                    }
                }
            }
        }
    }
}`;

const JenkinsfileCodeStagesTest = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {...}
                    axis {...}
                }
                agent {...}
                stages {
                    stage("configure") {...}
                    stage("build") {...}
                    stage("test") {
                        steps {
                            sh "make test-\${build_type}"
                            junit "build-\${build_type}/junit.xml"
                        }
                    }
                }
            }
        }
    }
}`;

const JenkinsfileCodeStagesClear = CODE`\
pipeline {
    agent none
    options {...}

    stages {
        stage("Build And Test") {
            matrix {
                axes {
                    axis {...}
                    axis {...}
                }
                agent {...}
                stages {
                    stage("configure") {...}
                    stage("build") {...}
                    stage("test") {...}
                }
                post {
                    always {
                        cleanWs()
                    }
                }
            }
        }
    }
}`;


export default makeScene2D(function* (view) {
    const libs = createFile("libs");
    const math = createFile("Math");
    const cmake_math = createFile("CMakeLists.txt");
    const math_cpp = createFile("Math.cpp");
    const math_cmake_presets = createFile("CMakePresets.json");

    libs().add(math());
    math().add(cmake_math());
    math().add(math_cpp());
    math().add(math_cmake_presets());

    const main_cpp = createFile("Main.cpp");
    const root_cmake_presets = createFile("CMakePresets.json");
    const cmake_root = createFile("CMakeLists.txt");

    const root = createFile("");

    root().add(libs());
    root().add(main_cpp());
    root().add(cmake_root());
    root().add(root_cmake_presets());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, 0)
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Добавляем Makefile");

    const makefile = createFile("Makefile");

    yield* all(
        root().addFile(makefile),
        code().code(MakefileCode, animationTime)
    );

    yield* beginSlide("Задаём Presets");

    yield* code().selection(lines(0), animationTime);

    yield* beginSlide("Подстановка");

    yield* code().selection(lines(2), animationTime);

    yield* beginSlide("Пример подстановки");

    code().save();

    yield* code().code.replace(lines(2), ".PHONY: cmake-debug cmake-release\n", animationTime);

    yield* beginSlide("Пример подстановки заканчиваем");

    yield* all(
        code().restore(animationTime),
        code().selection(lines(4), animationTime)
    );

    yield* beginSlide("Makefile сборка");

    yield* code().selection(lines(8), animationTime);

    yield* beginSlide("Тест");

    yield* code().selection(lines(12), animationTime);

    yield* beginSlide("Добавляем Jenkinsfile");

    const jenkinsfile = createFile("Jenkinsfile");

    yield* all(
        root().addFile(jenkinsfile),
        code().code(JenkinsfileCodeOptionsAgent, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Оси матрицы");

    yield* all(
        code().code(JenkinsfileCodeAxes, animationTime),
        code().selection(lines(7, 16), animationTime)
    );

    yield* beginSlide("Агент матрицы");

    yield* all(
        code().code(JenkinsfileCodeAgent, animationTime),
        code().selection(lines(11, 18), animationTime)
    );

    yield* beginSlide("Стадия configure");

    yield* all(
        code().code(JenkinsfileCodeStagesConfigure, animationTime),
        code().selection(lines(13, 17), animationTime)
    );

    yield* beginSlide("Стадия build");

    yield* all(
        code().code(JenkinsfileCodeStagesBuild, animationTime),
        code().selection(lines(14, 18), animationTime)
    );

    yield* beginSlide("Стадия test");

    yield* all(
        code().code(JenkinsfileCodeStagesTest, animationTime),
        code().selection(lines(15, 20), animationTime)
    );

    yield* beginSlide("Стадия clear");

    yield* all(
        code().code(JenkinsfileCodeStagesClear, animationTime),
        code().selection(lines(17, 21), animationTime)
    );

    yield* beginSlide("Конец");
});