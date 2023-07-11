const searchInput = document.getElementById('searchInput');
const resultRange = document.getElementById('resultRange');
const resultCount = document.getElementById('resultCount');
const sortButton = document.getElementById('sortButton');
const filterButton = document.getElementById('filterButton');
const categorySelect = document.getElementById('categorySelect');
const mealList = document.getElementById('mealList');

let sortOrder = 'asc'; // Variable pour suivre l'ordre de tri actuel
let meals = []; // Variable pour stocker les repas

// Fonction pour effectuer une recherche en utilisant l'API
async function searchMeals() {
    const searchTerm = searchInput.value.trim();
    const maxResults = resultRange.value;

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();

    meals = data.meals;

    filterMealsByCategory(); // Appliquer le filtre par catégorie
    sortMeals(); // Trier les repas
    renderMeals(); // Afficher les repas
}

// Filtrer les repas en fonction de la catégorie sélectionnée
function filterMealsByCategory() {
    const selectedCategory = categorySelect.value;

    if (selectedCategory !== '') {
        meals = meals.filter(meal => meal.strCategory === selectedCategory);
    }
}

// Trier les repas par ordre croissant ou décroissant
function sortMeals() {
    meals.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.strMeal.localeCompare(b.strMeal);
        } else {
            return b.strMeal.localeCompare(a.strMeal);
        }
    });

    // Mettre à jour le bouton de tri(ici sa bug un peu)
    sortButton.textContent = sortOrder === 'asc' ? 'Décroissant' : 'Croissant';
}

// Afficher les repas dans la liste
function renderMeals() {
    resultCount.textContent = meals.length;

    mealList.innerHTML = '';
    meals.slice(0, resultRange.value).forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';

        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb;
        mealCard.appendChild(mealImage);

        const mealName = document.createElement('h3');
        mealName.textContent = meal.strMeal;
        mealCard.appendChild(mealName);

        const mealOrigin = document.createElement('p');
        mealOrigin.textContent = meal.strArea;
        mealCard.appendChild(mealOrigin);

        const mealRecipe = document.createElement('p');
        mealRecipe.textContent = meal.strInstructions; // Afficher la recette complète
        mealRecipe.className = 'recipe';
        mealCard.appendChild(mealRecipe);

        if (meal.strInstructions.length > 4) {
            const recipeExpandLink = document.createElement('a');
            recipeExpandLink.textContent = 'Afficher plus';
            recipeExpandLink.className = 'recipe-expand-link';
            mealCard.appendChild(recipeExpandLink);
        }

        mealList.appendChild(mealCard);
    });

    // Gérer l'affichage de la recette complète lorsque le lien est cliqué
    const recipeExpandLinks = document.getElementsByClassName('recipe-expand-link');
    Array.from(recipeExpandLinks).forEach(link => {
        const recipe = link.previousSibling;
        recipe.classList.add('recipe-expand');
        link.addEventListener('click', () => {
            recipe.classList.toggle('recipe-expand');
            if (recipe.classList.contains('recipe-expand')) {
                link.textContent = 'Afficher moins';
            } else {
                link.textContent = 'Afficher plus';
            }
        });
    });
}

// Gérer les événements de recherche// 
searchInput.addEventListener('input', searchMeals);
resultRange.addEventListener('input', renderMeals);
sortButton.addEventListener('click', () => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    sortMeals();
    renderMeals();
});
filterButton.addEventListener('click', () => {
    filterMealsByCategory();
    renderMeals();
});

// Appeler la fonction pour obtenir les catégories de repas au chargement de la page
async function getMealCategories() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    const data = await response.json();
    const categories = data.categories;

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.strCategory;
        option.textContent = category.strCategory;
        categorySelect.appendChild(option);
    });
}

// Effectuer une première recherche au chargement de la page
getMealCategories();
searchMeals();
