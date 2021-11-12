import { requireNativeComponent, UIManager, ViewProps } from 'react-native';


// TODO: Add type annotation - Remove `any` type usage
export type RNIContextMenuViewProps = ViewProps & {
  // Value Props
  // -----------

  menuConfig: any; 
  previewConfig?: any;

  // Events - Lifecycle
  // ------------------

  onMenuWillShow?: any;
  onMenuWillHide?: any;

  onMenuDidShow?: any;
  onMenuDidHide?: any;

  onMenuWillCancel?: any;
  onMenuDidCancel ?: any;

  onMenuWillCreate?: any;

  // Events - OnPress
  // ----------------

  onPressMenuItem?: any;
  onPressMenuPreview?: any;
};

export type RNIContextMenuViewCommandID = {
  dismissMenu: number;
};

const viewName = "RNIContextMenuView";

export const RNIContextMenuView = 
  requireNativeComponent<RNIContextMenuViewProps>(viewName);

export const RNIContextMenuViewCommands = 
  ((UIManager as any)[viewName]).Commands as RNIContextMenuViewCommandID;
  

