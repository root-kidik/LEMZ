import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition, waitFor } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorGreen, colorRed, colorWhiteBlue } from "../../theme/Theme";
import { createFile } from "../../components/Utils";

const devcontainer_code = CODE`\
{
    "name": "Lemz",
    "build": {
        "dockerfile": "../docker/astra-se1.7.Dockerfile",
        "options": [
            "--network=host"
        ]
    },
    "runArgs": [
        "--privileged",
        "--network=host",
        "--env=DISPLAY=\${localEnv:DISPLAY}",
        "--volume=/tmp/.X11-unix:/tmp/.X11-unix",
        "--volume=/dev:/dev"
    ]
}`;

const devcontainer_code_vscode = CODE`\
{
    "name": "Lemz",
    "build": {...},
    "runArgs": [...],
    "customizations": {
        "vscode": {
            "extensions": [
                "llvm-vs-code-extensions.vscode-clangd",
                "ms-vscode.cmake-tools",
                "ms-vscode.cpptools",
                "twxs.cmake"
            ],
            "settings": {
                "cmake.copyCmpCommands": ".vscode/compile_commands.json",
                "clangd.path": "/usr/bin/clangd",
                "clangd.arguments": [
                    "--background-index",
                    "--compile-commands-dir=.vscode",
                    "--clang-tidy",
                    "--completion-style=detailed",
                    "--header-insertion=never"
                ]
            }
        }
    }
}`;

const devcontainer_code_vscode_min = CODE`\
{
    "name": "Lemz",
    "build": {...},
    "runArgs": [...],
    "customizations": {"vscode": ...}
}`;


const main_cpp_code = CODE`\
#include <cassert>
#include <csignal>
#include <cstdio>
#include <string>
#include <unistd.h>

#include <Service.hpp>

int main(int argc, char* argv[])
{
    std::string config_path{argv[1]};

    sigset_t set;
    int      sig;
    sigemptyset(&set);
    sigaddset(&set, SIGINT);
    pthread_sigmask(SIG_BLOCK, &set, NULL);

    fpga_router::infrastructure::Service service{
        YAML::LoadFile(config_path)
    };

    sigwait(&set, &sig);
}`;

const dockerfile_code = CODE`\
FROM dockerhub.lemz.t/library/astralinux:se1.7

RUN rm /etc/apt/preferences.d/smolensk                            && \\
    echo "deb http://.../astra/smolensk1.7 smolensk main" >> /... && \\
    echo "deb http://.../any/stable stable main" >> /etc/...      && \\
    apt-get -y update                                             && \\
    apt-get -y upgrade                                            && \\
    apt-get -y install                                               \\
    libgtest-dev                                                     \\
    libgmock-dev                                                     \\
    libyaml-cpp-dev                                                  \\
    pkg-config                                                       \\
    ninja-build                                                      \\
    libnanomsg-dev                                                   \\
    libfmt-dev=6.1.2+ds-2                                            \\
    g++                                                              \\
    libcurl4-openssl-dev                                             \\
    cmake                                                            \\
    git                                                              \\
    python3                                                          \\
    clangd                                                           \\
    gdb                                                              \\
    python3-pip                                                   && \\
    python3 -m pip install yandex-taxi-testsuite nanomsg          && \\
    apt-get -y autoremove                                         && \\
    apt-get -y autoclean                                          && \\
    rm -rf /var/lib/apt/lists/*`;

export default makeScene2D(function* (view) {
    const root = createFile("");

    const cmakelists = createFile("CMakeLists.txt");
    const cmake_presets = createFile("CMakePresets.json");
    const makefile = createFile("Makefile");

    root().add(cmakelists());
    root().add(cmake_presets());
    root().add(makefile());

    const src = createFile("src");
    const main_cpp = createFile("Main.cpp");
    const cmake_lists_src = createFile("CMakeLists.txt");
    src().add(cmake_lists_src());
    src().add(main_cpp());
    root().add(src());

    const pipeline = createFile("pipeline");
    const jenkinsfile = createFile("Jenkinsfile");
    pipeline().add(jenkinsfile());
    root().add(pipeline());

    const test = createFile("test");
    root().add(test());

    const integration = createFile("integration");
    const init_py = createFile("__init__.py");
    const test_rli = createFile("test_rli_stream.py");
    const pytest_ini = createFile("pytest.ini");
    const conftest = createFile("conftest.py");
    integration().add(conftest());
    integration().add(pytest_ini());
    integration().add(test_rli());
    integration().add(init_py());
    test().add(integration());

    const unit = createFile("unit");
    const test_rli_unit = createFile("test_rli_stream.cpp");
    const cmake_lists_unit = createFile("CMakeLists.txt");
    unit().add(cmake_lists_unit());
    unit().add(test_rli_unit());
    test().add(unit());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right);

    yield* beginSlide("Начало");

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root, animationTime),
        code().code(main_cpp_code, animationTime),
        root().highlight(main_cpp(), animationTime),
    );

    yield* beginSlide("Конфиг");

    yield* code().selection(lines(10), animationTime);

    yield* beginSlide("SigBlock");

    yield* code().selection(lines(12, 16), animationTime);

    yield* beginSlide("Сервис");

    yield* code().selection(lines(18, 20), animationTime);

    yield* beginSlide("Ждём SIGINT");

    yield* code().selection(lines(22), animationTime);

    yield* beginSlide("unhiglight");

    yield* all(
        code().selection(DEFAULT, animationTime),
        root().unhighlight()
    );

    yield* beginSlide("close unit and integration");

    yield* all(
        integration().closeFolder(),
        unit().closeFolder(),
        pipeline().closeFolder()
    );

    yield* beginSlide("docker also exists");

    const docker = createFile("docker");
    yield* root().addFile(docker);

    const astra17 = createFile("astra-se1.7.Dockerfile");
    
    yield* all(
        docker().addFile(astra17),
        code().code(dockerfile_code, animationTime)
    );

    yield* beginSlide("add devcontainer");

    const devcontainer = createFile(".devcontainer");
    yield* root().addFile(devcontainer);

    const devcontainer_json = createFile("devcontainer.json");
    
    yield* all(
        devcontainer().addFile(devcontainer_json),
        code().code(devcontainer_code, animationTime)
    );

    yield* beginSlide("name");

    yield* code().selection(lines(1), animationTime);

    yield* beginSlide("dockerfile");

    yield* code().selection(lines(3), animationTime);

    yield* beginSlide("options");

    yield* code().selection(lines(4, 6), animationTime);

    yield* beginSlide("priviliged");

    yield* code().selection(lines(9), animationTime);

    yield* beginSlide("host");

    yield* code().selection(lines(10), animationTime);

    yield* beginSlide("display");

    yield* code().selection(lines(11), animationTime);

    yield* beginSlide("xorg");

    yield* code().selection(lines(12), animationTime);

    yield* beginSlide("dev devices");

    yield* code().selection(lines(13), animationTime);

    yield* beginSlide("vscode");

    yield* all(
        code().code(devcontainer_code_vscode, animationTime),
        code().selection(lines(4, 24), animationTime)
    );

    yield* beginSlide("extensions");

    yield* code().selection(lines(6, 11), animationTime);

    yield* beginSlide("settings");

    yield* code().selection(lines(12, 22), animationTime);

    yield* beginSlide("inside docker");

    yield* all(
        root().unhighlight(animationTime),
        code().selection(DEFAULT, animationTime),
        filebar().stroke(colorWhiteBlue, animationTime),
        code_layout_ref().stroke(colorWhiteBlue, animationTime),
        code().code(devcontainer_code_vscode_min, animationTime)
    );

    yield* beginSlide("open console");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);
    yield* console().stroke(colorWhiteBlue, animationTime);
    yield* console().terminal().prompt();

    yield* beginSlide("grep /etc/os-release");

    yield* console().terminal().type("grep NAME /etc/os-release");

    yield* beginSlide("grep /etc/os-release run");

    yield* console().terminal().output([
        'PRETTY_NAME="Astra Linux"',
        'NAME="Astra Linux"',
        'VERSION_CODENAME=1.7_x86-64',
    ]);

    yield* beginSlide("Конец");
});
