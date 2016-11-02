Vulkan is a new low level API released febuary 2016 by the Khronos Group that maps directly to the design of modern GPUs. OpenGL was designed in 1992 when GPUs were far more simple, but since then they have become programmable computational units of their own with a focus on thoroughput over latency.

## Instances

Similar to the OpenGL context, a vulkan application begins when you create an instance. This instance must be loaded with some information about the program such as its name, engine, and minimum vulkan version, as well as **Layers** & **Extensions**.

These layers/extensions are instance specific, and can range from runtime debugging checks to hooks to GPU debugging software like [RenderDoc](https://github.com/baldurk/renderdoc) to even hooks to the Steam renderer so your game can behave better when you `Ctrl + Shift`.

```cpp
#include "vulkan.hpp"

void main() {

  // Setup Default Extensions/Layers
  // You should query for extensions first and build this list from your queries.
  // The following should work on Windows systems.

  std::vector<const char*> extensions = {
    VK_KHR_SURFACE_EXTENSION_NAME,
    VK_KHR_WIN32_SURFACE_EXTENSION_NAME,
    VK_EXT_DEBUG_REPORT_EXTENSION_NAME
  };

  std::vector<const char*> layers =
  {
    "VK_LAYER_LUNARG_standard_validation",
    "VK_LAYER_RENDERDOC_Capture",
    "VK_LAYER_VALVE_steam_overlay"
  };

  auto appInfo = vk::ApplicationInfo(
    "MyApp",
    VK_MAKE_VERSION(0, 1, 0),
    "MyAppEngine",
    VK_MAKE_VERSION(0, 1, 0),
    VK_MAKE_VERSION(1, 0, 30)
    );

  auto instanceInfo = vk::InstanceCreateInfo();

  instanceInfo.setPApplicationInfo(&appInfo);
  instanceInfo.enabledExtensionCount = extensions.size();
  instanceInfo.ppEnabledExtensionNames = extensions.data();
  instanceInfo.enabledLayerCount = layers.size();
  instanceInfo.ppEnabledLayerNames = layers.data();

  auto instance = vk::createInstance(instanceInfo);

}
```

## Devices

In vulkan, you have access to all enumerable devices that support it, and can query for information like their name, the number of heaps they support, their manufacturer, etc.

```cpp
// Initialize Devices
auto physicalDevices = instance.enumeratePhysicalDevices();
auto gpu = physicalDevices[0];

// Init Device Extension/Validation layers
std::vector<const char*> deviceExtensions =
{
  VK_KHR_SWAPCHAIN_EXTENSION_NAME,
  VK_EXT_DEBUG_MARKER_EXTENSION_NAME
};

std::vector<const char*> deviceValidationLayers =
{
  "VK_LAYER_LUNARG_standard_validation",
  "VK_LAYER_RENDERDOC_Capture",
  "VK_LAYER_VALVE_steam_overlay"
};

auto formatProperties = gpu.getFormatProperties(vk::Format::eR8G8B8A8Unorm);
auto gpuFeatures = gpu.getFeatures();
auto gpuQueueProps = gpu.getQueueFamilyProperties();

std::vector<vk::DeviceQueueCreateInfo> queueCreateInfos {};

for (auto& queuefamily : gpuQueueProps) {
  if (queuefamily.queueFlags & vk::QueueFlagBits::eGraphics) {
    if (gpu.getWin32PresentationSupportKHR(graphicsQueueIndex) == VK_TRUE) {
      queueCreateInfos.push_back( vk::DeviceQueueCreateInfo(vk::DeviceQueueCreateFlags(), queueGraphicsIndex, 1, &priority) );
      break;
    }
  }
  graphicsQueueIndex++;
}

auto deviceInfo = vk::DeviceCreateInfo();
deviceInfo.enabledExtensionCount = deviceExtensions.size();
deviceInfo.ppEnabledExtensionNames = deviceExtensions.data();
deviceInfo.enabledLayerCount = deviceValidationLayers.size();
deviceInfo.ppEnabledLayerNames = deviceValidationLayers.data();
deviceInfo.pEnabledFeatures = &gpuFeatures;
deviceInfo.queueCreateInfoCount = queueCreateInfos.size();
deviceInfo.pQueueCreateInfos = queueCreateInfos.data();

auto device = gpu.createDevice(deviceInfo);

```

Extensions are instance and device specific, with the extensions of an instance going down to the device.

## Program Execution

A Vulkan program executes as follows:

1. **Load the Library** - Your application loads the Vulkan library provided by your graphics card driver. This can be handled by the *Vulkan SDK's Loading Layer*, or by using system specific calls like Win32's `LoadLibrary("C:/Windows/SysWOW64/vulkan-1-1-0-30-0.dll")`.

2. **Get the Library Functions** - Reference a `vulkan.h` file, which is a part of the SDK, or you can generate  from their [API documentation repo](https://github.com/KhronosGroup/Vulkan-Docs)).

1. **Create your Vulkan App** - with `vkInstance instance;` [RAII](https://en.wikipedia.org/wiki/Resource_Acquisition_Is_Initialization) comes into play here.

2. **Query for Devices** - you can send request to check what devices are on this computer with `vkPhysicalDevices`. Then you can allocate data structures and tasks independently. Since you have semephoric support of the app, concurrent rendering is possible!

3. **Initialize Device Queue** - Create a `vkDevice`, specify it's features with `vkPhysicalDeviceFeatures`, and create `vkQueue`(s) to handle requests. (Just like OpenCL).

4. **Create a Window Surface** - `vkSurfaceKHR` (like a canvas in WebGL), and a swap chain `vkSwapChainKHR` (Basically frames to be rendered for double/tripple buffering.)

5. **Set up your Render Passes** with `vkFrameBuffer`.

6. **Create a pipeline** with `vkPipeline`. SPecify the current shader with `vkShaderModule` objects. This is perfect for deffered rendering techniques.

7. **Send draw operations** to the `vkQueue` in groups called `vkCommandBuffer`(s). Each Queue is allocated from a `vkCommandPool`

8. **Manage the changing of frames** via `vkAcuqireNextImageKHR`, execute the command buffers you're rendering with `vkQueueSubmit`, and display the image with `vkQueuePresentKHR`.

## Example Frame function calls.

```
|- Debug Frame
  |- Frame Start
  |- Color Pass #1 (1 Targets)
      |- 7) vkCmdPipelineBarrier
      |- 8) vkCmdBeginRenderPass
      |- 9) vkCmdBindPipeline
      |- 10) vkCmdBindDescriptorSet
      |- 11) vkCmdSetViewport
      |- 12) vkCmdSetScissor
      |- 13) vkCmdDraw(36, 1)
      |- 14) vkCmdEndRenderPass(C = Store, D=Don't Care)
      |- 17) vkQueueSubmit(1)[0] vkBeginCommandBuffer(ID 172)
      |- 18) vkQueuePresentKHR()
```

http://on-demand.gputechconf.com/siggraph/2015/video/SIG501-Piers-Daniell.html
https://github.com/Overv/VulkanTutorial
