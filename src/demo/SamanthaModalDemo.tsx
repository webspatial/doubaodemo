import { useState } from 'react';
import { Button } from '@douyinfe/semi-ui';

import { SamanthaModal } from './samantha-modal';
import { DemoCard } from './DemoCard';
import { type LogFn } from './types';

export function SamanthaModalDemo({ onLog }: { onLog: LogFn }) {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleShowWarning = () => {
    onLog('[SamanthaModal] warning 弹窗已打开');

    SamanthaModal.warning({
      width: 480,
      title: '删除确认',
      content: (
        <div>
          <p className="mb-2">确认要删除这条对话记录吗？</p>
          <p className="text-sm text-gray-500">此操作无法撤销，删除后将永久移除所有相关内容。</p>
        </div>
      ),
      cancelText: '取消',
      okText: '删除',
      centered: true,
      closable: false,
      onOk: async () => {
        onLog('[SamanthaModal] 用户点击确认');
        setConfirmLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setConfirmLoading(false);
        onLog('[SamanthaModal] 删除操作完成');
      },
      onCancel: () => {
        onLog('[SamanthaModal] 用户点击取消');
      },
    });
  };

  const handleShowInfo = () => {
    onLog('[SamanthaModal] info 弹窗已打开');
    SamanthaModal.info({
      title: '信息提示',
      content: '这是一条普通信息提示',
      centered: true,
    });
  };

  const handleShowSuccess = () => {
    onLog('[SamanthaModal] success 弹窗已打开');
    SamanthaModal.success({
      title: '操作成功',
      content: '您的操作已成功完成',
      centered: true,
    });
  };

  const handleShowError = () => {
    onLog('[SamanthaModal] error 弹窗已打开');
    SamanthaModal.error({
      title: '操作失败',
      content: '抱歉，操作失败，请稍后重试',
      centered: true,
    });
  };

  const handleShowConfirm = () => {
    onLog('[SamanthaModal] confirm 弹窗已打开');
    SamanthaModal.confirm({
      title: '确认操作',
      content: '确定要执行此操作吗？',
      centered: true,
    });
  };

  const handleDestroyAll = () => {
    onLog('[SamanthaModal] destroyAll 已调用');
    SamanthaModal.destroyAll();
  };

  return (
    <DemoCard
      title="F. SamanthaModal.warning 完整链路 Demo"
      description="抽象 flow-web-monorepo 中 SamanthaModal 的命令式弹窗 API，还原完整调用链路：warning() → confirm() → ConfirmModal → SamanthaModal → Semi Modal。使用 @douyinfe/semi-ui@2.53.2。"
    >
      <div className="demo-stage">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="primary"
            theme="solid"
            onClick={handleShowWarning}
            loading={confirmLoading}
          >
            触发 warning (删除确认)
          </Button>
          <Button
            type="secondary"
            theme="solid"
            onClick={handleShowInfo}
          >
            触发 info
          </Button>
          <Button
            type="secondary"
            theme="solid"
            onClick={handleShowSuccess}
          >
            触发 success
          </Button>
          <Button
            type="danger"
            theme="solid"
            onClick={handleShowError}
          >
            触发 error
          </Button>
          <Button
            type="primary"
            theme="borderless"
            onClick={handleShowConfirm}
          >
            触发 confirm
          </Button>
          <Button
            type="tertiary"
            theme="borderless"
            onClick={handleDestroyAll}
          >
            关闭所有弹窗
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">调用链路说明：</h4>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
SamanthaModal.warning(props)
  → withWarning(props)           // 添加警告图标和危险按钮类型
  → confirm(props)               // 创建 div 并 ReactDOM.render 到 body
    → ConfirmModal               // 桥接组件，包装 onOk/onCancel 为 Promise
      → SamanthaModal            // 自定义 header/footer/按钮
        → Semi Modal             // 底层 Semi UI Modal
          → ModalContent          // 真实 DOM 结构渲染
            → mask + wrap + dialog + header/body/footer
          → Portal               // 渲染到 document.body
          → CSSAnimation         // 进出场动画
          → ModalFoundation      // 业务逻辑层(Promise loading等)
          → focus trap           // 焦点陷阱
          → body scroll lock     // body 滚动锁定
</pre>
        </div>
      </div>
    </DemoCard>
  );
}
