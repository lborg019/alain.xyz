Migrating between C++, JavaScript and Rust today has never been easier, the skills needed between each language has never been closer. 

Have open mind towards each programming language and being willing to understand and respect their differences is how the programming community will grow and evolve. 

1. **Installation** - Get off the ground and programming immediately.

2. **Semantics** - An overview of the semantics of Rust in comparison to C++.

3. **Modules** - Creating and installing modules.

4. **Cross-platform Compilation** - Targeting Windows, Mac, Linux, Android, iOS, Web, etc.

5. **Language Interops** - Methods of inlining and interfacing with other languages.

## C++

C++ is a mature language that has a lot of heritige. Developed by Bjorne Strustrup in Bell Labs as an extension to C, it became its own language once people coming from C began to see how much more maintainable their codebases were with class hierarchies and template metaprogramming.

### Installation

```bash
apt-get install gcc
```

## JavaScript

Brendon Eich is known as a bit of an appologist because of this, nevertheless, thanks to no small effort on the part of the many people contributing to the evolution of the language, modern JavaScript is a pleasure to develop in.

### Installation

Visit [The Node Foundation](https://nodejs.org) and down load the *current* version of Node.

Alternatively you can visit a code editing website like [Codepen](https://codepen.io/pen), but bear in mind there are missing features between browser and server versions of JS.

## Rust

Rust has become pretty popular, with exciting research projects ranging from using it to build web browsers like [Servo](https://servo.org/) to even entire [operating systems](http://www.redox-os.org/) and [game engines](http://www.piston.rs/).

This is thanks to the strong emphasis on [ease of use through tooling, performance, and security]() that the Rust standard body pushes for.

[Jack Moffitt](https://twitter.com/metajack), developer for the Rust powered browser Servo, said on [The Changelog](https://changelog.com/podcast/228) that:

> "All of [our security critical bugs with Firefox WebAudio] were array out of bounds/use after free errors and all of them would have been prevented by the Rust compiler [ instead of C ]."

Now that's not to say that C++ with `vector` and `smart_ptr` couldn't fix that problem,  a lot of developers end up shooting themselves in the foot thinking that performance but there is a value in making these security features a part of the language. In addition, Rust features a powerful type system inspired by Functional Programming languages like Ocaml and Haskell, which make types helpful instead of in your way.

### Installation

### Windows

Visit [win.rustup.rs](https://win.rustup.rs/) to get an installer `.exe`.

### Linux / OSX

```bash
curl https://sh.rustup.rs -sSf | sh
# You should see:
# Rust is installed now. Great!
```

From there you can easily find integrations with code editors like [VS Code](https://github.com/KalitaAlexey/vscode-rust) or [Atom](https://atom.io/packages/language-rust).

## Modules

In Rust, any folder can be a module if it has a `Cargo.toml` file (which is basically an `.ini` file similar to NPM's `package.json`), and often you'll see a script to handle building the package as well.

```bash
|- src/
  |- ...
|- Cargo.toml
|- build.rs
```

```yml
[package]
name = "vulcan-test"
version = "0.1.4"
authors = ["user6553591 <https://www.reddit.com/message/compose/?to=user6553591>"]
build = "build.rs"

[dependencies]
vulkano = "^0.3.1"
vulkano-win = "^0.3.1"
cgmath = "^0.12.0"
image = "^0.10.4"
winit = "^0.5.6"
time = "^0.1.35"
toml = "^0.2.1"
obj-rs = "^0.4.16"

[build-dependencies]
vk-sys = "^0.2.1"
vulkano-shaders = "^0.3.1"

[profile.release]
lto = true
```

```rust
extern crate vulkano_shaders;

fn main() {
    // building the shaders used in the examples
    vulkano_shaders::build_glsl_shaders([
        ("assets/build/shaders/vs.glsl", vulkano_shaders::ShaderType::Vertex),
        ("assets/build/shaders/fs.glsl", vulkano_shaders::ShaderType::Fragment),
    ].iter().cloned());
}
```

And you can run programs like a CLI similar to `npm` via cargo.

## Compiling

We live in a world where compiling to multiple platforms is *extremely important*. Rust supports Windows, Mac, Linux, iOS, Android, and Web, this section is designed to clear up how to compile to each of these platforms.

### Rustup - The Rust Toolchain

[Rustup](https://blog.rust-lang.org/2016/05/13/rustup.html) brings first class support for cross platform compilation to rust.

| OS | Target Name |
|:------:|:-----------:|
| Windows | `x86_64-pc-windows-msvc` |
| Mac | `x86_64-apple-darwin` |
| Linux | `x86_64-unknown-linux-gnu` |
| Android | `arm-linux-androideabi` |
| iOS | `aarch64-apple-ios`     |
| Arm Linux | `aarch64-unknown-linux-gnu` |

For more details visit [Rust's platform support documentation](https://doc.rust-lang.org/stable/book/getting-started.html#platform-support).

Simply add your target and then compile your target with `cargo`.

```bash
rustup target add # Target Name
cargo run --target= # Target Name
```

#### Android

For android there's already a CLI called [`cargo-apk`](https://github.com/tomaka/android-rs-glue) that helps automate creating an `.apk` for you. Just download the Android SDK and NDK, and install it as one of your `build-dependencies`.

## Semantics

Lets compare Rust semantics with JS and C++:

### Imports, Exports, Namespaces

```rust
// Rust
use std::fs;
mod file;

pub fn myexport(code: &str) -> u32 {
    return 0;
}
```

```cpp
// C++
#include "ifstream"
//Need the following imports for types
#include "stdio.h"
#include "string"

uint32_t myexport(std::string code)
{
    return 0;
}
```

```js
// TypeScript
import fs from 'fs';

export function myexport(code: string): number {
    return 0;
}
```

### Macros, Enums, Variables

```js
export enum Enums {
    One,
    Two
}
```

```cpp
enum Enums {
    One,
    Two
}
```

```rust
pub enum OomError {
    One,
    Two
}
```

### Struct

```rust
pub struct Structs {
    property: u32
}
```

```
struct Structs 
{
    uint32_t property;
}
```



### Structs, Functions, Classes

```rust
// A tuple struct
struct Pair(i32, f32);

// A struct with two fields
struct Point {
    x: f32,
    y: f32,
}

trait Renderable {
    fn render(&self) -> void;
}
```

```cpp

```

```ts
// TypeScript / Flow
type Renderable = {
  render: () => void
}
```

### Pointers

```js
// JavaScript Objects are by default Mutable References
let five = { value: 5 };
```

```rust
// Rust pointers are smart by default

// Alternatively there's Arcs
use std::sync::Arc;
use std::thread;

let five = Arc::new(5);
```

```cpp
import memory;

std::shared_ptr<Base> five;
```

### Templates, Macros, Pointers

By default everything in rust is copied unless you specify otherwise.

```rust
struct Val {
    val: f64
}

struct GenVal<T>{
    gen_val: T
}

// impl of Val
impl Val {
    fn value(&self) -> &f64 { &self.val }
}

// impl of GenVal for a generic type `T`
impl <T> GenVal<T> {
    fn value(&self) -> &T { &self.gen_val }
}

fn main() {
    let x = Val { val: 3.0 };
    let y = GenVal { gen_val: 3i32 };

    println!("{}, {}", x.value(), y.value());
}
```

What's interesting here is that the `mut` keyword is similar to GLSL's `inout` keyword! In C++, you can use `const` to describe immutable structures, which is not the default.

```cpp
template<typename T>
void lol(T what)
{

}
```

JavaScript always treats references as pointers similar to C++, unless you actually copy them with object spread. There's no such thing as advanced metaprogramming in JS, but you do have Generics in TypeScript and Flow.

```js
function lol<T>(T what) {

}
```

### Common Modules

```rust
// Implementation
```

```cpp
#include "ifstream"
```

```js
import fs from 'fs';
import path from 'path';
```

