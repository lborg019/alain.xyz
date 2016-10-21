C++ has been changing quickly, adopting new features to the standard such as first class tuples, threading, integrating boost features such as `boost::any` as `std::any`, and making initializers semantically clear.

The following is an overview of what it takes to create a modern library for C++, from toolsets to new language features.

## Module Systems

C++ recently added [modules](http://www.open-std.org/JTC1/SC22/WG21/docs/papers/2015/n4465.pdf) to the spec, with the semantics similar to Go, Python, Java, etc.

```cpp
import std.io;

// Declare your module like so:
// Every line after that will be considered a part of your module.
module firstapp;

export void helloWorld() {
  iostream << "Hello World!";
}
```

To Consume modules.

```cpp
import firstapp;

void main() {
  helloWorld();
}
```

Sadly, the tooling for C++ modules is lacking, with no intelisense/optmization released yet, and only visual studio's compiler supports it on the command line.

> **Call to Action**: Create a *Babel* tool for converting C++ 14, 17, 20 to C++ 11 or below.

### Preprocessor Modules

In C++, the current standard of module resolution is the `#import` macro system, which uses the preprocessor step of compilation to manage imports.

Here's how C++ compiles an app:

1. Preprocessor Step
  1. C++ takes the main file, and every instance of `#import` actually copy/pastes the thing you're importing to one big program file.
  2. The Preprocessor checks `#define`, `#ifdef`, and any other macros.
2. Compilation Step - it compiles the source into instructions/references to things it doesn't have.
3. Linking Step - it links any references that it doesn't have, if any implementation is missing, then you'll see a `LINKER` error.
4. Final Step - bundles it all together.

> *This is the root of so many problems with C++ programs. The fact that there's a system in between managing the scope of files like the preprocessor, making your code even more verbose in the process, as well as being extremely vague with regards to namespaces and file locations makes managing a composed application expensive and difficult.*

```cpp
# pragma once
// Since we don't have modules, we need to prevent multiple
// copies of this file copy/pasted in our project.

#import <iostream>
//iostream is in the global file context.


// we want to resolve the namespace iostream uses so we can just call its functions directly.
// sort of like making a shortcut to all the functions in the file.
using namespace std;

void helloWorld() {
  iostream << "Hello World!";
}

// this file is called firstapp.hpp
```

Import like so:

```cpp
#include <firstapp.hpp>

void main() {
  helloWorld();
}
```

It's hard to envision where your dependencies are when you're dealing with namespaces that don't correspond to file locations or module names. You also need to manage your dependencies either with visual studio's solution properties, cmake, or conan, 

> Without an automated system to manage dependencies keeping track of them will always be an error prone process.

## C++ Keywords

* `constexpr` - The expression is determined @ compile time.
* `using` - Another word for `typedef` but with templates: `using namespace std`
* `inline` - The code will be injected vs a function call going to a different scope. Unreal calls this `USEINLINE`.
* `friend` - can access the "private" and "protected" members of the class in which it is declared as a friend.
* `extern` - Tells the compiler the structure is defined elsewhere.
* `const` - used to tell the compiler to take this argument as a constant vs a pointer, thus making the original immutable.
* `~` - Used for destructors: `~destructor() { //...}`
* `void*`- A pointer to an unknown type.

### Fragmentation

C++ spawned a number of other languages that tried to address some of the missing features of the spec:

* [D](http://dlang.org/)
* [Rust](https://www.rust-lang.org/)
* [Crystal](http://crystal-lang.org/)
* [Nim](http://nim-lang.org/)
* [Go](http://golang.org)

Then there's OS specific code like `w_main` and getting the window handler, which is reminiscent of problems on the web with browser differences, but at a greater scale.

One thing's clear, [C++](https://isocpp.org/std/status) and [Javascript](https://tc39.github.io/ecma262/) both have troubled pasts and are trying to clean up, both are entering a faster release cycle and adopting new features that were originally part of their most popular community contributions.

### Burrowing in the Community

I've always been a shyguy, I don't talk, I lurk Reddit, forums like [Newgrounds](http://www.newgrounds.com/bbs/), [Unreal Forums](), [Unity Forums](), [GMC](), and [The Spriters Resource](http://www.spriters-resource.com/community/index.php) (though I'm a bit more talkative there), just listening. When you're not a big part of a community, when you're not too experienced in a topic, you feel like everything you say will be met with the higher ups saying:

> Your work is bad and you should feel bad!

Basically, *impostor syndrome*.

Even though in reality they're probably going to be somewhat understanding and give helpful suggestions. Nevertheless, it's possible to bury yourself while being a shy guy:

* [Cppcast](http://cppcast.com/) - The most popular C++ Podcast.

### Code Generators and Boilerplates

On the web we have boilerplate generators like Yeoman, Ruby has them too. For C++ we got no thing, nada. Best you can do is use Unreal Engine's Class generators, or fork something from github as usual.

Unreal Engine features an automated build system and automated code generator, which serializes your code and adds extras to it to make it work with the UE4 Blueprints system.

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

Notice the *skinny arrow* in example 2? It's sorta like f# lambdas in that they say the return type. (ES6 added fat arrows, but those are different, having to do with the working with the pervious function's scope.)

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
//This will bind anything to a varible, that _1 is to hold for 1 parameter.
std::bind(&MyClass::MyFunction, this, 1);
```

### Pointers/References

* `shared_ptr<YourClass>` - Raw pointers don't show who *owns the memory*. It reasigns the memory block to the heap.
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
