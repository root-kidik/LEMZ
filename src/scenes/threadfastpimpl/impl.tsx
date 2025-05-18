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
// include/ITaskExecuter.hpp

#include <stdssr/Interrogation.h>

class ITaskExecuter
{
public:
    virtual ~ITaskExecuter() = default;

    virtual void load(const std::vector<stdssr::Interrogation>& programs) = 0;
};

// include/TaskExecuter.hpp

#include <RliStreamParser/types.h>

class TaskExecuter final : public ITaskExecuter, public IReplyConsumer, private boost::noncopyable
{
public:
    void load(const std::vector<stdssr::Interrogation>& programs) override;
    void addReply(const stdssr::SsrReply & reply) override;
};`, animationTime);

    yield* beginSlide("interface");

    yield* code().selection(lines(3, 10), animationTime)

    yield* beginSlide("stdssr");

    yield* code().selection(lines(2), animationTime)

    yield* beginSlide("implementation");

    yield* code().selection(lines(15, 21), animationTime)

    yield* beginSlide("RliStreamParser");

    yield* code().selection(lines(14), animationTime)

    yield* beginSlide("Default");

    yield* code().selection(DEFAULT, animationTime)

    yield* beginSlide("Factory");

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
// include/ITaskExecuter.hpp

#include <stdssr/Interrogation.h>

class ITaskExecuter
{
public:
    virtual ~ITaskExecuter() = default;

    virtual void load(const std::vector<stdssr::Interrogation>& programs) = 0;
};

// include/Factory.hpp

#include <fpga_router/ITaskExecuter.hpp>

std::shared_ptr<ITaskExecuter> makeTaskExecuter();

// src/Factory.cpp

#include <fpga_router/TaskExecuterImpl.hpp>

std::shared_ptr<ITaskExecuter> makeTaskExecuter()
{
    return std::make_shared<TaskExecuterImpl>();
}
`, animationTime)
    )

    yield* beginSlide("Factory 2");

    yield* code().selection(lines(14, 18), animationTime);
    
    yield* beginSlide("Factory 3");

    yield* code().selection(lines(20), animationTime);

    yield* beginSlide("Factory 4");

    yield* code().selection(lines(21, 25), animationTime);

    yield* beginSlide("Pimpl");

    yield* all(
        code().selection(lines(14, 24), animationTime),
        code().code(`\
// include/ITaskExecuter.hpp

#include <stdssr/Interrogation.h>

class ITaskExecuter
{
public:
    virtual ~ITaskExecuter() = default;

    virtual void load(const std::vector<stdssr::Interrogation>& programs) = 0;
};

// include/TaskExecuter.hpp

class TaskExecuter final : public ITaskExecuter, private boost::noncopyable
{
public:
    TaskExecuter();
    ~TaskExecuter() override;

    void load(const std::vector<stdssr::Interrogation>& programs) override;

private:
    std::unique_ptr<class TaskExecuterImpl> m_impl; 
};`, animationTime)
    )

    yield* beginSlide("Pimpl 2");

    yield* code().selection(lines(23), animationTime)

    yield* beginSlide("Pimpl 3");

    yield* code().selection(lines(17, 18), animationTime)

    yield* beginSlide("src");

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
// src/TaskExecuter.hpp

#include <fpga_router/TaskExecuterImpl.hpp>

TaskExecuter::TaskExecuter() = default;

TaskExecuter::~TaskExecuter() = default;

void TaskExecuter::load(const std::vector<stdssr::Interrogation>& programs)
{
    m_impl->load(programs);
}`, animationTime)
    )

    yield* beginSlide("src 1");

    yield* code().selection(lines(2), animationTime)

    yield* beginSlide("src 2");

    yield* code().selection(lines(4, 6), animationTime)

    yield* beginSlide("src 3");

    yield* code().selection(lines(8, 11), animationTime)

    yield* beginSlide("Fast Pimpl");

    yield* all(
        code().selection(lines(14, 27), animationTime),
        code().code(`\
// include/ITaskExecuter.hpp

#include <stdssr/Interrogation.h>

class ITaskExecuter
{
public:
    virtual ~ITaskExecuter() = default;

    virtual void load(const std::vector<stdssr::Interrogation>& programs) = 0;
};

// include/TaskExecuter.hpp

class TaskExecuter final : public ITaskExecuter, private boost::noncopyable
{
public:
    TaskExecuter();
    ~TaskExecuter() override;

    void load(const std::vector<stdssr::Interrogation>& programs) override;

private:
    static constexpr std::size_t kSize      = 8;
    static constexpr std::size_t kAlignment = 8;

    core::FastPimpl<class TaskExecuterImpl, kSize, kAlignment> m_impl;
};`, animationTime)
    )

    yield* beginSlide("FastPimpl 2");

    yield* code().selection(lines(23, 26), animationTime)

    yield* beginSlide("Fast Pimpl SOURCE");

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
template <class T, std::size_t Size, std::size_t Alignment, bool Strict = false>
class FastPimpl final
{
public:
    // ...

private:
    template <std::size_t ActualSize, std::size_t ActualAlignment>
    static void validate() noexcept
    {
        static_assert(Size >= ActualSize, 
            "invalid Size: Size >= sizeof(T) failed");
        
        static_assert(Alignment % ActualAlignment == 0, 
            "invalid Alignment: Alignment % alignof(T) == 0 failed");
    }

    alignas(Alignment) std::array<std::byte, Size> m_storage;

    T* asHeld() noexcept
    {
        // NOLINTNEXTLINE(cppcoreguidelines-pro-type-reinterpret-cast)
        return reinterpret_cast<T*>(&m_storage);
    }
};`, animationTime)
    )

    yield* beginSlide("fp 1");

    yield* code().selection(lines(0), animationTime)

    yield* beginSlide("fp 2");

    yield* code().selection(lines(7, 16), animationTime)

    yield* beginSlide("fp 3");

    yield* code().selection(lines(17), animationTime)

    yield* beginSlide("fp 4");

    yield* code().selection(lines(19, 23), animationTime)

    yield* beginSlide("Fast Pimpl SOURCE 2");

    yield* all(
        code().selection(DEFAULT, animationTime),
        code().code(`\
template <class T, std::size_t Size, std::size_t Alignment, bool Strict = false>
class FastPimpl final
{
public:
    template <typename... Args>
    explicit FastPimpl(Args&&... args) noexcept(noexcept(T(std::declval<Args>()...)))
    {
        ::new (asHeld()) T(std::forward<Args>(args)...);
    }

    T* operator->() noexcept
    {
        return asHeld();
    }

    ~FastPimpl() noexcept
    {
        validate<sizeof(T), alignof(T)>();
        asHeld()->~T();
    }

private:
    // ...
};`, animationTime)
    )

    yield* beginSlide("fq 1");

    yield* code().selection(lines(4, 5), animationTime)

    yield* beginSlide("fq 2");

    yield* code().selection(lines(6, 8), animationTime)

    yield* beginSlide("fq 3");

    yield* code().selection(lines(10, 13), animationTime)

    yield* beginSlide("fq 4");

    yield* code().selection(lines(14, 19), animationTime)

    yield* beginSlide("final");
})