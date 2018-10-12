export const dataEng = {
  data: {
    appTitle: 'My Recipes',
    menuItems: ['My Recipes', 'Recipes Wall', 'Favourites', 'Categories', 'Shopping List', 'My Account', 'Logout'],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    myRecipes: {
      newRecipe: {
        clearBtn: 'Empty',
        title: 'New Recipe',
        form: {
          title: 'Title',
          story: 'Story',
          ingredients: 'Ingredients',
          longDes: 'Long description',
          difficulty: 'Difficulty',
          prepTime: 'Preparation time (h:m)',
          category: 'Category',
          dose: 'Dose',
          public: 'Public',
          save: 'Save',
          cost: 'Cost'
        },
        placeholder: {
          titlePlaceholder: 'Recipe title...',
          storyPlaceholder: 'Just a few sentences...',
          ingredientsPlaceholder: 'List here...',
          longDesPlaceholder: 'Preparation method...',
          dosePlaceholder: 'Quantity...',
          costPlaceholder: 'Price...'
        },
        categoryItems: ['None', 'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Snacks', 'Appetisers', 'Soups', 'Salads', 'Sides', 'Rice', 'Noodles', 'Pasta', 'Pies', 'Burgers', 'Mince', 'Sausages', 'Chicken', 'Turkey', 'Duck', 'Poultry', 'Pork', 'Lamb', 'Beef', 'Meat', 'Fish', 'Seafood', 'Stir Fry', 'Sauces', 'Vegetarian', 'Desserts', 'Baking', 'Drinks']
      },
      myRecipes: {
        title: 'My Recipes',
        ingredients: 'Ingredients',
        method: 'Method',
        numDose: 'dose',
        hourText: 'hour',
        minuteText: 'minutes',
        modal: {
          title: 'Are you sure?',
          content: 'Are you sure you want to delete the recipe?',
          cancel: 'Cancel',
          do: 'Delete'
        }
      },
      tooltips: {
        privateRecipe: 'Private recipe',
        publicRecipe: 'Public recipe',
        addToFav: 'Add to favourites',
        removeFromFav: 'Remove from favourites',
        deleteRecipe: 'Delete recipe',
        more: 'More',
        numOfRecipes: 'Number of recipes'
      },
      toaster: {
        recipeSaved: 'Recipe saved!',
        recipeRemoved: 'Recipe deleted!',
        warningFillReq: 'Fill the input fields...',
        addedToPublic: 'Your recipe is now public!',
        removedFromPublic: 'Your recipe is no longer public!',
        addedToFav: 'Recipe added to favourites!',
        removedFromFav: 'Recipe removed from favourites!'
      }
    },
    Account: {
      name: 'Name',
      language: 'Language',
      currency: 'Currency',
    },
    ShoppingList: {
      input: 'Product...',
      recentProduct: 'Recent Products',
      deleteAllBtn: 'Delete',
      toaster: {
        inBasket: 'Product is in the basket!',
        notInBasket: 'Product is not in the basket!',
        itemAdded: 'Product added!',
        inputWarning: 'Fill the input field!',
        productDel: 'Product deleted!',
        allItemDeleted: 'All products are deleted!',
        noItemInList: 'No product in your list!'
      },
      modal: {
        title: 'Are you sure?',
        content: 'Are you sure you want to delete all the products from the list?',
        cancel: 'Cancel',
        do: 'Delete'
      }
    }
  }
}