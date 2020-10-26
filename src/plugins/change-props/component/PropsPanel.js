/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-09-23
 */
import React from 'react';
import ViewPropsPanel from '@lugia/mega-widget/dist/theme-controller-panel/block/ViewProps';
import styled from 'styled-components';

const Wrap = styled.div`
  border-top: 1px solid ${props => (props.currentWidgetId ? '#e8e8e8' : 'transparent')};
  padding-top: 10px;
`;
type PropsType = {
  listener: Object,
  megaApi: Object,
  eventListener: Object,
  onChange: () => void,
  getInitPropsInfo: () => void,
};
type StateType = {
  currentWidgetId: '',
  values: Object,
  imageData: Object[],
};
class PropsPanel extends React.Component<PropsType, StateType> {
  constructor(props) {
    super();
    const { listener, megaApi, eventListener } = props;
    this.megaApi = megaApi;
    let imageData = [];
    if (this.megaApi) {
      const { getImageSelectImageListener, assets } = this.megaApi.getProjectImageInfo();
      imageData = assets;
      this.imageSelectImageListener = getImageSelectImageListener();
    }
    this.state = { currentWidgetId: '', values: {}, imageData };

    this.listener = listener;
    this.pages = this.getPages();
    this.eventListener = eventListener;
    this.eventListener.on('onWidgetChange', this.onWidgetChange);
  }

  componentDidMount(): void {
    if (this.imageSelectImageListener) {
      this.onUploadFinishedEvent = this.imageSelectImageListener.on(
        'onUploadFinished',
        this.onUploadFinished
      );
      this.onDeleteFinishedEvent = this.imageSelectImageListener.on(
        'onDeleteFinished',
        this.onUploadFinished
      );
    }
  }

  shouldComponentUpdate(props: PropsType, state: StateType): boolean {
    const { currentWidgetId } = state;
    const { currentWidgetId: preCurrentWidgetId } = this.state;
    if (currentWidgetId !== preCurrentWidgetId) {
      if (this.megaApi && this.imageSelectImageListener) {
        const { updateImageInfo } = this.megaApi.getProjectImageInfo();
        this.imageSelectImageListener.updateProjectInfo(updateImageInfo);
      }
    }
    return true;
  }

  componentWillUnmount(): void {
    this.onUploadFinishedEvent && this.onUploadFinishedEvent.removeListener();
    this.onDeleteFinishedEvent && this.onDeleteFinishedEvent.removeListener();
  }

  onUploadFinished = async () => {
    const imageData = await this.imageSelectImageListener.getAssetsFun();
    this.setState({ imageData });
  };

  onWidgetChange = param => {
    const { newItem } = param;
    this.updateView({
      widgetInfo: newItem,
      widgetIds: this.getUpdateWidgets(newItem),
      callBack: (values, widgetIds, events, defaultValues) => {
        const { getInitPropsInfo } = this.props;
        if (getInitPropsInfo) {
          getInitPropsInfo({
            propsInfo: values,
            widgetIds,
            events,
            defaultValues,
          });
        }
      },
    });
  };

  getUpdateWidgets = widgetInfo => {
    const { widgetId } = widgetInfo;
    const { widgetIds = [] } = this.state;
    const newWidgets = JSON.parse(JSON.stringify(widgetIds));
    if (!newWidgets.includes(widgetId)) {
      newWidgets.push(widgetId);
    }
    return newWidgets;
  };

  updateView = ({ widgetInfo, propsInfo, widgetIds, callBack }) => {
    const { widgetId, widgetName, aliasName, module } = widgetInfo;
    const meta = this.megaApi ? this.megaApi.getWidgetMeta({ widgetName, aliasName, module }) : {};
    const { props, events: metaEvents = [] } = meta;
    const values = propsInfo || this.getValues(props, widgetId);
    const newEvents = {
      [widgetId]: metaEvents.map(({ name }) => name),
    };
    const defaultValues = this.getDefaultValues(props, widgetId);

    this.setState(
      {
        widgetIds,
        currentWidgetId: widgetId,
        values,
        events: newEvents,
        defaultValues,
      },
      () => {
        if (callBack) {
          callBack(values, widgetIds, newEvents, defaultValues);
        }
        this.eventListener.emit('onViewPropsChange', {
          data: this.getPropsData(props),
        });
      }
    );
  };

  getValues = (props = [], widgetId) => {
    const { values } = this.state;
    const newValues = JSON.parse(JSON.stringify(values));
    let currentInfo = newValues[widgetId];
    if (!currentInfo) {
      currentInfo = newValues[widgetId] = {};
    }
    props.forEach(({ name, defaultValue, propsDefaultValue }) => {
      if (!currentInfo[name] && (defaultValue || propsDefaultValue)) {
        currentInfo[name] = defaultValue || propsDefaultValue;
      }
    });
    return newValues;
  };

  getDefaultValues = (props = [], widgetId) => {
    const newValues = {};
    props.forEach(({ name, defaultValue, propsDefaultValue }) => {
      if (!newValues[name] && (defaultValue || propsDefaultValue)) {
        newValues[name] = defaultValue || propsDefaultValue;
      }
    });
    return { [widgetId]: newValues };
  };

  initParams = param => {
    const { params } = param;
    const { value: { propsInfo = {}, widgetInfo, widgetIds } = {} } = params;
    if (!widgetInfo) {
      return;
    }
    this.updateView({ widgetInfo, propsInfo, widgetIds });
  };

  panelChangeParams = param => {
    this.initParams(param);
  };

  getPropsData = propsInfo => {
    const { values = {}, currentWidgetId } = this.state;
    const currentPropsInfo = values[currentWidgetId] || {};
    const propsData = [];
    if (propsInfo) {
      propsInfo.forEach((item = {}) => {
        const { name, type, title, defaultValue, propsDefaultValue } = item;
        const isSelectInput = type && Array.isArray(type);
        const selectData = isSelectInput ? { data: type } : {};
        if (name === 'lugiaHidden' || name === 'viewClass') {
          return;
        }
        propsData.push({
          ...item,
          type: isSelectInput ? 'selectInput' : type,
          ...selectData,
          text: title || name,
          value:
            name in currentPropsInfo ? currentPropsInfo[name] : defaultValue || propsDefaultValue,
        });
      });
    }
    return propsData;
  };

  getPages = () => {
    if (this.megaApi) {
      return this.megaApi.getAllPages();
    }
    return [];
  };

  onChange = (param: { name: string, newValue: any }) => {
    const { name, value } = param;
    const { values, currentWidgetId, widgetIds, events, defaultValues } = this.state;
    const newValues = JSON.parse(JSON.stringify(values));
    let current = newValues[currentWidgetId];
    if (!current) {
      current = newValues[currentWidgetId] = {};
    }
    current[name] = value;
    this.setState({ values: newValues });
    const { onChange } = this.props;
    if (onChange) {
      onChange({ propsInfo: newValues, widgetIds, events, defaultValues });
    }
  };

  render() {
    const { currentWidgetId, imageData } = this.state;
    return (
      <Wrap currentWidgetId={currentWidgetId}>
        <ViewPropsPanel
          eventListener={this.eventListener}
          megaInfo={{ pages: this.pages }}
          smartFormProps={{
            image: {
              imageSelectImageListener: this.imageSelectImageListener,
              data: imageData,
            },
          }}
          onChange={this.onChange}
          oneLine={false}
          onlyPanelList
        />
      </Wrap>
    );
  }
}

export default PropsPanel;
