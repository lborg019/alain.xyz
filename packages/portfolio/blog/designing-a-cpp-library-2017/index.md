C++ was created by Bjarne Stroustrup at Bell Labs, New Jersey in 1983, but has since evolved to become the most ubiquitous high performance language in the world with a focus on *zero overhead abstractions* and *directly mapping your code to hardware instructions*.

The following is an overview of what it takes to create a modern library for C++, one that takes advantage of the latest in the language and ecosystem. We'll focus on:

1. **Module Systems** - Traditionally, packages were managed manually with CMake, however the C++ package manager [Conan](https://conan.io) seems to be gaining traction.

2. **Testing** - Setting up your project for unit testing on continuous integration solutions like Travis CI.

3. **Cross Platform Compilation** - Architect your library to work on Windows, Mac, Linux, Android, iOS, and even platforms like game consoles, and compile binaries for each platform.

4. **Language Features** - A primer on new language features such as modules, move operator overloading, lambdas, smart pointers, etc.

5. **Learning Resources** - Podcasts, talks, books, articles, etc.

## Module Systems

### Distributing with Conan

Conan has the option of letting you manage modules using a `.txt` file similar to Rust crates or Node's `package.json` file, called a `conanfile.txt`.

```
[requires]
glm/0.9.8.0@TimSimpson/testing
vulkan-sdk/1.0.33.0@alaingalvan/testing

[generators]
visual_studio
```

Alternatively you could write your modules as a Python class that extends Conan, and implement functions to help manage the distribution of your library.

```py
from conans import ConanFile
import os

class VulkanSDKConan(ConanFile):

    name = 'vulkan-sdk'
    version = '1.0.37.0'
    description = "The official Vulkan SDK distributed by LunarG."
    author = "Alain Galvan (hi@alain.xyz)"
    license = 'Apache'
    url = 'https://github.com/alaingalvan/conan-vulkan-sdk.git'
    settings = ('os', 'compiler', 'build_type', 'arch')
    exports = '*'

    builddir = ''

    def build(self):
        self.builddir = 'C:/VulkanSDK/' + os.listdir('C:/VulkanSDK/')[0]

    def package(self):
        self.copy(pattern='*', dst='Include/vulkan', src='%s/include' %
                  self.builddir, keep_path=False)

        is_32 = '' if self.settings.arch == 'x86_64' else '32'
        bin_dir = 'Bin%s' % is_32
        if self.settings.build_type == 'Debug':
            bin_dir = 'Source/lib%s' % is_32

        self.copy('*', dst='lib', src='%s/%s' % (self.builddir, bin_dir))
        self.copy('*', dst='bin', src='%s/%s' % (self.builddir, bin_dir))

    def package_info(self):
        self.cpp_info.libs = [
            'vulkan-1',
            'VKstatic.1',
            'VkLayer_utils',
            'VkLayer_unique_objects',
            'VkLayer_threading',
            'VkLayer_swapchain',
            'VkLayer_screenshot',
            'VkLayer_parameter_validation',
            'VkLayer_object_tracker',
            'VkLayer_image',
            'VkLayer_core_validation',
            'VkLayer_api_dump'
        ]
```

Then once you're done, open the command line and type:

```bash
conan export # YourName/stable
conan upload
```

### Testing

Every good library should have Unit Tests, Coverage Tests, and Linting, and every good application should also include Integration tests. The Ruby community brought this philosophy to mainstream programming.

- **Unit Tests** - Test individual blocks of code.
- **Coverage Tests** - Test how much code your unit tests are verifying.
- **Linting** - Format and verify your code is following best practices.
- **Integration Tests** - Verify that all your dependencies work together at the versions your application requires.

#### Unit Tests

Google distributes a powerful testing framework called [GTest](https://github.com/google/googletest).

```bash
conan install gtest
```

To use it:

```cpp
TEST(test_case_name, test_name) {
 
 //... test body ...
 
 auto a = true;
 auto b = true;

 EXPECT_EQ(a, b)
}

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
```

Create a folder called `tests` where they will all be.

Add a tests script to conan to help run your tests:

```py
from conans import ConanFile

class MyLibraryTestConan(ConanFile):
    name = "Tests"
    version = "0.1"
    settings = "os", "compiler", "arch", "build_type"
    generators = "gcc"
    requires = "gtest/1.8.0@lasote/stable"
        
    def build(self):
        cmake = CMake(self.settings)
        self.run('cmake %s %s' % (self.conanfile_directory, cmake.command_line))
        self.run("cmake --build . %s" % cmake.build_config)

    def imports(self):
        self.copy(pattern="*.dll", dst="bin", src="bin")
        self.copy(pattern="*.dylib", dst="bin", src="lib")
        
    def test(self):
        self.run("cd bin && ./test")
```

Then, in your `.travis.yml` file:

```yml
os: linux
language: c++
compiler:
  - gcc
before_install: 
  - sudo apt-get install python3
  - sudo pip3 install conan
script:
  - conan test
```

### Preprocessor Modules

In C++, the current standard of module resolution is the `#import` macro system, which uses the preprocessor step of compilation to manage imports.

Here's how C++ compiles an app:

1. **Preprocessor Step**
  1. C++ takes the main file, and every instance of `#import` actually copy/pastes the thing you're importing to one big program file. Some compilers like clang try to optimize this process and use their own internal module system instead.
  2. The Preprocessor checks any macros.
2. **Compilation Step** - it compiles the source into instructions/references to things it doesn't have.
3. **Linking Step** - it links any references that it doesn't have, if any implementation is missing, then you'll see a `LINKER` error.
4. **Final Step** - bundles it all together.

So modules are currently done using the #include statement, with no clear way of encapsulating and controlling exports.

```cpp
#include "myclass.h"
```

### Modules Proposal

Recently there was a proposal for [C++ modules](http://www.open-std.org/JTC1/SC22/WG21/docs/papers/2015/n4465.pdf), with the semantics similar to Go, Python, Java, etc.

```cpp
import std.io;

// Declare your module like so:
// Every line after that will be considered a part of your module.
module firstapp;

export void helloWorld() {
  iostream << "Hello World!";
}
```

And here's how you would use them:

```cpp
import firstapp;

void main() {
  helloWorld();
}
```

Sadly, there's no intelisense/optmization released yet, and only Visual Studio's compiler supports it on the command line.

> **Call to Action**: Create a [*Babel*](https://babeljs.io/) tool for converting C++ 14, 17, 20 to C++ 11 or below.

## Unit Testing

## Cross Platform Development

If you want to support multiple platforms, then you'll need to use OS specific preprocessor definitions, and check if they're defined by the compiler.

```cpp
#if defined(_WIN32)

  // Perform Windows specific logic

#elif defined(__ANDROID__)

  // Perform Android specific logic

#elif defined(__linux__)

  // Perform Linux specific logic

#endif
```

Building for desktop platforms is simply a matter of running a compiler in their respective OS. This is especially important on Mac since you're required to own one to develop for them.

## New C++ 17 Features

### &lambda; Lambda functions

Lambda functions are unnamed functions, similar to JavaScript's functions.

```cpp
//a unnamed function that returns false
[] (bool b) {return false;}

//Un unnamed function that takes a type circuit::state
[=](circuit::state current_state) -> circuit_device_event {
  //...
  return /...
}

//The Array is for scopes we want to have access to, with & being automatic
[&](auto& element) {
  //Generally you want these functions to be pure.
}
```

Notice the *skinny arrow* in example 2? It's sorta like f# lambdas in that they say the return type.

```fsharp
let rec addAll arr = function
  | [] -> 0
  | x:xs -> x + addAll xs
  ;;
```

You use them all the time in JavaScript, like when you're doing routes in Node + Express!

```js
app.get('*', function (req, res) { //here's the lambda!
    res.sendfile('./public/index.html');
});
```

### Binding

```c
//This will bind anything to a variable, that _1 is to hold for 1 parameter.
std::bind(&MyClass::MyFunction, this, 1);
```

If you want to be sure that a function will have `this` scoped to a particular class, then you can `std::bind` it.

### Pointers/References

You should never use `new` and `delete`, instead you should always use smart pointers to avoid memory leaks that could be caused by premature returns or exception handling.

* `shared_ptr<YourClass>` - Can have multiple owners, keeps track of how many users it has.
* `unique_ptr<YourClass>` - Only one user owns this pointer, and it will be deleted automatically when dealloced.
* `weak_ptr<YourClass>` - A pointer that isn't owned, and can be deleted under your nose.


### Templates

**Templates** - A way to create generic classes and use them anywhere you would normally use a discrete class. They're similar to Generic Functions if you've ever used [Unity C#](http://docs.unity3d.com/Manual/GenericFunctions.html).

```csharp
Rigidbody r = gameObject.GetComponent<Rigidbody>();
```

**Function Template** - The placeholder is used as a type in a function.

```cpp
template <typename T>
inline T const& Max(T const& a, T const& b) {
  return a < b ? b: a;
}
```
in Unreal Engine:

```cpp
template <typename GameObject>
static FORCEINLINE victoryObjType* SpawnBP(//...
```

**Variable Template** - A variable's type is a placeholder.

```cpp
template<class T>
constexpr T pi = T(3.145926535897932385) // variable template

template<class T>
T circular_aera(T r) {
  return pi<T> * r * r; //pi<T> is variable template instantiation
}
```

**Alias Template** - You can put template arguments in other templates!

```cpp
template<class T>
using pauli = hermitian_matrix<T, 2>; // alias template

template<class T> //static data member template
static constexpr pauli<T> sigmal1 = {{0, 1}, {1, 0}};
```

**Initializer List** - A means of initializing an object quickly with the braces `{ }`.

```cpp
class X {
    int a, b, i, j;
public:
    const int& r;
    X(int i)
      : r(a) // initializes X::r to refer to X::a
      , b{i} // initializes X::b to the value of the parameter i
      , i(i) // initializes X::i to the value of the parameter i
      , j(this->i) // initializes X::j to the value of X::i
    { }
};
```

## Learning Resources

The best way to learn anything is to surround your daily life with it, constantly work, hear and see it. Keep studying and make libraries!

*Watching* __Conferences Talks__ from:
- [CppCon](https://www.youtube.com/user/CppCon)

*Reading* **Books** like:
- [C++ Core Guidelines](http://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) by Bjarne Stroustrup and Herb Sutter

*Listening* to **Podcasts** like:
- [CppCast](http://cppcast.com/)

*Working* on **Projects** and talking in communities like:
- [r/cpp](http://reddit.com/r/cpp/)
- [r/graphicsprogramming](https://www.reddit.com/r/GraphicsProgramming/)


 *Grabbing* **Free Resources** from places like:
 - [Unreal Engine 4](https://www.unrealengine.com/what-is-unreal-engine-4) - An amazing open source game engine.

