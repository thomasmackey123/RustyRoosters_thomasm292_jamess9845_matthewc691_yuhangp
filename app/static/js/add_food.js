document.addEventListener('click', async (e) => {
  const foodCard = e.target.closest("food-card");

})

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("food-container");

    let food_items = [];

    const addFood = () => {
      const name = document.getElementById("food-name").value.trim();
      food_items.append(name);
    }
})
