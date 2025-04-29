import { CODE, lines, makeScene2D, word } from "@motion-canvas/2d";
import { Vscode } from "../../components/Vscode";
import { all, AudioManager, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Console } from "../../components/Console";
import { animationTime, colorBlue, colorRed } from "../../theme/Theme";
import { createFile } from "../../components/Utils";

const mainCppCode1 = CODE`\
#include <nanomsg/nn.h>
#include <nanomsg/pipeline.h>
#include <nanomsg/pubsub.h>

#include <cassert>
#include <thread>
#include <string>
#include <atomic>
#include <csignal>

#include <unistd.h>

int main()
{
}`;

const mainCppCode2 = CODE`\
// #include ...

int main()
{
    sigset_t set;
    sigemptyset(&set);
    sigaddset(&set, SIGINT);
    pthread_sigmask(SIG_BLOCK, &set, NULL);

    // CODE

    int sig;
    sigwait(&set, &sig);
}`;

const mainCppCode3 = CODE`\
// #include ...

int main()
{
    // SIGINT BLOCK

    auto producer_socket = nn_socket(AF_SP, NN_PUB);
    nn_bind(producer_socket, "tcp://127.0.0.1:50007");
    int  timeout           = 100;
    nn_setsockopt(producer_socket, NN_SOL_SOCKET, 
                  NN_SNDTIMEO, &timeout, sizeof(timeout));

    // SIGINT WAIT

    nn_close(producer_socket);
}`;


const mainCppCode4 = CODE`\
// #include ...

int main()
{
    // SIGINT BLOCK
    // PRODUCER SOCKET 50007

    std::atomic<bool> is_running{true};

    std::thread consumer{[&is_running, &producer_socket](){
            auto consumer_socket = nn_socket(AF_SP, NN_SUB);
            nn_connect(consumer_socket, "tcp://127.0.0.1:49007");
            nn_setsockopt(consumer_socket, NN_SUB, NN_SUB_SUBSCRIBE, "", 0);
            while (is_running) {
                void* buffer = nullptr;
                auto  len    = nn_recv(consumer_socket, &buffer, NN_MSG, 0);
                if (len < 0) continue;
                nn_send(producer_socket, buffer, len, 0);
                nn_freemsg(buffer);
            }
            nn_close(consumer_socket);
    }};

    // SIGINT WAIT
    is_running = false;
    consumer.join();
    nn_close(producer_socket);
}`;

export default makeScene2D(function* (view) {
    const root = createFile("");

    const main_cpp = createFile("Main.cpp");

    root().add(main_cpp());

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
        code().code(mainCppCode1, animationTime),
        root().highlight(main_cpp(), animationTime),
    );

    yield* beginSlide("Ждём SIGINT");

    yield* code().code(mainCppCode2, animationTime);

    yield* beginSlide("pthread_sigmask");

    yield* code().selection(lines(6), animationTime);
    yield* code().selection(lines(7), animationTime);

    yield* beginSlide("wait");

    yield* code().selection(lines(12), animationTime);

    yield* beginSlide("Producer");

    yield* all(
        code().code(mainCppCode3, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Pub");

    yield* all(
        code().selection(lines(6), animationTime),
    );

    yield* beginSlide("Url");

    yield* all(
        code().selection(lines(7), animationTime),
    );

    yield* beginSlide("Timeout");

    yield* all(
        code().selection(lines(9, 10), animationTime),
    );

    yield* beginSlide("Consumer");

    yield* all(
        code().code(mainCppCode4, animationTime),
        code().selection(DEFAULT, animationTime)
    );

    yield* beginSlide("Sub");

    yield* all(
        code().selection(lines(10), animationTime),
    );

    yield* beginSlide("Connect");

    yield* all(
        code().selection(lines(11), animationTime),
    );

    yield* beginSlide("Recv");

    yield* all(
        code().selection(lines(15), animationTime),
    );

    yield* beginSlide("Snd");

    yield* all(
        code().selection(lines(17), animationTime),
    );

    yield* beginSlide("Default");

    yield* code().selection(DEFAULT, animationTime);
});
