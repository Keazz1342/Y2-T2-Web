import React, { useState, useEffect } from "react";

function Time() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <h2>{now.toLocaleString()}</h2>;
}

export default Time;