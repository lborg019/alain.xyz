A Renderer is a library that takes a description of what it wants to render, and uses a lower level API to output that description. Renderers come in the form of **Raster Renderers** that can be found in game engines such as Unity, Unreal, and more. These are generally regarded as real-time renderers. **Raytracing Renderers** are renderers that trace rays that come out of each pixel of a given output image to determine a final output color. There's even **web Renderers** such as `react-dom` in frontend web development, which renders DOM nodes onto an HTML page either in real-time, or at a compile step where their final output is a string. That same DOM description is then used by the browser's rendering engine to output *quads* and *shaders* using the low level APIs popular in real-time renderers.

This week we're going discuss how to build a 2D rendering library that could be used as a UI system or a renderer for a 2D game. What are some of the design patterns and theoretical concepts that go into such a system?

## Engine Architecture

A renderer is a small part of a **Game Engine**. A Game engine is a set of interconnected modules that handle a variety of tasks such as Networking, Application Logic, Physics, Rendering, Input Devices, and much more. 

The lifecycle of an engine can be boiled down to 6 lines of code:

```rs
mod settings;
mod app;
mod engine;

fn main() {

    // Load Inital State
    let state = settings::load();

    // Load App Tree
    let node = app::App::new();

    // Initialize Engine
    let game = engine::Engine::new(state, node);

    // Engine Loop
    while game.io() {
        game.update();
        game.render();
    }

}
```

The `engine` module could be separated out into it's own module for other games to build on top of.

## Actor Model

```rs
use engine::RenderNode;

struct Player
{

}

impl Render for Player {
  
  fn update() {

  }

  fn render() {

  }
}
```

## API Interface

```rs

```


- [**Sprite Engine** Github Repo](https://github.com/alaingalvan/sprite-engine)
- [**Game Engine Architecture** by Jason Gregory](http://www.gameenginebook.com/)
- [**HTML5 Canvas API**](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [****]()