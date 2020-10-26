/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-09-23
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import InnerPage from '../../popup-tip-component/components/SelectTree';

const Wrap = styled.div`
  padding: 10px 0;
`;
type PropsType = {
  designApi: Object,
  listener: Object,
  eventListener: Object,
  onChange: () => void,
  getInitWidgetInfo: () => void,
  targetWidgetId: string,
};
type StateType = {
  data: Object[],
  currentWidgetId: string,
};
class TopButton extends Component<PropsType, StateType> {
  constructor(props) {
    super();
    const { designApi, listener, eventListener } = props;
    this.listener = listener;
    this.designApi = designApi;
    this.eventListener = eventListener;
    this.state = {
      data: this.getTreeData(),
      currentWidgetId: '',
    };
  }

  initParams = (param: Object, isInit = true) => {
    const { params = {} } = param;
    const { value: { widgetInfo = {} } = {} } = params;
    const { widgetId } = widgetInfo;

    this.setState({ currentWidgetId: widgetId }, () => {
      const { getInitWidgetInfo, targetWidgetId } = this.props;
      if (getInitWidgetInfo) {
        getInitWidgetInfo(widgetInfo);
      }
      if (isInit) {
        if (targetWidgetId) {
          this.eventListener.emit('onBindWidgetsChange', {
            widgetId: targetWidgetId,
          });
        }
      }
    });
  };

  panelChangeParams = param => {
    this.initParams(param, false);
  };

  getTreeData = () => {
    if (!this.designApi) {
      return [];
    }
    const treeData = this.designApi.commonApi.loadTree();
    const result = treeData.filter(({ widgetId }) => widgetId === 'MainPad');
    if (result.length > 0) {
      const { children = [] } = result[0] || {};
      const newData = JSON.parse(JSON.stringify(children));
      return this.fliterData(newData);
    }

    return [];
  };

  fliterData = data => {
    return data.map(item => {
      const newItem = item;
      const { widgetName, widgetId, children } = newItem;
      if (children && children.length > 0) {
        this.fliterData(children);
      } else if (widgetId && !widgetName) {
        newItem.notCanSelect = true;
      }
      return newItem;
    });
  };

  onChange = ({ newValue, newItem }) => {
    const { currentWidgetId } = this.state;
    if (!newValue || currentWidgetId === newValue) {
      return;
    }
    this.setState({ currentWidgetId: newValue }, () => {
      const { getInitWidgetInfo } = this.props;
      if (getInitWidgetInfo) {
        getInitWidgetInfo(newItem);
      }
      this.designApi.commonApi.drawActions([newValue]);
      this.eventListener.emit('onWidgetChange', {
        currentWidgetId: newValue,
        newItem,
      });
      const { onChange } = this.props;
      if (onChange) {
        onChange({ newValue, newItem });
      }
    });
  };

  render() {
    const { data, currentWidgetId } = this.state;
    return (
      <Wrap>
        <InnerPage
          data={data}
          value={currentWidgetId}
          placeholder="请选择要修改的组件"
          onChange={this.onChange}
          valueField="widgetId"
          displayField="title"
          onlySelectLeaf={false}
          canClear={false}
          igronSelectField="notCanSelect"
        />
      </Wrap>
    );
  }
}

export default TopButton;
