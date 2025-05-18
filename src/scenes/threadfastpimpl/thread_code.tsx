import { all, beginSlide, createRef, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { MyCode } from "../../components/My/MyCode";
import { MyRect } from "../../components/My/MyRect";
import { Vscode } from "../../components/Vscode";
import { lines, makeScene2D, word } from "@motion-canvas/2d";
import { Console } from "../../components/Console";
import { animationTime } from "../../theme/Theme";

export default makeScene2D(function* (view) {
    const code_layout_ref = createRef<MyRect>();
    const code = createRef<MyCode>();
    const vscode = createRef<Vscode>();

    view.add(
        <Vscode ref={vscode} code={code} code_layout={code_layout_ref} />
    );

    yield* slideTransition(Direction.Right, animationTime);

    yield* code().code(`\
class Thread final : private boost::noncopyable
{
public:
    template <typename Callable, typename... Args>
    Thread(std::string&& name, Callable&& fn, Args&&... args)
        : m_thread{[name       = std::move(name),
                    fn         = std::forward<Callable>(fn),
                    args_tuple = std::make_tuple(std::forward<Args>(args)...)]()
                   {
                       setAffinity();
                       setName(name);
                       std::apply(fn, args_tuple);
                   }}
    {
    }

    ~Thread();

private:
    std::thread m_thread;

    static void setName(const std::string& name);
    static void setAffinity();
};`, animationTime);

    yield* beginSlide("final");

    yield* code().selection(word(0, 0, 18), animationTime)

    yield* beginSlide("boost");

    yield* code().selection(word(0, 20, 28), animationTime)

    yield* beginSlide("ctor");

    yield* code().selection(lines(3, 4), animationTime)

    yield* beginSlide("m_thread");

    yield* code().selection(lines(19), animationTime)

    yield* beginSlide("m_thread init");

    yield* code().selection(lines(5, 12), animationTime)

    yield* beginSlide("affinity");

    yield* code().selection(lines(9), animationTime)

    yield* beginSlide("thread name");

    yield* code().selection(lines(10), animationTime)

    yield* beginSlide("call");

    yield* code().selection(lines(11), animationTime)

    yield* beginSlide("SetAffinity");

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
void Thread::setAffinity()
{
    static std::atomic<std::uint8_t> core_id = 0;

    const std::uint8_t local_core_id = core_id.fetch_add(1) % kHardwareConcurrency;

    cpu_set_t cpuset;
    CPU_ZERO(&cpuset);
    CPU_SET(local_core_id, &cpuset);

    if (pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset) != 0)
    {
        throw std::runtime_error("can't set thread affinity");
    }
}` ,animationTime)
    );

    yield* beginSlide("core_id")

    yield* code().selection(lines(2), animationTime)

    yield* beginSlide("local_core_id")

    yield* code().selection(lines(4), animationTime)

    yield* beginSlide("CPU_SET")

    yield* code().selection(lines(6, 8), animationTime)

    yield* beginSlide("setaffinity")

    yield* code().selection(word(10, 8, 67), animationTime)

    yield* beginSlide("throw aff")

    yield* code().selection(lines(10, 13), animationTime)

    yield* beginSlide("setName")

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
void Thread::setName(const std::string& name)
{
    assert(name.size() <= kThreadNameMaxLen - 1 && "thread name too long");

    if (pthread_setname_np(pthread_self(), name.data()) != 0)
    {
        throw std::runtime_error("can't set name to thread");
    }
}`,animationTime)
    )

    yield* beginSlide("name assert")

    yield* code().selection(lines(2), animationTime)

    yield* beginSlide("set name")

    yield* code().selection(word(4, 8, 48), animationTime)

    yield* beginSlide("exception")

    yield* code().selection(lines(4, 7), animationTime)

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
Thread::~Thread()
{
    assert(m_thread.joinable() && "thread must be joinable");
    m_thread.join();
}`,animationTime)
    )

    yield* beginSlide("Dtor")

    yield* code().selection(lines(2), animationTime)

    yield* beginSlide("join")

    yield* code().selection(lines(3), animationTime)

    yield* beginSlide("Открываем консоль");
});
