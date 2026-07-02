import { useState } from 'react';
import { Button } from '@douyinfe/semi-ui';

import { SamanthaModal } from './samantha-modal';
import { DemoCard } from './DemoCard';
import { type LogFn } from './types';

type DeclarativeSpatialMode = 'default' | 'custom' | 'none';

const declarativeSpatialModeLabel: Record<DeclarativeSpatialMode, string> = {
  default: '默认 spatial card (back: 50px, thick)',
  custom: '自定义 spatial card (back: 80px, thin)',
  none: 'spatialCard={false}，无 XR 包装',
};

export function SamanthaModalDemo({ onLog }: { onLog: LogFn }) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [declarativeVisible, setDeclarativeVisible] = useState(false);
  const [declarativeSpatialMode, setDeclarativeSpatialMode] =
    useState<DeclarativeSpatialMode>('default');

  const openDeclarativeModal = (mode: DeclarativeSpatialMode) => {
    setDeclarativeSpatialMode(mode);
    setDeclarativeVisible(true);
    onLog(
      `[SamanthaModal] 声明式弹窗打开 (${declarativeSpatialModeLabel[mode]})`,
    );
  };

  const closeDeclarativeModal = (reason: '确认' | '取消' | '关闭按钮') => {
    onLog(`[SamanthaModal] 声明式弹窗 ${reason}`);
    setDeclarativeVisible(false);
  };

  const declarativeSpatialCard =
    declarativeSpatialMode === 'none'
      ? false
      : declarativeSpatialMode === 'custom'
        ? { back: '80px', backgroundMaterial: 'thin' }
        : undefined;

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
    <>
      <DemoCard
        title="F. SamanthaModal 命令式 API Demo"
        description="抽象 flow-web-monorepo 中 SamanthaModal 的命令式弹窗 API，还原完整调用链路：warning() → confirm() → ConfirmModal → SamanthaModal → Semi Modal。"
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

      <DemoCard
        title="G. SamanthaModal 声明式 Demo"
        description="通过 JSX 受控 visible 打开弹窗，验证 spatialCard 在声明式 SamanthaModal 上的三种行为：默认包装、自定义参数、显式关闭。"
      >
        <div className="demo-stage">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              type="primary"
              theme="solid"
              onClick={() => openDeclarativeModal('default')}
            >
              默认 spatial card
            </Button>
            <Button
              type="secondary"
              theme="solid"
              onClick={() => openDeclarativeModal('custom')}
            >
              自定义 spatial card
            </Button>
            <Button
              type="tertiary"
              theme="solid"
              onClick={() => openDeclarativeModal('none')}
            >
              spatialCard=false
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">声明式调用示例：</h4>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
{`<SamanthaModal
  visible={visible}
  title="声明式 SamanthaModal"
  spatialCard={${declarativeSpatialMode === 'none' ? 'false' : declarativeSpatialMode === 'custom' ? "{ back: '80px', backgroundMaterial: 'thin' }" : 'undefined /* 使用默认 */'}}
  centered
  onOk={...}
  onCancel={...}
>
  弹窗内容
</SamanthaModal>`}
            </pre>
          </div>
        </div>

        <SamanthaModal
          visible={declarativeVisible}
          title="声明式 SamanthaModal"
          desc="通过 visible 受控，走 modal.tsx → applySpatialModalProps → Semi modalRender"
          width={480}
          centered
          closable
          spatialCard={declarativeSpatialCard}
          onOk={() => closeDeclarativeModal('确认')}
          onCancel={() => closeDeclarativeModal('取消')}
          afterClose={() => onLog('[SamanthaModal] 声明式 afterClose')}
        >
          <p className="mb-2">
            当前 spatialCard 模式：
            <strong> {declarativeSpatialModeLabel[declarativeSpatialMode]}</strong>
          </p>
          <p className="text-sm text-gray-500">
            打开后可在 DOM 中检查是否存在
            {' '}
            <code>data-name=&quot;samantha-modal-spatial-card&quot;</code>
            {' '}
            的 enable-xr 节点。
          </p>
        </SamanthaModal>
      </DemoCard>
    </>
  );
}
