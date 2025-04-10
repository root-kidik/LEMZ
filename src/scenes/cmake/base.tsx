import { CODE, Code, lines, makeScene2D, word } from '@motion-canvas/2d';
import { Vscode } from '../../components/Vscode';
import { all, beginSlide, createRef, createSignal, DEFAULT } from '@motion-canvas/core';
import { createFile } from '../../components/Utils';
import { Library } from '../../components/Library';
import { animationTime, paddingBig } from '../../theme/Theme';
import { MyRect } from '../../components/My/MyRect';
import { Console } from '../../components/Console';

const rootCmake = CODE`\
cmake_minimum_required(VERSION 3.25)

project(Math)

add_library(\${PROJECT_NAME} Math.cpp)`;

const mathCppCode = CODE`\
int sum(int a, int b)
{
    return a + b;
}`;

const cmakeConfigureOutput = ["The C compiler identification is GNU 13.3.0",
    "The CXX compiler identification is GNU 13.3.0",
    "Detecting C compiler ABI info",
    "Detecting C compiler ABI info - done",
    "Check for working C compiler: /usr/bin/cc",
    "Detecting C compile features",
    "Detecting C compile features - done",
    "Detecting CXX compiler ABI info",
    "Detecting CXX compiler ABI info - done",
    "Check for working CXX compiler: /usr/bin/c++",
    "Detecting CXX compile features",
    "Detecting CXX compile features - done",
    "Configuring done (0.3s)",
    "Generating done (0.0s)",
    "Build written to: /home/user/math/build"];

const cmakeBuildOutput = [
"[ 50%] Building CXX object Math.cpp.o",
"[100%] Linking CXX static library libMath.a",
"[100%] Built target Math"]

export default makeScene2D(function* (view) {
    const math_cpp = createFile("Math.cpp");

    const root = createFile("");

    root().add(math_cpp());

    const code_layout_ref = createRef<MyRect>();
    const code = createRef<Code>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* beginSlide("Открываем боковую панель");

    const filebar = createRef<MyRect>();

    yield* all(
        vscode().showFilebar(filebar, root),
        code().code(mathCppCode, animationTime)
    );

    yield* beginSlide("Показываем консоль");

    const console = createRef<Console>();
    yield* vscode().showConsole(console);

    yield* console().terminal().prompt();
    yield* console().terminal().type("g++ -c Math.cpp -o Math.o");
    yield* console().terminal().prompt();
    yield* root().addFile(createFile("Math.o"));

    yield* beginSlide("Комманда для запаковки в статическую либу");

    yield* console().terminal().type("ar r libMath.a Math.o");
    yield* console().terminal().prompt();
    yield* root().addFile(createFile("libMath.a"));

    yield* beginSlide("Показываем какие символы внутри либы");

    yield* console().terminal().type("nm libMath.a");
    
    yield* console().terminal().output([
        "",
        "Math.o",
        "0000000000000000 T _Z3sumii"
    ])

    yield* beginSlide("Дабавляем CMakeLists.txt");

    yield* console().terminal().type("rm Math.o libMath.a");
    yield* console().terminal().prompt();

    root().children().pop();
    root().children().pop();

    yield* console().terminal().clear();
    const root_cmake = createFile("CMakeLists.txt");
    yield* root().addFile(root_cmake);

    yield* all(
        root().highlight(root_cmake()),
        code_layout_ref().padding(paddingBig, animationTime),
        code().code(rootCmake, animationTime)
    );

    yield* beginSlide("cmake_minimum_required");

    yield* code().selection(lines(0), animationTime);

    yield* beginSlide("project");

    yield* code().selection(lines(2), animationTime);
    
    yield* beginSlide("add_library");

    yield* code().selection(lines(4), animationTime);

    code().save();
    yield* code().code.replace(word(4, 12, 15), "Math", animationTime);

    yield* beginSlide("${PROJECT_NAME} -> Math");

    yield* code().restore(animationTime);

    yield* code().selection(DEFAULT, animationTime);

    yield* beginSlide("Добавляем отображение библиотеки");

    const animation_layout = vscode().addAnimationLayout();

    const library = createSignal(<Library name={"Math"} /> as Library);

    animation_layout().add(library());
    yield* all(
        animation_layout().appear(),
        library().appear(),
    );

    yield* beginSlide("cmake -B build -S .");

    yield* console().terminal().type("cmake -B build -S .");

    yield* beginSlide("Вывод конфигурации CMake");

    const build = createFile("build");
    const buildMakefile = createFile("Makefile");

    yield* all(
        console().terminal().output(cmakeConfigureOutput, "-- "),
        build().addFile(buildMakefile),
        root().addFile(build)
    );

    yield* beginSlide("cmake --build build --parallel $(nproc)");

    yield* console().terminal().type("cmake --build build --parallel $(nproc)");

    yield* beginSlide("Вывод сборки CMake");

    const buildLibrary = createFile("libMath.a");

    yield* all(
        console().terminal().output(cmakeBuildOutput, "-- "),
        build().addFile(buildLibrary)
    );

    yield* beginSlide("Конец");
});
