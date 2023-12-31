import { useState, useEffect } from "react";
import { RoadmapCard } from "../../components/index.js";
import axios from "../../apis/axios.js";

function Roadmaps() {
  const [roadCards, setRoadCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/roadmap");
        setRoadCards(response.data.data.dataresult);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="w-[1200px]">
      <h2 className="mb-12 text-[48px] font-semibold leading-l tracking-tight">
        Our Roadmaps
      </h2>
      <div className="flex flex-col gap-12">
        {roadCards.map((card, index) => (
          <RoadmapCard
            key={card.roadmap_id}
            id={card.roadmap_id}
            order={index}
            title={card.roadmap_title}
            description={card.roadmap_description}
            img={card.image_path}
          />
        ))}
      </div>
    </section>
  );
}

export default Roadmaps;
