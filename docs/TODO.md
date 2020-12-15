# TODO

## General/Unsorted
- [x] Implement targeted previews
- [ ] Submit a PR to the RN repo — Update RN template to fix `Undefined Symbol`
- [ ] Update `PreviewConfig.previewSize` to support passing in a size object, e.g. `{width: 100, height: 100}`
- [ ] Docs: Add images to steps
- [ ] Docs: Make sections collapsabe
- [ ] Docs: Fix grammar/spelling errors
- [ ] Docs: Fix table layout
- [ ] Docs: Test/Fix jump links
- [ ] Attach RN touch handler to context menu


<br>

- [x] Implement tinted/colored menu icons + config for line weight etc.
	- [x] Refactor: Change "ImageType" to "IconType", and "imageValue" to "imageType"
	- [x] Move menu icon related properties to "icon": `{ icon: { iconType: '', iconValue: '', tint: ''} }` 
	- [ ] Impl. support for icon weight

<br>


- [x] Implement `ImageType.ASSET` to support: "create an image from an image asset or image file located in your app’s main bundle"
* The `imageValue` string from `MenuAction`/`MenuConfig` will be used to init a `UIImage`, like: `UIImage(named: imageValue)`

<br>

- [x] Implement `ImageType.REQUIRE` to support using images via `require(path/to/image)`
* One way to implement is to use `Image.resolveAssetSource(source);` from the RN [docs](https://reactnative.dev/docs/image#resolveassetsource). So we have something like: `{ imageType: 'REQUIRE', imageValue: require('path/to/image.png') }`. 
	* **Reference**: [Medium Article](https://medium.com/swlh/how-to-obtain-a-uri-for-an-image-asset-in-react-native-with-expo-88dfbe1023b8). Explains how `Image.resolveAssetSource` works.
* Attempted to impl. this but ran into problems: when in debug mode, assets are provided via a local URL via the metro bundler.

<br>

- [ ] Implement `ActionSheetModule` to display an "Action Sheet" menu via [`UIAlertController`](https://developer.apple.com/documentation/uikit/uialertcontroller).
* **Reference**: [Article](https://developer.apple.com/documentation/uikit/windows_and_screens/getting_the_user_s_attention_with_alerts_and_action_sheets) in the apple developer about "Alerts and Action Sheets"
* **Reference**: [￼`ActionSheetIOS`￼](https://github.com/facebook/react-native/blob/9c353b5ab060be9392a7aaf437bba4ffc56d78ca/Libraries/ActionSheetIOS/ActionSheetIOS.js) JS code. The native module is called `RCTActionSheetManager`  ([link](https://github.com/facebook/react-native/blob/9c353b5ab060be9392a7aaf437bba4ffc56d78ca/Libraries/ActionSheetIOS/NativeActionSheetManager.js) to JS native module, and [link](https://github.com/facebook/react-native/blob/9c353b5ab060be9392a7aaf437bba4ffc56d78ca/React/CoreModules/RCTActionSheetManager.mm) to native code)
* **Reference**: [@react-native-menu/menu](https://github.com/react-native-menu/menu) library has a very good looking `ActionSheet` fallback with icons and disabled menu actions. 

<br>

- [ ] `ContextMenu` — Add support for `UIDefferedElement`
* In `MenuConfig.menuItems` property or in the `menuConfig` prop, if an object has a property called `defferedKey`, then it means we want to create a `UIDefferedElement` element.
* Impl. `onRequestDefferedElement` function. This function is called whenever a `UIDefferedElement` item needs to be loaded.
	* This function will receive a `defferedKey`. This function must return a promise, i.e. either a `MenuConfig` or `MenuAction` object. 
	* If the returned promise is a `MenuAction` object, it will use `defferedKey` for the `actionKey` property.
	*  In this function, based on the `defferedKey` it must return a corresponding `MenuConfig`/`MenuAction` object. If `null` is returned, then it means it failed.
	* This function is invoked from the native side. Native UI component `NativeCommands` don't natively support promises, so a workaround must be used based on `request` callbacks (like the one i used on react-native-ios-modal). But `NativeModule` functions has support for promises built in. 
		* We can use `findNodeHandle(this.nativeCompRef)` to get a node handle. Then we can use `self.bridge.uiManager.view(forReactTag: node)` to get a ref to the component. Then we cast it to the correct type: `component as? RCTContextMenuView` and then call the completion function for the corresponding `UIDefferedElement`,  something like: `contextMenuView.resolveDefferedMenuElement(for: defferedKey, item: menuElementDict)`
	* We need to create a class to create a `UIDeferredMenuElement`. It will extend `RCTMenuElement` and can be init from a dictionary. Probably name it something like: `RCTMenuDefferedItem`. It will have one property: `defferedKey`
		* `RCTMenuItem.createMenu` function must be updated to also handle creating a `RCTMenuDefferedItem` item.
	* On the native side when we create a `UIDeferredMenuElement` we do this:  `UIDeferredMenuElement { completion in self.completionDict[defferedKey] = completion }`, and then invoke a RN event: `self.onRequestDefferedElement([defferedKey: defferedKey])`.
		* `onRequestDefferedElement` event prop will be invoked. We wait for the promise to return some value and then call  a `NativeModule` function.
		* The `NativeModule` function will probably look like this: `ContextMenuViewModule.resolveDefferedMenuElement({nodeHandle, defferedKey, menuItem});`
		* Completion handlers will be stored in a dictionary. I'm not sure if I can use `NSMapTable`. I can use a plain `NSDictionary` but if I accidentally forget to cleanup (i.e. remove the completion handler from the dict) then that completion handler will be retained, causing a memory leak.
			* Completion handlers, i.e. closures, are reference types. If I assign it to `NSMapTable` with `valueOptions: .weakMemory`, will it be automatically be released when it's no longer used? Will it be retained while it's in use or will it be released the moment i add it to `NSMapTable` because nothing is using it? Technically, it is in use because it's in `UIDeferredMenuElement` argument (so the ref count  should increase?)

<br>

- [x] `ContextMenu` — Add `discoverabilityTitle` to `UIAction`
- [ ] Test `ContextMenuView` and `ContextMenuButton` on different react native versions
	- [ ] Test on **0.60**
	- [ ] Test on **0.61**
	- [ ] Test on **0.62**
	- [x] Test on **0.63.3**
	- [x] Test on **0.63.4**
- [ ] `react-native-context-menu` uses autolinking for installation. Check if this library will work on older react-native versions prior to 0.60 i.e test `ContextMenuView` and `ContextMenuButton` on react native versions older than 0.60
	- [ ] Test on **0.59**
	- [ ] Test on **0.58**

<br>

## `ContextMenuView`
- [x] ⭐️ Export `ActionSheetFallback` function and add it to the docs.
- [x] 🛠 Rename `RCTContextMenuManager` to `RCTContextMenuViewManager` and update corresponding js native component
- [x] ⭐️ Impl. iOS 14 specific feature: `UpdateVisibleMenu`
- [x] ⭐️ Impl. iOS 14 specific feature: `dismissMenu`
* Try implementing this via `NativeModule`

- [x] ⭐️ Custom Preview - Add support for custom previews, i.e by passing a child component to `RCTContextMenuView`, and wrapping that child inside a view controller and passing it as the preview target in `UIMenu` config. The first child of the `RCTContextMenuView` will be reserved for the custom menu preview. If no child is passed, i.e no custom preview is configured, then the preview target is not set for the `UIMenu`. The preview view should only be mounted when the menu is visible, and thus, it should support setting the preferred size of the preview target. Test if the preview target can be changed when it's already visible.
	- [ ] ⭐️ Custom Preview - Add support for setting an image as the custom preview. Use the built-in `Image` react native component to handle setting the image source + sizing. Receive the image as a child from `RCTContextMenuView` and cast it to `RCTImage` if necessary. The image will then be wrapped inside a view controller and is set as the `UIMenu`'s preview target. The view should be resized to fit the screen.

<br>

## `ContextMenuButton`
- [x] Finish initial impl. with 1 working simple example
- [x] Add documentation for `ContextMenuButton`
- [ ] Add `SystemImage` component for creating a `UIImage` that uses SF Icons (Research first if the built-in image component already supports this).
- [ ] Add example for `wrapNativeComponent` prop, i.e. example for using a different "button" component.

<br>

## Documentation
- [x] First remove all the links that point to the examples directory or links to different section. Highlight them in yellow then replace the highlighted text in the documentation with the new/updated section/examples links.
	- [x] Move `ContextMenuView` examples + tests in `examples/src` to `examples/src/ContextMenuView` then update documentation links
	- [x] In the "Examples" section add section for `ContextMenuView` and `ContextMenuButton`, then update the documentation "jump to" heading links
	- [x] Update and rename Images/Gifs
		- [x] Move gifs for `ContextMenuView` in `/assets` to `assets/ContextMenuView/`
		- [x] Rename `ContextMenuView` gifs i.e. prefix them with "ContextMenuView" e.g. `SimpleExample-1-2-3-4.gif` becomes `ContextMenuView-SimpleExample-1-2-3-4.gif`, etc.
		- [x] In the `/assets/example-screenshots` folder, prefix images with "ContextMenuView", e.g. `SimpleExample01.png` becomes `ContextMenuView-SimpleExample01.png`, etc.

<br>

- [x] In the "Documentation" section, add `ContextMenuButton` props.
- [ ] In the `MenuAction` Object section, add example object with comments.
- [ ] In the `MenuConfig` Object section, add example object with comments.
- [x] Finish `onPressMenuItem` `nativeEvent` Object section.
- [ ] Create collapsable "Table of Contents"
- [ ] Make examples content collapsable
- [x] Add section for `useActionSheetFallback` prop
- [ ] Add `README.md` in example directory