import React from 'react';
import Button from '../Button';
import './Nav.css';

const Nav = () => (
  <div className="Nav">
    <Button className="Nav__button" link={true} path="/" type="transparent">Home</Button>
    <Button className="Nav__button" link={true} path="/survey" type="transparent">Survey</Button>
    <a className="Nav__button" href="http://localhost:8501/">Vision Recognition</a>
  </div>
);

export default Nav;
