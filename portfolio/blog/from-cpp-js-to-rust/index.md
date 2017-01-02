Rust is becoming very mature as a programming language, with research projects ranging from using it in compilers to web browsers like Servo to even entire operating systems and game engines.

Jack Moffitt, developer of the Rust powered browser Servo, said on [The Changelog](https://changelog.com/podcast/228) that:

> All of [our security critical bugs with Firefox WebAudio] were array out of bounds/use after free errors and all of them would have been prevented by the Rust compiler [ instead of C++ ].

Now that's not to say that C++ with `vector` and `smart_ptr` couldn't fix that problem, but there is a value in making these features a part of the language. In addition, Rust features a powerful type system inspired by Functional Programming languages like Ocaml and Haskell, which make types helpful instead of in your way.

Here we'll be discussing how to migrate from a C++ and JS background to programming in Rust by reviewing:

1. **Installation** - Get off the ground and programming immediately.
2. **Modules** - Creating and installing modules.
3. **Cross-platform Compilation** - Targeting Windows, Mac, Linux, Android, iOS, Web, etc.
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

From there you can easily find integrations with code editors like [VS Code](https://github.com/KalitaAlexey/vscode-rust).

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

## Compiling

We live in a world where compiling to multiple platforms is *extremely important*. Rust supports Windows, Mac, Linux, iOS, Android, and Web, this section is designed to clear up how to compile to each of these platforms.

### Rustup - The Rust Toolchain

[Rustup](https://blog.rust-lang.org/2016/05/13/rustup.html) brings first class support for cross platform compilation to rust.

| OS | Target Name |
|:------:|:-----------:|
| Windows | `x86_64-pc-windows-msvc` |
| Mac     | `x86_64-apple-darwin` |
| Linux   | `x86_64-unknown-linux-gnu` |
| Android | `arm-linux-androideabi` |
| iOS     | `aarch64-apple-ios`     |

For more details visit [Rust's platform support documentation](https://doc.rust-lang.org/stable/book/getting-started.html#platform-support).

Simply add your target and then compile your target with `cargo`.

```bash
rustup target add # Target Name
cargo run --target= # Target Name
```

#### Android

For android you'll need the Android NDK, so download it and then run it's make standard toolchain script.

```bash
curl -O https://dl.google.com/android/android-sdk_r24.4.1-linux.tgz
tar xzf android-sdk_r24.4.1-linux.tgz
curl -O http://dl.google.com/android/repository/android-ndk-r10e-linux-x86_64.zip
unzip android-ndk-r10e-linux-x86_64.zip
android-ndk-r10e/build/tools/make-standalone-toolchain.sh \
      --platform=android-18 --toolchain=arm-linux-androideabi-clang3.6 \
      --install-dir=android-18-toolchain --ndk-dir=android-ndk-r10e/ --arch=arm
```

Then make a `config` file at `~/.cargo` and add the following:

```yml
[build]
target = "arm-linux-androideabi"

[target.arm-linux-androideabi]
linker = "/home/rust/android-18-toolchain"
```

