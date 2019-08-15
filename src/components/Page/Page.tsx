import React from 'react';

import {classNames} from '../../utilities/css';
import {
  withAppProvider,
  WithAppProviderProps,
} from '../../utilities/with-app-provider';

import {Header, HeaderProps} from './components';
import styles from './Page.scss';

export interface Props extends HeaderProps {
  /** The contents of the page */
  children?: React.ReactNode;
  /** Remove the normal max-width on the page */
  fullWidth?: boolean;
  /** Decreases the maximum layout width. Intended for single-column layouts */
  narrowWidth?: boolean;
}

export interface DeprecatedProps {
  /** Decreases the maximum layout width. Intended for single-column layouts
   * @deprecated As of release 4.0, replaced by {@link https://polaris.shopify.com/components/structure/page#props-narrow-width}
   */
  singleColumn?: boolean;
}

export type ComposedProps = Props & DeprecatedProps & WithAppProviderProps;

class Page extends React.PureComponent<ComposedProps, never> {
  render() {
    const {
      children,
      fullWidth,
      narrowWidth,
      singleColumn,
      ...rest
    } = this.props;

    if (singleColumn) {
      // eslint-disable-next-line no-console
      console.warn(
        'Deprecation: The singleColumn prop has been renamed to narrowWidth to better represents its use and will be removed in v5.0.',
      );
    }

    const className = classNames(
      styles.Page,
      fullWidth && styles.fullWidth,
      (narrowWidth || singleColumn) && styles.narrowWidth,
    );

    const headerMarkup =
      this.hasHeaderContent() === false ? null : <Header {...rest} />;

    return (
      <div className={className}>
        {headerMarkup}
        <div className={styles.Content}>{children}</div>
      </div>
    );
  }

  private hasHeaderContent(): boolean {
    const {
      title,
      primaryAction,
      secondaryActions,
      actionGroups,
      breadcrumbs,
    } = this.props;

    return (
      (title != null && title !== '') ||
      primaryAction != null ||
      (secondaryActions != null && secondaryActions.length > 0) ||
      (actionGroups != null && actionGroups.length > 0) ||
      (breadcrumbs != null && breadcrumbs.length > 0)
    );
  }
}

export default withAppProvider<Props & DeprecatedProps>()(Page);
