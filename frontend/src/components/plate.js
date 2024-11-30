import React from "react";

const Plate = ({
  selectedSquare,
  setSelectedSquare,
  components,
  currentStep,
  setCurrentStep,
}) => {
  const styles = {
    plateContainer: {
      width: "400px",
      height: "300px",
      position: "relative",
      border: "2px solid #333",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gap: "2px",
    },
    square: {
      border: "1px solid #ccc",
      backgroundColor: "#f0f0f0",
      transition: "background-color 0.3s",
    },
    squareSelected: { backgroundColor: "#b3e0ff" },
    squareOccupied: { backgroundColor: "#d3d3d3" },
  };

  const isSquareOccupied = (index) =>
    components.some((comp) => {
      if (comp.spaces === 4) {
        const occupiedSquares = comp.position === 0 ? [0, 1, 3, 4] : [1, 2, 4, 5];
        return occupiedSquares.includes(index);
      }
      return comp.position === index;
    });

  const handleSquareClick = (index) => {
    if (currentStep !== "select-square" || isSquareOccupied(index)) return;
    setSelectedSquare(index);
    setCurrentStep("select-category");
  };

  return (
    <div>
      <h2>Plate</h2>
      <div style={styles.plateContainer}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.square,
              ...(selectedSquare === i && styles.squareSelected),
              ...(isSquareOccupied(i) && styles.squareOccupied),
            }}
            onClick={() => handleSquareClick(i)}
          />
        ))}
        {components.map((comp, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              backgroundColor: comp.category === "Protein" ? "#FFF8DC" : "#FFFACD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px solid #DEB887",
              ...(comp.spaces === 4
                ? { width: "66.66%", height: "100%", left: "0", top: "0" }
                : {
                    width: "33.33%",
                    height: "50%",
                    left: `${(comp.position % 3) * 33.33}%`,
                    top: `${Math.floor(comp.position / 3) * 50}%`,
                  }),
            }}
          >
            {comp.item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plate;
