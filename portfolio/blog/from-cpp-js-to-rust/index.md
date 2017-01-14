Rust is becoming very mature as a programming language, with exciting research projects ranging from using it in compilers to web browsers like [Servo](https://servo.org/) to even entire [operating systems](http://www.redox-os.org/) and [game engines](http://www.piston.rs/).

[Jack Moffitt](https://twitter.com/metajack), developer of the Rust powered browser Servo, said on [The Changelog](https://changelog.com/podcast/228) that:

> All of [our security critical bugs with Firefox WebAudio] were array out of bounds/use after free errors and all of them would have been prevented by the Rust compiler [ instead of C++ ].

Now that's not to say that C++ with `vector` and `smart_ptr` couldn't fix that problem, but there is a value in making these security features a part of the language. In addition, Rust features a powerful type system inspired by Functional Programming languages like Ocaml and Haskell, which make types helpful instead of in your way.

Here we'll be discussing how to migrate from a C++ and JS background to programming in Rust by reviewing:

1. **Installation** - Get off the ground and programming immediately.
2. **Modules** - Creating and installing modules.
3. **Cross-platform Compilation** - Targeting Windows, Mac, Linux, Android, iOS, Web, etc.
4. **Language Interops** - Methods of inlining and interfacing with other languages.
4. **Semantics** - An overview of the semantics of Rust in comparison to C++.

## Installation

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

```rust
pub enum OomError {
    One,
    Two
}

pub struct Structs {
    property: u32
}
```

```cpp
enum Enums {
    One,
    Two
}

struct Structs 
{
    uint32_t property;
}
```

```js
export enum Enums {
    One,
    Two
}
```

### Structs, Functions, Classes

```rust

```

```cpp

```

```js

```

### Templates, Macros, Pointers

By default everything in rust is copied unless you specify otherwise.

```rust

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

```

```cpp
#include "ifstream"
```

```js
import fs from 'fs';
import path from 'path';
```

