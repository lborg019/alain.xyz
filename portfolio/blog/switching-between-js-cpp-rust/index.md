> Things people tell me that they know: "full-stack JavaScript is the Future", "everyone should know C", "Rust is the best language for Systems Programming"... Most people hear stuff like this, and say to themselves, is that true? ~ [Haseeb Qureshi, Converge: Why Engineers Disagree About Everything (Talk)](https://softwareengineeringdaily.com/2017/02/24/convergence-with-haseeb-qureshi/)

Migrating between C++, JavaScript and Rust today has never been easier, languages seem to be converging, recent updates to each language added features exclusive to other languages. 

- **ECMAScript 2017** now features shared memory and atomics.
- **C++ 17** now features array destructuring, and `auto` became much more powerful.
- **Rust** now has a TypeScript-like [Language Server](https://github.com/rust-lang-nursery/rls).

### Table of Contents

1. **Installation** - Get off the ground and programming immediately.

2. **Semantics** - An overview of the semantics of Rust in comparison to C++.

3. **Modules** - Creating and installing modules.

4. **Cross Platform Compilation** - Targeting Windows, Mac, Linux, Android, iOS, Web, etc.

5. **Foreign Function Interfaces** - Methods of inlining and interfacing with other languages.

## JavaScript

*Brendon Eich* is known as a bit of an apologist because of this, nevertheless, thanks to no small effort on the part of the many people contributing to the evolution of the language, modern JavaScript is a pleasure to develop in.

### Installation

Visit [The Node Foundation](https://nodejs.org) and down load the *current* version of Node.

Alternatively you can visit a code editing website like [Codepen](https://codepen.io/pen), but bear in mind there are missing features between browser and server versions of JS.

## C++

C++ is a mature language that has a lot of heritage. Developed by *Bjarne Stroustrup* in Bell Labs as an extension to C, it became its own language once people coming from C began to see how much more maintainable their codebases were with class hierarchies and template metaprogramming.

### Installation

```bash
apt-get install gcc
```

## Rust

Rust has become pretty popular, with exciting research projects ranging from using it to build web browsers like [Servo](https://servo.org/) to even entire [operating systems](http://www.redox-os.org/) and [game engines](http://www.piston.rs/).

This is thanks to the strong emphasis on [ergonomics, performance, and security](https://blog.rust-lang.org/2017/03/02/lang-ergonomics.html) that the Rust standard body pushes for.

[Jack Moffitt](https://twitter.com/metajack), developer for the Rust powered browser Servo, said on [The Changelog](https://changelog.com/podcast/228) that:

> "All of [ our security critical bugs with Firefox WebAudio ] were array out of bounds/use after free errors and all of them would have been prevented by the Rust compiler [ instead of C ]."

### Installation

#### Windows

Visit [win.rustup.rs](https://win.rustup.rs/) to get an installer `.exe`.

#### Linux / OSX

```bash
curl https://sh.rustup.rs -sSf | sh
# You should see:
# Rust is installed now. Great!
```

From there you can easily find integrations with code editors like [VS Code](https://github.com/KalitaAlexey/vscode-rust) or [Atom](https://atom.io/packages/language-rust).

## Modules

In Rust, any folder can be a module if it has a `Cargo.toml` file (which is basically an `.ini` file similar to NPM's `package.json`), and often you'll see a script to handle building the package as well.

```bash
├─ src/
│   └─ ...
├─ Cargo.toml
└─ build.rs
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

```js
// TypeScript
import fs from 'fs';

export function myexport(code: string): number {
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

```rust
// Rust
use std::fs;
mod file;

pub fn myexport(code: &str) -> u32 {
    return 0;
}
```

### Enums

Enums don't exist in JavaScript, but are available in TypeScript:

```ts
// TypeScript
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

### Structs

JavaScript doesn't have types, so no need to define structs. Types aren't limited to being just structs in TypeScript though.

```ts
// TypeScript / Flow
type Structs = {
  property: number;
}
```

```cpp
struct Structs 
{
    uint32_t property;
}
```

```rust
pub struct Structs {
    property: u32
}
```

### Functions

```js
// JS
let lambda = () => null;
```

```cpp
// C++
auto lambda = []() 
{
    return null;
};

```

The brackets  (`[]`) portion of a C++ lambda where identifiers are placed is two pipes `| |` in Rust:

```rust
fn ten_times<F>(f: F) where F: Fn(i32) {
    for index in 0..10 {
        f(index);
    }
}

ten_times(|j| println!("hello, {}", j));
```

### Duck Typing

```rust
trait Renderable {
    fn render(&self) -> void;
}
```

```cpp
// C++ Doesn't have Duck Typing :(
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

```cpp
#include <memory>

// Raw Pointers

// Smart Pointers
std::shared_ptr<Base> five;
```

```rust
// Rust pointers are smart by default

// Unless specified otherwise

// Alternatively there's Arcs
use std::sync::Arc;
use std::thread;

let five = Arc::new(5);
```

### Templates

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

