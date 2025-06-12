import React from "react";
import { FaMicrosoft} from "react-icons/fa";
import { MdOutlineElectricalServices } from "react-icons/md";
import { BiSolidCarMechanic } from "react-icons/bi";
const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Information Technology",
      openPositions: 10,
      icon: <FaMicrosoft />,
    },
    {
      id: 2,
      title: "Mechanical",
      openPositions: 5,
      icon: <BiSolidCarMechanic />,
    },
    {
      id: 3,
      title: "Electrician",
      openPositions: 20,
      icon: <MdOutlineElectricalServices />,
    },
  ];
  return (
    <div className="companies">
      <div className="container">
        <h3>Premium Categories</h3>
        <div className="banner">
          {companies.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="content">
                  <div className="icon">{element.icon}</div>
                  <div className="text">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Open Positions {element.openPositions}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
