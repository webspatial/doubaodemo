import type { CSSProperties, ReactNode } from 'react';

import {
  type SamanthaModalProps,
  type SamanthaModalSpatialCardOptions,
} from './type';

export const defaultSpatialCard = {
  back: '50px',
  backgroundMaterial: 'thick',
} satisfies Exclude<SamanthaModalSpatialCardOptions, false>;

export function renderSpatialCard(
  modal: ReactNode,
  spatialCard: Exclude<SamanthaModalSpatialCardOptions, false>,
) {
  return (
    <div
      enable-xr={true}
      className="samantha-modal-spatial-card"
      data-name="samantha-modal-spatial-card"
      style={
        {
          '--xr-back': spatialCard.back,
          '--xr-background-material': spatialCard.backgroundMaterial,
        } as CSSProperties
      }
    >
      {modal}
    </div>
  );
}

export function composeSpatialModalRender(
  spatialCard: SamanthaModalSpatialCardOptions | undefined,
  modalRender: SamanthaModalProps['modalRender'],
) {
  if (spatialCard === false) {
    return modalRender;
  }

  const cardOptions = {
    ...defaultSpatialCard,
    ...spatialCard,
  };

  return (modal: ReactNode) => {
    const spatialModal = renderSpatialCard(modal, cardOptions);
    return modalRender ? modalRender(spatialModal) : spatialModal;
  };
}

export function applySpatialModalProps(
  props: SamanthaModalProps,
): Omit<SamanthaModalProps, 'spatialCard'> {
  const { spatialCard, modalRender, ...rest } = props;
  const composedModalRender = composeSpatialModalRender(
    spatialCard,
    modalRender,
  );

  if (!composedModalRender) {
    return rest;
  }

  return {
    ...rest,
    modalRender: composedModalRender,
  };
}
