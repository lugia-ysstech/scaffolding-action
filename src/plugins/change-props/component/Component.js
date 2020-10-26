/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-09-23
 */
import React from 'react';
import Listener from '@lugia/listener';
import styled from 'styled-components';
import TopButton from './TopButton';
import PropsPanel from './PropsPanel';
import DeleteComponent from './DeleteComponent';
import ActionHoc from '../../utils/ActionHoc';

const Title = styled.p`
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: ;
`;
type PropsType = {
  designApi: Object,
  listener: Object,
  megaApi: Object,
  eventListener: Object,
  actionId: string,
  targetWidgetId: string,
};
class Component extends React.Component<PropsType, any> {
  constructor(props) {
    super();
    const { listener } = props;
    this.listener = listener;
    this.eventListener = new Listener();
    this.topButtonRef = React.createRef();
    this.propsPanelRef = React.createRef();
  }

  initParams = param => {
    const { params = {} } = param || {};
    const { type } = params;
    if (type !== 'changeProps') {
      return;
    }
    this.getRefFunction(this.topButtonRef, 'initParams', param);
    this.getRefFunction(this.propsPanelRef, 'initParams', param);
  };

  panelChangeParams = param => {
    const { params = {} } = param || {};
    const { type } = params;
    if (type !== 'changeProps') {
      return;
    }
    this.getRefFunction(this.topButtonRef, 'panelChangeParams', param);
    this.getRefFunction(this.propsPanelRef, 'panelChangeParams', param);
  };

  getRefFunction = (ref, functionName, param) => {
    if (ref) {
      const { [functionName]: cb } = ref.current || {};
      if (cb) {
        cb(param);
      }
    }
  };

  changeTop = param => {
    const { newItem } = param;
    this.widgetInfo = { ...newItem };
  };

  changeProps = param => {
    const { propsInfo, widgetIds, events, defaultValues } = param;
    this.onChangeEmit({
      widgetInfo: this.widgetInfo || this.initWidgetInfo,
      propsInfo,
      widgetIds,
      events,
      defaultValues,
    });
  };

  onChangeEmit = param => {
    const { widgetInfo, propsInfo = {}, widgetIds = [], events, defaultValues } = param;
    const { actionId, designApi } = this.props;
    this.listener.emit('plugInChangeParams', {
      actionId,
      params: {
        type: 'changeProps',
        value: { widgetInfo, propsInfo, widgetIds },
      },
    });
    if (designApi) {
      const getAliasName = widgetId => {
        return `changeProps_${widgetId}`;
      };
      const { widgetId: id } = widgetInfo;
      const currentPropsInfo = propsInfo[id] || {};
      const bindTypeInfoKeys = Object.keys(currentPropsInfo);
      const currentEvent = events[id] || [];
      const hasOnChange = currentEvent.find(key => key === 'onChange');
      const bindInfo = {};
      bindTypeInfoKeys.forEach(key => {
        bindInfo[key] = hasOnChange && key === 'value' ? 'bind' : 'connect';
      });
      currentPropsInfo.widgetId = id;
      const initValues = defaultValues[id] || {};
      const actionInfo = {
        actionId,
        widgetIds: [id],
        propsNames: Object.keys(currentPropsInfo),
        initState: { ...initValues, widgetId: id },
        widgetIdProps2BindType: { [id]: bindInfo },
      };
      designApi.updateApi.changeActionComponent(actionId, getAliasName(id), actionInfo);
      const aliasNames = [];

      for (const widgetId of widgetIds) {
        const aliasName = getAliasName(widgetId);
        if (!aliasNames.includes(aliasName)) {
          aliasNames.push(aliasName);
        }
      }
      if (aliasNames.length > 0) {
        designApi.updateApi.changeActionExternal(actionId, aliasNames);
      }
    }
  };

  getInitPropsInfo = param => {
    const { propsInfo, widgetIds, events, defaultValues } = param;
    this.onChangeEmit({
      widgetInfo: this.initWidgetInfo,
      propsInfo,
      widgetIds,
      events,
      defaultValues,
    });
  };

  getInitWidgetInfo = widgetInfo => {
    this.initWidgetInfo = widgetInfo;
  };

  render() {
    const { megaApi, designApi, actionId, targetWidgetId } = this.props;
    const config = {
      listener: this.listener,
      designApi,
      eventListener: this.eventListener,
    };
    return (
      <React.Fragment>
        <Title>删除</Title>
        <DeleteComponent {...config} actionId={actionId} />
        <Title>修改</Title>
        <TopButton
          {...config}
          ref={this.topButtonRef}
          onChange={this.changeTop}
          getInitWidgetInfo={this.getInitWidgetInfo}
          targetWidgetId={targetWidgetId}
        />
        <PropsPanel
          {...config}
          megaApi={megaApi}
          ref={this.propsPanelRef}
          onChange={this.changeProps}
          getInitPropsInfo={this.getInitPropsInfo}
        />
      </React.Fragment>
    );
  }
}

export default ActionHoc(Component);
