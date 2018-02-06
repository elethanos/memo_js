function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//                    "memo"
function Carte(url,id_div_memo)
{
	// Attribut
	this.url = url; // "zidane.png"
	this.definitivement_retourne = false;
	this.tmp_retourne = false;
	// Gérer le html
	this.div_carte = document.createElement("div");
	this.balise_image = document.createElement("img");
	this.balise_image.src ="images_memo/verso.jpg";
	this.div_carte.appendChild(this.balise_image);
    this.id_div_memo = id_div_memo; // this.id_div_memo = "memo"
	document.getElementById(this.id_div_memo).appendChild(this.div_carte);

	this.est_retourne = function()
	{
		/*
		if( (! this.tmp_retourne) && (! this.definitivement_retourne))
		{
			return false
		}
		else
		{
			return true 
		} */
		return (this.tmp_retourne || this.definitivement_retourne);
	};
	this.est_retourne_definitivement = function()
	{
		return (this.definitivement_retourne);
	}
	this.mettre_a_jour_image = function()
	{
		if(this.est_retourne())
		{
			this.balise_image.src = this.url;
		}
		else
		{
			this.balise_image.src = "images_memo/verso.jpg";
		}
	}
	this.retourne_temporairement = function()
	{
		this.tmp_retourne = true;
		this.mettre_a_jour_image();
	};
	this.retourne_definitivement = function()
	{
		this.definitivement_retourne = true;
		this.mettre_a_jour_image();
	};
	this.cache_carte = function()
	{
		this.definitivement_retourne = false;
		this.tmp_retourne = false;
		this.mettre_a_jour_image();
	};
}



function Memo(id_div, tableau_images, nb_colonnes) 
{
	// Attributs
	this.id_div = id_div; // this.id_div = "memo"
	this.tableau_images = tableau_images;
	this.nb_colonnes = nb_colonnes;
	// Mémoriser elements
	this.cartes = [];
	this.derniere_carte_retournee = null;
	// Lock
	this.lock = false;
	// Méthodes
	this.test_victoire = function()
	{
		// Teste si toutes les cartes sont retournées
		// 1 0 0 1 1
		var f=0;
		for(var i=0; i<this.cartes.length; i++)
		{
			var carte_actuelle = this.cartes[i];

			if(carte_actuelle.est_retourne_definitivement())
			{
				f++;
			}
		}
		if(f==this.cartes.length)
		{
			alert("Bravo tu as gagne");
		}	
	};
	this.creer_memo = function()
	{
		// On commence par mélanger les cartes 
		var elements_melanges = this.tableau_images.concat(this.tableau_images.slice());
		elements_melanges = shuffle(elements_melanges);
		var mondiv = document.getElementById(this.id_div);
		// Afficher les éléments mélangés
		var i =0;
		for(i=0; i<elements_melanges.length; i++)
		{
			var carte_actuelle = new Carte(elements_melanges[i], this.id_div);
			this.cartes.push(carte_actuelle);
			var mon_createur_de_fonction = function(i,carte,memo) {
				return async function(){
					// Partie intéressante
					// alert("Tu as cliqué sur l'image " + i);
					if(! memo.lock)
					{
						// alert(memo.derniere_carte_retournee);
						memo.lock = true;
						carte.retourne_temporairement();
						if(memo.derniere_carte_retournee != null)
						{
							if(carte.url == memo.derniere_carte_retournee.url)
							{
								carte.retourne_definitivement();
								memo.derniere_carte_retournee.retourne_definitivement();
								memo.derniere_carte_retournee=null;
							}
							else
							{
								// Version 1
								// derniere_carte_retournee.cache_carte();
								// derniere_carte_retournee=carte;
								// Version 2
								await sleep(1000);
								memo.derniere_carte_retournee.cache_carte();
								carte.cache_carte();
								memo.derniere_carte_retournee=null;
							}
						}
						else
						{
							memo.derniere_carte_retournee = carte;
						}
						memo.test_victoire();
						memo.lock = false;
					}
					
				};
			};
			carte_actuelle.div_carte.addEventListener("click", mon_createur_de_fonction(i,carte_actuelle,this), false);
		};

	};

}
var mon_memo = new Memo("memo", ["images_memo/henry.jpg", "images_memo/zizou.jpg"], 4);
mon_memo.creer_memo();

