/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-09-23
 */
import React, { Component } from 'react';
import index from './index';
import megaApi from './mock/megaApi';
import designApi from './mock/designApi';
import Listener from '@lugia/listener';
class Demo extends Component {
  constructor() {
    super();
    this.listener = new Listener();
    this.state = {
      canClick: false,
    };
  }
  onClick = () => {
    this.listener.emit('onSelectWidget', {
      widgetName: 'Button',
      aliasName: '',
      moduleName: '@lugia/lugia-web',
    });
  };
  canClickOther = () => {
    this.setState({ canClick: true });
  };
  render() {
    const Box = index.loadView();
    const { canClick } = this.state;
    return (
      <div style={{ width: 190 }}>
        <Box
          megaApi={megaApi}
          designApi={designApi}
          listener={this.listener}
          onClick={this.canClickOther}
        />
        {canClick ? <span onClick={this.onClick}>Button</span> : null}
      </div>
    );
  }
}

export default Demo;
