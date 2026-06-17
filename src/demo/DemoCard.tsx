import { type ReactNode } from 'react';

export function DemoCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="demo-card">
      <div className="demo-card-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ControlBar({
  visibleOpen,
  extra,
}: {
  visibleOpen: boolean;
  extra?: ReactNode;
}) {
  return (
    <div className="control-bar">
      <span className={`state-pill ${visibleOpen ? 'open' : 'closed'}`}>
        visible root: {visibleOpen ? 'open' : 'closed'}
      </span>
      {extra}
    </div>
  );
}
