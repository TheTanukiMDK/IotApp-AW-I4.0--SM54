import React from 'react'
import '../css/Header.css'

interface HeaderProps {
  title: string;
}

function Header({title}: HeaderProps) {
  return (
    <>
    <header>
    <div className="header-left">
        <div className="header-icon"></div>
        <h1 className="header-title">Cultivos del Sur | {title}</h1>
    </div>
</header>

    </>
  )
}

export default Header