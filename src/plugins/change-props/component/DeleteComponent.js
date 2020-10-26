/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-10-17
 */
import React, { Component } from 'react';
import message from '@lugia/lugia-web/dist/message/index';
import styled from 'styled-components';
import InnerPage from '../../popup-tip-component/components/SelectTree';

const Wrap = styled.div`
  margin: 8px 0;
`;
type PropsType = {
  eventListener: Object,
  designApi: Object,
  actionId: string,
};
type StateType = {
  datas: Array<Object>,
};
class DeleteComponent extends Component<PropsType, StateType> {
  designApi: Object;

  eventListener: Object;

  currentSelectWidgetId: string;

  constructor(props) {
    super();
    const { eventListener, designApi } = props;
    this.state = {
      datas: [],
    };
    this.designApi = designApi;
    this.eventListener = eventListener;
    this.currentSelectWidgetId = '';
    this.eventListener.on('onBindWidgetsChange', this.onBindWidgetsChange);
  }

  getBindWidgets = (widgetId?: string) => {
    const { currentSelectWidgetId } = this;
    if (
      !currentSelectWidgetId ||
      (currentSelectWidgetId && widgetId && currentSelectWidgetId !== widgetId)
    ) {
      this.currentSelectWidgetId = widgetId;
    }
    const { currentSelectWidgetId: currentWidgetId } = this;
    if (this.designApi && currentWidgetId) {
      const widgets = this.designApi.queryApi.getActionComponentWidgetIds(currentWidgetId) || [];
      const treeData = this.designApi.commonApi.loadTree();
      const result = treeData.filter(({ widgetId: id }) => id === 'MainPad');
      const resultData = [];

      if (widgets.length > 0) {
        widgets.forEach((key: string) => {
          const data = this.getWidgetInfo(result, key);
          resultData.push(...data);
        });
      }
      this.setState({ datas: resultData });
    }
  };

  getWidgetInfo = (data, widgetId) => {
    const result = [];
    data.forEach((item: Object) => {
      const { widgetId: currentWidgetId, children } = item;
      if (currentWidgetId === widgetId) {
        result.push(item);
      } else if (children && children.length > 0) {
        const currentData = this.getWidgetInfo(children, widgetId);
        result.push(...currentData);
      }
    });
    return result;
  };

  onBindWidgetsChange = param => {
    const { widgetId } = param || {};
    this.getBindWidgets(widgetId);
  };

  onChange = param => {
    const { newItem } = param;
    const { widgetId } = newItem;
    const { actionId } = this.props;

    const aliasName = `changeProps_${widgetId}`;
    if (this.designApi) {
      try {
        this.designApi.deleteApi.deleteActionComponent(actionId, aliasName);
        message.info('删除成功');
      } catch (e) {
        message.info('删除失败');
      }
    }
    const { datas } = this.state;
    const newData = datas.filter(({ widgetId: currentId }) => currentId !== widgetId);
    this.setState({ datas: newData });
  };

  render() {
    const { datas } = this.state;
    return (
      <Wrap>
        <InnerPage
          data={datas}
          placeholder="请选择要删除已绑定关系的组件"
          onChange={this.onChange}
          valueField="widgetId"
          displayField="title"
          onlySelectLeaf={false}
          canClear={false}
        />
      </Wrap>
    );
  }
}

export default DeleteComponent;
