import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = props => {

  const classNames = `button button--${props.size || 'default'} 
                    ${props.inverse === true ? 'button--inverse' : ''}
                    ${props.danger === true ? 'button--danger' : ''} 
                    ${props.clear === true ? 'button--clear' : ''}`

  if (props.href) {
    return (
      <a
        className={classNames}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={classNames}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={classNames}
      type={(!!props.submit && 'submit') || (props.type || 'button')}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
