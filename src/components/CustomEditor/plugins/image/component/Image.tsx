import React from 'react';
import cx from 'classnames';
import styles from './styles.scss';

const Image = React.forwardRef(({
  contentState,
  blockProps,
  className,
  style,
  onClick,
  onMouseMove,
  onMouseDown,
  onMouseLeave,
}: any,
ref: any) => {
  const { entityKey } = blockProps;
  const data = contentState.getEntity(entityKey).getData();
  return (
    <div
      ref={ref}
      className={cx(styles.imageContainer, className)}
      style={{ ...style }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
    >
      <img className={cx(styles.image)} src={data.path} alt={data.name} />
    </div>
  );
});

export default Image;
