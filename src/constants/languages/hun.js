export const dataHun = {
  data: {
    appTitle: 'Receptjeim',
    menuItems: ['Kezdőlap', 'Receptjeim', 'Kedvenceim', 'Bevásárló Listám', 'Kategóriák', 'Profilom', 'Beállítások', 'Kijelentkezés', 'Admin', 'Hibajelentés', 'Impresszum', 'Ismerőseim'],
    months: ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"],
    emptyList: 'A lista üres...',
    Navigation: {
      dropdownValues: ['Profilom', 'Beállítások', 'Kijelentkezés']
    },
    showMore: 'Mutass többet',
    myRecipes: {
      newRecipe: {
        title: 'Új Recept',
        clearBtn: 'Kiürít',
        form: {
          title: 'Cím',
          story: 'Történet',
          ingredients: 'Hozzávalók',
          longDes: 'Hosszabb leírás',
          difficulty: 'Nehézség',
          prepTime: 'Elkészítési idő (ó:p)',
          prepTimeShort: 'Elkészítési idő',
          category: 'Kategória',
          dose: 'Adag',
          public: 'Nyilvános',
          save: 'Mentés',
          cost: 'Költség',
          emptyList: 'A lista üres',
          helpText: ['Miután beírtál egy hozzávalót a beviteli mezőbe, nyomd meg a', 'gombot.'],
        },
        toaster: {
          fillTheInput: 'Töltsd ki a beviteli mezőt...'
        },
        placeholder: {
          titlePlaceholder: 'Recept címe...',
          storyPlaceholder: 'Csak néhány mondatot...',
          ingredientsPlaceholder: 'Add hozzá a hozzávalókat a listához...',
          longDesPlaceholder: 'Elkészítési folyamat...',
          dosePlaceholder: 'Mennyiség...',
          costPlaceholder: 'Ár...'
        },
        categoryItems: ['Egyik sem', 'Előétel', 'Szendvics', 'Leves', 'Saláta', 'Köret', 'Tészta', 'Pite', 'Pizza', 'Burger', 'Csirke', 'Pulyka', 'Kacsa', 'Szárnyas', 'Sertés', 'Bárány', 'Marha', 'Fasírt', 'Hal', 'Tenger_gyümölcsei', 'Szósz', 'Vegetáriánus', 'Különlegesség', 'Desszert', 'Süti', 'Ital', 'Mentes_étel']
      },
      editRecipe: {
        title: 'Szerkesztés',
        saveChanges: 'Mentés',
        saveSuccess: 'Módosítások mentve!',
        newImg: 'Új kép',
        deleteImg: 'Törlés',
        uploadImg: 'Feltöltés',
        cancelImg: 'Mégse',
        modal: {
          title: 'Biztos vagy benne?',
          content: 'Biztosan törölni akarod a képet?',
          cancel: 'Mégse',
          do: 'Törlés'
        }
      },
      myRecipes: {
        title: 'Receptjeim',
        ingredients: 'Hozzávalók',
        method: 'Elkészítési folyamat',
        numDose: 'adag',
        hourText: 'óra',
        minuteText: 'perc',
        recipeImage: 'A végeredmény!',
        modal: {
          title: 'Biztos vagy benne?',
          content: 'Biztosan törölni akarod a receptet?',
          cancel: 'Mégse',
          do: 'Törlés'
        }
      },
      RecipesWall: {
        latestRecipes: 'Legújabb Receptek',
        topRecipes: 'Top Receptek',
      },
      tooltips: {
        privateRecipe: 'Privát recept',
        publicRecipe: 'Nyilvános recept',
        addToFav: 'Hozzáadás a kedvencekhez',
        removeFromFav: 'Törlés a kedvencekből',
        like: 'Tetszik',
        notLike: 'Mégsem tetszik',
        deleteRecipe: 'Törlés',
        editRecipe: 'Szerkesztés',
        openRecipeFullSize: 'Megnyitás',
        downloadRecipe: 'Letöltés',
        printRecipe: 'Nyomtatás',
        more: 'Több',
        less: 'Kevesebb',
        numOfRecipes: 'Receptjeid száma',
        numOfHisRecipes: 'Receptjei száma',
        saveImage: 'Kép mentése',
        recipeDifficulty: ["Könnyű a receptet elkészíteni", "Mérsékelten nehéz a receptet elkészíteni", "Nehéz a receptet elkészíteni"],
        categoryText: 'Kategória',
      },
      toaster: {
        recipeSaved: 'Recept elmentve!',
        recipeRemoved: 'Recept törölve!',
        warningFillReq: 'Töltsd ki a beviteli mezőket...',
        addedToPublic: 'Recepted mostantól nyilvános!',
        removedFromPublic: 'Recepted mostantól privát!',
        addedToFav: 'Recept hozzáadva a kedvencekhez!',
        removedFromFav: 'Recept eltávolítva a kedvencekből!',
        warningSmallerThanOne: 'Nem írhatsz be negatív értéket!',
        fileTooBig: 'A kiválasztott fájl túl nagy!',
        chooseAnImage: 'Egy képet válassz!',
        chooseOnlyOne: 'Csak egy fáljt tölthetsz fel!',
      }
    },
    Account: {
      title: 'Beállítások',
      profileImageUpload: 'Profilkép feltöltése',
      profileImageChange: 'Profilkép módosítása',
      name: 'Név',
      language: 'Alkalmazás nyelve',
      currency: 'Valuta',
      save: 'Mentés',
      noImageText: 'Nincs kép',
      about: 'Mesélj magadról',
      aboutYouPlaceholder: 'Csak néhány mondatot...',
      filteringByLanguage: 'Receptek szűrése nyelv alapján',
      showAllRecipes: 'Mutasd mind',
      addLanguage: 'Nyelv hozzáadás',
      modal: {
        selectOneOrMore: 'Válassz akár többet is',
      },
      toaster: {
        languageAlreadyInList: 'A nyelv már a listában!',
        languageAddedSuccesfully: 'Sikeresen hozzáadtad a nyelvet a listához!',
        userDataSaved: 'A felhasználó adatok sikeresen elmentve!'
      }
    },
    ShoppingList: {
      input: 'Termék...',
      recentProduct: 'Legutóbbi Termékek',
      deleteAllBtn: 'Törlés',
      toaster: {
        inBasket: 'Termék a kosárban!',
        notInBasket: 'A termék nincs a kosárban!',
        inputWarning: 'Töltsd ki a beviteli mezőt...',
        itemAdded: 'Termék hozzáadva!',
        productDel: 'A termék törölve!',
        allItemDeleted: 'Minden termék törölve!',
        noItemInList: 'Nincs termék a listán!'
      },
      modal: {
        title: 'Biztos vagy benne?',
        content: 'Biztosan törölni akarod a listában szereplő összes terméket?',
        cancel: 'Mégse',
        do: 'Törlés'
      }
    },
    Favourites: {
      yourRecipe: 'Az egyik recepted!',
      usersRecipe: " receptje",
      numOfFavRecipes: 'Kedvenc receptjeid száma',
    },
    PasswordResetAndForget: {
      newPassword: 'Új jelszó',
      newPasswordConfirm: 'Új jelszó megerősítése',
      emailPlaceholder: 'Az e-mail címed...',
      newPasswordPlaceholder: 'Új jelszó...',
      newPasswordConfirmPlaceholder: 'Új jelszó megerősítése...',
      resetBtn: 'Jelszó visszaállítása',
    },
    Categories: {
      noPreviewImage: 'Nincs kép',
      tooltip: {
        zeroRecipeInCategory: 'Nincs recept ebben a kategóriában',
        numOfRecipe: 'recept van a kategóriában',
      }
    },
    Admin: {
      usersListTitle: 'Felhasználók Listája',
      bugReports: 'Hibajelentések',
      details: 'Részletek',
      roles: 'Szerepkör',
      language: 'Nyelv',
      close: 'Bezár'
    },
    User: {
      emptyAbout: 'Nincs leírás...'
    },
    BugReport: {
      title: 'Hibajelentés',
      label: 'Jelentsd be a hibát!',
      placeholder: 'Írd le a felfedezésed...',
      btnText: 'Jelentés küldése',
      toaster: {
        bugSaved: 'Hibajelentés sikeresen elkülve!'
      }
    },
    Impressum: {
      title: 'Impresszum'
    },
    Friends: {
      myFriend: ' az ismerősöm',
      openFriend: 'Részletek',
      addToFriends: 'Hozzáadás az ismerősökhöz',
    },
    Comment: {
      comment: 'Hozzászólás írása...',
      commentSectionTitle: 'Hozzászólások',
      toaster: {
        commendSaved: 'A hozzászólásod elmentve!',
        commendRemoved: 'A hozzászólás törölve!'
      }
    }
  }
}

export const suggestionsHun = [
  { label: 'Alma' },
  { label: 'Ananász' },
  { label: 'Avokádó' },
  { label: 'Bab' },
  { label: 'Banán' },
  { label: 'Barack' },
  { label: 'Bor' },
  { label: 'Bors' },
  { label: 'Borsó' },
  { label: 'Brokkoli' },
  { label: 'Citrom' },
  { label: 'Csokoládé' },
  { label: 'Cukor' },
  { label: 'Elem' },
  { label: 'Energiaital' },
  { label: 'Eper' },
  { label: 'Fasírt' },
  { label: 'Felvágott' },
  { label: 'Fogkefe' },
  { label: 'Fogkrém' },
  { label: 'Gabonapehely' },
  { label: 'Gomba' },
  { label: 'Grapefruit' },
  { label: 'Gránátalma' },
  { label: 'Gyümölcsjoghurt' },
  { label: 'Görögdinnye' },
  { label: 'Hagyma' },
  { label: 'Hal' },
  { label: 'Joghurt' },
  { label: 'Kakaós tej' },
  { label: 'Kenyér' },
  { label: 'Kenyérmorzsa' },
  { label: 'Ketchup' },
  { label: 'Kivi' },
  { label: 'Kolbász' },
  { label: 'Konzerv' },
  { label: 'Krémsajt' },
  { label: 'Kukorica' },
  { label: 'Kávé' },
  { label: 'Lekvár' },
  { label: 'Leves' },
  { label: 'Liszt' },
  { label: 'Majonéz' },
  { label: 'Mandarin' },
  { label: 'Mogyoró' },
  { label: 'Mogyoróvaj' },
  { label: 'Mustár' },
  { label: 'Málna' },
  { label: 'Napilap' },
  { label: 'Narancs' },
  { label: 'Padlizsán' },
  { label: 'Paprika' },
  { label: 'Paradicsom' },
  { label: 'Paradicsomszósz' },
  { label: 'Pezsgő' },
  { label: 'Pizza' },
  { label: 'Pálinka' },
  { label: 'Pástétom' },
  { label: 'Retek' },
  { label: 'Rizs' },
  { label: 'Ropi' },
  { label: 'Rágógumi' },
  { label: 'Répa' },
  { label: 'Sajt' },
  { label: 'Saláta' },
  { label: 'Szalámi' },
  { label: 'Szemeteszsák' },
  { label: 'Szájvíz' },
  { label: 'Szörp' },
  { label: 'Szőlő' },
  { label: 'Só' },
  { label: 'Sör' },
  { label: 'Tea' },
  { label: 'Tej' },
  { label: 'Tejföl' },
  { label: 'Tejszín' },
  { label: 'Tisztítószer' },
  { label: 'Tojás' },
  { label: 'Tusfürdő' },
  { label: 'Tészta' },
  { label: 'Tök' },
  { label: 'Uborka' },
  { label: 'Vaj' },
  { label: 'Vodka' },
  { label: 'Víz' },
  { label: 'WC papír' },
  { label: 'Zsemle' },
  { label: 'Zöldbab' },
  { label: 'Zöldség' },
];