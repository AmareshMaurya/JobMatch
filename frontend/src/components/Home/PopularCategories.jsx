import React from "react";
import {
  MdOutlineDesignServices,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { BsShop } from "react-icons/bs";
import { GiArtificialIntelligence } from "react-icons/gi";
import { FaChalkboardUser } from "react-icons/fa6";
import { FaTruckMoving } from "react-icons/fa";
const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Worker Jobs",
      subTitle: "305 Open Positions",
      icon: <MdOutlineDesignServices />,
    },
    {
      id: 2,
      title: "Receptionist/Front Desk",
      subTitle: "50 Open Positions",
      icon: <TbAppsFilled />,
    },
    {
      id: 3,
      title: "Driver Jobs",
      subTitle: "200 Open Positions",
      icon: <FaTruckMoving />,
    },
    {
      id: 4,
      title: "Shop Assistance",
      subTitle: "1000+ Open Postions",
      icon: <BsShop />,
    },
    {
      id: 5,
      title: "Security Staff",
      subTitle: "150 Open Positions",
      icon: <MdAccountBalance />,
    },
    {
      id: 6,
      title: "Data Entry Operator",
      subTitle: "867 Open Positions",
      icon: <GiArtificialIntelligence />,
    },
    {
      id: 7,
      title: "Cashier",
      subTitle: "50 Open Positions",
      icon: <MdOutlineAnimation />,
    },
    {
      id: 8,
      title: "Customer Support Representative",
      subTitle: "80 Open Positions",
      icon: <FaChalkboardUser />,
    },
  ];
  return (
    <div className="categories">
      <h3>POPULAR CATEGORIES</h3>
      <div className="banner">
        {categories.map((element) => {
          return (
            <div className="card" key={element.id} >
              <div className="icon">{element.icon}</div>
              <div className="text">
                <p>{element.title}</p>
                <p>{element.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
