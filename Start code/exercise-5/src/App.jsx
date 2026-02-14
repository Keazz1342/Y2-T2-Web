
import { PEOPLE_DATA } from "./data.js";

function App() {
  return (
    <>
      <header>
        <h1>My Experience</h1>
      </header>
      <div className="cards-view">
        <div className="cards-grid">
          {PEOPLE_DATA.map((person) => (
            <Card
              key={person.id}
              name={person.name}
              subtitle={person.subtitle}
              description={person.description}
              image={person.image}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function Card({ name, subtitle, description, image }) {
  return (
    <div className="card">
      <img src={image} alt={name} className="card-image" />
      <h2>{name}</h2>
      <p className="subtitle">{subtitle}</p>
      <p className="description">{description}</p>
    </div>
  );  
}

export default App;