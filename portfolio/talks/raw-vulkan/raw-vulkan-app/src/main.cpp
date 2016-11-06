#define VULKAN_HPP_TYPESAFE_CONVERSION

#define __INT32_TYPE__

#include "vulkan/vulkan.hpp"
#include "glm/vec3.hpp"
#include "glm/mat4x4.hpp"

int main() {

#pragma region StartInstance

	std::vector<const char*> extensions = {
		VK_EXT_DEBUG_REPORT_EXTENSION_NAME
	};

	std::vector<const char*> layers =
	{
		"VK_LAYER_LUNARG_standard_validation",
		"VK_LAYER_RENDERDOC_Capture"
	};

	auto appInfo = vk::ApplicationInfo(
		"MyApp",
		VK_MAKE_VERSION(1, 0, 0),
		"MyAppEngine",
		VK_MAKE_VERSION(1, 0, 0),
		VK_MAKE_VERSION(1, 0, 0)
	);

	auto instanceInfo = vk::InstanceCreateInfo();

	instanceInfo.setPApplicationInfo(&appInfo);
	instanceInfo.enabledExtensionCount = extensions.size();
	instanceInfo.ppEnabledExtensionNames = extensions.data();
	instanceInfo.enabledLayerCount = layers.size();
	instanceInfo.ppEnabledLayerNames = layers.data();

	auto instance = vk::createInstance(instanceInfo);

#pragma endregion

#pragma region PhysicalDevices

	// Initialize Devices
	auto physicalDevices = instance.enumeratePhysicalDevices();
	auto gpu = physicalDevices[0];
	auto gpuProps = gpu.getProperties();

#pragma endregion

#pragma region DeviceHandle
	// Init Device Extension/Validation layers
	std::vector<const char*> deviceExtensions =
	{
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

	std::vector<vk::DeviceQueueCreateInfo> queueCreateInfos{};

	float priority = 0.0;
	uint32_t graphicsQueueIndex = 0;

	for (auto& queuefamily : gpuQueueProps)
	{
		if (queuefamily.queueFlags & vk::QueueFlagBits::eGraphics) {
			// Create a single graphics queue.
			queueCreateInfos.push_back(
				vk::DeviceQueueCreateInfo(
					vk::DeviceQueueCreateFlags(),
					graphicsQueueIndex, 1,
					&priority
				)
			);
			break;
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
#pragma endregion

#pragma region Image
	
#pragma endregion

	auto graphicsQueue = device.getQueue(graphicsQueueIndex, 0);
	auto renderPassInfo = vk::RenderPassCreateInfo();
	auto renderPass = device.createRenderPass(renderPassInfo);

	return 0;
}