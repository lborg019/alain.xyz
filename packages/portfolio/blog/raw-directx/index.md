DirectX is a proprietary graphics API developed by Microsoft, created out of a lack of a unified graphics API available on Windows. Over the years it's become an elegant API which Microsoft maintains heavily. Its API interface is like Vulkan without complex features like descriptor sets or GPU memory allocation. 

DirectX is supported on:

- **Windows**
- **Xbox One**
- **Xbox 360**

DirectX 12 like Vulkan has made the developer responsible for what was originally the done by the driver, and shares a lot of the same data structures and abstractions. Data Structures such as **Swapchains**, **Pipeline State Objects**, **Render Passes**, and **Shader Modules** behave the same.

Here we'll get started building a DirectX renderer and review some of the similarities and differences between DirectX and other APIs like Vulkan, Metal, and OpenGL.

## Entry Point - DXGIFactory

| API | Structure |
|-----|-----------|
| DirectX | `IDXGIFactory` |
| Vulkan | `VkInstance` |
| Metal | `MTKView` |
| OpenGL | Context (varies by platform) |

DirectX begins by creating an entry point structure:

```cpp
#include <d3d11.h>
#include <D3Dcompiler.h>

void main()
{
  IDXGIFactory* factory;
  HRESULT result = CreateDXGIFactory(__uuidof(IDXGIFactory), (void**)(&factory));
}
```

## Physical Device - IDXGIAdapter

| API | Structure |
|-----|-----------|
| DirectX | `IDXGIAdapter` |
| Vulkan | `VkPhysicalDevice` |
| Metal | - |
| OpenGL | - |

Adapters allow you to query a device's capabilities. 

```
HRESULT result = factory->EnumAdapters(0, &adapter);
```

## Device - ID3D11Device & ID3D11DeviceContext

```cpp
HRESULT result = D3D11CreateDevice(
  // ...
);

```