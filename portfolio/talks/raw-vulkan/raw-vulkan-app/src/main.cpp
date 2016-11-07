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

#pragma region VirtualDevice
	// Init Device Extension/Validation layers
	std::vector<const char*> deviceExtensions =
	{
		VK_EXT_DEBUG_MARKER_EXTENSION_NAME
	};

	std::vector<const char*> deviceValidationLayers =
	{
		"VK_LAYER_LUNARG_standard_validation"
	};

	auto formatProperties = gpu.getFormatProperties(vk::Format::eR8G8B8A8Unorm);
	auto gpuFeatures = gpu.getFeatures();
	auto gpuQueueProps = gpu.getQueueFamilyProperties();

	auto queueCreateInfos = std::vector<vk::DeviceQueueCreateInfo>();

	float priority = 0.0;
	uint32_t graphicsFamilyIndex = 0;

	for (auto& queuefamily : gpuQueueProps)
	{
		if (queuefamily.queueFlags & vk::QueueFlagBits::eGraphics) {
			// Create a single graphics queue.
			queueCreateInfos.push_back(
				vk::DeviceQueueCreateInfo(
					vk::DeviceQueueCreateFlags(),
					graphicsFamilyIndex, 1,
					&priority
				)
			);
			break;
		}

		graphicsFamilyIndex++;

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

#pragma region Queue
	auto graphicsQueue = device.getQueue(graphicsFamilyIndex, 0);
#pragma endregion

#pragma region Image
	auto commandPoolInfo = vk::CommandPoolCreateInfo(
		vk::CommandPoolCreateFlags(vk::CommandPoolCreateFlagBits::eResetCommandBuffer),
		graphicsFamilyIndex
	);
	auto commandPool = device.createCommandPool(commandPoolInfo);

	auto commandBuffers = device.allocateCommandBuffers(
		vk::CommandBufferAllocateInfo(
			commandPool,
			vk::CommandBufferLevel::ePrimary,
			1U
		)
	);
#pragma endregion

#pragma region Commands

	// Pipeline
	auto pipelineCache = device.createPipelineCache(vk::PipelineCacheCreateInfo());
	auto graphicsPipeline = device.createGraphicsPipeline(pipelineCache, vk::GraphicsPipelineCreateInfo());
	auto pipelineLayout = device.createPipelineLayout(vk::PipelineLayoutCreateInfo());

	// From here we can do common GL commands
	commandBuffers[0].beginRenderPass(vk::RenderPassBeginInfo(
	));
	// Bind Descriptor Sets, these are attribute/uniform "descriptions"
	commandBuffers[0].bindPipeline();
	commandBuffers[0].bindDescriptorSets();
	commandBuffers[0].setViewport();
	commandBuffers[0].setScissor();
	commandBuffers[0].draw();
	commandBuffers[0].blitImage();
	commandBuffers[0].endRenderPass();

	// Create kernels to submit to the queue on a given render pass.
	auto kernelPipelineStageFlags = vk::PipelineStageFlags::Flags(vk::PipelineStageFlagBits::eAllCommands);
	auto kernel = vk::SubmitInfo(
		0U,
		nullptr,
		&kernelPipelineStageFlags,
		commandBuffers.size(),
		commandBuffers.data(),
		0U,
		nullptr
		);
#pragma endregion

	

	std::vector<vk::SubmitInfo> kernels = {
		kernel
	};

	graphicsQueue.submit(kernels, NULL);
	commandBuffers[0].begin(vk::CommandBufferBeginInfo());
	graphicsQueue.presentKHR(vk::PresentInfoKHR());
	return 0;
}