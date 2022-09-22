const Header = ({ title }) => {

  return (
    <section className="jumbotron breadcumb no-bg tint">
      <div className="mainbreadcumb">
        <div className="container">
          <div className="row m-10-hor">
            <div className="col-12">
              <h1 className="text-center">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header;