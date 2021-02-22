const Header = () => {
  return (
    <nav className='nav-wrapper indigo'>
      <div className='container'>
        <a href='#' className='brand-logo'>COVID-19 DASHBOARD</a>
        <ul id='nav-mobile' className='right hide-on-small-only'>
          <li><a href='#'>World Map</a></li>
          <li><a href='#'>Trends</a></li>
          <li><a href='#'>Countries</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;