import {Heading} from "@chakra-ui/react";
import React from "react";

const Header = ({ title }) => {

  return (
    <section className="jumbotron breadcumb no-bg tint">
      <div className="mainbreadcumb">
        <div className="container">
          <div className="row m-10-hor">
            <div className="col-12">
              <Heading as="h1" size="2xl" className="text-center">{title}</Heading>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header;