/**
 * @flow
 * @Description:
 * @author cuixia wang
 * @date 2020-09-16
 */
import React, { Component } from 'react';

type TypeProps = {
  listener: Object,
  actionId: string,
};
export default ActionComponent => {
  class ActionHoc extends Component<TypeProps, any> {
    constructor(props: TypeProps) {
      super();
      const { listener } = props;
      this.listener = listener;
      this.componentRef = React.createRef();
    }

    componentDidMount(): void {
      this.catchDid(
        () => {
          if (this.listener) {
            this.initParamsEvent = this.listener.on('initParams', this.initParams);
            this.panelChangeParamsEvent = this.listener.on(
              'panelChangeParams',
              this.panelChangeParams
            );
          }
        },
        param => {
          this.catchDid(
            () => {
              const { actionId } = this.props;
              this.listener &&
                this.listener.emit('plugInLoadingComplete', {
                  actionId,
                  message: param,
                });
            },
            error => {
              if (error) {
                const { code, message } = error;
                if (!code) {
                  throw message;
                }
              }
            }
          );
        }
      );
    }

    componentWillUnmount(): void {
      this.initParamsEvent && this.initParamsEvent.removeListener();
      this.panelChangeParamsEvent && this.panelChangeParamsEvent.removeListener();
    }

    catchDid = (func: Function, callback: Function) => {
      try {
        if (func) {
          func();
          callback({ code: 1, message: '渲染成功' });
        }
      } catch (err) {
        if (callback) {
          callback({ code: 0, message: (err && err.message) || '' });
        }
      }
    };

    initParams = param => {
      if (this.componentRef && this.componentRef.current) {
        const { initParams } = this.componentRef.current;
        if (initParams) {
          initParams(param || {});
        }
      }
    };

    panelChangeParams = param => {
      if (this.componentRef && this.componentRef.current) {
        const { panelChangeParams } = this.componentRef.current;
        if (panelChangeParams) {
          panelChangeParams(param || {});
        }
      }
    };

    render() {
      return <ActionComponent {...this.props} ref={this.componentRef} />;
    }
  }
  return ActionHoc;
};
