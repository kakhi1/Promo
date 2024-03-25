import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start p-8">
      <p className="mb-4">
        Promo პირველი უფასო ფასდაკლების აგრეგატორი საქართველოში
      </p>
      <p className="mb-4">
        Promo არის ონლაინ პლატფორმა სადაც საქართველოში არსებულ ბიზნესებს(ონლან
        ბიზნესებსაც) შეეძლებათ შეთავაზებების განცხადება მომხმარებლებისთვის
        უფასოდ.
      </p>
      <ul className="list-disc mb-4 pl-4">
        <li>უფასო</li>
        <li>დიდი არჩევანი</li>
        <li>მომხმარებელზე მორგებული შემოთავაზებები</li>
        <li>პოპულარული და სანდო ბრენდები</li>
      </ul>
    </div>
  );
}

export default About;
