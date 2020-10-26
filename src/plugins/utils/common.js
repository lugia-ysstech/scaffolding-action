
export function recursionGetAllSameWidget (data: Object, tabs: Array, getWidgetName: string){
  if (!data) {
    return [];
  }
  const childrenData = data.children;
  if (childrenData.length <= 0) {
    return [];
  }
  const outData = JSON.parse(JSON.stringify(tabs));
  childrenData.forEach(range => {
    const { widgetName } = range;
    if (widgetName && widgetName === getWidgetName) {
      outData.push(range);
    }
    recursionGetAllSameWidget(range, outData, getWidgetName);
  });
  return outData;
}

export function getTreeSelectedData (allTabs): Object[]{
  const treeData: Object[] = [];
  allTabs.forEach((tab: Object) => {
    const {widgetId, children, title} = tab;
    treeData.push({
      value: widgetId,
      text: title
    });
    children.forEach((tabContent: Object) => {
      const {title: childTitle, props: { value }} = tabContent;
      treeData.push({
        value: `${widgetId}_${value}`,
        text: childTitle,
        pid: widgetId,
        path: `${widgetId}/${widgetId}_${value}`,
        propsValue: value,
        isLeaf: true
      });
    });
  });
  return treeData;
}


export function uniqWidgetIds (values: Array) {
  const widgetIds = new Set();
  values.forEach(item => {
    widgetIds.add(item.pid);
  });
  return [...widgetIds];
}

export function getInitStateValue (widgetIds: Array, valueItems: Object[], propsName: ?string) {
  const initStateValue = {};
  const newPropsName = propsName | 'activeValue';
  widgetIds.forEach(item => {
    initStateValue[item] ={
      [newPropsName]: []
    }
  });
  return initStateValue;
}

export function getWidgetId2Value(values: Array) {
  const activeValue = {};
  const value = {};
  values.forEach(item => {
    const {pid} = item;
    if (pid) {
      const oldActiveValue = activeValue[pid] ? activeValue[pid] : [];
      const oldValue = value[pid] ? value[pid] : [];
      activeValue[pid] = [...oldActiveValue, item.value];
      value[pid] = [...oldValue, item.propsValue];
    }
  });
  return { activeValue, value };
}

export function getActiveValue(widgetId2Value: Object) {
  return widgetId2Value ? Object.values(widgetId2Value).flat() : []
}


export function getWidgetIdProps2BindInfo (widgetIds: string[]) {
  const widgetIdProps2BindInfo = {};
  widgetIds.forEach(widgetId => {
    widgetIdProps2BindInfo[widgetId] = {
      'value': 'bind'
    }
  })
  return widgetIdProps2BindInfo;
}
