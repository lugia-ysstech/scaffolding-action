/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-09-18
 */
const designApi = {
  commonApi: {
    loadTree: () => {
      return [
        {
          widgetId: 'MainPad',
          nodeType: 'MainPad',
          isLocked: false,
          isHidden: true,
          title: '主画布',
          children: [
            {
              widgetId: 'wbwF0$71',
              widgetName: 'Button',
              module: '@lugia/lugia-web',
              title: 'Button',
              fatherId: 'mainPad',
              action: true,
              isLocked: false,
              nodeType: 'Widget',
              page: [],
              children: [],
            },
            {
              widgetId: 'wbiksU71',
              widgetName: 'Tabs',
              module: '@lugia/lugia-web',
              title: 'Tabs22',
              fatherId: 'mainPad',
              action: true,
              isLocked: false,
              nodeType: 'OnePageComponent',
              page: [{}],
              children: [
                {
                  widgetId: 'content of Tab1',
                  title: 'Tab1',
                  props: {
                    title: 'Tab1',
                    value: 'Tab1',
                    content: 'content of Tab1',
                    rangeIndex: { widgetId: 'wbiksU71', areaId: 'mainPad' },
                  },
                  nodeType: 'PageComponent',
                  isLocked: false,
                  isHidden: false,
                  children: [],
                },
                {
                  widgetId: 'content of Tab2',
                  title: 'Tab2',
                  props: {
                    title: 'Tab2',
                    value: 'Tab2',
                    content: 'content of Tab2',
                    rangeIndex: { widgetId: 'wbiksU71', areaId: 'mainPad' },
                  },
                  nodeType: 'PageComponent',
                  isLocked: false,
                  isHidden: false,
                  children: [],
                },
              ],
            },
            {
              widgetId: 'wbhB5N71',
              widgetName: 'Tabs',
              module: '@lugia/lugia-web',
              title: 'Tabs',
              fatherId: 'mainPad',
              action: true,
              actionComponent: ['5i8Bw1BVW'],
              isLocked: false,
              nodeType: 'OnePageComponent',
              page: [{}],
              children: [
                {
                  widgetId: 'content of Tab1',
                  title: 'Tab1',
                  props: {
                    title: 'Tab1',
                    value: 'Tab1',
                    content: 'content of Tab1',
                    rangeIndex: { widgetId: 'wbhB5N71', areaId: 'mainPad' },
                  },
                  nodeType: 'PageComponent',
                  isLocked: false,
                  isHidden: false,
                  children: [],
                },
                {
                  widgetId: 'content of Tab2',
                  title: 'Tab2',
                  props: {
                    title: 'Tab2',
                    value: 'Tab2',
                    content: 'content of Tab2',
                    rangeIndex: { widgetId: 'wbhB5N71', areaId: 'mainPad' },
                  },
                  nodeType: 'PageComponent',
                  isLocked: false,
                  isHidden: false,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          widgetId: 'ForkPad',
          nodeType: 'ForkPad',
          isHidden: true,
          title: '草稿层',
          isLocked: false,
          children: [],
        },
      ];
    },
    changeActionComponent: (a, b, c) => {
      console.log(a, b, c);
    },
  },
  updateApi: {
    changeActionComponent: () => {
      return;
    },
  },
};
export default designApi;
