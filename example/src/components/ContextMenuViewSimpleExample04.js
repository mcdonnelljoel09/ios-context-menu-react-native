import React from 'react';
import { StyleSheet } from 'react-native';

import { ExampleContextMenuItem } from './ExampleContextMenuItem';


export class ContextMenuViewSimpleExample04 extends React.PureComponent {
  render(){
    return(
      <ExampleContextMenuItem
        {...this.props}
        title={'Simple Example #4'}
        subtitle={'menuAttributes'}
        desc={'Context menu with a "disabled" action, a "destructive" action, a "hidden" action (which is not visible), and a disabled + destructive action'}
        onPressMenuItem={({key}) => alert(key)}
        menuConfig={{
          menuTitle: 'ContextMenuViewSimpleExample04',
          menuItems: [{
            actionKey     : 'key-01',
            actionTitle   : 'Disabled Action',
            imageType     : 'SYSTEM',
            imageValue    : 'folder',
            menuAttributes: ['disabled']
          }, {
            actionKey     : 'key-02'   ,
            actionTitle   : 'Destructive Action',
            imageType     : 'SYSTEM',
            imageValue    : 'trash',
            menuAttributes: ['destructive']
          }, {
            actionKey     : 'key-03'   ,
            actionTitle   : 'Hidden Action',
            imageType     : 'SYSTEM',
            imageValue    : 'trash',
            menuAttributes: ['hidden']
          }, {
            actionKey     : 'key-04'   ,
            actionTitle   : 'Disabled/Destructive',
            imageType     : 'SYSTEM',
            imageValue    : 'trash.fill',
            menuAttributes: ['disabled', 'destructive']
          }],
        }}
      />
    );
  };
};

const styles = StyleSheet.create({
});